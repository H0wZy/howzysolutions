/**
 * Active-locale resolution and persistence — the impure half. The pure
 * translation layer lives in content/i18n/translate.ts so the terminal engine
 * can import it without touching storage (Principle IV).
 */

import { DEFAULT_LOCALE, isLocale, type Locale } from './content/i18n/types'

const STORAGE_KEY = 'h0wzy.locale'

export function readStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
    if (stored !== null) localStorage.removeItem(STORAGE_KEY)
    return null
  } catch {
    return null
  }
}

/**
 * Stored choice, then English. Deliberately NOT inferred from network location:
 * FR-019 forbids locking a visitor into a locale they did not choose.
 */
export function resolveLocale(): Locale {
  return readStoredLocale() ?? DEFAULT_LOCALE
}

export function persistLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* Storage unavailable: the locale still applies for this session. */
  }
}

export { translate, format, dictionaries } from './content/i18n/translate'
