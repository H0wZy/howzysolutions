import type {
  CvAward,
  CvCertification,
  CvEducation,
  CvRole,
  CvView,
} from '../../content/types'
import { educationRange } from '../../content/cv'
import { translate } from '../../content/i18n/translate'
import type { Locale } from '../../content/i18n/types'
import { blank, link, ok, pairs, table, text, type Command, type OutputLine } from '../types'

/**
 * `cv` — the professional record, and the download.
 *
 * Reads content.cv, which is the same typed module src/pages/Cv.tsx renders
 * from. There is no second path to the facts, so the page and the terminal
 * cannot diverge (FR-067, SC-014).
 *
 * No React, no renderer, no DOM: purity.test.ts asserts that across this
 * directory and will fail if it is violated (Principle IV, FR-048). No Effect
 * either — the command returns link lines and the renderer makes them
 * activatable, exactly as `contact` and `stats` already do (FR-068).
 *
 * `help` needs no entry authored: registry.ts derives it from the commands
 * array, so registering this command is what puts it in help with the same
 * usage and summary shape as every other (FR-066).
 *
 * Contract: specs/003-cv-experience-page/contracts/cv-command.md
 */

function monthLabel(value: string): string {
  const [year, month] = value.split('-')
  return month ? `${month}/${year}` : year
}

/** FR-055: an ongoing role ends in a translated word, never a computed date. */
function rangeLabel(role: CvRole, locale: Locale): string {
  const end = role.end ? monthLabel(role.end) : translate(locale, 'cv.present')
  return translate(locale, 'work.period', { start: monthLabel(role.start), end })
}

function entriesOf<T>(cv: CvView, kind: string): T[] {
  return (cv.sections.find((section) => section.kind === kind)?.entries ?? []) as T[]
}

/**
 * The download lines, active locale FIRST (FR-057), the other second and
 * labelled with the language it delivers (FR-058), both stating size and
 * language before activation (FR-059). A document absent at extraction emits
 * no line at all rather than a link to a 404 (FR-060).
 */
function downloadLines(cv: CvView, locale: Locale): OutputLine[] {
  const other: Locale = locale === 'en' ? 'pt' : 'en'
  const ordered = [locale, other]
    .map((wanted) => cv.documents.find((doc) => doc.locale === wanted))
    .filter((doc) => doc?.present && doc.href && doc.filename)

  if (ordered.length === 0) {
    return [text(translate(locale, 'cv.unavailableAll'), 'dim')]
  }

  return ordered.map((doc) => {
    const size = `${(doc!.bytes / 1024).toFixed(1)} KB`
    const language = translate(locale, `cv.language.${doc!.locale}`)
    return link(`${doc!.filename}  ${size}, ${language}`, doc!.href!)
  })
}

export const cv: Command = {
  name: 'cv',
  // `resume` is here because it is what a visitor is most likely to type, even
  // though the route Assumption rejects /resume/ as the URL. An alias costs
  // nothing; a wrong guess costs a 404.
  aliases: ['resume', 'curriculum'],
  usage: 'cv [--download]',
  summaryKey: 'cmd.cv',
  run: ({ flags, locale, content }) => {
    const record = content.cv

    if (flags.download === true || flags.d === true) {
      return ok(downloadLines(record, locale))
    }

    const roles = entriesOf<CvRole>(record, 'experience')
    const awards = entriesOf<CvAward>(record, 'awards')
    const education = entriesOf<CvEducation>(record, 'education')
    const certifications = entriesOf<CvCertification>(record, 'certifications')

    const lines: OutputLine[] = [
      text(`${content.profile.name} · ${record.headline[locale]}`, 'accent'),
      blank(),
      table(
        ['role', 'dates', ''],
        roles.map((role) => [
          role.client ? `${role.employer} | ${role.client}` : role.employer,
          rangeLabel(role, locale),
          role.title[locale],
        ]),
      ),
      blank(),
      pairs([
        [translate(locale, 'cv.counts.awards'), String(awards.length)],
        [
          translate(locale, 'cv.counts.education'),
          education
            .map((entry) => `${entry.institution}, ${educationRange(entry.institution, entry.end)}`)
            .join('; '),
        ],
        [translate(locale, 'cv.counts.certifications'), String(certifications.length)],
      ]),
      blank(),
    ]

    // FR-056, FR-080: the same wording grammar the statistics panel uses for
    // its period, so a visitor reading both is not told the same kind of thing
    // two different ways.
    lines.push(
      text(
        record.isFallback
          ? translate(locale, 'cv.capturedFallback')
          : translate(locale, 'cv.captured', {
              source: `curriculum-vitae@${record.sourceCommit}`,
              date: record.capturedAt.slice(0, 10),
            }),
        'dim',
      ),
      blank(),
      text(`cv --download   ${translate(locale, 'cv.downloadHint')}`, 'dim'),
    )

    return ok(lines)
  },
}
