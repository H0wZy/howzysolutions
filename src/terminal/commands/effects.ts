import { LOCALES, isLocale } from '../../content/i18n/types'
import { THEMES, isTheme } from '../../theme/types'
import { translate } from '../../content/i18n/translate'
import { closest } from '../suggest'
import { fail, ok, text, type Command } from '../types'

/**
 * These commands RETURN effect descriptors and never perform them. That is what
 * keeps the engine pure and makes `lang pt` and the page's language control one
 * code path (Principle IV, FR-015).
 */

export const lang: Command = {
  name: 'lang',
  aliases: ['language', 'idioma'],
  usage: 'lang [en | pt]',
  summaryKey: 'cmd.lang',
  run: ({ args, locale }) => {
    const requested = args[0]
    if (!requested) return ok([text(translate(locale, 'terminal.currentLocale', { locale }))])
    if (!isLocale(requested)) {
      return fail(
        [
          text(translate(locale, 'terminal.usage', { usage: lang.usage }), 'error'),
          text(translate(locale, 'terminal.badValue', { values: LOCALES.join(' | ') }), 'dim'),
        ],
        2,
      )
    }
    return ok(
      [text(translate(requested, 'terminal.localeSet', { locale: requested }), 'accent')],
      { type: 'set-locale', locale: requested },
    )
  },
}

export const theme: Command = {
  name: 'theme',
  aliases: ['tema'],
  usage: 'theme [dark | light]',
  summaryKey: 'cmd.theme',
  run: ({ args, locale, theme: current }) => {
    const requested = args[0]
    if (!requested)
      return ok([text(translate(locale, 'terminal.currentTheme', { theme: current }))])
    if (!isTheme(requested)) {
      return fail(
        [
          text(translate(locale, 'terminal.usage', { usage: theme.usage }), 'error'),
          text(translate(locale, 'terminal.badValue', { values: THEMES.join(' | ') }), 'dim'),
        ],
        2,
      )
    }
    return ok([text(translate(locale, 'terminal.themeSet', { theme: requested }), 'accent')], {
      type: 'set-theme',
      theme: requested,
    })
  },
}

export const clear: Command = {
  name: 'clear',
  aliases: ['cls'],
  usage: 'clear',
  summaryKey: 'cmd.clear',
  run: () => ok([], { type: 'clear' }),
}

export const open: Command = {
  name: 'open',
  usage: 'open <id>',
  summaryKey: 'cmd.open',
  run: ({ args, content, locale }) => {
    const id = args[0]
    if (!id) return fail([text(translate(locale, 'terminal.usage', { usage: open.usage }))], 2)
    const project = content.projects.find((p) => p.id === id)
    if (!project) {
      const suggestion = closest(id, content.projects.map((p) => p.id))
      return fail([
        text(translate(locale, 'terminal.noSuchProject', { id }), 'error'),
        ...(suggestion
          ? [text(translate(locale, 'terminal.didYouMean', { candidate: suggestion }), 'dim')]
          : []),
      ])
    }
    return ok([text(`/work/${project.id}/`, 'dim')], {
      type: 'navigate',
      href: `/work/${project.id}/`,
    })
  },
}

export const history: Command = {
  name: 'history',
  usage: 'history',
  summaryKey: 'cmd.history',
  run: ({ history: entries, locale }) =>
    entries.length === 0
      ? ok([text(translate(locale, 'terminal.emptyHistory'), 'dim')])
      : ok(entries.map((entry, i) => text(`${String(i + 1).padStart(4)}  ${entry}`))),
}
