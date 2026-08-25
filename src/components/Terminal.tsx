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
 *
 * There is no title bar, no badge and no first-use hint. A terminal that opens
 * with a prompt and nothing else is the thing itself; the chrome was a picture
 * of one. What replaced the hint is the input's `help` placeholder, which sits
 * exactly where a visitor is already looking.
 */

/**
 * The prompt quotes the author's real one — ~/.config/ohmyposh/h0wzy.omp.json,
 * which reads as a sentence rather than a sigil: session, then a connective
 * word, then the path, and the caret alone on the next line.
 *
 * Two deliberate departures from that file. It is a POSIX shell here, not
 * pwsh: a `/`-separated path, because that is the shell this site is written
 * about. And no Nerd Font glyphs: this site self-hosts JetBrains Mono and
 * nothing else (Principle II), so an icon font would render as tofu. Colour
 * carries the segments instead.
 *
 * The path is fixed. The commands are a portfolio's, not a filesystem's —
 * nothing here changes directory, so a prompt segment that could change would
 * be a promise the terminal does not keep (CL-003).
 */
const HOST = 'howzysolutions'
const CWD = '~'

function Ps1({ locale }: { locale: Locale }) {
  return (
    // Decoration, not content: the input already carries its own accessible
    // name, so announcing the prompt again would only add noise.
    <p className="term-ps1" data-term-ps1 aria-hidden="true">
      <span className="term-ps1-session">
        {profile.handle}@{HOST}
      </span>{' '}
      <span className="term-ps1-word">{translate(locale, 'terminal.promptIn')}</span>{' '}
      <span className="term-ps1-path">{CWD}</span>
    </p>
  )
}

export function Terminal({ locale }: { locale: Locale }) {
  return (
    /*
     * One scroll region, not two panes. The prompt is the last thing in the
     * flow, so a command pushes its output DOWN and the prompt follows it —
     * what every terminal does, and what a fixed input bar under a separate
     * scrolling pane could never do. tabIndex makes that region scrollable
     * from the keyboard (SC 2.1.1).
     */
    <div
      className="term"
      data-term
      tabIndex={0}
      role="group"
      aria-label={translate(locale, 'terminal.label')}
    >
      <div
        className="term-output"
        data-term-output
        role="log"
        aria-live="polite"
        aria-atomic="false"
      />

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
