import { describe, expect, it } from 'vitest'
import { execute, type ExecuteContext } from '../engine'
import { commands, invocableNames, resolve } from '../registry'
import { parse, tokenize } from '../parse'
import { closest, completions, distance } from '../suggest'
import { content } from '../../content'
import { LOCALES } from '../../content/i18n/types'

const ctx = (over: Partial<ExecuteContext> = {}): ExecuteContext => ({
  locale: 'en',
  content,
  history: [],
  ...over,
})

describe('parse', () => {
  it('splits on whitespace and keeps quoted runs together', () => {
    expect(tokenize('projects --stack "react 19"')).toEqual(['projects', '--stack', 'react 19'])
  })

  it('accepts h0wzy as an optional leading word', () => {
    expect(parse('h0wzy --version')?.name).toBe('version')
    expect(parse('version')?.name).toBe('version')
  })

  it('resolves a bare h0wzy to an identity command rather than failing', () => {
    expect(parse('h0wzy')?.name).toBe('whoami')
  })

  it('reads a flag with a value and a flag without one', () => {
    const parsed = parse('projects --stack react --list-all')
    expect(parsed?.flags).toEqual({ stack: 'react', 'list-all': true })
  })

  it('returns null for empty input', () => {
    expect(parse('   ')).toBeNull()
  })
})

describe('suggest', () => {
  it('measures edit distance', () => {
    expect(distance('projects', 'porjects')).toBe(2)
    expect(distance('same', 'same')).toBe(0)
  })

  it('finds a near miss within distance 2, and refuses beyond it', () => {
    expect(closest('porjects', ['projects', 'stack'])).toBe('projects')
    expect(closest('zzzzzzzz', ['projects', 'stack'])).toBeUndefined()
  })

  it('completes by prefix', () => {
    expect(completions('pro', invocableNames())).toContain('projects')
  })
})

describe('registry', () => {
  it('derives help from the registry, so no command can be missing from it', () => {
    const result = execute('help', ctx())
    const helpTable = result.lines.find((l) => l.kind === 'table')
    expect(helpTable?.kind).toBe('table')
    if (helpTable?.kind !== 'table') throw new Error('unreachable')
    expect(helpTable.rows.map((r) => r[0]).sort()).toEqual(commands.map((c) => c.name).sort())
  })

  it('resolves every command by name and by each of its aliases', () => {
    for (const command of commands) {
      expect(resolve(command.name)?.name).toBe(command.name)
      for (const alias of command.aliases ?? []) {
        expect(resolve(alias)?.name, `alias ${alias}`).toBe(command.name)
      }
    }
  })
})

describe('execute — documented usages', () => {
  it('returns a well-formed result for every command', () => {
    for (const command of commands) {
      const result = execute(command.name, ctx())
      expect(Array.isArray(result.lines), command.name).toBe(true)
      expect([0, 1, 2]).toContain(result.status)
    }
  })

  it('reports experience as a semver derived from the start date', () => {
    const result = execute('h0wzy --version', ctx())
    const first = result.lines[0]
    expect(first.kind).toBe('text')
    if (first.kind !== 'text') throw new Error('unreachable')
    expect(first.text).toMatch(/^h0wzy \d+\.\d+\.0$/)
  })

  it('lists every project', () => {
    const result = execute('projects --list-all', ctx())
    const t = result.lines.find((l) => l.kind === 'table')
    if (t?.kind !== 'table') throw new Error('expected a table')
    expect(t.rows).toHaveLength(content.projects.length)
  })

  it('shows one project by id, including its limitations', () => {
    const result = execute('projects authsys', ctx())
    expect(result.status).toBe(0)
    const rendered = result.lines.map((l) => (l.kind === 'text' ? l.text : '')).join('\n')
    expect(rendered).toContain('authsys')
    expect(rendered).toContain('Makefile')
  })

  it('filters by technology', () => {
    const result = execute('projects --stack terraform', ctx())
    const t = result.lines.find((l) => l.kind === 'table')
    if (t?.kind !== 'table') throw new Error('expected a table')
    expect(t.rows.map((r) => r[0])).toEqual(
      expect.arrayContaining(['telasparana', 'selzler-construtora']),
    )
  })
})

describe('execute — effects are described, never performed', () => {
  it('returns a set-locale descriptor', () => {
    expect(execute('lang pt', ctx()).effect).toEqual({ type: 'set-locale', locale: 'pt' })
  })

  it('refuses "theme light" with a joke effect, never a real switch', () => {
    const result = execute('theme light', ctx())
    expect(result.effect?.type).toBe('joke')
    expect(result.status).toBe(0)
  })

  it('picks the joke deterministically from history length, not randomness', () => {
    expect(execute('theme light', ctx({ history: ['a', 'b'] })).effect).toEqual(
      execute('theme light', ctx({ history: ['a', 'b'] })).effect,
    )
  })

  it('confirms dark rather than erroring for "theme dark" and plain "theme"', () => {
    expect(execute('theme dark', ctx()).status).toBe(0)
    expect(execute('theme', ctx()).status).toBe(0)
    expect(execute('theme', ctx()).effect).toBeUndefined()
  })

  it('returns a navigate descriptor for a real project', () => {
    expect(execute('open telasparana', ctx()).effect).toEqual({
      type: 'navigate',
      href: '/work/telasparana/',
    })
  })

  it('returns a clear descriptor with no output', () => {
    const result = execute('clear', ctx())
    expect(result.effect).toEqual({ type: 'clear' })
    expect(result.lines).toEqual([])
  })
})

describe('execute — error contract', () => {
  it('produces nothing for empty or whitespace-only input', () => {
    expect(execute('', ctx())).toEqual({ lines: [], effect: undefined, status: 0 })
    expect(execute('   ', ctx())).toEqual({ lines: [], effect: undefined, status: 0 })
  })

  it('reports an unknown command and points at help', () => {
    const result = execute('nonsense', ctx())
    expect(result.status).toBe(1)
    const rendered = result.lines.map((l) => (l.kind === 'text' ? l.text : '')).join('\n')
    expect(rendered).toContain('nonsense')
    expect(rendered).toContain('help')
  })

  it('suggests the closest command for a near miss', () => {
    const rendered = execute('porjects', ctx())
      .lines.map((l) => (l.kind === 'text' ? l.text : ''))
      .join('\n')
    expect(rendered).toContain('projects')
  })

  it('suggests the closest project id for a near miss', () => {
    const result = execute('projects telasparan', ctx())
    expect(result.status).toBe(1)
    const rendered = result.lines.map((l) => (l.kind === 'text' ? l.text : '')).join('\n')
    expect(rendered).toContain('telasparana')
  })

  it('returns status 2 with usage for a bad flag value', () => {
    const result = execute('theme purple', ctx())
    expect(result.status).toBe(2)
    const rendered = result.lines.map((l) => (l.kind === 'text' ? l.text : '')).join('\n')
    expect(rendered).toContain('dark')
  })

  it('rejects input beyond 512 characters', () => {
    const result = execute('a'.repeat(513), ctx())
    expect(result.status).toBe(2)
  })
})

describe('execute — purity (Principle IV)', () => {
  it('returns deep-equal results for the same input twice', () => {
    for (const input of ['help', 'h0wzy --version', 'projects --list-all', 'stats', 'nonsense']) {
      expect(execute(input, ctx()), input).toEqual(execute(input, ctx()))
    }
  })

  it('does not mutate the context it is given', () => {
    const context = ctx({ history: ['help'] })
    const snapshot = JSON.stringify(context.history)
    execute('history', context)
    execute('clear', context)
    expect(JSON.stringify(context.history)).toBe(snapshot)
  })
})

describe('execute — locale coverage', () => {
  it('produces output in every locale for every command', () => {
    for (const locale of LOCALES) {
      for (const command of commands) {
        const result = execute(command.name, ctx({ locale }))
        expect(Array.isArray(result.lines), `${command.name} in ${locale}`).toBe(true)
      }
    }
  })

  it('renders error messages in Portuguese when the locale is pt', () => {
    const rendered = execute('nonsense', ctx({ locale: 'pt' }))
      .lines.map((l) => (l.kind === 'text' ? l.text : ''))
      .join('\n')
    expect(rendered).toContain('comando não encontrado')
    expect(rendered).not.toContain('command not found')
  })
})
