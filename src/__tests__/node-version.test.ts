import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

/**
 * One Node version everywhere (owner decision 2026-10-27, spec 059): .nvmrc
 * is the source, and package.json "engines" and CI must not drift from it.
 * Fails on the commit that changes one without the others.
 */
const read = (path: string) => readFileSync(fileURLToPath(new URL(`../../${path}`, import.meta.url)), 'utf8')
const pinned = read('.nvmrc').trim()

describe('pinned Node version', () => {
  it('is an exact version', () => {
    expect(pinned).toMatch(/^\d+\.\d+\.\d+$/)
  })

  it('is the floor in package.json engines.node and its lockfile', () => {
    const pkg = JSON.parse(read('package.json'))
    expect(pkg.engines.node).toBe(`>=${pinned}`)
    expect(JSON.parse(read('package-lock.json')).packages[''].engines).toEqual(pkg.engines)
  })

  it('is what every CI setup-node reads', () => {
    const ci = read('.github/workflows/ci.yml')
    const setups = ci.match(/actions\/setup-node@/g) ?? []
    expect(setups.length).toBeGreaterThan(0)
    expect(ci.match(/node-version-file: \.nvmrc/g) ?? []).toHaveLength(setups.length)
    expect(ci).not.toMatch(/^\s*node-version:/m)
  })
})
