export const WAKATIME_BLOCKLIST: string[]
export function nameDigest(name: string): string
export function dropBlocked<T extends { name: string }>(slices: T[], blocklist?: string[]): T[]
export function replaceLiteral(html: string, pattern: string | RegExp, value: string): string
export function isValidReleaseTag(tag: unknown): boolean
