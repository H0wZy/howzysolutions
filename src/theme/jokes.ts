/**
 * The theme joke pool. Pure and framework-free — importable from the terminal
 * engine (`src/terminal/commands/effects.ts`) without tripping its purity gate,
 * and from the DOM-side chrome control (`src/enhance/theme-control.ts`), so both
 * routes into "leave dark" share one implementation (FR-015, FR-039).
 *
 * Research D12: dark is the only theme; an attempt to leave it is refused in
 * the site's own voice rather than met with a real alternative palette.
 */
import type { StringKey } from '../content/i18n/en'

export const THEME_JOKE_KEYS = [
  'theme.joke.0',
  'theme.joke.1',
  'theme.joke.2',
  'theme.joke.3',
  'theme.joke.4',
] as const satisfies readonly StringKey[]

/**
 * Deterministic given the same seed — required by the terminal engine's purity
 * gate, which bans `Math.random()` outright (`src/terminal/__tests__/purity.test.ts`).
 * Callers pass something that varies across a real session without making the
 * function itself impure: the terminal command uses `history.length`, the chrome
 * control uses its own click count.
 */
export function pickJoke(seed: number): StringKey {
  const count = THEME_JOKE_KEYS.length
  const index = ((seed % count) + count) % count
  return THEME_JOKE_KEYS[index]
}
