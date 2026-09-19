import { describe, expect, it } from 'vitest'
import { contributionLevels, parseContributions } from '../contributions'

/**
 * Gate: FR-043 (a broken or missing artifact renders no grid, never a partial
 * or invented one) and data-model.md's ContributionDay/ContributionCalendar
 * invariants (totalContributions is the source's own figure, gaps stay gaps).
 */
describe('parseContributions', () => {
  it('degrades undefined, null and garbage input to the empty fallback rather than throwing', () => {
    for (const input of [undefined, null, 42, 'nonsense', [], {}]) {
      expect(() => parseContributions(input)).not.toThrow()
      const result = parseContributions(input)
      expect(result.isFallback).toBe(true)
      expect(result.days).toEqual([])
    }
  })

  it('accepts a well-formed payload and preserves every field', () => {
    const result = parseContributions({
      capturedAt: '2026-08-24T16:03:22.564Z',
      window: { start: '2025-08-25', end: '2026-08-24' },
      totalContributions: 1593,
      includesPrivate: false,
      days: [
        { date: '2025-08-25', count: 0 },
        { date: '2025-08-26', count: 7 },
      ],
      isFallback: false,
    })
    expect(result).toEqual({
      capturedAt: '2026-08-24T16:03:22.564Z',
      window: { start: '2025-08-25', end: '2026-08-24' },
      totalContributions: 1593,
      includesPrivate: false,
      days: [
        { date: '2025-08-25', count: 0 },
        { date: '2025-08-26', count: 7 },
      ],
      isFallback: false,
    })
  })

  it('rejects a payload missing the window or totalContributions', () => {
    expect(parseContributions({ totalContributions: 5, days: [] }).isFallback).toBe(true)
    expect(
      parseContributions({ window: { start: '2026-01-01', end: '2026-01-02' }, days: [] }).isFallback,
    ).toBe(true)
  })

  it('invalidates the whole artifact on a negative or non-integer day count, rather than dropping the bad day', () => {
    const negative = parseContributions({
      window: { start: '2026-01-01', end: '2026-01-03' },
      totalContributions: 3,
      days: [
        { date: '2026-01-01', count: 3 },
        { date: '2026-01-02', count: -1 },
      ],
    })
    expect(negative.isFallback).toBe(true)
    expect(negative.days).toEqual([])

    const fractional = parseContributions({
      window: { start: '2026-01-01', end: '2026-01-03' },
      totalContributions: 3,
      days: [{ date: '2026-01-01', count: 1.5 }],
    })
    expect(fractional.isFallback).toBe(true)
    expect(fractional.days).toEqual([])
  })

  it('takes totalContributions from the source figure, never recomputed by summing days', () => {
    // The window is clipped relative to what the source actually counted, so the
    // two numbers legitimately disagree (data-model.md, ContributionCalendar rule 2).
    const result = parseContributions({
      window: { start: '2026-01-01', end: '2026-01-02' },
      totalContributions: 1593,
      days: [
        { date: '2026-01-01', count: 3 },
        { date: '2026-01-02', count: 7 },
      ],
    })
    expect(result.totalContributions).toBe(1593)
  })

  it('leaves gaps in days as gaps, never synthesising a zero-count entry for an absent date', () => {
    const result = parseContributions({
      window: { start: '2026-01-01', end: '2026-01-05' },
      totalContributions: 10,
      days: [
        { date: '2026-01-01', count: 3 },
        { date: '2026-01-05', count: 7 },
      ],
    })
    expect(result.days).toEqual([
      { date: '2026-01-01', count: 3 },
      { date: '2026-01-05', count: 7 },
    ])
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
