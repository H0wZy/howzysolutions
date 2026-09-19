/**
 * Build-time fetch for the GitHub activity section. Writes the committed
 * artifact `src/content/github.generated.json`, consumed by
 * `src/content/contributions.ts`. The site never holds the credential and
 * never calls GitHub from the browser (FR-041).
 *
 * The token comes from `GITHUB_TOKEN` in the build environment only. CI uses
 * the Actions token; locally the owner's token also sees private
 * repositories, which is why scripts/github-activity.mjs filters `isPrivate`
 * out of every name-bearing list and this file asserts it before writing.
 *
 * Five requests, one rate-limit point each: a header (rolling window, time
 * zone, contribution years), then the rolling year and every contribution
 * year, each with one alias per month.
 *
 * Failure contract, unchanged from the calendar-only version (research D11):
 * every failure warns and exits 0 rather than failing the build, and keeps
 * the committed artifact whole. On the first failure after a success only
 * `isFallback` changes, never the measured figures, so a repeated failure is
 * a true no-op. A missing artifact is the one exception: an empty one
 * flagged `isFallback: true` is written so the build still has a file to
 * import, and the page renders no section at all (FR-043).
 *
 * Nothing but counts and dates is logged: CI logs are public.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { assertNoPrivateNames, monthRanges, periodQuery, toPeriod, utcOffsetOf } from './github-activity.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ARTIFACT = join(root, 'src/content/github.generated.json')
const ENDPOINT = 'https://api.github.com/graphql'
const TIMEOUT_MS = 20_000
/** The one account this portfolio is about (src/content/profile.ts). */
const LOGIN = 'H0wZy'

const EMPTY_FALLBACK = {
  capturedAt: new Date(0).toISOString(),
  isFallback: true,
  includesPrivate: false,
  utcOffset: '+00:00',
  years: [],
  periods: {},
}

const write = (artifact) => writeFileSync(ARTIFACT, `${JSON.stringify(artifact, null, 2)}\n`)

function warn(message) {
  console.warn(`! github: ${message} — keeping the committed artifact`)
  if (!existsSync(ARTIFACT)) {
    console.warn('! github: no committed artifact exists yet — writing an empty fallback')
    return write(EMPTY_FALLBACK)
  }
  const existing = JSON.parse(readFileSync(ARTIFACT, 'utf8'))
  if (existing.isFallback) return
  write({ ...existing, isFallback: true })
}

async function graphql(token, query) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  let response
  try {
    // Never a VITE_* variable: Vite inlines those into public JavaScript, which
    // would publish the token (constitution "Secrets & external data").
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'howzysolutions-build',
      },
      body: JSON.stringify({ query, variables: { login: LOGIN } }),
      signal: controller.signal,
    })
  } catch (error) {
    throw new Error(`request failed (${error instanceof Error ? error.message : String(error)})`, {
      cause: error,
    })
  } finally {
    clearTimeout(timer)
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error(`GitHub rejected the token (${response.status}) — it may have been rotated or revoked`)
  }
  if (response.status === 429) throw new Error('GitHub rate-limited this build (429)')
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`)

  const payload = await response.json().catch(() => {
    throw new Error('GitHub response was not valid JSON')
  })
  if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
    throw new Error(`GitHub GraphQL returned errors (${payload.errors.map((e) => e.message).join('; ')})`)
  }
  const user = payload?.data?.user
  if (!user?.period?.contributionCalendar?.weeks) throw new Error('GitHub response did not match the expected shape')
  return user
}

async function main() {
  const token = process.env.GITHUB_TOKEN
  if (!token) return warn('GITHUB_TOKEN is not set')

  const head = (await graphql(token, periodQuery({ months: [] }))).period
  const offset = utcOffsetOf(head.startedAt)
  const days = head.contributionCalendar.weeks.flatMap((w) => w.contributionDays)
  if (days.length === 0) throw new Error('GitHub response had no days')
  const today = days.at(-1).date
  const years = [...head.contributionYears].sort((a, b) => b - a)

  const specs = [
    { key: 'last-year', start: days[0].date, end: today },
    ...years.map((y) => ({
      key: String(y),
      start: `${y}-01-01`,
      end: `${y}-12-31` < today ? `${y}-12-31` : today,
      // The year's own bounds, not `end`: a custom range that stops at today
      // came back misaligned by a day when measured (research, pitfalls).
      bounds: [`${y}-01-01`, `${y}-12-31`],
    })),
  ]

  const privateNames = new Set()
  const periods = {}
  const results = await Promise.all(
    specs.map(async (spec) => {
      const months = monthRanges(spec.start, spec.end)
      const [from, to] = spec.bounds ?? []
      const user = await graphql(token, periodQuery({ from, to, offset, months }))
      return [spec.key, toPeriod(user, { ...spec, offset, months })]
    }),
  )
  for (const [key, result] of results) {
    periods[key] = result.period
    for (const name of result.privateNames) privateNames.add(name)
  }

  const artifact = {
    capturedAt: new Date().toISOString(),
    isFallback: false,
    // GitHub reports restricted counts only when the owner shares them, and
    // then they are already inside every calendar total.
    includesPrivate: Object.values(periods).some((p) => p.types.private > 0),
    utcOffset: offset,
    years,
    periods,
  }
  assertNoPrivateNames(artifact, privateNames)
  write(artifact)

  const rolling = periods['last-year']
  console.log(
    `ok github: wrote ${rolling.total} contributions in the last year, window ${rolling.start} to ${rolling.end}` +
      ` (UTC${offset}), years ${years.join(' ')}, ${privateNames.size} private repositories filtered by name`,
  )
}

main().catch((error) => warn(error instanceof Error ? error.message : String(error)))
