# Tasks: CV Copy Page, Markdown/PDF Exports & Header Relocation

**Input**: Design documents from `/specs/003-cv-export-actions/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/cv-export-endpoints.md](./contracts/cv-export-endpoints.md), [quickstart.md](./quickstart.md)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm project setup and baseline.

- [X] T001 Verify project baseline and existing CV data in `src/content/cv.generated.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core generator scripts, redirects, and translations that block all user stories.

- [X] T002 [P] Create static Markdown generator `scripts/generate-cv-markdown.mjs` to emit `public/cv.md` and `public/pt/cv.md` from `src/content/cv.generated.json`
- [X] T003 Integrate `node scripts/generate-cv-markdown.mjs` into `package.json` build pipeline
- [X] T004 [P] Add clean URL routes for `/cv.pdf` and `/pt/cv.pdf` to `public/_redirects`
- [X] T005 [P] Add typed translation keys for copy button, feedback, and dropdown menu items in `src/content/i18n/en.ts` and `src/content/i18n/pt.ts`

**Checkpoint**: Static markdown generator and translation keys available.

---

## Phase 3: User Story 1 - One-Click Markdown Copy to Clipboard (Priority: P1) 🎯 MVP

**Goal**: Provide instant, accessible clipboard copy of the full CV Markdown with feedback.

**Independent Test**: Navigate to `/cv/` and `/pt/cv/`, click copy button, verify clipboard content matches full CV markdown with frontmatter, and button shows "Copied!"/"Copiado!".

- [X] T006 [US1] Create accessible, zero-dependency `src/components/cv/CvHeaderActions.tsx` with clipboard copy logic and state
- [X] T007 [US1] Integrate `CvHeaderActions` into the header area of `src/pages/Cv.tsx`

**Checkpoint**: User Story 1 functional and independently testable.

---

## Phase 4: User Story 2 - Direct Markdown Document Endpoints (Priority: P1)

**Goal**: Enable opening raw Markdown documents directly from the UI dropdown and via direct URL.

**Independent Test**: Click "View as Markdown" from the dropdown; verify `/cv.md` (or `/pt/cv.md`) opens in a new tab.

- [X] T008 [US2] Add "View as Markdown" option to `src/components/cv/CvHeaderActions.tsx` linking to `/cv.md` (or `/pt/cv.md`)

**Checkpoint**: Markdown view link works from header dropdown and HTTP endpoint.

---

## Phase 5: User Story 3 - Clean PDF View & Download Actions (Priority: P2)

**Goal**: Provide clean `/cv.pdf` and `/pt/cv.pdf` links in the header action dropdown.

**Independent Test**: Click "Download PDF (EN)" or "Download PDF (PT-BR)"; verify clean download from `/cv.pdf` and `/pt/cv.pdf`.

- [X] T009 [US3] Add "Download PDF (EN)" and "Download PDF (PT-BR)" options to `src/components/cv/CvHeaderActions.tsx`

**Checkpoint**: PDF download options functional in header dropdown.

---

## Phase 6: User Story 4 - Relocate Capture Information & Clean Page Footer (Priority: P2)

**Goal**: Display capture provenance in the header and eliminate redundant bottom controls.

**Independent Test**: Inspect `/cv/`; confirm provenance is in header and bottom downloads are absent.

- [X] T010 [US4] Relocate provenance stamp (`curriculum-vitae@commit • date`) into the top header block of `src/pages/Cv.tsx`
- [X] T011 [US4] Remove the bottom `CvDownloads` component and bottom provenance badge from `src/pages/Cv.tsx`

**Checkpoint**: Header unified, bottom redundancy eliminated.

---

## Phase 7: Polish & Verification

**Purpose**: Test coverage, accessibility, bundle size gate, and linting.

- [X] T012 [P] Create unit test in `src/__tests__/cv-markdown.test.ts` validating markdown generation structure and frontmatter
- [X] T013 Run `npm test` to verify Vitest tests, WCAG contrast, and `scripts/check-bundle.mjs` (< 120.00 KB gate)
- [X] T014 Run `npm run lint` and verify 0 errors
