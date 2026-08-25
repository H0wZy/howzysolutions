/**
 * Build-time fetch for the public GitHub contribution calendar. Writes the
 * committed artifact `src/content/github.generated.json`, consumed by
 * `src/content/contributions.ts`. The site never holds the credential and
 * never calls GitHub from the browser (FR-041).
 *
 * The token comes from `GITHUB_TOKEN` in the build environment only. Unlike
 * WakaTime there is no local config-file convenience here, because GitHub
 * has no equivalent of `~/.wakatime.cfg` to read a personal token from.
 *
 * Contract: specs/002-portfolio-craft-pass/contracts/github-contributions.md
 *
 * Mirrors scripts/fetch-wakatime.mjs exactly (research D11): every row of
 * the failure contract warns and exits 0 rather than failing the build, and
 * on the first failure after a success only `isFallback` changes, never the
 * measured figures. A repeated failure is then a true no-op. The other
 * exception is a missing artifact (nothing committed yet), where an empty
 * calendar flagged `isFallback: true` is written so the build still has a
 * file to import, and the page renders no grid at all (FR-043).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ARTIFACT = join(root, 'src/content/github.generated.json')
const ENDPOINT = 'https://api.github.com/graphql'
const TIMEOUT_MS = 15_000
/** The one account this portfolio is about (src/content/profile.ts). */
const LOGIN = 'H0wZy'
/**
 * Whether the account has GitHub's "private contributions" profile setting
 * on. The GraphQL response below has no field that reports this back — it
 * just silently includes or excludes private counts depending on that
 * setting — so it is recorded here by hand rather than guessed from the
 * payload (contract: github-contributions.md).
 */
const INCLUDES_PRIVATE = false

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }
`

const EMPTY_FALLBACK = {
  capturedAt: new Date(0).toISOString(),
  window: { start: '1970-01-01', end: '1970-01-01' },
  totalContributions: 0,
  includesPrivate: false,
  days: [],
  isFallback: true,
}

function warn(message) {
  console.warn(`! github: ${message} — keeping the committed artifact`)
  if (!existsSync(ARTIFACT)) {
    console.warn('! github: no committed artifact exists yet — writing an empty fallback')
    writeFileSync(ARTIFACT, `${JSON.stringify(EMPTY_FALLBACK, null, 2)}\n`)
    return
  }
  // capturedAt and every measured figure stay exactly as last written; only
  // the flag changes, and only on the first failure after a success.
  const existing = JSON.parse(readFileSync(ARTIFACT, 'utf8'))
  if (existing.isFallback) return
  writeFileSync(ARTIFACT, `${JSON.stringify({ ...existing, isFallback: true }, null, 2)}\n`)
}

/** Every field the artifact contract requires must be present and well-typed. */
function isWellFormed(calendar) {
  return (
    !!calendar &&
    typeof calendar.totalContributions === 'number' &&
    Array.isArray(calendar.weeks) &&
    calendar.weeks.every(
      (w) =>
        Array.isArray(w.contributionDays) &&
        w.contributionDays.every(
          (d) => typeof d.date === 'string' && typeof d.contributionCount === 'number',
        ),
    )
  )
}

async function main() {
  // Never a VITE_* variable: Vite inlines those into public JavaScript, which
  // would publish the token (constitution "Secrets & external data").
  const token = process.env.GITHUB_TOKEN
  if (!token) return warn('GITHUB_TOKEN is not set')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  let response
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'howzysolutions-build',
      },
      body: JSON.stringify({ query: QUERY, variables: { login: LOGIN } }),
      signal: controller.signal,
    })
  } catch (error) {
    return warn(`request failed (${error instanceof Error ? error.message : String(error)})`)
  } finally {
    clearTimeout(timer)
  }

  if (response.status === 401 || response.status === 403) {
    return warn(`GitHub rejected the token (${response.status}) — it may have been rotated or revoked`)
  }
  if (response.status === 429) return warn('GitHub rate-limited this build (429)')
  if (!response.ok) return warn(`GitHub returned ${response.status}`)

  let payload
  try {
    payload = await response.json()
  } catch {
    return warn('GitHub response was not valid JSON')
  }

  if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
    return warn(`GitHub GraphQL returned errors (${payload.errors.map((e) => e.message).join('; ')})`)
  }

  const calendar = payload?.data?.user?.contributionsCollection?.contributionCalendar
  if (!isWellFormed(calendar)) return warn('GitHub response did not match the expected shape')

  const days = calendar.weeks.flatMap((w) =>
    w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })),
  )
  if (days.length === 0) return warn('GitHub response had no days')

  const artifact = {
    capturedAt: new Date().toISOString(),
    window: { start: days[0].date, end: days[days.length - 1].date },
    totalContributions: calendar.totalContributions,
    includesPrivate: INCLUDES_PRIVATE,
    days,
    isFallback: false,
  }

  writeFileSync(ARTIFACT, `${JSON.stringify(artifact, null, 2)}\n`)
  console.log(
    `ok github: wrote ${artifact.totalContributions} contributions, window ${artifact.window.start} to ${artifact.window.end}`,
  )
}

main().catch((error) => warn(error instanceof Error ? error.message : String(error)))
