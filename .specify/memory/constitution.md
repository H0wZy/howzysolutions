<!--
SYNC IMPACT REPORT
==================
Version change: (template, unversioned) -> 1.0.0
Rationale: Initial ratification. First concrete constitution for the howzysolutions
portfolio; every placeholder in the scaffold replaced with project-specific governance.

Principles defined (all new):
  I.   Content Is Data, Not Markup
  II.  Minimum Code That Works
  III. Accessible By Construction (NON-NEGOTIABLE)
  IV.  Renderer-Agnostic Core
  V.   Bilingual Parity (EN canonical, pt-BR secondary)
  VI.  Themed Through Tokens (dark default, light alternative)
  VII. Verified Before Merge

Sections added:
  - Core Principles (7 principles; scaffold ships 5 slots, expanded to 7)
  - Technology & Design Constraints  (fills [SECTION_2_NAME])
  - Development Workflow & Quality Gates  (fills [SECTION_3_NAME])
  - Governance

Sections removed: none (scaffold placeholders fully replaced).

Deferred TODOs: none. All governance dates known; 2026-08-19 is the adoption date.
-->

# howzysolutions Constitution

The public portfolio of Marcos "H0wZy" Junior — a developer portfolio that presents each
project together with its frontend, its backend, its screen demonstrations and its
documentation. It ships to `howzysolutions.dev`. Its visual and editorial direction is
terminal-minimal: a developer showing work in the idiom developers read.

## Core Principles

### I. Content Is Data, Not Markup

Every project, skill, role, and biography fact MUST live in a typed data module under
`src/content/`, and MUST NOT be hardcoded into a component's JSX. A project entry is the
single source of truth consumed by every surface that renders it: the list view, the detail
page, the terminal's command output, and the site metadata.

Adding a project MUST be an edit to data only. If adding a project requires touching a
component, the data model is wrong and MUST be fixed instead of worked around.

*Rationale*: The portfolio's whole job is to grow. A schema that makes growth a one-file
edit is the difference between a site that stays current and a site that rots after three
months. It is also what makes a single project description renderable as prose, as a table
row, and as CLI stdout without duplicating the text three times.

### II. Minimum Code That Works

Before writing an abstraction, walk this ladder and stop at the first rung that holds:
does this need to exist at all; does something in this repo already do it; does the
standard library or the language do it; does a native platform feature do it
(`<details>`, `<dialog>`, `view-transition`, CSS `@media`, `Intl`); does a dependency
already installed do it; can it be one line.

A new runtime dependency MUST be justified in the pull request that introduces it, naming
the rung of the ladder that failed. "It is convenient" is not a justification. Dependencies
whose job is styling, animation easing, class-name concatenation, date formatting, icons as
a package, or state management for fewer than three consumers MUST NOT be added.

*Rationale*: A portfolio that loads slowly and depends on forty packages argues against the
developer who built it. The site is itself a work sample; restraint is the argument.

### III. Accessible By Construction (NON-NEGOTIABLE)

Every interactive surface MUST be operable by keyboard alone and MUST be intelligible to a
screen reader. Specifically:

- Interactive elements MUST be real semantic elements (`button`, `a[href]`, `input`) or
  carry a correct role plus keyboard handlers. Focus MUST be visible at all times and MUST
  NOT be removed without an equal replacement.
- The interactive terminal MUST accept typed input from a real focusable form control, MUST
  announce command output to assistive technology via a polite live region, and its output
  MUST be selectable and copyable text.
- Decorative motion MUST respect `prefers-reduced-motion: reduce`. No animation may be
  required to understand or complete anything.
- No information may exist only inside a canvas, only in colour, or only on hover.
- Text MUST meet WCAG 2.2 AA contrast (4.5:1 body, 3:1 for large text and UI borders) in
  **both** themes. This is verified, not assumed.

*Rationale*: A terminal UI and a 3D scene are the two easiest ways to build something that
looks impressive and excludes people. Deciding this once, as a non-negotiable, is cheaper
than retrofitting it and more honest than shipping it broken.

### IV. Renderer-Agnostic Core

Interactive behaviour MUST be split into a pure core and a thin renderer. The terminal's
command engine — parsing an input line, resolving a command, producing structured output —
MUST be pure TypeScript in `src/terminal/` with no import of React, Three.js, or the DOM.
Renderers consume that core; they never own command semantics.

The DOM terminal is the canonical renderer and MUST work with JavaScript's heavy paths
unloaded. Any WebGL renderer MUST be an opt-in enhancement: dynamically imported, never in
the initial bundle, never the only way to reach a command's output, and never the surface a
first-time visitor is dropped into.

*Rationale*: One engine, many renderers means a command written once is available in the
2D terminal, the 3D terminal, and a future `npx h0wzy` — and it means the impressive
renderer can be deleted or rewritten without touching what the commands actually say.

### V. Bilingual Parity

English is the canonical language; Brazilian Portuguese is the secondary language. Every
user-visible string MUST resolve through the typed locale dictionary in `src/content/i18n/`
and MUST exist in both locales. A missing translation MUST be a TypeScript error, not a
runtime fallback to a key or to English.

The document's `lang` attribute MUST track the active locale. The selected locale MUST
persist across visits. Locale MUST NOT be inferred and locked from IP or timezone.

*Rationale*: Typing the locale dictionary is what makes "we will translate it later" a
build failure instead of a broken half-Portuguese page.

### VI. Themed Through Tokens

Dark is the default theme; light is a fully supported alternative, not a courtesy. All
colour, spacing, radius, and type-scale values MUST be CSS custom properties declared in
one place. Components MUST reference tokens. A literal colour value (hex, `rgb()`, `hsl()`,
or a named colour) in a component file is a defect.

Both themes MUST be defined explicitly. Theme MUST follow the OS by default, MUST be
overridable by the user, MUST persist, and MUST apply on first paint without a flash of the
wrong theme.

*Rationale*: Two themes are only maintainable if there is exactly one place where a colour
decision lives. Hardcoded colours are how a light mode becomes unreadable six commits after
it was added.

### VII. Verified Before Merge

`npm run build` (which typechecks) and `npm run lint` MUST both pass before any merge. A
push that breaks either is reverted or fixed, not merged and followed up.

Testing is proportional to risk, not uniform:

- Pure logic — the terminal command engine, content-schema validation, locale resolution —
  MUST have unit tests. These are the parts where a bug is silent, and they are the parts
  that are cheap to test because they are pure.
- Rendering and layout MUST be verified by running the site and looking at it, at mobile and
  desktop widths, in both themes. Screenshots belong in the pull request.
- Bug fixes MUST add a test that fails before the fix when the bug is in pure logic.

TypeScript `any`, non-null assertions on values that can legitimately be absent, and
`@ts-expect-error` without an adjacent explanatory comment MUST NOT be introduced.

*Rationale*: Demanding full coverage of a portfolio would be theatre and would be abandoned
in a week. Demanding tests exactly where logic is pure and failure is invisible is a rule
that survives contact with a solo maintainer's schedule.

## Technology & Design Constraints

**Stack.** React 19 + TypeScript + Vite. Routing, styling, and state are solved with the
platform and with what is already installed before any library is considered (Principle II).
Deployment is Vercel, custom domain `howzysolutions.dev`.

**Broader competencies represented in portfolio content.** Azure OpenAI and generative-AI
solutioning, Microsoft 365 and Power Platform, cloud and integration/API work, automation,
data and analytics, and interactive web/3D (React Three Fiber, Three.js). These are content
of the portfolio; they do not license adding their SDKs to this site's runtime bundle.

**Design direction.** Terminal-minimal: a single readable measure (~820px) for prose, a
monospace-forward type system, sections separated by hairline rules rather than floating
cards, and a warm near-black ground. Glassmorphism, multi-stop gradient text, neon bloom,
and decorative blur are out of the vocabulary.

**Colour identity.** A warm dark ground with one primary accent and one cool secondary
accent, low saturation, chosen so the palette is recognisably H0wZy's and not a copy of any
site it takes inspiration from. Accent colour MUST carry meaning consistently (the same
colour never means both "link" and "warning").

**Typography.** Fonts MUST be self-hosted as `woff2` under `public/fonts/` and loaded with
`font-display: swap`. Third-party font CDNs MUST NOT be used: they cost a connection, leak
visitor IPs to another party, and can go down independently of the site.

**Performance budgets.** Measured on the production build, mobile throttling:

- Initial JavaScript transferred: **≤ 120 KB gzipped**, excluding any lazily imported
  WebGL renderer.
- Largest Contentful Paint: **≤ 1.8 s**. Cumulative Layout Shift: **≤ 0.05**.
- Lighthouse mobile: **≥ 95** Performance, **100** Accessibility.
- Every route MUST be usable at 60 fps while scrolling on a mid-range phone.

A change that breaks a budget MUST either be reworked or ship with the budget formally
amended in this document. Budgets are not aspirations.

**Privacy.** No third-party analytics, tag managers, ad pixels, embedded fonts, or social
SDKs. If usage measurement becomes necessary it MUST be cookieless and MUST NOT ship
visitor data to a third party.

## Development Workflow & Quality Gates

**Spec-driven.** Non-trivial work starts as a spec-kit feature: `/speckit-specify` →
`/speckit-plan` → `/speckit-tasks` → `/speckit-implement`. Specs and plans are committed
artifacts under `specs/`, reviewed as part of the change. Bug fixes, copy edits, and
dependency bumps do not require a spec.

**Branches and commits.** Work happens on a branch off `main`; `main` MUST stay deployable.
Commits follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`) and
describe the change in the imperative.

**Pull request gates.** A pull request MUST NOT merge until: build and lint pass; the
change was rendered and inspected in both themes and both locales when it touches UI;
screenshots are attached for visual changes; new runtime dependencies are justified per
Principle II; and no principle is violated without a recorded amendment.

**Content changes.** Adding or editing a project is a data-only change under `src/content/`
and MUST update both locales in the same commit.

## Governance

This constitution supersedes ad-hoc preference and prior guidance documents. Where
`CLAUDE.md`, `.gemini/GEMINI.md`, or `README.md` conflict with this document, this document
wins and the conflicting file MUST be corrected.

**Amendment procedure.** An amendment is a pull request that edits this file, states what
changed and why, and updates the version and the Sync Impact Report at the top. Loosening a
NON-NEGOTIABLE principle or a performance budget MUST be argued explicitly in the pull
request body — a budget may be raised, but never silently.

**Versioning policy.** Semantic versioning of governance:

- **MAJOR** — a principle is removed or redefined in a way that invalidates existing
  compliant code.
- **MINOR** — a principle or section is added, or existing guidance is materially expanded.
- **PATCH** — clarification, rewording, typo, or non-semantic refinement.

**Compliance review.** Every pull request is reviewed against these principles. Complexity
that cannot be justified against Principle II MUST be removed before merge. Performance
budgets are re-measured on the production build before any deploy that changes the bundle.
This document is re-read at the start of each new feature spec.

**Version**: 1.0.0 | **Ratified**: 2026-08-19 | **Last Amended**: 2026-08-19
