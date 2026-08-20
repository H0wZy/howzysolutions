/** Locale primitives. English is canonical; Portuguese must reach parity (FR-016). */

export const LOCALES = ['en', 'pt'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

/**
 * Prose belonging to a content record. Because this is a total Record over Locale,
 * a project written without Portuguese fails `tsc -b` — FR-017 enforced by the type
 * system rather than by discipline (research D7).
 */
export type Localized<T = string> = Record<Locale, T>

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}
