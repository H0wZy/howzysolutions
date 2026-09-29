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

## Phase 4b: US6, featured strip on the home page (P2)

- [x] T016 Add `Project.featured` to `src/content/types.ts`; give mcp (moved out of `Home.tsx`) and vvv a card.
- [x] T017 Render the strip in `src/pages/Home.tsx`: a radio before each card, a pager of labels inside each card; styles in `src/styles/components.css`.
- [x] T018 Walk the featured fields in `src/content/__tests__/punctuation.test.ts`.
- [x] T019 Verify pointer, keyboard and PT at 390px (2026-09-27). Found, not caused: the home hero's `.sub.nowrap` line scrolls a 390px PT page sideways by 109px.

## Phase 5: Verification

- [x] T014 `npm run build`, `npm test`, `npm run lint`; confirm the JavaScript total did not grow.
- [x] T015 (2026-09-27: desktop 1440px both locales; 360px and 390px in a same-origin iframe, no horizontal overflow) Inspect `/vvv/`, `/pt/vvv/`, `/works/vvv/`, `/works/mcp/` at 360px and 1440px, with scripting disabled for `/vvv/`.

## Phase 6: the code review's findings (2026-09-29)

- [x] T020 Per-app legal pages carry the general sections that bind the app (`withApp`); `LegalDocument.projects` required.
- [x] T021 `project.formerName` through the dictionary; terminal `open`/`projects` and did-you-mean accept the old name; WakaTime time summed across a rename.
- [x] T022 `/mcp/`: no browser call to GitHub, named copy buttons with a status region and a visible failure, menu semantics and Escape, strings in `mcp-page.ts`, tools table shared with `/mcp.md`, wordmark as text, unhashed icons out of `/assets/`.
- [x] T023 Small ones: PT terms path and `legal.updated`, stale comments, the home hero line that overflowed a 390px PT screen, `check-bundle.mjs` checks the built scripts for static-document prose.
- [ ] T024 Not done, measured: splitting the static documents into their own entry so they stop downloading the whole bundle. Two files cost +1.03 KB gzip (120.47 KB of 120), three cost +1.58 KB. It needs the non-default GitHub years moved to static JSON (about 2.4 KB), the route CLAUDE.md already names, and is its own feature.
