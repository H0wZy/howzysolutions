import type { Locale } from '../content/i18n/types'
import { translate } from '../content/i18n/translate'
import { profile } from '../content/profile'

/**
 * Build-time markup only. The behaviour lives in src/enhance/terminal/mount.ts,
 * which finds these hooks and takes over. Rendering the shell here means the
 * terminal is part of the prerendered page rather than something that pops in.
 *
 * The input ships `disabled`: without JavaScript a visitor sees an inert prompt
 * instead of one that silently swallows what they type. mount() enables it.
 */

/**
 * The prompt quotes the author's real one — ~/.config/ohmyposh/h0wzy.omp.json,
 * which reads as a sentence rather than a sigil: session, then a connective
 * word, then a coloured segment, and the caret alone on the next line.
 *
 * Two deliberate departures from that file. It is a POSIX shell here, not
 * pwsh: `bash`, and a `/`-separated path, because that is the shell this site
 * is written about and the one every command below is spelled for. And no
 * Nerd Font glyphs: this site self-hosts JetBrains Mono and nothing else
 * (Principle II), so an icon font would render as tofu. Colour and spacing
 * carry the segments instead.
 */
const HOST = 'howzysolutions'
const SHELL = 'bash'
const CWD = '~/'

function Ps1({ locale }: { locale: Locale }) {
  return (
    // Decoration, not content: the input already carries its own accessible
    // name, so announcing the prompt again would only add noise.
    <p className="term-ps1" aria-hidden="true">
      <span className="term-ps1-session">
        {profile.handle}@{HOST}
      </span>{' '}
      <span className="term-ps1-word">{translate(locale, 'terminal.promptIn')}</span>{' '}
      <span className="term-ps1-path">{CWD}</span>{' '}
      <span className="term-ps1-word">{translate(locale, 'terminal.promptWith')}</span>{' '}
      <span className="term-ps1-shell">{SHELL}</span>
    </p>
  )
}

export function Terminal({ locale }: { locale: Locale }) {
  return (
    <div className="term" data-term>
      <div className="term-bar">
        <span className="dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="term-title">{translate(locale, 'terminal.label')}</span>
        <span className="term-badge" aria-hidden="true">
          {SHELL}
        </span>
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
        <Ps1 locale={locale} />
        <div className="term-entry">
          <label className="term-prompt" htmlFor="term-input">
            ❯
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
        </div>
      </form>
    </div>
  )
}
