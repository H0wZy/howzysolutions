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

A static site, prerendered to 26 real documents and hydrated on the client.
There is no client-side router: every route is a file, and navigation is a link.

- **Stack**: React 19, TypeScript, Vite 8, Vitest 3. Tailwind 4 over the tokens
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
- **The JavaScript budget is a gate.** `scripts/check-bundle.mjs` fails the
  build above 120 KB gzipped. Last measured 118.38 KB (2026-09-19, with the
  GitHub activity section), so there is under 2 KB of headroom: check before
  adding anything, not after. Each new contribution year adds about 1 KB (see
  the GitHub artifact below).
- **Nothing under `App` may call `new Date()` during render.** The site
  hydrates, so a value derived from the clock disagrees between prerender and
  the browser. Build-time values come from `src/content/build.generated.json`.
  A test enforces this across `src/pages` and `src/components`.
- **The terminal engine imports no React, no renderer and no DOM.**
  `src/terminal/__tests__/purity.test.ts` fails if that changes.
- **No em dash, en dash, ` - ` or ` -- ` in visitor-facing prose.**
  `punctuation.test.ts` walks the dictionaries, the project records and the CV
  record.
- **Fonts are self-hosted.** No third-party font CDN, no analytics, no pixels.

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

Every period ships in the entry chunk, and each new year adds about 1 KB
gzipped. When the bundle gate gets close, move the non-default years to
static JSON under `public/`, fetched same-origin when a year chip is pressed,
rather than raising the budget. A dynamic `import()` does not help:
`check-bundle.mjs` sums every `.js` in `dist/assets`, lazy chunks included.

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

`wrangler.jsonc` publishes `dist/` as an assets-only Cloudflare Worker (no
script) on `howzysolutions.com`. `public/_headers` sets the security headers
and the long cache on `/assets/*`.

Pushing to `main` deploys: `.github/workflows/ci.yml` runs lint and tests,
then builds with fresh GitHub, WakaTime and CV data (it checks out
`H0wZy/curriculum-vitae`) and runs `wrangler deploy`. A daily 06:00 BRT run
does the same, so the activity grid never freezes on the last commit. By hand:

```bash
npm run build && npx wrangler deploy
```

The privacy policy lives at `/privacy-policy/`, but TikTok Shop's Data
Security and Privacy Review was sent with `/privacy/`. `public/_redirects`
301s the old path (both locales) and `src/__tests__/redirects.test.ts` fails
if it stops pointing at the route. Dropping it breaks an app review. Non-trivial work starts as a spec-kit
feature under `specs/`; commits follow Conventional Commits.
