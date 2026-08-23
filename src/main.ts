/**
 * Client entry. Deliberately framework-free.
 *
 * React is a BUILD-TIME dependency here: scripts/prerender.mjs renders every page
 * to static markup, so the browser receives finished HTML and never hydrates.
 * React returns to the client only inside the opt-in immersive renderer (US6),
 * which is dynamically imported and excluded from the budget by FR-033.
 *
 * Measured reason: React 19.2.7's client runtime is 117 KB gzipped under this
 * toolchain — 98% of the 120 KB budget — for pages whose only interactivity is a
 * scroll reveal and a command prompt. Principle II, rung 1: it does not need to
 * exist here. See research.md D2 (corrected).
 */
import '@fontsource-variable/jetbrains-mono/index.css'
import './index.css'
import { initReveal } from './enhance/reveal'
import { mountTerminal } from './enhance/terminal/mount'
import { initThemeControl } from './enhance/theme-control'
import { resolveLocale } from './locale'

const locale = resolveLocale()

initReveal()
initThemeControl(locale)

// The terminal is the one interactive region on the site. Everything else is
// prerendered text, which is why this entry stays under a kilobyte.
const terminal = document.querySelector<HTMLElement>('[data-term]')
if (terminal) {
  mountTerminal(terminal, { history: [], locale })
}
