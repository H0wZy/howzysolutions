# Phase 1 Data Model: Terminal-Minimal Portfolio Rebrand

**Date**: 2026-08-19 · **Spec**: [spec.md](./spec.md) · **Research**: [research.md](./research.md)

All content lives in `src/content/` as typed modules (FR-005). Nothing here is fetched at
runtime; the statistics snapshot is the only record produced by a build step (D10).

## Localization strategy

Two mechanisms, both checked by `tsc -b`, because content and interface strings have different
shapes:

```ts
export const LOCALES = ['en', 'pt'] as const
export type Locale = (typeof LOCALES)[number]

/** Prose that belongs to a content record. Missing a locale is a type error. */
export type Localized<T = string> = Record<Locale, T>
```

- **Content prose** (project descriptions, limitations, biography) is `Localized<...>` inline
  on the record. A project added without Portuguese fails the build — which is FR-017 enforced
  by construction rather than by discipline.
- **Interface strings** (labels, button text, terminal errors) live in a dictionary keyed by a
  union derived from the English source, each locale declared `satisfies Record<StringKey,
  string>` (D7).

`erasableSyntaxOnly` is on, so every closed set below is a `const` object plus a `keyof typeof`
union, never an `enum` (D11).

---

## Project

The central record. Validated against all nine real projects before being fixed; the shape
below carries each of them without an optional-field escape hatch or a special case.

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `id` | `string` | ✓ | URL slug and stable identity. Lowercase, hyphenated. Becomes `/work/<id>` (FR-006) and the terminal's argument. |
| `name` | `string` | ✓ | Display name. Not localized — project names are proper nouns. |
| `kind` | `ProjectKind` | ✓ | Client work, own product, study, or tooling. Drives grouping and honest framing. |
| `state` | `ProjectState` | ✓ | Current state from a closed vocabulary (FR-003). |
| `context` | `Localized` | — | Client or setting. Absent for personal projects. |
| `period` | `{ start: string; end: string }` | ✓ | ISO dates from git history, not estimated. |
| `commits` | `number` | ✓ | From git history. |
| `summary` | `Localized` | ✓ | One line. Used in the list, in `projects --list-all`, and in page metadata. |
| `problem` | `Localized` | ✓ | The pain the work addressed. |
| `capabilities` | `Localized<string[]>` | ✓ | What it does. |
| `stack` | `StackGroup[]` | ✓ | Grouped technology references. |
| `development` | `Localized<string[]>` | ✓ | How it was built — the methodology narrative. |
| `limitations` | `Localized<string[]>` | ✓ | **Non-empty (FR-004).** See the validation rule below. |
| `roadmap` | `Localized<string[]>` | — | Declared next steps, where the source states them. |
| `metrics` | `Metric[]` | — | Measured figures with their source. |
| `links` | `ProjectLink[]` | — | Repository, live site. |
| `wakatimeProject` | `string` | — | Name to join against the statistics snapshot. |
| `images` | `ProjectImage[]` | — | Empty for every project today; layouts render correctly without them (spec assumption). |

### ProjectKind

| Value | Meaning | Projects |
|---|---|---|
| `client` | Built for a paying external client | telasparana, selzler-construtora, studiobiasantos |
| `product` | The author's own product or project | viralvideogen, howzysolutions |
| `study` | Built to learn, and presented as such | authsys |
| `tooling` | Infrastructure supporting the author's own work | terminal, skeeper-specs |
| `training` | Built inside a formal programme | generative-ai-e2 |

### ProjectState

A closed vocabulary whose whole purpose is preventing overstatement (FR-003). Ordered by
strength of claim; a project takes the **weakest** value it honestly satisfies.

| Value | Means | Does **not** mean | Projects |
|---|---|---|---|
| `production` | Deployed and serving real users | — | telasparana (v2.4.6), studiobiasantos |
| `delivered` | Handed over and accepted; not continuously operated | Still running in production | generative-ai-e2 |
| `functional` | Works end to end; not deployed to production | Anyone is using it | selzler-construtora, viralvideogen, terminal, skeeper-specs |
| `in-progress` | Actively being built, incomplete | Usable | howzysolutions |
| `skeleton` | Structure exists, core behaviour absent | It works | authsys |

**Validation rules**

- `limitations` MUST be non-empty. A project record with no stated limitation is incomplete
  content, not a flawless project (FR-004). Enforced by the schema test, not by review.
- `authsys` MUST carry `state: 'skeleton'` and `kind: 'study'` (FR-003). Asserted directly in
  the schema test, because it is the one case where the temptation to overstate is named in
  the spec.
- `id` MUST be unique and MUST match `/^[a-z0-9-]+$/`.
- `period.start` MUST precede `period.end`.
- Every `stack` technology reference MUST resolve to a known Technology.
- `wakatimeProject`, when present, MUST match a project name in the statistics snapshot, or the
  join silently yields no figure — which is acceptable, but a mistyped name must not be
  reported as zero hours (FR-027).

## Technology

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `id` | `string` | ✓ | Slug. Terminal argument for `projects --stack <id>`. |
| `name` | `string` | ✓ | Display form, e.g. `.NET 10`, `React 19`. |
| `category` | `TechCategory` | ✓ | `language`, `framework`, `data`, `infra`, `ai`, `tooling`. |

Referenced by Projects; the reverse index (technology → projects) is derived, never stored.
`stack` groups are `{ group: 'frontend' | 'backend' | 'infra' | 'other'; items: string[] }`,
because the source material meaningfully separates them for the full-stack projects and
collapses to a single group for the small ones.

## AuthorProfile

| Field | Type | Notes |
|---|---|---|
| `name` | `string` | `Marcos "H0wZy" Junior` |
| `handle` | `string` | `h0wzy` |
| `tagline` | `Localized` | One line of positioning. |
| `bio` | `Localized<string[]>` | Paragraphs. |
| `experienceStart` | `string` | `2023-01-01`. Duration is **derived at build**, never stored (FR-007). |
| `location` | `string` | Londrina, Paraná, Brazil. |
| `contacts` | `Contact[]` | Email, GitHub, Linktree. No form, no visitor data (spec assumption). |

`experienceYears` / `experienceMonths` are computed from `experienceStart` at build time, so
the figure is correct on every deploy without anyone editing it.

## CodingStatsSnapshot

Written by the build-time script (D10) into `src/content/wakatime.generated.json` and
committed. See [contracts/wakatime-snapshot.md](./contracts/wakatime-snapshot.md) for the wire
shape and the fallback contract.

| Field | Type | Notes |
|---|---|---|
| `capturedAt` | ISO datetime | When the fetch ran. |
| `range` | `{ start: string; end: string }` | The period the figures cover. **Every rendered figure cites this** (FR-027). |
| `totalSeconds` | `number` | |
| `humanReadableTotal` | `string` | |
| `dailyAverageSeconds` | `number` | |
| `languages` | `StatSlice[]` | |
| `editors` | `StatSlice[]` | Published deliberately (spec assumption). |
| `categories` | `StatSlice[]` | Published deliberately. |
| `projects` | `StatSlice[]` | Requires the API key — the reason the fetch is authenticated (D10). |
| `isFallback` | `boolean` | True when the last fetch failed and committed values were kept. |

`StatSlice` is `{ name: string; percent: number; seconds: number; text: string }`.

**The honesty invariant (FR-028)**: `range.start` is 2026-03-17 while
`AuthorProfile.experienceStart` is 2023-01-01. These are different measurements of different
things. The data model keeps them in separate records with separate periods so that no
rendering can accidentally present one as corroborating the other, and every figure can cite
its own range.

## Command

The terminal's command surface. Enumerable, so `help` is derived from the registry rather than
maintained beside it (FR-009).

| Field | Type | Notes |
|---|---|---|
| `name` | `string` | Primary invocation. |
| `aliases` | `string[]` | e.g. `?` for `help`. |
| `usage` | `string` | e.g. `projects [--list-all\|--stack <tech>\|<id>]`. |
| `summary` | `Localized` | One line, shown by `help`. |
| `run` | `(ctx: CommandContext) => CommandResult` | Pure. Reads content, returns structured output. |

`run` is pure — it receives parsed arguments, the active locale, and the content it may read,
and returns a value. It performs no I/O and touches no DOM, which is what makes the engine
testable and what lets both renderers share it (Principle IV). Commands that change locale or
theme return an **effect descriptor** in their result rather than performing the change, so
the engine stays pure and the renderer applies it (FR-015).

Full surface in [contracts/terminal-commands.md](./contracts/terminal-commands.md).

## LocaleDictionary

`Record<StringKey, string>` per locale, where `StringKey = keyof typeof en`. English is the
source of the key set; Portuguese must satisfy it or the build fails (D7). Covers interface
chrome and every terminal error message.

## DesignToken

CSS custom properties, one definition per theme, in a single stylesheet. No component may
carry a literal colour (FR-022, Principle VI). Values and measured contrast ratios in
[contracts/design-tokens.md](./contracts/design-tokens.md).

---

## Relationships

```text
AuthorProfile ──────── contacts ──────▶ Contact
      │
      │ experienceStart  ──derived──▶  experience duration (build time, FR-007)

Project ──── stack[] ─────────────────▶ Technology        (many-to-many, reverse index derived)
   │  └───── wakatimeProject ─────────▶ CodingStatsSnapshot.projects[].name   (join by name)
   │
   └──── rendered by ──▶ list view · /work/<id> page · terminal output
                          └── all three read the SAME record (FR-010)

Command ──── reads ──▶ Project · Technology · AuthorProfile · CodingStatsSnapshot
   │                    (never restates a fact — one source per fact)
   └──── returns ──▶ CommandResult { lines, effect? }

LocaleDictionary ── keyed by ──▶ StringKey (derived from the English dictionary)
DesignToken ─────── resolved per ──▶ theme (dark | light)
```

The load-bearing relationship is the last one on the Project row: the list, the page, and the
terminal are three renderings of one record. FR-010 forbids authoring a fact twice, and this
is the structure that makes duplicating one impossible rather than merely discouraged.
