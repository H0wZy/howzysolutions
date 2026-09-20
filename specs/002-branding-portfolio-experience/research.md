# Research: Howzy Solutions Brand and Portfolio Experience

## D1. Production identity uses two supplied sources and a live-text wordmark

**Decision**: Keep `h0wzy` plus the terminal block cursor as the primary live-text wordmark. Use `src/assets/branding/Imagem do Codex 19 de set. de 2026, 16_29_11.png` as the source for the graphite editorial portrait and `src/assets/branding/Imagem do Codex 19 de set. de 2026, 16_49_23.png` as the source for the compact mark, favicon, and avatar. Build one social preview from those same elements.

**Rationale**: The portrait has the strongest human/editorial character and leaves software meaning to the turquoise cursor. The compact square remains legible without portrait detail. Live text is sharper, accessible, localizable around the mark, and already central to the site.

**Alternatives considered**: `16_28_38.png` as a raster wordmark duplicates text the browser can render better. The terminal-square portrait works at medium size but is too detailed at favicon size. Circuit and sticker treatments conflict with the approved graphite direction.

## D2. Exploratory files remain sources, not interchangeable production assets

**Decision**: Give every referenced derivative a stable semantic filename and an explicit role. Do not import the other exploratory PNGs into application code or metadata.

**Rationale**: Vite emits imported assets. Restricting references is the smallest reliable boundary between source exploration and the production system, and it preserves the user's originals without adding an asset registry to runtime code.

**Alternatives considered**: Deleting or relocating every rejected source would create unrelated repository churn. A runtime manifest would duplicate a design-time contract for a handful of fixed files.

## D3. Turquoise becomes the interaction accent through existing tokens

**Decision**: Reassign the existing cool accent to links, focus, cursor, active rail, measured progress, and software states. Retain the warm accent only where it communicates a separate supporting emphasis. All CSS continues to resolve through `tokens.css`.

**Rationale**: This matches the supplied art and the feature assumption without introducing another hue. The existing contrast script already understands token references and can verify the changed pairs.

**Alternatives considered**: Keeping warm amber as the primary interaction color would contradict the new system. Copying turquoise literals from pixels into components would violate the constitution.

## D4. The hero is editorial composition, not a landing-page card

**Decision**: Place the portrait beside the existing text identity at wide widths and in the same document flow on mobile. Use hairlines, open space, fixed media dimensions, and the existing mono type system.

**Rationale**: The portrait humanizes the page while the live wordmark and terminal remain dominant. Fixed geometry protects CLS and the text retains all meaning if the image is unavailable.

**Alternatives considered**: A full-bleed portrait would overpower the content. A glass card, gradient panel, or separate display font would violate the established direction.

## D5. Navigation Menu is a semantic local subset with no new package

**Decision**: Implement only the used Navigation Menu subset with `<nav>`, `<ul>`, `<li>`, and `<a>`, shaped as a local shadcn component. Keep dropdown triggers, portals, viewports, and animation out because the information architecture contains direct destinations only.

**Rationale**: Shadcn's component model is compositional, and Base UI provides primitives for trigger/content/popup behavior. This site has no nested menu content that needs those behaviors. Native links supply keyboard, touch, assistive-technology, and no-JavaScript behavior at zero dependency cost.

**Alternatives considered**: Installing Base UI would buy interaction states the design does not use and spend scarce bundle headroom. A mobile-only custom popover would add state and focus management for four links that already fit as wrapped text.

## D6. Header location and destinations become one structure

**Decision**: Move the existing breadcrumb trail into the sticky header's primary navigation and render the remaining top-level links alongside it. The current page is text with `aria-current="page"`; other destinations are ordinary localized links.

**Rationale**: Route derivation already exists and is unit-tested. Reusing it removes the static file label and the duplicate strip without creating a second navigation model.

**Alternatives considered**: Keeping both the old file label and breadcrumb preserves the current split. Deriving location from the DOM or URL strings in the component would bypass the existing `Route` union.

## D7. Section rails derive from the content that renders each page

**Decision**: Reuse `SectionRail` for pages with at least two meaningful anchors. Home entries come from its known ordered sections, CV entries from `railEntries(cv)`, privacy entries from its section/project records, and project-detail entries from the same ordered descriptors used to render blocks.

**Rationale**: The prerender contains a complete outline and links before enhancement. Shared source order prevents drift. The existing `IntersectionObserver` only needs to set `aria-current="location"`.

**Alternatives considered**: DOM scraping would produce no rail in the static document. Authoring a second manual list per page would eventually diverge. Showing a rail for the one-section work index adds chrome without orientation value.

## D8. Fragment motion stays native CSS

**Decision**: Keep `scroll-behavior: smooth`, the existing reduced-motion override, and add scroll margin plus a non-color target/focus indication to anchored headings.

**Rationale**: Browser fragment navigation preserves URL, history, keyboard behavior, and no-JavaScript support. CSS already implements the motion preference contract.

**Alternatives considered**: JavaScript scrolling would duplicate native navigation and require manual focus/history handling. View Transitions are unnecessary for in-document movement.

## D9. Terminal ricing changes renderer presentation only

**Decision**: Keep the real input and one scroll region. Add a decorative cursor sibling whose position follows the input's native `size` attribute, synchronized by the existing DOM mount layer. Blink it with a 1.1 second CSS step cycle and disable animation under reduced motion.

**Rationale**: This gives the cursor a controllable turquoise block and cadence while preserving text entry, selection, IME, history, completion, and the pure engine. The terminal configuration reference supports restrained padding, borders, and chrome rather than decorative window furniture.

**Alternatives considered**: Relying only on the browser caret does not let the site guarantee reduced-motion behavior or cadence. Mirroring all input text into a second visual layer is more code and risks selection mismatch. Rewriting the terminal in React would violate the renderer boundary and add no capability.

## D10. Project categories already exist as `Project.kind`

**Decision**: Treat `Project.kind` and `PROJECT_KIND` as the ProjectCategory entity. Render it with the local Badge in list and detail surfaces.

**Rationale**: Every project already has exactly one typed kind and both dictionaries already contain its label. A new `category` field would duplicate the same fact and create migration work with no behavior gain.

**Alternatives considered**: A second category taxonomy or free-form tags would broaden scope and weaken the exactly-one-category acceptance rule.

## D11. Skeletons represent only image transfer

**Decision**: Use a local Skeleton as an inert backing layer inside the fixed-aspect hero portrait frame. The final opaque image covers it as bytes arrive. Do not put skeletons around prerendered text, navigation, project records, WakaTime data, or GitHub data.

**Rationale**: The portrait is a genuine pending network resource with known geometry. The content records are already embedded in HTML, so a loading facade over them would be false and could flash during hydration.

**Alternatives considered**: Global React loading state has no real asynchronous content to await. Animated shimmer adds motion without information; the default treatment can remain static and still reserve space.

## D12. Activity layout uses CSS Grid

**Decision**: Give label, percentage, duration, and bar explicit grid areas, then collapse to two rows at narrow widths.

**Rationale**: The current wrapping flex row can separate values from their bar. Grid keeps each row's parts aligned without measuring text in JavaScript.

**Alternatives considered**: Fixed column widths clip localized labels. JavaScript measurement adds resize logic for a layout CSS already solves.

## D13. Social metadata extends the existing prerender pass

**Decision**: Add a single local 1200 by 630 brand image and let `scripts/prerender.mjs` emit route-specific Open Graph/Twitter title and description with the shared image and localized alt text.

**Rationale**: The script already owns route titles, descriptions, language, and alternates. Extending that one path prevents the static shell and emitted documents from drifting.

**Alternatives considered**: Client-side metadata arrives too late for crawlers. A separate SEO framework or plugin is unnecessary.

## D14. Validation remains proportional to risk

**Decision**: Unit-test pure navigation/content/metadata rules and verify layout/motion/assets in real browsers. Run the existing automated bundle and contrast gates after asset and component changes.

**Rationale**: Pure derivation failures are silent and cheap to test. Pixel layout, crop recognition, loading behavior, and motion need rendered evidence rather than snapshot markup.

**Alternatives considered**: Broad component snapshots would mirror markup and miss the visual failures this feature targets. A new end-to-end framework is outside the need and budget.

## Sources

- [kitty configuration](https://sw.kovidgoyal.net/kitty/conf/): reference for restrained terminal padding, borders, title bars, and tab-bar treatment.
- [shadcn Navigation Menu](https://ui.shadcn.com/docs/components/base/navigation-menu): reference for compositional navigation markup.
- [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu): reference for the trigger/content/popup behaviors deliberately omitted from a direct-link menu.
- [shadcn Skeleton](https://ui.shadcn.com/docs/components/base/skeleton): reference for a local placeholder primitive.
- [shadcn Badge](https://ui.shadcn.com/docs/components/base/badge): reference for concise status/category labels.
