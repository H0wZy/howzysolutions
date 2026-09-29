# Implementation Plan: vvv Showcase Page

**Branch**: `004-vvv-showcase` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

## Summary

A prerendered, never-hydrated page at `/vvv/` and `/pt/vvv/` that summarises a private project:
hero, terminal transcript, six stages, the measurement rule, the two lanes, sourced numbers, and
a native FAQ. Copy lives in one typed content module read only by the server entry, so the page
costs the client bundle nothing. Artwork slots are optional and blend into the ground the way
hermes-agent's art blends into its blue.

## Technical Context

**Language/Version**: TypeScript 6, React 19 (server render only for this page)
**Primary Dependencies**: none added
**Storage**: static files; artwork under `public/vvv/`
**Testing**: Vitest (route membership, punctuation, trail)
**Target Platform**: Cloudflare Workers static assets
**Performance Goals**: +0 KB JavaScript (2.36 KiB headroom measured 2026-09-27); CLS ≤ 0.05
**Constraints**: constitution 2.1.1; the page must read completely with scripting disabled

## Constitution Check

| Principle | How this plan meets it |
|---|---|
| I. Content is data | Page copy in `src/content/showcase-vvv.ts`; project facts (period, commits, metrics, stack) read from the vvv project record, never restated. The mcp special case in `ProjectDetail` becomes a `showcase` field on `Project`. |
| II. Minimum code | No dependency, no generic showcase framework: one route, one page, one record. The FAQ is `<details>`, the rail is the existing `SectionRail`, the numbers reuse `.metrics`. |
| III. Accessible | Real headings in order, anchors on every section, alt text in both locales, no text over images, focus styles inherited. Motion: none added. |
| IV. Renderer-agnostic core | Untouched. |
| V. Bilingual parity | Every string is `Localized`; a missing locale is a type error. `lang` follows the URL as on every page. |
| VI. Dark only, tokens | New type size is a token (`--fs-display`); no colour literal; the blend mode needs none. |
| VII. Verified | `npm run build`, `npm test`, `npm run lint`; both locales inspected at 360px and 1440px. |
| Budget: JS | The page is a static document (same mechanism as the legal pages); the gate proves the total does not move. The ceiling was 120 KB then and is 125 KB since 2026-09-29 (constitution 2.2.0). |
| Privacy | No new third-party request. Artwork is self-hosted. |

## Design decisions

- **D1. Static document.** A hydrated page shaped like `/mcp/` costs about 4.6 KiB gzipped against
  2.36 KiB of headroom. The legal pages already prove the pattern: rendered by
  `src/entry-server.tsx`, skipped by `isStaticDocument` in `src/main.tsx`, absent from `App.tsx`.
  The page has no interaction that needs React: the FAQ is native.
- **D2. `/vvv/`, not a rewrite of `/works/vvv/`.** Mirrors `/mcp/` and `/works/mcp/`: the record stays
  the long, neutral document; the showcase is the short, designed one. One link each way.
- **D3. What is taken from hermes-agent, and what is not.** Taken: grayscale art coloured by
  `mix-blend-mode: lighten` (read from the live page: the hero `<figure>` carries it over a
  `rgb(0, 0, 242)` section); the hero as a big light-weight uppercase title beside the art; numbered
  feature labels (`#1 CONNECT`), which this site already speaks as `##` comments; an install
  terminal, which becomes a transcript because there is nothing to install; a FAQ. Not taken: the
  blue, the condensed display face (constitution: one self-hosted family), the off-white section,
  parallax (motion for its own sake).
- **D4. Title weight.** JetBrains Mono is variable 100 to 800. A 250 weight, uppercase, at a new
  `--fs-display` step, is the closest this family gets to hermes-agent's thin condensed title
  without adding a font.
- **D5. Artwork files.** Under `public/vvv/`, so they are served at `/vvv/<file>.webp` beside the
  page and outside the `/assets/*` immutable cache rule (an unhashed file there keeps a stale copy
  for a year). Declared in the record with width and height, so the box is reserved before the
  bytes arrive. The hero may load eagerly; every other slot is `loading="lazy"`.
- **D6. Project facts are read, not copied.** The page takes name, period, commits and metrics from
  `src/content/projects/vvv.ts`. That record was stale (38 commits, 14 specs, "never publishes");
  it is refreshed from the vvv repository in the same change (FR-010).

## Data model

```ts
type ShowcaseArt = { src: string; width: number; height: number; alt: Localized }

type Showcase = {
  projectId: string                  // joins to the project record: facts come from there
  route: Route                       // where the page is served
  meta: { title: Localized; description: Localized }
  hero: { kicker: Localized; title: Localized<string[]>; summary: Localized; art?: ShowcaseArt }
  sections: { id; label: Localized }[]   // rail + "##" labels, in page order
  transcript: { command: string; note: Localized }[]
  stages: { verb: Localized; heading: Localized; body: Localized }[]
  rule: { heading: Localized; body: Localized; points: Localized<string[]>; art?: ShowcaseArt }
  lanes: { heading: Localized; items: { name: Localized; body: Localized }[]; art?: ShowcaseArt }
  faq: { question: Localized; answer: Localized }[]
}

// Project gains one optional field:
showcase?: { route: Route; blurb: Localized }
```

## Files

```text
src/content/showcase-vvv.ts          new: the record
src/pages/Showcase.tsx               new: renders a Showcase (server only)
src/content/types.ts                 Showcase, ShowcaseArt, Project.showcase
src/content/projects/vvv.ts          refreshed facts + showcase link
src/content/projects/mcp.ts          showcase link (replaces the id check)
src/components/ProjectDetail.tsx     showcase block driven by data
src/content/i18n/{en,pt}.ts          two keys for that block's title and button
src/route.ts                         { page: 'vvv' }, /vvv/, static
src/navigation.ts                    trail for vvv
src/entry-server.tsx                 route list, metadata, render dispatch via isStaticDocument
src/styles/tokens.css                --fs-display
src/styles/components.css            showcase block
src/__tests__/static-documents.test.ts   vvv is static and not in App
src/__tests__/navigation.test.ts     vvv trail
src/content/__tests__/punctuation.test.ts   walks the showcase record
```

## Complexity Tracking

None. No principle is bent.
