/**
 * Client entry.
 *
 * React returns to the client here, reversing CL-002. scripts/prerender.mjs
 * still emits every route as a complete document — hydration is added OVER
 * that pipeline, never instead of it, which is what every "readable with
 * scripting unavailable" requirement in spec 003 rests on (FR-046, D3).
 *
 * Measured 2026-08-27: the adoption costs +71.28 KB gzipped, landing at
 * 104.76 KB against the constitution's 120 KB ceiling. The 117.2 KB figure the
 * previous version of this comment cited for React's client runtime did not
 * survive being measured; see specs/003-cv-experience-page/research.md.
 */
import '@fontsource-variable/jetbrains-mono/index.css'
import './index.css'
import { hydrateRoot } from 'react-dom/client'
import { HydratedApp } from './HydratedApp'
import { initReveal } from './enhance/reveal'
import { mountTerminal } from './enhance/terminal/mount'
import { initThemeControl } from './enhance/theme-control'
import { initLocaleControl } from './enhance/locale-control'
import { locationFor } from './route'

// The document's locale is whatever URL served it — no negotiation needed.
const pathname = window.location.pathname
const locale = locationFor(pathname).locale

const root = document.getElementById('root')

/*
 * Everything below runs AFTER hydration resolves, without exception.
 *
 * These four modules mutate DOM that React did not own before and does own
 * now. Running any of them while hydrateRoot is still walking the tree is a
 * race for the same nodes, and the failure it produces — an enhancement
 * applied to a node React then replaces — is intermittent and miserable to
 * diagnose (research D3, hazards 2 and 3).
 *
 * The engine underneath the terminal is untouched by any of this and still
 * imports no React, no renderer and no DOM (Principle IV, FR-048).
 */
function enhance() {
  initReveal()
  initThemeControl(locale)
  initLocaleControl()

  const terminal = document.querySelector<HTMLElement>('[data-term]')
  if (terminal) {
    mountTerminal(terminal, { history: [], locale })
  }
}

if (root) {
  // HydratedApp owns the effect that guarantees `enhance` runs after the
  // hydration commit rather than alongside it. See its header for why.
  hydrateRoot(root, <HydratedApp pathname={pathname} onHydrated={enhance} />)
} else {
  // No #root means no prerendered document to hydrate. The enhancements are
  // still the right thing to run: they are what makes a served page work.
  enhance()
}
