import type { Locale } from './i18n/types'
import type { CvRecord, CvSection, CvView } from './types'
import raw from './cv.generated.json'

/**
 * The CV as data.
 *
 * THREE KINDS OF FACT LIVE IN THREE PLACES, and the boundary between them is
 * what keeps CL-004's "one authority" claim true:
 *
 *   Extracted  cv.generated.json   Everything the CV says. Written by
 *                                  scripts/extract-cv.mjs, never hand-edited.
 *   Site-held  AUGMENTATION below  The few facts this site must state that the
 *                                  CV does not carry (FR-081).
 *   Typed view this file's export  Validates the artifact at import, merges the
 *                                  two at a documented seam.
 *
 * A field never appears in two layers. Where the site holds something the CV
 * also has, the CV wins and the site-held copy is deleted — that is the whole
 * point of having chosen a parser over a transcription.
 *
 * Contract: specs/003-cv-experience-page/contracts/cv-artifact.md
 */

/* -- Site-held layer ------------------------------------------------------ */

/**
 * NOT CV FACTS. Everything here is authored in this repository, and the render
 * says so where it matters (FR-081).
 */
const AUGMENTATION = {
  /**
   * The CV's education entry is `\entry{...}{2025}{Unicesumar}{...}` —
   * completion year only. FR-063 requires the degree's 2023 start, because
   * that start is what the home page's "in IT since 2023" figure counts.
   *
   * The durable fix is a one-token edit in main.tex (`{2025}` ->
   * `{2023 -- 2025}`), after which this field loses its only member and should
   * be deleted. Recorded in research.md D7 so whoever deletes it knows why it
   * was here.
   */
  educationStart: { Unicesumar: '2023' } as Record<string, string>,

  /**
   * CV project name (English arm) -> Project.id in src/content/projects/.
   * A map rather than a name-match heuristic, because "Telas Paraná:
   * Institutional Website" and the project record's `name` are not the same
   * string and never will be (D9).
   */
  projectIds: { 'Telas Paraná: Institutional Website': 'telasparana' } as Record<string, string>,
}

/* -- Validation ----------------------------------------------------------- */

/**
 * Degrades rather than throws, mirroring stats.ts (V7). A malformed artifact
 * is a build-time mistake this file cannot fix; what it can do is refuse to
 * render half a record as if it were whole.
 *
 * Note the asymmetry with extraction, which is the failure contract restated:
 * ABSENCE DEGRADES, CORRUPTION FAILS. Corruption is caught upstream, at
 * extraction, where the line number still exists.
 */
const EMPTY: CvRecord = {
  capturedAt: '1970-01-01T00:00:00.000Z',
  sourceCommit: 'unknown',
  sourceRef: '',
  isFallback: true,
  headline: { en: '', pt: '' },
  summary: { en: '', pt: '' },
  documents: [],
  sections: [],
}

function isLocalized(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false
  const pair = value as Record<string, unknown>
  return typeof pair.en === 'string' && typeof pair.pt === 'string'
}

function isSection(value: unknown): value is CvSection {
  if (typeof value !== 'object' || value === null) return false
  const section = value as Record<string, unknown>
  return (
    typeof section.id === 'string' &&
    typeof section.kind === 'string' &&
    isLocalized(section.title) &&
    Array.isArray(section.entries)
  )
}

function validate(value: unknown): CvRecord {
  if (typeof value !== 'object' || value === null) return EMPTY
  const record = value as Record<string, unknown>
  if (!isLocalized(record.headline) || !isLocalized(record.summary)) return EMPTY
  if (!Array.isArray(record.sections) || !record.sections.every(isSection)) return EMPTY
  if (!Array.isArray(record.documents)) return EMPTY
  return record as unknown as CvRecord
}

/* -- The one export every surface reads ----------------------------------- */

export const cv: CvView = { ...validate(raw), ...AUGMENTATION }

/**
 * The degree's range as the page states it: the CV's completion year, and the
 * start this site holds. Returns the bare completion year when no site-held
 * start exists, so a new institution never silently gains an invented date.
 *
 * An unspaced hyphen, not an en dash and not ` - `. Both of those are what
 * punctuation.test.ts exists to keep off visitor-facing pages, and a year
 * range is the one place a bare hyphen reads correctly on its own.
 */
export function educationRange(institution: string, end: string): string {
  const start = cv.educationStart[institution]
  return start && start !== end ? `${start}-${end}` : end
}

/** The project record this CV entry already has a page for, if any (FR-064). */
export function projectIdFor(name: string): string | undefined {
  return cv.projectIds[name]
}

/** Rail entries: derived from the record, never from scraped headings (D10). */
export function railEntries(record: CvView = cv) {
  return record.sections.map((section) => ({ id: section.id, label: section.title }))
}

/**
 * The document for a locale, or undefined when it was absent at extraction.
 * An absent file renders no control at all rather than a link to a 404
 * (FR-060).
 */
export function documentFor(locale: Locale, record: CvView = cv) {
  const doc = record.documents.find((d) => d.locale === locale)
  return doc?.present ? doc : undefined
}
