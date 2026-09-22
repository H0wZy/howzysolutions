import { describe, expect, it } from 'vitest'
import { counterpart, locationFor, pathFor, splitLocale } from '../../route'

/**
 * Routing is pure and it decides which prerendered document a visitor gets, so
 * a mistake here is a 404 rather than a cosmetic bug.
 */

describe('splitLocale', () => {
  it('treats English as unprefixed', () => {
    expect(splitLocale('/')).toEqual({ locale: 'en', rest: '/' })
    expect(splitLocale('/works/telasparana/')).toEqual({ locale: 'en', rest: '/works/telasparana/' })
  })

  it('splits a Portuguese prefix off', () => {
    expect(splitLocale('/pt/')).toEqual({ locale: 'pt', rest: '/' })
    expect(splitLocale('/pt')).toEqual({ locale: 'pt', rest: '/' })
    expect(splitLocale('/pt/works/authsys/')).toEqual({ locale: 'pt', rest: '/works/authsys/' })
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
    expect(pathFor({ page: 'work', id: 'authsys' }, 'en')).toBe('/works/authsys/')
    expect(pathFor({ page: 'work', id: 'authsys' }, 'pt')).toBe('/pt/works/authsys/')
  })
})

describe('counterpart', () => {
  it('maps a page to the same page in the other locale', () => {
    expect(counterpart('/', 'pt')).toBe('/pt/')
    expect(counterpart('/pt/', 'en')).toBe('/')
    expect(counterpart('/works/telasparana/', 'pt')).toBe('/pt/works/telasparana/')
    expect(counterpart('/pt/works/telasparana/', 'en')).toBe('/works/telasparana/')
  })

  it('round-trips', () => {
    for (const path of ['/', '/works/authsys/', '/pt/', '/pt/works/authsys/']) {
      const { locale } = locationFor(path)
      const other = locale === 'en' ? 'pt' : 'en'
      expect(counterpart(counterpart(path, other), locale)).toBe(path)
    }
  })
})

describe('the legal documents (spec: terms of service)', () => {
  it('resolves the terms index, with and without its trailing slash', () => {
    expect(locationFor('/terms-of-service/').route).toEqual({ page: 'terms' })
    expect(locationFor('/terms-of-service').route).toEqual({ page: 'terms' })
    expect(locationFor('/pt/terms-of-service/')).toEqual({
      route: { page: 'terms' },
      locale: 'pt',
    })
  })

  it("resolves an app's own page in either document", () => {
    expect(locationFor('/terms-of-service/vvv/').route).toEqual({
      page: 'legalApp',
      doc: 'terms',
      id: 'vvv',
    })
    expect(locationFor('/privacy-policy/vvv').route).toEqual({
      page: 'legalApp',
      doc: 'privacy',
      id: 'vvv',
    })
    expect(locationFor('/pt/privacy-policy/vvv/')).toEqual({
      route: { page: 'legalApp', doc: 'privacy', id: 'vvv' },
      locale: 'pt',
    })
  })

  it('builds every legal path per locale', () => {
    expect(pathFor({ page: 'terms' }, 'en')).toBe('/terms-of-service/')
    expect(pathFor({ page: 'terms' }, 'pt')).toBe('/pt/terms-of-service/')
    expect(pathFor({ page: 'legalApp', doc: 'terms', id: 'vvv' }, 'en')).toBe(
      '/terms-of-service/vvv/',
    )
    expect(pathFor({ page: 'legalApp', doc: 'terms', id: 'vvv' }, 'pt')).toBe(
      '/pt/terms-of-service/vvv/',
    )
    expect(pathFor({ page: 'legalApp', doc: 'privacy', id: 'vvv' }, 'en')).toBe(
      '/privacy-policy/vvv/',
    )
    expect(pathFor({ page: 'legalApp', doc: 'privacy', id: 'vvv' }, 'pt')).toBe(
      '/pt/privacy-policy/vvv/',
    )
  })

  it('keeps the privacy policy index where its app review left it', () => {
    expect(pathFor({ page: 'privacy' }, 'en')).toBe('/privacy-policy/')
    expect(locationFor('/privacy-policy/').route).toEqual({ page: 'privacy' })
  })
})

describe('locationFor', () => {
  it('falls back to the home page for an unknown path', () => {
    expect(locationFor('/nonsense/')).toEqual({ route: { page: 'home' }, locale: 'en' })
  })
})

describe('works listing route (research D6)', () => {
  it('resolves /works/ and /works/1/ both to listing page 1', () => {
    expect(locationFor('/works/').route).toEqual({ page: 'workIndex', number: 1 })
    expect(locationFor('/works/1/').route).toEqual({ page: 'workIndex', number: 1 })
  })

  it('resolves /works/2/ to listing page 2, not to a project with id 2', () => {
    expect(locationFor('/works/2/').route).toEqual({ page: 'workIndex', number: 2 })
  })

  it('still resolves a real project id to the detail route', () => {
    expect(locationFor('/works/telasparana/').route).toEqual({
      page: 'work',
      id: 'telasparana',
    })
  })

  it('resolves /pt/works/2/ to page 2 in Portuguese', () => {
    expect(locationFor('/pt/works/2/')).toEqual({
      route: { page: 'workIndex', number: 2 },
      locale: 'pt',
    })
  })

  it('builds listing paths per locale, page 1 canonically unnumbered', () => {
    expect(pathFor({ page: 'workIndex', number: 1 }, 'en')).toBe('/works/')
    expect(pathFor({ page: 'workIndex', number: 2 }, 'en')).toBe('/works/2/')
    expect(pathFor({ page: 'workIndex', number: 2 }, 'pt')).toBe('/pt/works/2/')
  })
})
