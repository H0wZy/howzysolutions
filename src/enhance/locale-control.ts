const KEY = 'h0wzy.scroll'

export function initLocaleControl(): void {
  const link = document.querySelector<HTMLAnchorElement>('[data-locale-link]')
  link?.addEventListener('click', () => {
    try {
      sessionStorage.setItem(KEY, String(scrollY))
    } catch {
      /* ignore */
    }
  })

  try {
    const saved = sessionStorage.getItem(KEY)
    if (saved) {
      sessionStorage.removeItem(KEY)
      const y = +saved
      if (y > 0) scrollTo(0, y)
    }
  } catch {
    /* ignore */
  }
}
