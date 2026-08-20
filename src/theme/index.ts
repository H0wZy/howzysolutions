/**
 * Theme resolution and persistence — the impure half. Must agree with the
 * blocking inline script in index.html or the page would re-flash (FR-021).
 */

import { DEFAULT_THEME, isTheme, type Theme } from './types'

const STORAGE_KEY = 'h0wzy.theme'

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

export * from './types'
