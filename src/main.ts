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

initReveal()
