import type { StringKey } from './i18n/en'
import type { CodingStatsSnapshot, StatSlice } from './types'
import raw from './wakatime.generated.json'

/**
 * The account these figures were measured on. FR-027 says a figure never
 * appears without its source; naming a source a visitor can open is that rule
 * kept honestly, since the generated snapshot in this repo is otherwise the
 * only thing to take on trust.
 *
 * The product name is not a translated string — it is identical in both
 * dictionaries, which is the reason it does not live in either. The
 * translatable half is `stats.sourceLabel`, and only that half.
 */
export const WAKATIME = {
  name: 'WakaTime',
  profileUrl: 'https://wakatime.com/@4d2dcfae-71d8-4031-a960-db6cd1b3d46d',
} as const

/**
 * Typed view over the build-time artifact. The site never calls WakaTime from a
 * browser (FR-029) and never holds a credential (FR-030) — see
 * specs/001-terminal-portfolio-rebrand/contracts/wakatime-snapshot.md.
 */

const EMPTY: CodingStatsSnapshot = {
  capturedAt: '1970-01-01T00:00:00.000Z',
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

function slices(value: unknown): StatSlice[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (s): s is StatSlice =>
      typeof s === 'object' &&
      s !== null &&
      typeof (s as StatSlice).name === 'string' &&
      typeof (s as StatSlice).percent === 'number' &&
      typeof (s as StatSlice).text === 'string',
  )
}

/**
 * Validates shape at import. A malformed artifact degrades to an empty snapshot
 * flagged as a fallback rather than throwing — a broken third-party payload must
 * never take the page down with it (FR-031).
 */
export function parseStats(input: unknown): CodingStatsSnapshot {
  if (typeof input !== 'object' || input === null) return EMPTY
  const d = input as Partial<CodingStatsSnapshot>
  if (!d.range?.start || !d.range?.end || typeof d.totalSeconds !== 'number') return EMPTY
  return {
    capturedAt: d.capturedAt ?? EMPTY.capturedAt,
    range: d.range,
    totalSeconds: d.totalSeconds,
    humanReadableTotal: d.humanReadableTotal ?? EMPTY.humanReadableTotal,
    dailyAverageSeconds: d.dailyAverageSeconds ?? 0,
    languages: slices(d.languages),
    editors: slices(d.editors),
    categories: slices(d.categories),
    projects: slices(d.projects),
    isFallback: d.isFallback ?? false,
  }
}

export const stats: CodingStatsSnapshot = parseStats(raw)

/** WakaTime's own wording: "125 hrs 19 mins". */
function humanize(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  return hours > 0 ? `${hours} hrs ${mins} mins` : `${mins} mins`
}

/**
 * Measured time for one project, or undefined — never a zero (data-model rule).
 * A project tracked under several names (a rename) is the sum of the ones the
 * snapshot has; a name the snapshot lacks adds nothing rather than a zero.
 */
export function trackedTimeFor(wakatimeProject?: string | string[]): StatSlice | undefined {
  const names = [wakatimeProject ?? []].flat()
  const found = names.flatMap((name) => stats.projects.filter((p) => p.name === name))
  if (found.length <= 1) return found[0]
  const seconds = found.reduce((sum, p) => sum + p.seconds, 0)
  return {
    name: found[0].name,
    percent: found.reduce((sum, p) => sum + p.percent, 0),
    seconds,
    text: humanize(seconds),
  }
}

export type PeriodLabel = {
  key: Extract<StringKey, 'stats.range' | 'stats.rangeStale'>
  params: Record<string, string>
}

/**
 * Picks the fresh ("to current") or retained ("to {date}") wording from
 * `isFallback`, so the hero one-liner and the activity section can never
 * disagree (FR-034, FR-036, research D10) — both call this instead of
 * branching on the flag themselves.
 */
export function periodLabel(snapshot: CodingStatsSnapshot): PeriodLabel {
  if (snapshot.isFallback) {
    return {
      key: 'stats.rangeStale',
      params: { start: snapshot.range.start, date: snapshot.capturedAt.slice(0, 10) },
    }
  }
  return { key: 'stats.range', params: { start: snapshot.range.start } }
}
