import type { Locale } from '../content/i18n/types'
import type { ContributionCalendar } from '../content/types'
import { translate } from '../locale'

const WEEKDAYS = 7

/**
 * Intensity step from a day's count relative to the busiest day in the
 * window. 0 is reserved for a real reported zero — never for an absent day,
 * which is not rendered at all (data-model.md, cell rendering contract).
 */
function levelFor(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0 || max <= 0) return 0
  const ratio = count / max
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

/** Column = week index from the grid's Sunday anchor, row = weekday (0 Sun .. 6 Sat). */
function cellPosition(date: string, gridStart: Date): { column: number; row: number } {
  const d = new Date(`${date}T00:00:00Z`)
  const diffDays = Math.round((d.getTime() - gridStart.getTime()) / 86_400_000)
  return { column: Math.floor(diffDays / WEEKDAYS) + 1, row: d.getUTCDay() + 1 }
}

/**
 * A second, clearly separated source (FR-039): the public GitHub commit
 * calendar, never summed or compared with the tracked-time figures above it
 * (FR-040). Absent from the page entirely when nothing has ever been
 * captured (FR-043) — a partially trusted calendar is worse than no
 * calendar, so `contributions.ts` already collapsed any malformed artifact
 * to `days: []` before this component ever sees it.
 */
export function ContributionGrid({
  calendar,
  locale,
}: {
  calendar: ContributionCalendar
  locale: Locale
}) {
  if (calendar.days.length === 0) return null

  const start = new Date(`${calendar.window.start}T00:00:00Z`)
  const gridStart = new Date(start)
  gridStart.setUTCDate(gridStart.getUTCDate() - start.getUTCDay())

  const max = Math.max(...calendar.days.map((d) => d.count))
  const scope = translate(
    locale,
    calendar.includesPrivate ? 'contrib.scopeAll' : 'contrib.scopePublic',
  )
  const window = translate(locale, 'contrib.window', {
    start: calendar.window.start,
    end: calendar.window.end,
  })

  return (
    <section className="detail-block contrib">
      <p className="label">{translate(locale, 'contrib.heading')}</p>

      {/* FR-042: independent of the tracked-time freshness above it. */}
      {calendar.isFallback ? (
        <p className="sub">
          {translate(locale, 'contrib.stale', { date: calendar.capturedAt.slice(0, 10) })}
        </p>
      ) : null}

      <p id="contrib-summary">
        <strong>
          {calendar.totalContributions} {scope}
        </strong>{' '}
        <span className="metric-source">
          {translate(locale, 'contrib.source')} · {window}
        </span>
      </p>

      <div className="contrib-scroll">
        <div className="contrib-grid" aria-describedby="contrib-summary">
          {calendar.days.map((day) => {
            const { column, row } = cellPosition(day.date, gridStart)
            return (
              <span
                key={day.date}
                className={`contrib-cell contrib-level-${levelFor(day.count, max)}`}
                style={{ gridColumn: column, gridRow: row }}
              >
                <span className="visually-hidden">
                  {translate(locale, 'contrib.cell', { count: day.count, date: day.date })}
                </span>
              </span>
            )
          })}
        </div>
      </div>

      {/* Colour is never the only carrier (cell rendering contract): the swatches
          are decorative, the real per-cell values are the hidden text above. */}
      <ul className="contrib-legend" aria-hidden="true">
        <li className="contrib-cell contrib-level-0" />
        <li className="contrib-cell contrib-level-1" />
        <li className="contrib-cell contrib-level-2" />
        <li className="contrib-cell contrib-level-3" />
        <li className="contrib-cell contrib-level-4" />
      </ul>
    </section>
  )
}
