# Contract: routes

**Feature**: [spec.md](../spec.md) | **Date**: 2026-10-26

Source of the parity list: `public/sitemap.xml` of this branch (commit a8a4f6c), read on 2026-10-26 with
`grep -o "<loc>[^<]*" public/sitemap.xml`. It has 40 `<loc>` entries: 20 English and 20 Portuguese, and no
`<lastmod>`. Page kinds come from `src/route.ts` (the `Route` union at lines 13 to 25 and `STATIC_PAGES` at
line 105).

## Corrections to the spec

The spec's User Story 1 names `/terms/`, `/works/<id>/` and "the 40 documents". The sitemap is the
authority (FR-003: "The 40 documents of today's `sitemap.xml`"), and differs from the prose:

| Spec prose | Real route (sitemap) |
|---|---|
| `/terms/` | `/terms-of-service/` |
| not listed | `/privacy-policy/vvv/`, `/terms-of-service/vvv/` (per-app legal pages) |
| not listed | `/vvv/live/` |
| not listed | `/works/2/` (page 2 of the works index; `pagination.test.ts` covers it) |

All four correct the prose; none changes the count of 40.

Rendering vocabulary used below:

- **static**: prerendered at build to HTML (`generateStaticParams` over the route table), no Worker CPU if
  Static Assets can serve it (task T013 decides; if not, the Worker serves the stored HTML).
- **static, no JS**: static, and the document loads no framework script (the `STATIC_PAGES` set today: 8.28 KB
  gzipped, constitution 2.2.0). The Next build must keep these free of hydration, or record the cost (SC-004).
- **static + islands**: static HTML with client components only where there is interaction (FR-004).
- **dynamic**: rendered per request (reads D1, KV or R2).

Auth for every parity route is **none**.

## 1. Parity: the 40 documents

`en` is canonical and unprefixed; `pt` is under `/pt/` (constitution Principle V). `<html lang>` is the locale code, `en` or
`pt` (`src/entry-server.tsx` lines 54 to 62, `scripts/prerender.mjs` lines 72 and 201); the parity script compares the value rather than this file.

| # | Route (en) | Route (pt) | Page kind (`Route`) | Rendering | Notes |
|---|---|---|---|---|---|
| 1 | `/` | `/pt/` | `home` | static + islands | Terminal, typewriter, GitHub activity grid, stats. Becomes ISR-like (`revalidate = 3600`) in the metrics slice (FR-011); before that it is fully static. |
| 2 | `/cv/` | `/pt/cv/` | `cv` | static + islands | Generated from `cv.generated.json`. |
| 3 | `/privacy-policy/` | `/pt/privacy-policy/` | `privacy` | static, no JS | Edited in the same change as each feature that stores personal data (FR-015). |
| 4 | `/terms-of-service/` | `/pt/terms-of-service/` | `terms` | static, no JS | |
| 5 | `/privacy-policy/vvv/` | `/pt/privacy-policy/vvv/` | `legalApp` (privacy, id `vvv`) | static, no JS | Linked from a TikTok app registration. Do not move. |
| 6 | `/terms-of-service/vvv/` | `/pt/terms-of-service/vvv/` | `legalApp` (terms, id `vvv`) | static, no JS | Same. |
| 7 | `/mcp/` | `/pt/mcp/` | `mcp` | static + islands | Copy buttons are the island. |
| 8 | `/vvv/` | `/pt/vvv/` | `vvv` | static, no JS | Showcase; images under `/vvv/*.webp`. |
| 9 | `/vvv/live/` | `/pt/vvv/live/` | `vvvLive` | static, no JS | Images under `/vvv/live/*.webp`. |
| 10 | `/works/` | `/pt/works/` | `workIndex` (number 1) | static + islands | |
| 11 | `/works/2/` | `/pt/works/2/` | `workIndex` (number 2) | static + islands | `generateStaticParams` from the project count. |
| 12 | `/works/mcp/` | `/pt/works/mcp/` | `work` (id `mcp`) | static + islands | |
| 13 | `/works/telasparana/` | `/pt/works/telasparana/` | `work` | static + islands | |
| 14 | `/works/selzler-construtora/` | `/pt/works/selzler-construtora/` | `work` | static + islands | |
| 15 | `/works/generative-ai-e2/` | `/pt/works/generative-ai-e2/` | `work` | static + islands | |
| 16 | `/works/vvv/` | `/pt/works/vvv/` | `work` | static + islands | |
| 17 | `/works/studiobiasantos/` | `/pt/works/studiobiasantos/` | `work` | static + islands | |
| 18 | `/works/howzysolutions/` | `/pt/works/howzysolutions/` | `work` | static + islands | |
| 19 | `/works/terminal/` | `/pt/works/terminal/` | `work` | static + islands | |
| 20 | `/works/authsys/` | `/pt/works/authsys/` | `work` | static + islands | |

20 rows times 2 locales is 40. The set of `work` ids is not typed here by hand in the build: `generateStaticParams`
reads `src/content/projects/index.ts` (Principle I), and the parity script reads the sitemap, so a project
added later appears in both or the diff fails.

Trailing slash: every URL above ends in `/`. `next.config.ts` sets `trailingSlash: true`, and a request
without the slash answers 308 to the slashed form (vinext README line 655: "`trailingSlash` 308 redirects
to canonical form"). The Vite site answers 307 for `/cv` through `html_handling: "auto-trailing-slash"`
(`wrangler.jsonc` lines 8 to 10). 307 versus 308 is a difference the parity script does not compare; task
T022 records it as an accepted difference or matches it.

Unknown paths: 404 with a plain body, status 404, never the home page with 200 (`wrangler.jsonc` lines
11 to 14). Next's `not-found.tsx` must keep that status.

## 2. Parity: files and non-HTML URLs that must keep working

Read from `public/` and `public/_headers` on 2026-10-26.

| URL | Kind | Content-Type and headers today | Next implementation |
|---|---|---|---|
| `/sitemap.xml` | generated | XML | route handler `app/sitemap.xml/route.ts` writing the same XML (with `xhtml:link` alternates) from the route table. A metadata `sitemap.ts` is not used: it cannot guarantee byte equality. |
| `/robots.txt` | static | text | `public/robots.txt`, unchanged: `User-agent: *`, `Allow: /`, `Sitemap: https://howzysolutions.com/sitemap.xml`. `/admin/` and `/api/` are added when the admin ships (plan phase 2), with the test updated in the same change. |
| `/mcp.md`, `/pt/mcp.md` | generated | `text/markdown; charset=utf-8`, `Access-Control-Allow-Origin: *` | static files from `scripts/generate-mcp-markdown.mjs` |
| `/cv.md/eng`, `/cv.md/ptbr` | generated | same markdown headers | static files (no extension, so `Content-Type` is set by `next.config.ts` `headers()`) |
| `/cv.pdf/eng`, `/cv.pdf/ptbr` | static | `application/pdf`, `Content-Disposition: inline; filename="ENG_CV_Marcos_Junior_Bueno_Selzler.pdf"` and the `PTBR_` twin | static files plus `headers()` |
| `/cv/ENG_CV_Marcos_Junior_Bueno_Selzler.pdf`, `/cv/PTBR_CV_Marcos_Junior_Bueno_Selzler.pdf` | static | PDF | `public/cv/` |
| `/favicon.svg`, `/favicon-32.png`, `/apple-touch-icon.png`, `/icons.svg` | static | image | `public/` |
| `/brand/*` (avatar, mark, social card, `icons/`) | static | image | `public/brand/` |
| `/vvv/hero.webp`, `/vvv/lanes.webp`, `/vvv/rule.webp`, `/vvv/live/*.webp`, `/vvv/mythic/*` | static | image | `public/vvv/` |
| `/assets/*` (Vite hashed bundles) | static | `Cache-Control: public, max-age=31536000, immutable` | replaced by `/_next/static/*`, which vinext hashes (`README.md` line 235: hash-only file names). Nothing links to `/assets/*` from outside, so no redirect. |

Security headers today (`public/_headers`): `X-Content-Type-Options: nosniff`, `Referrer-Policy:
strict-origin-when-cross-origin`, `X-Frame-Options: DENY` on `/*`. The `_headers` file only applies to Static
Assets responses; a response produced by the Worker needs the same headers from `next.config.ts` `headers()`
(task T023). A test fetches one asset URL and one dynamic URL and compares the three headers.

## 3. Parity: redirects that must keep working

`public/_redirects` has 30 rules (counted with `grep -c "^/"`). `src/__tests__/redirects.test.ts` guards them
today. They move to `next.config.ts` `redirects()` with `permanent: true` (308 in Next, where Cloudflare
`_redirects` gives 301) and the test is ported (task T022). Status 301 versus 308: both are permanent and
both preserve the target for a browser; a TikTok review crawler follows either. Recorded as an accepted
difference unless the owner wants 301 kept, in which case a route handler or `proxy.ts` issues
`NextResponse.redirect(url, 301)`.

| Group | Pattern | Target |
|---|---|---|
| Old privacy path | `/privacy`, `/privacy/`, `/pt/privacy`, `/pt/privacy/` | `/privacy-policy/` (and `/pt/`) |
| App renamed (terms) | `/terms-of-service/viralvideogen[/]`, `/pt/...` | `/terms-of-service/vvv/` |
| App renamed (privacy) | `/privacy-policy/viralvideogen[/]`, `/pt/...` | `/privacy-policy/vvv/` |
| App renamed (work) | `/works/viralvideogen[/]`, `/pt/...` | `/works/vvv/` |
| Old work route | `/work`, `/work/`, `/work/*` | `/works/`, `/works/:splat` |

## 4. New routes (FR-003)

Rendering and auth for each. "Access" means the request must carry a valid `Cf-Access-Jwt-Assertion`
(research.md (e)) and the `email` claim must equal `ADMIN_EMAIL`. A `pt` twin exists where the page is public.

| Route | pt twin | Rendering | Auth | Slice |
|---|---|---|---|---|
| `/devlog/` | `/pt/devlog/` | dynamic (D1, `idx_posts_public`), cached at the edge for 60 s | none | 2 |
| `/devlog/<slug>/` | `/pt/devlog/<slug>/` | dynamic; when the locale has no published row but the twin does, a page saying so with a link across (status 200, `noindex`) | none | 2 |
| `/devlog/feed.xml` | `/pt/devlog/feed.xml` | dynamic, `application/rss+xml; charset=utf-8` (RSS 2.0), 20 newest | none | 2 |
| `/sitemap.xml` | n/a | dynamic once posts exist: the 40 static entries plus published posts | none | 2 |
| `/media/<key...>` | n/a | dynamic, streams R2 object `MEDIA`, `ETag`, `Cache-Control: public, max-age=31536000, immutable` (keys are unique per upload) | none | 2 |
| `/contact/` | `/pt/contact/` | static page, form posts to `/api/contact` | none | 3 |
| `/contact/sent/` | `/pt/contact/sent/` | static confirmation page (works without JavaScript) | none | 3 |
| `/newsletter/confirm/<token>` | `/pt/newsletter/confirm/<token>` | dynamic: GET shows a one-button form, POST confirms | none (the token is the credential) | 3 |
| `/newsletter/unsubscribe/<token>` | `/pt/newsletter/unsubscribe/<token>` | dynamic: GET removes and shows the result; POST is the RFC 8058 one-click | none (the token) | 3 |
| `/admin/` | n/a | dynamic, redirects to `/admin/devlog` | Access | 2 |
| `/admin/devlog`, `/admin/devlog/new`, `/admin/devlog/<id>` | n/a | dynamic, client editor island | Access | 2 |
| `/admin/comments` | n/a | dynamic | Access | 4 |
| `/admin/subscribers`, `/admin/messages` | n/a | dynamic | Access | 3 |
| `/api/...` | n/a | route handlers, see [api.md](./api.md) | per endpoint | 2 to 5 |

`robots` for `/admin/*`, `/api/*`: `Disallow`, plus `X-Robots-Tag: noindex` on every admin and token page
(the confirm and unsubscribe pages must not be indexed).

Locale handling: unprefixed paths are English. `app/[locale]/` holds the pages with `generateStaticParams`
returning `en` and `pt`; `next.config.ts` `rewrites()` maps unprefixed paths to `/en/...` internally, and a
request for `/en/...` is redirected to the unprefixed form so no duplicate URL exists. Whether vinext honours
`rewrites()` with `trailingSlash` this way is part of spike T012.

## 5. Parity gate (what the script compares)

`next/scripts/parity-diff.mjs` (task T014), given two base URLs (the Vite preview and the Next preview),
requests each of the 40 sitemap URLs from both and compares:

1. HTTP status (both 200).
2. `<html lang>` value.
3. `<title>` text.
4. The visible text: the response HTML with `script`, `style`, `template` and `noscript` removed, tags
   stripped, entities decoded, whitespace collapsed to single spaces and trimmed; compared as strings.
5. `<link rel="canonical">`, `hreflang` alternates and `meta name="description"`.
6. With scripting disabled (the HTML is fetched, never executed), so what is compared is what is in the
   first response (spec US1 scenario 2).

It also compares `sitemap.xml` and `robots.txt` byte for byte. A difference prints the URL and the first
differing 80 characters on each side, and the script exits 1. Allowed, explicit differences live in
`next/scripts/parity-allow.json` with a reason each; an empty file is the goal and SC-001.
