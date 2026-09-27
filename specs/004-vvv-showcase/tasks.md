# Tasks: vvv Showcase Page

**Input**: [spec.md](./spec.md), [plan.md](./plan.md)

## Phase 1: Plumbing (blocks everything)

- [x] T001 Add `{ page: 'vvv' }` to `src/route.ts`: parse `/vvv/`, path `/vvv/`, and include it in `isStaticDocument`.
- [x] T002 Add the vvv trail to `trailFor` in `src/navigation.ts`; add the route to the "every trail" list in `src/__tests__/navigation.test.ts`.
- [x] T003 Add `Showcase`, `ShowcaseArt` and `Project.showcase` to `src/content/types.ts`.
- [x] T004 In `src/entry-server.tsx`: emit the route, give it metadata from the record, and dispatch static rendering through `isStaticDocument` instead of repeating the page list.
- [x] T005 Extend `src/__tests__/static-documents.test.ts`: the showcase is static, rendered by the server entry, and not imported by `App.tsx`.

## Phase 2: US1 + US2, the page (P1)

- [x] T006 Refresh `src/content/projects/vvv.ts` from measured repository facts (commits, period, specs, schemas, lanes, publishing).
- [x] T007 Write `src/content/showcase-vvv.ts`: hero, transcript, stages, rule, lanes, FAQ, both locales, no private identifiers.
- [x] T008 Build `src/pages/Showcase.tsx`: rail, hero, transcript, stages, rule, lanes, numbers (from the project record), FAQ, footer.
- [x] T009 Add `--fs-display` to `src/styles/tokens.css` and the showcase block to `src/styles/components.css`.
- [x] T010 Walk the showcase record in `src/content/__tests__/punctuation.test.ts`.

## Phase 3: US4, links both ways (P2)

- [x] T011 Replace the `project.id === 'mcp'` block in `src/components/ProjectDetail.tsx` with one driven by `project.showcase`; give mcp and vvv the field; move the block's two fixed strings into the dictionaries.

## Phase 4: US3, artwork (P2)

- [x] T012 Artwork slots render nothing when absent; verify with and without a stand-in image (not committed).
- [x] T013 When the owner delivers the images: convert to WebP, place under `public/vvv/`, declare them in the record.

## Phase 5: Verification

- [x] T014 `npm run build`, `npm test`, `npm run lint`; confirm the JavaScript total did not grow.
- [x] T015 (2026-09-27: desktop 1440px both locales; 360px and 390px in a same-origin iframe, no horizontal overflow) Inspect `/vvv/`, `/pt/vvv/`, `/works/vvv/`, `/works/mcp/` at 360px and 1440px, with scripting disabled for `/vvv/`.
