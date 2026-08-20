# Contract: Coding Statistics Snapshot

**Spec**: [../spec.md](../spec.md) (FR-026 … FR-031) · **Research**: [../research.md](../research.md) (D10)
**Constitution**: Technology & Design Constraints → *Secrets & external data*

## Producer

`scripts/fetch-wakatime.mjs`, run before `vite build`.

- Reads the key from `WAKATIME_API_KEY` in the **build environment only** — a Vercel
  environment variable or a GitHub Actions secret. Never a `VITE_*` variable, because Vite
  inlines those into public JavaScript (FR-030).
- Calls `GET https://wakatime.com/api/v1/users/current/stats/all_time` with HTTP Basic
  authentication (the key, base64-encoded).
- Writes `src/content/wakatime.generated.json`, which **is committed**.

Authentication is required rather than optional: the unauthenticated public endpoint returns
totals, languages, editors and categories, but returns `projects: null`. FR-026 requires the
per-project breakdown, so the authenticated call is the only one that satisfies it.

## Consumer

`src/content/stats.ts` imports the JSON, validates its shape, and exposes it as a typed
`CodingStatsSnapshot`. No browser code contacts WakaTime (FR-029).

## Artifact shape

```jsonc
{
  "capturedAt": "2026-08-19T23:10:04.000Z",
  "range":      { "start": "2026-03-17", "end": "2026-08-19" },
  "totalSeconds": 439399.144,
  "humanReadableTotal": "122 hrs 3 mins",
  "dailyAverageSeconds": 8291,
  "languages":  [{ "name": "TypeScript", "percent": 18.61, "seconds": 87610, "text": "24 hrs 20 mins" }],
  "editors":    [{ "name": "Claude Code", "percent": 61.7,  "seconds": 290460, "text": "80 hrs 41 mins" }],
  "categories": [{ "name": "AI Coding",   "percent": 81.76, "seconds": 384840, "text": "106 hrs 54 mins" }],
  "projects":   [{ "name": "generative-ai-e2", "percent": 24.58, "seconds": 115680, "text": "32 hrs 8 mins" }],
  "isFallback": false
}
```

Every slice is `{ name, percent, seconds, text }`. `range` is mandatory and is what every
rendered figure cites (FR-027).

## Failure contract (FR-031)

The build **never fails because of this script**, and a visitor **never sees a zero**.

| Condition | Behaviour |
|---|---|
| `WAKATIME_API_KEY` unset (any local dev, any fork) | Warn, keep the committed artifact, exit 0. |
| Network failure or timeout (15 s) | Warn, keep the committed artifact, exit 0. |
| `401` / `403` — key revoked or rotated | Warn loudly naming rotation as the likely cause, keep the artifact, exit 0. |
| `429` — rate limited | Warn, keep the artifact, exit 0. |
| `200` with a shape that fails validation | Warn, keep the artifact, exit 0. **Do not write a partial artifact.** |
| `200`, valid, but `totalSeconds` lower than the committed value | Write it, and set `isFallback: false`. A legitimate decrease is possible after a data correction; refusing it would be inventing a floor. |
| `200` and valid | Write the artifact with `isFallback: false`. |

In every failure row the retained artifact keeps its original `capturedAt` and gets
`isFallback: true`, so the interface can state that figures are from the last successful
capture rather than implying they are current.

Rationale: a deploy blocked because a third-party API is rate-limited is a deploy blocked for a
reason unrelated to the change being shipped. Yesterday's hour count is strictly better than
that, and immeasurably better than rendering zeros.

## Refresh

A scheduled workflow triggers a rebuild at most daily. For a cumulative hour count, 24-hour
staleness is not observable by a visitor.

## Verification

- `grep -r "waka_" .` across the repository and across `dist/` returns nothing (FR-030,
  SC-013).
- Running the build with `WAKATIME_API_KEY` unset succeeds and publishes the committed
  figures (SC-012).
- Running it with a deliberately invalid key succeeds, warns, and leaves the artifact byte-
  identical.
- Every rendered figure is accompanied by `range` (FR-027) — asserted in a component test.
- Tracked time and experience duration never render as one continuous claim (FR-028).
