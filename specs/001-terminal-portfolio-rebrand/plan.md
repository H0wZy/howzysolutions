# Implementation Plan: Terminal-Minimal Portfolio Rebrand

**Branch**: `claude/portfolio-frontend-redesign-ay20gi` | **Date**: 2026-08-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-terminal-portfolio-rebrand/spec.md`

## Summary

Replace the scroll-driven 3D portfolio — whose content is three records, two of them
placeholders — with a terminal-minimal site carrying all nine of the author's real projects,
centred on an interactive terminal that answers real commands about them.

The approach is set by one measured fact. **The current site ships 519.3 KB of gzipped
JavaScript against a 120 KB budget.** Closing that gap drives every technical decision:
`framer-motion` is removed (−44.5 KB measured, replaced by CSS and `IntersectionObserver`), the
WebGL group is moved behind an opt-in dynamic import (358.1 KB measured, 3× the whole budget),
and routing is solved by emitting prerendered HTML per route rather than shipping a router.

**React itself became the last thing to go.** Its client runtime measures 117.2 KB gzipped in
this toolchain — 98% of the budget — for pages whose only interactivity is a scroll reveal and
a command prompt. Since every page is prerendered and the command engine is already pure
TypeScript, React moved to build time: it renders the HTML and never reaches the browser,
returning only inside the opt-in immersive renderer where R3F needs it and FR-033 excludes it
from the budget. Research D2 records the corrected measurement and how the original one was
wrong.

The command engine is pure TypeScript with no framework or DOM import, so the DOM renderer and
the immersive renderer share one implementation and one set of facts. Content — projects,
biography, both locale dictionaries — is typed data, making a missing Portuguese translation a
compile error rather than a runtime fallback.

**Measured initial payload: 0.56 KB gzipped**, against a 519.32 KB baseline and a 120 KB
budget.

## Technical Context

**Language/Version**: TypeScript ~6.0 targeting ES2023, React 19.2. `erasableSyntaxOnly` and
`verbatimModuleSyntax` are enabled — no `enum`, no parameter properties, `import type` required
for type-only imports (research D11).

**Primary Dependencies**: React 19 + `react-dom` — **build-time only**, used by
`renderToStaticMarkup` during prerendering and never shipped to the browser (117.2 KB gz
avoided). `three` + `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing`
(kept, dynamically imported only, 358.1 KB gz). **Removed**: `framer-motion` (44.5 KB gz).
**Added**: `vitest` (dev, 0 visitor bytes), `@fontsource-variable/jetbrains-mono` (one
subsetted woff2, 0 JS).

**Storage**: None. All content is typed modules in `src/content/`. The only generated artifact
is `wakatime.generated.json`, produced at build time and committed as last-known-good.

**Testing**: Vitest for pure logic — command engine, content schema, locale completeness,
statistics transform. Real-browser procedures for anything visual, because jsdom proves a token
was applied and never proves a pixel was painted. Both enumerated in [quickstart.md](./quickstart.md).

**Target Platform**: Static site on Vercel; evergreen browsers, mobile first. Destination
domain `howzysolutions.dev` (acquisition out of scope).

**Project Type**: Prerendered static multi-page site. No client framework; one progressively
enhanced interactive region.

**Performance Goals**: LCP ≤ 1.8 s and identity readable within 2 s on a mid-range phone
(SC-001); CLS ≤ 0.05; 60 fps scrolling; Lighthouse mobile ≥ 95 performance, 100 accessibility.

**Constraints**: **≤ 120 KB initial JS gzipped**, excluding the lazily imported WebGL renderer
— measured baseline 519.3 KB. WCAG 2.2 AA in both themes. No third-party request of any kind:
no font CDN, no analytics, no social SDK. No credential in the client bundle or the repository.
Zero frames of the wrong theme on first paint.

**Scale/Scope**: 9 project records × 2 locales; 10 prerendered routes (home + 9 projects); ~16
terminal commands; 2 themes; 2 renderers over 1 engine.

## Constitution Check

*GATE: evaluated before Phase 0, re-evaluated after Phase 1 design.*

Against [constitution v1.1.0](../../.specify/memory/constitution.md).

| Principle | Gate | Pre-Phase 0 | Post-Phase 1 | How the design satisfies it |
|---|---|:---:|:---:|---|
| **I. Content Is Data, Not Markup** | Adding a project is a data-only edit | ✅ | ✅ | All content in `src/content/`; list, page and terminal are three renderings of one record (data-model relationships). SC-014 tests a tenth project. |
| **II. Minimum Code That Works** | Every new dependency justified by a failed ladder rung | ✅ | ✅ | Net **−1** runtime dependency. Two additions, each with its failing rung recorded (research D4, D5). Routing removed entirely at rung 1 (D3). |
| **III. Accessible By Construction** | Keyboard + screen reader on every surface; AA both themes | ✅ | ✅ | Real `<input>` in a `<form>`, `role="log"` + `aria-live="polite"` (D8). Immersive renderer composes DOM text over WebGL rather than drawing text into it (D9). Contrast measured, not assumed (contracts/design-tokens.md). |
| **IV. Renderer-Agnostic Core** | Engine imports no React/Three/DOM; WebGL lazy and opt-in | ✅ | ✅ | `execute()` is pure and returns structured output plus effect descriptors it does not perform (contracts/terminal-commands.md). V-007 asserts purity; V-015 asserts the chunk split. |
| **V. Bilingual Parity** | Missing translation is a type error | ✅ | ✅ | `Localized<T>` inline on content records; `satisfies Record<StringKey, string>` for interface strings (D7). V-006. |
| **VI. Themed Through Tokens** | Single token set; no literal colour in components | ✅ | ✅ | Full token contract with both themes defined. V-009 recomputes contrast; V-010 greps for literals. |
| **VII. Verified Before Merge** | Build + lint gate; unit tests where logic is pure | ✅ | ✅ | Vitest added specifically because no runner existed. V-001…V-003 gate every merge. |
| **Secrets & external data** | No credential in bundle or repo; last-known-good fallback | ✅ | ✅ | Build-time fetch from build-env secret; artifact committed; every failure mode exits 0 (contracts/wakatime-snapshot.md). V-011, V-016, V-017. |
| **Honesty in self-reported metrics** | Every figure carries source and period | ✅ | ✅ | `range` is mandatory on the snapshot; experience and tracked time are separate records with separate periods (data-model). V-040, V-041. |
| **Performance budgets** | ≤120 KB initial JS gz; LCP ≤1.8 s; CLS ≤0.05 | ⚠️ **baseline fails at 519.3 KB** | ✅ **measured 0.56 KB** | Closing this gap is the plan's organising constraint. V-014 gates it, and caught the first attempt at 147.9 KB. |
| **Privacy** | No third-party analytics, fonts, or SDKs | ✅ | ✅ | Fonts self-hosted (D5); statistics resolved at build time, never from the browser (D10). V-012. |

**Result: PASS.** No violation requires justification, so Complexity Tracking is empty. The one
⚠️ is the inherited baseline this feature exists to fix, not a violation the design introduces.

## Project Structure

### Documentation (this feature)

```text
specs/001-terminal-portfolio-rebrand/
├── plan.md                        # This file
├── spec.md                        # 38 FRs, 15 SCs, both clarifications resolved
├── research.md                    # Phase 0 — 11 decisions, all measurements reproducible
├── data-model.md                  # Phase 1 — entities, vocabularies, validation rules
├── quickstart.md                  # Phase 1 — V-001 … V-048 validation procedures
├── contracts/
│   ├── terminal-commands.md       # Engine + renderer contract, error contract
│   ├── design-tokens.md           # Both themes with measured contrast ratios
│   └── wakatime-snapshot.md       # Artifact shape + failure contract
└── checklists/requirements.md     # 16/16 passing
```

### Source Code (repository root)

```text
scripts/
├── fetch-wakatime.mjs             # Build-time stats fetch; never fails the build
├── prerender.mjs                  # Emits dist/index.html + dist/work/<id>/index.html
└── check-contrast.mjs             # Recomputes every token ratio; fails on regression

src/
├── content/                       # Principle I — the only place a fact is authored
│   ├── projects.ts                # 9 records, replacing the 3 placeholders
│   ├── technologies.ts
│   ├── profile.ts                 # experienceStart: 2023-01-01; duration derived at build
│   ├── stats.ts                   # typed view over the generated artifact
│   ├── wakatime.generated.json    # committed last-known-good
│   └── i18n/
│       ├── en.ts                  # source of the StringKey union
│       └── pt.ts                  # satisfies Record<StringKey, string>
│
├── terminal/                      # Principle IV — pure core
│   ├── engine.ts                  # execute(); no React, Three, or DOM import
│   ├── parse.ts                   # tokenizer + flag parsing
│   ├── suggest.ts                 # Levenshtein for did-you-mean
│   ├── commands/                  # one module per command; registry drives `help`
│   └── __tests__/
│
├── enhance/                       # the only code that reaches the browser
│   └── reveal.ts                  # IntersectionObserver scroll reveal
│
├── components/                    # BUILD-TIME ONLY — consumed by entry-server.tsx
│   ├── Chrome.tsx                 # sticky editor bar: theme + language controls
│   └── Terminal3D.tsx             # dynamically imported; DOM terminal over WebGL (D9)
│   ├── PointField.tsx             # carried over from DotWaveField (FR-038)
│   ├── ProjectList.tsx
│   ├── ProjectDetail.tsx
│   └── StatsPanel.tsx
│
├── pages/
│   ├── Home.tsx
│   └── Work.tsx                   # rendered once per project at build time
│
├── styles/
│   ├── tokens.css                 # both themes; the only place a colour is written
│   └── base.css
│
├── theme.ts                       # preference resolution + persistence
├── entry-server.tsx               # build-time render entry for prerender.mjs
└── main.ts                        # vanilla client entry — no framework

index.html                         # + blocking inline theme script (D6, FR-021)
public/fonts/                      # self-hosted woff2 (D5, FR-024)
```

**Removed**: `src/components/{Experience,ScrollCamera,ScrollNav,ProjectOrb,ProjectPanel,HeroOverlay,PageSections}.tsx`,
`src/App.css`, `src/data/projects.ts`, `src/assets/{react,vite}.svg`. `DotWaveField.tsx`
survives as `PointField.tsx` under US6 (FR-038). `CLAUDE.md` — currently a prompt dump — and
`README.md` — currently the Vite starter template — are rewritten (FR-036, FR-037).

**Structure Decision**: Single project, no `frontend/`+`backend/` split, because there is no
backend and adding one would fail Principle II at rung 1. The layout's organising idea is the
`content/` ÷ `terminal/` ÷ `components/` separation: `content/` is the only place a fact is
authored (Principle I), `terminal/` is pure and independently testable (Principle IV), and
`components/` may import from both but is never imported by either. That direction of
dependency is what keeps the engine renderer-agnostic and what makes SC-014 — add a tenth
project by editing data only — true by construction rather than by care.

## Implementation Sequencing

Ordered so each step is independently verifiable and the site stays deployable throughout.

| Step | Delivers | Gate |
|---|---|---|
| 1 | Tokens, both themes, no-flash script, self-hosted font, `check-contrast.mjs` | V-009, V-010 |
| 2 | Content schema + all 9 project records + both locale dictionaries; `framer-motion` removed | V-004, V-005, V-006, V-013 |
| 3 | Command engine + tests (pure, no renderer yet) | V-007, V-008 |
| 4 | Home + project pages; prerender script; old components deleted | V-019 … V-022, **V-014** |
| 5 | `Terminal2D` and its accessibility surface | V-023 … V-031 |
| 6 | Language and theme controls, plus their terminal commands | V-032 … V-039 |
| 7 | WakaTime script, artifact, panel | V-016 … V-018, V-040 … V-042 |
| 8 | `Terminal3D` behind the opt-in; `PointField` carried over | V-015, V-043 … V-046 |
| 9 | `README.md` and `CLAUDE.md` rewritten | FR-036, FR-037 |

Steps 1–4 constitute US1, the MVP that already replaces the current site. **The budget gate
(V-014) lands at step 4**, before the terminal is built, so a budget failure is caught while
the payload is still small enough to diagnose rather than after everything is in.

## Complexity Tracking

No constitutional violations require justification. Table intentionally empty.
