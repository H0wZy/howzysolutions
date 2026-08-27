# howzysolutions

Personal portfolio of Marcos "H0wZy" Junior, shipping to `howzysolutions.dev`.

**`.specify/memory/constitution.md` is the authority.** Where this file and the
constitution disagree, the constitution wins and this file is the one that gets
corrected. Read it before starting a feature.

> This file previously held a pasted UI brief asking for a light-mode toggle,
> hardcoded hex colours, Tailwind from a CDN, Google Fonts, and glassmorphism.
> Every one of those is forbidden by the constitution — Principles II and VI and
> the Typography and Design-direction constraints. It was replaced rather than
> reconciled, under the Governance clause that says a conflicting guidance file
> MUST be corrected.

## What this is

A static site, prerendered to 26 real documents and hydrated on the client.
There is no client-side router: every route is a file, and navigation is a link.

- **Stack**: React 19, TypeScript, Vite 8, Vitest 3. Tailwind 4 over the tokens
  in `src/styles/tokens.css`. shadcn supplies component markup; its variables
  resolve to those tokens and never declare colours of their own.
- **Locales**: English canonical and unprefixed, Brazilian Portuguese under
  `/pt/`. Every visitor-facing string lives in `src/content/i18n/{en,pt}.ts`,
  and a missing translation is a TypeScript error.
- **Theme**: dark, and only dark. An attempt to leave it is met with an
  in-voice refusal, not a half-built second palette.

## The rules that bite

These are the ones a change is most likely to break without noticing.

- **Content is data.** Every project, role, skill and biography fact lives in a
  typed module under `src/content/`. A fact hardcoded into JSX is a defect.
- **No colour literal outside `tokens.css`.** `npm test` runs
  `scripts/check-contrast.mjs`, which verifies 26 token pairs against their WCAG
  floor and follows the shadcn variable mapping.
- **The JavaScript budget is a gate.** `scripts/check-bundle.mjs` fails the
  build above 120 KB gzipped. Last measured 110.15 KB, so there is under 10 KB
  of headroom: check before adding a dependency, not after.
- **Nothing under `App` may call `new Date()` during render.** The site
  hydrates, so a value derived from the clock disagrees between prerender and
  the browser. Build-time values come from `src/content/build.generated.json`.
  A test enforces this across `src/pages` and `src/components`.
- **The terminal engine imports no React, no renderer and no DOM.**
  `src/terminal/__tests__/purity.test.ts` fails if that changes.
- **No em dash, en dash, ` - ` or ` -- ` in visitor-facing prose.**
  `punctuation.test.ts` walks the dictionaries, the project records and the CV
  record.
- **Fonts are self-hosted.** No third-party font CDN, no analytics, no pixels.

## Generated artifacts

Committed, and consumed as ordinary content. A failed capture degrades to the
last known good copy; it never empties a page.

| Artifact | Written by | Source |
|---|---|---|
| `wakatime.generated.json` | `scripts/fetch-wakatime.mjs` | WakaTime, build-time credential |
| `github.generated.json` | `scripts/fetch-github.mjs` | GitHub |
| `cv.generated.json` | `scripts/extract-cv.mjs` | `H0wZy/curriculum-vitae`, `overleaf/main.tex` |
| `build.generated.json` | `scripts/stamp-build.mjs` | the build date |

The CV extraction is the one with teeth: **absence degrades, corruption fails.**
No CV checkout means keep the committed artifact and exit 0 — which is the
ordinary case, since the Vercel builder has no checkout. A source that is
present but will not parse names the construct and its line and stops the build.

```bash
npm run cv:extract
```

## Working here

```bash
npm run build
```

```bash
npm test
```

```bash
npm run lint
```

All three must pass before a merge. Non-trivial work starts as a spec-kit
feature under `specs/`; commits follow Conventional Commits.
