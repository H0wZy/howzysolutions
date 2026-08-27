import type { ReactNode } from 'react'
import type { Locale } from '../content/i18n/types'
import { translate } from '../content/i18n/translate'
import { locationFor, pathFor } from '../route'
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
 *
 * FR-084: a link to the CV also lives here, for the same reason. Every page
 * renders Chrome, so this is one line that makes the CV reachable in one
 * activation from anywhere, rather than a link authored on Home, on the work
 * listing and on every project page separately. Suppressed on the CV page
 * itself — the current page is not a link, the same rule the breadcrumb's
 * final crumb follows (FR-069).
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
          {route.page !== 'cv' ? (
            <a className="chrome-btn" href={pathFor({ page: 'cv' }, locale)}>
              {translate(locale, 'nav.cv')}
            </a>
          ) : null}
          <LocaleControl locale={locale} pathname={pathname} />
          <ThemeControl locale={locale} />
        </span>
      </div>
      <Breadcrumb route={route} locale={locale} leafLabel={leafLabel} />
    </>
  )
}
