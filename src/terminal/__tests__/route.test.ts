import { describe, expect, it } from 'vitest'
import { counterpart, locationFor, pathFor, splitLocale } from '../../route'

/**
 * Routing is pure and it decides which prerendered document a visitor gets, so
 * a mistake here is a 404 rather than a cosmetic bug.
 */

describe('splitLocale', () => {
  it('treats English as unprefixed', () => {
    expect(splitLocale('/')).toEqual({ locale: 'en', rest: '/' })
    expect(splitLocale('/work/telasparana/')).toEqual({ locale: 'en', rest: '/work/telasparana/' })
  })

  it('splits a Portuguese prefix off', () => {
    expect(splitLocale('/pt/')).toEqual({ locale: 'pt', rest: '/' })
    expect(splitLocale('/pt')).toEqual({ locale: 'pt', rest: '/' })
    expect(splitLocale('/pt/work/authsys/')).toEqual({ locale: 'pt', rest: '/work/authsys/' })
  })

  it('does not mistake a project whose id starts with a locale name', () => {
    // '/ptolemy/' must not be read as Portuguese.
    expect(splitLocale('/ptolemy/')).toEqual({ locale: 'en', rest: '/ptolemy/' })
  })
})

describe('pathFor', () => {
  it('builds the canonical path per locale', () => {
    expect(pathFor({ page: 'home' }, 'en')).toBe('/')
    expect(pathFor({ page: 'home' }, 'pt')).toBe('/pt/')
    expect(pathFor({ page: 'work', id: 'authsys' }, 'en')).toBe('/work/authsys/')
    expect(pathFor({ page: 'work', id: 'authsys' }, 'pt')).toBe('/pt/work/authsys/')
  })
})

describe('counterpart', () => {
  it('maps a page to the same page in the other locale', () => {
    expect(counterpart('/', 'pt')).toBe('/pt/')
    expect(counterpart('/pt/', 'en')).toBe('/')
    expect(counterpart('/work/telasparana/', 'pt')).toBe('/pt/work/telasparana/')
    expect(counterpart('/pt/work/telasparana/', 'en')).toBe('/work/telasparana/')
  })

  it('round-trips', () => {
    for (const path of ['/', '/work/authsys/', '/pt/', '/pt/work/authsys/']) {
      const { locale } = locationFor(path)
      const other = locale === 'en' ? 'pt' : 'en'
      expect(counterpart(counterpart(path, other), locale)).toBe(path)
    }
  })
})

describe('locationFor', () => {
  it('falls back to the home page for an unknown path', () => {
    expect(locationFor('/nonsense/')).toEqual({ route: { page: 'home' }, locale: 'en' })
  })
})
