import { describe, expect, it } from 'vitest'
import { workPage, type Project } from '../types'

/**
 * Pure slicing logic, so it is tested against a synthetic set rather than the
 * real content — the real count is free to change without touching this file.
 */
function makeProject(id: string): Project {
  return {
    id,
    name: id,
    kind: 'product',
    state: 'production',
    period: { start: '2026-01-01', end: '2026-01-02' },
    commits: 1,
    summary: { en: id, pt: id },
    problem: { en: id, pt: id },
    capabilities: { en: [id], pt: [id] },
    stack: [],
    development: { en: [id], pt: [id] },
    limitations: { en: [id], pt: [id] },
  }
}

const nine = Array.from({ length: 9 }, (_, i) => makeProject(`p${i + 1}`))

describe('workPage', () => {
  it('slices nine projects into five then four, in published order', () => {
    expect(workPage(nine, 1).projects.map((p) => p.id)).toEqual([
      'p1',
      'p2',
      'p3',
      'p4',
      'p5',
    ])
    expect(workPage(nine, 2).projects.map((p) => p.id)).toEqual(['p6', 'p7', 'p8', 'p9'])
  })

  it('covers the full set with no duplicate and no omission', () => {
    const union = [...workPage(nine, 1).projects, ...workPage(nine, 2).projects].map(
      (p) => p.id,
    )
    expect(new Set(union).size).toBe(nine.length)
    expect(union.sort()).toEqual(nine.map((p) => p.id).sort())
  })

  it('never pads the last page', () => {
    expect(workPage(nine, 2).projects).toHaveLength(4)
  })

  it('derives total pages from the count, minimum one', () => {
    expect(workPage(nine, 1).total).toBe(2)
    expect(workPage(nine.slice(0, 5), 1).total).toBe(1)
    expect(workPage([], 1).total).toBe(1)
  })

  it('clamps a page below 1 or above the total to the nearest valid page', () => {
    expect(workPage(nine, 0).number).toBe(1)
    expect(workPage(nine, -5).number).toBe(1)
    expect(workPage(nine, 999).number).toBe(2)
  })

  it('reports a single page for a set that fits on one page', () => {
    expect(workPage(nine.slice(0, 5), 1).total).toBe(1)
    expect(workPage(nine.slice(0, 1), 7).total).toBe(1)
  })
})
