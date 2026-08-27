import type { Locale } from '../content/i18n/types'
import type {
  ContentBundle,
  CvAward,
  CvCertification,
  CvEducation,
  CvProjectEntry,
  CvRole,
  CvSection,
  CvSkillGroup,
  CvView,
} from '../content/types'
import { educationRange, projectIdFor, railEntries } from '../content/cv'
import { translate } from '../locale'
import { pathFor } from '../route'
import { Chrome } from '../components/Chrome'
import { CvDownloads } from '../components/CvDownloads'
import { SectionRail } from '../components/SectionRail'

/**
 * The professional record as a page (US1).
 *
 * Every fact here comes from src/content/cv.ts and none from this file's
 * markup (FR-053, Principle I). The same module feeds the terminal's `cv`
 * command and the rail, so the three cannot diverge (FR-067).
 *
 * Rendering is driven by `section.kind`, because the CV's `\entry{}{}{}{}`
 * macro is overloaded: four arguments mean "role, dates, title, location"
 * under Professional Experience and "award, date, project, link" under Awards.
 * The parser is section-driven and so is this (research D5).
 */

function monthLabel(value: string, locale: Locale): string {
  const [year, month] = value.split('-')
  if (!month) return year
  // Intl, not a month-name table: Principle II, rung 3 (FR-055 has no bearing
  // here — this formats a date that exists, never invents one that does not).
  const formatter = new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
  return formatter.format(new Date(`${value}-01T00:00:00Z`))
}

/**
 * FR-055: an ongoing role ends in a TRANSLATED WORD, never a computed date.
 * The joining word comes from `work.period`, the key the project metrics
 * already use, rather than a second phrasing of the same idea.
 */
function rangeLabel(start: string, end: string | null, locale: Locale): string {
  return translate(locale, 'work.period', {
    start: monthLabel(start, locale),
    end: end ? monthLabel(end, locale) : translate(locale, 'cv.present'),
  })
}

function Bullets({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <ul className="prose">
      {items.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  )
}

function Role({ role, locale }: { role: CvRole; locale: Locale }) {
  return (
    <article className="cv-entry">
      <h3>
        {role.employer}
        {role.client ? <span className="dim"> | {role.client}</span> : null}
      </h3>
      {/*
        The date range sits inside the same block as the role and immediately
        after its title, so a screen reader navigating by heading announces the
        two together rather than orphaning the dates (US1 scenario 3).
      */}
      <p className="sub">
        {role.title[locale]} <span className="dim">· {role.location[locale]}</span>
      </p>
      <p className="sub dim">
        <time dateTime={role.start}>{rangeLabel(role.start, role.end, locale)}</time>
      </p>
      <Bullets items={role.responsibilities[locale]} />
    </article>
  )
}

function Award({ award, locale }: { award: CvAward; locale: Locale }) {
  return (
    <article className="cv-entry">
      <h3>{award.title[locale]}</h3>
      <p className="sub">
        {award.project[locale]} <span className="dim">· {monthLabel(award.date, locale)}</span>
      </p>
      <p className="sub">
        <a href={award.evidence.href} rel="noreferrer noopener" target="_blank">
          {award.evidence.label[locale]}
        </a>
      </p>
      <Bullets items={award.detail[locale]} />
    </article>
  )
}

function SkillGroup({ group, locale }: { group: CvSkillGroup; locale: Locale }) {
  return (
    <div className="cv-entry">
      <h3>{group.label[locale]}</h3>
      <ul className="cv-skills">
        {group.items[locale].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

/**
 * FR-064: a project that already has a record in src/content/projects/ is
 * REFERENCED and never restated. Where the map resolves, the extracted
 * description is suppressed and the name links to the page that owns it;
 * where it misses, the extracted description renders, because otherwise those
 * projects would have no description at all (D9).
 */
function ProjectEntry({
  entry,
  locale,
  content,
}: {
  entry: CvProjectEntry
  locale: Locale
  content: ContentBundle
}) {
  const id = projectIdFor(entry.name.en)
  const record = id ? content.projects.find((p) => p.id === id) : undefined

  return (
    <article className="cv-entry">
      <h3>
        {record ? (
          <a href={pathFor({ page: 'work', id: record.id }, locale)}>{entry.name[locale]}</a>
        ) : (
          entry.name[locale]
        )}
      </h3>
      <p className="sub">
        {entry.links.map((link) => (
          <a key={link.href} href={link.href} rel="noreferrer noopener" target="_blank">
            {link.label[locale]}
          </a>
        ))}
      </p>
      {record ? (
        <p className="sub dim">
          <a href={pathFor({ page: 'work', id: record.id }, locale)}>
            {translate(locale, 'cv.seeProject')}
          </a>
        </p>
      ) : (
        <Bullets items={entry.detail[locale]} />
      )}
    </article>
  )
}

/**
 * FR-081: the degree's 2023 start is a fact THIS SITE holds and the CV does
 * not, so the page says so rather than letting a reader take it for a CV fact.
 */
function Education({ entry, locale }: { entry: CvEducation; locale: Locale }) {
  const range = educationRange(entry.institution, entry.end)
  const siteHeld = range !== entry.end

  return (
    <article className="cv-entry">
      <h3>{entry.degree[locale]}</h3>
      <p className="sub">
        {entry.institution} <span className="dim">· {entry.location[locale]}</span>
      </p>
      <p className="sub dim">
        {range}
        {siteHeld ? <> ({translate(locale, 'cv.siteHeld')})</> : null}
      </p>
    </article>
  )
}

function Certification({ entry, locale }: { entry: CvCertification; locale: Locale }) {
  return (
    <article className="cv-entry">
      <h3>{entry.name}</h3>
      <p className="sub">
        {entry.subject[locale]} <span className="dim">· {monthLabel(entry.date, locale)}</span>
      </p>
      <p className="sub">
        <a href={entry.issuer.href} rel="noreferrer noopener" target="_blank">
          {entry.issuer.label[locale]}
        </a>
      </p>
      <Bullets items={entry.detail[locale]} />
    </article>
  )
}

function Section({
  section,
  locale,
  content,
}: {
  section: CvSection
  locale: Locale
  content: ContentBundle
}) {
  return (
    <section className="section" id={section.id}>
      <h2>{section.title[locale]}</h2>
      {section.entries.map((entry, index) => {
        const key = `${section.id}-${index}`
        if (section.kind === 'experience') return <Role key={key} role={entry as CvRole} locale={locale} />
        if (section.kind === 'awards') return <Award key={key} award={entry as CvAward} locale={locale} />
        if (section.kind === 'skills')
          return <SkillGroup key={key} group={entry as CvSkillGroup} locale={locale} />
        if (section.kind === 'projects')
          return (
            <ProjectEntry
              key={key}
              entry={entry as CvProjectEntry}
              locale={locale}
              content={content}
            />
          )
        if (section.kind === 'education')
          return <Education key={key} entry={entry as CvEducation} locale={locale} />
        return <Certification key={key} entry={entry as CvCertification} locale={locale} />
      })}
    </section>
  )
}

/** FR-056, FR-080: when these facts were captured, and from which commit. */
function CaptureStamp({ cv, locale }: { cv: CvView; locale: Locale }) {
  if (cv.isFallback) {
    return <p className="sub dim">{translate(locale, 'cv.capturedFallback')}</p>
  }
  return (
    <p className="sub dim">
      {translate(locale, 'cv.captured', {
        source: `curriculum-vitae@${cv.sourceCommit}`,
        date: cv.capturedAt.slice(0, 10),
      })}
    </p>
  )
}

export function Cv({
  content,
  locale,
  pathname,
}: {
  content: ContentBundle
  locale: Locale
  pathname: string
}) {
  const { cv } = content

  return (
    <>
      <Chrome locale={locale} path="h0wzy/cv" pathname={pathname} />
      <main className="cv-layout">
        <SectionRail entries={railEntries(cv)} locale={locale} />

        <div className="cv-body">
          {/*
            SC-005: employer, role and start date within the first screen at
            360px wide, without scrolling. Measured 2026-08-27: with the
            summary paragraph, the downloads and the capture stamp all in this
            header, the first role sat at 1141px on a 360x800 viewport — three
            screens down. None of them is required to sit above the record;
            US1 (reading the record) is the page's stated primary purpose and
            US2 (downloading) is a separate, equally-ranked story with no
            positional requirement. The header is now the title and the
            one-line role tag only.
          */}
          <header className="section">
            <div className="wrap">
              <h1>{translate(locale, 'cv.title')}</h1>
              <p className="sub">{cv.headline[locale]}</p>
            </div>
          </header>

          <div className="wrap">
            {cv.sections.map((section) => (
              <Section key={section.id} section={section} locale={locale} content={content} />
            ))}
          </div>

          {/*
            The summary, the downloads and the capture stamp close the page
            rather than open it: by the time a reader reaches here they have
            the full record, and the download is the natural next action.
          */}
          <section className="section">
            <div className="wrap">
              <p className="prose">{cv.summary[locale]}</p>
              <CvDownloads cv={cv} locale={locale} />
              <CaptureStamp cv={cv} locale={locale} />
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
