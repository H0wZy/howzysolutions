import { execute, completions, invocableNames } from '../../terminal/engine'
import type { Effect } from '../../terminal/types'
import { content } from '../../content'
import { translate } from '../../content/i18n/translate'
import type { Locale } from '../../content/i18n/types'
import { showThemeJokeKey } from '../theme-control'
import { counterpart } from '../../route'
import { smoothScrollBy } from '../scroll'
import { el, renderEcho, renderLine } from './render'

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

const SUGGESTIONS = ['help', 'projects', 'whoami', 'stats', 'stack', 'cv', 'contact', 'clear']

export function mountTerminal(root: HTMLElement, session: TerminalSession): void {
  const q = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)
  const output = q('[data-term-output]')
  const form = q<HTMLFormElement>('[data-term-form]')
  const input = q<HTMLInputElement>('[data-term-input]')
  const promptEl = q('[data-term-ps1]')
  if (!output || !form || !input) return

  // The prerendered input ships disabled, so a visitor without JavaScript sees an
  // inert prompt rather than one that silently swallows what they type.
  input.disabled = false
  input.setAttribute('aria-label', translate(session.locale, 'terminal.inputLabel'))
  output.setAttribute('aria-label', translate(session.locale, 'terminal.outputLabel'))

  let cursor = session.history.length
  const placeholderEl = q('[data-term-placeholder]')
  const ghostEl = q('[data-term-ghost]')
  const cursorEl = q('[data-term-cursor]')
  let suggestionIndex = 0

  const fade = (o = '') => {
    if (placeholderEl) placeholderEl.style.opacity = o
    if (cursorEl) cursorEl.style.opacity = o
  }

  const setPrompt = (t: string) => {
    if (placeholderEl) placeholderEl.textContent = input.value ? '' : t
    if (ghostEl) ghostEl.textContent = t
  }

  const syncCursor = () => {
    const val = input.value
    fade()
    setPrompt(val ? val.slice(0, input.selectionStart ?? val.length) : SUGGESTIONS[suggestionIndex])
  }

  setInterval(() => {
    if (!input.value && placeholderEl) {
      fade('0')
      setTimeout(() => {
        if (!input.value) {
          suggestionIndex = (suggestionIndex + 1) % 8
          setPrompt(SUGGESTIONS[suggestionIndex])
          requestAnimationFrame(() => {
            if (!input.value) fade()
          })
        }
      }, 300)
    }
  }, 3500)

  const scrollTerminal = () => {
    const s = root.closest('section') ?? root
    const d = Math.max(s.getBoundingClientRect().top - 80, root.getBoundingClientRect().bottom - innerHeight + 80)
    if (d > 2) smoothScrollBy(d)
  }
  const follow = () => requestAnimationFrame(() => { root.scrollTop = root.scrollHeight; scrollTerminal() })

  for (const e of ['input', 'keyup', 'click', 'select']) input.addEventListener(e, syncCursor)
  input.addEventListener('focus', scrollTerminal)
  syncCursor()

  /**
   * Scrollback repeats the prompt each command, as a shell does — and repeats it
   * by CLONING the live one, so the markup has a single definition
   * (src/components/Terminal.tsx) and cannot drift from what sits below it.
   */
  const echoPrompt = () => promptEl ? (promptEl.cloneNode(true) as HTMLElement) : null

  const applyEffect = (effect: Effect) => {
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
          sessionStorage.setItem('h0wzy.scroll', String(scrollY))
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

  const run = (raw: string) => {
    const trimmed = raw.trim()

    // Empty input leaves no trace and no history entry (error contract).
    if (trimmed.length === 0) return

    const result = execute(raw, {
      locale: session.locale,
      content,
      history: session.history,
    })

    const block = el('div', `term-block${result.status ? ' is-error' : ''}`)
    const prompt = echoPrompt()
    if (prompt) block.append(prompt)
    block.append(renderEcho(trimmed), ...result.lines.map(renderLine))
    output.append(block)

    session.history.push(trimmed)
    cursor = session.history.length

    if (result.effect) applyEffect(result.effect)
    follow()
    input.focus({ preventScroll: true })
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const val = input.value
    input.value = ''
    syncCursor()
    run(val)
  })

  input.addEventListener('keydown', (e) => {
    // History recall (FR-012).
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      if (!session.history.length) return
      e.preventDefault()
      cursor = e.key === 'ArrowUp' ? Math.max(0, cursor - 1) : Math.min(session.history.length, cursor + 1)
      input.value = session.history[cursor] ?? ''
      syncCursor()
      return
    }

    // Completion: loop through suggestions when empty, or complete prefix (FR-012).
    if (e.key === 'Tab') {
      e.preventDefault()
      const val = input.value.trim()
      const idx = SUGGESTIONS.indexOf(val)
      if (!val || idx !== -1) {
        if (idx !== -1) suggestionIndex = (idx + 1) % 8
        input.value = SUGGESTIONS[suggestionIndex]
        syncCursor()
        return
      }

      const matches = completions(val, invocableNames())
      if (matches.length === 1) {
        input.value = matches[0]
        syncCursor()
      } else if (matches.length > 1) {
        const block = el('div', 'term-block')
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
        follow()
      }
    }
  })

  root.addEventListener('keydown', (e) => {
    if (document.activeElement !== input && !e.ctrlKey && !e.metaKey && (e.key.length === 1 || e.key === 'Tab')) input.focus()
  })
  root.addEventListener('mouseup', () => getSelection()?.toString() || input.focus())
}
