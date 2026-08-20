/**
 * Tokenizes an input line into a command name, positional arguments and flags.
 * Pure: no I/O, no DOM, no clock.
 */

export type ParsedInput = {
  name: string
  args: string[]
  flags: Record<string, string | boolean>
}

/** Splits on whitespace while keeping quoted runs together. */
export function tokenize(input: string): string[] {
  const tokens: string[] = []
  let current = ''
  let quote: '"' | "'" | null = null

  for (const char of input) {
    if (quote) {
      if (char === quote) quote = null
      else current += char
      continue
    }
    if (char === '"' || char === "'") {
      quote = char
      continue
    }
    if (/\s/.test(char)) {
      if (current) {
        tokens.push(current)
        current = ''
      }
      continue
    }
    current += char
  }
  if (current) tokens.push(current)
  return tokens
}

/**
 * `h0wzy` is accepted as an optional leading word, so both `h0wzy --version`
 * and `version` reach the same command.
 */
const OPTIONAL_PREFIX = 'h0wzy'

export function parse(input: string): ParsedInput | null {
  const tokens = tokenize(input.trim())
  if (tokens.length === 0) return null

  if (tokens[0].toLowerCase() === OPTIONAL_PREFIX) {
    tokens.shift()
    // `h0wzy` alone, or `h0wzy --version`, both resolve sensibly.
    if (tokens.length === 0) tokens.push('whoami')
  }

  let name = (tokens.shift() ?? '').toLowerCase()
  const args: string[] = []
  const flags: Record<string, string | boolean> = {}

  // A leading flag means the command was addressed as `h0wzy --version`.
  if (name.startsWith('--')) {
    tokens.unshift(name)
    name = name.slice(2).toLowerCase()
    tokens.shift()
  }

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (!token.startsWith('--')) {
      args.push(token)
      continue
    }
    const key = token.slice(2)
    const next = tokens[i + 1]
    if (next !== undefined && !next.startsWith('--')) {
      flags[key] = next
      i++
    } else {
      flags[key] = true
    }
  }

  return { name, args, flags }
}
