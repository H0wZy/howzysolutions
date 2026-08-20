---
description: "Dependency-ordered task list for the terminal-minimal portfolio rebrand"
---

# Tasks: Terminal-Minimal Portfolio Rebrand

**Input**: Design documents from `/specs/001-terminal-portfolio-rebrand/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: **Included and required.** Constitution Principle VII mandates unit tests wherever
logic is pure, and [quickstart.md](./quickstart.md) already enumerates V-003 … V-008 as merge
gates. Test tasks below are not optional.

**Organization**: Grouped by user story so each is independently implementable and testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable — different files, no dependency on an incomplete task
- **[Story]**: US1 … US6, mapping to the user stories in spec.md

## Path Conventions

Single static project, sources at repository root. `src/` for application code, `scripts/` for
build-time Node scripts, colocated `__tests__/` directories for Vitest.

## Repository-wide constraints (apply to every task)

From [research.md](./research.md) D11 — these fail the **build**, not the linter:

- No `enum`, no parameter properties (`erasableSyntaxOnly`). Closed sets are `const` objects
  plus `keyof typeof` unions.
- Type-only imports must be written `import type` (`verbatimModuleSyntax`).
- An unused local or parameter fails `tsc -b` (`noUnusedLocals`, `noUnusedParameters`).
- No path aliases exist. Imports are relative.
- No literal colour anywhere under `src/` (FR-022). Tokens only.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Adjust the dependency set and tooling before any code is written.

- [X] T001 Record the pre-work baseline by running `npm ci && npm run build` and writing the reported entry-chunk gzip size (expected ≈519.3 KB) into `specs/001-terminal-portfolio-rebrand/baseline.md`, so V-014 has a committed number to compare against
- [X] T002 Add `coverage` and `.vercel` to `.gitignore` and to `globalIgnores` in `eslint.config.js`, so the Vitest and Vercel outputs added by this feature are not committed or linted
- [X] T003 [P] Add `vitest` to devDependencies in `package.json` and create `vitest.config.ts` at the repository root reusing the existing Vite config (research D4)
- [X] T004 [P] Add `"test": "vitest run"` and `"test:watch": "vitest"` scripts to `package.json`
- [X] T005 [P] Add `@fontsource-variable/jetbrains-mono` to dependencies in `package.json` (research D5)
- [X] T006 [P] Extend `eslint.config.js` with a config block covering `scripts/**/*.mjs` as Node ESM, so build scripts are linted rather than excluded

**Checkpoint**: `npm run build`, `npm run lint` and `npm test` all execute (tests trivially pass with no test files yet).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The token system, theme application, localization mechanism, and content schema.
Every user story depends on all four.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Design tokens and theming

- [X] T007 Create `src/styles/tokens.css` declaring every token from [contracts/design-tokens.md](./contracts/design-tokens.md) for both themes — `:root` and `[data-theme="dark"]` for dark, `[data-theme="light"]` for light — covering colour, typography, space, radius and motion
- [X] T008 [P] Create `src/styles/base.css` with the reset, `body` defaults reading `--font-mono` and `--fs-base`, the `--measure` container, hairline section rules using `--line`, and a `@media (prefers-reduced-motion: reduce)` block zeroing every duration while preserving final states (FR-025)
- [X] T009 [P] Create `scripts/check-contrast.mjs` that parses `src/styles/tokens.css`, recomputes every ratio in the contract with the WCAG relative-luminance formula, and exits non-zero when a text token falls below 4.5:1 or `--border` below 3:1 in either theme (gate V-009)
- [X] T010 Add `node scripts/check-contrast.mjs` to the `test` script in `package.json` so token contrast is a merge gate, not a manual check
- [X] T011 [P] Import the `latin` subset of `@fontsource-variable/jetbrains-mono` in `src/main.tsx` and set `font-display: swap`, then confirm no request reaches a third-party host (FR-024; gate V-012)
- [X] T012 Add the blocking inline theme script to `<head>` in `index.html`, resolving stored preference → `prefers-color-scheme` → dark and setting `data-theme` on `<html>` before first paint (research D6; FR-021)
- [X] T013 Create `src/theme.ts` exporting the `Theme` union, the resolution order, and read/write persistence helpers — **application logic only, no UI control** (the control ships in US4)

### Localization mechanism

- [X] T014 Create `src/content/i18n/types.ts` defining `LOCALES`, the `Locale` union, and `Localized<T> = Record<Locale, T>` per [data-model.md](./data-model.md) (research D7)
- [X] T015 Create `src/content/i18n/en.ts` with the interface-string dictionary and export `StringKey = keyof typeof en`, making English the source of the key set
- [X] T016 Create `src/content/i18n/pt.ts` declared `satisfies Record<StringKey, string>`, so a missing or misspelled key fails `tsc -b` (FR-017)
- [X] T017 [P] Create `src/content/i18n/__tests__/locales.test.ts` asserting both dictionaries share an identical key set and that no Portuguese value is byte-identical to its English counterpart unless it is a proper noun (gate V-006)
- [X] T018 Create `src/locale.ts` exporting the active-locale resolution order, persistence, and a `t(key)` lookup — no React binding yet

### Content schema

- [X] T019 Create `src/content/types.ts` defining `Project`, `ProjectKind`, `ProjectState`, `StackGroup`, `Metric`, `ProjectLink`, `ProjectImage`, `Technology`, `TechCategory`, `AuthorProfile`, `Contact` and `ContentBundle`, exactly as specified in [data-model.md](./data-model.md), using `const` objects plus `keyof typeof` unions rather than `enum`
- [X] T020 [P] Create `src/content/__tests__/schema.test.ts` asserting every validation rule from data-model.md: `limitations` non-empty for every project (FR-004, gate V-004), `authsys` is `state: 'skeleton'` and `kind: 'study'` (FR-003, gate V-005), unique ids matching `/^[a-z0-9-]+$/`, `period.start` before `period.end`, and every `stack` reference resolving to a known Technology

**Checkpoint**: Tokens render in both themes with no flash, contrast passes, the locale mechanism compiles, and the schema test runs (failing only because no content exists yet).

---

## Phase 3: User Story 1 — Hiring manager judges the work in two minutes (Priority: P1) 🎯 MVP

**Goal**: A static, content-complete, terminal-styled site carrying all nine real projects,
readable with no typing and no optional features.

**Independent Test**: Load cold on a phone with JavaScript disabled. Identity, experience
duration, and all nine projects with problem, stack, state and limitations are readable, and a
contact route is reachable (V-019 … V-022).

**Note on bilingual content**: project records carry `Localized` prose inline, so writing a
record means writing both languages at once. Content parity therefore lands here by
construction; US3 delivers the *switching*, not the translations.

### Content records

- [X] T021 [P] [US1] Create `src/content/technologies.ts` with every technology referenced across the nine projects, each with `id`, `name` and `category`
- [X] T022 [P] [US1] Create `src/content/profile.ts` with name, handle, tagline, biography, `experienceStart: '2023-01-01'`, location and contacts (email, GitHub, Linktree), plus a build-time-derived experience duration helper — never a stored figure (FR-007)
- [X] T023 [P] [US1] Create `src/content/projects/telasparana.ts` — `client`, `production`, 368 commits, 2026-03-24→2026-06-28, including the full security trail per CL-001 and the limitations declared in its README (`AllowedHosts` deferred, shared HS256 secret, e-mail verification pending)
- [X] T024 [P] [US1] Create `src/content/projects/selzler-construtora.ts` — `client`, `functional`, 119 commits, 2026-07-14→2026-07-24, including the dated stack lock, the inherited structure from telasparana, and the four-sweep audit
- [X] T025 [P] [US1] Create `src/content/projects/generative-ai-e2.ts` — `training`, `delivered`, 71 commits, with the measured link-coverage table and the golden-set metrics as `Metric` entries, and the deliberate limitations (LLM disabled after 1 of 3 injection vectors passed; SLA absent at source; Freshservice against mock)
- [X] T026 [P] [US1] Create `src/content/projects/viralvideogen.ts` — `product`, `functional`, 38 commits, including the three defining decisions (no full-chain `generate`, `record` decodes before believing, `assemble` sums measured duration)
- [X] T027 [P] [US1] Create `src/content/projects/studiobiasantos.ts` — `client`, `production`, 23 commits, including the single-weight typography constraint and the declared test-suite limit
- [X] T028 [P] [US1] Create `src/content/projects/howzysolutions.ts` — `product`, `in-progress`, honestly describing the current state including this rebrand in progress
- [X] T029 [P] [US1] Create `src/content/projects/terminal.ts` — `tooling`, `functional`, 7 commits, including what it explicitly does not do (font selection is a manual GUI step)
- [X] T030 [P] [US1] Create `src/content/projects/authsys.ts` — `study`, `skeleton`, 6 commits, stating plainly that the auth middleware is an empty package declaration, the Makefile is empty, and there are no tests (FR-003, FR-004)
- [X] T031 [P] [US1] Create `src/content/projects/skeeper-specs.ts` — `tooling`, `functional`, 2 commits, including the two operational constraints (HTTPS remotes, LF line endings)
- [X] T032 [US1] Create `src/content/projects/index.ts` exporting the ordered array, and `src/content/index.ts` assembling the `ContentBundle` (depends on T021–T031)
- [X] T033 [US1] Run `npm test` and confirm `src/content/__tests__/schema.test.ts` now passes against real content (gates V-004, V-005 in `quickstart.md`)

### Presentation

- [X] T034 [P] [US1] Create `src/components/Chrome.tsx` — the sticky editor-style bar with the traffic-light dots and the current path label, with slots for the theme and language controls that US3 and US4 will fill
- [X] T035 [P] [US1] Create `src/components/SectionLabel.tsx` rendering the `## label` markdown-comment section heading from the design direction
- [X] T036 [US1] Create `src/components/ProjectList.tsx` rendering all nine projects with name, summary, state badge, primary stack and period, reading from the content bundle
- [X] T037 [US1] Create `src/components/ProjectDetail.tsx` rendering one full project record, giving `limitations` the same visual prominence as `capabilities` (FR-004) and rendering correctly with `images` empty
- [X] T038 [US1] Create `src/pages/Home.tsx` composing hero, positioning, project list and contact, with the CSS staggered entry reveal and `IntersectionObserver` scroll reveal replacing what `framer-motion` did (research D1)
- [X] T039 [US1] Create `src/pages/Work.tsx` rendering a single project detail page, parameterised by project id
- [X] T040 [US1] Rewrite `src/App.tsx` to select the page from the current pathname, and `src/main.tsx` to hydrate the prerendered markup rather than render from empty

### Prerendering and retirement

- [X] T041 [US1] Create `scripts/prerender.mjs` that renders `Home` and one `Work` page per project with `renderToStaticMarkup`, injects each into the built shell, and writes `dist/index.html` and `dist/work/<id>/index.html` with per-page `<title>` and `<meta name="description">` (research D3; FR-006)
- [X] T042 [US1] Wire `scripts/prerender.mjs` into the `build` script in `package.json` so it runs after `vite build`
- [X] T043 [US1] Delete `src/components/Experience.tsx`, `ScrollCamera.tsx`, `ScrollNav.tsx`, `ProjectOrb.tsx`, `ProjectPanel.tsx`, `HeroOverlay.tsx`, `PageSections.tsx`, plus `src/App.css`, `src/data/projects.ts`, `src/assets/react.svg` and `src/assets/vite.svg` (FR-036), then in the **same commit** remove `framer-motion` from `package.json` and run `npm install` — `ProjectPanel`, `HeroOverlay` and `PageSections` are its only importers, so removing the dependency before deleting them leaves the build red (research D1; gate V-013)
- [X] T044 [US1] Rename `src/components/DotWaveField.tsx` to `src/components/PointField.tsx` and strip its scroll coupling, leaving it unreferenced until US6 consumes it (FR-038)
- [X] T045 [US1] Replace `src/index.css` with imports of `src/styles/tokens.css` and `src/styles/base.css`, removing every violet/cyan glass rule (FR-036)
- [ ] T046 [US1] Run `npm run build` and confirm the entry chunk is **≤ 120 KB gzipped** against the figure recorded in `specs/001-terminal-portfolio-rebrand/baseline.md` — **the budget gate lands here, before the terminal exists** (gate V-014 in `quickstart.md`)
- [ ] T047 [US1] Execute procedures V-019 … V-022 from `quickstart.md` in a real browser at 375px and 1440px, including the JavaScript-disabled pass, and attach screenshots

**Checkpoint**: The site is content-complete and replaces the current one. **This is the MVP — deployable on its own.**

---

## Phase 4: User Story 2 — Developer explores by typing commands (Priority: P2)

**Goal**: A live prompt answering real commands, drawing on the same records the page renders.

**Independent Test**: Focus the prompt with the keyboard alone, run every documented command,
run an unknown one, and confirm each answer matches what the static page shows (V-023 … V-031).

### Engine — pure, testable, no renderer

- [ ] T048 [P] [US2] Create `src/terminal/parse.ts` tokenizing an input line into command name, positional arguments and flags, handling quoted strings and the optional leading `h0wzy` word
- [ ] T049 [P] [US2] Create `src/terminal/suggest.ts` implementing Levenshtein distance with a threshold of 2, for did-you-mean over command names, aliases and project ids
- [ ] T050 [US2] Create `src/terminal/types.ts` defining `CommandResult`, `OutputLine`, `Effect`, `CommandContext` and `Command` exactly as in [contracts/terminal-commands.md](./contracts/terminal-commands.md)
- [ ] T051 [US2] Create `src/terminal/registry.ts` collecting every command, so `help` is derived from the registry rather than maintained beside it (FR-009)
- [ ] T052 [P] [US2] Implement `help`, `version`, `whoami`, `about` in `src/terminal/commands/identity.ts`, with `version` emitting `h0wzy <Y>.<M>.0` and citing the experience and tracked-time periods separately (FR-028)
- [ ] T053 [P] [US2] Implement `projects` with `--list-all`, `<id>`, `--stack <tech>` and `--kind <kind>` in `src/terminal/commands/projects.ts`
- [ ] T054 [P] [US2] Implement `stack`, `ls`, `contact` in `src/terminal/commands/surface.ts`
- [ ] T055 [P] [US2] Implement `lang`, `theme`, `clear`, `open` in `src/terminal/commands/effects.ts`, each **returning an effect descriptor rather than performing it** (Principle IV; FR-015)
- [ ] T056 [US2] Create `src/terminal/engine.ts` exporting `execute()`, importing nothing from React, Three.js or the DOM, and implementing every row of the error contract (FR-011)
- [ ] T057 [P] [US2] Create `src/terminal/__tests__/engine.test.ts` covering every documented usage, every error-contract row, and purity — `execute` twice with equal input returns deep-equal results (gates V-007, V-008)
- [ ] T058 [P] [US2] Create `src/terminal/__tests__/parity.test.ts` asserting command output never contradicts the content record it derives from (FR-010) and that no command emits English when `locale: 'pt'`
- [ ] T059 [US2] Add an ESLint rule or a test asserting that no module under `src/terminal/` imports React, Three.js, or a DOM global, so Principle IV is enforced mechanically rather than by review

### DOM renderer

- [ ] T060 [US2] Create `src/components/Terminal2D.tsx` with a real `<input>` inside a `<form>`, a scrollback carrying `role="log"` and `aria-live="polite"`, and selectable output text (research D8; FR-008, FR-013)
- [ ] T061 [US2] Implement history recall on ArrowUp/ArrowDown and Tab completion in `src/components/Terminal2D.tsx`, resolving to the unique match or listing candidates (FR-012)
- [ ] T062 [US2] Implement effect application in `src/components/Terminal2D.tsx` — the renderer performs `set-locale`, `set-theme`, `clear` and `navigate`; the engine never does (FR-015)
- [ ] T063 [US2] Add the first-use affordance to `src/components/Terminal2D.tsx` stating what to type first, visible without interaction (FR-014)
- [ ] T064 [US2] Mount the terminal in `src/pages/Home.tsx` and confirm the output region scrolls within itself at 375px without the page scrolling horizontally (edge case; V-031)
- [ ] T065 [US2] Execute procedures V-023 … V-031 from `quickstart.md` in a real browser, including the screen-reader pass (V-028), and attach evidence

**Checkpoint**: US1 and US2 both work independently.

---

## Phase 5: User Story 3 — Brazilian visitor reads in Portuguese (Priority: P3)

**Goal**: A complete language switch — chrome, content, terminal output and errors.

**Independent Test**: Switch to Portuguese, traverse every section and command, confirm zero
English prose remains, reload and confirm persistence (V-032 … V-035).

- [ ] T066 [US3] Create `src/LocaleProvider.tsx` binding `src/locale.ts` to React with context, switching without a page reload and preserving scroll position (FR-016)
- [ ] T067 [US3] Add the language control to `src/components/Chrome.tsx`, sharing the exact code path the `lang` command's effect uses (FR-015)
- [ ] T068 [US3] Keep `document.documentElement.lang` synchronized with the active locale in `src/LocaleProvider.tsx` (FR-018)
- [ ] T069 [US3] Handle an unsupported stored locale value by falling back to English and rewriting the stored value, in `src/locale.ts` (edge case)
- [ ] T070 [US3] Emit `<link rel="alternate" hreflang>` per locale from `scripts/prerender.mjs` for each prerendered page
- [ ] T071 [US3] Execute procedures V-032 … V-035 from `quickstart.md` in a real browser, sweeping every section and every command for untranslated strings

**Checkpoint**: US1–US3 independently functional.

---

## Phase 6: User Story 4 — Visitor reads in their preferred theme (Priority: P3)

**Goal**: A designed light theme and a persisted override, with no flash on first paint.

**Independent Test**: Cold-load in each system setting, override each way, reload, and confirm
the correct theme on frame one with zero frames of the opposite theme (V-036 … V-039).

- [ ] T072 [US4] Create `src/ThemeProvider.tsx` binding `src/theme.ts` to React, kept consistent with the value the T012 inline script already applied so hydration does not re-flash
- [ ] T073 [US4] Add the theme control to `src/components/Chrome.tsx`, sharing the exact code path the `theme` command's effect uses (FR-015)
- [ ] T074 [US4] Handle an unsupported stored theme value by falling back to the system preference and rewriting the stored value, in `src/theme.ts` (edge case)
- [ ] T075 [US4] Review every surface in light mode — terminal, error output, state badges, statistics — and correct any token misuse found across `src/components/*.tsx` and `src/styles/tokens.css`, without introducing a literal colour (gate V-010)
- [ ] T076 [US4] Execute procedures V-036 … V-039 from `quickstart.md` in a real browser, recording the first painted frame in both system settings

**Checkpoint**: US1–US4 independently functional.

---

## Phase 7: User Story 5 — Visitor sees that the work is ongoing (Priority: P4)

**Goal**: Measured coding activity, each figure carrying its source and period, resolved at
build time with a committed last-known-good artifact.

**Independent Test**: Figures match the source for the same period; the site builds and
publishes previous figures when the source is unreachable (V-016 … V-018, V-040 … V-042).

- [ ] T077 [P] [US5] Create `scripts/fetch-wakatime.mjs` reading `WAKATIME_API_KEY` from the build environment only, calling the authenticated all-time stats endpoint with a 15-second timeout, and writing `src/content/wakatime.generated.json` (research D10; FR-029, FR-030)
- [ ] T078 [US5] Implement every row of the failure contract in `scripts/fetch-wakatime.mjs` — unset key, network failure, 401/403, 429, malformed payload — each warning, retaining the committed artifact with `isFallback: true`, and **exiting 0** (FR-031)
- [ ] T079 [US5] Wire `scripts/fetch-wakatime.mjs` into the `build` script in `package.json`, before `vite build`
- [ ] T080 [US5] Commit the first `src/content/wakatime.generated.json` as the last-known-good baseline
- [ ] T081 [US5] Create `src/content/stats.ts` validating the artifact's shape at import and exposing a typed `CodingStatsSnapshot`
- [ ] T082 [P] [US5] Create `src/content/__tests__/stats.test.ts` asserting the transform handles a malformed payload without throwing and that `range` is always present (FR-027)
- [ ] T083 [US5] Create `src/components/StatsPanel.tsx` rendering total, languages, **editors and categories** (published deliberately), and the per-project distribution — every section stating its period adjacent to its figures (FR-026, FR-027)
- [ ] T084 [US5] Render the experience duration and the tracked coding time so their different start dates are unambiguous and neither reads as corroborating the other, in `src/components/StatsPanel.tsx` and `src/pages/Home.tsx` (FR-028)
- [ ] T085 [US5] Surface an explicit staleness note when `isFallback` is true, in `src/components/StatsPanel.tsx`
- [ ] T086 [US5] Join `wakatimeProject` to the snapshot in `src/components/ProjectDetail.tsx`, rendering nothing rather than zero when a project has no measured time (data-model validation rule)
- [ ] T087 [US5] Implement the `stats` command in `src/terminal/commands/stats.ts` and register it, with `--languages`, `--editors` and `--projects`, each printing its range
- [ ] T088 [US5] Execute procedures V-016 … V-018 and V-040 … V-042 from `quickstart.md`, including a build with `WAKATIME_API_KEY` unset and one with an invalid key

**Checkpoint**: US1–US5 independently functional.

---

## Phase 8: User Story 6 — Visitor opts into the immersive rendering (Priority: P5)

**Goal**: The same terminal re-presented inside a rendered environment, costing nothing to
anyone who does not ask for it, reusing the existing point field and glow (FR-038).

**Independent Test**: Compare transferred bytes with and without opting in; run identical
commands in both presentations and diff the output text (V-043 … V-046).

- [ ] T089 [US6] Create `src/components/Terminal3D.tsx` rendering the environment in WebGL and composing the DOM `Terminal2D` over it via drei's `<Html transform>` — **never drawing terminal text into WebGL** (research D9; FR-034)
- [ ] T090 [US6] Reuse `src/components/PointField.tsx` (from T044) as the environment backdrop and apply the postprocessing glow as the monitor's phosphor bloom, satisfying the reuse required by FR-038
- [ ] T091 [US6] Add the opt-in control to `src/components/Chrome.tsx`, loading `Terminal3D` through `React.lazy` with a dynamic import so nothing WebGL enters the initial bundle (FR-032, FR-033)
- [ ] T092 [US6] Extract terminal session state into `src/terminal/useTerminalSession.ts` and lift it above both renderers in `src/App.tsx`, so opting out preserves command history (US6 acceptance scenario 4)
- [ ] T093 [US6] Detect absent WebGL support in `src/components/Terminal3D.tsx` before mounting the scene and report it plainly, leaving the visitor on the DOM renderer (FR-035)
- [ ] T094 [US6] Suppress all scene motion under `prefers-reduced-motion: reduce` in `src/components/Terminal3D.tsx` (FR-025, US6 acceptance scenario 5)
- [ ] T095 [US6] Run `npm run build` and confirm `three` and `@react-three/*` resolve into a separate chunk absent from the entry's static imports, and that the entry is still ≤ 120 KB gzipped (gates V-014, V-015)
- [ ] T096 [US6] Execute procedures V-043 … V-046 from `quickstart.md` in a real browser, including the WebGL-disabled pass

**Checkpoint**: All six user stories independently functional.

---

## Phase 9: Polish & Cross-Cutting Concerns

- [ ] T097 [P] Rewrite `README.md` to describe this portfolio — what it is, how to run it, the build pipeline, and the `WAKATIME_API_KEY` build-environment requirement — replacing the Vite starter template (FR-037)
- [ ] T098 [P] Rewrite `CLAUDE.md` as project instructions — stack, conventions, the constitution's non-negotiables, the token rule and the content-is-data rule — replacing the prompt dump currently there (FR-036)
- [ ] T099 [P] Update `.gemini/GEMINI.md` so it describes the terminal-minimal portfolio rather than the retired 3D concept, or delete it if it is no longer used
- [ ] T100 [P] Add a scheduled GitHub Actions workflow in `.github/workflows/refresh-stats.yml` triggering a rebuild at most daily to refresh the statistics artifact (research D10)
- [ ] T101 [P] Add a CI workflow in `.github/workflows/ci.yml` running `npm run lint`, `npm run build` and `npm test` on every pull request (Principle VII)
- [ ] T102 Verify SC-014 by adding a throwaway tenth record under `src/content/projects/`, confirming it appears in the list, at its own address and in terminal output with **no change to any file outside `src/content/`**, then revert it
- [ ] T103 Run the full automated gate set V-001 … V-018 from `quickstart.md` and record the results
- [ ] T104 Run the full manual procedure set V-019 … V-048 from `quickstart.md` in a real browser and attach screenshots to the pull request
- [ ] T105 Confirm SC-015 by auditing `src/content/` — no placeholder or invented content remains, and every published claim traces to a real repository, a measured figure, or a stated fact
- [ ] T106 Configure the `skeeper-specs` sidecar to mirror `specs/**` under a `howzysolutions` namespace, using an HTTPS remote and LF line endings (spec assumption; runs on the author's machine, not in CI)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies
- **Foundational (Phase 2)**: depends on Setup — **blocks every user story**
- **US1 (Phase 3)**: depends on Foundational. Independently deployable
- **US2 (Phase 4)**: depends on Foundational. Mounts into US1's home page (T064)
- **US3 (Phase 5)**: depends on Foundational. Translates US1's chrome and US2's output if present
- **US4 (Phase 6)**: depends on Foundational
- **US5 (Phase 7)**: depends on Foundational. Registers a command if US2 is present (T087)
- **US6 (Phase 8)**: depends on US2 — it re-presents that terminal — and on T044
- **Polish (Phase 9)**: depends on every story intended for the release

### Story Dependencies

US1 through US5 depend only on the Foundational phase and can be built in any order after it.
**US6 is the sole exception**: it renders the US2 terminal inside an environment, so US2 must
exist first. Where a later story touches an earlier one it *adds* to it — T064 mounts, T087
registers, T067 and T073 fill the slots T034 left — so each story stays independently testable.

### Ordering correction applied during implementation

`framer-motion` removal was originally listed in Phase 1. It cannot run there: `ProjectPanel`,
`HeroOverlay` and `PageSections` import it and are not deleted until T043, so removing the
dependency first leaves `npm run build` red for the whole of Phase 2. The removal moved into
T043 so the deletion and the dependency drop land in one commit and the build is green at
every boundary. T002 now covers the ignore-file work instead.

### Within Each Story

Content and types before components; components before pages; engine before renderer; tests
alongside the pure logic they cover, never after the story closes.

### Parallel Opportunities

- Phase 1: T003–T006 in parallel after T002
- Phase 2: T008, T009, T011 in parallel after T007; T017 and T020 alongside their subjects
- **Phase 3: T023–T031 — all nine project records are separate files with no shared state, so
  all nine can be written in parallel.** This is the single largest parallel block, and the
  reason each project got its own module rather than one large `projects.ts`
- Phase 4: T048 and T049 in parallel; T052–T055 in parallel once T050 and T051 exist; T057 and T058 in parallel
- Phase 9: T097–T101 in parallel

---

## Parallel Example: User Story 1 content

```bash
# Nine independent files, no shared state — write them concurrently:
Task: "Create src/content/projects/telasparana.ts"
Task: "Create src/content/projects/selzler-construtora.ts"
Task: "Create src/content/projects/generative-ai-e2.ts"
Task: "Create src/content/projects/viralvideogen.ts"
Task: "Create src/content/projects/studiobiasantos.ts"
Task: "Create src/content/projects/howzysolutions.ts"
Task: "Create src/content/projects/terminal.ts"
Task: "Create src/content/projects/authsys.ts"
Task: "Create src/content/projects/skeeper-specs.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 — Setup
2. Phase 2 — Foundational (blocks everything)
3. Phase 3 — US1
4. **STOP and VALIDATE**: V-019 … V-022, and **V-014, the budget gate**
5. Deploy. The site is content-complete and already replaces the current one.

**T046 is the checkpoint that matters most.** The budget gate fires before the terminal is
written, so a payload problem is caught while the code is still small enough to diagnose,
rather than after all six stories are in.

### Incremental Delivery

Each story below is deployable on completion, and none breaks the one before it:

US1 (MVP) → US2 (the differentiator) → US3 + US4 (presentation control, parallelizable) →
US5 (live evidence) → US6 (the flex).

### Suggested Stopping Points

Stopping after **US2** yields a portfolio that is complete, honest and distinctive — the
interactive terminal is the differentiator, and everything after it is refinement. Stopping
after **US4** yields the full product for every reader. US5 and US6 are additive and can
follow the domain purchase.

---

## Notes

- `[P]` = different files, no dependency on an incomplete task
- Commit after each task or logical group; conventional commits, per the constitution
- Screenshots belong in the pull request for every visual change
- Never introduce a literal colour, a third-party host, or a credential — three greps in the
  gate set exist specifically to catch each
