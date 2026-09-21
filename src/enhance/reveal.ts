export function initReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>('.reveal')
  if (!targets.length) return

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => el.classList.add('is-visible'))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.12 },
  )
  targets.forEach((el) => observer.observe(el))
}
