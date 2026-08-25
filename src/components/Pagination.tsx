import type { Locale } from '../content/i18n/types'
import { pathFor } from '../route'
import { translate } from '../locale'

/**
 * Real anchors to real prerendered documents, not a script rebuilding a list.
 * The current page carries `aria-current="page"` rather than a colour alone
 * (FR-022); previous and next are simply absent at the ends, not disabled
 * (contracts/work-pagination.md).
 */
export function Pagination({
  number,
  total,
  locale,
}: {
  number: number
  total: number
  locale: Locale
}) {
  if (total <= 1) return null

  const hrefFor = (n: number) => pathFor({ page: 'workIndex', number: n }, locale)

  return (
    <nav className="pagination" aria-label={translate(locale, 'work.page')}>
      <ol className="pagination-list">
        {number > 1 ? (
          <li>
            <a className="pagination-link pagination-edge" href={hrefFor(number - 1)}>
              ← {translate(locale, 'work.pagePrev')}
            </a>
          </li>
        ) : null}
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            <a
              className="pagination-link"
              href={hrefFor(n)}
              aria-current={n === number ? 'page' : undefined}
            >
              {n}
            </a>
          </li>
        ))}
        {number < total ? (
          <li>
            <a className="pagination-link pagination-edge" href={hrefFor(number + 1)}>
              {translate(locale, 'work.pageNext')} →
            </a>
          </li>
        ) : null}
      </ol>
    </nav>
  )
}
