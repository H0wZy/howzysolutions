import { about, contact, version, whoami } from './commands/identity'
import { projects } from './commands/projects'
import { ls, stack, stats } from './commands/surface'
import { clear, history, lang, open, theme } from './commands/effects'
import { translate } from '../content/i18n/translate'
import { ok, table, text, type Command } from './types'

/**
 * `help` is DERIVED from this registry rather than maintained beside it, so a
 * command cannot exist without appearing in help (FR-009). The help command is
 * declared here because it reads the registry it belongs to.
 */
export const help: Command = {
  name: 'help',
  aliases: ['?', '--help', '-h'],
  usage: 'help [command]',
  summaryKey: 'cmd.help',
  run: ({ args, locale }) => {
    const requested = args[0]
    if (requested) {
      const command = resolve(requested)
      if (command) {
        return ok([
          text(command.name, 'accent'),
          text(translate(locale, command.summaryKey)),
          text(translate(locale, 'terminal.usage', { usage: command.usage }), 'dim'),
          ...(command.aliases?.length
            ? [text(`aliases: ${command.aliases.join(', ')}`, 'dim')]
            : []),
        ])
      }
    }
    return ok([
      table(
        ['command', 'usage', ''],
        commands.map((c) => [c.name, c.usage, translate(locale, c.summaryKey)]),
      ),
    ])
  },
}

export const commands: Command[] = [
  help,
  version,
  whoami,
  about,
  projects,
  stack,
  stats,
  contact,
  open,
  ls,
  lang,
  theme,
  history,
  clear,
]

export function resolve(name: string): Command | undefined {
  const lower = name.toLowerCase()
  return commands.find((c) => c.name === lower || c.aliases?.includes(lower))
}

/** Every name a visitor could type, for did-you-mean and tab completion. */
export function invocableNames(): string[] {
  return commands.flatMap((c) => [c.name, ...(c.aliases ?? [])]).filter((n) => !n.startsWith('-'))
}
