# Visual Behavior Contract

## Terminal

- The terminal remains one scroll region containing scrollback followed by its form.
- The real text input remains focusable, selectable, IME-compatible, and the owner of keyboard input.
- The prompt stays short and uses the existing identity, path, and shell segments.
- A decorative turquoise block sits immediately after the visible input width while focused.
- The mount layer updates input `size` after direct input, submit clearing, history recall, and tab completion.
- Standard motion uses a 1.1 second `steps(1, end)` blink cycle.
- Reduced motion removes the blink and leaves the cursor visible while focused.
- The native caret may be transparent only when the custom cursor is present.
- No change may enter `src/terminal/`; command semantics and purity remain unchanged.
- Long output remains selectable and uses local horizontal scrolling where needed, never document overflow.

## Project badges

- Each list row shows exactly one category Badge from `Project.kind` and one state Badge from `Project.state`.
- Detail headers use the same two values and translations.
- Text always carries the meaning; color is secondary.
- Category and state have distinct styling without adding a new palette value.

## Activity rows

Wide layout:

```text
label                         percentage   duration
[proportional bar across the available row width]
```

Narrow layout:

```text
label
percentage   duration
[bar across the row]
```

- Label, percentage, duration, and bar stay inside one list item.
- No fixed text width assumes English label lengths.
- The bar remains supplemental; percentage and duration stay as text.

## Skeleton

- Skeleton is used only as the backing layer of the hero portrait frame while image bytes are pending.
- It reserves the final aspect ratio before the image arrives.
- It is `aria-hidden` and contains no essential text.
- It is static by default; no shimmer is required.
- Prerendered text, project data, activity data, navigation, and terminal introduction never pass through a skeleton state.

## Motion and feedback

| Surface | Standard motion | Reduced motion |
|---|---|---|
| Terminal cursor | 1.1 s step blink | static visible cursor |
| Fragment navigation | short smooth scroll | immediate jump |
| Reveal | current short transition | final state immediately |
| Hover/active | short color/border transition | immediate state |
| Skeleton | static | static |

Focus rings are always immediate and visible. No information depends on motion, hover, or color alone.

## Responsive checks

- 320 px: no document overflow; hero stacks; terminal input and cursor stay inside; activity values remain associated.
- 768 px: hero and header use available space without a cramped side rail.
- 1000 px: document rail changes from disclosure to sidebar without losing entries.
- 1440 px: portrait supports the text and does not dominate it.
- 2560 px: readable measure remains bounded and activity columns do not spread into ambiguity.
