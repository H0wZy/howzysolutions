# Contract: Terminal Command Surface

**Spec**: [../spec.md](../spec.md) (FR-008 … FR-015) · **Model**: [../data-model.md](../data-model.md)

This is the feature's primary external interface — a CLI a visitor drives. The engine is pure
TypeScript in `src/terminal/`, importing nothing from React, Three.js, or the DOM
(Principle IV), so the DOM renderer and the immersive renderer share one implementation.

## Engine contract

```ts
export type CommandResult = {
  /** Output lines. Rendered as text; never HTML strings. */
  lines: OutputLine[]
  /** Requested side effect, applied by the renderer, never by the engine. */
  effect?: Effect
  /** Non-zero marks failure. Mirrors shell convention; drives error styling. */
  status: 0 | 1 | 2
}

export type OutputLine =
  | { kind: 'text'; text: string; tone?: 'default' | 'dim' | 'accent' | 'error' }
  | { kind: 'pairs'; rows: Array<[label: string, value: string]> }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'link'; text: string; href: string }
  | { kind: 'blank' }

export type Effect =
  | { type: 'set-locale'; locale: Locale }
  | { type: 'set-theme'; theme: Theme }
  | { type: 'clear' }
  | { type: 'navigate'; href: string }

export type CommandContext = {
  args: string[]
  flags: Record<string, string | boolean>
  locale: Locale
  content: ContentBundle   // projects, technologies, profile, stats
}

export function execute(input: string, ctx: Omit<CommandContext, 'args' | 'flags'>): CommandResult
```

**Invariants**

1. `execute` is pure: same input and context produce the same result. No `Date.now()`, no
   `Math.random()`, no storage, no network, no DOM.
2. Effects are **described, not performed**. `theme light` returns
   `{ type: 'set-theme', theme: 'light' }`; the renderer applies it. This is what keeps
   FR-015 satisfiable from both the terminal and the page controls with one code path.
3. Output is structured data, never markup. Renderers decide presentation; the engine decides
   content.
4. Every string reaching the visitor comes from the locale dictionary or from content records —
   never a literal in the engine (FR-017).

## Commands

`h0wzy` is accepted as an optional leading word on any command, so both `h0wzy --version` and
`version` work. Unknown input never crashes; it returns `status: 1` with a suggestion.

| Command | Usage | Output | Status |
|---|---|---|---|
| `help` | `help [command]` | Derived from the registry — every registered command's name, usage, and localized summary. With an argument, that command's detail. | 0 |
| `version` | `h0wzy --version` | `h0wzy <Y>.<M>.0` where Y/M are years/months since `experienceStart`, plus the experience line and the tracked-time line, each citing its own period (FR-028). | 0 |
| `whoami` | `whoami` | Name, handle, tagline, location. | 0 |
| `about` | `about` \| `cat about.md` | The biography paragraphs. | 0 |
| `projects` | `projects --list-all` | Table: id, name, state, stack summary, commits, period. | 0 |
| | `projects <id>` | Full record: problem, capabilities, stack, development, **limitations**, roadmap, metrics, links. | 0 |
| | `projects --stack <tech>` | Projects using that technology. Unknown technology → `status: 1` with the closest match. | 0 / 1 |
| | `projects --kind <kind>` | Filter by `client` / `product` / `study` / `tooling` / `training`. | 0 / 1 |
| `stack` | `stack` \| `skills` | Technologies grouped by category, each with the count of projects using it. Counts are derived. | 0 |
| `stats` | `stats [--languages\|--editors\|--projects]` | Coding activity from the snapshot. **Every section prints its range** (FR-027). Prints a staleness note when `isFallback` is true. | 0 |
| `contact` | `contact` | Contact routes as `link` lines. | 0 |
| `lang` | `lang [en\|pt]` | With no argument, prints the active locale. With one, returns a `set-locale` effect. | 0 / 1 |
| `theme` | `theme [dark\|light]` | Same shape as `lang`, returning `set-theme`. | 0 / 1 |
| `open` | `open <id>` | Returns a `navigate` effect to `/work/<id>`. | 0 / 1 |
| `ls` | `ls` | The content surface as pseudo-entries, so the filesystem metaphor is discoverable. | 0 |
| `clear` | `clear` | Returns a `clear` effect. Empty `lines`. | 0 |
| `history` | `history` | The session's submitted inputs, numbered. Supplied by the renderer via context. | 0 |

### Error contract (FR-011)

| Condition | Output | Status |
|---|---|---:|
| Empty or whitespace-only input | No output, no history entry. Prompt stays ready. | 0 |
| Unknown command | `command not found: <input>` plus `type 'help' to see what's available`. | 1 |
| Unknown command within edit distance 2 of a known one | The above plus `did you mean '<candidate>'?`. | 1 |
| Unknown project id, near a real one | `no such project: <id>` plus `did you mean '<candidate>'?`. | 1 |
| Known command, bad flag value | The command's `usage` line and the accepted values. | 2 |
| Input longer than 512 characters | Truncated in the echo, rejected with a length message. | 2 |

Suggestions use Levenshtein distance ≤ 2 against known command names, aliases, and project
ids. Rationale: a portfolio visitor typing `porjects` should be helped, not stonewalled — the
one place a small amount of forgiving logic earns its bytes.

## Renderer contract

Both renderers consume the same engine and are bound by these rules.

**Shared**
- Output text MUST be real, selectable DOM text (FR-008, FR-034).
- The scrollback MUST carry `role="log"` and `aria-live="polite"` (FR-013, D8).
- Input MUST be a real `<input>` in a `<form>`, in normal tab order (D8).
- History recall on ArrowUp / ArrowDown; completion on Tab (FR-012).
- A visible first-use hint MUST state what to type first (FR-014).

**DOM renderer** — canonical. Ships in the initial bundle.

**Immersive renderer** — reached only through a dynamic import (FR-033). Renders the
environment in WebGL and composes the DOM terminal over it (D9); it MUST NOT re-implement the
terminal in WebGL text. On unsupported hardware it reports plainly and leaves the visitor on
the DOM renderer (FR-035). Opting out preserves session history (US6 scenario 4).

## Test obligations

The engine is pure, so Principle VII requires unit tests. At minimum:

- Every registered command returns a well-formed `CommandResult` for its documented usages.
- `help` output covers exactly the registry — a command added without a help entry is
  impossible by construction, and a test asserts the derivation.
- Every error-contract row above.
- Purity: calling `execute` twice with the same arguments returns deep-equal results.
- Locale: every command produces zero English strings when `locale: 'pt'`.
- No command output restates a fact that differs from the content record it came from
  (FR-010) — asserted by comparing command output against the source record.
