import type { CodingStatsSnapshot, StatSlice } from './types'
import raw from './wakatime.generated.json'

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

/** Measured time for one project, or undefined — never a zero (data-model rule). */
export function trackedTimeFor(wakatimeProject?: string): StatSlice | undefined {
  if (!wakatimeProject) return undefined
  return stats.projects.find((p) => p.name === wakatimeProject)
}
