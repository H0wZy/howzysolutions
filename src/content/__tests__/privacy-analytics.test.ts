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

  it('attributes the no-cookie claim to Cloudflare and claims nothing about tracking across sites', () => {
    expect(text).toMatch(/Cloudflare (states|afirma)/)
    expect(text).not.toMatch(/across (other )?sites|entre sites/i)
  })
})

it('moved its date with the text', () => {
  expect(privacy.updated >= '2026-09-30').toBe(true)
})

/*
 * The two legal answers the operator has not given (legal basis under the LGPD,
 * and retention) are marked in the text. This fails while the marker is there,
 * on purpose: a public policy must not ship a note to its author. Resolve the
 * marker, not the test.
 */
it('carries no unresolved marker for the operator', () => {
  expect(JSON.stringify(privacy)).not.toContain('decisão do operador')
})
