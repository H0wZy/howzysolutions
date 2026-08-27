/**
 * Content schema. Principle I: this is the shape every surface reads — the list,
 * the project page, and the terminal — so a fact is authored exactly once (FR-010).
 *
 * Closed sets are `const` objects plus `keyof typeof` unions rather than `enum`,
 * because `erasableSyntaxOnly` is on (research D11).
 */

import type { Locale, Localized } from './i18n/types'
import type { StringKey } from './i18n/en'

/* -- Vocabularies --------------------------------------------------------- */

export const PROJECT_KIND = {
  client: 'kind.client',
  product: 'kind.product',
  study: 'kind.study',
  tooling: 'kind.tooling',
  training: 'kind.training',
} as const satisfies Record<string, StringKey>
export type ProjectKind = keyof typeof PROJECT_KIND

/**
 * Ordered by strength of claim. A project takes the WEAKEST value it honestly
 * satisfies — the whole point of the vocabulary is preventing overstatement (FR-003).
 */
export const PROJECT_STATE = {
  production: 'state.production',
  delivered: 'state.delivered',
  functional: 'state.functional',
  'in-progress': 'state.inProgress',
  skeleton: 'state.skeleton',
} as const satisfies Record<string, StringKey>
export type ProjectState = keyof typeof PROJECT_STATE

export const TECH_CATEGORY = {
  language: 'language',
  framework: 'framework',
  data: 'data',
  infra: 'infra',
  ai: 'ai',
  tooling: 'tooling',
} as const
export type TechCategory = keyof typeof TECH_CATEGORY

export const STACK_GROUP = {
  frontend: 'stack.frontend',
  backend: 'stack.backend',
  infra: 'stack.infra',
  other: 'stack.other',
} as const satisfies Record<string, StringKey>
export type StackGroupName = keyof typeof STACK_GROUP

/* -- Records -------------------------------------------------------------- */

export type Technology = {
  id: string
  name: string
  category: TechCategory
}

export type StackGroup = {
  group: StackGroupName
  items: string[]
}

/** A measured figure. `source` is mandatory: no number is published unattributed. */
export type Metric = {
  label: Localized
  value: string
  source: Localized
}

export type ProjectLink = {
  kind: 'repo' | 'live'
  href: string
  label: string
}

export type ProjectImage = {
  src: string
  alt: Localized
}

export type Project = {
  id: string
  name: string
  kind: ProjectKind
  state: ProjectState
  context?: Localized
  period: { start: string; end: string }
  commits: number
  summary: Localized
  problem: Localized
  capabilities: Localized<string[]>
  stack: StackGroup[]
  development: Localized<string[]>
  /** Non-empty, always. A project with no stated limitation is incomplete content (FR-004). */
  limitations: Localized<string[]>
  roadmap?: Localized<string[]>
  metrics?: Metric[]
  links?: ProjectLink[]
  /** Joins to a name in the statistics snapshot. */
  wakatimeProject?: string
  images?: ProjectImage[]
}

export type Contact = {
  kind: 'email' | 'github' | 'linktree'
  href: string
  label: string
  labelKey: StringKey
}

export type AuthorProfile = {
  name: string
  handle: string
  tagline: Localized
  bio: Localized<string[]>
  /** Duration is derived at build time, never stored (FR-007). */
  experienceStart: string
  location: Localized
  contacts: Contact[]
}

export type StatSlice = {
  name: string
  percent: number
  seconds: number
  text: string
}

export type CodingStatsSnapshot = {
  capturedAt: string
  /** Mandatory: every rendered figure cites this (FR-027). */
  range: { start: string; end: string }
  totalSeconds: number
  humanReadableTotal: string
  dailyAverageSeconds: number
  languages: StatSlice[]
  editors: StatSlice[]
  categories: StatSlice[]
  projects: StatSlice[]
  isFallback: boolean
}

export type ContentBundle = {
  profile: AuthorProfile
  projects: Project[]
  technologies: Technology[]
  stats: CodingStatsSnapshot
  /** One module, read by the page, the rail and the terminal alike (FR-067). */
  cv: CvView
}

/** One day of the public code contribution calendar (data-model.md). */
export type ContributionDay = {
  date: string
  count: number
}

/**
 * The committed, build-time capture. Mirrors `CodingStatsSnapshot` field for
 * field wherever the two share a concept, so the two sources read as
 * siblings in the code even though they must never read as siblings on the
 * page (FR-039, research D11).
 */
export type ContributionCalendar = {
  capturedAt: string
  /** Mandatory: the trailing-year window the grid actually covers. */
  window: { start: string; end: string }
  /** The source's own figure. Never recomputed by summing `days` (FR-040). */
  totalContributions: number
  includesPrivate: boolean
  /** Ascending by date. May contain gaps; gaps are not filled. */
  days: ContributionDay[]
  isFallback: boolean
}

/* -- Derived helpers ------------------------------------------------------ */

/** Entries per work listing page (FR-015). */
export const PAGE_SIZE = 5

export type WorkPage = {
  /** 1-based, and always a valid page — never below 1 or above `total`. */
  number: number
  /** A contiguous slice, at most `PAGE_SIZE` long, preserving published order. */
  projects: Project[]
  total: number
}

/**
 * Slices `projects` into page `requested`, clamping to the nearest valid page
 * rather than rendering an empty listing for a deep link to a shrunken set
 * (data-model.md, WorkPage rule 3).
 */
export function workPage(projects: Project[], requested: number): WorkPage {
  const total = Math.max(1, Math.ceil(projects.length / PAGE_SIZE))
  const number = Math.min(Math.max(1, requested), total)
  const start = (number - 1) * PAGE_SIZE
  return { number, projects: projects.slice(start, start + PAGE_SIZE), total }
}

/* -- CV record ------------------------------------------------------------ */

/*
 * The professional record, generated from the CV repository's LaTeX source by
 * scripts/extract-cv.mjs (CL-004 option B). A Project record answers "what was
 * built"; a CV entry answers "under whom, and when".
 *
 * `kind` is what resolves the `\entry{1}{2}{3}{4}` overload in the source: the
 * same four arguments mean "role, dates, title, location" inside Professional
 * Experience and "award, date, project, link" inside Awards. The parser is
 * section-driven and so is the renderer (research D5).
 */
export const CV_SECTION_KIND = {
  experience: 'experience',
  awards: 'awards',
  skills: 'skills',
  projects: 'projects',
  education: 'education',
  certifications: 'certifications',
} as const
export type CvSectionKind = keyof typeof CV_SECTION_KIND

export type CvLink = { href: string; label: Localized }

export type CvRole = {
  employer: string
  client: string | null
  title: Localized
  location: Localized
  /** `YYYY-MM`. */
  start: string
  /** `null` IS the ongoing state — never a flag, never a computed date (FR-055). */
  end: string | null
  responsibilities: Localized<string[]>
}

export type CvAward = {
  title: Localized
  date: string
  project: Localized
  evidence: CvLink
  detail: Localized<string[]>
}

export type CvSkillGroup = {
  label: Localized
  items: Localized<string[]>
  order: number
}

export type CvProjectEntry = {
  /** Localized because the CV bolts a translated descriptor onto a proper noun. */
  name: Localized
  links: CvLink[]
  detail: Localized<string[]>
}

export type CvEducation = {
  degree: Localized
  /** `YYYY`. The CV carries completion only; the start is site-held (FR-081). */
  end: string
  institution: string
  location: Localized
}

export type CvCertification = {
  name: string
  date: string
  subject: Localized
  issuer: CvLink
  detail: Localized<string[]>
}

export type CvEntry =
  | CvRole
  | CvAward
  | CvSkillGroup
  | CvProjectEntry
  | CvEducation
  | CvCertification

export type CvSection = {
  /** Slug of the English title. The anchor the rail links to (D10). */
  id: string
  kind: CvSectionKind
  title: Localized
  entries: CvEntry[]
}

/** One downloadable file per language, measured at extraction (FR-059, FR-060). */
export type CvDocument = {
  locale: Locale
  filename: string | null
  /** Same origin only (FR-061). `null` when the file was absent at extraction. */
  href: string | null
  bytes: number
  present: boolean
}

export type CvRecord = {
  capturedAt: string
  /** The CV commit this artifact was generated from (FR-080). */
  sourceCommit: string
  sourceRef: string
  /** True when extraction could not reach the source and the committed copy stands. */
  isFallback: boolean
  headline: Localized
  summary: Localized
  documents: CvDocument[]
  /** Document order. Drives both the page and the rail (D10). */
  sections: CvSection[]
}

/**
 * What every surface actually reads: the extracted record, plus the small set
 * of facts this site holds and the CV does not, kept at a visible seam rather
 * than merged into it (FR-081, data-model.md three-layer split).
 */
export type CvView = CvRecord & {
  /**
   * Authored in THIS repository, not extracted. Keyed by institution. The CV
   * dates the degree by completion only; FR-063 needs the 2023 start, because
   * that start is what the home page's figure counts (D7).
   */
  educationStart: Record<string, string>
  /**
   * CV project name to the id of a record in src/content/projects/. Where it
   * resolves, the page links that record and suppresses the extracted
   * description, so a project with a page is referenced and never restated
   * (FR-064, D9).
   */
  projectIds: Record<string, string>
}

export type ExperienceDuration = { years: number; months: number }

/**
 * Whole years and months between the start date and `now`. Recomputed on every
 * build so the figure is correct without anyone editing it (FR-007).
 */
export function experienceSince(startISO: string, now: Date = new Date()): ExperienceDuration {
  const start = new Date(`${startISO}T00:00:00Z`)
  let years = now.getUTCFullYear() - start.getUTCFullYear()
  let months = now.getUTCMonth() - start.getUTCMonth()
  if (now.getUTCDate() < start.getUTCDate()) months -= 1
  if (months < 0) {
    years -= 1
    months += 12
  }
  return { years, months }
}
