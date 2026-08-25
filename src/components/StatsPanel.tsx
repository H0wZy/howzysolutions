import type { CSSProperties } from 'react'
import type { Locale } from '../content/i18n/types'
import type { StringKey } from '../content/i18n/en'
import type { CodingStatsSnapshot, StatSlice } from '../content/types'
import { periodLabel } from '../content/stats'
import { translate } from '../locale'

/** Rows visible before the rest folds into the disclosure (research D5). */
const VISIBLE_ROWS = 8

/** Whole hours and minutes from a raw second count — the same shape WakaTime's own `text` field uses. */
function formatSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.round((seconds % 3600) / 60)
  if (hours === 0) return `${minutes} mins`
  return `${hours} hrs ${minutes} mins`
}

/**
 * One breakdown row: name, a trackless ink bar sized by `--pct`, then the
 * percentage and duration as real text (FR-026, FR-027, research D4). The
 * custom property carries a number, never a colour — the colour lives in
 * src/styles/components.css.
 */
function BarRow({ slice }: { slice: StatSlice }) {
  return (
    <li className="bar-row">
      <span className="bar-name">{slice.name}</span>
      <span className="bar-lane">
        <span className="bar-fill" style={{ '--pct': slice.percent } as CSSProperties} />
      </span>
      <span className="bar-percent">{slice.percent.toFixed(1)}%</span>
      <span className="bar-duration dim">{slice.text}</span>
    </li>
  )
}

function StatGroup({
  labelKey,
  locale,
  slices,
}: {
  labelKey: StringKey
  locale: Locale
  slices: StatSlice[]
}) {
  if (slices.length === 0) return null
  const visible = slices.slice(0, VISIBLE_ROWS)
  const rest = slices.slice(VISIBLE_ROWS)
  return (
    <div className="stack-group">
      <h3>{translate(locale, labelKey)}</h3>
      <ul className="bar-list">
        {visible.map((slice) => (
          <BarRow key={slice.name} slice={slice} />
        ))}
      </ul>
      {/* FR-029: nothing is dropped, it folds into a native, keyboard-operable disclosure. */}
      {rest.length > 0 ? (
        <details className="bar-more">
          <summary>{translate(locale, 'stats.showAll')}</summary>
          <ul className="bar-list">
            {rest.map((slice) => (
              <BarRow key={slice.name} slice={slice} />
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  )
}

/**
 * Total, breakdown and per-project distribution — every section stating its
 * period next to its figures (FR-026, FR-027). Editors and categories are
 * published deliberately, not an oversight.
 */
export function StatsPanel({ stats, locale }: { stats: CodingStatsSnapshot; locale: Locale }) {
  const period = periodLabel(stats)
  const range = translate(locale, period.key, period.params)

  return (
    <div className="stats-panel">
      <p className="detail-meta dim">{range}</p>

      {/* FR-031: a stale build reads as stale, never as current. */}
      {stats.isFallback ? (
        <p className="sub">
          {translate(locale, 'stats.stale', { date: stats.capturedAt.slice(0, 10) })}
        </p>
      ) : null}

      <dl className="metrics">
        <div className="metric">
          <dt>{translate(locale, 'stats.total')}</dt>
          <dd>
            <strong>{stats.humanReadableTotal}</strong>
            <span className="metric-source">{translate(locale, 'stats.source')}</span>
          </dd>
        </div>
        <div className="metric">
          <dt>{translate(locale, 'stats.dailyAverage')}</dt>
          <dd>
            <strong>{formatSeconds(stats.dailyAverageSeconds)}</strong>
            <span className="metric-source">{range}</span>
          </dd>
        </div>
      </dl>

      <div className="stack-groups">
        <StatGroup labelKey="stats.languages" locale={locale} slices={stats.languages} />
        <StatGroup labelKey="stats.editors" locale={locale} slices={stats.editors} />
        <StatGroup labelKey="stats.categories" locale={locale} slices={stats.categories} />
        <StatGroup labelKey="stats.projects" locale={locale} slices={stats.projects} />
      </div>

      {/*
        FR-028: experience and tracked time never corroborate one another —
        they measure different things over different periods.
      */}
      <p className="sub dim">{translate(locale, 'stats.experienceNote')}</p>
    </div>
  )
}
