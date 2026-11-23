import { initContactForm } from './contact-form'

/**
 * /services/'s enhancements, a chunk of its own: the sticky index follows the
 * scroll, and the contact form sends with fetch. The index is a plain list of
 * anchors without this, and the form posts and redirects without it.
 */
export function initServices(): void {
  initIndex()
  initContactForm()
}

/** Marks the index link of the service nearest the middle of the screen. */
function initIndex(): void {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-index] a')]
  const sections = links.flatMap((a) => {
    const el = document.getElementById(a.hash.slice(1))
    return el ? [{ a, el }] : []
  })
  if (!sections.length) return
  const mark = (target: HTMLAnchorElement) => {
    for (const { a } of sections) {
      if (a === target) a.setAttribute('aria-current', 'location')
      else a.removeAttribute('aria-current')
    }
  }
  mark(sections[0].a)
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) mark(sections.find((s) => s.el === entry.target)?.a ?? sections[0].a)
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  )
  for (const { el } of sections) observer.observe(el)
}
