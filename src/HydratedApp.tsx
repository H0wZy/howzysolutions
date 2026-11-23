import { useEffect } from 'react'
import App from './App'

/**
 * App, plus the one signal React gives for "hydration has committed".
 *
 * `hydrateRoot` takes no completion callback and schedules its work rather
 * than doing it inline, so a microtask or a `setTimeout(0)` after the call
 * would both still be racing it. An effect is the guarantee.
 *
 * The enhancement modules in src/enhance/ mutate DOM that React did not own
 * before and does own now — the reveal classes, the locale and theme controls,
 * and the terminal mount. Any of them running mid-hydration is a race for the
 * same nodes, and its failure mode is intermittent (research D3, hazards 2
 * and 3). This is where that ordering is enforced.
 *
 * It renders <App /> and nothing else, contributing no DOM of its own, so the
 * tree hydration compares is byte-for-byte what entry-server.tsx emitted.
 * It lives here rather than in App.tsx because the prerender pipeline must
 * keep rendering the same App it always has, with no effect in it.
 */
export function HydratedApp({
  pathname,
  onHydrated,
}: {
  pathname: string
  /** Must be a stable reference — it is the effect's only dependency. */
  onHydrated: () => void
}) {
  useEffect(onHydrated, [onHydrated])
  return <App pathname={pathname} />
}
