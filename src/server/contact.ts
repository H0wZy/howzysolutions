/**
 * The contact form's server side: what `POST /api/contact` does, with every
 * outside thing (Turnstile, Resend, D1, KV, the clock) passed in, so tests run
 * it end to end against fakes and the route handler is four lines.
 *
 * A submission has to pass these gates, in this order, and fails closed at each:
 *   1. shape and size (a form body, the same origin, the ceilings of
 *      src/content/contact.ts);
 *   2. the honeypot, which answers "sent" to a bot and stores and mails nothing;
 *   3. Cloudflare Turnstile, checked here with TURNSTILE_SECRET;
 *   4. the per-IP limit, 3 an hour, a counter in KV;
 *   5. D1, where the message is kept 90 days, then Resend, which mails it to the
 *      owner (CONTACT_TO).
 *
 * The secrets are Worker secrets, never in a file, an argument or a log, and
 * nothing a visitor typed is logged either: the message lives in D1 and in the
 * owner's inbox, and nowhere else.
 *
 * It answers twice. With `Accept: application/json` (the page's fetch) it returns
 * `{ ok }` or `{ error }`. Without (a plain form POST, scripting off) it
 * redirects with 303 to the services page, naming the outcome in the fragment,
 * where the page shows it with :target.
 */
import { CONTACT_LIMITS, SERVICE_IDS } from '../content/contact'

/** The slice of a D1 database this module uses. */
export interface D1Like {
  prepare(query: string): { bind(...values: unknown[]): { run(): Promise<unknown> } }
}

/** The slice of a KV namespace this module uses. */
export interface KVLike {
  get(key: string): Promise<string | null>
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>
}

export interface ContactEnv {
  RESEND_API_KEY?: string
  TURNSTILE_SECRET?: string
  CONTACT_TO?: string
  /** Not a secret: the sender shown on the mail. Must be a domain verified in Resend. */
  CONTACT_FROM?: string
  DB?: D1Like
  RATE_LIMIT?: KVLike
}

export type Outcome = 'sent' | 'invalid' | 'spam' | 'rate' | 'failed'

const STATUS: Record<Outcome, number> = { sent: 200, invalid: 422, spam: 403, rate: 429, failed: 502 }

/** A form this site sends is a few hundred bytes plus the message. */
const MAX_BODY = 32 * 1024

/** Three accepted submissions per IP per hour (spec 006, US6). */
export const RATE_LIMIT = { max: 3, windowSeconds: 3600 } as const

/** A message is kept this long, then deleted (FR-015). */
export const RETENTION_DAYS = 90

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const RESEND = 'https://api.resend.com/emails'
const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]+$/

/** One line, no control characters: safe in a subject and in the plain-text body. */
const oneLine = (value: string) =>
  Array.from(value, (c) => (c.charCodeAt(0) < 32 || c.charCodeAt(0) === 127 ? ' ' : c))
    .join('')
    .trim()

type Doer = typeof fetch

function reply(outcome: Outcome, wantsJson: boolean, lang: 'en' | 'pt'): Response {
  if (wantsJson) {
    const body = outcome === 'sent' ? { ok: true } : { ok: false, error: outcome }
    return Response.json(body, { status: STATUS[outcome], headers: { 'Cache-Control': 'no-store' } })
  }
  const base = lang === 'pt' ? '/pt/services/' : '/services/'
  return new Response(null, {
    status: 303,
    headers: { Location: `${base}#${outcome}`, 'Cache-Control': 'no-store' },
  })
}

function text(form: FormData, key: string): string | null {
  const value = form.get(key)
  return typeof value === 'string' ? value : null
}

async function turnstileOk(token: string, secret: string, ip: string | null, doFetch: Doer): Promise<boolean | 'error'> {
  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.set('remoteip', ip)
  try {
    const res = await doFetch(SITEVERIFY, { method: 'POST', body })
    if (!res.ok) return 'error'
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return 'error'
  }
}

/**
 * The IP as a keyed hash: the table and the rate-limit key never hold an address.
 * Keyed with the Turnstile secret so the digest cannot be reversed by hashing
 * every IPv4 address.
 */
export async function hashIp(ip: string, key: string): Promise<string> {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(ip)))
  return Array.from(sig.slice(0, 16), (b) => b.toString(16).padStart(2, '0')).join('')
}

export async function handleContact(
  request: Request,
  env: ContactEnv,
  doFetch: Doer = fetch,
  now: () => number = () => Date.now(),
): Promise<Response> {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json')

  // A cross-site page must not be able to post through a visitor's browser.
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) return new Response('Forbidden', { status: 403 })

  const type = request.headers.get('content-type') ?? ''
  if (!/^(application\/x-www-form-urlencoded|multipart\/form-data)/i.test(type)) {
    return new Response('Unsupported media type', { status: 415 })
  }
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY) {
    return new Response('Payload too large', { status: 413 })
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return reply('invalid', wantsJson, 'en')
  }
  const lang = text(form, 'lang') === 'pt' ? 'pt' : 'en'
  const fail = (outcome: Outcome) => reply(outcome, wantsJson, lang)

  // A person never sees this field. A bot that fills it is told it worked.
  if ((text(form, 'website') ?? '') !== '') return fail('sent')

  const name = oneLine(text(form, 'name') ?? '')
  const email = oneLine(text(form, 'email') ?? '')
  const problem = (text(form, 'problem') ?? '').replace(/\r\n/g, '\n').trim()
  const picked = form.getAll('service')
  if (
    !name ||
    name.length > CONTACT_LIMITS.name ||
    !email ||
    email.length > CONTACT_LIMITS.email ||
    !EMAIL.test(email) ||
    !problem ||
    problem.length > CONTACT_LIMITS.problem ||
    picked.some((s) => typeof s !== 'string' || !(SERVICE_IDS as readonly string[]).includes(s))
  ) {
    return fail('invalid')
  }

  const token = text(form, 'cf-turnstile-response') ?? ''
  if (!token || token.length > 2048) return fail('spam')

  // Not configured is a failure of ours, and says so without saying why.
  const { TURNSTILE_SECRET, RESEND_API_KEY, CONTACT_TO, DB, RATE_LIMIT: kv } = env
  if (!TURNSTILE_SECRET || !RESEND_API_KEY || !CONTACT_TO || !DB || !kv) {
    console.error('contact: a secret or a binding is not set')
    return fail('failed')
  }

  const ip = request.headers.get('cf-connecting-ip')
  const human = await turnstileOk(token, TURNSTILE_SECRET, ip, doFetch)
  if (human === 'error') return fail('failed')
  if (!human) return fail('spam')

  const ipHash = await hashIp(ip ?? 'unknown', TURNSTILE_SECRET)
  const key = `contact:${ipHash}`
  // Eventually consistent, so a burst from several edge locations can slip one
  // past the limit; the per-IP bound is for bots that are not that patient.
  const used = Number((await kv.get(key)) ?? 0)
  if (used >= RATE_LIMIT.max) return fail('rate')

  const services = [...new Set(picked as string[])]
  const at = Math.floor(now() / 1000)
  const id = crypto.randomUUID()
  try {
    // Retention is enforced where the writes already are: every submission also
    // drops what is older than 90 days, so no scheduled job has to exist.
    await DB.prepare('DELETE FROM contact_messages WHERE created_at < ?')
      .bind(at - RETENTION_DAYS * 86400)
      .run()
    await DB.prepare(
      'INSERT INTO contact_messages (id, name, email, services, body, lang, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    )
      .bind(id, name, email, services.join(','), problem, lang, ipHash, at)
      .run()
    await kv.put(key, String(used + 1), { expirationTtl: RATE_LIMIT.windowSeconds })
  } catch {
    console.error('contact: the database refused the message')
    return fail('failed')
  }

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Services: ${services.length ? services.join(', ') : 'none picked'}`,
    `Language: ${lang}`,
    '',
    problem,
  ]
  try {
    const res = await doFetch(RESEND, {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.CONTACT_FROM ?? 'howzysolutions <contact@howzysolutions.com>',
        to: [CONTACT_TO],
        reply_to: email,
        subject: `howzysolutions: ${name}`.slice(0, 120),
        text: lines.join('\n'),
      }),
    })
    if (res.ok) {
      await DB.prepare('UPDATE contact_messages SET notified_at = ? WHERE id = ?').bind(at, id).run()
    } else {
      console.error(`contact: resend answered ${res.status}`)
    }
  } catch {
    console.error('contact: resend was unreachable')
  }
  // The message is in D1 whatever Resend did, so the visitor is not asked to send
  // it again; `notified_at` stays empty for any that never reached the inbox.
  return fail('sent')
}
