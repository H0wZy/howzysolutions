# Data Model: CV Copy Page, Markdown/PDF Exports & Header Relocation

**Feature**: `003-cv-export-actions`
**Spec**: [spec.md](./spec.md)

## Entities

### 1. CvMarkdownDocument

Represents the generated Markdown file emitted to disk (`/cv.md` or `/pt/cv.md`).

| Field | Type | Description |
|---|---|---|
| `frontmatter.title` | `string` | e.g. "Marcos Junior Bueno Selzler - Curriculum Vitae" |
| `frontmatter.description` | `string` | Headline and professional summary |
| `frontmatter.canonical` | `string` | `https://howzysolutions.com/cv` (or `/pt/cv`) |
| `frontmatter.captured_at` | `string` | Provenance timestamp (e.g. `2026-09-21`) |
| `frontmatter.commit` | `string` | Provenance commit hash from `curriculum-vitae` |
| `content` | `string` | Structured Markdown body including Experience, Skills, Education, Projects, and Honors |

### 2. CvHeaderActionState

Represents the client-side state of the header action widget.

| Field | Type | Description |
|---|---|---|
| `copied` | `boolean` | `true` when copy action succeeded; reverts to `false` after 2000ms |
| `menuOpen` | `boolean` | `true` when the action dropdown menu is displayed |
| `locale` | `'en' \| 'pt'` | Current page locale determining the copy content and links |

### 3. CvProvenance

Represents the metadata connecting the rendered page and markdown documents to the source LaTeX repository.

| Field | Type | Description |
|---|---|---|
| `sourceRepository` | `string` | `H0wZy/curriculum-vitae` |
| `commit` | `string` | Short git commit SHA (e.g. `b71e83e`) |
| `date` | `string` | ISO Date (e.g. `2026-09-21`) |
