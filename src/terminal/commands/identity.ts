import { experienceDuration } from '../../content/profile'
import { periodLabel } from '../../content/stats'
import { translate } from '../../content/i18n/translate'
import { blank, ok, pairs, text, type Command } from '../types'

/** `h0wzy --version` — the semver IS the experience, so it increments on its own. */
export const version: Command = {
  name: 'version',
  aliases: ['--version', '-v'],
  usage: 'h0wzy --version',
  summaryKey: 'cmd.version',
  run: ({ content, locale }) => {
    // Same build-time value the page renders, so the two cannot disagree.
    const { years, months } = experienceDuration
    const { stats } = content
    const period = periodLabel(stats)
    return ok([
      text(`${content.profile.handle} ${years}.${months}.0`, 'accent'),
      // FR-028: two measurements, two periods, never presented as one claim.
      text(
        `${translate(locale, 'hero.experience', { years, months })} (${translate(
          locale,
          'hero.experienceSince',
        )})`,
      ),
      text(
        `${stats.humanReadableTotal} ${translate(locale, 'stats.total')} — ${translate(
          locale,
          period.key,
          period.params,
        )}`,
        'dim',
      ),
    ])
  },
}

export const whoami: Command = {
  name: 'whoami',
  usage: 'whoami',
  summaryKey: 'cmd.whoami',
  run: ({ content, locale }) =>
    ok([
      text(content.profile.name, 'accent'),
      text(content.profile.tagline[locale]),
      blank(),
      pairs([
        [translate(locale, 'hero.role'), content.profile.location[locale]],
      ]),
    ]),
}

export const about: Command = {
  name: 'about',
  aliases: ['cat about.md'],
  usage: 'about',
  summaryKey: 'cmd.about',
  run: ({ content, locale }) => {
    const lines = []
    for (const paragraph of content.profile.bio[locale]) {
      lines.push(text(paragraph), blank())
    }
    lines.pop()
    return ok(lines)
  },
}

export const contact: Command = {
  name: 'contact',
  usage: 'contact',
  summaryKey: 'cmd.contact',
  run: ({ content, locale }) =>
    ok([
      text(translate(locale, 'contact.heading')),
      blank(),
      ...content.profile.contacts.map((c) => ({
        kind: 'link' as const,
        text: `${translate(locale, c.labelKey)}: ${c.label}`,
        href: c.href,
      })),
    ]),
}
