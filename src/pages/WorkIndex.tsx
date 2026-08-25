import type { Locale } from '../content/i18n/types'
import type { ContentBundle } from '../content/types'
import { workPage } from '../content/types'
import { translate } from '../locale'
import { Chrome } from '../components/Chrome'
import { ProjectList } from '../components/ProjectList'
import { Pagination } from '../components/Pagination'

/**
 * The paginated work listing: chrome, the page's slice, and the strip. No
 * terminal, biography, activity or contact section — those live only on the
 * home document (contracts/work-pagination.md).
 */
export function WorkIndex({
  content,
  locale,
  pageNumber,
  pathname,
}: {
  content: ContentBundle
  locale: Locale
  pageNumber: number
  pathname: string
}) {
  const { projects, number, total } = workPage(content.projects, pageNumber)

  return (
    <>
      <Chrome locale={locale} path="h0wzy/work" pathname={pathname} />
      <main className="section">
        <div className="wrap">
          <h1>{translate(locale, 'work.listingTitle')}</h1>
          <p className="prose">{translate(locale, 'work.intro')}</p>
          <ProjectList projects={projects} locale={locale} />
          <Pagination number={number} total={total} locale={locale} />
        </div>
      </main>
    </>
  )
}
