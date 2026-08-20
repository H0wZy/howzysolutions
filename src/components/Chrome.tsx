import type { ReactNode } from 'react'
import type { Locale } from '../content/i18n/types'
import { translate } from '../locale'

/**
 * Sticky editor-style bar. The theme and language controls arrive in US4 and US3
 * and fill the `controls` slot; the immersive toggle fills `immersive` in US6.
 */
export function Chrome({
  locale,
  path,
  controls,
  immersive,
}: {
  locale: Locale
  path: string
  controls?: ReactNode
  immersive?: ReactNode
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
        {immersive}
        {controls}
      </span>
    </div>
  )
}
