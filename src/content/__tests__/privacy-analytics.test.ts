import { describe, expect, it } from 'vitest'
import { LOCALES } from '../i18n/types'
import { privacy } from '../privacy'

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

  it('declares the transfer abroad and keeps the console apart from it', () => {
    const [before, after] = text.split(/outside Brazil|fora do Brasil/)
    expect(after, 'the transfer sentence is missing').toBeDefined()
    // The console sentence follows the transfer sentence directly, in the same section.
    expect(after).toMatch(/console/)
    expect(after).toMatch(/in Brazil|no Brasil/)
    expect(before).not.toMatch(/console/)
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
