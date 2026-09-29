import type { Locale } from '../content/i18n/types'
import { translate } from '../locale'
import { pathFor } from '../route'

/**
 * Both legal documents are linked here, where a reader looks for them at the
 * bottom of a page. The privacy policy is also in the chrome bar (TOP_LEVEL in
 * navigation.ts), which is already at the width where another label wraps onto
 * a second row (see `nav.work`), so the terms are only here.
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
