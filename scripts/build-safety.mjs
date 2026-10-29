/**
 * Pure guards shared by the build scripts, kept apart so tests can import
 * them (the scripts themselves run on import).
 */
import { createHash } from 'node:crypto'

/**
 * SHA-256 of the WakaTime project names that never reach the committed
 * artifact or the page. The owner's call on 2026-10-26: that project is no
 * longer his, so its name goes; every other tracked name may stay public.
 * A digest rather than the name, so the guard does not publish what it hides.
 */
export const WAKATIME_BLOCKLIST = ['f46277d593499ebfea4163c67dbdfea928bb857e50d24cf39e65333f74c0d479']

/** The digest a project name is listed by. */
export function nameDigest(name) {
  return createHash('sha256').update(name).digest('hex')
}

/** Drops every slice whose name is on the blocklist. */
export function dropBlocked(slices, blocklist = WAKATIME_BLOCKLIST) {
  return slices.filter((s) => !blocklist.includes(nameDigest(s.name)))
}

/**
 * String.replace with a literal replacement: a function result is not parsed
 * for `$&`, `$$`, `` $` `` or `$'`, which a plain string replacement is.
 */
export function replaceLiteral(html, pattern, value) {
  return html.replace(pattern, () => value)
}

const RELEASE_TAG = /^v?\d+\.\d+\.\d+(-[\w.]+)?$/

/** A release tag that is safe to write into markdown and JSON. */
export function isValidReleaseTag(tag) {
  return typeof tag === 'string' && RELEASE_TAG.test(tag)
}
