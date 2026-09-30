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
