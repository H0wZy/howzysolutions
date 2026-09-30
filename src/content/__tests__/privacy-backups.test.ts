import { describe, expect, it } from 'vitest'
import { LOCALES } from '../i18n/types'
import { privacy } from '../privacy'

/*
 * The vvv retention list used to end with "Everything else: deleted within 30
 * days", which promised total deletion while the nightly encrypted dump sits in
 * a cloud folder that is never pruned. The operator chose to keep the backups,
 * so the text says what is true: deletion covers the active systems, and the
 * encrypted backups have no defined disposal period. This holds it there.
 */
const retention = privacy.projects
  .find((p) => p.id === 'vvv')!
  .sections.find((s) => s.id === 'vvv-retention')!

describe.each(LOCALES)('vvv retention, %s', (locale) => {
  const items = retention.items![locale]
  const backups = items.find((i) => /^(Backups|Cópias de segurança):/.test(i))
  const everythingElse = items.find((i) => /^(Everything else|Todo o resto):/.test(i))

  it('says the deletion covers the active systems, not every copy', () => {
    expect(everythingElse).toBeDefined()
    expect(everythingElse).toMatch(/active systems|sistemas ativos/)
    // The old wording promised total deletion.
    expect(everythingElse).not.toMatch(/^Everything else: deleted within|^Todo o resto: apagado em até/)
  })

  it('carries the backups caveat: kept for restoring, encrypted, no disposal period', () => {
    expect(backups, 'the backups item is missing').toBeDefined()
    expect(backups).toMatch(/restor|restauração/)
    expect(backups).toMatch(/[Ee]ncrypted|criptografadas/)
    expect(backups).toMatch(/no disposal period|prazo de descarte/)
    expect(backups).toMatch(/can remain|podem continuar/)
  })

  it('invents no number of days for the backups', () => {
    // None exists; a number here would be a promise the backup job does not keep.
    expect(backups).not.toMatch(/[0-9]+ *(days?|dias?|months?|meses|years?|anos?)/i)
  })
})

/*
 * vvv-storage said "data is stored on the operator's computer in Brazil", which stopped being
 * true when the database moved to the operator's server and a nightly copy started going to
 * Google Drive. It now says three true things (where the data lives, that an encrypted copy goes
 * to Google Drive, that this means the copy leaves Brazil) and names no LGPD art. 33 mechanism,
 * because none has been decided.
 */
const storage = privacy.projects
  .find((p) => p.id === 'vvv')!
  .sections.find((s) => s.id === 'vvv-storage')!

describe.each(LOCALES)('vvv storage, %s', (locale) => {
  const items = storage.items![locale]
  const text = items.join(' ')
  const stored = items.find((i) => /^(Storage|Armazenamento):/.test(i))
  const backups = items.find((i) => /^(Backups|Cópias de segurança):/.test(i))

  it('says where the active data lives and no longer says it is the operator computer', () => {
    expect(stored).toMatch(/database|banco de dados/)
    expect(stored).toMatch(/server|servidor/)
    expect(stored).not.toMatch(/stored on the operator.s computer|ficam no computador do operador/)
  })

  it('keeps credentials on the operator computer only, and sent only to TikTok', () => {
    expect(stored).toMatch(/Credentials are kept only on the operator.s computer|As credenciais ficam só no computador do operador/)
  })

  it('names Google Drive, says the copy is encrypted before it leaves, and says it leaves Brazil', () => {
    expect(backups, 'the backups item is missing').toBeDefined()
    expect(backups).toContain('Google Drive')
    expect(backups).toMatch(/encrypted on our server before it leaves|criptografada no nosso servidor antes de sair/)
    expect(backups).toMatch(/leaves the country|sai do país/)
  })

  it('names no LGPD art. 33 mechanism for either transfer', () => {
    // Undecided on purpose. A mechanism named here would be one that is not in place.
    expect(text).not.toMatch(/art\. ?33|cláusulas|clauses|adequa|adequacy|consent|consentimento/i)
  })
})
