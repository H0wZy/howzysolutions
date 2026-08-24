import { describe, expect, it } from 'vitest'
import { en } from '../i18n/en'
import { pt } from '../i18n/pt'
import { profile } from '../profile'
import { projects } from '../projects'
import { LOCALES } from '../i18n/types'
import type { Localized } from '../i18n/types'
import { metaFor, routes } from '../../entry-server'

/**
 * FR-001, FR-002. The em dash is the punctuation tic that makes generated prose
 * read as generated, and it was scattered through every locale string and every
 * project record. This test is the thing that keeps it from coming back.
 *
 * Scope is deliberately visitor-facing copy only. Source comments and everything
 * under specs/ keep theirs — the decision is recorded in research.md D2.
 */

const EM_DASH = '—'
const EN_DASH = '–'

/** Every string a visitor can read, paired with a label naming where it lives. */
function visibleStrings(): Array<[where: string, text: string]> {
  const out: Array<[string, string]> = []

  for (const [key, value] of Object.entries(en)) out.push([`en.${key}`, value])
  for (const [key, value] of Object.entries(pt)) out.push([`pt.${key}`, value])

  const localized = (where: string, value: Localized) => {
    for (const locale of LOCALES) out.push([`${where}.${locale}`, value[locale]])
  }
  const localizedList = (where: string, value: Localized<string[]>) => {
    for (const locale of LOCALES) {
      value[locale].forEach((line, i) => out.push([`${where}.${locale}[${i}]`, line]))
    }
  }

  localized('profile.tagline', profile.tagline)
  localized('profile.location', profile.location)
  localizedList('profile.bio', profile.bio)
  for (const contact of profile.contacts) out.push([`profile.contact.${contact.kind}`, contact.label])

  for (const project of projects) {
    const at = `projects.${project.id}`
    out.push([`${at}.name`, project.name])
    localized(`${at}.summary`, project.summary)
    localized(`${at}.problem`, project.problem)
    localizedList(`${at}.capabilities`, project.capabilities)
    localizedList(`${at}.development`, project.development)
    localizedList(`${at}.limitations`, project.limitations)
    if (project.context) localized(`${at}.context`, project.context)
    if (project.roadmap) localizedList(`${at}.roadmap`, project.roadmap)
    for (const group of project.stack) {
      group.items.forEach((item, i) => out.push([`${at}.stack.${group.group}[${i}]`, item]))
    }
    for (const [i, metric] of (project.metrics ?? []).entries()) {
      localized(`${at}.metric[${i}].label`, metric.label)
      localized(`${at}.metric[${i}].source`, metric.source)
      out.push([`${at}.metric[${i}].value`, metric.value])
    }
    for (const link of project.links ?? []) out.push([`${at}.link.${link.kind}`, link.label])
    for (const [i, image] of (project.images ?? []).entries()) {
      localized(`${at}.image[${i}].alt`, image.alt)
    }
  }

  return out
}

describe('document metadata punctuation', () => {
  /*
   * Titles and descriptions are visitor-facing: the browser tab, the bookmark,
   * the search result. The first version of this test walked only the content
   * modules and missed them, and the em dash survived in every emitted <title>
   * until the build output was grepped. Covered here so it cannot come back.
   */
  it('emits no em dash in any route title or description', () => {
    const offenders: string[] = []
    for (const { pathname } of routes()) {
      const meta = metaFor(pathname)
      if (meta.title.includes(EM_DASH)) offenders.push(`${pathname} title`)
      if (meta.description.includes(EM_DASH)) offenders.push(`${pathname} description`)
    }
    expect(offenders, `em dash in: ${offenders.join(', ')}`).toEqual([])
  })
})

describe('visitor-facing punctuation', () => {
  const strings = visibleStrings()

  it('reads a non-trivial number of strings', () => {
    // Guards against the walker silently covering nothing after a schema change.
    expect(strings.length).toBeGreaterThan(200)
  })

  it('contains no em dash', () => {
    const offenders = strings.filter(([, text]) => text.includes(EM_DASH)).map(([where]) => where)
    expect(offenders, `em dash in: ${offenders.join(', ')}`).toEqual([])
  })

  it('contains no en dash standing in as a dash', () => {
    const offenders = strings.filter(([, text]) => text.includes(EN_DASH)).map(([where]) => where)
    expect(offenders, `en dash in: ${offenders.join(', ')}`).toEqual([])
  })

  it('does not replace a dash with a spaced hyphen lookalike', () => {
    // ` - ` is the substitution that satisfies a naive find-and-replace while
    // reproducing exactly the visual tell the rewrite exists to remove.
    const offenders = strings.filter(([, text]) => / - /.test(text)).map(([where]) => where)
    expect(offenders, `spaced hyphen in: ${offenders.join(', ')}`).toEqual([])
  })

  it('does not replace a dash with a double hyphen', () => {
    const offenders = strings
      .filter(([where]) => !where.startsWith('en.terminal') && !where.startsWith('pt.terminal'))
      .filter(([, text]) => /\s--\s/.test(text))
      .map(([where]) => where)
    expect(offenders, `double hyphen in: ${offenders.join(', ')}`).toEqual([])
  })
})
