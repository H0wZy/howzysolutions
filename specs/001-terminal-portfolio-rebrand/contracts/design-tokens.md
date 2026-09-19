# Contract: Design Tokens

**Spec**: [../spec.md](../spec.md) (FR-020 … FR-025) · **Constitution**: Principle VI

One definition per token per theme, in a single stylesheet. A literal colour in a component is
a defect (FR-022). Contrast ratios below were computed with the WCAG 2.x relative-luminance
formula and are reproduced by `scripts/check-contrast.mjs`, which is a test, not a comment.

## Colour

Dark is the default and the identity. Light is a designed alternative, not an inversion.

### Dark — `:root`, and `[data-theme="dark"]`

| Token | Value | vs `--bg` | Use |
|---|---|---:|---|
| `--bg` | `#0c0b0a` | — | Page ground. Warm near-black. |
| `--surface` | `#141210` | 1.05:1 | Panels, code blocks, the terminal body. |
| `--fg` | `#e8e2d6` | **15.25:1** | Body text. Warm off-white. |
| `--dim` | `#968c79` | **5.92:1** | Secondary text, labels, comments. |
| `--accent` | `#e8a33d` | **9.12:1** | Primary accent — links, prompt, active state. |
| `--accent-2` | `#5cc0ad` | **8.99:1** | Secondary accent — success, measured figures. |
| `--danger` | `#e0705f` | **6.23:1** | Errors, non-zero exit status. |
| `--line` | `#232019` | 1.21:1 | Decorative hairline separators. |
| `--border` | `#6b6250` | **3.27:1** | Boundaries of interactive controls. |

### Light — `[data-theme="light"]`

| Token | Value | vs `--bg` | Use |
|---|---|---:|---|
| `--bg` | `#f7f4ec` | — | Warm paper, not white. |
| `--surface` | `#fffdf8` | 1.08:1 | Panels, code blocks, terminal body. |
| `--fg` | `#1b1916` | **15.96:1** | Body text. |
| `--dim` | `#5f584b` | **6.40:1** | Secondary text. |
| `--accent` | `#8a5a0c` | **5.38:1** | Primary accent, darkened for contrast on light. |
| `--accent-2` | `#0f6f5e` | **5.53:1** | Secondary accent. |
| `--danger` | `#b03a28` | **5.49:1** | Errors. |
| `--line` | `#e3ddd0` | 1.23:1 | Decorative separators. |
| `--border` | `#8a8070` | **3.54:1** | Interactive control boundaries. |

**Why `--line` and `--border` are separate tokens.** WCAG 1.4.11 requires 3:1 for the boundary
of an interactive component, and does not require it for a decorative divider. A single border
token forces one of two failures: either every hairline separator is heavy enough to be a
control boundary and the page looks boxed-in, or every control boundary is as faint as a
separator and fails the criterion. Splitting them is what lets the design be quiet and the
buttons be perceivable. Merging them later would reintroduce exactly this bug.

**Contrast obligations**

- Text tokens on `--bg` and on `--surface`: ≥ 4.5:1 (FR-023). ✅ measured above for `--bg`.
- `--border` on `--bg`: ≥ 3:1 (FR-023, WCAG 1.4.11). ✅ 3.27:1 dark / 3.54:1 light.
- `--line` is decorative and exempt; it MUST NOT be used on a control boundary.
- Accent tokens carry one meaning each and never two (FR-025's spirit: no information by
  colour alone, and no colour that means two things).

## Typography

| Token | Value |
|---|---|
| `--font-mono` | `'JetBrains Mono Variable', ui-monospace, 'SF Mono', Menlo, Consolas, monospace` |
| `--fs-base` | `15px` / line-height `1.7` |
| `--fs-sm` | `0.86rem` |
| `--fs-xs` | `0.74rem` |
| `--fs-h2` | `clamp(1.4rem, 4vw, 1.9rem)` |
| `--fs-h1` | `clamp(2.4rem, 8vw, 4rem)` |

One family, self-hosted, `latin` subset, `font-display: swap` (FR-024, D5). Hierarchy comes
from size, weight, and spacing — there is no display face to fall back on, which is deliberate.

## Space and measure

| Token | Value | Use |
|---|---|---|
| `--measure` | `820px` | Maximum prose width. |
| `--gutter` | `24px` | Page inset. |
| `--space-section` | `54px` | Vertical rhythm between sections. |
| `--radius` | `4px` | Panels and controls. |
| `--radius-sm` | `2px` | Buttons. |

## Motion

All motion sits behind `@media (prefers-reduced-motion: reduce)`, which sets every duration to
zero and leaves final states applied (FR-025). No animation is required to read or operate
anything.

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | `120ms` | Hover, focus. |
| `--dur-base` | `280ms` | Reveals. |
| `--ease` | `cubic-bezier(.2,.7,.2,1)` | All of the above. |

Motion inventory, implemented in CSS and `IntersectionObserver` — no animation library (D1):
staggered entry on the hero, a blinking prompt cursor, reveal-on-scroll per section, and
hover/focus transitions.

## Theme application

Set as `data-theme` on `<html>` by a blocking inline script in `<head>`, before first paint
(FR-021, D6). Order: stored preference → `prefers-color-scheme` → dark.

## Verification

- `scripts/check-contrast.mjs` recomputes every ratio in this file from the token values and
  fails on any regression. Run in the same gate as lint and tests.
- Adding a token without both theme values fails that script.
- `grep -nE '#[0-9a-fA-F]{3,8}|rgb\(|hsl\(' src/**/*.tsx` must return nothing (FR-022).
