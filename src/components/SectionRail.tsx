import type { Locale } from '../content/i18n/types'
import type { Localized } from '../content/i18n/types'
import { translate } from '../locale'

export type RailEntry = { id: string; label: Localized }

/**
 * A map of a long document, derived from the record the page renders its
 * sections from (D10, Principle I). There is no build-time HTML scrape and no
 * runtime DOM walk: a DOM walk would produce a rail that is empty on first
 * paint, which makes FR-073 impossible rather than merely awkward.
 *
 * Everything here is complete in the prerendered document. The ONLY scripted
 * part is the follow-along mark, which src/enhance/section-rail.ts adds after
 * hydration; with scripting unavailable this stays a working list of anchor
 * links and only the highlight is absent (FR-072, FR-073).
 *
 * Anchor navigation remains the site's primary within-page mechanism (FR-076).
 * The rail is a view onto the `#` anchors the headings already carry, not a
 * replacement for them, which is why activating an entry is an ordinary
 * fragment navigation and the back button behaves.
 */

/**
 * Below this, a rail is chrome: a map of a document that needs no map. The CV
 * page has six sections and no other page reaches four, so the CV page is the
 * only page that gets one (FR-074, D10).
 */
const MINIMUM_ENTRIES = 4

export function SectionRail({ entries, locale }: { entries: RailEntry[]; locale: Locale }) {
  if (entries.length < MINIMUM_ENTRIES) return null

  const label = translate(locale, 'nav.onThisPage')
  const list = (
    <ul>
      {entries.map((entry) => (
        <li key={entry.id}>
          <a href={`#${entry.id}`} data-rail-link={entry.id}>
            {entry.label[locale]}
          </a>
        </li>
      ))}
    </ul>
  )

  return (
    <nav className="rail" aria-label={label} data-rail>
      {/*
        `<details>`, closed by default, following the same platform-native
        disclosure `src/components/StatsPanel.tsx` already uses for its own
        "show all" list (research D10's ladder: no library reaches for this).
        At narrow widths this is what makes the rail cost one line instead of
        six before the reader gets to the record — see the measurement in
        `styles/components.css` beside the media query that forces it open
        again past 1000px, where the rail is a sidebar rather than a stack.
        Works identically with scripting unavailable: `<details>` needs none.
      */}
      <details className="rail-details">
        <summary>{label}</summary>
        {list}
      </details>
    </nav>
  )
}
