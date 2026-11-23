import { hydrateRoot } from 'react-dom/client'
import { HydratedApp } from './HydratedApp'

/**
 * The client app, as a chunk of its own. src/main.tsx loads it only for the
 * documents that hydrate; the static ones (the legal pages, the /vvv/
 * showcase) never fetch React, the pages or the terminal, because none of them
 * has anything for React to attach to. scripts/prerender.mjs puts a
 * modulepreload for this chunk in every document that needs it, so it
 * downloads beside the entry instead of after it.
 *
 * The home page used to hold the terminal and hydrate for it; since the rebrand
 * (2026-11-23) it is a static document, so no page mounts the terminal and it is
 * not imported here. The engine and its mount stay in src/ for when one returns.
 */
export function hydrate(root: HTMLElement, pathname: string, enhance: () => void) {
  hydrateRoot(
    root,
    <HydratedApp
      pathname={pathname}
      onHydrated={enhance}
    />,
  )
}
