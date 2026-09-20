# Feature Specification: Howzy Solutions Brand and Portfolio Experience

**Feature Branch**: `002-branding-portfolio-experience`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "Evolve the complete Howzy Solutions portfolio experience with a new visual identity, logo family, graphite portrait language, software-colored cursor motif, refined terminal ricing, clearer navigation, site-wide section rails, smoother motion, condensed activity displays, project category badges, and loading placeholders. Preserve the site's developer personality and avoid generic SaaS styling."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recognizable Howzy Solutions Identity (Priority: P1)

As a visitor, I want the portfolio to present a coherent and memorable Howzy Solutions identity, so that I can recognize the person, the software practice, and the problem-solving promise as one brand.

**Why this priority**: The portfolio previously had a visual style but no complete logo system. The supplied branding assets must become a consistent identity rather than a collection of unrelated images.

**Independent Test**: Inspect the home page, browser icon, header, social preview, and representative inner pages and identify the same brand system across all of them.

**Acceptance Scenarios**:

1. **Given** a visitor opens any portfolio page, **When** they inspect the identity elements, **Then** the same approved wordmark, compact mark, palette, and visual language are used consistently.
2. **Given** a visitor sees the human portrait and a software-related element together, **When** they compare their treatment, **Then** graphite and off-white represent the human side while turquoise identifies software, execution, and interactive states.
3. **Given** a brand asset appears at a small size, **When** it is viewed at its intended minimum size, **Then** it remains recognizable and does not depend on fine portrait detail.
4. **Given** a visitor opens a localized page, **When** branding appears, **Then** the visual identity remains identical while all accompanying language matches the active locale.

---

### User Story 2 - Personal Hero Without Losing the Terminal Character (Priority: P1)

As a first-time visitor, I want the home page to connect the h0wzy identity to a real person without becoming a generic personal-brand landing page, so that the portfolio feels human and technically credible.

**Why this priority**: The graphite portrait is the distinctive human half of the identity, but the existing `h0wzy` cursor signature and terminal-minimal structure are already central to the site.

**Independent Test**: View the home page at mobile and desktop widths and see a balanced hero containing the author identity, cursor motif, and approved portrait without hiding the introductory content or terminal.

**Acceptance Scenarios**:

1. **Given** a desktop visitor opens the home page, **When** the hero appears, **Then** the approved graphite portrait supports the existing h0wzy signature without replacing it or dominating the page.
2. **Given** a mobile visitor opens the home page, **When** the hero stacks, **Then** the portrait, identity, biography facts, and terminal entry point remain legible without horizontal overflow.
3. **Given** an image cannot be displayed, **When** the document is read or indexed, **Then** the author's identity and all essential information remain available as text.

---

### User Story 3 - Condensed Riced Terminal (Priority: P1)

As a visitor exploring the interactive terminal, I want a compact and carefully tuned Linux-terminal-inspired interface with a working cursor, so that the signature interaction feels deliberate rather than oversized or unfinished.

**Why this priority**: The terminal is the central interactive signature of the portfolio. Its current proportions and static typing indicator undermine the visual polish of the whole site.

**Independent Test**: Run terminal commands at supported viewport sizes, observe the cursor, and confirm that input, output, focus, selection, and keyboard behavior remain usable in the denser presentation.

**Acceptance Scenarios**:

1. **Given** a visitor sees the active terminal input, **When** no reduced-motion preference is set, **Then** the turquoise cursor blinks at a calm and predictable cadence of approximately one second.
2. **Given** a visitor uses the terminal, **When** commands produce short or long output, **Then** spacing, line length, borders, and prompt segments remain compact and readable without crowding.
3. **Given** a visitor hovers, focuses, or activates an interactive terminal element, **When** its state changes, **Then** a subtle visual response confirms the interaction.
4. **Given** scripting is unavailable, **When** the page loads, **Then** the terminal introduction and surrounding content remain present and the rest of the page remains navigable.

---

### User Story 4 - Clear Global and In-Page Navigation (Priority: P1)

As a visitor moving through the portfolio, I want the header to show where I am and where I can go, plus an outline for the current document, so that navigation feels like reading well-structured developer documentation.

**Why this priority**: The current file label and separate breadcrumb divide location information, while most pages do not expose their section structure.

**Independent Test**: Navigate every route and every section using keyboard, pointer, and ordinary links on mobile and desktop widths.

**Acceptance Scenarios**:

1. **Given** a visitor opens any route, **When** the header appears, **Then** the current location and available top-level destinations are presented together in a structured navigation menu instead of the static `~/h0wzy README.md` label.
2. **Given** a visitor opens a page with sections, **When** the document outline appears, **Then** every meaningful section is listed in source order and links to a real fragment identifier.
3. **Given** a desktop viewport at least 1000 pixels wide, **When** the visitor scrolls a multi-section page, **Then** the section outline remains available beside the content and indicates the current section.
4. **Given** a narrower viewport, **When** the visitor opens the section outline, **Then** it appears as a compact disclosure that does not obscure or displace essential content.
5. **Given** a visitor activates an in-page link, **When** motion is allowed, **Then** the page moves to the target with a short, subtle transition and places the heading where it remains visible below persistent chrome.
6. **Given** scripting is unavailable, **When** the visitor activates any navigation link, **Then** route and fragment navigation still work as ordinary links.

---

### User Story 5 - Readable Projects and Activity (Priority: P2)

As a visitor evaluating the author's work, I want direct headings, visible project categories, and well-separated activity metrics, so that I can understand the portfolio quickly without decoding crowded rows.

**Why this priority**: Project quantity changes over time and does not belong in a heading. The current metric rows place labels, percentages, bars, and durations too close together at some widths.

**Independent Test**: Inspect project lists and activity groups in both locales from 320 to 2560 pixels wide and identify each item's category, value, proportion, and duration without overlap.

**Acceptance Scenarios**:

1. **Given** an English visitor reaches the work section, **When** its heading renders, **Then** it reads `My projects` and contains no fixed project count.
2. **Given** a Portuguese visitor reaches the work section, **When** its heading renders, **Then** it reads `Meus projetos` and contains no fixed project count.
3. **Given** an English visitor reaches the measured activity section, **When** its heading renders, **Then** it reads `My activity`.
4. **Given** a Portuguese visitor reaches the measured activity section, **When** its heading renders, **Then** it reads `Minha atividade`.
5. **Given** a project appears in a list, **When** its summary renders, **Then** one concise localized category badge distinguishes its primary kind from its delivery state.
6. **Given** an activity row renders at any supported width, **When** its label, bar, percentage, and duration are shown, **Then** the values remain visually associated and never overlap, clip, or become ambiguous.

---

### User Story 6 - Calm Loading and Motion States (Priority: P3)

As a visitor using a slower device or connection, I want loading and movement to preserve the site's layout and tone, so that the experience feels stable instead of flashing, jumping, or becoming distracting.

**Why this priority**: The requested polish includes skeleton references and smooth transitions, but those effects must communicate a real state and must never replace complete prerendered content unnecessarily.

**Independent Test**: Simulate delayed content and reduced motion, then verify that placeholders match final geometry, layout shift stays within budget, and every interaction remains understandable without animation.

**Acceptance Scenarios**:

1. **Given** content is genuinely pending, **When** its final geometry is known, **Then** a restrained skeleton placeholder occupies the same approximate space until the content is available.
2. **Given** complete prerendered content is already available, **When** the page hydrates, **Then** no artificial skeleton replaces or flashes over that content.
3. **Given** a visitor prefers reduced motion, **When** the page loads or an interaction occurs, **Then** cursor blinking, smooth scrolling, reveal motion, shimmer, and decorative transitions become static or immediate.
4. **Given** a visitor navigates by keyboard, **When** focus moves, **Then** the focus indication remains immediate and visible regardless of motion preferences.

### Edge Cases

- Supplied branding images may contain transparent margins, raster texture, or details that disappear at favicon size. Each placement must use an asset variant suited to that size rather than shrinking a detailed portrait indiscriminately.
- If no supplied asset meets the minimum-size or contrast requirement for a compact mark, the existing text cursor signature remains the fallback until a compliant mark is approved.
- Brand images must not become the only source of the author's name, role, or navigation information.
- Long localized navigation labels must fit without horizontal overflow or inaccessible clipping.
- A page with few or no meaningful sections must not show an empty or redundant section outline.
- A project with multiple relevant categories displays one primary category in list views.
- Very long terminal output must remain selectable, scrollable when necessary, and contained within the viewport.
- Direct navigation to a fragment must land correctly on first load as well as after an in-page activation.
- Loading placeholders must not appear for data already embedded in the delivered document.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The product MUST define a cohesive Howzy Solutions identity system containing a primary wordmark, a compact mark, an approved portrait treatment, and clear usage roles for each.
- **FR-002**: The primary identity MUST preserve the `h0wzy` name and terminal cursor motif.
- **FR-003**: The visual identity MUST use graphite, black, and off-white to represent the human side of the brand and turquoise to represent software, execution, cursor states, and interactive progress.
- **FR-004**: Branding MUST preserve visible hand-drawn graphite texture and intentional imperfection without adopting polished cartoon, sticker, barber-shop, generic startup, or generic technology-icon aesthetics.
- **FR-005**: The identity MUST avoid decorative circuits, chips, gears, brains, code brackets, glass effects, neon bloom, and blue-purple startup gradients unless a specific use carries documented meaning.
- **FR-006**: The system MUST assign supplied branding assets to explicit roles and MUST NOT ship the entire exploratory set as interchangeable production assets.
- **FR-007**: Every approved brand asset MUST have a descriptive stable name, intended placement, minimum usable size, background guidance, and accessible text treatment documented before release.
- **FR-008**: The compact brand mark MUST remain recognizable at 32 by 32 pixels and the social/avatar mark MUST remain recognizable in a circular crop.
- **FR-009**: The home hero MUST integrate an approved graphite portrait as a supporting editorial element while retaining the text-based h0wzy signature, author facts, and clear route into the portfolio content.
- **FR-010**: Essential identity and page meaning MUST remain available when images fail to load or are hidden.
- **FR-011**: All brand and interface colors MUST resolve through the established palette and maintain their semantic meaning across the site.
- **FR-012**: The terminal MUST display a periodically blinking turquoise typing cursor at an approximately one-second cadence when motion is allowed.
- **FR-013**: The terminal MUST adopt compact proportions, minimal borders, controlled padding, short prompt segments, and readable line spacing inspired by restrained Linux terminal customization.
- **FR-014**: Terminal presentation changes MUST preserve keyboard input, selectable output, polite announcements, command history, completion, and existing command behavior.
- **FR-015**: Interactive links, buttons, navigation items, project rows, disclosures, and terminal controls MUST provide subtle hover, focus, and active feedback.
- **FR-016**: The header MUST replace the static file label with a structured navigation menu that combines current-location context and top-level destinations.
- **FR-017**: The header navigation MUST remain operable with keyboard, pointer, touch, and assistive technology at every supported width.
- **FR-018**: Every page containing meaningful sections MUST expose a localized document outline whose entries correspond to real section anchors in source order.
- **FR-019**: The document outline MUST highlight the currently visible section when enhancement is available and MUST remain a working list of links without enhancement.
- **FR-020**: The document outline MUST appear as a persistent side rail on wide viewports and a compact disclosure on narrower viewports.
- **FR-021**: Fragment navigation MUST use a short, subtle scrolling transition when motion is allowed and must fall back to an immediate jump when reduced motion is requested.
- **FR-022**: Anchored headings MUST remain visible after navigation and MUST receive an understandable focus or location indication without relying on color alone.
- **FR-023**: The English work heading MUST read `My projects`; the Portuguese heading MUST read `Meus projetos`; neither may include a fixed project count.
- **FR-024**: The English activity heading MUST read `My activity`; the Portuguese heading MUST read `Minha atividade`.
- **FR-025**: Activity rows MUST visually separate label, proportion, percentage, and duration so each value remains identifiable from 320 to 2560 pixels wide.
- **FR-026**: Every project list item MUST display one localized primary category badge distinct from the project's delivery-state indicator.
- **FR-027**: Project categories MUST be authored as shared typed content and reused consistently wherever a project is rendered.
- **FR-028**: A restrained skeleton treatment MUST be available for genuine pending states and MUST approximate the final content geometry.
- **FR-029**: Complete prerendered content MUST NOT be hidden behind or replaced by artificial skeletons during ordinary hydration.
- **FR-030**: All new visitor-facing labels, categories, navigation text, accessibility names, and brand-supporting copy MUST exist in English and Brazilian Portuguese.
- **FR-031**: All motion, including cursor blinking, smooth scrolling, reveals, hover transitions, and skeleton animation, MUST honor reduced-motion preferences.
- **FR-032**: The refreshed interface MUST remain dark-only, use self-hosted typography, and avoid third-party tracking or font requests.
- **FR-033**: New branding assets MUST use web-appropriate dimensions and compression so the portfolio continues to meet its established loading and layout-stability budgets.
- **FR-034**: The refreshed experience MUST preserve complete prerendered content and ordinary link navigation when client scripting is unavailable.
- **FR-035**: The overall experience MUST maintain the existing accessibility and client-transfer budgets after all identity and interaction changes are applied.

### Key Entities

- **BrandAsset**: An approved visual file with a role, stable name, source, dimensions, minimum display size, background guidance, and accessibility treatment.
- **BrandRole**: One defined identity use such as primary wordmark, compact mark, editorial portrait, favicon, social avatar, or social preview.
- **NavigationItem**: A localized top-level or in-page destination with a target, label, order, and current-state meaning.
- **TopicAnchor**: A meaningful document section with a stable fragment identifier, localized label, and source order.
- **ProjectCategory**: A localized primary classification authored with the project record and rendered consistently across project surfaces.
- **LoadingPlaceholder**: A temporary representation tied to a genuine pending state and sized to approximate the content it precedes.
- **MotionPreference**: The visitor's request for standard or reduced motion, applied consistently to every animated behavior.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can match 100 percent of production brand placements to a documented brand role and approved asset.
- **SC-002**: The compact mark remains recognizable at 32 by 32 pixels, and the approved avatar remains recognizable in 180 by 180 pixel square and circular presentations.
- **SC-003**: The home hero, header, browser icon, and social preview communicate one consistent h0wzy identity without requiring a visitor to infer a relationship between unrelated marks.
- **SC-004**: The terminal cursor completes a full blink cycle every 1.0 to 1.2 seconds when motion is allowed and remains static when reduced motion is requested.
- **SC-005**: Terminal input and output remain usable without clipping or horizontal page overflow from 320 to 2560 pixels wide.
- **SC-006**: Every top-level route is reachable from the header using keyboard alone, and every multi-section page exposes a working localized outline.
- **SC-007**: One hundred percent of in-page links reach the intended heading while keeping that heading visible below persistent page chrome.
- **SC-008**: Project and activity headings display the requested copy in both locales with zero remaining fixed-count references.
- **SC-009**: Every project list item exposes exactly one localized primary category badge in addition to any delivery-state indicator.
- **SC-010**: Activity metrics display with no overlapping, clipped, or ambiguously associated labels, bars, percentages, or durations at tested widths from 320 to 2560 pixels.
- **SC-011**: Loading placeholders cause no visible content replacement during ordinary prerendered hydration and keep cumulative layout shift at or below 0.05 when a genuine delayed state is tested.
- **SC-012**: Reduced-motion mode removes all nonessential movement while leaving every state and action understandable.
- **SC-013**: The refreshed pages retain a perfect automated accessibility score and pass keyboard and screen-reader checks for navigation, terminal, disclosures, badges, and image alternatives.
- **SC-014**: Initial client JavaScript remains within the established 120 KB gzipped ceiling after the complete feature is integrated.
- **SC-015**: Both locales and all supported routes render complete content without client scripting.

## Assumptions

- The supplied branding directory is an exploratory source set. Only assets selected and approved for a defined role become production assets.
- The text-based `h0wzy` name with a cursor remains the primary signature; the portrait supports the human identity and is not forced into every placement.
- Turquoise becomes the principal software and interaction color. Warm tones, if retained, are limited to meanings that do not conflict with software, progress, or navigation.
- The current terminal command engine and its semantics remain unchanged; the feature changes its presentation and interaction feedback.
- The named Navigation Menu, Badge, and Skeleton examples define desired interaction and visual patterns. Exact technical composition belongs to planning and must respect existing accessibility, performance, and dependency constraints.
- All pages means every current route receives consistent global navigation; a section outline appears only where the page contains meaningful anchored sections.
- Category badges classify the kind of project and remain separate from the existing delivery-state badge.
- Skeletons appear only for a real pending state. They are not used to simulate loading when the delivered document already contains final content.
- The feature is one coordinated portfolio refresh. Logo integration, terminal ricing, navigation, metrics, badges, motion, and loading states are not split into separate specs.
