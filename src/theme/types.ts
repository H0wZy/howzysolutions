/** Theme vocabulary. Pure: importable from src/terminal/ without pulling in the DOM. */

export const THEMES = ['dark', 'light'] as const
export type Theme = (typeof THEMES)[number]

export const DEFAULT_THEME: Theme = 'dark'

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value)
}
