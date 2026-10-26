import { describe, expect, it } from 'vitest'
import { profile, projects } from '@content/index'
import { parseRoute } from '@legacy/route'

describe('aliases', () => {
  it('@content/* reaches the Vite site content', () => {
    expect(profile).toBeDefined()
    expect(projects.length).toBeGreaterThan(0)
  })
  it('@legacy/* reaches the pure route module', () => {
    expect(typeof parseRoute).toBe('function')
  })
})
