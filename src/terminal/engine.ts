/**
 * The command engine. Pure by construction: no framework import, no DOM access,
 * no clock, no storage, no network (Principle IV). Both renderers consume this.
 */

import type { ContentBundle } from '../content/types'
import type { Locale } from '../content/i18n/types'
import { translate } from '../content/i18n/translate'
import { parse } from './parse'
import { closest } from './suggest'
import { invocableNames, resolve } from './registry'
import { fail, ok, text, type CommandResult } from './types'

const MAX_INPUT = 512

export type ExecuteContext = {
  locale: Locale
  content: ContentBundle
  history: string[]
}

export function execute(input: string, ctx: ExecuteContext): CommandResult {
  // Empty input produces nothing at all and does not enter history.
  if (input.trim().length === 0) return ok([])

  if (input.length > MAX_INPUT) {
    return fail([text(translate(ctx.locale, 'terminal.tooLong'), 'error')], 2)
  }

  const parsed = parse(input)
  if (!parsed) return ok([])

  const command = resolve(parsed.name)
  if (!command) {
    const suggestion = closest(parsed.name, invocableNames())
    return fail([
      text(translate(ctx.locale, 'terminal.notFound', { input: parsed.name }), 'error'),
      ...(suggestion
        ? [text(translate(ctx.locale, 'terminal.didYouMean', { candidate: suggestion }), 'dim')]
        : []),
      text(translate(ctx.locale, 'terminal.tryHelp'), 'dim'),
    ])
  }

  return command.run({
    args: parsed.args,
    flags: parsed.flags,
    locale: ctx.locale,
    content: ctx.content,
    history: ctx.history,
  })
}

export { invocableNames, resolve } from './registry'
export { completions } from './suggest'
