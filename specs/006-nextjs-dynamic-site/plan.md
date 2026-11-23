# Plan: Next.js dynamic site (spec 006), parity, new home and services, contact form

**Branch**: `feat/rebrand-home-services` | **Date**: 2026-11-23 | **Spec**: [spec.md](./spec.md)

This round covers User Story 1 (parity), the new home page and `/services/` with their `/pt/` twins,
and User Story 6 (the contact form). The devlog, comments, newsletter and live metrics are not in it.

## Decision: vinext on Cloudflare, not OpenNext

`npx vinext check` was run first, on the migrated tree (output as printed, trimmed of blank lines):

```text
vinext compatibility report
  Config: 2/3 options supported
    ~  reactStrictMode: enforced for the Pages Router; App Router is not yet wrapped (Next.js defaults App Router strict mode on)
    ✓  trailingSlash
    ✓  poweredByHeader
  Libraries: 1/1 compatible
    ✓  tailwindcss
  Project structure:
    ✓  App Router (src/app/)
    ✓  1 page(s)
    ✓  1 layout(s)
    ✓  1 route handler(s)
  Overall: 94% compatible (7 supported, 1 partial, 0 issues)
```

No gap touches this site: one partial option (`reactStrictMode`, which only changes a development-time
double render), zero issues. OpenNext is therefore not needed and is not set up. If a later feature
(for example Incremental Static Regeneration, or a Next API vinext lacks) shows a gap, the switch is
OpenNext on the same App Router code; nothing here is vinext-specific except `vite.config.ts`,
`wrangler.jsonc` and the `cloudflare:workers` import in `src/app/api/contact/route.ts`.

Build and run: `vite build` (vinext) writes `dist/client` (assets) and `dist/server` (the Worker and a
derived `wrangler.json`); `wrangler dev --config dist/server/wrangler.json` runs it in workerd with local
D1 and KV; `vinext-cloudflare deploy --config dist/server/wrangler.json` ships it. `next build` also
passes (45 static pages) and is kept as `npm run build:next` as an independent check of the app against
real Next.

## Architecture

- **One optional catch-all page**, `src/app/[[...path]]/page.tsx`, with `generateStaticParams` from
  `src/site.ts` and `dynamicParams = false`. The root layout sits inside the same segment so
  `<html lang>` follows the URL (`/pt/...` is `pt-BR`). `trailingSlash: true` keeps every URL the
  Vite build had. `src/views/Document.tsx` picks the view from the same `locationFor` route table the
  Vite app used, so the URL scheme is one function, not a file tree to keep in step.
- `src/pages` became `src/views` because Next treats `src/pages` as the Pages Router.
- Tailwind 4 through `@tailwindcss/postcss`; the CSS entry and the tokens are unchanged. Fonts stay
  self-hosted (fontsource variable). shadcn/ui components that already existed are kept; none was
  needed for the new pages, and any new one is added with `npx shadcn@latest add`.
- Generated data (CV, MCP, WakaTime, GitHub, build stamp) keeps its scripts. `npm run build` runs
  `npm run data`, `tsc --noEmit`, `vite build`, then `scripts/check-bundle.mjs`. `cv.md`, `mcp.md`,
  the CV PDFs and `sitemap.xml` keep their URLs (sitemap is a route handler, byte-equal to the
  baseline's after line endings).
- Client enhancement is `src/components/Enhance.tsx` plus lazily imported chunks (`enhance/home`,
  `enhance/services`, `face-gl`, `contact-form`). With scripting off, or `prefers-reduced-motion`, the
  pages are complete: WebGL and parallax are progressive enhancement only.

## Pinned versions (FR-002)

Every dependency in `package.json` is an exact version (no `^`, no `~`). The ones that matter, with the
publication date from the registry:

| package | version | published |
|---|---|---|
| next | 16.4.6 | 2026-11-09 |
| react, react-dom | 19.3.1 | 2026-10-14 |
| vinext | 1.4.6 | 2026-11-16 |
| @vinext/cloudflare | 1.4.0 | 2026-11-16 |
| @cloudflare/vite-plugin | 1.70.1 | 2026-11-19 |
| wrangler | 4.164.0 | 2026-11-17 |
| vite | 8.1.0 | 2026-06-23 |

`@tailwindcss/vite`, `eslint-plugin-react-refresh` and the Vite-only build steps were removed.

## Parity (SC-001)

`scripts/parity-diff.mjs` reads every URL of the baseline build's sitemap, takes the baseline document
from a directory and the new one from a running server, and compares `<html lang>`, `<title>` and the
visible text of `<body>` (scripts, styles and comments removed, entities decoded, whitespace collapsed).

The baseline is the Vite build of commit `d440418` (this branch's round 1), built in a separate worktree
from the committed generated artifacts, so data capture cannot move the numbers.

| server | result |
|---|---|
| `next start` (real Next) | 42 documents compared, 0 differ |
| `wrangler dev` on the vinext build (workerd) | 42 compared, 0 differ (before the privacy change below) |
| `wrangler dev`, final tree | 40 compared, 0 differ, 2 excluded (the two privacy pages, below); with no exclusion: 42 compared, 2 differ, only those two |

After the picture was removed, the home, `/services/` and their `/pt/` twins also differ on purpose from the round-1 baseline (the caption "vvv, dashboard (test data)" is gone), so the final run excludes them with the two privacy pages: 36 compared, 0 differ, 6 excluded; with no exclusion 42 compared, 6 differ and only those six. The two privacy pages (`/privacy-policy/`, `/pt/privacy-policy/`) differ on purpose: FR-015 changed the
contact-form section (storage in D1 for 90 days, the keyed IP hash, how to ask for deletion), and the diff
shows exactly that paragraph and nothing else. The home page and `/services/` match the baseline because
round 1 had already shipped them on Vite; the spec excludes the home from the diff because it is new design,
and it is not excluded here only because the baseline already carries it. Run on Windows Git Bash with
`MSYS_NO_PATHCONV=1`, or the shell rewrites `/path/` arguments into Windows paths. `sitemap.xml`, `robots.txt`, `cv.md/eng`, `cv.md/ptbr` and `cv.pdf/eng` are
byte-equal to the baseline. `mcp.md` and `pt/mcp.md` equal the committed copies (a baseline built with
data capture on carried a newer header; it is data, not a URL or format change).
Redirects (`/servicos`, `/privacy`) and headers work through `public/_redirects` and `public/_headers`.

## JavaScript (SC-004)

Measured by `scripts/check-bundle.mjs` on the final build, gzip level 9, the scripts a document's HTML
loads:

| | Vite build | Next on vinext |
|---|---|---|
| static document (legal pages, `/vvv/`) | 8.28 KB | 134.45 KB |
| hydrating document | 120.47 KB | 134.45 KB |
| every chunk of the build, lazy ones included | n/a | 156.80 KB (11 chunks) |

This is the cost the owner read before choosing the migration: under the App Router every document,
including a static one, ships React DOM and the RSC client runtime (4 scripts), so the "static pages
download no React" optimisation of the Vite build (spec 003, 004) is gone. The lazy enhancement chunks
for the home page and the services page are fetched only by those pages. There is no ceiling since
constitution 3.0.0; `check-bundle` prints the figure and fails only on a credential (below).
Accepted by the owner on 2026-11-23. If it ever needs to come down, the first lever is making the static documents plain HTML with no
client runtime (a route group that opts out of hydration), which vinext does not offer yet.

## Contact form (US6)

`POST /api/contact/` (`src/app/api/contact/route.ts` calls `src/server/contact.ts`; every outside thing
is injected so the tests run it against fakes and a real SQLite).

1. Same origin (a cross-site `Origin` is 403), form content type only (415), 32 KB cap (413).
2. Honeypot field `website`: a bot that fills it is answered "sent"; nothing is stored or mailed.
3. Name, email, message and service ids are validated against the limits in `src/content/contact.ts` (422).
4. Cloudflare Turnstile is verified server-side with `TURNSTILE_SECRET` and the visitor IP (403 on a
   failed or missing token, 502 when Cloudflare cannot be reached: fail closed).
5. Per-IP limit: 3 accepted submissions an hour, a counter in KV keyed by a keyed hash of the IP
   (HMAC-SHA-256 with the Turnstile secret, truncated); 4th is 429. KV is eventually consistent, so a
   burst from several edge locations can slip one extra through; that is accepted for a contact form.
6. D1 stores the message (`migrations/0001_contact_messages.sql`: id, name, email, services, body, lang,
   ip_hash, created_at, notified_at). Every submission first deletes rows older than 90 days, so retention
   needs no cron. Then Resend mails the owner with `reply_to` set to the visitor; `notified_at` is set
   only when Resend accepted it. A Resend failure still answers "sent" because the message is in D1.
7. Answer: `Accept: application/json` gets `{ ok }` or `{ ok:false, error }`; a plain form post gets a 303
   to `/services/#sent|invalid|spam|rate|failed` (`/pt/services/...` for Portuguese), where `:target` shows
   the line. Without scripting the page says so and points at email, because Turnstile itself needs
   scripting; the form is not rendered at all until the site key exists (`src/content/contact.ts`).

Secrets (`RESEND_API_KEY`, `TURNSTILE_SECRET`, `CONTACT_TO`) are Worker secrets only. Nothing is
`NEXT_PUBLIC_*`. `check-bundle` fails the build if any of those names, a Resend key shape or a GitHub token
shape appears anywhere under `dist/client` (158 files scanned on the last build: none).

Verified on workerd with local D1 and KV (`wrangler dev`, Cloudflare's published always-pass Turnstile
test secret, a fake Resend key): good post 200 `{"ok":true}` and a row in D1 with a 32-character hash and
`notified_at` null (Resend answered 401, as it must with a fake key); invalid 422; no token 403; no-JS form
post 303 to `/pt/services/#sent`; fourth post from one IP 429; GET 405; cross-origin 403. The same
paths run in `src/server/__tests__/contact.test.ts` (15 tests, the migration run by `node:sqlite`).

Privacy policy (FR-015): the `contact-form` section in both languages now names Cloudflare (script,
Turnstile, D1) and Resend, states the 90 days and the keyed hash, and gives the deletion route (write
from the email used, answered within 15 days). `privacy-contact.test.ts` holds the wording and pins
`RETENTION_DAYS` to 90.

## Workers Free limits

Read by the owner on 2026-10-26 (constitution 3.0.0) and not fetched again in this session: 100,000
Worker requests a day, 10 ms CPU a request. Under vinext's static-assets mode the prerendered HTML is an
asset that the Worker reads, so every document request is one Worker request (plain assets would not
count). At this site's traffic that is far below the daily cap; if it ever is not, the lever is the
Workers Paid plan or serving the documents from Pages-style assets. D1 and KV free tiers are far above a
contact form's volume (3 writes an hour per IP).

## Gates

Run on the final tree: `eslint .` (clean), `tsc --noEmit` (clean), `vitest run`, `check-contrast`,
`npm run build`, `parity`. The two failures in `src/__tests__/cv-markdown.test.ts` (`startsWith('---\n')`
against CRLF checkouts) are older than this work and fail on `main` too. CI (`.github/workflows/ci.yml`)
now applies D1 migrations and runs `npm run deploy`; the per-branch preview deployment of FR-014 and the
parity step in CI are not built (they need Cloudflare resources and a stored baseline).

## Open items for the owner

1. Create the Cloudflare resources and put the ids in `wrangler.jsonc`: `wrangler d1 create howzysolutions`,
   `wrangler kv namespace create RATE_LIMIT`, then `wrangler d1 migrations apply howzysolutions --remote`.
2. `wrangler secret put RESEND_API_KEY`, `TURNSTILE_SECRET`, `CONTACT_TO`; verify the sending domain in Resend.
3. Create the Turnstile widget and put its public site key in `src/content/contact.ts` (empty keeps the
   form hidden, by design).
4. The dashboard picture with test figures (`work-1.webp`) was removed on 2026-11-23: the home strip now shows
   three pictures and the other uses point at the live console picture. The LinkedIn URL in the footer is unverified.
5. The constitution's "design direction" line still describes the earlier look; the new home and services
   follow the owner's brief instead. A one-line amendment would close the mismatch.
6. Decided by the owner on 2026-11-23: the 134 KB of JavaScript on every document (static ones included) is
   accepted. There is no ceiling since constitution 3.0.0, and the opt-out work is not planned.
