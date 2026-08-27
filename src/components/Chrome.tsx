import type { ReactNode } from 'react'
import type { Locale } from '../content/i18n/types'
import { translate } from '../content/i18n/translate'
import { locationFor } from '../route'
import { ThemeControl } from './ThemeControl'
import { LocaleControl } from './LocaleControl'
import { Breadcrumb } from './Breadcrumb'

/**
 * Sticky editor-style bar, plus the breadcrumb beneath it.
 *
 * The breadcrumb lives here because every page already renders Chrome, and a
 * trail derived from the route needs no page to remember to ask for it —
 * which is the same reason FR-069 says it is derived rather than authored.
 * It renders nothing on the home page (FR-070).
 */
export function Chrome({
  locale,
  path,
  pathname,
  controls,
  leafLabel,
}: {
  locale: Locale
  path: string
  pathname: string
  controls?: ReactNode
  /** The current page's own name, where that name is data (a project). */
  leafLabel?: string
}) {
  const { route } = locationFor(pathname)

  return (
    <>
      <div className="chrome">
        <span className="dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="chrome-file">
          ~/{path} <span className="chrome-file-kind">{translate(locale, 'chrome.file')}</span>
        </span>
        <span className="chrome-controls">
          {controls}
          <LocaleControl locale={locale} pathname={pathname} />
          <ThemeControl locale={locale} />
        </span>
      </div>
      <Breadcrumb route={route} locale={locale} leafLabel={leafLabel} />
    </>
  )
}
