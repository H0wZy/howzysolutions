/**
 * The contact form's shared facts. No imports on purpose: the Worker in
 * src/server/contact.ts imports this file too, and the limits are what keep the page
 * and the server from disagreeing about what a valid submission is.
 */

/**
 * Cloudflare Turnstile site key. Public by design: it is sent to every browser
 * that loads the widget, unlike the secret that checks the answer, which only
 * ever lives in `wrangler secret` (TURNSTILE_SECRET).
 *
 * Empty until the owner creates the widget for howzysolutions.com in the
 * Cloudflare dashboard and pastes the site key here. While it is empty the page
 * shows the plain email routes instead of a form that could never pass the
 * check, and the Worker fails closed without the secret.
 */
export const TURNSTILE_SITE_KEY = ''

/** Where the form posts, and the one Worker route that exists. */
export const CONTACT_ENDPOINT = '/api/contact/'

/** The services a visitor can tick. Ids match src/content/services.ts. */
export const SERVICE_IDS = ['web', 'ai', 'infra', 'games'] as const
export type ServiceId = (typeof SERVICE_IDS)[number]

/** Server-side ceilings, in characters. The page mirrors them as maxlength. */
export const CONTACT_LIMITS = { name: 80, email: 254, problem: 4000 } as const
