// Types for the build script's pure half, so the privacy test under src/ can
// import it under `strict`. The period it produces IS the site's type.
import type { ActivityPeriod } from '../src/content/types'

export type MonthRange = { month: string; from: string; to: string }
export type PeriodWindow = { start: string; end: string; offset: string; months: MonthRange[] }

export function addDays(iso: string, n: number): string
export function utcOffsetOf(startedAt: string): string
export function localDate(instant: string, offset: string): string
export function monthRanges(start: string, end: string): MonthRange[]
export function periodQuery(options: { from?: string; to?: string; offset?: string; months: MonthRange[] }): string
export function toPeriod(user: unknown, window: PeriodWindow): { period: ActivityPeriod; privateNames: Set<string> }
export function namesIn(artifact: { periods: Record<string, ActivityPeriod> }): Set<string>
export function assertNoPrivateNames(artifact: { periods: Record<string, ActivityPeriod> }, privateNames: Set<string>): void
