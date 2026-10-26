export type Normalised = {
  lang: string | null
  title: string | null
  text: string
  canonical: string | null
  hreflang: string
  description: string | null
}
export type Diff = { field: string; a: string; b: string }
export type Page = { status: number | string; html: string }
export type AllowEntry = { url: string; field: string; reason: string }

export function decodeEntities(s: string): string
export function visibleText(html: string): string
export function normalise(html: string): Normalised
export function diffPages(a: Page, b: Page): Diff[]
export function firstDiff(a: string, b: string): number
export function formatDiff(url: string, d: Diff): string
export function applyAllow(url: string, diffs: Diff[], allow: AllowEntry[]): Diff[]
export function sitemapPaths(xml: string): string[]
