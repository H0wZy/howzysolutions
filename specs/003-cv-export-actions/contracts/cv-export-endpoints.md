# Contract: CV Export Endpoints & Actions

**Feature**: `003-cv-export-actions`
**Spec**: [spec.md](../spec.md)

## HTTP Static Endpoints

### 1. English CV Markdown (`/cv.md`)
- **Method**: `GET`
- **Path**: `/cv.md`
- **Content-Type**: `text/markdown; charset=utf-8`
- **Cache-Control**: `public, max-age=3600`
- **Content Schema**:
  ```markdown
  ---
  title: Marcos Junior Bueno Selzler - Curriculum Vitae
  description: Software engineer building AI systems and developer tooling.
  canonical: https://howzysolutions.com/cv
  captured_at: 2026-09-21
  commit: b71e83e
  ---

  # Marcos Junior Bueno Selzler
  ...
  ```

### 2. Portuguese CV Markdown (`/pt/cv.md`)
- **Method**: `GET`
- **Path**: `/pt/cv.md`
- **Content-Type**: `text/markdown; charset=utf-8`
- **Cache-Control**: `public, max-age=3600`

### 3. English CV PDF (`/cv.pdf`)
- **Method**: `GET`
- **Path**: `/cv.pdf`
- **Target**: `302 /cv/ENG_CV_Marcos_Junior_Bueno_Selzler.pdf` (or direct 200 static file)
- **Content-Type**: `application/pdf`

### 4. Portuguese CV PDF (`/pt/cv.pdf`)
- **Method**: `GET`
- **Path**: `/pt/cv.pdf`
- **Target**: `302 /cv/PTBR_CV_Marcos_Junior_Bueno_Selzler.pdf` (or direct 200 static file)
- **Content-Type**: `application/pdf`

## UI Component Contract: `CvHeaderActions`

### Props:
- `locale`: `'en' | 'pt'`
- `provenance`: `{ commit: string; date: string }`

### User Interactions:
1. `onClick` Primary Button:
   - Reads pre-compiled markdown text or fetches `/cv.md`
   - Invokes `navigator.clipboard.writeText(content)`
   - Triggers `copied = true` for 2000ms
2. `onClick` Dropdown Trigger:
   - Toggles dropdown menu containing links:
     - View as Markdown (target: `_blank`, href: `/cv.md` or `/pt/cv.md`)
     - Download PDF EN (href: `/cv.pdf`)
     - Download PDF PT-BR (href: `/pt/cv.pdf`)
