import { TECH_CATEGORY } from '../../content/types'
import { periodLabel, WAKATIME } from '../../content/stats'
import { translate } from '../../content/i18n/translate'
import { blank, link, ok, table, text, type Command } from '../types'

export const stack: Command = {
  name: 'stack',
  aliases: ['skills'],
  usage: 'stack',
  summaryKey: 'cmd.stack',
  run: ({ content }) => {
    const lines = []
    for (const category of Object.keys(TECH_CATEGORY)) {
      const inCategory = content.technologies.filter((t) => t.category === category)
      if (inCategory.length === 0) continue
      lines.push(text(`## ${category}`, 'dim'))
      lines.push(
        table(
          ['technology', 'projects'],
          inCategory.map((t) => [
            t.name,
            // Counts are derived, never stored (data-model.md).
            String(
              content.projects.filter((p) => p.stack.some((g) => g.items.includes(t.id))).length,
            ),
          ]),
        ),
      )
      lines.push(blank())
    }
    lines.pop()
    return ok(lines)
  },
}

export const stats: Command = {
  name: 'stats',
  usage: 'stats [--languages | --editors | --projects]',
  summaryKey: 'cmd.stats',
  run: ({ flags, content, locale }) => {
    const s = content.stats
    // FR-027, FR-034: the range prints with the figures, every time, honest about staleness.
    const period = periodLabel(s)
    const range = translate(locale, period.key, period.params)

    const section = (key: 'languages' | 'editors' | 'projects' | 'categories') =>
      table(
        ['name', '%', 'time'],
        s[key].map((slice) => [slice.name, `${slice.percent.toFixed(1)}%`, slice.text]),
      )

    if (flags.languages) return ok([text(range, 'dim'), section('languages')])
    if (flags.editors) return ok([text(range, 'dim'), section('editors')])
    if (flags.projects) return ok([text(range, 'dim'), section('projects')])

    const lines = [
      text(`${s.humanReadableTotal} ${translate(locale, 'stats.total')}`, 'accent'),
      /*
       * The source is a link here for the same reason it is one on the page,
       * and the period drops to its own dim line rather than riding an em dash
       * into the anchor text — which is the shape the --languages/--editors
       * branches above already print.
       */
      link(`${translate(locale, 'stats.sourceLabel')} ${WAKATIME.name}`, WAKATIME.profileUrl),
      text(range, 'dim'),
    ]
    if (s.isFallback) {
      lines.push(text(translate(locale, 'stats.stale', { date: s.capturedAt.slice(0, 10) }), 'dim'))
    }
    lines.push(
      blank(),
      text(`## ${translate(locale, 'stats.languages')}`, 'dim'),
      section('languages'),
      blank(),
      text(`## ${translate(locale, 'stats.editors')}`, 'dim'),
      section('editors'),
      blank(),
      text(`## ${translate(locale, 'stats.projects')}`, 'dim'),
      section('projects'),
      blank(),
      // FR-028: the two periods never blur into one another.
      text(translate(locale, 'stats.experienceNote'), 'dim'),
    )
    return ok(lines)
  },
}

export const ls: Command = {
  name: 'ls',
  usage: 'ls',
  summaryKey: 'cmd.ls',
  run: ({ content }) =>
    ok([
      text('about.md   contact.md   stack   stats'),
      text(`work/      ${content.projects.length} entries`),
    ]),
}
