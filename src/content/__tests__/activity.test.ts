import { describe, expect, it } from 'vitest'
import {
  LAST_YEAR,
  addDays,
  columnsFor,
  countText,
  daySentence,
  headingText,
  joinList,
  monthLabels,
  monthTitle,
  nextIndex,
  ordinal,
  shortDate,
  typeMix,
  weekdayLabels,
} from '../activity'
import { pageOf } from '../types'

describe('ordinal', () => {
  it('suffixes English days the way GitHub writes them', () => {
    const cases: Array<[number, string]> = [
      [1, '1st'], [2, '2nd'], [3, '3rd'], [4, '4th'], [11, '11th'], [12, '12th'],
      [13, '13th'], [21, '21st'], [22, '22nd'], [23, '23rd'], [31, '31st'],
    ]
    for (const [n, expected] of cases) expect(ordinal(n)).toBe(expected)
  })
})

describe('daySentence', () => {
  it('reads like GitHub in English, zero, one and many', () => {
    expect(daySentence('en', '2026-07-15', 0)).toBe('No contributions on July 15th.')
    expect(daySentence('en', '2026-07-15', 1)).toBe('1 contribution on July 15th.')
    expect(daySentence('en', '2026-07-15', 49)).toBe('49 contributions on July 15th.')
  })

  it('reads naturally in Portuguese, where zero is plural and never "0 contribuição"', () => {
    expect(daySentence('pt', '2026-07-15', 0)).toBe('Nenhuma contribuição em 15 de julho.')
    expect(daySentence('pt', '2026-07-15', 1)).toBe('1 contribuição em 15 de julho.')
    expect(daySentence('pt', '2026-07-15', 49)).toBe('49 contribuições em 15 de julho.')
    expect(countText('pt', 0, 'contribution')).toBe('0 contribuições')
  })

  it('names the day of the artifact, not the day in the reader’s time zone', () => {
    // Formatting in UTC is what keeps 2026-01-01 from printing as December 31st
    // in a browser west of Greenwich, and so what keeps hydration consistent.
    expect(daySentence('en', '2026-01-01', 2)).toBe('2 contributions on January 1st.')
  })

  it('adds the year for screen readers, where a rolling year repeats dates', () => {
    expect(daySentence('en', '2025-09-19', 0, true)).toBe('No contributions on September 19th, 2025.')
    expect(daySentence('pt', '2026-09-19', 39, true)).toBe('39 contribuições em 19 de setembro de 2026.')
  })
})

describe('headings', () => {
  it('formats the total for the locale', () => {
    expect(headingText('en', LAST_YEAR, 1818)).toBe('1,818 contributions in the last year')
    expect(headingText('en', '2026', 1368)).toBe('1,368 contributions in 2026')
    expect(headingText('pt', LAST_YEAR, 1818)).toBe('1.818 contribuições no último ano')
    expect(headingText('pt', '2026', 1368)).toBe('1.368 contribuições em 2026')
    expect(headingText('en', '2024', 1)).toBe('1 contribution in 2024')
  })

  it('titles months and short dates in both locales', () => {
    expect(monthTitle('en', '2026-09')).toBe('September 2026')
    expect(monthTitle('pt', '2026-09')).toBe('setembro de 2026')
    expect(shortDate('en', '2026-09-01')).toBe('Sep 1')
    expect(shortDate('pt', '2026-09-17')).toBe('17 de set.')
  })
})

describe('grid geometry', () => {
  it('fits GitHub’s rolling year in 53 weeks and pads a year that starts mid-week', () => {
    expect(columnsFor('2025-09-14', 371)).toBe(53) // a Sunday, 53 full weeks
    expect(columnsFor('2026-01-01', 365)).toBe(53) // a Thursday
    expect(columnsFor('2028-01-01', 366)).toBe(54) // a leap year that starts on a Saturday
  })

  it('labels each month once, spanning its columns, and leaves a one-column month blank', () => {
    const labels = monthLabels('en', '2025-09-14', 371)
    expect(labels.reduce((sum, l) => sum + l.span, 0)).toBe(53)
    expect(labels.map((l) => l.label).slice(0, 4)).toEqual(['Sep', 'Oct', 'Nov', 'Dec'])
    // 2026 starts on a Thursday: column 0 is January, and so is column 4.
    const year = monthLabels('pt', '2026-01-01', 365)
    expect(year[0]).toEqual({ label: 'jan.', span: 5 })
    // A window that ends a day into a new week gives that month one column.
    const edge = monthLabels('en', '2026-01-04', 29) // Sun Jan 4 to Sun Feb 1
    expect(edge.at(-1)).toEqual({ label: '', span: 1 })
  })

  it('shows Mon, Wed and Fri only, and names every day for screen readers', () => {
    expect(weekdayLabels('en').map((d) => d.short)).toEqual(['', 'Mon', '', 'Wed', '', 'Fri', ''])
    expect(weekdayLabels('pt').map((d) => d.short)).toEqual(['', 'seg', '', 'qua', '', 'sex', ''])
    expect(weekdayLabels('en')[0].long).toBe('Sunday')
    expect(weekdayLabels('en').every((d) => d.long.length > 0)).toBe(true)
  })

  it('adds days across a month and a year boundary', () => {
    expect(addDays('2025-12-31', 1)).toBe('2026-01-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })
})

describe('nextIndex', () => {
  // 20 days from a Wednesday: pad 3, so day 0 is row 3 and day 3 is row 6.
  const length = 20
  const pad = 3
  const move = (i: number, key: string, ctrl = false) => nextIndex(i, key, ctrl, length, pad)

  it('moves a day down and up within the week, and stops at the column ends', () => {
    expect(move(0, 'ArrowDown')).toBe(1)
    expect(move(1, 'ArrowUp')).toBe(0)
    expect(move(0, 'ArrowUp')).toBe(0) // first day, nothing above it
    expect(move(3, 'ArrowDown')).toBe(3) // Saturday, never wraps to Sunday
    expect(move(4, 'ArrowUp')).toBe(4) // Sunday, never wraps to Saturday
    expect(move(19, 'ArrowDown')).toBe(19) // last day
  })

  it('moves a week left and right, and stops at the grid ends', () => {
    expect(move(5, 'ArrowRight')).toBe(12)
    expect(move(12, 'ArrowLeft')).toBe(5)
    expect(move(5, 'ArrowLeft')).toBe(5)
    expect(move(15, 'ArrowRight')).toBe(15)
  })

  it('goes to the ends of the row with Home and End, and of the grid with Ctrl', () => {
    expect(move(16, 'Home')).toBe(2)
    expect(move(2, 'End')).toBe(16)
    expect(move(10, 'Home', true)).toBe(0)
    expect(move(10, 'End', true)).toBe(19)
  })

  it('leaves every other key alone', () => {
    expect(move(5, 'Tab')).toBeNull()
    expect(move(5, 'a')).toBeNull()
  })
})

describe('typeMix', () => {
  it('shares the four public types and leaves private out', () => {
    const mix = typeMix({ commits: 555, pullRequests: 6, issues: 12, reviews: 0, private: 1223 })
    expect(mix.map((t) => t.key)).toEqual(['commits', 'pullRequests', 'issues', 'reviews'])
    expect(mix[0].percent).toBeCloseTo(96.86, 1)
    expect(mix[3].percent).toBe(0)
    expect(mix.reduce((sum, t) => sum + t.percent, 0)).toBeCloseTo(100, 6)
  })

  it('is all zero, not NaN, for a period with no public contributions', () => {
    const mix = typeMix({ commits: 0, pullRequests: 0, issues: 0, reviews: 0, private: 9 })
    expect(mix.every((t) => t.percent === 0)).toBe(true)
  })
})

describe('joinList', () => {
  it('joins without a serial comma, as GitHub does', () => {
    expect(joinList(['a'], 'and')).toEqual(['a'])
    expect(joinList(['a', 'b'], 'and')).toEqual(['a', ' and ', 'b'])
    expect(joinList(['a', 'b', 'c', '16 other repositories'], 'and').join('')).toBe(
      'a, b, c and 16 other repositories',
    )
    expect(joinList(['a', 'b', 'c'], 'e').join('')).toBe('a, b e c')
  })
})

describe('pageOf', () => {
  const months = ['m1', 'm2', 'm3', 'm4', 'm5']

  it('slices a fixed number per page and counts the pages', () => {
    expect(pageOf(months, 1, 2)).toEqual({ number: 1, items: ['m1', 'm2'], total: 3 })
    expect(pageOf(months, 3, 2)).toEqual({ number: 3, items: ['m5'], total: 3 })
  })

  it('clamps to the nearest real page, so a click past an end changes nothing', () => {
    expect(pageOf(months, 0, 2).number).toBe(1)
    expect(pageOf(months, 4, 2).number).toBe(3)
    expect(pageOf([], 1, 2)).toEqual({ number: 1, items: [], total: 1 })
  })
})
