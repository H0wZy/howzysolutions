import { describe, expect, it } from 'vitest'
import { LOCALES } from '../i18n/types'
import { privacy } from '../privacy'

/*
 * The contact form keeps a message in Cloudflare D1 for 90 days and mails it
 * through Resend (spec 006, US6, FR-015). The policy is the only place a visitor
 * can read that, so it is held to saying who, how long, and how to have it
 * deleted. The number 90 also has to be the one the code enforces.
 */
const section = privacy.sections.find((s) => s.id === 'contact-form')!

describe.each(LOCALES)('privacy policy, contact-form section, %s', (locale) => {
  const text = section.body[locale].join('\n')

  it('names both processors', () => {
    expect(text).toContain('Cloudflare')
    expect(text).toContain('Resend')
    expect(text).toContain('D1')
  })

  it('says the message is kept 90 days', () => {
    expect(text).toMatch(/90 (days|dias)/)
  })

  it('says how to have it deleted sooner', () => {
    expect(text).toMatch(/write to the address at the top|escreva para o endereço no topo/)
  })

  it('no longer says nothing is saved', () => {
    expect(text).not.toMatch(/Nothing is saved|Nada é guardado/)
  })

  it('says the address is stored only as a hash', () => {
    expect(text).toMatch(/hash/)
  })
})

describe('the retention the policy states is the one the server enforces', () => {
  it('RETENTION_DAYS is 90', async () => {
    const { RETENTION_DAYS } = await import('../../server/contact')
    expect(RETENTION_DAYS).toBe(90)
  })
})
