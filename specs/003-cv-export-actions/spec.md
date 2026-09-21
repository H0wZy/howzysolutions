# Feature Specification: CV Copy Page, Markdown/PDF Exports & Header Relocation

**Feature Branch**: `003-cv-export-actions`

**Created**: 2026-09-21

**Status**: Ready for Planning

**Input**: User description: "crie esse botão de copy page e view as markdown pra pagina https://howzysolutions.com/cv/ também, so que no dropdown ter duas opções: view as markdown e view as pdf, ai ter paginas: https://howzysolutions.com/cv.md e https://howzysolutions.com/cv.pdf, ai os links de download e fatos capturados são removidos la de baixo da pagina e passam a viver so la encima da pagina"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - One-Click Markdown Copy to Clipboard (Priority: P1)

A visitor or technical recruiter viewing the CV page at `/cv/` (or `/pt/cv/`) wants to feed the developer's entire resume into an LLM or markdown-based note system. They click the `[ Copy Page ]` button in the top header and instantly receive the complete structured curriculum vitae in Markdown format on their clipboard, accompanied by a brief visual confirmation ("Copied!").

**Why this priority**: Directly delivers the primary utility requested by visitors who want to ingest resume data into AI context windows and markdown tooling with zero friction.

**Independent Test**: Navigate to `/cv/`, click `[ Copy Page ]`, and paste clipboard content into a text editor. The pasted content begins with YAML frontmatter followed by complete, properly formatted Markdown sections matching the CV facts.

**Acceptance Scenarios**:

1. **Given** a visitor on `/cv/`, **When** clicking `[ Copy Page ]`, **Then** the English Markdown text of the CV is copied to the clipboard and the button text updates to "Copied!" for 2 seconds.
2. **Given** a visitor on `/pt/cv/`, **When** clicking `[ Copiar Página ]`, **Then** the Portuguese Markdown text of the CV is copied to the clipboard and the button text updates to "Copiado!" for 2 seconds.
3. **Given** a browser environment where the Async Clipboard API is rejected or unavailable, **When** clicking the copy button, **Then** a graceful fallback or direct link is presented without throwing unhandled exceptions.

---

### User Story 2 - Direct Markdown Document Endpoints (Priority: P1)

An engineer or automated script wants to fetch or inspect the developer's CV as plain text Markdown without scraping HTML. They open the dropdown beside `[ Copy Page ]` and click "View as Markdown", or directly navigate to `/cv.md` (or `/pt/cv.md`). The server serves a dedicated, clean Markdown document with frontmatter and structured sections.

**Why this priority**: Enables direct terminal access (`curl https://howzysolutions.com/cv.md`) and direct browser tabs for reading or linking, following modern developer portfolio standards.

**Independent Test**: Fetch `https://howzysolutions.com/cv.md` and verify it returns a valid Markdown document with status 200 and UTF-8 encoding.

**Acceptance Scenarios**:

1. **Given** a visitor on `/cv/`, **When** opening the action dropdown and selecting "View as Markdown", **Then** the browser opens `/cv.md` in a new tab.
2. **Given** a visitor on `/pt/cv/`, **When** opening the action dropdown and selecting "Ver como Markdown", **Then** the browser opens `/pt/cv.md` in a new tab.
3. **Given** a client requesting `/cv.md` or `/pt/cv.md`, **When** fetching via HTTP GET, **Then** a static text document is returned with complete experience, skills, and project data.

---

### User Story 3 - Clean PDF View & Download Actions (Priority: P2)

A recruiter or hiring manager wants to download or print an official PDF copy of the resume. They open the header action dropdown and select "Download PDF (EN)" or "Download PDF (PT-BR)", or click clean URLs `/cv.pdf` and `/pt/cv.pdf`. The browser displays or downloads the compiled LaTeX document immediately.

**Why this priority**: Preserves access to formal PDF resumes while standardizing URLs to clean, memorable routes (`/cv.pdf` instead of lengthy versioned filenames).

**Independent Test**: Navigate to `/cv.pdf` and `/pt/cv.pdf`; verify that both URLs correctly resolve to the compiled PDF documents without 404 errors.

**Acceptance Scenarios**:

1. **Given** a visitor on `/cv/`, **When** opening the action dropdown and selecting "Download PDF (EN)", **Then** the browser navigates to `/cv.pdf` and provides the English PDF.
2. **Given** a visitor on `/cv/` or `/pt/cv/`, **When** selecting "Download PDF (PT-BR)", **Then** the browser navigates to `/pt/cv.pdf` and provides the Brazilian Portuguese PDF.
3. **Given** a direct HTTP request to `/cv.pdf`, **When** requested, **Then** the response serves the English CV PDF with correct PDF mime type.
4. **Given** a direct HTTP request to `/pt/cv.pdf`, **When** requested, **Then** the response serves the Portuguese CV PDF with correct PDF mime type.

---

### User Story 4 - Relocate Capture Information & Clean Page Footer (Priority: P2)

A visitor scrolling through the CV should see all primary actions and provenance information at the top of the document where decisions are made. The bottom of the CV page no longer displays duplicate download buttons or the standalone commit capture badge; instead, the provenance stamp (`curriculum-vitae@commit • date`) is integrated cleanly into the top header block.

**Why this priority**: Eliminates visual clutter and redundant UI controls, ensuring the page feels cohesive and intentional.

**Independent Test**: Inspect the bottom of `/cv/` and `/pt/cv/`; confirm no download buttons or bottom provenance badges exist below the Education and Honors sections. Confirm the provenance stamp is present in the top header.

**Acceptance Scenarios**:

1. **Given** a visitor viewing `/cv/`, **When** scrolling to the bottom of the page, **Then** the document terminates cleanly after the final CV entry with no redundant download block.
2. **Given** a visitor viewing `/cv/`, **When** viewing the header area, **Then** the latest commit hash and capture date from `cv.generated.json` are visible alongside the title and export actions.

---

### Edge Cases

- **Clipboard Permission Denied**: If `navigator.clipboard.writeText` fails or is blocked by browser policy, the UI reverts the button state and offers a direct link to the `.md` file.
- **Prerender / SSR Discrepancy**: Dynamic timestamps or clock reads during render are strictly forbidden by Constitution Principle IV; all dates must come from `cv.generated.json` and `build.generated.json`.
- **Bundle Gate Constraint**: The interactive dropdown and copy button must not add heavyweight UI libraries or Lucide icon packages that exceed the remaining ~210 bytes of gzipped bundle budget.
- **Punctuation Rules**: Text copy in both English and Portuguese must not contain em dashes, en dashes, ` - `, or ` -- ` per constitutional rules.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST build and emit static `/cv.md` (canonical English) and `/pt/cv.md` (Brazilian Portuguese) during the production build step from `src/content/cv.generated.json`.
- **FR-002**: Generated Markdown files MUST include structured YAML frontmatter containing `title`, `description`, `canonical`, and `captured_at` metadata.
- **FR-003**: Generated Markdown files MUST render all CV sections in clean Markdown: summary, experience, skills, projects, education, certifications, and honors.
- **FR-004**: The system MUST provide clean URL routes `/cv.pdf` and `/pt/cv.pdf` pointing to the respective English and Portuguese PDF artifacts.
- **FR-005**: The CV page header on `/cv/` and `/pt/cv/` MUST include a `[ Copy Page ]` button and a companion dropdown trigger `[ ▾ ]`.
- **FR-006**: Clicking `[ Copy Page ]` MUST copy the current locale's complete CV Markdown content to the clipboard and display a localized "Copied!" confirmation.
- **FR-007**: The dropdown menu MUST provide links to:
  1. View as Markdown (`/cv.md` or `/pt/cv.md`)
  2. Download PDF (EN) (`/cv.pdf`)
  3. Download PDF (PT-BR) (`/pt/cv.pdf`)
- **FR-008**: The capture provenance stamp (`curriculum-vitae@<hash> on <date>`) MUST be displayed within the top header section of the CV page.
- **FR-009**: The bottom `CvDownloads` component and bottom capture stamp MUST be removed from the page layout.
- **FR-010**: All visitor-facing strings for the copy button, dropdown options, and confirmations MUST be defined in `src/content/i18n/en.ts` and `src/content/i18n/pt.ts` with complete type safety.
- **FR-011**: Total client-side JavaScript bundle size after changes MUST remain strictly under the 120.00 KB gzipped gate.
- **FR-012**: Color contrast of all new button and dropdown elements MUST satisfy WCAG AA (>= 4.5:1 for normal text).

### Key Entities

- **CvMarkdownDocument**: The static plain-text representation of the curriculum vitae, containing frontmatter metadata and structured sections in Markdown syntax.
- **CvActionMenu**: The interactive header component providing clipboard copy execution and a dropdown with direct document links.
- **CvProvenance**: The metadata entity representing the source git commit hash and capture timestamp of the CV facts.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Clicking `[ Copy Page ]` successfully copies the complete CV Markdown to the clipboard in under 200ms on desktop and mobile browsers.
- **SC-002**: Direct HTTP GET requests to `/cv.md` and `/pt/cv.md` return HTTP 200 with the full text content and valid YAML frontmatter.
- **SC-003**: Direct HTTP GET requests to `/cv.pdf` and `/pt/cv.pdf` return HTTP 200 or 302 resolving to valid PDF binaries.
- **SC-004**: `npm run build` completes successfully with `scripts/check-bundle.mjs` verifying total client JS is <= 120.00 KB gzipped.
- **SC-005**: `npm test` passes 100% of test suites, including contrast verification and punctuation rules.

## Assumptions

- The compiled PDF files are already present in `public/cv/` (`ENG_CV_Marcos_Junior_Bueno_Selzler.pdf` and `PTBR_CV_Marcos_Junior_Bueno_Selzler.pdf`) or can be mirrored cleanly.
- The `curriculum-vitae` repository is the source of truth for the CV facts, and compilation of fresh PDFs is handled by CI/CD automation in that repository.
- Visitors expect standard `/cv.md` and `/cv.pdf` URLs rather than nested extension paths like `/cv.md/eng`.
