import { LOCALES, type Locale } from '../../content/i18n/types'
import { translate } from '../../content/i18n/translate'
import { counterpart, locationFor, pathFor } from '../../route'

/**
 * The fixed bar of the home page and /services/. The rest of the site keeps
 * Chrome; these two pages are the rebrand and carry their own, with the
 * wordmark on the left and the four destinations on the right.
 *
 * The language link is a real link to the same page in the other locale, as in
 * LocaleControl, and carries the same data attribute so src/enhance/
 * locale-control.ts keeps the scroll position across the switch. There is no
 * theme control: dark is the only theme (constitution VI).
 */
export function SiteNav({ locale, pathname }: { locale: Locale; pathname: string }) {
  const { route } = locationFor(pathname)
  const other = LOCALES.find((l) => l !== locale) ?? locale
  const current = (page: string) => (route.page === page ? 'page' : undefined)

  return (
    <>
      <a className="skip" href="#main">
        {translate(locale, 'chrome.skipToContent')}
      </a>
      <nav className="site-nav mono" aria-label={translate(locale, 'nav.primary')}>
        <a href={pathFor({ page: 'home' }, locale)} aria-current={current('home')}>
          howzysolutions
        </a>
        <span className="links">
          <a href={pathFor({ page: 'services' }, locale)} aria-current={current('services')}>
            {translate(locale, 'nav.services')}
          </a>
          <a href={pathFor({ page: 'workIndex', number: 1 }, locale)}>{translate(locale, 'nav.work')}</a>
          <a href={pathFor({ page: 'cv' }, locale)}>{translate(locale, 'nav.cv')}</a>
          <a
            data-locale-link
            href={counterpart(pathname, other)}
            hrefLang={other}
            lang={other}
            rel="alternate"
          >
            {other}
          </a>
        </span>
      </nav>
    </>
  )
}
