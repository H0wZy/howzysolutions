# Implementation Plan: Next.js dynamic site

**Branch**: `006-nextjs-dynamic-site` (worktree branch `lane/006-nextjs`) | **Date**: 2026-10-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-nextjs-dynamic-site/spec.md`

**Design documents**: [research.md](./research.md) (versions, vinext check, limits, vendors) |
[data-model.md](./data-model.md) | [contracts/d1-schema.sql](./contracts/d1-schema.sql) |
[contracts/routes.md](./contracts/routes.md) | [contracts/api.md](./contracts/api.md) |
[quickstart.md](./quickstart.md) | [tasks.md](./tasks.md)

## Summary

Move howzysolutions.com from a Vite-prerendered, assets-only Worker to a Next.js 16.4.3 App Router
application running on Cloudflare Workers through vinext 1.3.1 on its legacy Wrangler init, then add a
weekly devlog with an authenticated editor, a newsletter, a contact form, moderated comments and cached live
metrics, in six slices that each ship on their own. The Vite site stays the one served at the domain until
the 40 documents it serves today are byte-compared and the owner says "pode trocar" (FR-016). The new
application lives in `next/` beside the Vite sources, shares the typed content under `src/content/` and the
design tokens under `src/styles/` by import instead of copy, and is previewed on a `workers.dev` hostname.
Data lives in D1 (schema in `contracts/d1-schema.sql`), images in R2, caches in KV; credentials only in Worker
secrets; admin behind Cloudflare Access with the assertion verified by the Worker.

## Decision R1 (FR-001): vinext, legacy Wrangler init, with OpenNext as the recorded fallback

- **Chosen**: `vinext` 1.3.1, initialised with `--legacy-wrangler-cloudflare-init`, which pins stable
  `wrangler` 4.152.0 and `@cloudflare/vite-plugin` 1.65.0. The default init is rejected because it installs
  `cf` 1.0.0-beta.21 and Cloudflare Vite plugin 2.0.0-beta (FR-002 forbids beta).
- **Where the check and the build output are**: `npx vinext check` printed `Overall: 88% compatible (6
  supported, 2 partial, 0 issues)` and exit code 0 on a `create-next-app` scaffold; the full text is in
  [research.md](./research.md) section (b). Raw logs on this machine, not committed:
  `C:/Users/h0wzy/AppData/Local/Temp/claude/C--Users-h0wzy-projects-vvv/0316f8c5-fecb-4131-b141-78e41f32078c/scratchpad/vinext-check.log`,
  `.../vinext-init-legacy.log` and `.../vinext-build-legacy.log`; the scaffolds are `.../006-scaffold/` and
  `.../006-vinext-legacy/` in the same directory. The legacy build exited 0 (`vite v8.3.5`, `built in 850ms`,
  server `index.js` 309.96 kB, gzip 97.26 kB).
- **Spike result (T012, 2026-10-26)**: every feature passed under vinext 1.3.1; the verdict table is in research.md (b), "The spike (T012)". Two caveats are open risks, not reasons to switch: pages are not prerendered unless `prerender: true` plus the static-assets adapter is configured (and then the Worker still serves them from `ASSETS`), and a page with no client component still ships about 142 KB gzipped of JavaScript. The text below is the plan as it stood before the spike.
- **Why this was conditional**: the check scanned an empty scaffold. Task T012 builds a spike that exercises
  route handlers with D1/KV/R2 bindings, `proxy.ts`, `[locale]` with `generateStaticParams`, `rewrites`,
  `trailingSlash`, a `scheduled` export, and a form server action. T012 writes its verdict into research.md
  (b). A failure on any item the site needs switches the adapter to `@opennextjs/cloudflare` 1.20.13 (peers
  satisfied by next 16.4.3) with no change to `app/`, content or route handlers, because bindings are read
  through one module (`next/src/server/env.ts`, D4).
- Source for the choice: `nextjs-on-cloudflare` skill of the Cloudflare plugin, "Use vinext rather than
  OpenNext for new Next.js projects" (research.md (b)); FR-001.

## Technical Context

**Language/Version**: TypeScript 6.0.3 strict (not 7.0.2: typescript-eslint 8.72.0 peers `<6.1.0`, research.md
R5); Node 24 for tooling (`v24.18.1`), Workers runtime with `nodejs_compat`.

**Primary Dependencies** (all stable, exact in `next/package.json`, dates and commands in research.md (a)):
next 16.4.3 (2026-10-23), react and react-dom 19.3.1 (2026-10-14), react-server-dom-webpack 19.3.1,
vinext 1.3.1 (2026-10-25), `@vinext/cloudflare` 1.2.1 (2026-10-25), vite 8.3.5 (2026-10-21),
`@vitejs/plugin-rsc` 0.5.38 (2026-10-15), `@vitejs/plugin-react` 6.1.2 (2026-10-05),
`@cloudflare/vite-plugin` 1.65.0 (2026-10-23), wrangler 4.152.0 (2026-10-22), tailwindcss and
`@tailwindcss/postcss` 4.3.3 (2026-07-16), shadcn CLI 4.22.1 (2026-10-18, run with `npx`, not a dependency),
jose 6.2.13 (2026-10-20), marked 18.1.1 (2026-10-12), a sanitiser chosen in T055 (candidate sanitize-html
2.18.1). Resend is called with `fetch` (REST), no SDK.

**Storage**: D1 `DB` (schema `contracts/d1-schema.sql` = `next/migrations/0001_init.sql`), R2 `MEDIA`, KV
`METRICS`, Rate Limiting binding `RL_SUBMIT`. No other store.

**Testing**: Vitest 5.0.5 (2026-10-15; the Vite site stays on `^3.2.7`) for pure logic;
`@cloudflare/vitest-pool-workers` 0.23.0 (2026-10-07) for handlers against real local D1, KV and R2 if its
vitest peer range admits 5.0.5 (task T020 reads it; if not, Vitest 4.1.12 for `next/` or miniflare directly,
decided there). Parity by `next/scripts/parity-diff.mjs`.

**Target Platform**: Cloudflare Workers, Free plan (100,000 requests per day, 10 ms CPU per invocation, D1 5 M
reads and 100,000 writes per day, KV 1,000 writes per day; research.md (c)).

**Project Type**: web application (Next.js App Router with route handlers) beside the existing Vite site.

**Performance Goals**: LCP at most 1.8 s, CLS at most 0.05, Lighthouse mobile Performance at least 95 and
Accessibility 100 (constitution 3.0.0; SC-003). JavaScript transferred is measured, not capped (SC-004).

**Constraints**: static documents served without Worker CPU where Static Assets can answer (T013); dynamic
routes have a measured CPU figure before the switch (SC-006, T016, T100); no credential outside Worker
secrets (SC-005); the Vite site unchanged and deployable the whole time (FR-016).

**Scale/Scope**: 40 parity documents, 8 page kinds, 19 components to port, one weekly post, a list in the low
hundreds at most. Row budget in data-model.md.

## Constitution Check

*Constitution 3.0.0 (amended 2026-10-26). Checked on 2026-10-26 before tasks were written; re-check after T012
and again at the switch.* One administrative defect found: the footer of
`.specify/memory/constitution.md` still reads `Version: 2.3.0 | Last Amended: 2026-09-30` (line 503 at read
time) while the sync report and the Stack paragraph say 3.0.0; task T009 corrects the footer.

| Principle or section | How this plan meets it |
|---|---|
| I. Content is data | Projects, CV, profile, privacy, terms, showcases and the i18n dictionaries stay in `src/content/**` and are imported by `next/` through the alias `@content/*` (no copy). A grep of `src/content` found no `import.meta` and no import from components or pages outside tests, on 2026-10-26, so the modules are consumable as they are. Devlog posts are data in D1, not JSX. `generateStaticParams` reads `src/content/projects/index.ts`. |
| II. Minimum code | New runtime dependencies and the rung of the ladder that failed (this table is the justification the principle asks for; each PR cites its row): **next, react-server-dom-webpack, vinext, @vinext/cloudflare**: the owner decided the stack (constitution 3.0.0), no lower rung can run Next.js. **jose**: Web Crypto can verify an RS256 JWT but not fetch, cache and rotate a JWKS; about 30 lines of our own would be security code we would have to maintain. **marked** and a **sanitiser**: Markdown is not in the platform; writing a parser is the larger code. **shadcn components**: copied source, not a runtime package; `lucide-react` stays forbidden and generated imports are replaced by inline SVG (constitution Stack). Rejected, rung 1 (does not need to exist): a Resend SDK (REST is two calls), an ORM (D1 prepared statements and the schema's CHECKs are enough), a form library (native `FormData`), a UI state library, an auth library (Access does it), `@cloudflare/next-on-pages` (deprecated path). |
| III. Accessible by construction | Server-rendered pages read without JavaScript; forms are real `<form method="post">` with a no-JS result page (api.md 1.3); admin editor controls are semantic and keyboard operable; the comment, newsletter and contact errors are announced in a live region; images require `alt` in the editor and the database; the Turnstile widget is the one third-party interactive element and its keyboard behaviour is checked in T049. Contrast gate runs on `tokens.css`, shared. Lighthouse Accessibility 100 on `/`, `/pt/`, `/devlog/` and one post (SC-003). |
| IV. Renderer-agnostic core | `src/terminal/**` is imported unchanged (`@legacy/terminal`); no React, Three.js or DOM import is added to it. The Next page only renders its output. |
| V. Bilingual parity | One typed dictionary under `src/content/i18n/` (a missing key is a type error). New strings for forms, admin chrome and error messages are added to it in both locales in the same task. `lang` follows the locale segment. Posts may exist in one locale; the other locale's page says so and links across (FR-013; data-model.md, Post). |
| VI. Dark only, tokens | `next/src/app/globals.css` imports `../../../src/styles/tokens.css` (one palette, one place); shadcn's CSS variables are mapped to those tokens; a literal colour in a component is a lint defect carried over from the Vite site's rule (task T003 ports the check). No light mode. |
| VII. Verified before merge | `next/` has `build`, `lint`, `typecheck`, `test`; CI job `check-next` runs them on every push and pull request; pure logic (dash rule, slug, rate window, Access claims, Turnstile branch, state machines) has unit tests; handlers have Workers-pool tests against local D1/KV/R2; rendering is verified at 360 and 1440 px in both locales with screenshots in the PR. |
| Stack | Matches 3.0.0: Next App Router, React 19, TS strict, Tailwind 4 over the tokens, shadcn, Cloudflare Workers with a script and D1/KV/R2 bindings, `howzysolutions.com` at the switch. |
| Design direction, colour, typography | Unchanged. Fonts stay self-hosted: `@fontsource-variable/jetbrains-mono` files are served from `public/fonts` or `/_next/static`, never `next/font/google` (vinext falls back to the Google CDN when a font is not statically analyzable, research.md (b); a test greps the built HTML for `fonts.googleapis.com`, task T026). |
| Performance targets | LCP, CLS, Lighthouse measured on the production build, mobile throttling (T100). JavaScript figure recorded, no ceiling (SC-004). |
| Secrets and external data | Worker secrets only; CI grep over `dist/` for every secret name and value pattern (SC-005, task T028); metrics degrade to the last cached value with its timestamp (data-model.md). |
| Honesty in metrics | The live metrics keep period and source beside each number; the timestamp of the last successful fetch is shown. No new number about the author is added. |
| Privacy | Turnstile (Cloudflare) and Resend are named in the privacy policy, both locales, with what they receive and how long, in the same change that ships each (tasks T079 and T079). Cloudflare Web Analytics exception unchanged. |
| Workflow and gates | Spec-driven (this plan); branch off `main`; Conventional Commits; build and lint pass; screenshots for UI; dependencies justified (row above). |

No unrecorded violation. The two items that look like violations and are not: the `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
variable (the constitution forbids a credential in a `NEXT_PUBLIC_*` variable; a Turnstile site key is public by
design, research.md (f), and the CI grep whitelists exactly that name) and `proxy.ts` plus route handlers
running server code on a site whose Vite predecessor had none (the Stack paragraph of 3.0.0 allows both).

## Design decisions

- **D1. vinext on the legacy Wrangler init.** See Decision R1 above.
- **D2. `next/` beside the Vite sources, not in place.** Chosen: a new directory `next/` at the repository root
  with its own `package.json` and lockfile; the Vite app (`src/`, `scripts/`, root `package.json`,
  `wrangler.jsonc`) is untouched until the switch. Reasons: FR-016 needs the Vite Worker deployable until a
  week after the switch (spec, Delivery order 6); the two toolchains disagree on versions today (root: vite
  `^8.1.0`, vitest `^3.2.7`, eslint `^10.5.0`, wrangler `^4.135.0`; `next/`: vite 8.3.5, vitest 5.0.5,
  eslint 9 line until T001 decides) and one `package.json` cannot hold both without a fight; a single CI
  failure domain per site keeps a red Next build from blocking a Vite fix. Rejected: replacing in place on a
  long-lived branch (the live site could not be patched from it), and a monorepo workspace (a tool and a
  config layer for one extra package; Principle II). At the switch the Vite sources are deleted in one
  commit after the grace week, and `next/` is promoted to the root in a separate commit (tasks T107 and T108).
- **D3. Shared by import, not by copy.** `next/tsconfig.json` aliases `@content/*` to `../src/content/*`,
  `@legacy/*` to `../src/*` (for pure modules only: `route.ts`, `navigation.ts`, `locale.ts`, `terminal/**`)
  and `next/src/app/globals.css` imports the root tokens. A copy of `src/content` would drift (AGENTS.md trap
  of two counters advancing independently, the same reason data-model.md ties `ip_hash` to one function). JSX
  components are ported, not imported, because they become server and client components. Static files from
  `public/` are synced into `next/public/` by `next/scripts/sync-public.mjs` at build time (never committed
  twice; `next/public/` is gitignored except `next/public/.gitkeep`).
- **D4. One bindings module and one entry.** `next/src/server/env.ts` is the only file that imports
  `cloudflare:workers`; every handler calls `getEnv()`. `next/worker.ts` is the `main` of the Worker: it
  delegates `fetch` to `vinext/server/fetch-handler` and exports `scheduled` for the outbox drain and purges
  (api.md section 5). T012 confirmed the wrapper: `wrangler.jsonc` `main: "worker.ts"` importing the default export of
  `vinext/server/fetch-handler` and exporting `scheduled` builds and fires (research.md (b)), so the second Worker
  `howzysolutions-cron` is not needed.
- **D5. Rendering split.** Per routes.md: the 40 parity documents are prerendered with `generateStaticParams`;
  the devlog, media and admin are dynamic; `/` becomes revalidated hourly only in the metrics slice. The
  generated `wrangler.jsonc` sends every request through the Worker (`run_worker_first: ["/*", ...]`); T013
  tests listing only the dynamic prefixes (`/devlog/*`, `/pt/devlog/*`, `/api/*`, `/admin/*`, `/media/*`,
  `/newsletter/*`, `/contact/*`) so the prerendered documents are answered by Static Assets, which are free
  and unlimited (research.md (c)). If vinext cannot, the Worker serves stored HTML and the request counts
  against the 100,000 per day.
- **D6. FR-016, the preview hostname.** The Next Worker is `howzysolutions-next`, with `workers_dev: true`
  and **no `routes`**, so it is reachable only at `https://howzysolutions-next.<account-subdomain>.workers.dev`
  (`workers_dev` and `route` keys per the Wrangler environments page, read 2026-10-26, section on deploying
  to `*.workers.dev`). The existing `wrangler.jsonc` of the Vite Worker keeps `"routes": [{ "pattern":
  "howzysolutions.com", "custom_domain": true }]`, `workers_dev: false`, `preview_urls: false`. Nothing in
  `next/wrangler.jsonc` names `howzysolutions.com` until task T104. The switch is the pair of edits: remove
  the custom domain from the Vite Worker's config, add it to `next/wrangler.jsonc`, deploy both; reversible by
  the opposite pair in one deploy (task T104, T105). Branch previews (FR-014): CI uploads a non-production
  Worker version for every branch with `wrangler versions upload`, whose version URL is documented as "Test a
  specific Worker version uploaded with `wrangler versions upload`" (Cloudflare Workers docs, Version URLs
  page, read 2026-10-26, only its description survived in `scratchpad/docs/previews.md`); the exact alias
  syntax is read in task T008, which writes it into quickstart.md. The `workers.dev` hostname is also
  protected by Access for the admin paths (T068 [MANUAL] covers both hostnames).
- **D7. Secrets.** Names and kinds are in api.md section 6. Production values are set by the owner with
  `wrangler secret put` (T051, T072, T092 [MANUAL]); CI never holds a Resend, Turnstile or WakaTime value
  except `WAKATIME_API_KEY`, which it already holds for the Vite build.
- **D8. Sanitised Markdown only on the server.** `body_html` is produced at save time by `marked` then the
  sanitiser, with a hostile-input corpus (script, `javascript:` URLs, event handlers, `<img onerror>`, SVG,
  `<iframe>`, data URIs) in a test (FR-012, decision R6). Public requests never run Markdown.
- **D9. Newsletter uses the outbox, not Queues.** Reason in data-model.md (Outbox). A global cap of 50
  confirmation emails per 24 hours protects Resend's 100 a day (api.md 2.3).

## Measurements (SC-004, filled by the tasks named; not yet measured)

Method, identical to the Vite figures: for each of the 40 documents, take the HTML response, list every
`<script src>` and `rel="modulepreload"` URL it loads plus inline script bytes, gzip each with level 9 (the
level of `scripts/check-bundle.mjs` line 36), sum, divide by 1024. `next/scripts/measure-js.mjs` (task T027)
prints the table and the per-kind summary; the owner reads it, nothing fails on it.

| Document class | Vite build (2026-09-29, constitution 2.3.0 text) | Next build (task T027) | Delta |
|---|---|---|---|
| Static document (`/privacy-policy/`, `/terms-of-service/`, `/vvv/`, `/vvv/live/` and legal twins) | 8.28 KB | to be recorded by T027 | |
| Hydrating document (home, cv, mcp, works) | 120.47 KB | to be recorded by T027 | |
| `/devlog/` and one post | not applicable | to be recorded by T069 | |
| Worker CPU per dynamic route (ms, against the 10 ms Free limit) | not applicable | to be recorded by T016 and T100 | |

## Gates (what fails a build)

| Gate | Script | Task | Runs in |
|---|---|---|---|
| 40-URL parity diff (SC-001) | `next/scripts/parity-diff.mjs` | T014 | CI against the branch preview and locally (quickstart 7) |
| Contrast of every token (WCAG floors) | `scripts/check-contrast.mjs` (shared, reads `src/styles/tokens.css`) | T024 | root and `check-next` |
| No U+2013 or U+2014 in the new sources, content, specs and migrations | `next/scripts/check-punctuation.mjs` | T025 | `check-next` |
| Visible-text parity (inside the parity diff) and no-JS first response | `parity-diff.mjs` step 4 and 6 | T014, T021 | `check-next` |
| No secret name or value pattern in `dist/` (SC-005) | `next/scripts/check-secrets.mjs` | T028 | `check-next` |
| JavaScript size recorded (SC-004) | `next/scripts/measure-js.mjs` | T027 | `check-next`, never fails |
| No `fonts.googleapis.com` or `gstatic` in built HTML | inside `check-secrets.mjs` family, `check-external.mjs` | T026 | `check-next` |
| Schema migration equals contract | `next/src/__tests__/migration.test.ts` | T050 | `check-next` |

## Project Structure

### Documentation (this feature)

```text
specs/006-nextjs-dynamic-site/
├── spec.md
├── plan.md              # this file
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── d1-schema.sql
│   ├── routes.md
│   └── api.md
└── tasks.md
```

### Source code (repository root, during coexistence)

```text
src/                         # Vite site, unchanged until T107; src/content and src/styles shared by import
scripts/                     # Vite generators, unchanged; their outputs are read by next/
wrangler.jsonc               # Vite Worker, keeps howzysolutions.com
next/
├── package.json             # exact pins, own lockfile
├── package-lock.json
├── next.config.ts           # trailingSlash, rewrites, redirects (30 rules), headers
├── vite.config.ts           # vinext + @cloudflare/vite-plugin
├── wrangler.jsonc           # howzysolutions-next, workers_dev true, bindings, ratelimits, cron
├── worker.ts                # fetch + scheduled entry (D4)
├── proxy.ts                 # Access check for /admin and /api/admin, security headers
├── migrations/0001_init.sql # = specs/006-nextjs-dynamic-site/contracts/d1-schema.sql
├── seed/dev.sql
├── scripts/                 # parity-diff.mjs, parity-allow.json, sync-public.mjs, check-*.mjs, measure-js.mjs
├── src/
│   ├── app/
│   │   ├── [locale]/        # all public pages; generateStaticParams for en and pt
│   │   ├── api/             # comments, newsletter, contact, admin/**
│   │   ├── admin/           # editor island, moderation
│   │   ├── media/[...key]/route.ts
│   │   ├── sitemap.xml/route.ts
│   │   └── globals.css      # imports ../../../src/styles/tokens.css
│   ├── components/          # ported 19 components; ui/ holds shadcn sources
│   ├── server/              # env.ts access.ts turnstile.ts ratelimit.ts iphash.ts errors.ts markdown.ts email.ts metrics.ts outbox.ts
│   ├── lib/
│   └── __tests__/           # unit; handlers/ for Workers-pool tests
└── public/                  # gitignored, filled by sync-public.mjs
```

**Structure Decision**: a second package `next/` beside the Vite sources (D2), sharing content and tokens by
alias (D3). At the switch it is promoted to the root and the Vite sources are removed in separate commits.

## Risks (each has a task that closes it)

| Risk | Evidence | Closed by |
|---|---|---|
| vinext lacks a feature the site needs; `@vitejs/plugin-rsc` is 0.x (0.5.38) | research.md (b) | T012 spike; fallback adapter in R1 |
| 10 ms CPU on Free breaks server-rendered routes | research.md (c) 3 | T016, T100; Workers Paid is US$ 5 a month (spec Assumptions) |
| Every request counted against 100,000 per day | `run_worker_first` | T013 |
| `scheduled` export not possible with vinext's entry | api.md 5 | T012, D4 |
| No per-IP window for newsletter subscribe | api.md 2.3 | cap of 50 a day plus burst brake; revisit if it trips (T075) |
| KV 1,000 writes a day | research.md (c) 1 | no rate counters in KV; worst case 240 writes (data-model.md) |
| Resend 100 emails a day | research.md (d) | outbox, cap, broadcasts for the weekly send |
| Sanitiser not Workers-compatible | research.md R6 | T055 spike before any other devlog task |
| 307 vs 308 and 301 vs 308 differences against the Vite site | routes.md 1 and 3 | T022 records or matches |

## Complexity Tracking

> Filled because the Constitution Check shows a cost to record, not a violation.

| Item | Why needed | Simpler alternative rejected because |
|---|---|---|
| Second package `next/` and a shared-by-alias layout (D2, D3) | Vite site must stay deployable during the whole migration (FR-016) | In-place rewrite cannot be patched while live; copying `src/content` drifts |
| `jose` dependency | verifying a rotating JWKS (research.md (e)) | hand-written JWT verification is security code with no tests worth trusting |
| Outbox table and cron instead of Queues | one fewer binding and consumer; retries visible in the admin (data-model.md) | Queues needs a consumer export in an entry vinext may not allow |
| Admin check twice (`proxy.ts` and each handler) | a matcher typo must not open the admin (R2) | one check is the default failure mode this repeats |
| Parity script with an allow-list file | 40 pairs, whitespace-normalised text, explicit accepted differences | eyeballing 40 pages is the check this replaces |
