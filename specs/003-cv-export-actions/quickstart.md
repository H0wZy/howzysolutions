# Quickstart & Verification: CV Copy Page, Markdown/PDF Exports & Header Relocation

**Feature**: `003-cv-export-actions`
**Spec**: [spec.md](./spec.md)

## Validation Scenarios

### 1. Build Verification
Run the complete build pipeline:
```bash
npm run build
```
Verify that:
1. `public/cv.md` and `public/pt/cv.md` are generated.
2. `dist/cv.md` and `dist/pt/cv.md` exist and contain structured YAML frontmatter.
3. `dist/cv.pdf` and `dist/pt/cv.pdf` are reachable via redirects or static files.
4. `scripts/check-bundle.mjs` passes with bundle size strictly <= 120.00 KB gzipped.

### 2. Test Suite
Run the test suite:
```bash
npm test
```
Verify:
1. All Vitest tests pass (`npm run test:unit`).
2. WCAG contrast check passes (`node scripts/check-contrast.mjs`).
3. No forbidden punctuation in visitor-facing strings (`punctuation.test.ts`).

### 3. Interactive Verification
Start the preview server:
```bash
npm run preview
```
1. Visit `http://localhost:4173/cv`:
   - Click `[ Copy Page ]` -> verify clipboard contains full English Markdown and button displays "Copied!".
   - Click `[ ▾ ]` -> verify dropdown opens with "View as Markdown" and "Download PDF" options.
   - Click "View as Markdown" -> opens `/cv.md`.
   - Click "Download PDF (EN)" -> opens/downloads `/cv.pdf`.
   - Verify bottom section of the CV page has no duplicate download links or commit badges.
   - Verify header shows provenance badge (`curriculum-vitae@...`).
2. Visit `http://localhost:4173/pt/cv`:
   - Verify all buttons and dropdown items are in Portuguese.
   - Click `[ Copiar Página ]` -> verify clipboard contains Portuguese Markdown.
