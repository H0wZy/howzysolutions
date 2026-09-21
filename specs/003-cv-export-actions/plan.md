# Implementation Plan: CV Copy Page, Markdown/PDF Exports & Header Relocation

**Branch**: `003-cv-export-actions` | **Date**: 2026-09-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-cv-export-actions/spec.md`

## Summary

Add one-click Markdown copy and an export dropdown (`View as Markdown`, `Download PDF (EN)`, `Download PDF (PT-BR)`) to `/cv/` and `/pt/cv/`. Generate static `/cv.md` and `/pt/cv.md` during build time, establish clean `/cv.pdf` and `/pt/cv.pdf` routes, relocate the capture provenance stamp into the CV header, and eliminate redundant footer downloads, while maintaining the strict 120.00 KB client bundle ceiling.

## Technical Context

**Language/Version**: TypeScript 5.8, Node.js 24
**Primary Dependencies**: React 19, Tailwind CSS 4, Vite 8, Vitest 3
**Storage**: Static files in `public/` and `dist/`, pre-rendered static HTML documents
**Testing**: Vitest 3 unit tests, `scripts/check-contrast.mjs`, `scripts/check-bundle.mjs`
**Target Platform**: Cloudflare Workers (Static Assets, no Worker script)
**Project Type**: Static web portfolio
**Performance Goals**: Sub-5ms TTFB on Cloudflare edge, 0ms compute latency, <200ms clipboard execution
**Constraints**: Client bundle <= 120.00 KB gzipped, dark-theme only, no `new Date()` in App render, no em/en dashes
**Scale/Scope**: 2 locales (EN/PT), 2 static Markdown files, 2 clean PDF routes, 1 CV page component update

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Content Is Data)**: PASS. All CV content is drawn from `src/content/cv.generated.json`.
- **Principle II (Minimum Code That Works)**: PASS. No third-party dropdown or icon packages; ultra-lightweight inline SVG and native DOM/state.
- **Principle III (Accessible By Construction)**: PASS. Uses semantic button elements, `aria-haspopup`, `aria-expanded`, keyboard handlers, and WCAG AA contrast tokens.
- **Principle IV (Renderer-Agnostic Core)**: PASS. Static markdown files generated at build time; site runs as assets-only Cloudflare Worker.
- **Principle V (Bilingual Parity)**: PASS. Full parity with `/cv.md`, `/pt/cv.md`, `/cv.pdf`, `/pt/cv.pdf`, and typed dictionaries in `en.ts`/`pt.ts`.
- **Principle VI (Dark Only, By Design)**: PASS. Resolves entirely against `tokens.css` dark tokens.
- **Principle VII (Verified Before Merge)**: PASS. Validated against bundle gate, contrast checker, and unit test suite.

## Project Structure

### Documentation (this feature)

```text
specs/003-cv-export-actions/
├── plan.md              # This implementation plan
├── research.md          # Technical decisions and trade-offs
├── data-model.md        # Document schemas and state models
├── quickstart.md        # Validation and run guide
├── contracts/
│   └── cv-export-endpoints.md # HTTP endpoint specifications
└── tasks.md             # Actionable task list
```

### Source Code (repository root)

```text
public/
├── cv.md                # Generated English Markdown artifact
├── pt/
│   └── cv.md            # Generated Portuguese Markdown artifact
└── _redirects           # Clean URL routing for /cv.pdf and /pt/cv.pdf

scripts/
├── generate-cv-markdown.mjs # Build-time static Markdown generator
└── extract-cv.mjs       # LaTeX CV extractor and PDF handler

src/
├── components/
│   └── cv/
│       └── CvHeaderActions.tsx # Accessible copy button & export dropdown
├── content/
│   └── i18n/
│       ├── en.ts        # English strings for copy button & export menu
│       └── pt.ts        # Portuguese strings for copy button & export menu
└── pages/
    └── Cv.tsx           # CV page with relocated provenance & actions
```

## Complexity Tracking

*No constitutional violations detected. Budget preserved within limits.*
