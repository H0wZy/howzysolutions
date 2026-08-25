import type { ContributionCalendar, ContributionDay } from './types'
import raw from './github.generated.json'

/**
 * Typed view over the build-time artifact. The site never calls GitHub from
 * a browser (FR-041) and never holds a credential — see
 * specs/002-portfolio-craft-pass/contracts/github-contributions.md.
 */

const EMPTY: ContributionCalendar = {
  capturedAt: '1970-01-01T00:00:00.000Z',
  window: { start: '1970-01-01', end: '1970-01-01' },
  totalContributions: 0,
  includesPrivate: false,
  days: [],
  isFallback: true,
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function isValidDay(value: unknown): value is ContributionDay {
  if (typeof value !== 'object' || value === null) return false
  const d = value as Partial<ContributionDay>
  return (
    typeof d.date === 'string' &&
    ISO_DATE.test(d.date) &&
    typeof d.count === 'number' &&
    Number.isInteger(d.count) &&
    d.count >= 0
  )
}

/**
 * Validates shape at import. Unlike `parseStats`, one malformed day
 * invalidates the WHOLE artifact rather than being dropped from it: a
 * partially trusted calendar is worse than no calendar, and FR-043 already
 * says the page renders nothing when there is no artifact (data-model.md).
 */
export function parseContributions(input: unknown): ContributionCalendar {
  if (typeof input !== 'object' || input === null) return EMPTY
  const d = input as Partial<ContributionCalendar>
  if (!d.window?.start || !d.window?.end) return EMPTY
  if (
    typeof d.totalContributions !== 'number' ||
    !Number.isInteger(d.totalContributions) ||
    d.totalContributions < 0
  ) {
    return EMPTY
  }
  if (!Array.isArray(d.days) || !d.days.every(isValidDay)) return EMPTY
  return {
    capturedAt: d.capturedAt ?? EMPTY.capturedAt,
    window: d.window,
    totalContributions: d.totalContributions,
    includesPrivate: d.includesPrivate ?? false,
    days: d.days,
    isFallback: d.isFallback ?? false,
  }
}

export const calendar: ContributionCalendar = parseContributions(raw)
