import type { Locale } from './i18n/types'
import type { StringKey } from './i18n/en'
import type { ContributionTypes } from './types'
import { translate } from './i18n/translate'

/*
 * Pure helpers for the GitHub activity section: dates, grid geometry, keyboard
 * movement and the visitor-facing sentences. Every date is built from a string
 * in the artifact and formatted in UTC, never read from the clock, so the
 * prerender and the browser print the same thing (FR-047): without
 * `timeZone: 'UTC'` a browser in Sao Paulo turns 2026-07-15 into July 14th.
 */

export const LAST_YEAR = 'last-year'

/** Where the grid's footer link goes: GitHub's own account of what it counts. */
export const LEARN_URL = 'https://docs.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile'
/** Only ever called with a public `owner/name` the artifact validator accepted. */
export const repoUrl = (name: string) => `https://github.com/${name}`

const INTL: Record<Locale, string> = { en: 'en-US', pt: 'pt-BR' }
const DAY_MS = 86_400_000
const time = (iso: string) => Date.parse(`${iso}T00:00:00Z`)

export const addDays = (iso: string, n: number) =>
  new Date(time(iso) + n * DAY_MS).toISOString().slice(0, 10)
export const daysBetween = (from: string, to: string) => Math.round((time(to) - time(from)) / DAY_MS)
/** 0 is Sunday, the first row, as on GitHub. */
export const weekdayOf = (iso: string) => new Date(time(iso)).getUTCDay()

const dateFormats = new Map<string, Intl.DateTimeFormat>()
function formatDate(locale: Locale, iso: string, options: Intl.DateTimeFormatOptions): string {
  const key = locale + JSON.stringify(options)
  let format = dateFormats.get(key)
  if (!format) {
    format = new Intl.DateTimeFormat(INTL[locale], { ...options, timeZone: 'UTC' })
    dateFormats.set(key, format)
  }
  return format.format(time(iso))
}

const numberFormats = { en: new Intl.NumberFormat(INTL.en), pt: new Intl.NumberFormat(INTL.pt) }
export const formatNumber = (locale: Locale, n: number) => numberFormats[locale].format(n)

const ORDINALS = new Intl.PluralRules('en-US', { type: 'ordinal' })
const SUFFIX: Record<string, string> = { one: 'st', two: 'nd', few: 'rd', other: 'th' }
/** 1st 2nd 3rd 4th 11th 12th 13th 21st: English only, Portuguese dates have none. */
export const ordinal = (n: number) => `${n}${SUFFIX[ORDINALS.select(n)]}`

export type Noun = 'contribution' | 'commit' | 'repo' | 'pr' | 'issue' | 'otherRepo'

/**
 * "1 contribution", "1,818 contributions", "0 contribuições". A plain `n === 1`
 * rather than PluralRules, which files pt-BR zero under "one".
 */
export function countText(locale: Locale, n: number, noun: Noun): string {
  const key: StringKey = `contrib.n.${noun}.${n === 1 ? 'one' : 'other'}`
  return translate(locale, key, { n: formatNumber(locale, n) })
}

/** "July 15th" / "15 de julho", or with the year "July 15th, 2026" / "15 de julho de 2026". */
export function dayLabel(locale: Locale, iso: string, withYear = false): string {
  if (locale === 'pt') {
    const date = formatDate(locale, iso, { day: 'numeric', month: 'long' })
    return withYear ? `${date} de ${iso.slice(0, 4)}` : date
  }
  const day = `${formatDate(locale, iso, { month: 'long' })} ${ordinal(Number(iso.slice(8)))}`
  return withYear ? `${day}, ${iso.slice(0, 4)}` : day
}

/**
 * One day's sentence. The tooltip leaves the year out, as GitHub does; the
 * screen-reader copy keeps it, because a rolling year holds some dates twice
 * and a listener has no column to tell them apart by.
 */
export function daySentence(locale: Locale, iso: string, count: number, withYear = false): string {
  const date = dayLabel(locale, iso, withYear)
  if (count === 0) return translate(locale, 'contrib.day.none', { date })
  return translate(locale, 'contrib.day.some', { contributions: countText(locale, count, 'contribution'), date })
}

/** "Sep 1" / "1 de set." */
export const shortDate = (locale: Locale, iso: string) =>
  formatDate(locale, iso, { month: 'short', day: 'numeric' })

/** "September 2026" / "setembro de 2026", from `YYYY-MM`. */
export const monthTitle = (locale: Locale, month: string) =>
  formatDate(locale, `${month}-01`, { month: 'long', year: 'numeric' })

/** "1,818 contributions in the last year" / "1.368 contribuições em 2026". */
export function headingText(locale: Locale, period: string, total: number): string {
  const contributions = countText(locale, total, 'contribution')
  if (period === LAST_YEAR) return translate(locale, 'contrib.inLastYear', { contributions })
  return translate(locale, 'contrib.inYear', { contributions, year: period })
}

/*
 * Grid geometry. Day `i` of a period sits at column floor((pad + i) / 7), row
 * (pad + i) % 7, where `pad` is the start's weekday: a year that starts on a
 * Thursday leaves the first column's Sunday to Wednesday empty.
 */

export const columnsFor = (start: string, length: number) =>
  Math.ceil((weekdayOf(start) + length) / 7)

/**
 * One label per run of columns whose first day falls in the same month, as
 * GitHub labels them. A run of one column (a partial month at either edge)
 * gets no text, because "Sep" does not fit in a 13px column.
 */
export function monthLabels(locale: Locale, start: string, length: number) {
  const pad = weekdayOf(start)
  const runs: { month: string; span: number }[] = []
  for (let column = 0; column < columnsFor(start, length); column++) {
    const month = addDays(start, Math.max(0, column * 7 - pad)).slice(0, 7)
    const last = runs.at(-1)
    if (last?.month === month) last.span++
    else runs.push({ month, span: 1 })
  }
  return runs.map(({ month, span }) => ({
    span,
    label: span < 2 ? '' : formatDate(locale, `${month}-01`, { month: 'short' }),
  }))
}

/** Seven rows from Sunday: every name for screen readers, Mon/Wed/Fri shown. */
export function weekdayLabels(locale: Locale) {
  return Array.from({ length: 7 }, (_, row) => {
    const iso = addDays('2023-01-01', row) // a Sunday
    return {
      long: formatDate(locale, iso, { weekday: 'long' }),
      short: row % 2 ? formatDate(locale, iso, { weekday: 'short' }).replace(/\.$/, '') : '',
    }
  })
}

/**
 * Roving focus across the grid. Up and down move a day within the week's
 * column, left and right a week along the row, Home and End to the ends of
 * the row, and with Ctrl to the first and last day. Edges stop, never wrap.
 * Null for a key the grid does not handle, so its default is left alone.
 */
export function nextIndex(i: number, key: string, ctrl: boolean, length: number, pad: number): number | null {
  const row = (pad + i) % 7
  switch (key) {
    case 'ArrowUp':
      return row > 0 && i > 0 ? i - 1 : i
    case 'ArrowDown':
      return row < 6 && i + 1 < length ? i + 1 : i
    case 'ArrowLeft':
      return i >= 7 ? i - 7 : i
    case 'ArrowRight':
      return i + 7 < length ? i + 7 : i
    case 'Home':
      return ctrl ? 0 : i % 7
    case 'End':
      return ctrl ? length - 1 : i + 7 * Math.floor((length - 1 - i) / 7)
    default:
      return null
  }
}

export const TYPE_KEYS = ['commits', 'pullRequests', 'issues', 'reviews'] as const

/**
 * Share of each public contribution type. Private contributions have no type
 * breakdown, so they are left out rather than guessed at.
 */
export function typeMix(types: ContributionTypes) {
  const total = TYPE_KEYS.reduce((sum, key) => sum + types[key], 0)
  return TYPE_KEYS.map((key) => ({
    key,
    count: types[key],
    percent: total ? (types[key] / total) * 100 : 0,
  }))
}

/** `[a, ', ', b, ' and ', c]`: no serial comma, as GitHub writes it. */
export function joinList<T>(items: T[], and: string): (T | string)[] {
  return items.flatMap((item, i) =>
    i === 0 ? [item] : [i === items.length - 1 ? ` ${and} ` : ', ', item],
  )
}
