import type { ReactNode } from 'react'
import type { Locale } from '../content/i18n/types'
import { translate } from '../content/i18n/translate'
import { ThemeControl } from './ThemeControl'
import { LocaleControl } from './LocaleControl'

/**
 * Sticky editor-style bar. The theme and language controls arrive in US4 and US3
 * and fill the `controls` slot.
 */
export function Chrome({
  locale,
  path,
  pathname,
  controls,
}: {
  locale: Locale
  path: string
  pathname: string
  controls?: ReactNode
}) {
  return (
    <div className="chrome">
      <span className="dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="chrome-file">
        ~/{path} — {translate(locale, 'chrome.file')}
      </span>
      <span className="chrome-controls">
        {controls}
        <LocaleControl locale={locale} pathname={pathname} />
        <ThemeControl locale={locale} />
      </span>
    </div>
  )
}
