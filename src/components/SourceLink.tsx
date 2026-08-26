import type { Locale } from '../content/i18n/types'
import { WAKATIME } from '../content/stats'
import { translate } from '../locale'

/**
 * "Source: WakaTime", where only the product name carries the link.
 *
 * FR-027 says a figure is never published without its source beside it. This is
 * that rule one step further: the source is not merely named, it opens — so the
 * snapshot committed to this repo stops being the only thing a reader has to
 * take on trust.
 *
 * One component rather than two spellings, because the parts that matter are
 * the parts that drift. `rel` is not decoration: a tab opened with `_blank` can
 * reach back through `window.opener`, and noreferrer both shuts that door and
 * withholds the referrer on the way out. The label and the name are separate
 * for the same reason they are separate in the dictionaries — only the label
 * translates (`stats.sourceLabel`); the product name is the same word in both.
 */
export function SourceLink({ locale }: { locale: Locale }) {
  return (
    <>
      {translate(locale, 'stats.sourceLabel')}{' '}
      <a href={WAKATIME.profileUrl} target="_blank" rel="noreferrer">
        {WAKATIME.name}
      </a>
    </>
  )
}
