/**
 * Build-time fetch for WakaTime coding statistics. Writes the committed
 * artifact `src/content/wakatime.generated.json`, consumed by
 * `src/content/stats.ts`. The site never holds the credential and never
 * calls WakaTime from the browser (FR-029, FR-030).
 *
 * The key comes from `WAKATIME_API_KEY` in the build environment (Vercel,
 * GitHub Actions), or — locally only — from `~/.wakatime.cfg`, the config
 * file the WakaTime editor plugins already maintain. Either way it is read
 * from outside the repository and never written to one.
 *
 * Contract: specs/001-terminal-portfolio-rebrand/contracts/wakatime-snapshot.md
 *
 * Every row of the failure contract warns and exits 0 rather than failing the
 * build. The measured figures are left byte-identical on every row — "keep
 * the last known good" never rewrites `capturedAt` or the numbers. What does
 * change on the first failure after a success is `isFallback`, flipped to
 * `true` so the interface can say figures are from the last successful
 * capture instead of implying they are current (FR-034, research D10 of
 * specs/002-portfolio-craft-pass) — the artifact-shape contract already
 * promised this per failure row; only the write path was missing it. A
 * repeated failure is then a true no-op, since the flag is already set. The
 * other exception is a missing artifact (nothing committed yet, as on a
 * fresh checkout before the first successful fetch), where an empty snapshot
 * flagged `isFallback: true` is written so the build still has a file to
 * import.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ARTIFACT = join(root, 'src/content/wakatime.generated.json')
const ENDPOINT = 'https://wakatime.com/api/v1/users/current/stats/all_time'
const TIMEOUT_MS = 15_000
const WAKATIME_CFG = join(homedir(), '.wakatime.cfg')

const EMPTY_FALLBACK = {
  capturedAt: new Date(0).toISOString(),
  range: { start: '1970-01-01', end: '1970-01-01' },
  totalSeconds: 0,
  humanReadableTotal: '0 mins',
  dailyAverageSeconds: 0,
  languages: [],
  editors: [],
  categories: [],
  projects: [],
  isFallback: true,
}

function warn(message) {
  console.warn(`! wakatime: ${message} — keeping the committed artifact`)
  if (!existsSync(ARTIFACT)) {
    console.warn('! wakatime: no committed artifact exists yet — writing an empty fallback')
    writeFileSync(ARTIFACT, `${JSON.stringify(EMPTY_FALLBACK, null, 2)}\n`)
    return
  }
  // capturedAt and every measured figure stay exactly as last written; only
  // the flag changes, and only on the first failure after a success.
  const existing = JSON.parse(readFileSync(ARTIFACT, 'utf8'))
  if (existing.isFallback) return
  writeFileSync(ARTIFACT, `${JSON.stringify({ ...existing, isFallback: true }, null, 2)}\n`)
}

function toSlice(entry) {
  return { name: entry.name, percent: entry.percent, seconds: entry.total_seconds, text: entry.text }
}

function toSlices(list) {
  return Array.isArray(list) ? list.map(toSlice) : []
}

/**
 * Local developer convenience: falls back to the same config file the
 * WakaTime editor plugins and CLI already write (`~/.wakatime.cfg` — same
 * path on Windows and Linux, resolved via the home directory), so a local
 * build does not need the key copied into a shell export or a `.env` file.
 * CI and Vercel never have this file — those still rely on `WAKATIME_API_KEY`
 * as a real build-environment secret (constitution: Secrets & external data).
 */
function readKeyFromWakatimeCfg() {
  if (!existsSync(WAKATIME_CFG)) return undefined
  const text = readFileSync(WAKATIME_CFG, 'utf8')
  const settingsStart = text.search(/^\[settings\]/m)
  if (settingsStart === -1) return undefined
  const afterHeader = settingsStart + text.slice(settingsStart).indexOf('\n') + 1
  const nextSection = text.slice(afterHeader).search(/^\[/m)
  const section = nextSection === -1 ? text.slice(afterHeader) : text.slice(afterHeader, afterHeader + nextSection)
  return section.match(/^api_key\s*=\s*(\S+)/m)?.[1]
}

/** Every field the artifact contract requires must be present and well-typed. */
function isWellFormed(data) {
  return (
    !!data &&
    typeof data.total_seconds === 'number' &&
    typeof data.human_readable_total === 'string' &&
    typeof data.start === 'string' &&
    typeof data.end === 'string' &&
    Array.isArray(data.languages) &&
    Array.isArray(data.editors) &&
    Array.isArray(data.categories)
  )
}

async function main() {
  // Never a VITE_* variable: Vite inlines those into public JavaScript, which
  // would publish the key (research D10, constitution "Secrets & external data").
  const key = process.env.WAKATIME_API_KEY ?? readKeyFromWakatimeCfg()
  if (!key) {
    return warn('WAKATIME_API_KEY is not set and no key was found in ~/.wakatime.cfg')
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  let response
  try {
    response = await fetch(ENDPOINT, {
      headers: { Authorization: `Basic ${Buffer.from(key).toString('base64')}` },
      signal: controller.signal,
    })
  } catch (error) {
    return warn(`request failed (${error instanceof Error ? error.message : String(error)})`)
  } finally {
    clearTimeout(timer)
  }

  if (response.status === 401 || response.status === 403) {
    return warn(`WakaTime rejected the key (${response.status}) — it may have been rotated or revoked`)
  }
  if (response.status === 429) return warn('WakaTime rate-limited this build (429)')
  if (!response.ok) return warn(`WakaTime returned ${response.status}`)

  let payload
  try {
    payload = await response.json()
  } catch {
    return warn('WakaTime response was not valid JSON')
  }

  const data = payload?.data
  if (!isWellFormed(data)) return warn('WakaTime response did not match the expected shape')

  const artifact = {
    capturedAt: new Date().toISOString(),
    range: { start: data.start.slice(0, 10), end: data.end.slice(0, 10) },
    totalSeconds: data.total_seconds,
    humanReadableTotal: data.human_readable_total,
    dailyAverageSeconds: data.daily_average ?? 0,
    languages: toSlices(data.languages),
    editors: toSlices(data.editors),
    categories: toSlices(data.categories),
    // FR-026: the per-project breakdown is only present on the authenticated call.
    projects: toSlices(data.projects),
    isFallback: false,
  }

  writeFileSync(ARTIFACT, `${JSON.stringify(artifact, null, 2)}\n`)
  console.log(
    `ok wakatime: wrote ${artifact.humanReadableTotal}, range ${artifact.range.start} to ${artifact.range.end}`,
  )
}

main().catch((error) => warn(error instanceof Error ? error.message : String(error)))
