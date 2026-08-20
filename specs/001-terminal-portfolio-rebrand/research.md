# Phase 0 Research: Terminal-Minimal Portfolio Rebrand

**Date**: 2026-08-19 · **Feature**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)

Every number below was measured in this repository at this commit, not estimated. The
measurement commands are recorded so any claim here can be re-derived.

## Baseline measurement

Built the current site (`npm ci && npm run build`, Vite 8.1.0):

| Artifact | Raw | Gzipped |
|---|---:|---:|
| `dist/assets/index-*.js` | 1,805.0 KB | **519.3 KB** |
| `dist/assets/index-*.css` | 4.6 KB | 1.6 KB |
| `dist/index.html` | 0.5 KB | 0.3 KB |

Isolated the cost of each dependency group by bundling a minimal entry that imports only
that group (`esbuild --bundle --minify --format=esm`, `NODE_ENV=production`, then `gzip -9`):

| Dependency group | Gzipped |
|---|---:|
| `react` + `react-dom/client` (esbuild — **later found wrong, see D2**) | ~~58.7 KB~~ |
| `react` + `react-dom/client` (**Vite/rolldown, corrected**) | **117.2 KB** |
| `three` + `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing` | **358.1 KB** |
| `framer-motion` | **44.5 KB** |

**The constitution's budget is ≤120 KB of initial JavaScript gzipped, excluding a lazily
imported WebGL renderer. The current site ships 519 KB — 4.3× over.** Every decision below is
constrained by closing that gap.

---

## D1 — Remove `framer-motion`

**Decision**: Remove `framer-motion` from the dependency set. Implement the design's motion
with CSS animations and `IntersectionObserver`.

**Rationale**: It costs **44.5 KB gzipped — 37% of the entire initial budget** — and is used in
exactly three components (`ProjectPanel`, `HeroOverlay`, `PageSections`), all three of which
this rebrand deletes or rewrites. The motion the terminal-minimal design actually calls for is
a staggered entry reveal, a blinking cursor, and a reveal-on-scroll. Walking Principle II's
ladder: the standard platform covers all three — CSS `@keyframes` with `animation-delay` for
the stagger and the cursor, `IntersectionObserver` plus a class toggle for the reveal. Rung 4
holds, so the ladder stops there.

Keeping it would consume 103.2 KB of the 120 KB budget on React and an animation library
before a single line of this feature's own code is written.

**Alternatives considered**:
- *Keep it and raise the budget*: rejected. The budget is the reason this rebrand exists;
  raising it to accommodate an animation library used for three fades inverts the priority.
- *Swap for a smaller animation library*: rejected at rung 5 of the ladder — no installed
  dependency is needed at all, so adding a different one fails the same test.
- *Web Animations API*: viable, but CSS is declarative here and the animations are static;
  the API buys nothing for a stagger and costs imperative setup code.

**Verification**: after removal, `grep -r "framer-motion" src/` returns nothing and the
dependency is absent from `package.json`.

## D2 — React leaves the client entirely *(revised 2026-08-20)*

**Decision**: React and `react-dom` become **build-time only**. `scripts/prerender.mjs`
renders every page to static markup, the browser receives finished HTML and never hydrates,
and the client entry is plain TypeScript. React returns to the client only inside the opt-in
immersive renderer, which is dynamically imported and excluded from the budget by FR-033.

### The measurement that was wrong

This decision originally read "keep React, 58.7 KB, roughly half the budget". That number came
from an esbuild probe and **it was wrong**. Building the real application produced a 147.9 KB
entry chunk, over budget, so the number was re-derived three ways:

| Method | Result |
|---|---:|
| esbuild probe bundling `react-dom/client` alone (original) | 58.7 KB gz |
| Vite production build of a page rendering only an `<h1>` | **117.2 KB gz** |
| `node_modules/react-dom/cjs/react-dom-client.production.js` on disk | **523.5 KB raw** |

The last two agree; the first does not. esbuild eliminated far more of `react-dom` than
rolldown does under this project's configuration, so the probe measured a bundle the real
build never produces. **The correct figure for React 19.2.7 in this toolchain is 117.2 KB
gzipped — 98% of the 120 KB budget.**

### Why the conclusion inverts

With the corrected number, the original decision is untenable: no React application in this
toolchain fits a 120 KB budget, so keeping React meant amending the budget. The author was
given that choice explicitly and chose to keep the budget and drop the framework.

Walking the ladder honestly, rung 1 answers it. **Does this need to exist?** The nine project
pages have no interactivity whatsoever — they are prerendered documents. The home page's only
behaviour is a scroll reveal, which is an `IntersectionObserver`, and a command prompt, whose
engine is *already* pure TypeScript with no framework import because Principle IV required it.
A DOM renderer over that engine is a legitimate renderer, not a workaround.

So React is doing, at 117 KB, work that the platform does at well under one.

**Measured result**: the client entry is **0.56 KB gzipped** — Vite's modulepreload polyfill
plus the reveal observer. Against the 519.32 KB baseline that is a 933× reduction, and it
leaves essentially the whole budget available to the terminal.

**What React still does**: it renders every page at build time through
`renderToStaticMarkup`, which is why the components stay ordinary `.tsx` files and the prose
arrives in the HTML payload. And it loads with React Three Fiber inside the US6 opt-in, so
FR-038's reuse of the existing point field and glow is unaffected.

**Alternatives considered**:
- *Amend the budget to ~160 KB and keep React* — offered to the author alongside this option
  and declined. It was the honest alternative, not a strawman: the budget may be raised, but
  never silently.
- *Keep React on the home page only, static HTML for project pages* — the intermediate
  position. Rejected once measured: the home page alone would still be ~125 KB, so it fixes
  nine pages and leaves the tenth over budget.
- *Preact via alias* (~10 KB) — would have kept the React programming model, but R3F targets
  React's internals and US6 is precisely where that risk lands. Moot now that the client ships
  no framework at all.
- *Hydrate only interactive islands* — the sophisticated version of the same idea, and more
  machinery than a site with one interactive region needs. Rung 6: it can be one renderer.

## D3 — Multi-page output with build-time prerendering, and no router dependency

**Decision**: Emit one prerendered HTML document per route — the home page and one per project
(FR-006). Generate them after `vite build` with a Node script that renders the page component
via `react-dom/server`'s `renderToStaticMarkup` and injects the markup into the built shell.
Navigation between pages is an ordinary link. **No routing library, and no client-side
router.**

**Rationale**: Verified `renderToStaticMarkup` is importable and works with the installed
`react-dom` — no new dependency (`node .probe/prerender.mjs` produced the expected markup).
The built shell is a 0.5 KB document with an empty `<div id="root">`, so injecting prerendered
markup into it is a string operation, not a framework integration.

This resolves three requirements at once with one mechanism. SC-001 wants identity readable
within 2 seconds — prerendered markup means the text is in the HTML payload and paints before
React parses. US1's independent test requires the content to be readable without the optional
interactive features. And FR-006's shareable per-project address becomes a real file at a real
path rather than a client-side route that a crawler or a link preview cannot see.

Ten routes with full page reloads is the correct trade for a portfolio: each document is a few
KB, the JavaScript and font are cached across navigations, and no router code ships at all.
Walking the ladder, rung 1 removes the need entirely — a static site does not need client-side
routing to have URLs.

**Alternatives considered**:
- *React Router*: ~18 KB gzipped, pushing the projected total to ~117 KB — inside the budget
  but leaving almost no headroom, in exchange for avoiding page reloads on a site where a
  reload costs a few KB. Rejected at rung 1.
- *Hand-rolled hash router*: ~40 lines and no dependency, but produces `#/work/telasparana`
  URLs that crawlers and link unfurlers handle worse. Rejected — it is more code than the
  MPA approach *and* a worse result.
- *A framework with built-in SSG (Next, Astro)*: the correct default for a greenfield content
  site, and the author already uses Next elsewhere. Rejected here because migrating the
  toolchain is far more work than a ~60-line prerender script, and because FR-038's R3F reuse
  is simplest in the Vite/React setup that already hosts it.

**Verification**: `dist/work/<id>/index.html` exists per project and contains that project's
prose as text; fetching it with JavaScript disabled shows readable content.

## D4 — Vitest as the single new test dependency

**Decision**: Add `vitest` as a devDependency. Unit-test the command engine, the content
schema validation, the locale dictionaries, and the statistics transform.

**Rationale**: Principle VII requires unit tests wherever logic is pure, and no test runner
exists in this project. This is the one place the dependency ladder genuinely reaches its last
rung: rung 3 (standard library) offers `node:test`, which would work but cannot resolve the
project's TypeScript path and JSX settings without additional configuration; rung 5 fails
because nothing installed runs tests. Vitest reuses the Vite config already present, so it
needs no separate build pipeline — which is precisely why it costs less total configuration
than the standard-library option.

It is a devDependency and contributes zero bytes to what a visitor downloads.

**Alternatives considered**:
- *`node:test` + `tsx`*: no new test framework, but needs a separate transform step and its
  own module resolution config. Rejected as more configuration for less capability.
- *No tests*: rejected — Principle VII is explicit, and the command engine is exactly the
  "pure logic where a bug is silent" case the principle names.

**Additional script**: `"test": "vitest run"`, wired into the pre-merge gate alongside
`build` and `lint`.

## D5 — Self-hosted JetBrains Mono via `@fontsource-variable/jetbrains-mono`

**Decision**: Add `@fontsource-variable/jetbrains-mono` (verified available, v5.3.0) and import
only the `latin` subset. Set `font-display: swap`.

**Rationale**: FR-024 forbids third-party font hosts — they cost a connection on the critical
path and disclose every visitor's IP to another party. The author already established this
exact pattern in `studiobiasantos`, where Google Fonts at runtime is a documented project
prohibition and typography is self-hosted through `@fontsource`; matching it keeps one
convention across his repositories rather than inventing a second.

A variable font is one file covering every weight the design uses, which is fewer requests
than separate static faces. Fonts do not count against the JavaScript budget but do affect
LCP, so the `latin` subset and `swap` are both required rather than optional.

**Alternatives considered**:
- *Commit the `.woff2` files directly to `public/fonts/`*: zero dependency and marginally
  simpler, but loses the update path and diverges from the author's existing convention.
  Rejected narrowly — the dependency is dev-time packaging, not runtime code.
- *A system monospace stack (`ui-monospace, SF Mono, Menlo, Consolas`)*: zero bytes, but the
  typeface **is** the identity in a design where nothing else carries it, and it would render
  differently on every visitor's machine. Rejected. It remains the fallback stack.

## D6 — Theme applied before first paint

**Decision**: A small blocking inline script in `<head>` reads the stored preference (falling
back to `prefers-color-scheme`), and sets a `data-theme` attribute on `<html>` before the body
renders. Tokens are CSS custom properties keyed off that attribute.

**Rationale**: FR-021 and SC-008 require zero frames of the wrong theme. Any theme decision
made inside React runs after first paint, which is the flash. The only place a decision can
run earlier than paint is a synchronous script in the head — this is a platform constraint, not
a preference. The script is a handful of lines and is the standard solution.

Reading `localStorage` synchronously in the head blocks paint by a negligible amount and is
the accepted trade for eliminating the flash entirely.

**Alternatives considered**:
- *CSS `prefers-color-scheme` alone*: no flash and no script, but cannot honour an override
  (FR-020). Rejected on requirements.
- *A cookie read server-side*: no server. Not applicable to a static deployment.

## D7 — Compile-time translation completeness

**Decision**: Define a `StringKey` union derived from the English dictionary, then declare each
locale as `satisfies Record<StringKey, string>`. A missing or misspelled key fails `tsc -b`,
which the build already runs.

**Rationale**: FR-017 requires a missing translation to be caught before publication rather
than degrading at runtime. `satisfies` gives exactly that with no library and no build step:
the English dictionary is the source of truth for the key set, and Portuguese must satisfy it
or the build fails. Rung 3 of the ladder holds — the language itself does this.

Note the project sets `erasableSyntaxOnly: true`, so `enum` is unavailable; the key set is a
union type derived with `keyof typeof`, which is the correct construction here regardless.

**Alternatives considered**:
- *`i18next` / `react-intl`*: 15–40 KB gzipped for pluralisation, interpolation, and locale
  negotiation this site does not need — two languages, static strings, no user-generated
  content. Rejected at rung 1.
- *JSON files with a runtime fallback to the key*: rejected explicitly by FR-017; a fallback
  is the failure mode the requirement exists to prevent.

## D8 — Accessible terminal pattern

**Decision**: A real `<input>` for entry inside a `<form>`; the scrollback rendered as an
ordinary element carrying `role="log"` and `aria-live="polite"`; each entry a block containing
the echoed command and its output as selectable text. Focus moves to the input when the
terminal region is clicked, and the input is reachable in normal tab order.

**Rationale**: Principle III makes this non-negotiable and FR-013 states it. A real input gets
the mobile keyboard, IME composition, paste, and browser autofill behaviour for free — all of
which a contenteditable or a keydown-on-document implementation has to reimplement badly.
`role="log"` with `aria-live="polite"` is the ARIA pattern designed for append-only output and
announces new entries without stealing focus, which is what a command result should do.

Output is real DOM text, satisfying FR-008's requirement that it be selectable and copyable —
and, in the immersive presentation, this is why the terminal is composed over the rendered
scene rather than drawn into it (see D9).

**Alternatives considered**:
- *`xterm.js`*: a full terminal emulator, ~90 KB gzipped, built for PTY streams. Rejected at
  rung 1 — this needs a command prompt, not a terminal emulator, and the budget forbids it.
- *`contenteditable`*: reimplements caret handling, paste sanitisation, and mobile input.
  Rejected as more code and worse behaviour.

## D9 — The immersive presentation renders the environment, not the text

**Decision**: In US6, WebGL renders the environment — the existing animated point field, a
monitor volume, and the postprocessing glow (FR-038). The terminal itself remains DOM,
composed into the scene via drei's `<Html transform>`.

**Rationale**: This is the decision that determines whether US6 can satisfy FR-034 (identical,
selectable, screen-reader-readable output) at all. Drawing text into WebGL — via drei's `Text`
or troika's SDF renderer — forfeits text selection, clipboard, and the accessibility tree, and
requires reimplementing the caret and scrollback. It would put US6 in direct conflict with
Principle III.

Composing the DOM terminal over a rendered environment keeps every guarantee of D8 intact
while still delivering the visual payoff, and it is why FR-038's reuse works: the point field
and bloom are exactly the environment layer, which is the part WebGL should be doing.

**Alternatives considered**:
- *Render terminal text with `drei/Text`*: rejected on Principle III, as above.
- *Post-process the DOM with CSS filters and no WebGL at all*: cheaper and accessible, but
  discards the existing R3F work that FR-038 exists to preserve. Rejected on requirements.

## D10 — WakaTime resolved at build time with a committed last-known-good artifact

**Decision**: A Node script run before `vite build` reads the API key from the build
environment, fetches the statistics, and writes a JSON artifact into `src/content/`. **That
artifact is committed.** On any failure — network, 401, 429, malformed shape — the script logs
a warning, leaves the committed artifact untouched, and exits successfully.

**Rationale**: The constitution's *Secrets & external data* section requires this, and the
reason is concrete: Vite inlines build-time values into public JavaScript, so a key reachable
from client code is a published key. The measured API behaviour supports the split — the
public endpoint (`/users/<id>/stats/all_time`) returns totals, languages, editors and
categories with no authentication because the account has public logged time, but returns
`projects: null`; the per-project breakdown that FR-026 requires is available only with the
key. So the key must exist somewhere, and build time is the only place where it is neither
shipped nor committed.

Committing the artifact is what makes FR-031 true. A build that fails because a third-party
API is rate-limited is a build that blocks a deploy for a reason unrelated to the change being
deployed; falling back to figures from yesterday is strictly better than that, and far better
than rendering zeros to a visitor.

Refresh comes from a scheduled workflow triggering a rebuild, at most daily. For a
time-coded total, 24-hour staleness is not observable.

**Alternatives considered**:
- *Serverless proxy holding the key*: fresher data, but adds a function, a cold start, a
  runtime dependency on a third party's uptime, plus loading and error states on the page for
  a number that changes by minutes per day. Rejected at rung 1.
- *Client-side call to the public endpoint*: no key needed, but returns `projects: null`,
  failing FR-026, and adds a runtime third-party request that FR-024's privacy rule disallows.
  Rejected on both counts.

**Honesty constraint carried into the data model**: measured activity begins 2026-03-17 while
stated experience begins 2023-01-01. FR-027 and FR-028 require each figure to carry its own
period, so the snapshot stores its range rather than only its totals.

## D11 — Language-level constraints already set by this repository

Not a decision, but constraints found while reading the config that shape every artifact
downstream and would otherwise be discovered as build failures:

- **`erasableSyntaxOnly: true`** — `enum`, parameter properties, and namespaces are
  unavailable. Closed sets are expressed as `const` objects plus `keyof typeof` unions. This
  is the better construction anyway; recording it so it is not mistaken for a limitation to
  work around.
- **`verbatimModuleSyntax: true`** — type-only imports must be written `import type`.
- **`noUnusedLocals` / `noUnusedParameters`** — an unused binding fails the build, not the
  linter.
- **No path aliases are configured.** Imports are relative. Adding an alias would touch both
  `tsconfig` and the Vite config for no requirement in this feature; not doing it.
- **ESLint 10 flat config** with `typescript-eslint` recommended, `react-hooks`, and
  `react-refresh`. New files must satisfy it; `npm run lint` is a merge gate.

## Summary of dependency changes

| Change | Package | Gzipped cost to visitors | Ladder justification |
|---|---|---:|---|
| **Remove** | `framer-motion` | **−44.5 KB** | Rung 4 — CSS and `IntersectionObserver` cover it |
| Keep, lazy | `three`, `@react-three/*`, `postprocessing` | 0 KB initial (358.1 KB on opt-in) | Required by FR-038; gated by FR-033 |
| Keep, **build-time only** | `react`, `react-dom` | **0 KB initial** (117.2 KB avoided) | Rung 1 — prerendered pages do not need a client framework (D2 revised) |
| **Add** | `vitest` (dev) | 0 KB | Rung 5 fails — nothing installed runs tests (Principle VII) |
| **Add** | `@fontsource-variable/jetbrains-mono` | 0 KB JS (one subsetted woff2) | Rung 5 fails — FR-024 forbids font CDNs |

**Net effect on the visitor**: the client entry measures **0.56 KB gzipped** against the
519.32 KB baseline — a 933× reduction — with React's 117.2 KB moved to build time and the
358.1 KB WebGL group behind an explicit opt-in. Nearly the entire 120 KB budget remains
available to the terminal.
