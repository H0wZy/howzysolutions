/**
 * Did-you-mean support. A visitor typing `porjects` should be helped rather than
 * stonewalled — the one place a little forgiving logic earns its bytes (FR-011).
 */

/** Levenshtein distance, iterative with a single row of state. */
export function distance(a: string, b: string): number {
  if (a === b) return 0
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i)

  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost)
    }
    previous = current
  }
  return previous[b.length]
}

/** Closest candidate within edit distance 2, or undefined. */
export function closest(input: string, candidates: string[], maxDistance = 2): string | undefined {
  let best: string | undefined
  let bestDistance = maxDistance + 1

  for (const candidate of candidates) {
    const d = distance(input.toLowerCase(), candidate.toLowerCase())
    if (d < bestDistance) {
      bestDistance = d
      best = candidate
    }
  }
  return bestDistance <= maxDistance ? best : undefined
}

/** Candidates sharing a prefix, for tab completion. */
export function completions(input: string, candidates: string[]): string[] {
  const lower = input.toLowerCase()
  return candidates.filter((c) => c.toLowerCase().startsWith(lower))
}
