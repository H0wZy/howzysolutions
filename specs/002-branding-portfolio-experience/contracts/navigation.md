# Navigation Contract

## Global header

The sticky header exposes one primary navigation structure on every emitted route.

1. Route ancestry and current location come from `trailFor(route, locale, leafLabel)`.
2. Remaining top-level destinations come from `topLevelLinks(route, locale)`.
3. Paths come from `pathFor`; no component concatenates localized route strings.
4. The current page is present, is not a self-link, and carries `aria-current="page"`.
5. Every other top-level route is one ordinary-link activation away.
6. Locale and theme controls remain real controls after the navigation items.
7. At narrow widths the row may wrap, but the document must not gain horizontal overflow and no item may be clipped.
8. The direct-link menu has no trigger, popup, portal, roving focus, or client state.

## Top-level destinations

| Destination | English path | Portuguese path |
|---|---|---|
| Home | `/` | `/pt/` |
| Work | `/work/` | `/pt/work/` |
| CV | `/cv/` | `/pt/cv/` |
| Privacy | `/privacy-policy/` | `/pt/privacy-policy/` |

Paginated work and project detail routes retain their existing route-derived ancestry.

## Document outlines

A page receives a SectionRail when it has at least two meaningful anchored sections.

| Page | Source of entries | Expected behavior |
|---|---|---|
| Home | ordered home section descriptors | terminal, about, work, activity, GitHub when present, contact |
| CV | existing `railEntries(cv)` | every CV record section |
| Privacy | ordered policy sections, project sections, and their documented subsections | every included id exists in delivered HTML |
| Project detail | ordered block descriptors, filtered by available project data | optional metrics, roadmap, tracked time, and links appear only when rendered |
| Work index | none | no redundant one-entry outline |

### Wide viewports

- At 1000 px and above the outline is a persistent side rail.
- The content column keeps its readable measure and never shrinks below a usable width.
- The current entry has `aria-current="location"` when enhancement is available.

### Narrow viewports

- The same markup is a native `<details>` disclosure closed by default.
- Opening it does not overlay essential content or trap focus.
- Links remain available without JavaScript.

## Fragment behavior

1. Each link targets a real stable id.
2. Source order and outline order are identical.
3. Standard motion uses the existing short smooth scroll.
4. Reduced motion uses an immediate jump.
5. Target headings use scroll margin sufficient for the sticky header.
6. The target receives a visible non-color location/focus cue.
7. Direct URLs containing a fragment satisfy the same visibility rule on first load.

## Acceptance checks

- Tab through the complete header in both locales and activate every destination.
- Open each route directly with JavaScript disabled.
- Activate every rail entry and verify its target and URL fragment.
- Repeat fragment tests at 320, 999, 1000, and 1440 px.
- Confirm long project names and Portuguese labels wrap without page overflow.
