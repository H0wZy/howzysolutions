import { describe, expect, it } from 'vitest'
import { parseContributions } from '../contributions'

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
