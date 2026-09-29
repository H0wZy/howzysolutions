import { hydrateRoot } from 'react-dom/client'
import { HydratedApp } from './HydratedApp'
import { mountTerminal } from './enhance/terminal/mount'
import type { Locale } from './content/i18n/types'

/**
 * The client app, as a chunk of its own. src/main.tsx loads it only for the
 * documents that hydrate; the static ones (the legal pages, the /vvv/
 * showcase) never fetch React, the pages or the terminal, because none of them
 * has anything for React to attach to. scripts/prerender.mjs puts a
 * modulepreload for this chunk in every document that needs it, so it
 * downloads beside the entry instead of after it.
 *
 * The terminal lives here rather than in a chunk of its own: only the home
 * page has one, but the home page hydrates anyway, and a third file cost 1.5 KB
 * of gzip (measured 2026-09-29) for no page that needs it separately.
 */
export function hydrate(
  root: HTMLElement,
  pathname: string,
  locale: Locale,
  enhance: () => void,
) {
  hydrateRoot(
    root,
    <HydratedApp
      pathname={pathname}
      onHydrated={() => {
        enhance()
        const term = document.querySelector<HTMLElement>('[data-term]')
        if (term) mountTerminal(term, { history: [], locale })
      }}
    />,
  )
}
