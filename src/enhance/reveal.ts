/**
 * Reveal-on-scroll. Replaces what framer-motion did (research D1) at a fraction
 * of a kilobyte, using the platform rather than a library.
 */
export function initReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>('.reveal')
  if (targets.length === 0) return

  // FR-025: under reduced motion the final state is applied immediately and no
  // animation runs. CSS already pins it; this keeps the class state consistent.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => el.classList.add('is-visible'))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.12 },
  )
  targets.forEach((el) => observer.observe(el))
}
