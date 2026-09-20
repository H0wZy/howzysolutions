import { describe, expect, it } from 'vitest'
import { metaFor, routes } from '../entry-server'

describe('social metadata', () => {
  it('uses the local brand card and a localized alternative on every route', () => {
    for (const { pathname, locale } of routes()) {
      const meta = metaFor(pathname)
      expect(meta.image).toBe('/brand/h0wzy-social-card.png')
      expect(meta.imageAlt.trim()).not.toBe('')
      expect(meta.lang).toBe(locale)
    }
  })
})
