import type { Locale } from '../../content/i18n/types'
import { translate } from '../../content/i18n/translate'
import { pathFor } from '../../route'

/** The legal line at the foot of the home page and /services/. */
export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="site-foot mono">
      <span>{translate(locale, 'footer.builtWith')}</span>
      <span>
        <a href={pathFor({ page: 'privacy' }, locale)}>{translate(locale, 'privacy.title')}</a>
        {' · '}
        <a href={pathFor({ page: 'terms' }, locale)}>{translate(locale, 'terms.title')}</a>
      </span>
    </footer>
  )
}
