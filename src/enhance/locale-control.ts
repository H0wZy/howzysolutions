const KEY = 'h0wzy.scroll'

export function initLocaleControl(): void {
  document.querySelector('[data-locale-link]')?.addEventListener('click', () => {
    try {
      sessionStorage.setItem(KEY, `${scrollY}`)
    } catch {
      /* ignore */
    }
  })

  try {
    const saved = sessionStorage.getItem(KEY)
    if (saved) {
      sessionStorage.removeItem(KEY)
      if (+saved > 0) scrollTo(0, +saved)
    }
  } catch {
    /* ignore */
  }
}
