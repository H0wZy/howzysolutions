import { describe, expect, it } from 'vitest'
import { THEME_JOKE_KEYS, pickJoke } from '../jokes'
import { en } from '../../content/i18n/en'

describe('pickJoke', () => {
  it('is deterministic — the same seed always returns the same key', () => {
    for (const seed of [0, 1, 4, 5, 41, -3]) {
      expect(pickJoke(seed)).toBe(pickJoke(seed))
    }
  })

  it('cycles through every key as the seed increases', () => {
    const seen = new Set(Array.from({ length: THEME_JOKE_KEYS.length }, (_, i) => pickJoke(i)))
    expect(seen.size).toBe(THEME_JOKE_KEYS.length)
  })

  it('never returns an out-of-range index, including for a negative seed', () => {
    for (const seed of [-1, -5, -100]) {
      expect(THEME_JOKE_KEYS).toContain(pickJoke(seed))
    }
  })

  it('every joke key resolves in the canonical dictionary', () => {
    for (const key of THEME_JOKE_KEYS) {
      expect(en[key].trim()).not.toBe('')
    }
  })
})
