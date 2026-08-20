/**
 * Theme resolution and persistence. Application logic only — the visitor-facing
 * control ships in US4. The value applied before first paint is set by the inline
 * script in index.html; this module must agree with it or hydration re-flashes.
 */

export const THEMES = ['dark', 'light'] as const
export type Theme = (typeof THEMES)[number]

const STORAGE_KEY = 'h0wzy.theme'
export const DEFAULT_THEME: Theme = 'dark'

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value)
}

/** Reads the stored override, discarding a value this build no longer supports. */
export function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isTheme(stored)) return stored
    // A stored value this build no longer supports is discarded, not honoured (T074).
    if (stored !== null) localStorage.removeItem(STORAGE_KEY)
    return null
  } catch {
    return null
  }
}

export function systemTheme(): Theme {
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

/** Stored override, then system preference, then dark (FR-020). */
export function resolveTheme(): Theme {
  return readStoredTheme() ?? systemTheme()
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* Storage unavailable: the theme still applies for this session. */
  }
}
