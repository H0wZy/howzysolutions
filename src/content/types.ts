/**
 * Content schema. Principle I: this is the shape every surface reads — the list,
 * the project page, and the terminal — so a fact is authored exactly once (FR-010).
 *
 * Closed sets are `const` objects plus `keyof typeof` unions rather than `enum`,
 * because `erasableSyntaxOnly` is on (research D11).
 */

import type { Localized } from './i18n/types'
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
