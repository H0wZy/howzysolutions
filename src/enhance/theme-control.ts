import { pickJoke } from '../theme/jokes'
import { translate } from '../content/i18n/translate'
import type { Locale } from '../content/i18n/types'
import type { StringKey } from '../content/i18n/en'

/**
 * The one place a theme joke is ever rendered. The chrome button's own click
 * and the terminal's `joke` effect (from `theme light`) both end up here,
 * which is what makes FR-015 true the same way `applyTheme` used to make it
 * true for a real theme change (research D12).
 */
function renderJokeBubble(locale: Locale, key: StringKey): void {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')
  if (!button) return

  let bubble = document.querySelector<HTMLElement>('[data-theme-joke]')
  if (!bubble) {
    bubble = document.createElement('span')
    bubble.dataset.themeJoke = ''
    bubble.className = 'theme-joke'
    bubble.setAttribute('role', 'status')
    button.insertAdjacentElement('afterend', bubble)
  }

  bubble.textContent = translate(locale, key)

  // Restart the fade-out even if a bubble is already mid-animation from an
  // earlier click or command.
  bubble.classList.remove('is-visible')
  void bubble.offsetWidth
  bubble.classList.add('is-visible')

  const previousTimer = Number(bubble.dataset.timer)
  if (previousTimer) window.clearTimeout(previousTimer)
  const timer = window.setTimeout(() => bubble?.classList.remove('is-visible'), 4000)
  bubble.dataset.timer = String(timer)
}

/** The button click has no engine-picked key, so it picks its own from a local counter. */
export function showThemeJoke(locale: Locale, seed: number): void {
  renderJokeBubble(locale, pickJoke(seed))
}

/**
 * Reused by the terminal's `joke` effect, carrying the exact key `theme light`
 * already picked and printed — so the bubble never shows a different line than
 * the one the visitor just read in the terminal output.
 */
export function showThemeJokeKey(locale: Locale, key: StringKey): void {
  renderJokeBubble(locale, key)
}

export function initThemeControl(locale: Locale): void {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')
  if (!button) return

  let clicks = 0
  button.addEventListener('click', () => {
    clicks += 1
    showThemeJoke(locale, clicks)
  })
}
