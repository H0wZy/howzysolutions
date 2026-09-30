import { describe, expect, it } from 'vitest'
import { LOCALES } from '../i18n/types'
import { privacy } from '../privacy'
import { render } from '../../entry-server'
import { pathFor } from '../../route'

/*
 * The site keeps Cloudflare Web Analytics on (constitution 2.3.0, 2026-09-30).
 * The counter is a script the host injects at the edge, so nothing in this
 * repository's HTML shows it and no build check can see it; the policy is the
 * only place the site says it is there. This holds the policy to that.
 */
const website = privacy.sections.find((s) => s.id === 'this-website')!

describe.each(LOCALES)('privacy policy, this-website section, %s', (locale) => {
  const text = website.body[locale].join('\n')

  it('discloses the counter and the address it loads from', () => {
    expect(text).toContain('Cloudflare Web Analytics')
    expect(text).toContain('static.cloudflareinsights.com')
  })

  it('no longer says the site runs no analytics', () => {
    expect(text).not.toMatch(/runs no analytics|não usa analytics/i)
  })

  it('states the legal basis the operator chose', () => {
    expect(text).toMatch(/legitimate interest \(LGPD art\. 7, IX\)|legítimo interesse \(LGPD, art\. 7º, IX\)/)
  })

  it('declares no retention period at all', () => {
    // A number here goes stale silently when Cloudflare changes it. Say what we control, point at them.
    expect(text).not.toMatch(/\d+\s*(days?|dias?|hours?|horas?|months?|meses)/i)
    expect(text).toContain('cloudflare.com/privacypolicy')
  })

  it('declares the counting transfer abroad, and says the console data is covered by the backup that leaves too', () => {
    const [before, after] = text.split(/outside Brazil|fora do Brasil/)
    expect(after, 'the transfer sentence is missing').toBeDefined()
    // The counting sentence comes first and does not mention the console.
    expect(before).not.toMatch(/console/)
    // The console sentence says where its data lives and that its backup copy leaves the country too.
    expect(after).toMatch(/console/)
    expect(after).toMatch(/in Brazil|no Brasil/)
    expect(after).toMatch(/Google Drive/)
    expect(after).toMatch(/also goes|vai igualmente/)
    // The earlier wording kept the console out of the transfer; it was wrong once the dump covered every database.
    expect(text).not.toMatch(/applies to this website only|vale só para este site/)
  })

  it('attributes the no-cookie claim to Cloudflare and claims nothing about tracking across sites', () => {
    expect(text).toMatch(/Cloudflare (states|afirma)/)
    expect(text).not.toMatch(/across (other )?sites|entre sites/i)
  })
})

it('moved its date with the text', () => {
  expect(privacy.updated >= '2026-09-30').toBe(true)
})

/*
 * A marker `[decisão do operador: ...]` stood in the text until the operator
 * answered the legal questions (2026-09-30). This stays as a gate: a public
 * policy must not ship a note to its author. Resolve a marker, not the test.
 */
it('carries no unresolved marker for the operator', () => {
  expect(JSON.stringify(privacy)).not.toContain('decisão do operador')
})

/*
 * The policy points the reader at Cloudflare's own policy, and that pointer has
 * to be a link a visitor can follow. The address the browser calls for the
 * counter is not a page, so it must stay text.
 */
describe.each(LOCALES)('privacy page links, %s', (locale) => {
  const html = render(pathFor({ page: 'privacy' }, locale))

  it('links the Cloudflare privacy policy, opening in a new tab', () => {
    expect(html).toContain('<a href="https://cloudflare.com/privacypolicy" target="_blank" rel="noreferrer">cloudflare.com/privacypolicy</a>')
  })

  it('leaves the counter address as plain text', () => {
    expect(html).toContain('static.cloudflareinsights.com')
    expect(html).not.toMatch(/<a[^>]*>[^<]*static\.cloudflareinsights\.com/)
    expect(html).not.toContain('href="https://static.cloudflareinsights.com')
  })
})
