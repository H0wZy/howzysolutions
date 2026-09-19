import { describe, expect, it } from 'vitest'
import { activity, contributionLevels, parseActivity } from '../contributions'
import committed from '../github.generated.json'

/**
 * Gate: FR-043 (a broken or missing artifact renders no section, never a
 * partial or invented one), and the artifact invariants the page relies on:
 * one count per day of the window, days that add up to the source's total,
 * repository names that can only ever link to github.com, and colours that can
 * only ever be a colour.
 */

function period(overrides: Record<string, unknown> = {}) {
  return {
    start: '2026-01-01',
    end: '2026-01-03',
    total: 5,
    counts: [2, 0, 3],
    types: { commits: 4, pullRequests: 1, issues: 0, reviews: 0, private: 0 },
    contributedTo: ['H0wZy/howzysolutions'],
    months: [
      {
        month: '2026-01',
        commits: [['H0wZy/howzysolutions', 4]],
        created: [['H0wZy/howzysolutions', '2026-01-02', 0, 'TypeScript', '#3178c6']],
        pullRequests: [['H0wZy/howzysolutions', 1]],
        private: [3, '2026-01-01', '2026-01-03'],
      },
    ],
    ...overrides,
  }
}

function artifact(overrides: Record<string, unknown> = {}, periodOverrides: Record<string, unknown> = {}) {
  return {
    capturedAt: '2026-09-19T12:00:00.000Z',
    isFallback: false,
    includesPrivate: true,
    utcOffset: '-03:00',
    years: [2026],
    periods: { 'last-year': period(periodOverrides), '2026': period() },
    ...overrides,
  }
}

describe('parseActivity', () => {
  it('degrades undefined, null and garbage input to the empty fallback rather than throwing', () => {
    for (const input of [undefined, null, 42, 'nonsense', [], {}]) {
      expect(() => parseActivity(input)).not.toThrow()
      const result = parseActivity(input)
      expect(result.isFallback).toBe(true)
      expect(result.periods).toEqual({})
    }
  })

  it('accepts a well-formed artifact and keeps only the periods it declares', () => {
    const result = parseActivity({ ...artifact(), periods: { ...artifact().periods, 1999: period() } })
    expect(result.isFallback).toBe(false)
    expect(result.includesPrivate).toBe(true)
    expect(result.years).toEqual([2026])
    expect(Object.keys(result.periods).sort()).toEqual(['2026', 'last-year'])
    expect(result.periods['last-year']).toEqual(period())
  })

  it('invalidates the whole artifact when a declared year has no period', () => {
    expect(parseActivity(artifact({ years: [2026, 2025] })).periods).toEqual({})
  })

  it('invalidates the whole artifact when the counts do not cover the window, day for day', () => {
    expect(parseActivity(artifact({}, { counts: [2, 3], total: 5 })).periods).toEqual({})
  })

  it('invalidates the whole artifact when the days do not add up to the total', () => {
    expect(parseActivity(artifact({}, { total: 6 })).periods).toEqual({})
  })

  it('invalidates the whole artifact on a negative or fractional count', () => {
    expect(parseActivity(artifact({}, { counts: [2, -1, 4] })).periods).toEqual({})
    expect(parseActivity(artifact({}, { counts: [2, 0.5, 2.5] })).periods).toEqual({})
  })

  it('refuses a repository name that could leave github.com as an href', () => {
    for (const name of ['javascript:alert(1)', 'H0wZy', 'a/b/c', 'evil.com/x?y', 'H0wZy/re po']) {
      expect(parseActivity(artifact({}, { contributedTo: [name] })).periods, name).toEqual({})
    }
  })

  it('refuses a language colour that could inject CSS through the inline custom property', () => {
    for (const color of ['red', '#fff', '#3178c6;background:url(x)', 'var(--accent)']) {
      const months = [{ month: '2026-01', created: [['H0wZy/a', '2026-01-02', 0, 'Go', color]] }]
      expect(parseActivity(artifact({}, { months })).periods, color).toEqual({})
    }
    const none = [{ month: '2026-01', created: [['H0wZy/a', '2026-01-02', 1, '', '']] }]
    expect(parseActivity(artifact({}, { months: none })).periods).not.toEqual({})
  })

  it('refuses a malformed month or private range', () => {
    expect(parseActivity(artifact({}, { months: [{ month: '2026-1' }] })).periods).toEqual({})
    expect(
      parseActivity(artifact({}, { months: [{ month: '2026-01', private: [3, 'soon', '2026-01-03'] }] })).periods,
    ).toEqual({})
    expect(
      parseActivity(artifact({}, { months: [{ month: '2026-01', private: [3, '2026-01-01'] }] })).periods,
    ).toEqual({})
  })

  it('accepts a private count GitHub did not date', () => {
    const months = [{ month: '2026-01', private: [3] }]
    expect(parseActivity(artifact({}, { months })).periods).not.toEqual({})
  })
})

describe('the committed artifact', () => {
  it('is a real capture, not the empty fallback', () => {
    expect(activity.periods['last-year']?.total).toBeGreaterThan(0)
    expect(activity.years.length).toBeGreaterThan(0)
  })

  it('parses whole: every declared year survived validation', () => {
    expect(Object.keys(activity.periods).length).toBe(activity.years.length + 1)
    expect(committed.years).toEqual(activity.years)
  })
})

describe('contributionLevels', () => {
  it('keeps a zero at 0 and never shades an active day as empty', () => {
    const level = contributionLevels([0, 0, 1, 5, 9])
    expect(level(0)).toBe(0)
    for (const count of [1, 5, 9]) expect(level(count)).toBeGreaterThan(0)
  })

  it('does not let one outlier flatten every other day into one step', () => {
    const counts = [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 92]
    const level = contributionLevels(counts)
    expect(new Set(counts.filter((c) => c > 0).map(level))).toEqual(new Set([1, 2, 3, 4]))
    expect(level(92)).toBe(4)
  })

  it('handles a year with no activity at all', () => {
    expect(contributionLevels([0, 0, 0])(0)).toBe(0)
    expect(contributionLevels([])(0)).toBe(0)
  })
})
