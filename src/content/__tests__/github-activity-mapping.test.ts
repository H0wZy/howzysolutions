import { describe, expect, it } from 'vitest'
import {
  assertNoPrivateNames,
  localDate,
  monthRanges,
  periodQuery,
  toPeriod,
  utcOffsetOf,
} from '../../../scripts/github-activity.mjs'

/**
 * The privacy rule of scripts/fetch-github.mjs, tested against a fake GraphQL
 * payload rather than trusted: the owner's token can list private
 * repositories, and their names must never reach the committed artifact,
 * which ships in the page. Their contributions survive only as counts.
 */

const SECRET = 'H0wZy/secret-client-work'
const repo = (nameWithOwner: string, isPrivate = false, language: [string, string] | null = null) => ({
  nameWithOwner,
  isPrivate,
  isFork: false,
  primaryLanguage: language ? { name: language[0], color: language[1] } : null,
})
const byRepo = (nameWithOwner: string, totalCount: number, isPrivate = false) => ({
  repository: repo(nameWithOwner, isPrivate),
  contributions: { totalCount },
})

const PRIVATE_IN_EVERY_LIST = {
  restrictedContributionsCount: 10,
  earliestRestrictedContributionDate: '2026-09-01',
  latestRestrictedContributionDate: '2026-09-02',
  commitContributionsByRepository: [byRepo('H0wZy/howzysolutions', 3), byRepo(SECRET, 7, true)],
  repositoryContributions: {
    nodes: [
      { occurredAt: '2026-09-03T01:50:00Z', repository: repo('H0wZy/new-thing', false, ['Go', '#00ADD8']) },
      { occurredAt: '2026-09-03T12:00:00Z', repository: repo(SECRET, true) },
    ],
  },
  pullRequestContributionsByRepository: [byRepo(SECRET, 2, true)],
  issueContributionsByRepository: [byRepo(SECRET, 1, true), byRepo('H0wZy/howzysolutions', 1)],
  pullRequestReviewContributionsByRepository: [byRepo(SECRET, 4, true)],
}

const window = { start: '2026-09-01', end: '2026-09-03', offset: '-03:00', months: monthRanges('2026-09-01', '2026-09-03') }

function payload(month: object = PRIVATE_IN_EVERY_LIST, counts = [10, 12, 6]) {
  return {
    period: {
      contributionCalendar: {
        totalContributions: counts.reduce((a, b) => a + b, 0),
        weeks: [
          {
            contributionDays: [
              { date: '2026-08-31', contributionCount: 99 },
              ...counts.map((contributionCount, i) => ({ date: `2026-09-0${i + 1}`, contributionCount })),
            ],
          },
        ],
      },
    },
    m2026_09: month,
  }
}

describe('toPeriod', () => {
  const { period, privateNames } = toPeriod(payload(), window)
  const text = JSON.stringify(period)

  it('never writes a private repository name anywhere in the period', () => {
    expect(text).not.toContain('secret-client-work')
    expect(privateNames.has(SECRET)).toBe(true)
  })

  it('folds every private contribution into the month’s private count', () => {
    // 10 restricted + 7 commits + 1 created + 2 PRs + 1 issue + 4 reviews. The
    // restricted dates cover only the 10, so no range is claimed for the 25.
    expect(period.months[0].private).toEqual([25])
    expect(period.types.private).toBe(25)
  })

  it('dates private work only when GitHub measured all of it', () => {
    const restricted = { restrictedContributionsCount: 10 }
    const dated = { ...restricted, earliestRestrictedContributionDate: '2026-09-02', latestRestrictedContributionDate: '2026-09-02' }
    expect(toPeriod(payload(dated), window).period.months[0].private).toEqual([10, '2026-09-02', '2026-09-02'])
    // Seen live: a count with both dates null. The month is not a stand-in.
    const undated = { ...restricted, earliestRestrictedContributionDate: null, latestRestrictedContributionDate: null }
    expect(toPeriod(payload(undated), window).period.months[0].private).toEqual([10])
  })

  it('keeps the public work, by name, with its counts', () => {
    expect(period.months[0].commits).toEqual([['H0wZy/howzysolutions', 3]])
    expect(period.months[0].issues).toEqual([['H0wZy/howzysolutions', 1]])
    expect(period.months[0].pullRequests).toBeUndefined()
    expect(period.contributedTo).toEqual(['H0wZy/howzysolutions'])
    expect(period.types).toMatchObject({ commits: 3, pullRequests: 0, issues: 1, reviews: 0 })
  })

  it('dates a created repository in the viewer’s time zone, not UTC', () => {
    // 01:50 UTC on the 3rd is still the 2nd in Brazil.
    expect(period.months[0].created).toEqual([['H0wZy/new-thing', '2026-09-02', 0, 'Go', '#00ADD8']])
  })

  it('trims the calendar to the window and keeps the source total', () => {
    expect(period.counts).toEqual([10, 12, 6])
    expect(period.total).toBe(28)
  })

  it('refuses a calendar whose days do not add up to its own total', () => {
    const broken = payload()
    broken.period.contributionCalendar.totalContributions += 1
    expect(() => toPeriod(broken, window)).toThrow(/add up/)
  })

  it('refuses a calendar with a missing day', () => {
    const broken = payload()
    broken.period.contributionCalendar.weeks[0].contributionDays.splice(2, 1)
    expect(() => toPeriod(broken, window)).toThrow(/gap/)
  })
})

describe('assertNoPrivateNames', () => {
  it('passes a clean artifact and stops one that carries a private name', () => {
    const { period, privateNames } = toPeriod(payload(), window)
    expect(() => assertNoPrivateNames({ periods: { 'last-year': period } }, privateNames)).not.toThrow()
    const leaked = { ...period, contributedTo: [...period.contributedTo, SECRET] }
    expect(() => assertNoPrivateNames({ periods: { 'last-year': leaked } }, privateNames)).toThrow(/private/)
  })
})

describe('query helpers', () => {
  it('derives the viewer’s offset from where GitHub puts local midnight', () => {
    expect(utcOffsetOf('2025-09-14T03:00:00Z')).toBe('-03:00')
    expect(utcOffsetOf('2025-09-14T00:00:00Z')).toBe('+00:00')
    expect(utcOffsetOf('2025-09-13T22:00:00Z')).toBe('+02:00')
    expect(localDate('2025-10-28T01:50:00Z', '-03:00')).toBe('2025-10-27')
  })

  it('clips months to the window', () => {
    expect(monthRanges('2025-09-14', '2025-11-02')).toEqual([
      { month: '2025-09', from: '2025-09-14', to: '2025-09-30' },
      { month: '2025-10', from: '2025-10-01', to: '2025-10-31' },
      { month: '2025-11', from: '2025-11-01', to: '2025-11-02' },
    ])
    expect(monthRanges('2025-12-20', '2026-01-05').map((m) => m.month)).toEqual(['2025-12', '2026-01'])
  })

  it('declares fragments only when a month alias spreads them', () => {
    expect(periodQuery({ months: [] })).not.toContain('fragment')
    const query = periodQuery({ from: '2026-01-01', to: '2026-12-31', offset: '-03:00', months: monthRanges('2026-01-01', '2026-01-31') })
    expect(query).toContain('m2026_01: contributionsCollection(from: "2026-01-01T00:00:00-03:00", to: "2026-01-31T23:59:59-03:00")')
    expect(query).toContain('fragment Month')
  })
})
