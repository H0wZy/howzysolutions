const BAND = '0px 0px -70% 0px'

export function initSectionRail(): void {
  const rail = document.querySelector<HTMLElement>('[data-rail]')
  if (!rail) return

  const links = new Map<string, HTMLAnchorElement>()
  rail.querySelectorAll<HTMLAnchorElement>('[data-rail-link]').forEach((link) => {
    const id = link.dataset.railLink
    if (id) links.set(id, link)
  })
  if (!links.size) return

  const sections = [...links.keys()]
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => !!el)

  if (!sections.length) return

  const visible = new Set<string>()
  let previous: string | undefined

  const mark = () => {
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
    const current = atBottom
      ? sections.at(-1)?.id
      : [...sections].reverse().find((section) => visible.has(section.id))?.id ?? previous

    previous = current

    links.forEach((link, id) => {
      if (id === current) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    })
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
