const BAND = '0px 0px -70% 0px'

export function initSectionRail(): void {
  const rail = document.querySelector<HTMLElement>('[data-rail]')
  if (!rail) return

  const links = new Map<string, HTMLAnchorElement>()
  rail.querySelectorAll<HTMLAnchorElement>('[data-rail-link]').forEach((l) => l.dataset.railLink && links.set(l.dataset.railLink, l))
  if (!links.size) return

  const sections = [...links.keys()].map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
  if (!sections.length) return

  const visible = new Set<string>()
  let previous: string | undefined

  const mark = () => {
    const atBottom = scrollY + innerHeight >= document.documentElement.scrollHeight - 2
    const current = atBottom
      ? sections.at(-1)?.id
      : [...sections].reverse().find((s) => visible.has(s.id))?.id ?? previous

    previous = current

    links.forEach((link, id) => id === current ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'))
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) visible[e.isIntersecting ? 'add' : 'delete'](e.target.id)
      mark()
    },
    { rootMargin: BAND },
  )

  for (const section of sections) observer.observe(section)
}
