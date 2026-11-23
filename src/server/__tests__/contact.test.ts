// @vitest-environment node
import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RATE_LIMIT, RETENTION_DAYS, handleContact, type ContactEnv } from '../contact'

// The real migration, run by SQLite, behind a D1-shaped wrapper: the SQL the
// handler sends is the SQL the table accepts.
function makeDb() {
  const db = new DatabaseSync(':memory:')
  db.exec(readFileSync('migrations/0001_contact_messages.sql', 'utf8'))
  return {
    raw: db,
    prepare: (q: string) => ({
      bind: (...v: unknown[]) => ({
        run: async () => db.prepare(q).run(...(v as (string | number | null)[])),
      }),
    }),
  }
}

function makeKv() {
  const store = new Map<string, string>()
  return {
    store,
    get: async (k: string) => store.get(k) ?? null,
    put: async (k: string, v: string) => void store.set(k, v),
  }
}

const NOW = Date.UTC(2026, 10, 23) // 2026-11-23

let db: ReturnType<typeof makeDb>
let kv: ReturnType<typeof makeKv>
let env: ContactEnv
let outside: ReturnType<typeof fakeFetch>

/** Turnstile answers `human`, Resend answers `mailOk`. */
function fakeFetch(human = true, mailOk = true) {
  return vi.fn<(u: string | URL | Request, i?: RequestInit) => Promise<Response>>(async (url) => {
    const u = String(url)
    if (u.includes('siteverify')) return Response.json({ success: human })
    if (u.includes('resend')) return mailOk ? Response.json({ id: 'x' }) : new Response('no', { status: 500 })
    throw new Error(`unexpected ${u}`)
  })
}

function post(fields: Record<string, string | string[]>, headers: Record<string, string> = {}) {
  const body = new URLSearchParams()
  for (const [k, v] of Object.entries(fields)) for (const x of Array.isArray(v) ? v : [v]) body.append(k, x)
  return new Request('https://howzysolutions.com/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', 'cf-connecting-ip': '203.0.113.7', ...headers },
    body,
  })
}

const good = {
  name: 'Ana',
  email: 'ana@example.com',
  problem: 'A site that loads slowly.',
  service: ['web', 'infra'],
  'cf-turnstile-response': 'tok',
}
const json = { accept: 'application/json' }

const rows = () => db.raw.prepare('SELECT * FROM contact_messages').all() as Record<string, unknown>[]
const run = (req: Request, f: ReturnType<typeof fakeFetch> = outside) =>
  handleContact(req, env, f as unknown as typeof fetch, () => NOW)

beforeEach(() => {
  db = makeDb()
  kv = makeKv()
  outside = fakeFetch()
  env = { DB: db, RATE_LIMIT: kv, RESEND_API_KEY: 're_secret', TURNSTILE_SECRET: 'ts_secret', CONTACT_TO: 'me@example.com' }
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('a good submission', () => {
  it('is stored, mailed with reply_to, and answers JSON ok', async () => {
    const res = await run(post(good, json))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    const [row] = rows()
    expect(row).toMatchObject({ name: 'Ana', email: 'ana@example.com', services: 'web,infra', lang: 'en' })
    expect(row.notified_at).toBe(Math.floor(NOW / 1000))
    // the address is never stored, only a keyed hash
    expect(JSON.stringify(row)).not.toContain('203.0.113.7')
    const mail = outside.mock.calls.find(([u]) => String(u).includes('resend'))!
    const sent = JSON.parse((mail[1] as RequestInit).body as string)
    expect(sent).toMatchObject({ to: ['me@example.com'], reply_to: 'ana@example.com' })
    expect(sent.text).toContain('A site that loads slowly.')
  })

  it('works without JS: a plain post is a 303 to the services page, PT to the PT page', async () => {
    const res = await run(post(good))
    expect(res.status).toBe(303)
    expect(res.headers.get('location')).toBe('/services/#sent')
    const pt = await run(post({ ...good, lang: 'pt' }, { 'cf-connecting-ip': '203.0.113.8' }))
    expect(pt.headers.get('location')).toBe('/pt/services/#sent')
  })

  it('is still saved, and says sent, when Resend fails; notified_at stays empty', async () => {
    const res = await run(post(good, json), fakeFetch(true, false))
    expect(res.status).toBe(200)
    expect(rows()[0].notified_at).toBeNull()
  })
})

describe('what it refuses', () => {
  it.each([
    ['no name', { ...good, name: '' }],
    ['bad email', { ...good, email: 'nope' }],
    ['empty problem', { ...good, problem: '  ' }],
    ['too long', { ...good, problem: 'x'.repeat(4001) }],
    ['unknown service', { ...good, service: ['hack'] }],
  ])('%s is invalid and stores nothing', async (_n, fields) => {
    const res = await run(post(fields, json))
    expect(res.status).toBe(422)
    expect(rows()).toHaveLength(0)
    expect(outside).not.toHaveBeenCalled()
  })

  it('a filled honeypot is told it worked, and nothing is stored, checked or mailed', async () => {
    const res = await run(post({ ...good, website: 'http://spam' }, json))
    expect(res.status).toBe(200)
    expect(rows()).toHaveLength(0)
    expect(outside).not.toHaveBeenCalled()
  })

  it('no Turnstile token, or a failed one, is 403 and stores nothing', async () => {
    const noToken: Record<string, string | string[]> = { ...good }
    delete noToken['cf-turnstile-response']
    expect((await run(post(noToken, json))).status).toBe(403)
    expect((await run(post(good, json), fakeFetch(false))).status).toBe(403)
    expect(rows()).toHaveLength(0)
  })

  it('Turnstile unreachable is a 502, not a pass', async () => {
    const down = vi.fn(async () => {
      throw new Error('offline')
    }) as unknown as ReturnType<typeof fakeFetch>
    expect((await run(post(good, json), down)).status).toBe(502)
    expect(rows()).toHaveLength(0)
  })

  it('a cross-site origin is 403, a JSON body is 415, a huge one 413', async () => {
    expect((await run(post(good, { origin: 'https://evil.example' }))).status).toBe(403)
    const asJson = new Request('https://howzysolutions.com/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}',
    })
    expect((await run(asJson)).status).toBe(415)
    expect((await run(post(good, { 'content-length': '999999' }))).status).toBe(413)
  })

  it('a missing secret or binding fails closed', async () => {
    env = { ...env, RESEND_API_KEY: undefined }
    expect((await run(post(good, json))).status).toBe(502)
    expect(rows()).toHaveLength(0)
  })
})

describe('the per-IP limit', () => {
  it(`allows ${RATE_LIMIT.max} an hour from one IP, then 429; another IP is unaffected`, async () => {
    const send = (ip: string) => run(post(good, { ...json, 'cf-connecting-ip': ip }))
    for (let i = 0; i < RATE_LIMIT.max; i++) expect((await send('198.51.100.1')).status).toBe(200)
    expect((await send('198.51.100.1')).status).toBe(429)
    expect((await send('198.51.100.2')).status).toBe(200)
    expect(rows()).toHaveLength(RATE_LIMIT.max + 1)
  })
})

describe('retention', () => {
  it(`a submission deletes messages older than ${RETENTION_DAYS} days and keeps newer ones`, async () => {
    const at = Math.floor(NOW / 1000)
    const ins = db.raw.prepare(
      "INSERT INTO contact_messages (id, name, email, body, ip_hash, created_at) VALUES (?, 'o', 'o@x.io', 'b', 'h', ?)",
    )
    ins.run('old', at - (RETENTION_DAYS + 1) * 86400)
    ins.run('young', at - (RETENTION_DAYS - 1) * 86400)
    await run(post(good, json))
    const ids = rows().map((r) => r.id)
    expect(ids).toContain('young')
    expect(ids).not.toContain('old')
  })
})
