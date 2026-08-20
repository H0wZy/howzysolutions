import { describe, expect, it } from 'vitest'
import { en } from '../en'
import { pt } from '../pt'
import { LOCALES } from '../types'
import { format } from '../../../locale'

/**
 * Gate V-006. The `satisfies` clause in pt.ts already makes a missing key a build
 * error; these tests cover what the type system cannot see — placeholder parity and
 * strings that were copied rather than translated.
 */
describe('locale dictionaries', () => {
  const enKeys = Object.keys(en).sort()
  const ptKeys = Object.keys(pt).sort()

  it('declares exactly two locales', () => {
    expect(LOCALES).toEqual(['en', 'pt'])
  })

  it('share an identical key set', () => {
    expect(ptKeys).toEqual(enKeys)
  })

  it('has no empty value in either locale', () => {
    for (const [key, value] of [...Object.entries(en), ...Object.entries(pt)]) {
      expect(value.trim(), `empty value for ${key}`).not.toBe('')
    }
  })

  it('uses the same placeholders in both locales', () => {
    const placeholders = (s: string) => (s.match(/\{(\w+)\}/g) ?? []).sort()
    for (const key of enKeys) {
      const k = key as keyof typeof en
      expect(placeholders(pt[k]), `placeholder mismatch on ${key}`).toEqual(placeholders(en[k]))
    }
  })

  it('does not leave English prose sitting in the Portuguese dictionary', () => {
    // Proper nouns and terms the Brazilian dev community uses untranslated are expected
    // to match; anything longer than that matching byte-for-byte was never translated.
    const identical = enKeys.filter((key) => {
      const k = key as keyof typeof en
      return en[k] === pt[k] && en[k].length > 12
    })
    expect(identical, `untranslated: ${identical.join(', ')}`).toEqual([])
  })
})

describe('format', () => {
  it('substitutes named parameters', () => {
    expect(format('{years}y {months}mo', { years: 3, months: 7 })).toBe('3y 7mo')
  })

  it('leaves an unmatched placeholder intact rather than blanking it', () => {
    expect(format('{a} and {b}', { a: 'x' })).toBe('x and {b}')
  })

  it('returns the template unchanged when no parameters are given', () => {
    expect(format('no placeholders here')).toBe('no placeholders here')
  })
})
