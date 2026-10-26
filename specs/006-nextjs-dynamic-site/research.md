# Research: Next.js dynamic site

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Read on**: 2026-10-26

Every figure below carries its source (a command run on 2026-10-26, or a URL read on 2026-10-26).
Nothing here is remembered from before this session. Where a thing could not be read, it says so.

## (a) Version pins

Registry: `https://registry.npmjs.org/` through npm 11.16.0 on Node v24.18.1. Dates are the
`time[<version>]` field of `npm view <name> time --json`. "latest" is the `dist-tags.latest` field of
`npm view <name> dist-tags --json`. Only stable releases are listed (FR-002); the beta and canary tags
that exist are named in the notes column so nobody picks them by accident.

| Name | Pinned version | Released | Command | Note |
|---|---|---|---|---|
| next | 16.4.3 | 2026-10-23 | `npm view next dist-tags --json` and `npm view next time --json` | `latest`. `canary`, `beta`, `rc` and `preview` (16.3.0-preview.10) tags exist and are not used. peer `react ^19.0.0`, engines node `>=20.9.0`. |
| react | 19.3.1 | 2026-10-14 | `npm view react dist-tags --json` and `npm view react time --json` | `latest`. `next`, `canary`, `experimental` tags exist and are not used. |
| react-dom | 19.3.1 | 2026-10-14 | `npm view react-dom dist-tags --json` and `npm view react-dom time --json` | Same release as react. |
| react-server-dom-webpack | 19.3.1 | 2026-10-14 | `npm view react-server-dom-webpack time --json` | Required by vinext's peer range `^19.3.1`. |
| tailwindcss | 4.3.3 | 2026-07-16 | `npm view tailwindcss dist-tags --json` and `npm view tailwindcss time --json` | `latest`. |
| @tailwindcss/postcss | 4.3.3 | 2026-07-16 | `npm view @tailwindcss/postcss dist-tags --json` | vinext init writes `postcss.config.mjs` for Tailwind because it does not run Turbopack rules (see (b)). |
| wrangler | 4.152.0 | 2026-10-22 | `npm view wrangler dist-tags --json` and `npm view wrangler time --json` | `latest`. engines node `>=22.0.0` (`npm view wrangler@4.152.0 engines.node`). |
| vinext | 1.3.1 | 2026-10-25 | `npm view vinext dist-tags --json` and `npm view vinext time --json` | `latest`. There is no `@cloudflare/vinext`: `npm view @cloudflare/vinext dist-tags --json` returns `E404 Not Found - GET https://registry.npmjs.org/@cloudflare%2fvinext`. The real name is `vinext`. Peers: `vite ^8.0.0`, `react ^19.3.1`, `react-dom ^19.3.1`, `@vitejs/plugin-rsc ^0.5.37`, `@vitejs/plugin-react ^5.1.4 \|\| ^6.0.0`, `react-server-dom-webpack ^19.3.1`. |
| @vinext/cloudflare | 1.2.1 | 2026-10-25 | `npm view @vinext/cloudflare dist-tags --json` and `npm view @vinext/cloudflare time --json` | `latest`. Peers `cf`, `vinext ^1.3.1` and `@cloudflare/vite-plugin`; `cf` and the plugin are `optional` in `peerDependenciesMeta`. |
| create-vinext-app | 1.1.0 | 2026-10-14 | `npm view create-vinext-app dist-tags --json` and `npm view create-vinext-app time --json` | `latest`. Not used: the app is migrated into a repository that already has content (see plan D2). |
| @cloudflare/vite-plugin | 1.65.0 | 2026-10-23 | `npm view @cloudflare/vite-plugin dist-tags --json` | `latest`. The `beta` tag is 2.0.0-beta.v.4 (2026-10-22) and is NOT used. Peers `vite ^6.1.0 \|\| ^7.0.0 \|\| ^8.0.0`, `wrangler ^4.152.0`. |
| vite | 8.3.5 | 2026-10-21 | `npm view vite dist-tags.latest` and `npm view vite time --json` | Resolved by `vinext init` in the scratch scaffold. |
| @vitejs/plugin-rsc | 0.5.38 | 2026-10-15 | `npm view @vitejs/plugin-rsc time --json` | Resolved by `vinext init`. Pre-1.0: a risk recorded in plan.md. |
| @vitejs/plugin-react | 6.1.2 | 2026-10-05 | `npm view @vitejs/plugin-react time --json` | Resolved by `vinext init`. |
| @opennextjs/cloudflare | 1.20.13 | 2026-10-21 | `npm view @opennextjs/cloudflare dist-tags --json` and `npm view @opennextjs/cloudflare time --json` | `latest`, the fallback adapter. Peers `next >=15.5.28 <16 \|\| >=16.4.1` (16.4.3 satisfies), `wrangler ^4.148.0`. |
| vitest | 5.0.5 | 2026-10-15 | `npm view vitest dist-tags --json` and `npm view vitest time --json` | `latest`. The Vite site uses `^3.2.7`; `V4` tag is 4.1.12. Peer `vite ^6.4.0 \|\| ^7.0.0 \|\| ^8.0.0`, engines node `^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0`. `beta` (5.1.0-beta.1) and `rc` tags exist and are not used. |
| @cloudflare/vitest-pool-workers | 0.23.0 | 2026-10-07 | `npm view @cloudflare/vitest-pool-workers dist-tags time --json` | For tests that need real D1, KV, R2 bindings. Its vitest peer range was NOT read; task T020 reads it before adoption. |
| typescript | 6.0.3 (pinned) | 2026-04-16 | `npm view typescript versions --json` and `npm view typescript time --json` | **`latest` is 7.0.2 (2026-07-08)** and is NOT pinned: `npm view typescript-eslint peerDependencies.typescript` returns `>=4.8.4 <6.1.0` for typescript-eslint 8.72.0 (the `latest`), so TypeScript 7 breaks lint. 6.0.3 is the newest 6.0.x. Revisit when typescript-eslint widens its range. |
| typescript-eslint | 8.72.0 | 2026-10-19 | `npm view typescript-eslint dist-tags --json` and `npm view typescript-eslint time --json` (`"8.72.0": "2026-10-19T17:08:09.147Z"`, read by T001 on 2026-10-26) | `latest`. Peers `eslint ^8.57.0 \|\| ^9.0.0 \|\| ^10.0.0`, `typescript >=4.8.4 <6.1.0`. |
| shadcn | 4.22.1 | 2026-10-18 | `npm view shadcn dist-tags --json` and `npm view shadcn time --json` | `latest`. A CLI, run with `npx shadcn@4.22.1`, never a runtime dependency. engines node `>=20.18.1`. `canary`, `rc` and `beta` tags exist and are not used. |
| jose | 6.2.13 | 2026-10-20 | `npm view jose version` and `npm view jose time --json` | JWT verification for Cloudflare Access (see (e)). |
| marked | 18.1.1 | 2026-10-12 | `npm view marked version` and `npm view marked time --json` | Markdown parser candidate for FR-012. It does not sanitise; see decision R6. |
| sanitize-html | 2.18.1 | not read | `npm view sanitize-html version` | Sanitiser candidate for FR-012. Needs a Workers compatibility spike (task T055). |
| eslint | 10.13.0 | 2026-10-16 | `npm view eslint dist-tags --json` (`latest` 10.13.0; `maintenance` 9.39.5) and `npm view eslint time --json` | Chosen by T001 against `eslint-config-next@16.4.3` (peer `eslint >=9.0.0`, released 2026-10-23) and typescript-eslint 8.72.0 (peer includes `^10.0.0`). `npm install` printed no `ERESOLVE`, so no `--force` and no `--legacy-peer-deps`; the lint run passes. The 9 line was not needed. The Vite site stays on its own `^10.5.0`. |
| node (runtime) | 24 | not read | `node -v` prints `v24.18.1`; `.github/workflows/ci.yml:23` uses `node-version: 24` | Wrangler needs `>=22`. |

Pins T001 added beside the table (all exact in `next/package.json`, no `^` or `~`; resolved by `npm install` on 2026-10-26):
`@eslint/js` 10.0.1 (2026-02-06), `globals` 17.13.0 (2026-10-01), `eslint-config-next` 16.4.3 (2026-10-23),
`@types/node` 24.19.2 (the 24 line, matching the Node 24 runtime of CI), `@types/react` 19.3.0, `@types/react-dom` 19.3.0,
`clsx` 2.1.1 (2024-04-23, the same major as the Vite site), `@fontsource-variable/jetbrains-mono` 5.3.0 (the Vite site's
version), `@tailwindcss/postcss` 4.3.3, `tailwindcss` 4.3.3, `@vitejs/plugin-rsc` 0.5.38, `@vitejs/plugin-react` 6.1.2,
`@cloudflare/vite-plugin` 1.65.0, `@vinext/cloudflare` 1.2.1, `react-server-dom-webpack` 19.3.1. `npm audit` in `next/` reports 9
findings (8 moderate, 1 high), all transitive: `fflate` through `vinext` > `@vercel/og` > `satori`, and `undici` through
`miniflare`. The only fixes npm offers are downgrades (`vinext@0.2.1`, `@cloudflare/vite-plugin@1.12.4`), which break FR-001 and
FR-002, so none was applied; they are runtime-irrelevant for the Worker (the `satori` path is the OG image shim, which
this site does not call) and are recorded here, not hidden.

Raw output that decided the two non-obvious pins:

```text
$ npm view typescript dist-tags --json   (excerpt)
  "latest": "7.0.2"
$ npm view typescript-eslint peerDependencies.typescript
>=4.8.4 <6.1.0
$ npm view @cloudflare/vite-plugin dist-tags --json
{ "latest": "1.65.0", "beta": "2.0.0-beta.v.4" }
$ npm view cf dist-tags --json     (the Cloudflare CLI vinext's default init installs)
{ "latest": "1.0.0-beta.21" }
```

## (b) vinext versus OpenNext (FR-001)

### What was run

Scratch directory: `C:/Users/h0wzy/AppData/Local/Temp/claude/C--Users-h0wzy-projects-vvv/0316f8c5-fecb-4131-b141-78e41f32078c/scratchpad/006-scaffold`.

```bash
npx --yes create-next-app@latest 006-scaffold --ts --tailwind --app --no-src-dir --eslint --import-alias "@/*" --use-npm --disable-git --yes --skip-install
cd 006-scaffold && npm install
npx --yes vinext check
```

`create-next-app` exited 0 and produced `next 16.4.3`, `react 19.3.0` (not 19.3.1: the template pins its own),
`tailwindcss ^4`, `typescript ^5`, `eslint ^9`. `npm install` reported `found 0 vulnerabilities`.

### The check's output, as printed (ANSI colour codes removed)

```text
  vinext check

  Scanning project...

  vinext compatibility report
  ========================================

  Imports: 2/2 fully supported
    ✓  next/font/google (1 file) - self-hosted with fallback metrics; falls back to the Google Fonts CDN when font options aren't statically analyzable or the network fetch fails
    ✓  next/image (1 file) - local images served via /_next/image (resized when an images optimizer is configured); remote images with width and height via @unpic/react, other remote images (fill or dimensionless) as a plain <img>

  Config: 0/2 options supported
    ~  turbopack - resolveAlias and resolveExtensions are honoured; rules (loaders) are ignored
    ~  cacheComponents - experimental support; behavior is incomplete

  Libraries: 1/1 compatible
    ✓  tailwindcss

  Project structure:
    ✓  App Router (app/)
    ✓  1 page(s)
    ✓  1 layout(s)

  ----------------------------------------
  Overall: 88% compatible (6 supported, 2 partial, 0 issues)

  Partial support (may need attention):
    ~  turbopack - resolveAlias and resolveExtensions are honoured; rules (loaders) are ignored
    ~  cacheComponents - experimental support; behavior is incomplete

  Recommended next steps:
    Run vinext init to set up your project automatically
```

(The tool prints a dash after the item names; it is written as a hyphen here to keep this file free of
U+2013 and U+2014. The exit code was 0.)

### What the check does and does not prove

It scanned an empty scaffold: one page, one layout, two imports. It says nothing about the features
this site needs and the scaffold does not use: route handlers with D1/KV/R2 bindings, `proxy.ts`
middleware, `app/[locale]` with `generateStaticParams`, `rewrites`, `trailingSlash`, metadata file routes
(`sitemap.ts`, `robots.ts`), server actions in forms, and Markdown rendering. The README of vinext 1.3.1
(read from `npm pack vinext@1.3.1`, `README.md` lines 605 to 700, 2026-10-26) marks each of these as
supported (lines 639 to 700: route handlers, `middleware.ts` and `proxy.ts`, `trailingSlash`, `rewrites`,
Metadata file routes, `generateStaticParams`, `"use cache"`, server actions). A README is a claim, not a
measurement, so task T012 builds a spike that exercises each one before the choice is final (FR-001
requires the choice and the check's output to be recorded; this file records the first, T012 the second).

### The second finding: vinext's default Cloudflare setup is beta-only

`vinext init` without flags installs `cf` (npm `latest` is `1.0.0-beta.21`, 2026-10-23) and "Cloudflare Vite
plugin v2" (`2.0.0-beta.v.4`), and generates `cloudflare.config.ts` instead of `wrangler.jsonc`
(`README.md` lines 144 to 150: "Cloudflare init uses `cf` and `cloudflare.config.ts` by default. Both
`vinext init` and `create-vinext-app` accept `--legacy-wrangler-cloudflare-init` to retain the legacy
Wrangler setup"). Beta software is forbidden by FR-002, and the switch described in FR-016 is "one change
of `wrangler.jsonc` routes". So the default path is rejected.

The legacy path was run in a copy of the scaffold (`006-vinext-legacy`):

```bash
npx vinext init --platform=cloudflare --legacy-wrangler-cloudflare-init --skip-check --force --cdn-cache=none --data-cache=none --image-optimization=none
npm run build:vinext
```

Without the three cache/image flags it stops with: `Error: vinext init needs Cloudflare cache and image
choices. Ask the user whether they want no cache or which CDN cache (response-store, workers-cache,
static-assets, or data-cache) ... data cache (kv or none), and image optimization (cloudflare-images or
none)`. With them it exits 0 and prints `vinext init complete!`. It added to dependencies `vinext ^1.3.1`,
`react-server-dom-webpack`, `@vinext/cloudflare ^1.2.1`; to devDependencies `vite ^8.3.5`,
`@vitejs/plugin-react ^6.1.2`, `@vitejs/plugin-rsc ^0.5.38`, `@cloudflare/vite-plugin ^1.65.0` (the stable
major), `wrangler ^4.152.0`, `@tailwindcss/postcss`; it generated `vite.config.ts`, `wrangler.jsonc` and
`postcss.config.mjs`. `wrangler.jsonc` has `"main": "vinext/server/fetch-handler"`, `compatibility_flags:
["nodejs_compat"]` and assets with `run_worker_first: ["/*", "!/_next/static/*", "!/*/_next/static/*"]`.

`npm run build:vinext` exited 0: `vite v8.3.5 building client environment for production`, `built in 850ms`,
`Build complete.`, `Route (app) - ? /` ("Some routes could not be classified"). Output: `dist/client`,
`dist/server` with `index.js` (309.96 kB, gzip 97.26 kB) and `wrangler.json`. The stylesheet was 11.40 kB,
gzip 3.16 kB. Warnings seen: `INEFFECTIVE_DYNAMIC_IMPORT` and `SOURCEMAP_BROKEN` (rsc plugin), both
non-fatal. `npm ls` shows one `vite@8.3.5`, one `react@19.3.1` and `next@16.4.3` deduped.

### Comparison

| Criterion | vinext 1.3.1 (legacy Wrangler init) | OpenNext adapter 1.20.13 |
|---|---|---|
| Stable only (FR-002) | Yes with `--legacy-wrangler-cloudflare-init`: wrangler 4.152.0, `@cloudflare/vite-plugin` 1.65.0, `@vinext/cloudflare` 1.2.1. No for the default init (cf and plugin v2 are beta). | Yes: single `latest` tag, 1.20.13. |
| Routes switch is a `wrangler.jsonc` change (FR-016) | Yes on the legacy path. | Yes. |
| Runs the real Next.js server code | No. It reimplements the Next API on Vite (`README.md` lines 1 to 14, "Why"); gaps listed in "Known gaps" (lines 26 to 35): Cache Components partial, no build-time image or font pipeline, native modules in dev, `preferredRegion` ignored. | Yes. It packages Next's own output for Workers. |
| Tooling the owner asked for | Cloudflare's skill says "Use vinext rather than OpenNext for new Next.js projects" (`C:/Users/h0wzy/.claude/plugins/marketplaces/cloudflare/skills/nextjs-on-cloudflare/SKILL.md` line 7, read 2026-10-26). | Preserve existing OpenNext setups; not the default for new work (same file). |
| Scaffold built here | Yes, exit 0 (above). | Not built in this lane; no peer conflict found (`next >=16.4.1` satisfied). |
| Bindings | `import { env } from "cloudflare:workers"` anywhere on the server (`README.md` "Cloudflare Bindings"). | `getCloudflareContext()` from the adapter. |
| Maturity risk | `@vitejs/plugin-rsc` is 0.x (0.5.38); the project's own README lists open gaps. | Older, more used; larger bundle by construction (Next server inside the Worker). |

### Decision R1

FR-001 chooses vinext "unless `npx vinext check` reports a gap the site needs". The check reported no gap
(0 issues; 2 partial items, neither used by this site: `turbopack.rules`, `cacheComponents`). So the
default holds, on the **legacy Wrangler init** because of FR-002 and FR-016, **conditional on the spike
T012 passing**. Resolved 2026-10-26: the spike passed every row (section "The spike (T012)" above), so the default holds and the fallback is not taken. If T012 had found a feature the site needs that vinext lacks, the fallback is
`@opennextjs/cloudflare` 1.20.13 on the same Next.js 16.4.3 sources, and the application code does not
change (route handlers, `app/` tree, content modules); only `vite.config.ts` and the binding accessor do.
Writing bindings behind one module (`next/src/server/env.ts`, plan.md) is what keeps that fallback cheap.

### The spike (T012), run 2026-10-26: verdict per feature

Method: a throwaway app (not in the repository) copied from `next/` into the scratchpad,
`.../scratchpad/spike-006/`, with the same `vite.config.ts`, pins and Wrangler 4.152.0. Built with `vite build`
(exit 0), served with `npx wrangler dev --config dist/server/wrangler.json --port 8791 --persist-to .wr`, every row
requested with `curl`. D1, KV and R2 were Wrangler's local simulations with placeholder ids (nothing remote). Nothing was
deployed and no Cloudflare resource was created.

| Feature the site needs | Verdict | Evidence (what was printed) |
|---|---|---|
| Route handler reading D1, KV and R2 through `import { env } from "cloudflare:workers"` | PASS | `GET /api/bindings/` returned `{"d1":{"one":1},"kv":"v","r2":"hello-r2",...}`. A server component with `export const dynamic = "force-dynamic"` read D1 and rendered `dyn answer=<!-- -->42`. |
| `proxy.ts` with a matcher | PASS | The file lives at `src/proxy.ts` (`export function proxy`, `config.matcher`). `/admin/` and `/api/bindings/` answered with the header `x-spike-proxy` set by it; the other paths did not get it. |
| `app/[locale]` with `generateStaticParams` | PASS to render, NOT prerendered by default | `/` and `/about/` gave `<html lang="en">`, `/pt/` gave `<html lang="pt">`. The build route table prints every page as `ƒ Dynamic`, `dist/client` holds no HTML, and pages answer `Cache-Control: no-store, must-revalidate` with `X-Vinext-Cache: MISS`: every request renders in the Worker. See the next section. |
| `rewrites()` plus `trailingSlash: true` | PASS | `beforeFiles` rewrites `/` to `/en/` and `/:path((?!pt\|en\|api\|admin\|_next\|sitemap\\.xml).+)` to `/en/:path` served the English tree at unprefixed paths (`/about/` 200, `lang="en"`); `/pt/about/` 200. `/about` answered `308` with `Location: /about/`. |
| Redirect `/en/...` to the unprefixed form | PASS only through `proxy.ts` | `redirects()` with `/en/:path*` to `/:path*` answered `308 Location: /about` (slash dropped) and so needed a second hop; with destination `/:path*/` it answered `Location: /about//`. A redirect written in `proxy.ts` (`NextResponse.redirect(url, 308)`, matcher `/en` and `/en/:path*`) answered `308 /about/` for `/en/about/`, `308 /` for `/en/`, `308 /pt/` for `/en/pt/` in one hop. `/en` itself goes `/en/` then `/`. The 30 legacy redirects (T022) must be tested against this slash behaviour. |
| `app/sitemap.xml/route.ts` | PASS | `200`, `Content-Type: application/xml; charset=utf-8`; `od -c` of the body shows the file's bytes, ending in `</urlset>\n`, unchanged. Default `Cache-Control: s-maxage=31536000, stale-while-revalidate` for a `force-static` handler. |
| Form server action | PASS, without JavaScript | The rendered `<form>` carries `<input type="hidden" name="$ACTION_ID_edf734547724#submit"/>`. A `curl -F msg=from-curl -F '$ACTION_ID_...='` POST to `/about/` (a rewritten URL) returned `200` and the Worker log printed `ACTION_RAN from-curl`. |
| `worker.ts` wrapping `vinext/server/fetch-handler` and exporting `scheduled` | PASS | `wrangler.jsonc` `"main": "worker.ts"` with `import handler from "vinext/server/fetch-handler"; export default { fetch: handler.fetch, async scheduled(...) {...} }` built (exit 0) and served. `POST /cdn-cgi/handler/scheduled?cron=*/5+*+*+*+*` returned `200` and the log printed `SCHEDULED_FIRED */5 * * * * object` (the `env.DB` binding was present). `triggers.crons` is read from `wrangler.jsonc`. So the second cron Worker named in plan D4 is not needed. |
| Unknown path is 404, never 200 | PASS | `/nonexistent/`, `/pt/nonexistent/` and `/nonexistent/deep/path/` all `404` with the body of `app/not-found.tsx`. That file must render its own `<html>` because `[locale]/layout.tsx` is the root layout and has no locale to read. |
| Local secrets (T006) | PASS | See below. |

Extra findings that change later tasks:

1. **No prerender by default, and no static-asset serving of pages.** `vinext init` with `--cdn-cache=none` leaves every page
   dynamic. The README (lines 768 and 807) names the way to prerender: `vinext({ prerender: true, cache: { cdn:
   staticAssetsAdapter() } })` from `@vinext/cloudflare/cache/static-assets-adapter`. Built once in the spike with that
   config it printed `Prerendered 3 routes (3 skipped, 4 errors)` and wrote hashed files such as
   `dist/client/_vinext/static-cache/509cf1c2....html`: the HTML is not at the URL path, and the adapter reads it back through
   the `ASSETS` binding, so the Worker still runs for every request and still counts against the 100,000 per day. The 4 errors were
   the routes that read a binding (`Cloudflare bindings are unavailable during build-time prerendering`), as expected. Not
   tested at runtime. Input for T013 (D5) and T016.
2. **JavaScript on a page with no client component.** `GET /pt/`, a server component that prints one line, links three `<script
   src>` chunks and two `modulepreload` links: 219,274 B (67,643 gzip), 121,416 B (35,915 gzip) and 126,803 B (37,962 gzip) plus
   three of about 0.5 to 1.2 KB, about 142 KB gzipped in all, against 8.28 KB for a static document on the Vite site. The
   "static, no JS" rows of routes.md cannot be kept as they are. Input for SC-004 and T027.
3. **`vinext init` writes a bare `cloudflare()` plugin when `app/` does not exist yet.** With it the build adds a third
   environment named after the Worker and fails with `Rolldown failed to resolve import "virtual:vite-rsc/encryption-key"`.
   The fix, now in `next/vite.config.ts`, is `cloudflare({ viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] } })`,
   which is what the scaffold in (b) had.
4. **PostCSS path.** Tailwind runs through `@tailwindcss/postcss` here, so `globals.css` must put `@layer ...;` first and keep every
   `@import` consecutive, and a CSS `@import` of `@fontsource-variable/jetbrains-mono/index.css` loses the base of its
   `url(./files/...)` (the build prints `didn't resolve at build time`). The font is imported from `layout.tsx` instead, which
   emits the six `woff2` files into `_next/static/media`.

**Verdict.** Every feature the site needs works under vinext 1.3.1 on the legacy Wrangler init. Decision R1 stands and the
OpenNext fallback is not taken; `@opennextjs/cloudflare` stays recorded as the fallback only. Caveats 1 and 2 are open
risks, not reasons to switch adapter (OpenNext would not remove either).

### Local secrets under the Vite plugin path (T006)

- The filename is `.dev.vars` in the directory of `wrangler.jsonc` (`next/`). During `vite build` the Cloudflare plugin printed
  `Using secrets defined in .dev.vars`, and wrote a copy to `dist/server/.dev.vars` (values single-quoted).
- `npx wrangler dev --config dist/server/wrangler.json` then served `secretFromDevVars: "local-dev-only"` and
  `environment: "development"` from `env`, so `quickstart.md` section 2 is right, with one addition recorded there.
- Consequence: `dist/server/.dev.vars` holds whatever `next/.dev.vars` held at build time. `next/dist/` is gitignored, and the value
  appears nowhere else in `dist/` (`grep -rl local-dev-only dist` lists only that file). The `check-secrets` gate (T028) must treat that
  file as expected-local and fail the CI build if it exists there (CI has no `.dev.vars`).

## (c) Workers Free limits

All from `developers.cloudflare.com`, fetched as `https://developers.cloudflare.com/<path>/index.md` on 2026-10-26.

| Resource | Free limit | Source (page, "last updated" as printed) |
|---|---|---|
| Worker requests | 100,000 per day, resets at 00:00 UTC; over it, Error 1027 | `/workers/platform/limits/` ("Last updated Oct 12, 2026"), section Daily requests; `/workers/platform/pricing/` ("Oct 2, 2026") table row Free |
| Static asset requests | free and unlimited ("Requests to static assets are free and unlimited") | `/workers/platform/pricing/` footnote 3 |
| CPU time | 10 ms per invocation | `/workers/platform/limits/` account plan table; `/workers/platform/pricing/` |
| Subrequests | 50 per request (1,000 to internal services) | `/workers/platform/limits/` |
| Memory | 128 MB | same |
| Worker size | 64 MiB | same |
| Worker startup time | 1 second | same |
| Static asset files per version | 20,000; single file 25 MiB | same |
| D1 rows read | 5 million per day | `/d1/platform/pricing/` ("Apr 21, 2026"), table |
| D1 rows written | 100,000 per day | same |
| D1 storage | 5 GB total per account; 10 databases; 500 MB per database | `/d1/platform/pricing/` and `/d1/platform/limits/` ("dateModified 2026-10-24") |
| D1 bound parameters | 100 per query; SQL statement 100,000 bytes; query duration 30 s | `/d1/platform/limits/` |
| D1 write cost of indexes | each indexed write adds one written row | `/d1/platform/pricing/` note 6 |
| KV keys read | 100,000 per day | `/kv/platform/pricing/` ("Apr 21, 2026") |
| KV keys written | **1,000 per day**; deleted 1,000; list 1,000 | same |
| KV stored data | 1 GB; value size 25 MiB; key size 512 bytes | `/kv/platform/pricing/`, `/kv/platform/limits/` |
| R2 storage | 10 GB-month free | `/r2/pricing/` ("Oct 1, 2026"), Free tier table |
| R2 operations | Class A 1 million per month; Class B 10 million per month; egress free | same |
| Queues | 10,000 operations per day; 24 hour retention | `/queues/platform/pricing/` |
| Rate Limiting binding | `period` must be 10 or 60 seconds; count is per Cloudflare location and approximate | `/workers/runtime-apis/bindings/rate-limit/` |
| Turnstile | Free plan: unlimited challenges, up to 20 widgets | `/turnstile/plans/` |
| Workers Paid | US$5 per month in the spec's assumption; not re-read here | spec.md Assumptions |
| Access free for up to 50 users | stated by the spec (read 2026-10-26 by the spec's author); **not re-verified in this lane**: the cloudflare.com plans page fetched did not print the figure, and `/cloudflare-one/pricing-and-plans/` returned 404. Task T005 [MANUAL] confirms it in the dashboard. | spec.md Assumptions |

Consequences that change the design (each is used in plan.md and data-model.md):

1. **KV is a bad rate-limit counter on Free.** 1,000 writes per day is shared with everything. The spec's
   FR-008 allows "a KV counter"; this plan does not use one (decision R3).
2. **The Rate Limiting binding cannot express "5 comments in 10 minutes".** Its period is 10 or 60 seconds
   only. It is used as a per-minute burst brake; the spec's windows (5 per 10 minutes, 3 per hour) are
   counted from D1 rows with an index, which costs reads, not extra writes.
3. **10 ms CPU on Free is the risk for every dynamic route.** Server-rendering React on Workers can exceed
   it. Static documents must be served as static assets (free, unlimited), and dynamic routes need a
   measured CPU figure before the switch (SC-006, task T016 and T100).
4. **D1 Free caps at 500 MB per database.** Images go to R2, never to D1.
5. **`run_worker_first: ["/*", ...]` (vinext's generated config) sends every request through the Worker**,
   so all of them count against the 100,000 per day. Task T013 tests narrowing it so prerendered static
   documents are answered by Static Assets directly.

## (d) Resend free tier

Source: `https://resend.com/pricing`, fetched 2026-10-26 (HTML, 534,823 bytes), text read with markup
stripped.

| Item | Free plan, as printed |
|---|---|
| Price | `$0 / mo` |
| Emails | `3,000 emails / mo` and `100 emails a day` (transactional quota) |
| Domains | `3 domains` |
| Inboxes | `3 inboxes` |
| Data retention | `30-day data retention` |
| Pro | `$20 / mo`, 50,000 emails, no daily limit (for comparison) |
| Broadcasts | The FAQ prints: "Broadcast emails can only be sent to existing contacts"; "marketing plans are not limited by the number of emails you can send, but only by the number of contacts you have"; "Do broadcast emails count against the transactional email limits? No." |
| API rate | "The API rate limit (requests per second) is set per team and is the same on every plan"; the Batch Email API "sends up to 100 emails in one request". |
| Newsletter by API | "A newsletter can be sent through the /emails API ... or through the /broadcasts API"; broadcasts "handle the unsubscribe link for you when your message includes the `{{{RESEND_UNSUBSCRIBE_URL}}}` placeholder"; emails through /emails "need your own visible unsubscribe link". |

**Not read:** the free marketing plan's contact ceiling. The pricing page toggles between
"Transactional emails" and "Marketing emails" with a slider, and the text captured shows only the
transactional tiers. Task T071 [MANUAL] reads it in the owner's dashboard before User Story 4 ships. The
spec's "100/day as of the last reading" is confirmed for transactional; the design (decision R4) keeps the
confirmation email and the contact notification on `/emails` (well inside 100 per day) and the weekly send
on `/broadcasts`, because a list above 100 addresses sent through `/emails` would break the daily cap.

Endpoints used (from `https://resend.com/docs/api-reference/<page>.md`, fetched 2026-10-26):

| Purpose | Request |
|---|---|
| Send one email | `POST https://api.resend.com/emails` |
| Create broadcast | `POST https://api.resend.com/broadcasts`, body `segment_id`, `from`, `subject`, `html`, optional `text`, `name`, `reply_to` ("Audiences are now called Segments") |
| Send broadcast | `POST https://api.resend.com/broadcasts/{id}/send`, optional `scheduled_at` |
| Create contact | `POST https://api.resend.com/contacts` (page `api-reference/contacts/create-contact`) |

## (e) Cloudflare Access: verifying `Cf-Access-Jwt-Assertion`

Source: `https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/`
(fetched 2026-10-26; page lines 17 to 228).

- Access adds the header `Cf-Access-Jwt-Assertion` to requests that reach the origin; the application must
  validate it, because a request that bypasses Access would not carry a valid one.
- Public keys: `https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/certs`. It serves JSON with
  `keys` (JWKS), `public_cert` and `public_certs`; two keys exist at a time (current and rotated-out).
  Select the key by the token's `kid`, never from `public_cert` (the page warns the latter can be stale).
- Claims to check: `iss` equals `https://<your-team-name>.cloudflareaccess.com`; `aud` contains the
  application's AUD tag (dashboard, Access application, Additional settings, "Application Audience (AUD)
  Tag"; it never changes unless the application is deleted and recreated); expiry.
- Worker pattern in the page, with `jose`:
  `createRemoteJWKSet(new URL(\`${env.TEAM_DOMAIN}/cdn-cgi/access/certs\`))` then
  `jwtVerify(token, JWKS, { issuer: env.TEAM_DOMAIN, audience: env.POLICY_AUD })`, reading the header
  `cf-access-jwt-assertion`. `TEAM_DOMAIN` is the full `https://...cloudflareaccess.com` origin and
  `POLICY_AUD` the AUD tag; both are Worker variables, not secrets (neither is sensitive), kept out of
  `NEXT_PUBLIC_*`.
- Decision R2: the check lives in `proxy.ts` (matcher `/admin/:path*` and `/api/admin/:path*`) and again in
  every admin route handler and server action through one function (`next/src/server/access.ts`). Defence
  in depth: FR-006 says admin routes MUST require authentication, and a middleware matcher typo must not
  open them. The owner's identity (`email` claim) is compared with an allow-list variable `ADMIN_EMAIL`.
- Local development has no Access: `wrangler dev` accepts a header `x-dev-admin: <ADMIN_DEV_TOKEN>` only
  when `ENVIRONMENT=development`. It is a Worker variable absent in production (test: production build
  rejects it).

## (f) Turnstile siteverify

Source: `https://developers.cloudflare.com/turnstile/get-started/server-side-validation/` ("Last updated
Oct 22, 2026"), fetched 2026-10-26.

- `POST https://challenges.cloudflare.com/turnstile/v0/siteverify`, accepts `application/x-www-form-urlencoded`
  and `application/json`, always answers JSON.
- Fields: `secret` (required), `response` (required, the token from the widget; the form field is
  `cf-turnstile-response`), `remoteip` (optional), `idempotency_key` (optional UUID for safe retries).
- A token is valid for 300 seconds and is single-use; a replay is rejected with the error code
  `timeout-or-duplicate`.
- The answer has `success` (boolean) and `error-codes`. A server must treat a network failure to siteverify
  as a refusal (fail closed) and say so to the visitor.
- Plan: the secret is a Worker secret `TURNSTILE_SECRET`; the site key is public and is the only
  Turnstile value allowed in client code (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, the one `NEXT_PUBLIC_*`
  exception, and a site key is not a credential). The CI grep of SC-005 whitelists exactly that name.
- The widget loads a script from `challenges.cloudflare.com`; the privacy policy names it (constitution
  3.0.0, Privacy), and the CSP in `_headers` allows that origin only on the three form pages.

## Decisions taken in this research

| ID | Decision | Reason |
|---|---|---|
| R1 | vinext 1.3.1 on the legacy Wrangler init; OpenNext 1.20.13 is the fallback; spike T012 decides. | (b) above. |
| R2 | Access JWT verified with `jose` 6.2.13 in `proxy.ts` and again in each admin handler. | (e) above; FR-006. |
| R3 | No KV rate-limit counters. Burst brake: Rate Limiting binding (60 s). Spec windows: indexed D1 counts. | (c) consequences 1 and 2. |
| R4 | Confirmation and contact emails through `/emails`; the weekly post through `/broadcasts` to a Resend segment kept in step with D1 subscribers. | (d): 100 per day. |
| R5 | TypeScript 6.0.3, not 7.0.2. | typescript-eslint peer `<6.1.0`. |
| R6 | Markdown: `marked` 18.1.1 to HTML, then an allow-list sanitiser, with a test corpus of hostile inputs. The library for the sanitiser is chosen in T055 after a Workers compatibility check; the render is server-side only. | FR-012; `marked` does not sanitise. |
| R7 | The sitemap, not the spec text, defines the 40 documents. | See contracts/routes.md "Corrections to the spec". |

## Open items this research could not close

1. ~~Release date of typescript-eslint 8.72.0, eslint pin: T001.~~ Closed 2026-10-26 by T001: 2026-10-19 and eslint 10.13.0 (table (a)).
2. Whether `@cloudflare/vitest-pool-workers` 0.23.0 supports vitest 5.0.5: T020.
3. Access Free 50-user figure and Resend free marketing contact ceiling: T005, T071 [MANUAL].
4. Whether Static Assets can answer prerendered pages without the Worker under vinext: T013.
5. CPU milliseconds per dynamic route against the 10 ms Free limit: T016, T100.
