import type { Locale } from '../content/i18n/types'
import { translate } from '../content/i18n/translate'
import type { Theme } from '../theme/types'

/**
 * Build-time markup only; src/enhance/theme-control.ts wires the behaviour.
 *
 * Prerendered in the DEFAULT theme's state. The blocking script in index.html
 * has already set data-theme before paint, so enhance() corrects this label on
 * load if the visitor's resolved theme differs — no flash, because only the
 * label changes, never the colours (FR-021).
 */
export function ThemeControl({ locale, theme }: { locale: Locale; theme: Theme }) {
  const target: Theme = theme === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      className="chrome-btn"
      data-theme-toggle
      aria-label={translate(locale, 'chrome.theme.switchTo', {
        theme: translate(locale, target === 'dark' ? 'chrome.theme.dark' : 'chrome.theme.light'),
      })}
    >
      <span data-theme-toggle-label>
        {translate(locale, target === 'dark' ? 'chrome.theme.dark' : 'chrome.theme.light')}
      </span>
    </button>
  )
}
