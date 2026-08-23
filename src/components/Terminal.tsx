import type { Locale } from '../content/i18n/types'
import { translate } from '../content/i18n/translate'

/**
 * Build-time markup only. The behaviour lives in src/terminal/dom/mount.ts,
 * which finds these hooks and takes over. Rendering the shell here means the
 * terminal is part of the prerendered page rather than something that pops in.
 *
 * The input ships `disabled`: without JavaScript a visitor sees an inert prompt
 * instead of one that silently swallows what they type. mount() enables it.
 */
export function Terminal({ locale }: { locale: Locale }) {
  return (
    <div className="term" data-term>
      <div className="term-bar">
        <span className="term-title">{translate(locale, 'terminal.label')}</span>
      </div>

      <div
        className="term-output"
        data-term-output
        role="log"
        aria-live="polite"
        aria-atomic="false"
        tabIndex={0}
      >
        <div className="term-block">
          <div className="term-text tone-dim" data-term-hint>
            {translate(locale, 'terminal.hint')}
          </div>
        </div>
      </div>

      <form className="term-form" data-term-form>
        <label className="term-prompt" htmlFor="term-input">
          $
        </label>
        <input
          id="term-input"
          className="term-input"
          data-term-input
          type="text"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          disabled
          placeholder="help"
        />
      </form>
    </div>
  )
}
