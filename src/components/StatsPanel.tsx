import type { Locale } from '../content/i18n/types'
import type { StringKey } from '../content/i18n/en'
import type { CodingStatsSnapshot, StatSlice } from '../content/types'
import { translate } from '../locale'

/** Whole hours and minutes from a raw second count — the same shape WakaTime's own `text` field uses. */
function formatSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.round((seconds % 3600) / 60)
  if (hours === 0) return `${minutes} mins`
  return `${hours} hrs ${minutes} mins`
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
  return (
    <div className="stack-group">
      <h3>{translate(locale, labelKey)}</h3>
      <ul className="bullets">
        {slices.map((slice) => (
          <li key={slice.name}>
            {slice.name} <span className="dim">{slice.percent.toFixed(1)}% · {slice.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Total, breakdown and per-project distribution — every section stating its
 * period next to its figures (FR-026, FR-027). Editors and categories are
 * published deliberately, not an oversight.
 */
export function StatsPanel({ stats, locale }: { stats: CodingStatsSnapshot; locale: Locale }) {
  const range = translate(locale, 'stats.range', {
    start: stats.range.start,
    end: stats.range.end,
  })

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
