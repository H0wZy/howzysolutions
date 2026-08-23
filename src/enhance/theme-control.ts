import { THEME_CHANGE_EVENT, applyTheme, resolveTheme } from '../theme'
import type { Theme } from '../theme/types'
import { translate } from '../content/i18n/translate'
import type { Locale } from '../content/i18n/types'

/**
 * Wires the chrome's theme button.
 *
 * FR-015: this and the terminal's `theme` command must produce identical
 * results, which they do by both going through applyTheme() — there is one
 * implementation of "change the theme", not two that drift apart.
 */

const LABEL_KEY = { dark: 'chrome.theme.dark', light: 'chrome.theme.light' } as const

/** Reflects the theme the button will switch TO, not the one in effect. */
function paint(button: HTMLElement, locale: Locale, current: Theme): void {
  const target: Theme = current === 'dark' ? 'light' : 'dark'
  const label = button.querySelector<HTMLElement>('[data-theme-toggle-label]')
  const name = translate(locale, LABEL_KEY[target])
  if (label) label.textContent = name
  button.setAttribute('aria-label', translate(locale, 'chrome.theme.switchTo', { theme: name }))
}

export function initThemeControl(locale: Locale): void {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')
  if (!button) return

  // The markup was prerendered against the default theme. Correct the label to
  // whatever the blocking script in index.html actually resolved.
  paint(button, locale, resolveTheme())

  button.addEventListener('click', () => {
    applyTheme(resolveTheme() === 'dark' ? 'light' : 'dark')
  })

  // Repaint on ANY theme change, including one the terminal's `theme` command
  // caused. The button reflects state; it does not own it.
  window.addEventListener(THEME_CHANGE_EVENT, (event) => {
    paint(button, locale, (event as CustomEvent<Theme>).detail)
  })

  // A visitor who has expressed no override should follow their system if it
  // changes mid-session. An explicit choice is not overridden.
  try {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
      if (localStorage.getItem('h0wzy.theme')) return
      const resolved = resolveTheme()
      document.documentElement.dataset.theme = resolved
      paint(button, locale, resolved)
    })
  } catch {
    /* matchMedia or storage unavailable: the button still works. */
  }
}
