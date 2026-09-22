import type { Locale } from '../content/i18n/types'
import { translate } from '../locale'
import { pathFor } from '../route'

/**
 * The two legal documents live here rather than in the chrome bar: they are
 * what a reader looks for at the bottom of a page, and the bar is already at
 * the width where a fourth label wraps onto a second row (see `nav.work`).
 */
export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <p className="dim">{translate(locale, 'footer.builtWith')}</p>
        <p className="dim">
          <a href={pathFor({ page: 'privacy' }, locale)}>{translate(locale, 'privacy.title')}</a>
          {' · '}
          <a href={pathFor({ page: 'terms' }, locale)}>{translate(locale, 'terms.title')}</a>
        </p>
      </div>
    </footer>
  )
}
