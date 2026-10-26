export const WAKATIME_BLOCKLIST: string[]
export function dropBlocked<T extends { name: string }>(slices: T[]): T[]
export function replaceLiteral(html: string, pattern: string | RegExp, value: string): string
export function isValidReleaseTag(tag: unknown): boolean
