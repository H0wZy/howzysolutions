import { pickJoke } from '../theme/jokes'
import { translate } from '../content/i18n/translate'
import type { Locale } from '../content/i18n/types'
import type { StringKey } from '../content/i18n/en'

let timer: ReturnType<typeof setTimeout> | undefined

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
  bubble.classList.remove('is-visible')
  void bubble.offsetWidth
  bubble.classList.add('is-visible')

  clearTimeout(timer)
  timer = setTimeout(() => bubble?.classList.remove('is-visible'), 4000)
}

export const showThemeJokeKey = renderJokeBubble

export function initThemeControl(locale: Locale): void {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')
  if (!button) return

  let clicks = 0
  button.addEventListener('click', () => {
    clicks += 1
    renderJokeBubble(locale, pickJoke(clicks))
  })
}
