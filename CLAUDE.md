# howzysolutions

Personal portfolio of Marcos "H0wZy" Junior, live at `howzysolutions.com`.

**`.specify/memory/constitution.md` is the authority.** Where this file and the
constitution disagree, the constitution wins and this file is the one that gets
corrected. Read it before starting a feature.

> This file previously held a pasted UI brief asking for a light-mode toggle,
> hardcoded hex colours, Tailwind from a CDN, Google Fonts, and glassmorphism.
> Every one of those is forbidden by the constitution — Principles II and VI and
> the Typography and Design-direction constraints. It was replaced rather than
> reconciled, under the Governance clause that says a conflicting guidance file
> MUST be corrected.

## What this is

> Constitution 3.0.0 (2026-10-26, the owner's authorization): the Vite stack pin, the
> "no client-side router" rule, the 125 KB JavaScript budget with its gate, the
> "no credential at runtime" rule and the blanket "no third-party SDK" sentence are removed.
> Spec 006 (`specs/006-nextjs-dynamic-site/`) moved the site to Next.js on Cloudflare
> Workers (vinext, with D1 and KV). `plan.md` there records the choice and the measurements.

A Next.js App Router site, prerendered to 42 documents and a 404 and served by a Worker. One optional
catch-all page (`src/app/[[...path]]`) renders `src/views/Document.tsx` for every URL
`src/site.ts` lists, so the URL scheme, the `/pt/` twins and the trailing slashes are the ones
the Vite build had. `npm run parity` proves it: lang, title and visible text per URL.

- **Stack**: Next.js 16 (App Router), React 19, TypeScript strict, Vitest 3, built for Cloudflare
  by vinext (`vite build`). Tailwind 4 over the tokens
  in `src/styles/tokens.css`. shadcn supplies component markup; its variables
  resolve to those tokens and never declare colours of their own.
- **Locales**: English canonical and unprefixed, Brazilian Portuguese under
  `/pt/`. Every visitor-facing string lives in `src/content/i18n/{en,pt}.ts`,
  and a missing translation is a TypeScript error.
- **Theme**: dark, and only dark. An attempt to leave it is met with an
  in-voice refusal, not a half-built second palette.

## The rules that bite

These are the ones a change is most likely to break without noticing.

- **Content is data.** Every project, role, skill and biography fact lives in a
  typed module under `src/content/`. A fact hardcoded into JSX is a defect.
- **No colour literal outside `tokens.css`.** `npm test` runs
  `scripts/check-contrast.mjs`, which verifies 25 token pairs against their WCAG
  floor (the empty-day grid fill is decorative) and follows the shadcn variable mapping.
- **The JavaScript figure is measured, not capped.** No ceiling since constitution 3.0.0, but
  `scripts/check-bundle.mjs` runs at the end of the build and prints the initial JavaScript
  of the lightest and heaviest document, and fails on a credential name or shape anywhere in
  `dist/client`. Record the figure in the spec that changes it (spec 006 plan.md has the
  Vite figures to compare: 8.28 KB for a static document, 120.47 KB for a hydrating one).
  The home page and `/services/` take their motion from `src/enhance/` chunks that only
  they fetch.
- **Nothing a view renders may call `new Date()`.** Pages are prerendered and the client
  hydrates them, so a value derived from the clock disagrees between the two.
  Build-time values come from `src/content/build.generated.json`. A test enforces this
  across `src/views` and `src/components`.
- **The terminal engine imports no React, no renderer and no DOM.**
  `src/terminal/__tests__/purity.test.ts` fails if that changes.
- **No em dash, en dash, ` - ` or ` -- ` in visitor-facing prose.**
  `punctuation.test.ts` walks the dictionaries, the project records and the CV
  record.
- **Fonts are self-hosted.** No third-party font CDN, no analytics, no pixels. One recorded
  exception: Cloudflare Web Analytics, injected at the edge and disclosed in the privacy
  policy (constitution 2.3.0). The site's own HTML loads nothing from another origin.

## Generated artifacts

Committed, and consumed as ordinary content. A failed capture degrades to the
last known good copy; it never empties a page.

| Artifact | Written by | Source |
|---|---|---|
| `wakatime.generated.json` | `scripts/fetch-wakatime.mjs` | WakaTime, build-time credential |
| `github.generated.json` | `scripts/fetch-github.mjs` (pure half: `scripts/github-activity.mjs`) | GitHub GraphQL, build-time `GITHUB_TOKEN` |
| `cv.generated.json` | `scripts/extract-cv.mjs` | `H0wZy/curriculum-vitae`, `overleaf/main.tex` |
| `build.generated.json` | `scripts/stamp-build.mjs` | the build date |

The GitHub artifact feeds the home page's `## github_activity` section: the
rolling year plus every contribution year, each with its calendar, type mix
and monthly timeline. Two things about it are load-bearing:

- **Private repository names never reach it.** The owner's token can list
  private repositories, so every name-bearing list is filtered on `isPrivate`
  and the fetch asserts no private name survived before writing; private work
  is only ever a count and a date range. `github-activity-mapping.test.ts`
  proves it against a fake payload.
- **The calendar total already includes private contributions**, because the
  account shares its private counts. The heading says "contributions", never
  "public", exactly as GitHub's own profile does.
- **Day boundaries follow the token.** GitHub buckets days in the viewer's
  time zone: the owner's token gives UTC-03:00, an anonymous view (and, by
  every sign, the Actions token) gives UTC. Totals agree; on 2026-09-19, 14
  of the rolling year's 371 days differed by a contribution moved to a neighbour. The fetch logs the offset it
  used, and the deployed build matches what a logged-out visitor sees on
  github.com.

Every period ships in the client bundle, and each new year adds about 1 KB gzipped.
If that ever matters, move the non-default years to static JSON under `public/`, fetched
same-origin when a year chip is pressed.

The CV extraction is the one with teeth: **absence degrades, corruption fails.**
No CV checkout means keep the committed artifact and exit 0 — which is the
ordinary case, since the Cloudflare builder has no checkout. A source that is
present but will not parse names the construct and its line and stops the build.

```bash
npm run cv:extract
```

## Working here

```bash
npm run build
```

```bash
npm test
```

```bash
npm run lint
```

All three must pass before a merge.

## Deploy

`wrangler.jsonc` describes one Cloudflare Worker, built by vinext: `npm run build` (data
capture, `tsc`, `vite build`, `check-bundle`) writes `dist/client` (assets) and
`dist/server` (the Worker and its derived `wrangler.json`); `npm run deploy` ships that
build. `public/_headers` sets the security headers and `public/_redirects` keeps working.
`npm run preview` runs the build in workerd with local D1 and KV.

The contact form posts to `src/app/api/contact/route.ts`, which calls
`src/server/contact.ts`: same-origin and size checks, a honeypot, Cloudflare Turnstile
verified server-side, three messages per IP per hour (KV), the message in D1
(`migrations/`, kept 90 days, purged on every submission), then mailed through Resend.
Its three secrets are set once with `wrangler secret put RESEND_API_KEY`,
`TURNSTILE_SECRET` and `CONTACT_TO`, never in a file or a `NEXT_PUBLIC_*` variable;
`CONTACT_FROM` is a plain var and its domain must be verified in Resend. The D1 and KV
ids in `wrangler.jsonc` are the real ones (created 2026-11-23); the table is made by
`wrangler d1 migrations apply howzysolutions --remote`, which CI runs before deploy. The public Turnstile site key goes in
`src/content/contact.ts`; while it is empty the form is not rendered and the page shows
the email routes.

The home page and `/services/` are documents with the palette scoped to `.site` in
`tokens.css`.

Pushing to `main` deploys: `.github/workflows/ci.yml` runs lint and tests, then builds
with fresh GitHub, WakaTime and CV data (it checks out `H0wZy/curriculum-vitae`), applies
the D1 migrations and runs `npm run deploy`. A weekly Monday 06:17 BRT run does the same,
so the activity grid freezes for at most a week.

The privacy policy lives at `/privacy-policy/`, but TikTok Shop's Data
Security and Privacy Review was sent with `/privacy/`. `public/_redirects`
301s the old path (both locales) and `src/__tests__/redirects.test.ts` fails
if it stops pointing at the route. Dropping it breaks an app review. Non-trivial work starts as a spec-kit
feature under `specs/`; commits follow Conventional Commits.
