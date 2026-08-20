/**
 * Terminal engine contract.
 * See specs/001-terminal-portfolio-rebrand/contracts/terminal-commands.md
 *
 * Nothing in src/terminal/ may import a framework or touch the DOM (Principle IV).
 * That is what lets the DOM renderer and the opt-in immersive renderer share one
 * implementation and one set of facts.
 */

import type { Locale } from '../content/i18n/types'
import type { ContentBundle } from '../content/types'
import type { Theme } from '../theme/types'
import type { StringKey } from '../content/i18n/en'

export type OutputLine =
  | { kind: 'text'; text: string; tone?: 'default' | 'dim' | 'accent' | 'error' }
  | { kind: 'pairs'; rows: Array<[label: string, value: string]> }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'link'; text: string; href: string }
  | { kind: 'blank' }

/**
 * Effects are DESCRIBED here and applied by the renderer. Keeping the engine
 * free of side effects is what makes `theme light` and the page's theme control
 * one code path instead of two (FR-015).
 */
export type Effect =
  | { type: 'set-locale'; locale: Locale }
  | { type: 'set-theme'; theme: Theme }
  | { type: 'clear' }
  | { type: 'navigate'; href: string }

/** Non-zero marks failure, mirroring shell convention. */
export type ExitStatus = 0 | 1 | 2

export type CommandResult = {
  lines: OutputLine[]
  effect?: Effect
  status: ExitStatus
}

export type CommandContext = {
  args: string[]
  flags: Record<string, string | boolean>
  locale: Locale
  theme: Theme
  content: ContentBundle
  /** Supplied by the renderer; the engine never records it itself. */
  history: string[]
}

export type Command = {
  name: string
  aliases?: string[]
  usage: string
  summaryKey: StringKey
  run: (ctx: CommandContext) => CommandResult
}

/* -- Construction helpers ------------------------------------------------- */

export const text = (
  value: string,
  tone?: 'default' | 'dim' | 'accent' | 'error',
): OutputLine => ({ kind: 'text', text: value, tone })

export const blank = (): OutputLine => ({ kind: 'blank' })

export const pairs = (rows: Array<[string, string]>): OutputLine => ({ kind: 'pairs', rows })

export const table = (head: string[], rows: string[][]): OutputLine => ({
  kind: 'table',
  head,
  rows,
})

export const link = (value: string, href: string): OutputLine => ({
  kind: 'link',
  text: value,
  href,
})

export const ok = (lines: OutputLine[], effect?: Effect): CommandResult => ({
  lines,
  effect,
  status: 0,
})

export const fail = (lines: OutputLine[], status: ExitStatus = 1): CommandResult => ({
  lines,
  status,
})
