# howzysolutions

Marcos "H0wZy" Junior's portfolio. A statically prerendered React + TypeScript site: every route
ships as real, already-rendered HTML, in both English and Brazilian Portuguese. `src/main.ts` only
adds small progressive enhancements (reveal-on-scroll, theme control, terminal mount) on top of
markup that already works with JavaScript disabled. See `specs/002-portfolio-craft-pass/` for the
design constitution and specs this project is built from.

## Develop

```bash
npm install
npm run dev      # Vite dev server
npm run test     # vitest + design-token contrast check
npm run lint
npm run build    # fetches data, typechecks, builds, prerenders every route to dist/
npm run preview  # serve the built dist/
```

## Deploy

Live at <https://howzysolutions.com>, served by Cloudflare as an assets-only Worker (`wrangler.jsonc`).
Every push to `main`, plus a daily run, goes through `.github/workflows/ci.yml`: lint, tests, a build
with fresh data, then `wrangler deploy`. It needs the repository secrets `CLOUDFLARE_API_TOKEN` and
`WAKATIME_API_KEY`; `GITHUB_TOKEN` is the one Actions provides. By hand:

```bash
npm run build
npx wrangler deploy   # first time: npx wrangler login
```

## Environment variables

Two build-time secrets feed real measured data into the site. Both are read only during
`npm run build`, never in the browser, and both degrade gracefully when absent — the build never
fails and the page never invents data it doesn't have:

| Variable | Feeds | If unset or invalid |
|---|---|---|
| `WAKATIME_API_KEY` | Tracked coding time (`src/content/wakatime.generated.json`) | Falls back to `~/.wakatime.cfg` locally (the file WakaTime's editor plugins already write); if neither is set, the last committed artifact is kept and the page marks it stale |
| `GITHUB_TOKEN` | The GitHub activity section: contribution calendar, activity overview and monthly timeline for the last year and each contribution year (`src/content/github.generated.json`). Private repositories appear only as counts, never by name | The last committed artifact is kept and the page marks it stale; if none has ever been committed, the section is absent from the page entirely |

Set both in the deploy environment (GitHub Actions secrets here) as real secrets — never as a
`VITE_*` variable, since that prefix gets inlined into the shipped JavaScript and would publish the
credential. `GITHUB_TOKEN` needs only a classic personal access token with the `read:user` scope (or
a fine-grained token with read access to the account's profile); it authenticates the GraphQL
request and nothing more.

Full failure-mode contracts: the header of `scripts/fetch-github.mjs` and
`specs/001-terminal-portfolio-rebrand/contracts/wakatime-snapshot.md`.
