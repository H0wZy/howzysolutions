import { Fragment, useRef, useState, useSyncExternalStore } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { Locale } from '../content/i18n/types'
import type { StringKey } from '../content/i18n/en'
import type { ActivityMonth, ActivityPeriod, GithubActivity as Activity, RepoCount } from '../content/types'
import { pageOf } from '../content/types'
import { translate } from '../locale'
import {
  LAST_YEAR,
  countText,
  formatNumber,
  headingText,
  joinList,
  monthTitle,
  repoUrl,
  shortDate,
  typeMix,
  type Noun,
} from '../content/activity'
import { ContributionGrid } from './ContributionGrid'
import { BarRow } from './StatsPanel'

const MONTHS_PER_PAGE = 2
const OVERVIEW_REPOS = 3

const noop = () => () => {}

/**
 * True once hydrated, false in the prerender and during hydration itself, so
 * the markup hydration compares is the prerendered markup. Controls that
 * need JavaScript render disabled until then, taking up the same space.
 */
const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )

/**
 * The GitHub profile's activity, in this site's idiom: a heading with the
 * period's total, the year chips, the calendar, an overview and the monthly
 * timeline. Everything comes from the committed artifact; the default view
 * is fully prerendered and the chips swap periods after hydration.
 */
export function GithubActivity({ activity, locale }: { activity: Activity; locale: Locale }) {
  const [key, setKey] = useState(LAST_YEAR)
  const hydrated = useHydrated()
  const period = activity.periods[key]
  const choices = [LAST_YEAR, ...activity.years.map(String)]

  return (
    <>
      <div className="gh-head">
        <h2 aria-live="polite">{headingText(locale, key, period.total)}</h2>
        <div className="gh-years" role="group" aria-label={translate(locale, 'contrib.period')}>
          {choices.map((choice) => (
            <button
              key={choice}
              type="button"
              className="chrome-btn"
              aria-pressed={choice === key}
              disabled={!hydrated}
              onClick={() => setKey(choice)}
            >
              {choice === LAST_YEAR ? translate(locale, 'contrib.lastYear') : choice}
            </button>
          ))}
        </div>
      </div>

      {/* FR-042: independent of the tracked-time freshness above it. */}
      {activity.isFallback ? (
        <p className="sub">
          {translate(locale, 'contrib.stale', { date: activity.capturedAt.slice(0, 10) })}
        </p>
      ) : null}

      <p className="metric-source">
        {translate(locale, 'contrib.source')} ·{' '}
        {translate(locale, 'contrib.window', { start: period.start, end: period.end })}
        {activity.includesPrivate ? ` · ${translate(locale, 'contrib.privateNote')}` : null}
      </p>

      {/* Keyed per period so a new period starts fresh: roving focus on its
          last day, the timeline on page 1. Siblings, so the keys must differ. */}
      <ContributionGrid key={`grid-${key}`} period={period} locale={locale} />
      <Overview period={period} locale={locale} />
      <Timeline key={`timeline-${key}`} months={period.months} locale={locale} hydrated={hydrated} />
    </>
  )
}

function Overview({ period, locale }: { period: ActivityPeriod; locale: Locale }) {
  const shown = period.contributedTo.slice(0, OVERVIEW_REPOS)
  const others = period.contributedTo.length - shown.length
  const names = joinList<ReactNode>(
    [
      ...shown.map((name) => (
        <a key={name} href={repoUrl(name)} target="_blank" rel="noreferrer">
          {name}
        </a>
      )),
      ...(others > 0 ? [countText(locale, others, 'otherRepo')] : []),
    ],
    translate(locale, 'contrib.and'),
  )
  const mix = typeMix(period.types)

  return (
    <div className="gh-block">
      <h3>{translate(locale, 'contrib.overview')}</h3>
      {shown.length > 0 ? (
        <p>
          {translate(locale, 'contrib.contributedTo')}{' '}
          {names.map((part, i) => (
            <Fragment key={i}>{part}</Fragment>
          ))}
        </p>
      ) : null}
      {mix.some((type) => type.count > 0) ? (
        <>
          <p className="dim">{translate(locale, 'contrib.types')}</p>
          <ul className="bar-list">
            {mix.map((type) => (
              <BarRow
                key={type.key}
                slice={{
                  name: translate(locale, `contrib.type.${type.key}`),
                  percent: type.percent,
                  text: formatNumber(locale, type.count),
                }}
              />
            ))}
          </ul>
        </>
      ) : null}
    </div>
  )
}

/**
 * Newest month first, a fixed number per page, paged inside the box so the
 * page itself never grows. A month has no size limit (one busy month lists a
 * dozen repositories), so the months scroll inside a capped box and the pager
 * sits above them: turning a page moves neither the controls nor anything
 * below the section. Keyed by period, so a new period starts on page 1.
 * The ends are aria-disabled rather than disabled: a disabled button drops
 * the focus that just pressed it.
 */
function Timeline({
  months,
  locale,
  hydrated,
}: {
  months: ActivityMonth[]
  locale: Locale
  hydrated: boolean
}) {
  const [requested, setRequested] = useState(1)
  const listRef = useRef<HTMLDivElement>(null)
  const page = pageOf(months, requested, MONTHS_PER_PAGE)
  if (months.length === 0) return null

  const turn = (to: number) => {
    setRequested(to)
    listRef.current?.scrollTo({ top: 0 })
  }

  return (
    <div className="gh-block">
      <div className="gh-tl-head">
        <h3>{translate(locale, 'contrib.activity')}</h3>
        {page.total > 1 ? (
          <div className="gh-pages">
            <button
              type="button"
              className="pagination-link"
              disabled={!hydrated}
              aria-disabled={page.number === 1}
              onClick={() => turn(page.number - 1)}
            >
              ← {translate(locale, 'contrib.newer')}
            </button>
            <span className="dim" aria-live="polite">
              {translate(locale, 'contrib.pageOf', { page: page.number, total: page.total })}
            </span>
            <button
              type="button"
              className="pagination-link"
              disabled={!hydrated}
              aria-disabled={page.number === page.total}
              onClick={() => turn(page.number + 1)}
            >
              {translate(locale, 'contrib.older')} →
            </button>
          </div>
        ) : null}
      </div>
      {/* A scrolling box needs a tab stop of its own, or a keyboard can only
          reach the parts of it that happen to be links. */}
      <div
        className={page.total > 1 ? 'gh-months is-paged' : 'gh-months'}
        ref={listRef}
        tabIndex={0}
        role="region"
        aria-label={translate(locale, 'contrib.activity')}
      >
        {page.items.map((month) => (
          <MonthBlock key={month.month} month={month} locale={locale} />
        ))}
      </div>
    </div>
  )
}

function MonthBlock({ month, locale }: { month: ActivityMonth; locale: Locale }) {
  return (
    <div className="gh-month">
      <h4>{monthTitle(locale, month.month)}</h4>
      <RepoCounts rows={month.commits} line="contrib.tl.commits" noun="commit" locale={locale} />
      {month.created ? (
        <>
          <p>{translate(locale, 'contrib.tl.created', { repos: countText(locale, month.created.length, 'repo') })}</p>
          <ul className="gh-created">
            {month.created.map(([name, date, fork, language, color]) => (
              <li key={name}>
                <a href={repoUrl(name)} target="_blank" rel="noreferrer">
                  {name}
                </a>
                {fork ? <span className="dim">{translate(locale, 'contrib.fork')}</span> : null}
                {language ? (
                  <span className="dim">
                    {color ? (
                      <span className="lang-dot" style={{ '--lang': color } as CSSProperties} />
                    ) : null}
                    {language}
                  </span>
                ) : null}
                <span className="dim">{shortDate(locale, date)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <RepoCounts rows={month.pullRequests} line="contrib.tl.prs" noun="pr" locale={locale} />
      <RepoCounts rows={month.issues} line="contrib.tl.issues" noun="issue" locale={locale} />
      <RepoCounts rows={month.reviews} line="contrib.tl.reviews" noun="pr" locale={locale} />
      {month.private ? (
        <p>
          {translate(locale, 'contrib.tl.private', {
            contributions: countText(locale, month.private[0], 'contribution'),
          })}
          {/* Only a measured range is printed: GitHub does not always date them. */}
          {month.private[1] && month.private[2] ? (
            <>
              {' '}
              <span className="dim">
                {translate(locale, 'contrib.window', {
                  start: shortDate(locale, month.private[1]),
                  end: shortDate(locale, month.private[2]),
                })}
              </span>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  )
}

/** "Created 35 commits in 3 repositories", then a bar per repository. */
function RepoCounts({
  rows,
  line,
  noun,
  locale,
}: {
  rows?: RepoCount[]
  line: StringKey
  noun: Noun
  locale: Locale
}) {
  if (!rows) return null
  const total = rows.reduce((sum, [, count]) => sum + count, 0)
  return (
    <>
      <p>
        {translate(locale, line, {
          items: countText(locale, total, noun),
          repos: countText(locale, rows.length, 'repo'),
        })}
      </p>
      <ul className="bar-list">
        {rows.map(([name, count]) => (
          <BarRow
            key={name}
            href={repoUrl(name)}
            slice={{ name, percent: total ? (count / total) * 100 : 0, text: countText(locale, count, noun) }}
          />
        ))}
      </ul>
    </>
  )
}
