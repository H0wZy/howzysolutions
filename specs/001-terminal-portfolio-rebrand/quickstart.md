# Quickstart: Validating the Terminal-Minimal Portfolio

**Spec**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md) · **Contracts**: [contracts/](./contracts/)

Runnable procedures that prove the feature works. Each maps to success criteria in the spec.
Numbered `V-###` in one continuous sequence, following the convention already used in
`studiobiasantos`.

## Prerequisites

```bash
node --version     # 22.x — matches the toolchain this was built against
npm ci
```

`WAKATIME_API_KEY` is **not** required for local development. Its absence is a supported path
(see [contracts/wakatime-snapshot.md](./contracts/wakatime-snapshot.md)) and V-016 tests it.

## Commands

```bash
npm run dev        # dev server
npm run build      # tsc -b && fetch stats && vite build && prerender
npm test           # vitest run — engine, schema, locales, stats transform
npm run lint       # eslint
npm run preview    # serve dist/ — REQUIRED for anything touching routing or prerender
```

Routing and prerender validation MUST run against `npm run preview`, not `npm run dev`: the
dev server serves the SPA shell for every path, so a broken prerender still looks correct
there. Only the preview server serves the real emitted files.

---

## Automated gates

Everything here runs in CI and must be green before merge (Principle VII).

| ID | Procedure | Passes when | Covers |
|---|---|---|---|
| **V-001** | `npm run lint` | Zero errors. | Principle VII |
| **V-002** | `npm run build` | Exits 0. Typecheck included. | Principle VII |
| **V-003** | `npm test` | All green. Engine, schema, locale, stats. | Principle VII |
| **V-004** | `npm test` — schema suite | Every project has non-empty `limitations`. | FR-004 |
| **V-005** | `npm test` — schema suite | `authsys` is `state: 'skeleton'`, `kind: 'study'`. | FR-003 |
| **V-006** | `npm test` — locale suite | Every `StringKey` resolves in both locales; no key missing. | FR-017, SC-006 |
| **V-007** | `npm test` — engine purity | `execute` twice with equal input returns deep-equal results. | Principle IV |
| **V-008** | `npm test` — engine errors | Every row of the error contract behaves as specified. | FR-011 |
| **V-009** | `node scripts/check-contrast.mjs` | Every token pair meets its floor in both themes. | FR-023, SC-007 |
| **V-010** | `grep -rnE '#[0-9a-fA-F]{3,8}\|rgb\(\|hsl\(' src --include=*.tsx` | No matches. | FR-022 |
| **V-011** | `grep -rn "waka_" . && grep -rn "waka_" dist` | No matches in either. | FR-030, SC-013 |
| **V-012** | `grep -rn "fonts.googleapis\|fonts.gstatic\|cdn\." src index.html` | No matches. | FR-024 |
| **V-013** | `grep -rn "framer-motion" src package.json` | No matches. | D1 |

## Budget gates

| ID | Procedure | Passes when | Covers |
|---|---|---|---|
| **V-014** | `npm run build`, read the reported gzip size of the entry chunk. | **≤ 120 KB gzipped.** Baseline before this work: 519.3 KB. | Constitution budget |
| **V-015** | Build, then confirm `three` and `@react-three/*` resolve into a separate chunk absent from the entry's static imports. | WebGL group (358.1 KB gzipped, measured) is not in the initial payload. | FR-033, SC-009 |

## Statistics pipeline

| ID | Procedure | Passes when | Covers |
|---|---|---|---|
| **V-016** | `unset WAKATIME_API_KEY && npm run build` | Build succeeds; warns; committed figures published; `dist` contains no zeroed statistics. | FR-031, SC-012 |
| **V-017** | `WAKATIME_API_KEY=invalid npm run build` | Build succeeds; warns naming rotation; `src/content/wakatime.generated.json` is byte-identical to before. | FR-031 |
| **V-018** | With a valid key, build and diff the artifact. | `capturedAt` and `range` updated; `isFallback: false`. | FR-026 |

---

## Manual browser procedures

Required, not optional. A jsdom test proves a token was applied; it never proves a pixel was
painted. Run these in a real browser at **375px** and **1440px**, in **both themes** and
**both locales**.

### First impression — US1

| ID | Procedure | Expected |
|---|---|---|
| **V-019** | Open the home page cold on a throttled mobile profile. | Name, role, experience duration and tagline readable without scrolling or horizontal panning. No horizontal page scroll at 375px. |
| **V-020** | View source on the home page and on `/work/telasparana/`. | Prose is present in the HTML payload, not injected only by script. | 
| **V-021** | Disable JavaScript entirely and reload both. | All nine projects, their problems, stacks, states and limitations remain readable; a contact route is reachable. |
| **V-022** | Visit `/work/<id>/` directly for all nine ids. | Each loads its own page with its own title and description. No 404, no redirect to home. |

### Terminal — US2

| ID | Procedure | Expected |
|---|---|---|
| **V-023** | Reach the prompt using **Tab only**, then run `help`. | Focus visible at every stop. Every registered command listed. |
| **V-024** | Run each documented command from the contract. | Output matches the contract; text is selectable and copyable by mouse. |
| **V-025** | Type `porjects`, then `projects nonesuch`. | Unknown-command error with `did you mean 'projects'?`; unknown-project error with the nearest id. |
| **V-026** | Press ArrowUp/ArrowDown; type `pro` then Tab. | History recalls in reverse; Tab completes to `projects`. |
| **V-027** | Run `projects telasparana`, then open `/work/telasparana/`. | Same facts, no contradiction between the two renderings. | 
| **V-028** | With a screen reader, run any command. | Output announced without focus being stolen from the input. |
| **V-029** | Load the page and look at the prompt without typing. | A visible hint states what to type first. |
| **V-030** | Paste a multi-line string; submit an empty line; submit 600 characters. | Handled per the error contract; no crash, no layout break. |
| **V-031** | Run a command whose output exceeds the viewport, at 375px. | Output scrolls within the terminal; the page itself does not scroll horizontally. |

### Language — US3

| ID | Procedure | Expected |
|---|---|---|
| **V-032** | Switch to Portuguese and traverse every section and command. | No English prose anywhere, terminal errors included. No page reload; scroll position kept. |
| **V-033** | Reload after switching. | Portuguese still active. |
| **V-034** | Inspect `<html lang>` in each locale. | Matches the language actually rendered. |
| **V-035** | Run `lang pt`, then use the page's own language control. | Identical result from both routes. |

### Theme — US4

| ID | Procedure | Expected |
|---|---|---|
| **V-036** | Cold-load with the OS set to light, then to dark, recording the first painted frame. | Correct theme on frame one. **Zero frames of the opposite theme.** |
| **V-037** | Override the theme, then reload. | Override persists. |
| **V-038** | Run `theme light`, then use the page's theme control. | Identical result from both routes. |
| **V-039** | Read every surface in light mode, including the terminal and error output. | Nothing illegible; error and accent tones remain distinguishable. |

### Statistics — US5

| ID | Procedure | Expected |
|---|---|---|
| **V-040** | Read every published figure. | Each states its source and period adjacent to it. |
| **V-041** | Read experience duration and tracked coding time together. | Their different start dates are unambiguous; neither reads as corroborating the other. |
| **V-042** | View a build produced from the fallback path (V-016). | Figures are stated as being from the last successful capture. |

### Immersive presentation — US6

| ID | Procedure | Expected |
|---|---|---|
| **V-043** | Load cold, never opt in, and inspect network transfers. | No WebGL asset requested. |
| **V-044** | Opt in; run the same commands as V-024. | Identical output text, still selectable and readable by assistive technology. |
| **V-045** | Opt out again. | Session command history intact. |
| **V-046** | Opt in with WebGL disabled in the browser. | Plain message; visitor stays on the working presentation; nothing breaks. |

### Motion and reduced motion

| ID | Procedure | Expected |
|---|---|---|
| **V-047** | Enable "reduce motion" at OS level and reload. | No animation runs; all final states applied; everything readable and operable. |
| **V-048** | Scroll the full page on a mid-range phone, both presentations. | No dropped frames, no jank. |

---

## Definition of done for this feature

- V-001 … V-018 green in CI.
- V-019 … V-048 executed in a real browser and recorded, with screenshots attached to the pull
  request for every visual change.
- The entry chunk is ≤ 120 KB gzipped (V-014), against the measured 519.3 KB baseline.
- No placeholder content remains anywhere on the published site (SC-015).
