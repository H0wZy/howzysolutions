import { LOCALES, type Locale } from '../content/i18n/types'
import { counterpart } from '../route'

/**
 * A real link to the same page in the other locale, not a button that rebuilds
 * the DOM. That is what makes the Portuguese page shareable and indexable, and
 * what lets each document carry its own lang attribute with no JavaScript.
 *
 * src/enhance/locale-control.ts adds scroll preservation on top; without
 * JavaScript this still works as an ordinary link.
 */
export function LocaleControl({ locale, pathname }: { locale: Locale; pathname: string }) {
  const target = LOCALES.find((l) => l !== locale) ?? locale
  return (
    <a
      className="chrome-btn"
      data-locale-link
      href={counterpart(pathname, target)}
      hrefLang={target}
      lang={target}
      rel="alternate"
    >
      {target}
    </a>
  )
}
