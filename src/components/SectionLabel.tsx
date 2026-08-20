import type { Locale } from '../content/i18n/types'
import type { StringKey } from '../content/i18n/en'
import { translate } from '../locale'

/** Section heading rendered as an editor comment: `## the_whole_idea`. */
export function SectionLabel({ id, locale }: { id: StringKey; locale: Locale }) {
  return <p className="label">{translate(locale, id)}</p>
}
