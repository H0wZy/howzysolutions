/**
 * Scroll preservation across a locale switch.
 *
 * The control is an ordinary link, so it works with no JavaScript at all — this
 * only adds back the one thing a navigation costs that an in-place swap would
 * not: the visitor's place on the page.
 */

const KEY = 'h0wzy.scroll'

export function initLocaleControl(): void {
  const link = document.querySelector<HTMLAnchorElement>('[data-locale-link]')

  link?.addEventListener('click', () => {
    try {
      sessionStorage.setItem(KEY, String(window.scrollY))
    } catch {
      /* Storage unavailable: the link still navigates, just without the restore. */
    }
  })

  // Restore once, then forget, so an ordinary later visit starts at the top.
  try {
    const saved = sessionStorage.getItem(KEY)
    if (saved === null) return
    sessionStorage.removeItem(KEY)
    const y = Number(saved)
    if (Number.isFinite(y) && y > 0) {
      window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior })
    }
  } catch {
    /* No storage, no restore. Nothing else depends on it. */
  }
}
