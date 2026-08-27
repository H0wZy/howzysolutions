/**
 * The rail's follow-along mark, and nothing else (FR-072).
 *
 * The rail itself is complete in the prerendered document: a labelled <nav>
 * containing real anchor links, rendered from the CV record. With scripting
 * unavailable it stays exactly that, and only this highlight is absent
 * (FR-073, SC-008). Nothing here makes content appear.
 *
 * Framework-free, in the directory that already holds reveal.ts, which
 * implements this same pattern. The capability never needed a component
 * library — recorded honestly in research.md, open item 1.
 *
 * Runs strictly after hydrateRoot resolves, so it never races React for the
 * same nodes (research D3).
 */

/**
 * The top band of the viewport: the root is shrunk to its top 30%, a section
 * counts as reached once its content enters that region, and the section being
 * read is the LAST one to have done so (see `mark`).
 *
 * A band across the middle was tried first and rejected on this reasoning: the
 * page's last section is the shortest, and a document cannot always scroll far
 * enough to push its final section across the middle of the screen. A rule
 * that can never mark the last entry is broken at exactly the place a reader
 * notices.
 *
 * NOT VERIFIED IN A BROWSER. IntersectionObserver does not run in a frame that
 * is not being composited, which is the state the automated preview ran in, so
 * this behaviour is argued rather than measured. It is the one part of this
 * feature that needs a human to scroll the page and watch the mark before it
 * can be called done — quickstart.md, Phase E, SC-013.
 */
const BAND = '0px 0px -70% 0px'

export function initSectionRail(): void {
  const rail = document.querySelector<HTMLElement>('[data-rail]')
  if (!rail) return

  const links = new Map<string, HTMLAnchorElement>()
  for (const link of rail.querySelectorAll<HTMLAnchorElement>('[data-rail-link]')) {
    const id = link.dataset.railLink
    if (id) links.set(id, link)
  }
  if (links.size === 0) return

  const sections = [...links.keys()]
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null)

  if (sections.length === 0) return

  const visible = new Set<string>()
  let previous: string | undefined

  const mark = () => {
    /*
     * The LAST section in document order that has entered the top band: when
     * two are in it, the reader has just moved into the later one, and when
     * scrolling back up the earlier one becomes last again. Document order
     * decides rather than callback order, so the answer does not depend on
     * which entry the observer happened to report first.
     */
    const current = [...sections].reverse().find((section) => visible.has(section.id))?.id ?? previous

    // Nothing in the band happens above the first heading and between two
    // sections. Holding the previous mark there beats flickering the rail
    // empty for a reader who has not gone anywhere.
    previous = current

    for (const [id, link] of links) {
      if (id === current) {
        // aria-current carries the state; CSS reads it. The mark is
        // programmatic first and painted second, never colour alone
        // (FR-075, Principle III).
        link.setAttribute('aria-current', 'true')
      } else {
        link.removeAttribute('aria-current')
      }
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id)
        else visible.delete(entry.target.id)
      }
      mark()
    },
    { rootMargin: BAND },
  )

  for (const section of sections) observer.observe(section)
}
