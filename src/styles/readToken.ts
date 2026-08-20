/**
 * Reads a design token's computed value. WebGL materials cannot consume CSS custom
 * properties, so anything rendered in a canvas reads its colour through here rather
 * than carrying a literal (FR-022, Principle VI).
 */
export function readToken(name: string, fallback = '#000000'): string {
  if (typeof window === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}
