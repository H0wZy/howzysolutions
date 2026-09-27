# Feature Specification: vvv Showcase Page

**Feature Branch**: `004-vvv-showcase`

**Created**: 2026-09-27

**Status**: Ready for Planning

**Input**: User description: "criar uma pagina de showcase pra: https://howzysolutions.com/works/vvv/ vvv, tipo a https://howzysolutions.com/mcp/ que existe hoje, mas como vvv é um repo publico ainda, gostaria que fosse um "resumo" do que o projeto faz [...] e eu queria me inspirar no design do https://hermes-agent.nousresearch.com/ so que meio que mesclado com o meu, repare na pagina do hermes agent, ele usa umas imagens muito maneiras, so que azul, eu queria preto [...] crie um prompt pra gerar esse estilo de imagem pro chatgpt, ai eu gero e a gente coloca no meu vvv."

**Clarification recorded, not asked**: `gh repo view H0wZy/vvv` reports `PRIVATE` (2026-09-27), and vvv's own README says "hosted in a private GitHub repository". The page is therefore a summary of what the project does, and nothing on it points at source.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand vvv in one screen (Priority: P1)

A recruiter or developer opens `/vvv/` (or `/pt/vvv/`) and learns, before scrolling, what vvv is: a CLI pipeline that takes a reference video and produces an original, production-ready video package, for two different accounts. No source access is needed or offered.

**Why this priority**: The page exists to explain a project whose code cannot be shown.

**Independent Test**: Open `/vvv/` and `/pt/vvv/` with scripting disabled at 360px and 1440px. The first screen names the project, says what it does in one sentence, and states that the repository is private.

**Acceptance Scenarios**:

1. **Given** a visitor on `/vvv/`, **When** the page loads, **Then** the hero shows the name, a one-sentence summary, the repository's visibility, and a link to the project record at `/works/vvv/`.
2. **Given** a visitor on `/pt/vvv/`, **When** the page loads, **Then** every visible string is Portuguese and `<html lang>` is `pt-BR`.

---

### User Story 2 - Follow the pipeline and its defining rule (Priority: P1)

The visitor reads the pipeline as a terminal session, then as six numbered stages, then the rule that shapes all of it: a result is measured before it is believed. Each claim is concrete (what is measured, and why).

**Why this priority**: The rule is what makes vvv worth showing; a feature list alone reads like every other AI video tool.

**Independent Test**: The page lists the six stages in order, the terminal transcript uses only commands the README documents, and the rule section names at least three measurements.

**Acceptance Scenarios**:

1. **Given** the pipeline section, **When** read on a 360px screen, **Then** the transcript scrolls inside itself and the page never scrolls horizontally.
2. **Given** the numbers section, **When** any figure is shown, **Then** its source and period sit next to it.

---

### User Story 3 - Engraving artwork in the hermes-agent manner (Priority: P2)

The page carries monochrome engravings (white line work on pure black) that melt into the site's warm near-black ground, the way hermes-agent's grayscale art melts into its blue.

**Why this priority**: The owner asked for it, and it is what separates a showcase from the project record. It is P2 because the images are generated outside this repository and arrive later.

**Independent Test**: With no image files declared, the page renders complete with no empty frames. With one declared, it appears with no visible edge against the ground.

**Acceptance Scenarios**:

1. **Given** a slot with no image in the record, **When** the page renders, **Then** the slot renders nothing and the layout closes the gap.
2. **Given** a declared image on pure black, **When** rendered, **Then** its black resolves to `--bg` and no box edge is visible.

---

### User Story 4 - Reach the showcase from the project record, and back (Priority: P2)

From `/works/vvv/` the visitor reaches `/vvv/` in one activation, and the reverse. The record, the showcase and the vvv legal pages state the same facts.

**Independent Test**: Click through both ways in both locales; compare the record's claims with the showcase and with `/privacy-policy/vvv/`.

**Acceptance Scenarios**:

1. **Given** `/works/vvv/`, **When** the visitor activates the showcase link, **Then** `/vvv/` opens (and `/pt/works/vvv/` opens `/pt/vvv/`).
2. **Given** `/works/mcp/`, **When** rendered, **Then** its showcase link still works, now driven by the same data field.

---

### User Story 5 - Answers to the obvious questions (Priority: P3)

A short FAQ answers: is the code public, does it post by itself, why there is no single command, and whether it promises reach.

**Independent Test**: Each answer opens and closes by keyboard alone, with scripting disabled.

### User Story 6 - Featured projects on the home page, one at a time (Priority: P2)

Added 2026-09-27: "na sessão http://localhost:4173/#featured coloque uma paginação ali pra irmos colocando varios projetos na home". The home page's featured card showed only H0wZy/mcp, hardcoded in `Home.tsx`. It now pages through every project that carries a featured card, vvv beside mcp.

**Independent Test**: On `/#featured`, activate `2`, then `→`, then Tab into the strip and press an arrow key; each shows the other card. Repeat with scripting disabled.

**Acceptance Scenarios**:

1. **Given** two featured projects, **When** the page loads, **Then** the first card shows with a pager `← 1 2 →`, `1` marked current.
2. **Given** a keyboard user, **When** they Tab into the strip, **Then** the visible card is outlined and the arrow keys move between cards.
3. **Given** a single featured project, **When** the page renders, **Then** no pager and no radio are rendered.

### Edge Cases

- No artwork yet, or only some of it: the page must look finished either way.
- Portuguese strings run longer than English: headings wrap, never overflow.
- The transcript is wider than a phone: it scrolls inside its own box.
- The record and the page drift apart: both read the same facts from data, and the page links to the record rather than repeating its long sections.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST emit `/vvv/` and `/pt/vvv/` as prerendered documents, with route metadata (title, description), hreflang alternates, and sitemap entries.
- **FR-002**: The page MUST be a static document: not imported by `src/App.tsx`, not hydrated, and adding 0 bytes to `dist/assets` JavaScript. Measured headroom on 2026-09-27 was 2.36 KiB; a hydrated page shaped like `/mcp/` costs about 4.6 KiB.
- **FR-003**: Every visitor-facing string MUST live in a typed content module under `src/content/`, in both locales, and MUST pass the punctuation gate.
- **FR-004**: The page MUST NOT link to the private repository, and MUST NOT name account handles, devices, proxies, credentials, spend figures, or third-party creators used as references.
- **FR-005**: Every number MUST carry its source and the period it covers, adjacent to it.
- **FR-006**: Each artwork slot MUST be optional. A declared image MUST carry width, height and bilingual alt text, MUST be served from outside `/assets/` (the immutable cache rule is for hashed files only), and only the hero image MAY load eagerly.
- **FR-007**: Artwork MUST blend with `mix-blend-mode: lighten`, and MUST NOT introduce a colour literal, a gradient, a glow or a blur.
- **FR-008**: Colour, type and space MUST come from `tokens.css`. The site keeps one font family; the hermes-agent display face is not adopted.
- **FR-009**: `/works/<id>/` MUST link a showcase from project data. The hardcoded `project.id === 'mcp'` block in `ProjectDetail` is replaced by that field, and mcp uses it too.
- **FR-010**: The vvv project record MUST be brought up to date so that record, showcase and legal pages agree.
- **FR-011**: The FAQ MUST use native `<details>`/`<summary>`.
- **FR-012**: The prompts used to generate the artwork MUST be recorded in this folder, so the images can be regenerated in the same style.
- **FR-013**: The home page's featured cards MUST come from project data (`Project.featured`), in the order `projects` lists them, so featuring a project is a data edit.
- **FR-014**: The featured strip MUST switch cards without JavaScript: a visually hidden radio group decides which card shows, a focused radio outlines its card, and the numbered labels and wrap-around arrows check the same radios for a pointer.

### Key Entities

- **Showcase record**: the page's copy and facts (hero, transcript, stages, rule, lanes, numbers, FAQ, artwork slots), one module, both locales.
- **Artwork slot**: an optional image with source path, dimensions and bilingual alt text.
- **Project showcase link**: a field on `Project` naming the showcase route and a one-line blurb.

## Success Criteria *(mandatory)*

- **SC-001**: `npm run build`, `npm test` and `npm run lint` pass, and the JavaScript total does not grow by more than 0.1 KB against `main`.
- **SC-002**: `/vvv/` and `/pt/vvv/` render complete with scripting disabled, at 360px and 1440px, with no horizontal page scroll.
- **SC-003**: The contrast gate passes, and no text sits on top of artwork.
- **SC-004**: The showcase is one activation from `/works/vvv/` and back, in both locales.
- **SC-005**: No string on the page names the repository URL, an account handle, a device, a proxy or a spend figure (checked by reading the record).

## Assumptions

- `/vvv/` mirrors `/mcp/`: the project record stays at `/works/vvv/`, the showcase gets the short URL.
- "Preto" means the site's own dark ground, not a new palette: the engravings are monochrome and the blend does the rest.
- Images come from `art-prompts.md`. The first set was generated in Google Flow on 2026-09-27 (see that file); ChatGPT with the same prompts remains the alternative.
