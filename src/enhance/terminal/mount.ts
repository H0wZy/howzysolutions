import { execute } from '../../terminal/engine'
import { completions, invocableNames } from '../../terminal/engine'
import type { Effect } from '../../terminal/types'
import { content } from '../../content'
import { translate } from '../../content/i18n/translate'
import type { Locale } from '../../content/i18n/types'
import { showThemeJokeKey } from '../theme-control'
import { counterpart } from '../../route'
import { renderEcho, renderLine } from './render'

/**
 * The canonical renderer. Vanilla DOM by design: the engine is framework-free
 * (Principle IV), the page is prerendered, and a command prompt is an input and
 * a list — React would cost 117 KB for that (research D2).
 *
 * Accessibility is the non-negotiable part (Principle III, research D8):
 * a real <input> in a <form> gets the mobile keyboard, IME composition, paste
 * and autofill for free, and role="log" + aria-live="polite" announces output
 * without stealing focus from the input.
 */

export type TerminalSession = {
  /** Submitted inputs, oldest first. Owned by the renderer, not the engine. */
  history: string[]
  locale: Locale
}

export function mountTerminal(root: HTMLElement, session: TerminalSession): void {
  const outputEl = root.querySelector<HTMLElement>('[data-term-output]')
  const formEl = root.querySelector<HTMLFormElement>('[data-term-form]')
  const inputEl = root.querySelector<HTMLInputElement>('[data-term-input]')
  const hint = root.querySelector<HTMLElement>('[data-term-hint]')
  if (!outputEl || !formEl || !inputEl) return

  // Narrowing does not survive into the hoisted function declarations below.
  const output = outputEl
  const form = formEl
  const input = inputEl

  // The prerendered input ships disabled, so a visitor without JavaScript sees an
  // inert prompt rather than one that silently swallows what they type.
  input.disabled = false
  input.setAttribute('aria-label', translate(session.locale, 'terminal.inputLabel'))
  output.setAttribute('aria-label', translate(session.locale, 'terminal.outputLabel'))

  let cursor = session.history.length

  const scrollToEnd = () => {
    output.scrollTop = output.scrollHeight
  }

  function applyEffect(effect: Effect): void {
    switch (effect.type) {
      case 'clear':
        output.replaceChildren()
        break
      case 'joke':
        // The exact line the terminal just printed, not a freshly picked one —
        // same bubble the chrome button's own click uses (FR-015).
        showThemeJokeKey(session.locale, effect.key)
        break
      case 'set-locale':
        // Each locale is a real prerendered document, so switching is a
        // navigation to the counterpart URL — the same thing the chrome's
        // language link does (FR-015). Scroll is preserved the same way.
        try {
          sessionStorage.setItem('h0wzy.scroll', String(window.scrollY))
        } catch {
          /* No storage, no restore; the navigation still happens. */
        }
        window.location.assign(counterpart(window.location.pathname, effect.locale))
        break
      case 'navigate':
        window.location.assign(effect.href)
        break
    }
  }

  function run(raw: string): void {
    const trimmed = raw.trim()

    // Empty input leaves no trace and no history entry (error contract).
    if (trimmed.length === 0) return

    const result = execute(raw, {
      locale: session.locale,
      content,
      history: session.history,
    })

    const block = document.createElement('div')
    block.className = `term-block${result.status === 0 ? '' : ' is-error'}`
    block.append(renderEcho(trimmed))
    for (const line of result.lines) block.append(renderLine(line))
    output.append(block)

    session.history.push(trimmed)
    cursor = session.history.length
    if (hint) hint.hidden = true

    if (result.effect) applyEffect(result.effect)
    scrollToEnd()
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const value = input.value
    input.value = ''
    run(value)
  })

  input.addEventListener('keydown', (event) => {
    // History recall (FR-012).
    if (event.key === 'ArrowUp') {
      if (session.history.length === 0) return
      event.preventDefault()
      cursor = Math.max(0, cursor - 1)
      input.value = session.history[cursor] ?? ''
      return
    }
    if (event.key === 'ArrowDown') {
      if (session.history.length === 0) return
      event.preventDefault()
      cursor = Math.min(session.history.length, cursor + 1)
      input.value = cursor === session.history.length ? '' : (session.history[cursor] ?? '')
      return
    }

    // Completion: unique match completes, several report the candidates (FR-012).
    if (event.key === 'Tab') {
      event.preventDefault()
      const partial = input.value.trim()
      if (partial.length === 0) return
      const matches = completions(partial, invocableNames())
      if (matches.length === 1) {
        input.value = `${matches[0]} `
      } else if (matches.length > 1) {
        const block = document.createElement('div')
        block.className = 'term-block'
        block.append(
          renderLine({
            kind: 'text',
            text: translate(session.locale, 'terminal.candidates', {
              candidates: matches.join('  '),
            }),
            tone: 'dim',
          }),
        )
        output.append(block)
        scrollToEnd()
      }
    }
  })

  // Clicking anywhere in the terminal focuses the prompt, the way a terminal
  // behaves — but never steals a selection the visitor is making.
  root.addEventListener('mouseup', () => {
    if ((window.getSelection()?.toString().length ?? 0) > 0) return
    input.focus()
  })
}
