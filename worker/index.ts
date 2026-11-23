/**
 * The site's only server code: `POST /api/contact`, the contact form's target.
 *
 * Everything else is static and never reaches this script: wrangler.jsonc sets
 * `run_worker_first` to /api/* alone, so the assets layer answers every other
 * request itself, redirects and headers included.
 *
 * A submission has to pass four gates, in this order, and fails closed at each:
 *   1. shape and size (form body, same origin, ceilings from src/content/contact.ts);
 *   2. the honeypot, which answers "sent" to a bot and mails nobody;
 *   3. Cloudflare Turnstile, checked server-side with TURNSTILE_SECRET;
 *   4. Resend, which mails the owner's inbox (CONTACT_TO).
 *
 * The three keys are Worker secrets (`wrangler secret put`), never in a file,
 * an argument or a log. Nothing about a submission is logged either: the
 * owner's inbox is the only place the message lives.
 *
 * It answers twice. With `Accept: application/json` (the page's fetch) it
 * returns `{ ok }` or `{ error }`. Without (a plain form POST, scripting off)
 * it redirects with 303 to the services page, naming the outcome in the
 * fragment, where the page shows it with :target.
 */
import { CONTACT_ENDPOINT, CONTACT_LIMITS, SERVICE_IDS } from '../src/content/contact.ts'

export interface Env {
  RESEND_API_KEY?: string
  TURNSTILE_SECRET?: string
  CONTACT_TO?: string
  /** Not a secret: the sender shown on the mail. Must be a domain verified in Resend. */
  CONTACT_FROM?: string
}

export type Outcome = 'sent' | 'invalid' | 'spam' | 'failed'

const STATUS: Record<Outcome, number> = { sent: 200, invalid: 422, spam: 403, failed: 502 }

/** A form this site sends is a few hundred bytes plus the message. */
const MAX_BODY = 32 * 1024

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

export async function handle(request: Request, env: Env, doFetch: Doer = fetch): Promise<Response> {
  const url = new URL(request.url)
  if (url.pathname !== CONTACT_ENDPOINT) return new Response('Not found', { status: 404 })
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } })
  }

  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json')

  // A cross-site page must not be able to post through a visitor's browser.
  const origin = request.headers.get('origin')
  if (origin && origin !== url.origin) return new Response('Forbidden', { status: 403 })

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
  const { TURNSTILE_SECRET, RESEND_API_KEY, CONTACT_TO } = env
  if (!TURNSTILE_SECRET || !RESEND_API_KEY || !CONTACT_TO) {
    console.error('contact: a Worker secret is not set')
    return fail('failed')
  }

  const human = await turnstileOk(token, TURNSTILE_SECRET, request.headers.get('cf-connecting-ip'), doFetch)
  if (human === 'error') return fail('failed')
  if (!human) return fail('spam')

  const services = [...new Set(picked as string[])]
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
    if (!res.ok) {
      console.error(`contact: resend answered ${res.status}`)
      return fail('failed')
    }
  } catch {
    console.error('contact: resend was unreachable')
    return fail('failed')
  }
  return fail('sent')
}

export default {
  fetch: (request: Request, env: Env) => handle(request, env),
}
