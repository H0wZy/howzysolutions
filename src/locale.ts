/**
 * Active-locale resolution, persistence, and string lookup.
 * No React binding here — that arrives with the provider in US3.
 */

import { DEFAULT_LOCALE, isLocale, type Locale } from './content/i18n/types'
import { en, type StringKey } from './content/i18n/en'
import { pt } from './content/i18n/pt'

const STORAGE_KEY = 'h0wzy.locale'

export const dictionaries: Record<Locale, Record<StringKey, string>> = { en, pt }

/** Reads the stored choice, discarding a value this build no longer supports (T069). */
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

/**
 * Substitutes `{name}` placeholders. A placeholder with no matching parameter is
 * left intact rather than blanked, so a missing value is visible in review instead
 * of silently rendering an empty string to a visitor.
 */
export function format(template: string, params?: Record<string, string | number>): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in params ? String(params[key]) : whole,
  )
}

export function translate(
  locale: Locale,
  key: StringKey,
  params?: Record<string, string | number>,
): string {
  return format(dictionaries[locale][key], params)
}
