import type { Locale } from '../content/i18n/types'
import type { Metric } from '../content/types'

/**
 * Figures with their sources beside them (FR-027). One spelling for every page
 * that shows a record's numbers: the project page and its showcase.
 */
export function Metrics({ metrics, locale }: { metrics: Metric[]; locale: Locale }) {
  return (
    <dl className="metrics">
      {metrics.map((metric) => (
        <div key={metric.label[locale]} className="metric">
          <dt>{metric.label[locale]}</dt>
          <dd>
            <strong>{metric.value}</strong>
            <span className="metric-source">{metric.source[locale]}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
