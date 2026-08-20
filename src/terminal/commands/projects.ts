import { PROJECT_KIND, PROJECT_STATE, type Project } from '../../content/types'
import type { Locale } from '../../content/i18n/types'
import { translate } from '../../content/i18n/translate'
import { closest } from '../suggest'
import { blank, fail, ok, table, text, type Command, type OutputLine } from '../types'

export const projects: Command = {
  name: 'projects',
  aliases: ['work', 'ls projects'],
  usage: 'projects [--list-all | <id> | --stack <tech> | --kind <kind>]',
  summaryKey: 'cmd.projects',
  run: ({ args, flags, content, locale }) => {
    const all = content.projects

    if (typeof flags.stack === 'string') {
      const tech = content.technologies.find((t) => t.id === flags.stack)
      if (!tech) {
        const suggestion = closest(
          flags.stack,
          content.technologies.map((t) => t.id),
        )
        return fail([
          text(translate(locale, 'terminal.noSuchTech', { id: flags.stack }), 'error'),
          ...(suggestion
            ? [text(translate(locale, 'terminal.didYouMean', { candidate: suggestion }), 'dim')]
            : []),
        ])
      }
      const matched = all.filter((p) => p.stack.some((g) => g.items.includes(tech.id)))
      return ok([text(tech.name, 'accent'), blank(), listOf(matched, locale)])
    }

    if (typeof flags.kind === 'string') {
      const kinds = Object.keys(PROJECT_KIND)
      if (!kinds.includes(flags.kind)) {
        return fail(
          [
            text(translate(locale, 'terminal.usage', { usage: projects.usage }), 'error'),
            text(translate(locale, 'terminal.badValue', { values: kinds.join(' | ') }), 'dim'),
          ],
          2,
        )
      }
      return ok([listOf(all.filter((p) => p.kind === flags.kind), locale)])
    }

    const id = args[0]
    if (id) {
      const project = all.find((p) => p.id === id)
      if (!project) {
        const suggestion = closest(id, all.map((p) => p.id))
        return fail([
          text(translate(locale, 'terminal.noSuchProject', { id }), 'error'),
          ...(suggestion
            ? [text(translate(locale, 'terminal.didYouMean', { candidate: suggestion }), 'dim')]
            : []),
        ])
      }

      const lines: OutputLine[] = [
        text(project.name, 'accent'),
        text(
          `${translate(locale, PROJECT_STATE[project.state])} · ${translate(
            locale,
            PROJECT_KIND[project.kind],
          )} · ${project.commits} ${translate(locale, 'work.commits')}`,
          'dim',
        ),
        blank(),
        text(project.summary[locale]),
        blank(),
        text(`## ${translate(locale, 'project.problem')}`, 'dim'),
        text(project.problem[locale]),
        blank(),
        text(`## ${translate(locale, 'project.capabilities')}`, 'dim'),
        ...project.capabilities[locale].map((line) => text(`– ${line}`)),
        blank(),
        text(`## ${translate(locale, 'project.stack')}`, 'dim'),
        ...project.stack.map((group) =>
          text(
            `${translate(locale, `stack.${group.group}` as 'stack.frontend')}: ${group.items.join(
              ' · ',
            )}`,
          ),
        ),
        blank(),
        // FR-004 holds in the terminal too: limitations are never the part that
        // gets trimmed for brevity.
        text(`## ${translate(locale, 'project.limitations')}`, 'dim'),
        ...project.limitations[locale].map((line) => text(`! ${line}`, 'accent')),
        blank(),
        text(`/work/${project.id}/`, 'dim'),
      ]
      return ok(lines)
    }

    return ok([listOf(all, locale)])
  },
}

function listOf(list: Project[], locale: Locale): OutputLine {
  return table(
    ['id', 'state', 'commits', 'summary'],
    list.map((p) => [
      p.id,
      translate(locale, PROJECT_STATE[p.state]),
      String(p.commits),
      p.summary[locale],
    ]),
  )
}
