/**
 * Pure guards shared by the build scripts, kept apart so tests can import
 * them (the scripts themselves run on import).
 */

/**
 * WakaTime project names that never reach the committed artifact or the page.
 * The owner's call on 2026-10-26: this project is no longer his, so its name
 * goes; every other tracked name may stay public.
 */
export const WAKATIME_BLOCKLIST = ['former-project']

/** Drops every slice whose name is on the blocklist. */
export function dropBlocked(slices) {
  return slices.filter((s) => !WAKATIME_BLOCKLIST.includes(s.name))
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
