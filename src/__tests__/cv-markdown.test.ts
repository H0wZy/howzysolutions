import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const enMdPath = join(root, 'public', 'cv.md', 'eng')
const ptMdPath = join(root, 'public', 'cv.md', 'ptbr')
const enPdfPath = join(root, 'public', 'cv.pdf', 'eng')
const ptPdfPath = join(root, 'public', 'cv.pdf', 'ptbr')

describe('Static CV Markdown and PDF Generation', () => {
  it('generates public/cv.md/{eng,ptbr} and public/cv.pdf/{eng,ptbr}', () => {
    expect(existsSync(enMdPath)).toBe(true)
    expect(existsSync(ptMdPath)).toBe(true)
    expect(existsSync(enPdfPath)).toBe(true)
    expect(existsSync(ptPdfPath)).toBe(true)
  })

  it('includes valid YAML frontmatter in English', () => {
    const content = readFileSync(enMdPath, 'utf8')
    expect(content.startsWith('---\n')).toBe(true)
    expect(content).toContain('title: Marcos Junior Bueno Selzler - Curriculum Vitae')
    expect(content).toContain('canonical: https://howzysolutions.com/cv')
    expect(content).toContain('pdf: https://howzysolutions.com/cv.pdf/eng')
    expect(content).toMatch(/captured_at: \d{4}-\d{2}-\d{2}/)
    expect(content).toContain('commit: ')
  })

  it('includes valid YAML frontmatter in Portuguese', () => {
    const content = readFileSync(ptMdPath, 'utf8')
    expect(content.startsWith('---\n')).toBe(true)
    expect(content).toContain('title: Marcos Junior Bueno Selzler - Curriculo')
    expect(content).toContain('canonical: https://howzysolutions.com/pt/cv')
    expect(content).toContain('pdf: https://howzysolutions.com/cv.pdf/ptbr')
    expect(content).toMatch(/captured_at: \d{4}-\d{2}-\d{2}/)
  })

  it('contains essential sections in both languages', () => {
    const enContent = readFileSync(enMdPath, 'utf8')
    const ptContent = readFileSync(ptMdPath, 'utf8')

    expect(enContent).toContain('## Professional Experience')
    expect(enContent).toContain('## Skills')
    expect(enContent).toContain('## Education')

    expect(ptContent).toContain('## Experiência Profissional')
    expect(ptContent).toContain('## Habilidades')
    expect(ptContent).toContain('## Formação Acadêmica')
  })
})
