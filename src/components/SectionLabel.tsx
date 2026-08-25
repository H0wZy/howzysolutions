import type { Locale } from '../content/i18n/types'
import type { StringKey } from '../content/i18n/en'
import { translate } from '../locale'

/**
 * Section heading rendered as an editor comment, `## the_whole_idea`, and as a
 * real in-page anchor.
 *
 * The `##` is markup rather than a `::before` so it sits INSIDE the link: the
 * marker is the affordance, and clicking it jumps to the topic. This is what
 * research D8 resolved to — the labels stay on every section because they are
 * the site's topic index, not a decorative eyebrow repeated six times.
 *
 * Stays a <p>, not a heading: `work`, `stats` and `contact` already carry their
 * own <h2> immediately after this, and a second sibling <h2> would duplicate
 * the outline rather than describe it.
 */
export function SectionLabel({
  id,
  anchor,
  locale,
}: {
  id: StringKey
  /** The `id` of the section this labels. Home puts it on the <section>. */
  anchor: string
  locale: Locale
}) {
  return (
    <p className="label">
      <a className="label-link" href={`#${anchor}`}>
        <span className="label-hash" aria-hidden="true">
          ##
        </span>
        {translate(locale, id)}
      </a>
    </p>
  )
}
