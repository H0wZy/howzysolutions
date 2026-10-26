# Quickstart: run the Next.js site on your machine

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Date**: 2026-10-26

Everything here is local. Nothing creates a Cloudflare resource, logs in to Cloudflare, deploys, or sends
an email. The commands are the ones the plan will create (the `next/` directory does not exist yet; task
T001 creates it). Where a command was already run in the research scaffold it says so; the rest are
**planned and not yet run**, and the task that first runs each one is named so nobody trusts a step that
was never executed.

## 0. Prerequisites

| Tool | Version | Source |
|---|---|---|
| Node.js | 24 (`node -v` printed `v24.18.1` on 2026-10-26; CI uses `node-version: 24`, `.github/workflows/ci.yml:23`) | research.md (a) |
| npm | 11.16.0 (same session) | research.md (a) |
| Wrangler | 4.152.0, installed in `next/` as a dev dependency, never global (needs Node 22 or later) | research.md (a) |
| A browser | any | |

No Cloudflare account is needed for sections 1 to 5. No Docker, no Postgres.

## 1. Install

```bash
cd next
npm ci
```

`npm ci` installs exactly `next/package-lock.json`. The first install is `npm install` in task T001, which
writes the lockfile; after that only `npm ci` is used (FR-002: genuine lockfile).

Pinned versions (research.md (a)): next 16.4.3, react and react-dom 19.3.1, tailwindcss 4.3.3, vinext 1.3.1,
`@vinext/cloudflare` 1.2.1, `@cloudflare/vite-plugin` 1.65.0, wrangler 4.152.0, vite 8.3.5, typescript 6.0.3.
If `npm ci` complains about a peer range, stop and read research.md; do not add `--force` or
`--legacy-peer-deps`.

## 2. Local secrets and variables

Create `next/.dev.vars` (gitignored, never committed; a template `next/.dev.vars.example` is committed with
every name and a fake value):

```text
ENVIRONMENT=development
ADMIN_DEV_TOKEN=local-dev-only
ADMIN_EMAIL=you@example.test
IP_HASH_SALT=local-salt
TURNSTILE_SECRET=<Cloudflare's published test secret, see below>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<Cloudflare's published test site key>
RESEND_API_KEY=re_local_unused
RESEND_FROM=devlog@example.test
OWNER_EMAIL=you@example.test
```

`.dev.vars` is the file Wrangler reads for local secrets. Whether the Vite plugin path reads it the same way is
confirmed in task T006, which also writes the exact filename into this file if it differs.

- The Turnstile test keys are published by Cloudflare for development. They were **not read** in this lane;
  task T045 reads them from the Turnstile docs, records the page and the date here, and replaces the
  placeholders above.
- With `ENVIRONMENT=development`, admin routes accept the header `x-dev-admin: local-dev-only` in place of
  Cloudflare Access (contracts/api.md 1.6). The production build refuses it, and a test proves it.
- `RESEND_API_KEY` is a dummy locally. The email code writes to the `outbox` table and a local fake sender
  prints the message to the terminal; no request leaves the machine (task T074).

## 3. Local database, media and cache (no remote)

Wrangler and the Cloudflare Vite plugin run D1, KV and R2 as local simulations in `next/.wrangler/state/`
(gitignored). Create the schema and, optionally, sample rows:

```bash
cd next
npx wrangler d1 migrations apply DB --local
npx wrangler d1 execute DB --local --file=seed/dev.sql
```

- `migrations/0001_init.sql` is `contracts/d1-schema.sql` byte for byte (task T050 adds a test that compares
  them). The `--local` flag is the only form used in this document; `--remote` appears nowhere in a
  quickstart step and belongs to task T052 [MANUAL].
- `seed/dev.sql` (task T054) inserts two published posts (one `en`, one `pt`, twins), one draft, three
  comments in each state, and two subscribers. It is development data and says so in its first line.
- To start clean: delete `next/.wrangler/state/` and apply the migration again.
- Inspect: `npx wrangler d1 execute DB --local --command "SELECT id, slug, locale, state FROM posts"`.

## 4. Develop

```bash
cd next
npm run dev:vinext
```

`dev:vinext` runs `vite dev --port 3001` (the script name and port are the ones `vinext init` generated in
the research scaffold, `package.json` of `006-vinext-legacy`). Open `http://localhost:3001/`.

- Bindings (`DB`, `METRICS`, `MEDIA`, `RL_SUBMIT`) are the local simulations from section 3.
- Admin: `curl -H "x-dev-admin: local-dev-only" http://localhost:3001/api/admin/posts` (once slice 2 exists).
  In the browser, `/admin/devlog` in development shows the editor without a sign-in because the dev header is
  injected by `proxy.ts` only when `ENVIRONMENT=development`.
- Turnstile locally uses the test site key, so the widget always passes (that proves the form, not the
  widget; SC-007 is proven by the unit tests with the injectable verifier).

## 5. Test, lint, type-check

```bash
cd next
npm test            # vitest run (unit) and the Workers-pool integration tests once T020 adopts them
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
```

The Vite site's own suite is unchanged and runs from the repository root: `npm test`, `npm run lint`,
`npm run build`. Both suites must pass before any merge (constitution VII).

Gates that run beside the tests, each a script that exits non-zero (tasks in plan.md "Gates"):

```bash
cd next
npm run check:contrast       # tokens.css contrast, reuses ../scripts/check-contrast.mjs logic
npm run check:punctuation    # no U+2013 or U+2014 in src, content, specs/006 and migrations
npm run check:secrets        # SC-005: no secret name or value pattern in dist/
npm run measure:js           # records gzipped JavaScript per document (SC-004), exits 0 and prints
```

## 6. Build and preview the production Worker locally

```bash
cd next
npm run build:vinext
npm run start:vinext
```

`build:vinext` is `vite build` and writes `dist/client` and `dist/server` (exit 0 on the research scaffold;
the output sizes are in research.md (b)). `start:vinext` is `wrangler dev --config dist/server/wrangler.json`
and serves on `http://localhost:8787`, with local bindings. This is the closest thing to production that runs
without an account: same Worker code, Static Assets rules and compatibility flags.

If vinext's generated files are replaced by the OpenNext fallback (decision R1, task T012), these two script
names stay and only their bodies change; this document is updated in that task.

## 7. The parity check against the Vite site

Terminal 1, the Vite site exactly as it deploys (assets-only Worker, `html_handling: "auto-trailing-slash"`):

```bash
cd <repository root>
npm run build
npx wrangler dev --port 8788
```

Terminal 2, the Next site (section 6, port 8787). Terminal 3:

```bash
cd next
node scripts/parity-diff.mjs --a http://localhost:8788 --b http://localhost:8787
```

It requests the 40 sitemap URLs from both and compares status, `lang`, `title`, visible text, canonical,
`hreflang` and description, then `sitemap.xml` and `robots.txt` byte for byte (contracts/routes.md section 5).
Exit 0 means SC-001 holds for this build. `npm run build` at the root runs `scripts/fetch-wakatime.mjs` and
`scripts/fetch-github.mjs`, which fall back to the committed JSON without their keys (constitution:
degrade, never fail), so no secret is needed.

## 8. Preview hostname on Cloudflare (needs the owner; not part of local work)

The Next Worker is named `howzysolutions-next` and deployed with `workers_dev: true` and **no** `routes`, so
it answers only on `https://howzysolutions-next.<account-subdomain>.workers.dev` and the Vite Worker keeps
`howzysolutions.com` (FR-016; plan.md D6). The one-time owner tasks (create D1, KV, R2, the Access application,
Turnstile widget, Resend domain) are the `[MANUAL]` tasks in tasks.md; this quickstart does not run them.

## 9. Troubleshooting

| Symptom | Likely cause | Check |
|---|---|---|
| `npm ci` peer error on `typescript` | someone bumped TypeScript to 7.x | research.md R5: typescript-eslint 8.72.0 needs `<6.1.0` |
| `vinext init` stops asking for cache choices | the three flags were omitted | research.md (b): `--cdn-cache=none --data-cache=none --image-optimization=none` |
| Install pulls `cf` or `@cloudflare/vite-plugin` 2.0.0 beta | the default init path was used | research.md (b): only `--legacy-wrangler-cloudflare-init` |
| 401 on `/api/admin/*` locally | `ENVIRONMENT` is not `development` or the header is missing | section 2 |
| Every request hits the Worker, none the assets | `run_worker_first` is `["/*", ...]` | research.md (c) consequence 5; task T013 |
| D1 table missing | migration not applied to the local state | section 3 |
