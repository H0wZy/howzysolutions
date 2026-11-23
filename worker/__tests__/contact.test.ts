import { describe, expect, it } from 'vitest'
import { handle, type Env } from '../index.ts'

/**
 * The contact route, with Turnstile and Resend replaced by a recorder. What
 * these hold: it never mails without a passing Turnstile check, it never lets a
 * bot's honeypot reach the inbox, it fails closed when a secret is missing, and
 * no secret value appears in anything it answers.
 */

const SECRETS = { RESEND_API_KEY: 're_test_key', TURNSTILE_SECRET: 'ts_test_secret', CONTACT_TO: 'owner@example.com' }
const ENV: Env = { ...SECRETS, CONTACT_FROM: 'site <site@example.com>' }

type Call = { url: string; init?: RequestInit }

function recorder(turnstile: unknown = { success: true }, resendOk = true) {
  const calls: Call[] = []
  const doFetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input)
    calls.push({ url, init })
    if (url.includes('turnstile')) return Response.json(turnstile)
    return resendOk ? Response.json({ id: 'x' }) : new Response('no', { status: 500 })
  }) as typeof fetch
  return { calls, doFetch }
}

const GOOD = {
  name: 'Ana',
  email: 'ana@example.com',
  problem: 'I need a site.',
  service: ['web', 'ai'],
  lang: 'en',
  'cf-turnstile-response': 'token',
}

function post(fields: Record<string, string | string[]>, headers: Record<string, string> = {}) {
  const body = new URLSearchParams()
  for (const [k, v] of Object.entries(fields)) for (const one of [v].flat()) body.append(k, one)
  return new Request('https://howzysolutions.com/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', ...headers },
    body,
  })
}

const asJson = { accept: 'application/json' }
const mails = (calls: Call[]) => calls.filter((c) => c.url.includes('resend'))

describe('POST /api/contact', () => {
  it('mails the owner once, with reply-to set, after Turnstile passes', async () => {
    const { calls, doFetch } = recorder()
    const res = await handle(post(GOOD, asJson), ENV, doFetch)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    const mail = mails(calls)
    expect(mail).toHaveLength(1)
    const sent = JSON.parse(String(mail[0].init?.body))
    expect(sent.to).toEqual(['owner@example.com'])
    expect(sent.reply_to).toBe('ana@example.com')
    expect(sent.text).toContain('I need a site.')
    expect(sent.text).toContain('web, ai')
    // Turnstile was asked before Resend was.
    expect(calls[0].url).toContain('turnstile')
  })

  it('without scripting, answers with a 303 to the services page and names the outcome', async () => {
    const { doFetch } = recorder()
    const res = await handle(post(GOOD), ENV, doFetch)
    expect(res.status).toBe(303)
    expect(res.headers.get('location')).toBe('/services/#sent')
    const pt = await handle(post({ ...GOOD, lang: 'pt' }), ENV, doFetch)
    expect(pt.headers.get('location')).toBe('/pt/services/#sent')
  })

  it('does not mail when Turnstile rejects the token', async () => {
    const { calls, doFetch } = recorder({ success: false })
    const res = await handle(post(GOOD, asJson), ENV, doFetch)
    expect(res.status).toBe(403)
    expect(mails(calls)).toHaveLength(0)
    expect(res.headers.get('location')).toBeNull()
  })

  it('does not mail without a token, and never asks Turnstile about nothing', async () => {
    const { calls, doFetch } = recorder()
    const { 'cf-turnstile-response': _token, ...noToken } = GOOD
    void _token
    const res = await handle(post(noToken, asJson), ENV, doFetch)
    expect(res.status).toBe(403)
    expect(calls).toHaveLength(0)
  })

  it('tells a bot its message was sent and mails nobody', async () => {
    const { calls, doFetch } = recorder()
    const res = await handle(post({ ...GOOD, website: 'http://spam.example' }, asJson), ENV, doFetch)
    expect(res.status).toBe(200)
    expect(calls).toHaveLength(0)
  })

  it.each([
    ['an empty name', { name: '  ' }],
    ['a name over the limit', { name: 'a'.repeat(81) }],
    ['an email that is not one', { email: 'not-an-email' }],
    ['an email with a line break in it', { email: 'a@example.com\nBcc: x@example.com' }],
    ['a missing problem', { problem: '' }],
    ['a problem over the limit', { problem: 'x'.repeat(4001) }],
    ['a service nobody offers', { service: ['web', 'crypto'] }],
  ])('rejects %s before it asks Turnstile anything', async (_label, patch) => {
    const { calls, doFetch } = recorder()
    const res = await handle(post({ ...GOOD, ...patch }, asJson), ENV, doFetch)
    expect(res.status).toBe(422)
    expect(await res.json()).toEqual({ ok: false, error: 'invalid' })
    expect(calls).toHaveLength(0)
  })

  it.each(['RESEND_API_KEY', 'TURNSTILE_SECRET', 'CONTACT_TO'] as const)(
    'fails closed, mailing nobody, when %s is not set',
    async (missing) => {
      const { calls, doFetch } = recorder()
      const res = await handle(post(GOOD, asJson), { ...ENV, [missing]: undefined }, doFetch)
      expect(res.status).toBe(502)
      expect(mails(calls)).toHaveLength(0)
    },
  )

  it('reports a Resend failure as failed, not as sent', async () => {
    const { doFetch } = recorder({ success: true }, false)
    const res = await handle(post(GOOD, asJson), ENV, doFetch)
    expect(res.status).toBe(502)
    expect(await res.json()).toEqual({ ok: false, error: 'failed' })
  })

  it('never echoes a secret back', async () => {
    const { doFetch } = recorder({ success: false })
    for (const req of [post(GOOD, asJson), post(GOOD)]) {
      const res = await handle(req, ENV, doFetch)
      const everything = `${[...res.headers].join()}${await res.text()}`
      for (const secret of Object.values(SECRETS)) expect(everything).not.toContain(secret)
    }
  })

  it('refuses a post from another origin', async () => {
    const { calls, doFetch } = recorder()
    const res = await handle(post(GOOD, { ...asJson, origin: 'https://evil.example' }), ENV, doFetch)
    expect(res.status).toBe(403)
    expect(calls).toHaveLength(0)
  })

  it('answers only POST, only on its own path, only to forms', async () => {
    const { doFetch } = recorder()
    const get = await handle(new Request('https://howzysolutions.com/api/contact'), ENV, doFetch)
    expect(get.status).toBe(405)
    expect(get.headers.get('allow')).toBe('POST')
    const other = await handle(new Request('https://howzysolutions.com/api/other', { method: 'POST' }), ENV, doFetch)
    expect(other.status).toBe(404)
    const json = await handle(
      new Request('https://howzysolutions.com/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{}',
      }),
      ENV,
      doFetch,
    )
    expect(json.status).toBe(415)
  })
})
