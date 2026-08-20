/**
 * Pure translation. No storage, no DOM, no clock — so src/terminal/ can import it
 * without breaking Principle IV. Persistence and resolution live in src/locale.ts.
 */

import type { Locale } from './types'
import { en, type StringKey } from './en'
import { pt } from './pt'

export const dictionaries: Record<Locale, Record<StringKey, string>> = { en, pt }

/**
 * Substitutes `{name}` placeholders. An unmatched placeholder is left intact
 * rather than blanked, so a missing value is visible in review instead of
 * silently rendering an empty string to a visitor.
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
