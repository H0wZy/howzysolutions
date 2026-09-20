# Implementation Plan: Howzy Solutions Brand and Portfolio Experience

**Branch**: `002-branding-portfolio-experience` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-branding-portfolio-experience/spec.md`

## Summary

Turn the supplied branding explorations into one production identity and apply it to the complete portfolio experience. The implementation will keep the text `h0wzy` cursor signature as the primary wordmark, derive a compact mark and social assets from the approved square artwork, use the graphite portrait as a supporting home-hero element, make turquoise the software and interaction accent, compact the existing terminal without changing its engine, merge location and top-level links into the header, extend the existing section rail to every meaningful long document, and reuse `Project.kind` for localized category badges.

The implementation adds no runtime dependency. Semantic links, native `<details>`, CSS media queries, the existing `IntersectionObserver` enhancement, and small local shadcn-shaped primitives cover the requested Navigation Menu, Badge, and Skeleton patterns within the 120 KB gzipped JavaScript ceiling.

## Technical Context

**Language/Version**: TypeScript 6.0, React 19.2, JavaScript ES modules, CSS/Tailwind 4.3

**Primary Dependencies**: React, React DOM, Vite 8.1, Tailwind 4.3, existing `clsx` and `tailwind-merge`; no new runtime dependency

**Storage**: Typed source modules and committed JSON/image artifacts; no database or client persistence beyond the existing locale preference

**Testing**: Vitest 3.2, TypeScript build, ESLint, `scripts/check-contrast.mjs`, `scripts/check-bundle.mjs`, browser inspection and Lighthouse

**Target Platform**: Prerendered static documents served by Cloudflare Workers assets, hydrated in current evergreen desktop and mobile browsers

**Project Type**: Single static web application with 26 emitted documents across English and Brazilian Portuguese

**Performance Goals**: Initial JavaScript at or below 120 KB gzipped; LCP at or below 1.8 s; CLS at or below 0.05; Lighthouse mobile at least 95 Performance and 100 Accessibility; 60 fps scrolling on a mid-range phone

**Constraints**: Dark-only; all colors through `src/styles/tokens.css`; complete no-JavaScript documents and ordinary links; self-hosted fonts; typed bilingual copy; pure terminal engine; no third-party tracking; approved production images only; headings remain visible below sticky chrome

**Scale/Scope**: One home page, work listing and detail documents, CV, privacy policy, their Portuguese counterparts, 25 exploratory square PNGs to curate, and the existing terminal/navigation/content pipeline

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

### Before research

- **I. Content Is Data**: PASS. New visitor copy goes into both locale dictionaries. Project classification reuses the existing typed `Project.kind` field and `PROJECT_KIND` labels.
- **II. Minimum Code That Works**: PASS. The design reuses `Chrome`, `Breadcrumb`, `SectionRail`, `Project.kind`, `pathFor`, the existing enhancement layer, native links/disclosures, and CSS. No package is added.
- **III. Accessible By Construction**: PASS. Navigation remains semantic links, the compact rail remains a native disclosure, the terminal keeps its real input and live region, image meaning remains available as text, and reduced motion is part of every motion contract.
- **IV. Renderer-Agnostic Core**: PASS. `src/terminal/` is unchanged. Cursor sizing and presentation stay in `src/enhance/terminal/mount.ts` and CSS.
- **V. Bilingual Parity**: PASS. All new visible strings and metadata alternatives are typed in English and Portuguese.
- **VI. Dark Only, By Design**: PASS. Palette changes are confined to `tokens.css`; component styles use variables only.
- **VII. Verified Before Merge**: PASS. The quickstart requires test, lint, build, bundle, contrast, no-JavaScript, responsive, keyboard, screen-reader, reduced-motion, and Lighthouse checks.
- **Static delivery and privacy constraints**: PASS. The plan retains prerendering/hydration, makes no browser API request, adds no tracker, and references only local media.

### After design

PASS with no exceptions. The contracts introduce no external service, no client router, no second palette, no duplicated project category, and no loading state over content already present in the prerendered document. Production media is bounded by explicit dimensions and byte budgets. Complexity Tracking is therefore empty.

## Project Structure

### Documentation (this feature)

```text
specs/002-branding-portfolio-experience/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── brand-assets.md
│   ├── navigation.md
│   └── visual-behavior.md
└── tasks.md                 # produced later by /speckit-tasks
```

### Source Code (repository root)

```text
public/
├── brand/                   # compact mark, avatar and social-card derivatives
├── favicon-32.png
└── apple-touch-icon.png

scripts/
└── prerender.mjs            # route metadata plus social preview tags

src/
├── assets/branding/         # supplied sources plus the imported portrait derivative
├── components/
│   ├── Chrome.tsx
│   ├── ProjectDetail.tsx
│   ├── ProjectList.tsx
│   ├── SectionRail.tsx
│   ├── StatsPanel.tsx
│   ├── Terminal.tsx
│   └── ui/                  # minimal NavigationMenu, Badge and Skeleton markup
├── content/
│   ├── i18n/{en,pt}.ts
│   └── types.ts             # existing Project.kind remains the category source
├── enhance/
│   ├── section-rail.ts
│   └── terminal/mount.ts
├── pages/
│   ├── Home.tsx
│   ├── WorkIndex.tsx
│   ├── Work.tsx
│   ├── Cv.tsx
│   └── Privacy.tsx
├── styles/
│   ├── tokens.css
│   ├── base.css
│   └── components.css
├── __tests__/
└── navigation.ts
```

**Structure Decision**: Keep the existing single Vite application and its prerender pipeline. Production derivatives receive stable names, but exploratory PNGs remain unreferenced source material and therefore do not enter the emitted site. Existing components are extended in place; local UI primitives contain only the semantic subset actually used.

## Implementation Strategy

### 1. Curate identity assets

1. Approve `Imagem do Codex 19 de set. de 2026, 16_29_11.png` as the graphite editorial portrait and `Imagem do Codex 19 de set. de 2026, 16_49_23.png` as the compact mark source.
2. Produce the stable derivatives in [contracts/brand-assets.md](./contracts/brand-assets.md), preserving a circular safe area and stripping unnecessary metadata.
3. Keep `h0wzy` plus its turquoise block cursor as live text for the primary wordmark. Do not rasterize the main signature.
4. Reference only approved derivatives from source and metadata; leave the rest of the exploratory set unimported.

### 2. Establish the shared visual foundation

1. Make the existing cool accent the primary software/link/focus color and retain the warm accent only for a separate, documented supporting meaning.
2. Add only the local `NavigationMenu`, `Badge`, and `Skeleton` elements required by current markup. They wrap semantic HTML and add no behavior package.
3. Add bilingual navigation and social-image alternative text where needed; replace the fixed-count work and activity headings.
4. Remove remaining fixed project-count language from the HTML shell and route metadata.

### 3. Build the identity-led hero and metadata

1. Recompose `Home` as a two-column editorial hero on wide screens and a single readable flow on narrow screens.
2. Keep the name, role, location, experience context, activity period, and terminal route as text. Render the portrait with fixed dimensions and an empty alternative because adjacent text already supplies the identity.
3. Place a restrained Skeleton backing layer only behind the genuinely network-pending hero image. The opaque final derivative covers it when loaded, so hydration never swaps complete text for a placeholder.
4. Add favicon, touch icon, Open Graph, and Twitter card metadata through the existing shell/prerender path.

### 4. Unify global and document navigation

1. Replace the static `~/... README.md` chrome label with one primary navigation area that contains the route trail and remaining top-level destinations.
2. Preserve pure route derivation in `navigation.ts`; mark the current page in markup instead of linking it to itself.
3. Lower `SectionRail`'s eligibility from an arbitrary four-entry threshold to two meaningful anchors.
4. Derive home, CV, privacy, and project-detail rail entries from the same ordered data or block descriptors that render their sections. Work listing pages keep no redundant one-entry rail.
5. Keep the existing observer as optional enhancement and use `aria-current="location"`; without JavaScript every item remains an ordinary fragment link.
6. Use CSS scroll behavior and reduced-motion overrides, plus heading scroll margins and target indication, instead of scripted scrolling.

### 5. Refine terminal, projects, and activity

1. Reduce terminal minimum height, padding, line spacing, border emphasis, and prompt verbosity while retaining the single scroll region.
2. Add one decorative cursor span after the real input. The mount layer synchronizes the input `size` after input, history, completion, and submit changes; CSS supplies a 1.1 second step blink and makes it static under reduced motion. The native input, selection, IME, history, completion, and live output remain intact.
3. Render the existing localized `Project.kind` as a category Badge beside the state Badge in list and detail views. Use `pathFor` for project links so Portuguese routes remain Portuguese.
4. Change activity rows to a small CSS Grid whose label, percentage, duration, and bar have stable cells and stack predictably at narrow widths.

### 6. Verify the whole refresh

1. Extend pure tests for route navigation, rail derivation, localized copy, project category coverage, and metadata.
2. Run all repository gates and record bundle/contrast measurements.
3. Inspect every route in both locales with JavaScript enabled and disabled, at 320, 768, 1000, 1440, and 2560 pixels.
4. Verify the 32 px mark, circular avatar crop, keyboard navigation, focus order, terminal behavior, reduced motion, delayed hero image, fragment landing, Lighthouse, LCP, and CLS.

## Complexity Tracking

No constitution violations require justification.
