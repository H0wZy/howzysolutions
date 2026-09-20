# Tasks: Howzy Solutions Brand and Portfolio Experience

**Input**: Design documents from `/specs/002-branding-portfolio-experience/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Automated tasks cover pure navigation, content, metadata, and SSR boundaries. Visual layout, asset recognition, motion, loading, and accessibility are verified in rendered browsers as required by the constitution.

**Organization**: Tasks are grouped by user story so each increment can be implemented and checked independently. The existing repository, package installation, test runner, and build pipeline are reused.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel after its phase prerequisites because it changes different files.
- **[Story]**: Maps the task to a user story from `spec.md`.
- Every task names the exact file or validation document it affects.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing project is the implementation base.

No setup change is required. React, Vite, Tailwind, Vitest, prerendering, contrast checking, bundle checking, and the feature documents already exist. Dependency installation or new scaffolding would be redundant.

**Checkpoint**: Existing toolchain and feature artifacts are ready.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared palette and the three requested local UI primitives before story work.

- [X] T001 [P] Reassign turquoise to the primary software/link/focus semantics and document the retained warm accent meaning in `src/styles/tokens.css`
- [X] T002 [P] Add the semantic direct-link Navigation Menu subset in `src/components/ui/navigation-menu.tsx`
- [X] T003 [P] Add the shared text-first Badge primitive for state and category labels in `src/components/ui/badge.tsx`
- [X] T004 [P] Add the inert geometry-preserving Skeleton primitive in `src/components/ui/skeleton.tsx`

**Checkpoint**: Shared tokens and primitives exist with no new runtime dependency.

---

## Phase 3: User Story 1 - Recognizable Howzy Solutions Identity (Priority: P1) 🎯 MVP

**Goal**: Ship one coherent identity across the wordmark, compact mark, header, browser icon, avatar, and social preview.

**Independent Test**: Compare the home page, an inner page, favicon, 180 px circular avatar, and social card. Every placement maps to [contracts/brand-assets.md](./contracts/brand-assets.md), the compact mark remains recognizable at 32 px, and essential identity remains text.

### Tests for User Story 1

- [X] T005 [P] [US1] Add failing route-metadata tests for local social images and localized image alternatives in `src/__tests__/metadata.test.ts`

### Implementation for User Story 1

- [X] T006 [P] [US1] Derive `src/assets/branding/h0wzy-portrait.webp`, `public/brand/h0wzy-mark-512.png`, `public/favicon-32.png`, `public/apple-touch-icon.png`, `public/brand/h0wzy-avatar.png`, and `public/brand/h0wzy-social-card.png` from the two approved source PNGs using the dimensions and byte ceilings in `specs/002-branding-portfolio-experience/contracts/brand-assets.md`
- [X] T007 [US1] Add localized social-image alternative text and any identity support copy to `src/content/i18n/en.ts` and `src/content/i18n/pt.ts`
- [X] T008 [US1] Extend route metadata and prerender injection for Open Graph and Twitter cards in `src/entry-server.tsx`, `scripts/prerender.mjs`, and `index.html`
- [X] T009 [US1] Replace the old favicon reference and add the compact brand mark beside the live-text identity in `index.html` and `src/components/Chrome.tsx`
- [X] T010 [US1] Verify every production placement, the 32 px compact mark, the 180 px circular crop, stable filenames, and byte ceilings against `specs/002-branding-portfolio-experience/contracts/brand-assets.md`

**Checkpoint**: Identity is recognizable and consistent without depending on the later hero, terminal, or navigation refinements.

---

## Phase 4: User Story 2 - Personal Hero Without Losing the Terminal Character (Priority: P1)

**Goal**: Integrate the graphite portrait as a supporting editorial element while preserving the live h0wzy signature, factual introduction, and path into the work.

**Independent Test**: Open the home page at 320 and 1440 px, then block the portrait request. The hero remains readable, contains all identity facts as text, keeps the terminal entry visible, and has no horizontal overflow or layout jump.

### Implementation for User Story 2

- [X] T011 [US2] Recompose the home header with the live wordmark, fixed-size portrait, adjacent identity text, and Skeleton backing layer in `src/pages/Home.tsx`
- [X] T012 [US2] Add the mobile-first editorial hero layout, portrait crop, fixed geometry, and restrained placeholder treatment in `src/styles/components.css`
- [X] T013 [US2] Validate loaded, throttled, blocked-image, mobile, and desktop hero states using `specs/002-branding-portfolio-experience/quickstart.md`

**Checkpoint**: The home page connects the person and the software identity while remaining complete without the image.

---

## Phase 5: User Story 3 - Condensed Riced Terminal (Priority: P1)

**Goal**: Make the terminal compact and deliberate, with a controllable turquoise block cursor, while preserving all terminal behavior and accessibility.

**Independent Test**: At 320 through 2560 px, run commands, recall history, complete with Tab, select output, and inspect focus. The cursor cycles in 1.0 to 1.2 seconds and output never causes document overflow.

### Implementation for User Story 3

- [X] T014 [US3] Add the decorative cursor sibling and initial one-character input size without changing terminal semantics in `src/components/Terminal.tsx`
- [X] T015 [P] [US3] Synchronize input size after typing, submit, history recall, and completion in `src/enhance/terminal/mount.ts`
- [X] T016 [P] [US3] Compact terminal height, padding, border, prompt spacing, focus feedback, input sizing, and the 1.1 second block-cursor animation in `src/styles/components.css`
- [X] T017 [US3] Run terminal engine, parity, route, CV command, and purity checks from `src/terminal/__tests__/` and complete the browser terminal checks in `specs/002-branding-portfolio-experience/quickstart.md`

**Checkpoint**: The riced terminal is independently usable and `src/terminal/` remains renderer-agnostic.

---

## Phase 6: User Story 4 - Clear Global and In-Page Navigation (Priority: P1)

**Goal**: Combine route context and destinations in the sticky header and expose a source-derived outline on every meaningful long document.

**Independent Test**: Navigate every route and fragment by keyboard with and without JavaScript at 320, 999, 1000, and 1440 px. Every target exists, remains visible below sticky chrome, and reflects the current page or section correctly.

### Tests for User Story 4

- [X] T018 [US4] Add failing tests for current-page semantics, complete localized top-level reachability, rail ordering, optional project sections, and real fragment ids in `src/__tests__/navigation.test.ts`

### Implementation for User Story 4

- [X] T019 [US4] Extend pure route-derived navigation and topic-anchor helpers without DOM scraping in `src/navigation.ts`
- [X] T020 [US4] Replace the static file label and separate breadcrumb strip with one composed primary navigation in `src/components/Chrome.tsx` and `src/components/Breadcrumb.tsx`
- [X] T021 [US4] Allow rails with two meaningful entries and emit correct location semantics in `src/components/SectionRail.tsx`
- [X] T022 [US4] Set at most one `aria-current="location"` marker while preserving no-JavaScript links in `src/enhance/section-rail.ts`
- [X] T023 [P] [US4] Add the source-ordered home outline around the existing home sections in `src/pages/Home.tsx`
- [X] T024 [P] [US4] Derive the complete privacy outline from policy and project records in `src/pages/Privacy.tsx`
- [X] T025 [P] [US4] Drive project-detail blocks and their outline from one ordered descriptor list in `src/components/ProjectDetail.tsx` and place the rail in `src/pages/Work.tsx`
- [X] T026 [US4] Generalize the document rail layout, header wrapping, anchor scroll margin, target cue, wide sidebar, and narrow disclosure styles in `src/styles/components.css` and `src/styles/base.css`

**Checkpoint**: Global and in-page navigation are complete, localized, semantic, and functional without enhancement.

---

## Phase 7: User Story 5 - Readable Projects and Activity (Priority: P2)

**Goal**: Use direct headings, show one existing project kind beside delivery state, and keep every activity value visibly associated with its bar.

**Independent Test**: In both locales from 320 to 2560 px, verify the requested headings, exactly one category plus one state per project, locale-preserving project links, and activity rows without overlap or ambiguity.

### Tests for User Story 5

- [X] T027 [US5] Add failing assertions for requested headings, zero fixed-count copy, complete `Project.kind` mappings, and exactly one category per project in `src/content/__tests__/schema.test.ts` and `src/content/__tests__/punctuation.test.ts`

### Implementation for User Story 5

- [X] T028 [US5] Set `My projects`, `Meus projetos`, `My activity`, and `Minha atividade` and remove fixed-count wording in `src/content/i18n/en.ts` and `src/content/i18n/pt.ts`
- [X] T029 [P] [US5] Render the localized `Project.kind` Badge beside the state Badge and route links through `pathFor` in `src/components/ProjectList.tsx`
- [X] T030 [P] [US5] Render the same category and state Badge pair in project headers in `src/components/ProjectDetail.tsx`
- [X] T031 [P] [US5] Replace wrapping activity rows with stable responsive grid areas in `src/styles/components.css`
- [X] T032 [US5] Inspect project and activity surfaces in both locales at all required widths using `specs/002-branding-portfolio-experience/quickstart.md`

**Checkpoint**: Projects and activity are scannable, localized, and stable at every supported width.

---

## Phase 8: User Story 6 - Calm Loading and Motion States (Priority: P3)

**Goal**: Limit placeholders to genuine transfer states and make every new and existing motion honor the visitor's reduced-motion preference.

**Independent Test**: Throttle the portrait request, reload normal prerendered pages, and enable reduced motion. Only the portrait frame exposes a pending placeholder, hydration never hides complete content, and all motion becomes static or immediate while focus remains visible.

### Implementation for User Story 6

- [X] T033 [US6] Restrict Skeleton usage to the genuinely pending hero portrait while keeping all prerendered text present in `src/pages/Home.tsx` and `src/components/ui/skeleton.tsx`
- [X] T034 [US6] Complete reduced-motion overrides for the new cursor, anchor movement, target feedback, hero media, and transitions in `src/styles/base.css` and `src/styles/components.css`
- [X] T035 [US6] Verify the portrait pending/error states, ordinary hydration, visible focus, and CLS ceiling using `specs/002-branding-portfolio-experience/contracts/visual-behavior.md`
- [X] T036 [US6] Disable JavaScript and verify complete content, route links, fragment links, disclosures, and terminal introduction on every representative route using `specs/002-branding-portfolio-experience/quickstart.md`

**Checkpoint**: Loading and motion communicate real state without hiding content or excluding reduced-motion users.

---

## Phase 9: Polish & Cross-Cutting Verification

**Purpose**: Prove the integrated refresh meets every repository and release gate.

- [X] T037 Run `npm test`, `npm run lint`, and `npm run build`, then resolve any failures against `specs/002-branding-portfolio-experience/quickstart.md`
- [X] T038 Verify production asset byte ceilings, contrast pairs, 26 emitted documents, and the 120 KB gzipped JavaScript ceiling against `specs/002-branding-portfolio-experience/contracts/brand-assets.md` and `scripts/check-bundle.mjs`
- [X] T039 Inspect all supported routes in English and Portuguese at 320, 768, 999, 1000, 1440, and 2560 px and capture the required PR screenshots described by `specs/002-branding-portfolio-experience/quickstart.md`
- [X] T040 Run Lighthouse mobile and keyboard/screen-reader passes, confirming Performance at least 95, Accessibility 100, LCP at most 1.8 s, CLS at most 0.05, and 60 fps scrolling against `specs/002-branding-portfolio-experience/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Complete already; no repository initialization is needed.
- **Foundational (Phase 2)**: Starts immediately and blocks all stories.
- **US1 Identity (Phase 3)**: Starts after Foundation and produces assets used by US2 and global identity used by US4.
- **US2 Hero (Phase 4)**: Depends on US1's portrait derivative and Foundation's Skeleton.
- **US3 Terminal (Phase 5)**: Depends only on Foundation and can run alongside US1 or US2.
- **US4 Navigation (Phase 6)**: Depends on US1 because it rewrites the header containing the compact mark.
- **US5 Projects and Activity (Phase 7)**: Depends on Foundation. Execute after US4 to avoid concurrent edits to `ProjectDetail.tsx` and shared styles.
- **US6 Loading and Motion (Phase 8)**: Depends on US2, US3, and US4 because it verifies and completes their motion/loading states.
- **Polish (Phase 9)**: Depends on every selected story.

### User Story Dependency Graph

```text
Foundation ─┬─> US1 Identity ─┬─> US2 Hero ─┐
            │                 └─> US4 Nav ──┼─> US6 Loading/Motion ─> Polish
            ├─> US3 Terminal ───────────────┘
            └─> US5 Projects/Activity ───────────────────────────────> Polish
```

US5 is behaviorally independent after Foundation; its recommended later position only avoids file conflicts with US4.

### Within Each Story

- Write the listed pure/metadata test first and confirm it fails for the missing behavior.
- Apply content and data changes before components that consume them.
- Apply markup before dependent styling.
- Complete the story's independent browser check before moving to its checkpoint.

### Parallel Opportunities

- Foundation tasks T001 through T004 touch separate files and can run together.
- US1 asset derivation T006 can run while metadata test T005 is written.
- After T014 defines the cursor markup, T015 and T016 can run together.
- After T021 and T022, home T023, privacy T024, and project-detail T025 can run together.
- After T028, project list T029, project detail T030, and activity layout T031 can run together.
- US3 can run alongside US1 and US2 after Foundation.

---

## Parallel Examples

### User Story 1

```text
Task T005: Add failing metadata tests in src/__tests__/metadata.test.ts
Task T006: Derive the approved production image files under src/assets/branding/ and public/brand/
```

### User Story 2

No safe parallel split: `src/pages/Home.tsx` defines the geometry and class contract consumed by `src/styles/components.css`.

### User Story 3

```text
After T014:
Task T015: Synchronize input sizing in src/enhance/terminal/mount.ts
Task T016: Implement compact terminal and cursor styles in src/styles/components.css
```

### User Story 4

```text
After T021 and T022:
Task T023: Add the home outline in src/pages/Home.tsx
Task T024: Add the privacy outline in src/pages/Privacy.tsx
Task T025: Add the project-detail outline in src/components/ProjectDetail.tsx and src/pages/Work.tsx
```

### User Story 5

```text
After T028:
Task T029: Add category Badge to src/components/ProjectList.tsx
Task T030: Add category Badge to src/components/ProjectDetail.tsx
Task T031: Reflow activity rows in src/styles/components.css
```

### User Story 6

No safe parallel split: T033 establishes the SSR boundary, T034 completes the shared motion rules, and T035/T036 validate the result.

---

## Implementation Strategy

### MVP First: User Story 1

1. Complete T001 through T004.
2. Complete T005 through T010.
3. Stop and validate the identity on home, inner pages, favicon, avatar, and social preview.
4. Continue with the remaining P1 stories before treating the coordinated refresh as release-ready.

### Incremental Delivery

1. Foundation: tokens and three local primitives.
2. US1: coherent identity and production assets.
3. US2: portrait-led editorial hero.
4. US3: compact terminal and working cursor.
5. US4: unified header and document outlines.
6. US5: direct headings, category badges, and activity grid.
7. US6: loading and reduced-motion closure.
8. Integrated release gates.

### Focused Commits

- Commit production identity assets and metadata together.
- Commit hero composition separately.
- Commit terminal renderer styling separately from the pure engine.
- Commit navigation derivation, header, and rails together.
- Commit project/activity readability together.
- Commit reduced-motion closure and final verification separately.

## Notes

- `[P]` means different files and no incomplete task dependency.
- No task introduces Base UI, Radix, an icon package, a router, an animation library, or a runtime asset registry.
- Exploratory image sources stay preserved but unreferenced; only stable production derivatives ship.
- `Project.kind` remains the sole category source.
- `src/terminal/` remains untouched.
- Check off a task only after its named file change or validation is complete.
