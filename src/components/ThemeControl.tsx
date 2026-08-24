import type { Locale } from '../content/i18n/types'
import { translate } from '../content/i18n/translate'

/**
 * Build-time markup only; src/enhance/theme-control.ts wires the click.
 *
 * Dark is the only theme (research D12), so this button's label never
 * changes — it always names the theme a click will be refused for, the way
 * ponytail.dev's own light-mode button stays labelled "light mode" forever.
 */
export function ThemeControl({ locale }: { locale: Locale }) {
  return (
    <button
      type="button"
      className="chrome-btn"
      data-theme-toggle
      aria-label={translate(locale, 'chrome.theme.switchTo', {
        theme: translate(locale, 'chrome.theme.light'),
      })}
    >
      <span>{translate(locale, 'chrome.theme.light')}</span>
    </button>
  )
}
