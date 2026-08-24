import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Gate for Principle IV, enforced mechanically rather than by review.
 *
 * The engine's whole value is that one implementation serves the DOM renderer
 * and the immersive renderer. That only holds if it cannot reach for a framework
 * or the document — and a rule nobody checks is a rule that erodes.
 */

const ROOT = join(process.cwd(), 'src/terminal')

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) {
      return entry === '__tests__' ? [] : sourceFiles(path)
    }
    return path.endsWith('.ts') ? [path] : []
  })
}

const files = sourceFiles(ROOT)

/** Value imports only — `import type` is erased and cannot reach anything. */
function valueImports(source: string): string[] {
  const withoutTypeImports = source.replace(/import\s+type\s+[\s\S]*?from\s+['"][^'"]+['"]/g, '')
  return [...withoutTypeImports.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1])
}

describe('terminal engine purity', () => {
  it('has source files to check', () => {
    expect(files.length).toBeGreaterThan(5)
  })

  it('imports no framework', () => {
    const banned = ['react', 'react-dom', 'three', '@react-three']
    for (const file of files) {
      for (const specifier of valueImports(readFileSync(file, 'utf8'))) {
        for (const name of banned) {
          expect(
            specifier === name || specifier.startsWith(`${name}/`),
            `${file} imports ${specifier}`,
          ).toBe(false)
        }
      }
    }
  })

  it('references no DOM or storage global', () => {
    // `document`/`window` would tie the engine to one renderer; `localStorage`
    // and `fetch` would make it impure; `Date.now`/`Math.random` would make the
    // purity test itself meaningless.
    const banned = /\b(document|window|localStorage|sessionStorage|fetch|Date\.now|Math\.random)\b/
    for (const file of files) {
      const source = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '')
      const match = banned.exec(source)
      expect(match?.[0], `${file} references ${match?.[0]}`).toBeUndefined()
    }
  })

  it('imports only from modules that are themselves pure', () => {
    // src/locale.ts touches storage; a hypothetical impure src/theme barrel
    // would too (there is none since research D12 — dark is the only theme —
    // but the ban stays as a guard against one reappearing).
    const impure = ['../locale', '../../locale', '../theme', '../../theme']
    for (const file of files) {
      for (const specifier of valueImports(readFileSync(file, 'utf8'))) {
        expect(impure, `${file} imports the impure ${specifier}`).not.toContain(specifier)
      }
    }
  })
})
