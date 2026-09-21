/*
 * Generates static Markdown representations of the CV (/cv.md and /pt/cv.md)
 * from src/content/cv.generated.json at build time.
 *
 * Contract: specs/003-cv-export-actions/contracts/cv-export-endpoints.md
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const cvDataPath = join(root, 'src', 'content', 'cv.generated.json')
const publicDir = join(root, 'public')
const distDir = join(root, 'dist')

function buildMarkdown(cv, locale) {
  const isPt = locale === 'pt'
  const dateStamp = cv.capturedAt.slice(0, 10)
  const canonicalUrl = isPt ? 'https://howzysolutions.com/pt/cv' : 'https://howzysolutions.com/cv'
  const siteUrl = isPt ? 'https://howzysolutions.com/pt' : 'https://howzysolutions.com'
  const pdfUrl = isPt ? 'https://howzysolutions.com/cv.pdf/ptbr' : 'https://howzysolutions.com/cv.pdf/eng'
  const title = isPt
    ? 'Marcos Junior Bueno Selzler - Curriculo'
    : 'Marcos Junior Bueno Selzler - Curriculum Vitae'
  const headline = cv.headline[locale]
  const summary = cv.summary[locale]

  const lines = [
    '---',
    `title: ${title}`,
    `description: ${JSON.stringify(summary)}`,
    `canonical: ${canonicalUrl}`,
    `captured_at: ${dateStamp}`,
    `commit: ${cv.sourceCommit}`,
    'links:',
    `  website: ${siteUrl}`,
    '  github: https://github.com/H0wZy',
    `  pdf: ${pdfUrl}`,
    '---',
    '',
    '# Marcos Junior Bueno Selzler',
    `> ${headline}`,
    '',
    `- **${isPt ? 'Localização' : 'Location'}:** Londrina, PR, Brazil`,
    `- **${isPt ? 'Website' : 'Website'}:** ${siteUrl}`,
    `- **GitHub:** https://github.com/H0wZy`,
    `- **${isPt ? 'Versão em PDF' : 'PDF Version'}:** ${pdfUrl}`,
    '',
    `## ${isPt ? 'Resumo Profissional' : 'Summary'}`,
    summary,
    '',
  ]

  for (const section of cv.sections) {
    lines.push(`## ${section.title[locale]}`)

    if (section.kind === 'experience') {
      for (const entry of section.entries) {
        const clientSuffix = entry.client ? ` (${entry.client})` : ''
        lines.push(`### ${entry.title[locale]} · ${entry.employer}${clientSuffix}`)
        const start = entry.start
        const end = entry.end ? entry.end : (isPt ? 'presente' : 'present')
        lines.push(`*${start} ${isPt ? 'até' : 'to'} ${end} | ${entry.location[locale]}*`)
        lines.push('')
        for (const item of entry.responsibilities[locale]) {
          lines.push(`- ${item}`)
        }
        lines.push('')
      }
    } else if (section.kind === 'awards') {
      for (const entry of section.entries) {
        lines.push(`### ${entry.title[locale]} · ${entry.project[locale]}`)
        lines.push(`*${entry.date}*`)
        if (entry.evidence) {
          lines.push(`[${entry.evidence.label[locale]}](${entry.evidence.href})`)
        }
        lines.push('')
        for (const item of entry.detail[locale]) {
          lines.push(`- ${item}`)
        }
        lines.push('')
      }
    } else if (section.kind === 'skills') {
      for (const entry of section.entries) {
        lines.push(`### ${entry.label[locale]}`)
        lines.push(entry.items[locale].join(', '))
        lines.push('')
      }
    } else if (section.kind === 'projects') {
      for (const entry of section.entries) {
        lines.push(`### ${entry.name[locale]}`)
        if (entry.links && entry.links.length > 0) {
          lines.push(entry.links.map((l) => `[${l.label[locale]}](${l.href})`).join(' · '))
        }
        lines.push('')
        for (const item of entry.detail[locale]) {
          lines.push(`- ${item}`)
        }
        lines.push('')
      }
    } else if (section.kind === 'education') {
      for (const entry of section.entries) {
        lines.push(`### ${entry.degree[locale]} · ${entry.institution}`)
        lines.push(`*${entry.end} | ${entry.location[locale]}*`)
        lines.push('')
      }
    } else if (section.kind === 'certifications') {
      for (const entry of section.entries) {
        lines.push(`### ${entry.name} · ${entry.issuer.label[locale]}`)
        lines.push(`*${entry.date}*`)
        if (entry.issuer.href) {
          lines.push(`[${entry.issuer.label[locale]}](${entry.issuer.href})`)
        }
        lines.push('')
        for (const item of entry.detail[locale]) {
          lines.push(`- ${item}`)
        }
        lines.push('')
      }
    }
  }

  return lines.join('\n')
}

function run() {
  if (!existsSync(cvDataPath)) {
    console.error(`! cv-markdown: ${cvDataPath} not found`)
    process.exit(1)
  }

  const raw = readFileSync(cvDataPath, 'utf8')
  const cv = JSON.parse(raw)

  const enMd = buildMarkdown(cv, 'en')
  const ptMd = buildMarkdown(cv, 'pt')

  // Write to public/cv.md/ directory
  mkdirSync(join(publicDir, 'cv.md'), { recursive: true })
  writeFileSync(join(publicDir, 'cv.md', 'eng'), enMd)
  writeFileSync(join(publicDir, 'cv.md', 'ptbr'), ptMd)
  console.log('ok cv-markdown: wrote public/cv.md/{eng,ptbr}')

  // Write to dist/ if it exists (post-build)
  if (existsSync(distDir)) {
    mkdirSync(join(distDir, 'cv.md'), { recursive: true })
    writeFileSync(join(distDir, 'cv.md', 'eng'), enMd)
    writeFileSync(join(distDir, 'cv.md', 'ptbr'), ptMd)
    console.log('ok cv-markdown: wrote dist/cv.md/{eng,ptbr}')
  }
}

run()
