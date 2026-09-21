/**
 * Build-time fetch for H0wZy/mcp project metadata. Writes the committed
 * artifact `src/content/mcp.generated.json`, consumed by
 * `src/content/projects/mcp.ts` and `/mcp` showcase pages.
 *
 * Fetches latest release and commit counts from GitHub API and the latest
 * package release from the npm registry.
 *
 * Failure contract (same as fetch-github.mjs):
 * Every failure warns and keeps the committed artifact whole. If no artifact
 * exists yet, a fallback is written so the build never breaks.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ARTIFACT = join(root, 'src/content/mcp.generated.json')
const TIMEOUT_MS = 10_000

const DEFAULT_FALLBACK = {
  capturedAt: new Date(0).toISOString(),
  isFallback: true,
  version: 'v1.0.4',
  npmVersion: '1.0.4',
  releaseTag: 'v1.0.4',
  commits: 36,
  stars: 1,
  supportedAgents: 3,
  lastCommitDate: '2026-09-21',
}

const write = (artifact) => writeFileSync(ARTIFACT, `${JSON.stringify(artifact, null, 2)}\n`)

function warn(message) {
  console.warn(`! mcp: ${message} — keeping the committed artifact`)
  if (!existsSync(ARTIFACT)) {
    console.warn('! mcp: no committed artifact exists yet — writing fallback')
    return write(DEFAULT_FALLBACK)
  }
  const existing = JSON.parse(readFileSync(ARTIFACT, 'utf8'))
  if (existing.isFallback) return
  write({ ...existing, isFallback: true })
}

async function fetchWithTimeout(url, headers = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'howzysolutions-build',
        ...headers,
      },
      signal: controller.signal,
    })
    return res
  } finally {
    clearTimeout(timer)
  }
}

async function main() {
  const token = process.env.GITHUB_TOKEN
  const ghHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  let npmVersion = '1.0.4'
  try {
    const npmRes = await fetchWithTimeout('https://registry.npmjs.org/@h0wzy/mcp/latest')
    if (npmRes.ok) {
      const npmData = await npmRes.json()
      if (npmData?.version) npmVersion = npmData.version
    }
  } catch (err) {
    console.warn(`! mcp npm fetch failed (${err instanceof Error ? err.message : String(err)})`)
  }

  let stars = 1
  let releaseTag = `v${npmVersion}`
  let commits = 36
  let lastCommitDate = '2026-09-21'

  try {
    const repoRes = await fetchWithTimeout('https://api.github.com/repos/H0wZy/mcp', ghHeaders)
    if (repoRes.ok) {
      const repoData = await repoRes.json()
      if (typeof repoData?.stargazers_count === 'number') stars = repoData.stargazers_count
    }

    const relRes = await fetchWithTimeout('https://api.github.com/repos/H0wZy/mcp/releases/latest', ghHeaders)
    if (relRes.ok) {
      const relData = await relRes.json()
      if (relData?.tag_name) releaseTag = relData.tag_name
    }

    const commitRes = await fetchWithTimeout('https://api.github.com/repos/H0wZy/mcp/commits?per_page=1', ghHeaders)
    if (commitRes.ok) {
      const link = commitRes.headers.get('link') || ''
      const match = link.match(/page=(\d+)>; rel="last"/)
      if (match) commits = parseInt(match[1], 10)

      const commitData = await commitRes.json()
      if (Array.isArray(commitData) && commitData[0]?.commit?.committer?.date) {
        lastCommitDate = commitData[0].commit.committer.date.slice(0, 10)
      }
    }
  } catch (err) {
    console.warn(`! mcp github fetch failed (${err instanceof Error ? err.message : String(err)})`)
  }

  const cleanVersion = releaseTag.startsWith('v') ? releaseTag : `v${releaseTag}`

  const artifact = {
    version: cleanVersion,
    commits,
    stars,
    supportedAgents: 3,
    lastCommitDate,
  }

  write(artifact)
  console.log(`ok mcp: wrote version ${cleanVersion}, ${commits} commits, ${stars} stars (npm: ${npmVersion})`)
}

main().catch((error) => warn(error instanceof Error ? error.message : String(error)))
