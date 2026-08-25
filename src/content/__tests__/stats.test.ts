import { describe, expect, it } from 'vitest'
import { parseStats, periodLabel, stats, trackedTimeFor } from '../stats'
import { translate } from '../../locale'

/**
 * Gate: FR-031 (the build never crashes on a broken third-party payload) and
 * FR-027 (a rendered figure is never missing its period).
 */
describe('parseStats', () => {
  it('degrades undefined, null and garbage input to the empty fallback rather than throwing', () => {
    for (const input of [undefined, null, 42, 'nonsense', [], {}]) {
      expect(() => parseStats(input)).not.toThrow()
      const result = parseStats(input)
      expect(result.isFallback).toBe(true)
      expect(result.range).toEqual({ start: '1970-01-01', end: '1970-01-01' })
    }
  })

  it('rejects a payload missing totalSeconds or range', () => {
    expect(parseStats({ humanReadableTotal: '1 hr' }).isFallback).toBe(true)
    expect(parseStats({ totalSeconds: 60, range: { start: '2026-01-01' } }).isFallback).toBe(true)
  })

  it('drops malformed entries out of a slice array instead of throwing', () => {
    const result = parseStats({
      totalSeconds: 100,
      range: { start: '2026-01-01', end: '2026-01-02' },
      languages: [{ name: 'TypeScript', percent: 50, text: '1 hr' }, { garbage: true }, null, 'nope'],
    })
    expect(result.languages).toEqual([{ name: 'TypeScript', percent: 50, text: '1 hr' }])
  })

  it('accepts a well-formed payload and preserves every field', () => {
    const result = parseStats({
      capturedAt: '2026-08-19T23:10:04.000Z',
      range: { start: '2026-03-17', end: '2026-08-19' },
      totalSeconds: 439399.144,
      humanReadableTotal: '122 hrs 3 mins',
      dailyAverageSeconds: 8291,
      languages: [{ name: 'TypeScript', percent: 18.61, seconds: 87600, text: '24 hrs 20 mins' }],
      isFallback: false,
    })
    expect(result.isFallback).toBe(false)
    expect(result.range).toEqual({ start: '2026-03-17', end: '2026-08-19' })
    expect(result.totalSeconds).toBe(439399.144)
  })
})

describe('the committed artifact', () => {
  it('carries a range for the real snapshot exposed to the site', () => {
    expect(stats.range.start).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(stats.range.end).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('is not the empty fallback (a real baseline is committed)', () => {
    expect(stats.isFallback).toBe(false)
    expect(stats.totalSeconds).toBeGreaterThan(0)
  })
})

describe('trackedTimeFor', () => {
  it('returns undefined rather than a zero when a project has no measured time', () => {
    expect(trackedTimeFor(undefined)).toBeUndefined()
    expect(trackedTimeFor('a-project-that-does-not-exist')).toBeUndefined()
  })

  it('finds the slice for a project that does have measured time', () => {
    const [first] = stats.projects
    if (!first) return // no projects in the committed artifact — nothing to assert
    expect(trackedTimeFor(first.name)).toEqual(first)
  })
})

/**
 * Gate: FR-034 (a retained snapshot never claims to be current) and FR-036
 * (the hero one-liner and the activity section agree on the same wording).
 */
describe('periodLabel', () => {
  const fresh = parseStats({
    capturedAt: '2026-08-19T23:10:04.000Z',
    range: { start: '2026-03-17', end: '2026-08-19' },
    totalSeconds: 439399,
    isFallback: false,
  })
  const retained = parseStats({
    capturedAt: '2026-08-10T08:00:00.000Z',
    range: { start: '2026-03-17', end: '2026-08-09' },
    totalSeconds: 400000,
    isFallback: true,
  })

  it('picks the ongoing key for a fresh capture', () => {
    expect(periodLabel(fresh)).toEqual({ key: 'stats.range', params: { start: '2026-03-17' } })
  })

  it('picks the stale key, naming the capture date, for a retained snapshot', () => {
    expect(periodLabel(retained)).toEqual({
      key: 'stats.rangeStale',
      params: { start: '2026-03-17', date: '2026-08-10' },
    })
  })

  for (const locale of ['en', 'pt'] as const) {
    it(`renders the ongoing wording for a fresh capture (${locale})`, () => {
      const { key, params } = periodLabel(fresh)
      const rendered = translate(locale, key, params)
      expect(rendered).toContain('2026-03-17')
      expect(rendered).not.toContain('2026-08-10')
    })

    it(`renders the capture date, not "current", for a retained snapshot (${locale})`, () => {
      const { key, params } = periodLabel(retained)
      const rendered = translate(locale, key, params)
      expect(rendered).toContain('2026-03-17')
      expect(rendered).toContain('2026-08-10')
    })
  }
})
