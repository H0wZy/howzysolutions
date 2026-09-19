import type { ActivityMonth, ActivityPeriod, GithubActivity } from './types'
import { LAST_YEAR, daysBetween } from './activity'
// ponytail: every period (the rolling year and each contribution year) ships
// in the entry chunk, about 1 KB gzipped per year. When check-bundle gets
// close, move the non-default years to static files under public/ and fetch
// them same-origin on a chip click. Not a dynamic import(): check-bundle sums
// every .js in dist/assets, lazy chunks included, so that frees nothing.
// Never raise the budget.
import raw from './github.generated.json'

/**
 * Typed view over the build-time artifact written by scripts/fetch-github.mjs.
 * The site never calls GitHub from a browser (FR-041) and never holds a
 * credential.
 */

const EMPTY: GithubActivity = {
  capturedAt: '1970-01-01T00:00:00.000Z',
  isFallback: true,
  includesPrivate: false,
  years: [],
  periods: {},
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const MONTH = /^\d{4}-\d{2}$/
/** A repository name becomes an href: this keeps it on github.com. */
const REPO = /^[\w.-]+\/[\w.-]+$/
/** A colour becomes an inline custom property: this keeps anything else out of it. */
const COLOR = /^(#[0-9a-fA-F]{6})?$/
const TYPES = ['commits', 'pullRequests', 'issues', 'reviews', 'private'] as const

const isCount = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 0
const isDate = (v: unknown): v is string => typeof v === 'string' && ISO_DATE.test(v)
const isRepo = (v: unknown): v is string => typeof v === 'string' && REPO.test(v)
const tuple = (v: unknown, length: number): v is unknown[] => Array.isArray(v) && v.length === length
const listOf = (v: unknown, item: (row: unknown) => boolean) => Array.isArray(v) && v.every(item)
const optionalListOf = (v: unknown, item: (row: unknown) => boolean) => v === undefined || listOf(v, item)

const isRepoCount = (v: unknown) => tuple(v, 2) && isRepo(v[0]) && isCount(v[1])
const isCreated = (v: unknown) =>
  tuple(v, 5) &&
  isRepo(v[0]) &&
  isDate(v[1]) &&
  (v[2] === 0 || v[2] === 1) &&
  typeof v[3] === 'string' &&
  typeof v[4] === 'string' &&
  COLOR.test(v[4])

function isMonth(value: unknown): value is ActivityMonth {
  if (typeof value !== 'object' || value === null) return false
  const m = value as Record<string, unknown>
  return (
    typeof m.month === 'string' &&
    MONTH.test(m.month) &&
    optionalListOf(m.commits, isRepoCount) &&
    optionalListOf(m.created, isCreated) &&
    optionalListOf(m.pullRequests, isRepoCount) &&
    optionalListOf(m.issues, isRepoCount) &&
    optionalListOf(m.reviews, isRepoCount) &&
    (m.private === undefined ||
      (tuple(m.private, 1) && isCount(m.private[0])) ||
      (tuple(m.private, 3) && isCount(m.private[0]) && isDate(m.private[1]) && isDate(m.private[2])))
  )
}

function isPeriod(value: unknown): value is ActivityPeriod {
  if (typeof value !== 'object' || value === null) return false
  const p = value as Partial<ActivityPeriod>
  if (!isDate(p.start) || !isDate(p.end) || !isCount(p.total)) return false
  const counts = p.counts
  if (!Array.isArray(counts) || counts.length !== daysBetween(p.start, p.end) + 1) return false
  if (!counts.every(isCount) || counts.reduce((a, b) => a + b, 0) !== p.total) return false
  const types = p.types
  if (!types || !TYPES.every((key) => isCount(types[key]))) return false
  return listOf(p.contributedTo, isRepo) && listOf(p.months, isMonth)
}

/**
 * All or nothing: one malformed period, month or name invalidates the whole
 * artifact rather than being dropped from it. A partially trusted calendar is
 * worse than none, and with none the page renders no section at all (FR-043).
 */
export function parseActivity(input: unknown): GithubActivity {
  if (typeof input !== 'object' || input === null) return EMPTY
  const d = input as Partial<GithubActivity>
  const periods = d.periods as Record<string, unknown> | undefined
  if (typeof periods !== 'object' || periods === null) return EMPTY
  if (!Array.isArray(d.years) || !d.years.every((y) => Number.isInteger(y))) return EMPTY
  const keys = [LAST_YEAR, ...d.years.map(String)]
  if (!keys.every((key) => isPeriod(periods[key]))) return EMPTY
  return {
    capturedAt: typeof d.capturedAt === 'string' ? d.capturedAt : EMPTY.capturedAt,
    isFallback: d.isFallback === true,
    includesPrivate: d.includesPrivate === true,
    years: d.years,
    periods: Object.fromEntries(keys.map((key) => [key, periods[key] as ActivityPeriod])),
  }
}

export const activity: GithubActivity = parseActivity(raw)

export type ContributionLevel = 0 | 1 | 2 | 3 | 4

/**
 * Intensity step per day, by quartiles of the non-zero days, the way GitHub
 * shades its own calendar. Scaling against the busiest day instead let one
 * 92-contribution day push nearly every other active day into step 1. A zero
 * is always 0 and any positive count is at least 1.
 */
export function contributionLevels(counts: number[]): (count: number) => ContributionLevel {
  const active = counts.filter((c) => c > 0).sort((a, b) => a - b)
  const at = (q: number) => active[Math.floor((active.length - 1) * q)] ?? 0
  const [q1, q2, q3] = [at(0.25), at(0.5), at(0.75)]
  return (count) => {
    if (count <= 0) return 0
    if (count <= q1) return 1
    if (count <= q2) return 2
    if (count <= q3) return 3
    return 4
  }
}
