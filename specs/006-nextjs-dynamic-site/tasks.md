# Tasks: Next.js dynamic site

**Input**: [spec.md](./spec.md), [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md),
[contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Date**: 2026-10-26

## Format

`- [ ] T### [P?] [MANUAL?] [US?] Description with exact path`

- **[P]**: can run in parallel with its neighbours (different files, no dependency between them).
- **[MANUAL]**: the owner's action (a Cloudflare, Resend or DNS dashboard, a secret, a decision). No agent does
  it, and no agent creates a Cloudflare resource, logs in to Cloudflare, or deploys on its own (AGENTS.md).
- **[US1]** to **[US6]**: the user story of spec.md. Setup, foundations and the switch carry no story tag.
- Paths are relative to the repository root. `next/` is created by T001.
- IDs run T001 to T111 with no gap. A gate is a script that exits non-zero; a task that adds one names it.
- Tests are included: constitution VII requires them for pure logic and plan.md names the gates.

## Phase 1: Setup (shared, blocks everything)

- [x] T001 Create `next/` with exact pins from research.md (a): run `npm init` in `next/`, then
  `npx vinext init --platform=cloudflare --legacy-wrangler-cloudflare-init --skip-check --force --cdn-cache=none --data-cache=none --image-optimization=none`;
  pin every dependency without `^`; commit `next/package.json` and `next/package-lock.json` (FR-002). Record in
  research.md (a) the release date of typescript-eslint 8.72.0 (`npm view typescript-eslint time --json`) and the
  eslint pin chosen against `eslint-config-next@16.4.3`; close open item 1.
  - Done 2026-10-26: `next/` created: `npm init`, then `npx vinext@1.3.1 init` with the legacy flags; every dependency pinned without `^` (research.md (a)); genuine `next/package-lock.json` from `npm install`; `npm run build` exits 0. `vinext init` wrote a bare `cloudflare()` plugin because `app/` did not exist; fixed in `next/vite.config.ts` (research.md (b), spike finding 3). typescript-eslint 8.72.0 released 2026-10-19, eslint 10.13.0 chosen, open item 1 closed.
- [x] T002 [P] Write `next/tsconfig.json`: strict, `paths` for `@/*`, `@content/*` to `../src/content/*`, `@legacy/*`
  to `../src/*` (plan D3); `npm run typecheck` (`tsc --noEmit`) passes on the empty app.
  - Done 2026-10-26: `next/tsconfig.json` with `@/*`, `@content/*` to `../src/content/*` and `@legacy/*` to `../src/*`; `npm run typecheck` exits 0 (TypeScript 6.0.3).
- [x] T003 [P] Write `next/eslint.config.mjs` (eslint, typescript-eslint 8.72.0, eslint-config-next 16.4.3) with
  `npm run lint`; port the Vite site's rules: no `any`, no unexplained non-null assertion, no literal colour in a
  component file (constitution VI and VII).
  - Done 2026-10-26: `next/eslint.config.mjs` (eslint 10.13.0, typescript-eslint 8.72.0, `eslint-config-next/core-web-vitals`); no-explicit-any, no-non-null-assertion and a colour-literal rule for `src/app` and `src/components`, each proven to fire on a deliberate bad file; `npm run lint` exits 0.
- [x] T004 [P] Write `next/vitest.config.ts` (Vitest 5.0.5, node environment, same `@` aliases as T002) with
  `npm test`; add one passing test that imports `@content/index` so the alias is proven.
  - Done 2026-10-26: `next/vitest.config.ts` (Vitest 5.0.5, node environment, same aliases); `src/__tests__/alias.test.ts` imports `@content/index` and `@legacy/route`; `npm test` passes.
- [ ] T005 [MANUAL] Owner: open Zero Trust in the Cloudflare dashboard and confirm the Access Free plan figure
  (spec says 50 users; not re-verified, research.md (c)); read the account's `workers.dev` subdomain and tell the
  agent so D6's hostname can be written into quickstart.md. Closes open item 3 (Access half).
- [x] T006 Prove how local secrets reach the Worker under the Vite plugin path: create `next/.dev.vars.example` with
  every name in contracts/api.md section 6 and fake values; add `next/.dev.vars`, `next/.wrangler/`, `next/dist/` and
  `next/public/` (except `.gitkeep`) to `.gitignore`; correct quickstart.md section 2 if the filename differs.
  - Done 2026-10-26: `next/.dev.vars.example` lists every name of api.md section 6 with fake values; `.gitignore` lists `next/.dev.vars`, `next/.wrangler/`, `next/dist/` and `next/public/*` (except `.gitkeep`), checked with `git check-ignore`. The Vite plugin path reads `next/.dev.vars` (build prints `Using secrets defined in .dev.vars`, `wrangler dev` served the value); filename unchanged in quickstart.md section 2, which now says so. Proof in research.md (b).
- [ ] T007 [P] Add job `check-next` to `.github/workflows/ci.yml`: `npm ci`, `lint`, `typecheck`, `npm test`,
  `build:vinext`, then the gates as they appear (T014, T024 to T028). Runs on every push and pull request, working
  directory `next/`. It has no deploy step yet.
- [ ] T008 [P] Read Cloudflare's Version URLs and Previews pages (the `Test a specific Worker version uploaded with
  wrangler versions upload` page and its alias syntax) and add the branch-preview step to `check-next` as a
  non-production upload (FR-014); write the exact command into quickstart.md section 8. Needs no secret beyond the
  existing `CLOUDFLARE_API_TOKEN`; if the first upload needs the Worker to exist, the step is skipped until T038.
- [x] T009 [P] Correct `.specify/memory/constitution.md`: the footer line reads `Version: 2.3.0 | Last Amended: 2026-09-30`
  while the Sync Impact Report says 3.0.0; set it to `3.0.0 | Ratified: 2026-08-19 | Last Amended: 2026-10-26`.
  In `AGENTS.md` the sentence "prerendered to 26 real documents" disagrees with `public/sitemap.xml` (40
  `<loc>` entries, contracts/routes.md); check how the 26 was counted and correct the sentence.

---
  - Done 2026-10-26 by the orchestrator: footer now `Version: 3.0.0 | Last Amended: 2026-10-26`; AGENTS.md and CLAUDE.md say 40 documents (sitemap.xml has 40 locs).
## Phase 2: User Story 1, parity (P1) MVP

**Goal**: the 40 documents of today's sitemap, served by Next.js on a preview hostname, identical in visible
text, `lang`, title, canonical, hreflang and description (spec US1, SC-001), with the gates in place.

**Independent test**: `node next/scripts/parity-diff.mjs --a <vite> --b <next>` exits 0 with an empty
`parity-allow.json`.

### Foundations of the port

- [x] T010 [US1] Write `next/scripts/sync-public.mjs` (copies `../public/**` into `next/public/`, run by `prebuild`
  and `predev`, fails if a source file is missing) and add a root script `data` to `package.json` holding the
  generator half of the existing `build` (`stamp-build`, `fetch-wakatime`, `fetch-github`, `fetch-mcp`,
  `generate-mcp-markdown`, `extract-cv`, `generate-cv-markdown`) so `next/` can call it (FR-005). Test: after
  `npm run prebuild` the file count of `next/public` equals the source count.
  - Done 2026-10-26: `next/scripts/sync-public.mjs` (hooks `predev`, `prebuild`, `predev:vinext`, `prebuild:vinext`); after `npm run prebuild` `next/public` holds 43 files, `../public` holds 43; fails on a missing source or a count mismatch. Root script `data` added to `package.json`; the `build` script is unchanged.
- [x] T011 [US1] Write `next/src/app/globals.css` importing `../../../src/styles/tokens.css`, `base.css` and
  `components.css` by relative path; run `npx shadcn@4.22.1 init` writing `next/components.json` and map shadcn's
  CSS variables to the tokens (no new colour literal); self-host JetBrains Mono from
  `@fontsource-variable/jetbrains-mono` (already a Vite dependency) as `woff2` with `font-display: swap`, no
  `next/font/google` (constitution Typography).
  - Done 2026-10-26: `next/src/app/globals.css` imports the three shared stylesheets by relative path; font imported from `layout.tsx` (a CSS `@import` loses the font url base under PostCSS); six `woff2` files emitted, `font-display: swap`, no `next/font/google`. Deviation: `npx shadcn@4.22.1 init` is interactive (preset prompt) and hung with `--yes` in a non-interactive shell, so `next/components.json` was written by hand from the Vite site's and `src/lib/utils.ts` copied; the token mapping already lives in `src/styles/tokens.css`. No colour literal added.
- [x] T012 [US1] SPIKE. In `next/`, build one throwaway page set that exercises everything the check did not
  scan: a route handler reading D1, KV and R2 through `cloudflare:workers`; `proxy.ts` with a matcher; `[locale]`
  with `generateStaticParams`; `rewrites()` plus `trailingSlash: true`; `app/sitemap.xml/route.ts`; a form server
  action; and a `worker.ts` entry that wraps `vinext/server/fetch-handler` and exports `scheduled`. Run it with
  `wrangler dev` and `curl` each. Write the verdict per feature into research.md (b) (this closes the
  conditional in decision R1) and update plan D4. If any needed feature fails, switch to
  `@opennextjs/cloudflare` 1.20.13, record why, and rewrite quickstart sections 6 and 7 in this task.
  - Done 2026-10-26: Spike run in the scratchpad, not in the repository. Every feature passed under vinext 1.3.1 (route handler with D1, KV, R2; `proxy.ts`; `[locale]`; rewrites with trailing slash; sitemap route; form action; `worker.ts` with `scheduled`; 404). R1 stands, OpenNext not taken. Verdict table in research.md (b); plan D4 and R1 updated. quickstart sections 6 and 7 need no rewrite. Open risks for T013 and T027: no prerender by default, and about 142 KB gzipped JavaScript on a page with no client component.
- [ ] T013 [US1] Static Assets without the Worker: list only the dynamic prefixes in `run_worker_first`
  (plan D5) in `next/wrangler.jsonc` and prove with `wrangler dev` request logs that `/cv/` is answered by assets;
  record the result in research.md (c) consequence 5 and close open item 4.
- [x] T014 [US1] Write `next/scripts/parity-diff.mjs` and `next/scripts/parity-allow.json` exactly as contracts/routes.md
  section 5 specifies (status, `lang`, `title`, visible text with script/style/template/noscript removed and
  whitespace collapsed, canonical, hreflang, description; `sitemap.xml` and `robots.txt` byte for byte; exit 1 on
  any difference printing the URL and the first 80 differing characters). Unit-test the normaliser and the diff
  printer in `next/src/__tests__/parity-diff.test.ts` with two hand-written HTML pairs, one equal and one not.
  Add it to `check-next` once T039 gives it a target.
  - Done 2026-10-26: `next/scripts/parity-diff.mjs`, `parity-allow.json` (empty list) and `parity-diff.d.mts`; 6 unit tests in `next/src/__tests__/parity-diff.test.ts` (equal pair, unequal pair, printer, allow list); CLI checked against two local servers: identical gives exit 0, different gives exit 1 with URL and the first 80 differing characters, bad arguments exit 2. Not yet added to `check-next` (needs T039).
- [ ] T015 [US1] Build the route layer in `next/src/app`: `[locale]/layout.tsx` (sets `<html lang>`), the locale
  segment with `generateStaticParams` returning `en` and `pt`, `rewrites()` so unprefixed paths are English and
  `/en/...` redirects to the unprefixed form, the page-kind switch reusing `@legacy/route`'s `Route` union, and
  `not-found.tsx` answering status 404 with a plain body (contracts/routes.md 1). Unit test: every row of
  routes.md section 1 resolves to a page kind, and an unknown path is 404, never 200.
- [ ] T016 [US1] Measure Worker CPU on the throwaway spike (T012): run `wrangler dev` with the Free-plan CPU limit
  simulated if Wrangler offers one, otherwise record wall time of a server-rendered `[locale]` page against the
  10 ms limit (research.md (c)); write the figure and the method into plan.md Measurements. Decision input for
  D5: any route that exceeds it is prerendered or the plan moves to Workers Paid.

### Components (19 in `src/components`, ported not copied)

- [ ] T017 [P] [US1] Port `Chrome`, `Footer`, `Breadcrumb`, `LocaleControl`, `ThemeControl`, `SectionLabel`,
  `SectionRail`, `SourceLink` to `next/src/components/` as server components, with a client wrapper only for
  `LocaleControl` and `ThemeControl`; replace `lucide-react` imports from shadcn with inline SVG (constitution
  Stack). Keep the class names the CSS files target.
- [ ] T018 [P] [US1] Port `Metrics`, `StatsPanel`, `ContributionGrid`, `GithubActivity`, `Pagination`, `Typewriter`,
  `CopyIcon`, `ProjectList`, `ProjectDetail`, `cv/*` and `ui/*` the same way; `Typewriter` and the copy buttons
  are the only client components.
- [ ] T019 [P] [US1] Port `Terminal.tsx` as one client island that imports `@legacy/terminal` unchanged
  (Principle IV: no React or DOM import enters `src/terminal/**`) and the `src/enhance/**` modules it uses;
  the terminal output stays selectable text and announced in a polite live region (Principle III).
- [ ] T020 [US1] Read the peer range of `@cloudflare/vitest-pool-workers` 0.23.0 (`npm view
  @cloudflare/vitest-pool-workers peerDependencies --json`) and decide: adopt with Vitest 5.0.5, or pin Vitest
  4.1.12 in `next/`, or use plain miniflare; add `next/vitest.workers.config.ts` and one test that writes and reads
  D1, KV and R2 locally. Record the decision in plan.md Technical Context; close open item 2.

### Pages

- [ ] T021 [US1] Port the static no-JS pages: `Legal.tsx` (privacy, terms, legalApp), `Showcase.tsx` and
  `LiveShowcase.tsx` to server components that load no framework script. Test
  `next/src/__tests__/static-documents.test.ts`: the built HTML of `/privacy-policy/`, `/vvv/` and `/vvv/live/`
  has no `<script>` tag that loads a framework chunk and its text is complete in the first response (spec US1
  scenario 2); if the Next build cannot keep it script-free, record the cost in plan.md Measurements and say so
  here.
- [ ] T022 [US1] Port the 30 rules of `public/_redirects` to `next/next.config.ts` `redirects()` and port
  `src/__tests__/redirects.test.ts` to `next/src/__tests__/redirects.test.ts` (same 30 cases). Decide and state the
  tradeoff: keep 308 and 307-versus-308 as accepted differences, or issue 301 from `proxy.ts`; ask the owner
  if he wants 301 kept, and write the choice into `parity-allow.json` or routes.md (sections 1 and 3).
- [ ] T023 [US1] Port `public/_headers` (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`) and the
  per-file headers of contracts/routes.md section 2 (`/cv.md/*`, `/cv.pdf/*`, `/mcp.md`, CORS on markdown) to
  `next.config.ts` `headers()`. Test `next/src/__tests__/headers.test.ts` fetches one asset URL and one dynamic
  URL from `wrangler dev` and compares the three security headers.
- [ ] T024 [P] [US1] Gate: contrast. `next/package.json` script `check:contrast` runs the root
  `scripts/check-contrast.mjs` (it reads `src/styles/tokens.css`, shared); wire into `check-next`. Verify it fails
  by temporarily lowering one token in a scratch copy.
- [ ] T025 [P] [US1] Gate: punctuation. `next/scripts/check-punctuation.mjs` fails on U+2013 or U+2014 anywhere in
  `next/src`, `next/migrations`, `next/seed`, `src/content`, `specs/006-nextjs-dynamic-site` and the i18n
  dictionaries; port the walk of `src/content/__tests__/punctuation.test.ts` into a Vitest test that also
  reads the new i18n keys. Wire into `check-next`.
- [ ] T026 [P] [US1] Gate: no third-party font or script host. `next/scripts/check-external.mjs` scans built HTML
  and CSS for `fonts.googleapis.com`, `fonts.gstatic.com` and any `<script src>` whose host is not the site's
  own, with an allow-list of exactly `challenges.cloudflare.com` on the three form pages and the Cloudflare
  Web Analytics host the edge injects (constitution Privacy exception). Wire into `check-next`.
- [ ] T027 [P] [US1] Gate: JavaScript measurement (SC-004). `next/scripts/measure-js.mjs` prints, per document, the
  gzipped JavaScript it loads by the method in plan.md Measurements (level 9, as `scripts/check-bundle.mjs`
  line 36) and a summary per document class; it exits 0. Record the first figures in plan.md Measurements next to
  the Vite figures 8.28 KB and 120.47 KB.
- [ ] T028 [P] [US1] Gate: secrets (SC-005). `next/scripts/check-secrets.mjs` greps `next/dist/` for every secret
  name in contracts/api.md section 6 and for patterns (`re_` followed by 20 or more word characters, `ghp_`,
  `github_pat_`, `waka_`), allowing exactly `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; the unit test plants a fake secret
  in a temp directory and expects exit 1.
- [ ] T029 [US1] Port `Home.tsx` (`/` and `/pt/`): terminal island, typewriter, GitHub activity grid and stats from
  `@content` and the committed `*.generated.json`; static before the metrics slice (routes.md row 1).
- [ ] T030 [US1] Port `Cv.tsx` (`/cv/`, `/pt/cv/`) and the file routes `/cv.md/eng`, `/cv.md/ptbr`,
  `/cv.pdf/eng`, `/cv.pdf/ptbr`, `/cv/*.pdf` with the headers of T023 (FR-003, spec US1 scenario 3).
- [ ] T031 [US1] Port `Mcp.tsx` (`/mcp/`, `/pt/mcp/`) and the generated `/mcp.md`, `/pt/mcp.md` with CORS.
- [ ] T032 [US1] Port `WorkIndex.tsx` and `Work.tsx`: `generateStaticParams` from
  `src/content/projects/index.ts` (9 project ids) and the page count (`/works/2/`); port
  `src/content/__tests__/pagination.test.ts` expectations against the Next route list.
- [ ] T033 [US1] Write `next/src/app/sitemap.xml/route.ts` producing the Vite sitemap's XML, `xhtml:link`
  alternates included, from the route table (not hand-typed), and keep `public/robots.txt` unchanged; test that
  the output equals `public/sitemap.xml` for the 40 `<loc>` entries (contracts/routes.md section 2).
- [ ] T034 [US1] Triage the six tests in `src/__tests__/` (`cv-markdown`, `metadata`, `navigation`, `redirects`,
  `static-documents`, `vvv-live`) and the content and terminal tests: each is ported to `next/` or retired with a
  one-line reason in a table at the end of this file; none is deleted without the row. The Vite copies stay and
  keep passing until T107.

### Verification

- [ ] T035 [P] [US1] Run Lighthouse mobile locally against `wrangler dev` on `/` and `/pt/`; record Performance,
  Accessibility, LCP, CLS in plan.md Measurements. Not a gate yet (SC-003 is judged at T098 on the deployed build).
- [ ] T036 [US1] Run `parity-diff.mjs` between `npx wrangler dev --port 8788` (Vite, quickstart 7) and the Next
  Worker; fix every difference or add a row with a reason to `parity-allow.json`; repeat until it exits 0. This is
  SC-001 locally.
- [ ] T037 [P] [US1] Screenshots at 360 and 1440 px, both locales, one per page kind (home, cv, mcp, works index,
  a work, privacy, vvv, vvv live), attached to the pull request (constitution workflow); record any visual
  difference against the Vite site and fix it or list it as intentional.
- [ ] T038 [MANUAL] [US1] Owner approves the first deploy of Worker `howzysolutions-next` to `workers.dev` with no
  routes (plan D6): either runs `npx wrangler deploy` in `next/` after `wrangler login`, or tells the agent to add
  the deploy step to CI for `main` only (FR-014). Confirm `https://howzysolutions-next.<subdomain>.workers.dev/`
  answers 200 and `https://howzysolutions.com/` still serves the Vite site.
- [ ] T039 [US1] Run `parity-diff.mjs` against the deployed Vite site (`https://howzysolutions.com`) and the deployed
  Next preview; paste the result into plan.md Measurements as the first SC-001 reading; add the script to
  `check-next` against the branch preview. **Checkpoint: slice 1 done; the Vite site is still the live one.**

---

## Phase 3: Foundations for the dynamic features (blocks Phases 4 to 7)

**Purpose**: the server modules every endpoint uses, each with unit tests, no UI.

- [ ] T040 Write `next/src/server/env.ts` (the only importer of `cloudflare:workers`; `getEnv()` with the `Env` type
  for `DB`, `METRICS`, `MEDIA`, `RL_SUBMIT` and the variables of contracts/api.md section 6) and declare the
  bindings in `next/wrangler.jsonc` with local-only placeholders (real ids come from T051); a test replaces
  `getEnv` to prove handlers do not import the platform module directly.
- [ ] T041 [P] Write `next/src/server/errors.ts`: the single error shape, the `code` table and statuses of
  contracts/api.md 1.2, `fail(code, fields?)` helper, locale-aware message lookup from the i18n dictionary (add the
  messages in both locales); tests: every code maps to the status in the table, no stack text in bodies.
- [ ] T042 [P] Write `next/src/server/iphash.ts`: HMAC-SHA256 of `CF-Connecting-IP`, hex, first 32 characters;
  tests with known vectors and the missing-header fallback.
- [ ] T043 [P] Write `next/src/server/ratelimit.ts`: the `RL_SUBMIT` brake keyed `<route>:<ip_hash>` and the D1
  window helper (`countSince(table, ip_hash, seconds)`); tests for 5-in-10-minutes, 3-in-an-hour boundaries and
  the `retryAfter` computation.
- [ ] T044 [P] Write `next/src/server/turnstile.ts`: injectable `verifyTurnstile`, `siteverify` call with
  `idempotency_key`, 3 s timeout, fail closed on every error (contracts/api.md 1.5); tests for success, `success
  false`, `timeout-or-duplicate`, network error and malformed JSON.
- [ ] T045 Read Cloudflare's published Turnstile test site key and secret from the Turnstile docs (testing page),
  record the URL and date in quickstart.md section 2 and put the values in `next/.dev.vars.example` (they are
  public test values; the real secret is T072).
- [ ] T046 Write `next/src/server/access.ts`: `jose` `createRemoteJWKSet` and `jwtVerify` with `issuer`,
  `audience`, expiry and `kid`; email claim against `ADMIN_EMAIL`; the dev-header path that works only when
  `ENVIRONMENT=development`. Tests with a locally generated key pair: valid, wrong issuer, wrong audience, expired,
  wrong email, missing header, and "production configuration refuses `x-dev-admin`" (contracts/api.md 1.6).
- [ ] T047 Write `next/proxy.ts`: matcher for `/admin/:path*` and `/api/admin/:path*` calling `access.ts`, plus
  `X-Robots-Tag: noindex` on admin and token pages; a test asserts the matcher covers every admin route in
  contracts/routes.md section 4 (decision R2, defence in depth).
- [ ] T048 Write `next/src/server/pipeline.ts`: content-type and size limits, `Origin` check, the visitor-POST order
  of contracts/api.md 1.4, the 303-redirect behaviour for non-JSON clients (1.3); tests assert the order by
  recording call order with fakes, and that a refused request never reaches the write (SC-007).
- [ ] T049 Write the Turnstile widget client component `next/src/components/TurnstileField.tsx` loading
  `challenges.cloudflare.com` only on pages that render it (allow-listed in T026); verify keyboard operation and
  that a page without JavaScript still posts and is refused with the no-JS result page.

---

## Phase 4: User Story 2, devlog and admin (P1)

**Goal**: spec US2 and SC-002. **Independent test**: publish through the editor on the preview; the post is on
`/devlog/<slug>/`, the index, the feed and the sitemap within 5 seconds, no deploy.

- [ ] T050 [P] [US2] Copy `specs/006-nextjs-dynamic-site/contracts/d1-schema.sql` to `next/migrations/0001_init.sql`
  and add `next/src/__tests__/migration.test.ts` asserting the two files are byte equal (FR-007) and that
  `wrangler d1 migrations apply DB --local` succeeds on an empty state.
- [ ] T051 [MANUAL] [US2] Owner: create the D1 database `howzysolutions`, the KV namespace `METRICS` and the R2 bucket
  `howzysolutions-media` (Free plan, no paid add-on), run `wrangler login` himself, and set the secret
  `IP_HASH_SALT`; give the agent the non-secret ids to put in `next/wrangler.jsonc`.
- [ ] T052 [MANUAL] [US2] Owner: `npx wrangler d1 migrations apply DB --remote` from `next/` (D1 binding of T051).
- [ ] T053 [US2] Write `next/seed/schema-checks.sql` with the 17 inserts and the refusals observed in data-model.md,
  run it on the remote database from T052 and on the local one; record the first real D1 result in
  data-model.md ("the first run on D1 is this task") and fix the schema in `contracts/d1-schema.sql` if D1
  differs from SQLite 3.50.4.
- [ ] T054 [P] [US2] Write `next/seed/dev.sql` (two published twin posts, one draft, comments in each state, two
  subscribers, first line "development data") and the `npm run seed:local` script (quickstart 3).
- [ ] T055 [US2] Compatibility spike then implementation of `next/src/server/markdown.ts`: `marked` 18.1.1 to HTML
  then an allow-list sanitiser, run inside `wrangler dev` to prove it works on Workers (decision R6, closes the
  sanitiser choice and updates research.md (a) row). Test corpus `next/src/__tests__/markdown-hostile.test.ts`:
  `<script>`, `javascript:` URLs, `onerror`, `<iframe>`, SVG, data URIs, nested HTML, an image without alt. Do this
  before any other task in this phase.
- [ ] T056 [US2] Write `next/src/server/posts.ts`: create, save with the optimistic `version` update, publish,
  unpublish, delete (draft only), versions with pruning to 50, the neighbour and list queries on
  `idx_posts_public`; Workers-pool tests (T020) for every transition row of the Post state machine and for the
  lost-lock case (409 with the newer row).
- [ ] T057 [P] [US2] Write `next/src/server/validate-post.ts`: slug rule, lengths, the U+2013 and U+2014 refusal
  with the offending line (FR-012), empty-alt image refusal with the line, `<slug>-2` suggestion; tests per
  contracts/api.md 3.1.
- [ ] T058 [US2] Implement `next/src/app/api/admin/posts/**` and `.../preview` per contracts/api.md 3.1, using
  `pipeline.ts`, `access.ts` and `posts.ts`; handler tests: 401 without assertion, 403 wrong email, 409
  `version_conflict`, 422 on dashes, 409 `published_post`, publish refused without `checklistAccepted`.
- [ ] T059 [US2] Implement `next/src/app/api/admin/media/route.ts` (magic-number sniffing, 5,242,880 limit, header
  dimensions, R2 put, `media` row) and the public `next/src/app/media/[...key]/route.ts` (R2 stream, `ETag`,
  immutable cache, key validation mirroring the CHECK); tests for oversize, wrong type, traversal key.
- [ ] T060 [US2] Implement the public pages `next/src/app/[locale]/devlog/page.tsx` and `.../[slug]/page.tsx`: index
  (10 per page), post with title, date, `body_html`, images with `alt`, previous and next, and the twin-language
  notice with a link and `noindex` when only the other locale exists (spec US2 scenarios 3 and 4); cached at the
  edge 60 s (routes.md section 4). No-JS rendering test.
- [ ] T061 [US2] Implement `next/src/app/[locale]/devlog/feed.xml/route.ts` (RSS 2.0, 20 newest, correct
  `Content-Type`) and extend T033's sitemap with published posts; test that an entry appears right after a publish.
- [ ] T062 [US2] Admin shell `next/src/app/admin/**`: layout, posts list with state and locale columns, a link to
  create (shadcn table and buttons, inline-SVG icons); `noindex`; visible only through Access.
- [ ] T063 [US2] Editor island `next/src/app/admin/devlog/[id]/Editor.tsx`: Markdown textarea, server preview via
  `/api/admin/preview`, image upload that requires alt before inserting, autosave to `localStorage` every 30 s and
  offer it back (spec Edge Cases), the 409 conflict view, the publish checklist dialog shown once (spec US2
  scenario 5), the 5 MB check before upload. Keyboard-complete and screen-reader labelled.
- [ ] T064 [P] [US2] Update `public/robots.txt` and its test: add `Disallow: /admin/` and `Disallow: /api/` and keep
  `Sitemap:` (routes.md section 2); the Vite site keeps its own copy until T107.
- [ ] T065 [P] [US2] Add the devlog strings in both locales to `src/content/i18n/` (editor chrome, checklist of the
  owner's rules of 2026-10-13: first person, no em or en dash, no spoilers beyond the agreed beginning, no game
  code; the "this post is in Portuguese" notice); the punctuation gate (T025) covers them.
- [ ] T066 [P] [US2] Handler tests in `next/src/__tests__/handlers/admin-auth.test.ts`: every route under
  `/api/admin` and `/admin` rejects a request without a valid assertion (iterate the route table so a new route
  cannot be forgotten).
- [ ] T067 [US2] Test for SC-002: publish through the handler, then fetch the post page, the index, the feed and the
  sitemap in the Workers pool and assert each shows the post in the same test run (well under 5 s).
- [ ] T068 [MANUAL] [US2] Owner: create the Zero Trust Access application for `/admin/*` and `/api/admin/*` on the
  `workers.dev` hostname (and later the custom domain), Google as identity provider, allow only the owner's
  email; give the agent `TEAM_DOMAIN`, `POLICY_AUD` and `ADMIN_EMAIL` for `wrangler.jsonc` variables
  (non-secret, research.md (e)).
- [ ] T069 [US2] Lighthouse mobile on `/devlog/` and one post on the deployed preview and `measure-js.mjs` for both;
  record in plan.md Measurements.
- [ ] T070 [US2] Walk spec US2 scenarios 1 to 5 on the deployed preview with the real Access in front; tick each
  in a short note in this file. **Checkpoint: slice 2 done.**

---

## Phase 5: User Stories 4 and 6, newsletter and contact (P2, P3)

**Goal**: spec US4 and US6, SC-007 for these two forms. **Independent test**: subscribe a test address,
confirm, publish, send; submit the contact form; both arrive.

- [ ] T071 [MANUAL] [US4] Owner: in Resend verify the sending domain (DNS records), create an API key with sending
  access, create the segment and note `RESEND_SEGMENT_ID`, and read the free plan's marketing contact ceiling in
  the dashboard (research.md (d), open item 3); report the figure to be written into research.md.
- [ ] T072 [MANUAL] [US4] Owner: `wrangler secret put` for `RESEND_API_KEY`, `TURNSTILE_SECRET`; create the Turnstile
  widget for the preview hostname and give the agent the public site key for `NEXT_PUBLIC_TURNSTILE_SITE_KEY`;
  choose the integer `namespace_id` for `RL_SUBMIT` (contracts/api.md section 6).
- [ ] T073 [US4] Write `next/src/server/outbox.ts` and `next/worker.ts` `scheduled` handler: drain of due rows (20
  per run), back-off table of data-model.md, `last_error` kept; add the cron `*/10 * * * *` to
  `next/wrangler.jsonc`; Workers-pool tests with a fake Resend for success, retry and permanent failure.
- [ ] T074 [US4] Write `next/src/server/email.ts`: Resend REST calls (`/emails`, `/broadcasts`, contacts) with the
  fields of research.md (d), the unsubscribe headers (`List-Unsubscribe`, `List-Unsubscribe-Post`), templates for
  confirmation and contact notification in both locales, and a local fake sender selected when `ENVIRONMENT` is
  `development` that prints to the terminal (quickstart 2).
- [ ] T075 [US4] Implement `POST /api/newsletter/subscribe` per contracts/api.md 2.3: neutral answer for new,
  unconfirmed and confirmed addresses, 10-minute per-address throttle, the global cap of 50 confirmation emails in
  24 hours, outbox row; tests including the cap and the "does not reveal who is subscribed" case. If the cap or a
  real abuse ever trips, add `ip_hash` to `subscribers` in a new migration `0002`, not by editing 0001.
- [ ] T076 [US4] Implement the confirm and unsubscribe pages and handlers per contracts/api.md 2.4 and 2.5 (GET shows
  a form, POST confirms; GET unsubscribes immediately; RFC 8058 POST); tests: a scanner GET does not confirm, the
  second unsubscribe click is not an error.
- [ ] T077 [US6] Implement `POST /api/contact`, `/contact/` and `/contact/sent/` (and `pt`) per contracts/api.md 2.6
  and spec US6: Turnstile, 3-per-hour window, store plus outbox, 303 result page without JavaScript; tests for
  the fourth submission and for a missing token never reaching the write.
- [ ] T078 [US4] Forms UI: the newsletter box (site chrome or devlog footer) and the contact form with
  `TurnstileField` (T049), labelled fields, error summary in a live region, values preserved on refusal; strings in
  both locales.
- [ ] T079 [US4] Update `src/content/privacy.ts` (and `terms.ts` if needed) in both locales in the same change:
  Cloudflare Turnstile and Resend named, what each receives, retention (unconfirmed 7 days, contact messages 90
  days, subscribers until unsubscribe or deletion request) and how to ask for deletion (FR-015, constitution
  Privacy); the Vite privacy page is updated too if the feature is exposed before the switch.
- [ ] T080 [US4] Admin pages and endpoints for subscribers, contact messages and the failed outbox per
  contracts/api.md 3.3, with delete (a deletion request) and retry.
- [ ] T081 [US4] Implement `POST /api/admin/posts/{id}/newsletter`: the atomic claim of `newsletter_sent_at`, the
  broadcast create and send, the rollback of the claim on a Resend failure, `already_sent` on the second click;
  add the "send" button to the post editor (spec US4 scenario 3).
- [ ] T082 [US4] Cron purge for unconfirmed subscribers (7 days), contact messages (90 days), done outbox rows (7
  days) in the 03:00 to 03:09 UTC run (contracts/api.md section 5); tests with injected clock.
- [ ] T083 [P] [US4] Add `Disallow` for `/newsletter/` and `X-Robots-Tag: noindex` to token pages; test.
- [ ] T084 [US4] Walk spec US4 scenarios 1 to 5 and US6 scenarios 1 and 2 on the deployed preview with a real
  mailbox, including Resend's unsubscribe link in a broadcast. **Checkpoint: slices 3 done.**

---

## Phase 6: User Story 3, comments with moderation (P2)

**Goal**: spec US3. **Independent test**: comment on the preview, invisible until approved, refused over the
limit or without Turnstile.

- [ ] T085 [US3] Write `next/src/server/comments.ts`: submit (pending), approve, reject, delete, window count
  (`idx_comments_rate`), render query for approved (`idx_comments_post`); tests for every transition in the Comment
  table of data-model.md.
- [ ] T086 [US3] Implement `POST /api/comments` per contracts/api.md 2.2: 5 in 10 minutes then 429 storing nothing,
  Turnstile after the cheap checks, plain text, dash courtesy rule; tests for the sixth comment and the missing
  token (SC-007).
- [ ] T087 [US3] Comment form and list on the post page: plain text with line breaks only, no auto-links, "aguardando
  moderacao" / "awaiting moderation" message; both locales; no-JS submission works.
- [ ] T088 [US3] Admin moderation page and endpoints (`/admin/comments`, contracts/api.md 3.3) with approve, reject,
  delete.
- [ ] T089 [US3] Cron purge of rejected comments older than 30 days; test with injected clock.
- [ ] T090 [US3] Update the privacy policy in both locales for comments (name and text stored, `ip_hash` only,
  retention: until deleted by the owner, rejected 30 days; deletion request path) in the same change (FR-015).
- [ ] T091 [US3] Walk spec US3 scenarios 1 to 4 on the deployed preview. **Checkpoint: slice 4 done.**

---

## Phase 7: User Story 5, live metrics (P3)

**Goal**: spec US5. **Independent test**: request the home page twice an hour apart; the figure moves; no
credential in any response or bundle.

- [ ] T092 [MANUAL] [US5] Owner: `wrangler secret put WAKATIME_API_KEY` and `GITHUB_TOKEN` for `howzysolutions-next`
  (a read-only token; the Vite build keeps its own copies in GitHub Actions secrets).
- [ ] T093 [US5] Write `next/src/server/metrics.ts`: KV snapshot read, freshness 3600 s, background refresh through
  `ctx.waitUntil`, failure writes nothing and sets the `metrics:<source>:backoff` marker (`expirationTtl: 900`);
  tests for fresh, stale, upstream failure, 429 from upstream, first-ever read falling back to the committed JSON.
- [ ] T094 [US5] Switch the home page to `revalidate = 3600` reading `metrics.ts`; show the `fetched_at` timestamp
  beside each number with its source and period (constitution Honesty); visitors never see zeros or an error.
- [ ] T095 [US5] Run `check-secrets.mjs` (T028) with the real secret names from T072 and T092 set in the build
  environment, and request the home page twice an hour apart on the preview. **Checkpoint: slice 5 done.**

---

## Phase 8: The switch (FR-016, spec Delivery order 6)

**Gate**: nothing in this phase starts until T039, T070, T084, T091 and T095 are done (or the owner removes a
slice from scope in writing).

- [ ] T096 Re-read `.specify/memory/constitution.md` and re-run plan.md Constitution Check against what was built;
  amend plan.md or the constitution (with the Governance procedure) for anything that changed.
- [ ] T097 Final parity run, `parity-diff.mjs` with an empty `parity-allow.json`, production build against the
  live Vite site (SC-001).
- [ ] T098 Lighthouse mobile on `/`, `/pt/`, `/devlog/` and one post, production build on the preview hostname:
  Performance at least 95, Accessibility 100; record the four rows in plan.md (SC-003).
- [ ] T099 Record the final SC-004 table in plan.md Measurements from `measure-js.mjs` against the production
  build; the owner reads it before T102.
- [ ] T100 Measure Worker CPU per dynamic route and the request count of a typical day from Cloudflare Workers
  metrics on the preview; judge SC-006 (Free versus Workers Paid) and write the verdict in plan.md; close open
  item 5.
- [ ] T101 Rehearse the rollback on the preview: deploy the previous Next version, then the previous config
  pair, and time it; the switch must be reversible in one deploy (FR-016).
- [ ] T102 [MANUAL] Owner: reads the Measurements, tries the preview, says "pode trocar" in writing. Without it
  nothing below runs.
- [ ] T103 [MANUAL] Owner: confirm the zone's `www` redirect rule and the Cloudflare Web Analytics injection are
  unaffected by moving the custom domain (constitution Privacy exception depends on the latter).
- [ ] T104 Prepare the switch commit: `next/wrangler.jsonc` gains `"routes": [{ "pattern": "howzysolutions.com",
  "custom_domain": true }]` and `workers_dev` stays true; the Vite `wrangler.jsonc` loses its custom domain
  and keeps the Worker deployable.
- [ ] T105 [MANUAL] Owner or CI (with the owner's go): deploy the Vite config first, then the Next config; verify
  `https://howzysolutions.com/` and five other URLs; keep the rollback command from T101 at hand.
- [ ] T106 Post-switch parity: run `parity-diff.mjs` against a saved copy of the Vite site's output at the 24 hour
  mark and report.
- [ ] T107 After one week without rollback: delete the Vite sources (`src/` except `src/content/` and
  `src/styles/`, `scripts/` not used by `next/`, root `index.html`, `vite.config.ts`, root `wrangler.jsonc`, the
  `deploy` job), in one commit.
- [ ] T108 Promote `next/` to the repository root in a separate commit (paths in CI, quickstart, AGENTS.md,
  README.md, `.gitignore`) and update the aliases from D3.
- [ ] T109 Update `AGENTS.md`, `README.md`, `CLAUDE.md` and the History note of the constitution Stack paragraph to
  say what is deployed; mark spec 006 complete in `specs/006-nextjs-dynamic-site/`.
- [ ] T110 [MANUAL] Optional (spec Delivery order 7): when vvv Keycloak (spec 049) is in production, replace
  Access with OIDC for `/admin` as its own task and its own plan note.
- [ ] T111 Close out: this file's checkboxes, the T034 disposition table, and the GitHub Project card for the spec.

---

## Dependencies and order

- Phase 1 first. T005 and T038 wait on the owner and block only what names them.
- Phase 2: T010, T011 then T012 (the spike decides R1); T013 and T016 follow T012; T014 can start after T001; the
  component ports T017 to T019 start after T011 and run in parallel; pages T021, T029 to T033 need the layer T015
  and the ports; gates T024 to T028 run in parallel; T036 needs every page; T039 needs T038.
- Phase 3 needs T001, T004 and T012 (if T012 changes the adapter, T040 changes with it). Its tasks T041 to T044
  run in parallel.
- Phase 4 needs Phase 3 and T051/T052 for anything that touches the real database; T055 first; T056 and T057 before
  T058; T058 and T059 before T062 and T063.
- Phase 5 needs Phase 4 (the editor sends the newsletter) and the owner's T071 and T072.
- Phase 6 needs Phase 3 and the post page of T060; independent of Phase 5 except T090 and T079 sharing the privacy
  record (do them in order).
- Phase 7 needs T040 and the home page of T029.
- Phase 8 needs all slices the owner keeps.

## Parallel examples

```text
After T011:   T017, T018, T019            (disjoint component files)
Gates:        T024, T025, T026, T027, T028 (five scripts, no shared file)
Phase 3:      T041, T042, T043, T044       (four modules)
Phase 4:      T050, T054, T057, T064, T065, T066
```

## Implementation strategy

1. Phases 1 to 3, T039 as the checkpoint: the MVP is a Next site that equals the Vite site on a preview URL.
2. One slice at a time, each ending in a checkpoint task that walks the spec's acceptance scenarios on the
   deployed preview; the Vite site stays live throughout.
3. The switch is a separate phase with the owner's written word as its gate.

## T034 disposition table (filled by T034)

| Test file | Disposition | Reason |
|---|---|---|
| `src/__tests__/cv-markdown.test.ts` | to be decided in T034 | |
| `src/__tests__/metadata.test.ts` | to be decided in T034 | |
| `src/__tests__/navigation.test.ts` | to be decided in T034 | |
| `src/__tests__/redirects.test.ts` | ported in T022 | 30 cases |
| `src/__tests__/static-documents.test.ts` | ported in T021 as a built-artifact test | |
| `src/__tests__/vvv-live.test.ts` | to be decided in T034 | |
