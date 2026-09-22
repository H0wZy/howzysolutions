import type { Locale } from '../content/i18n/types'
import type { StringKey } from '../content/i18n/en'
import type { ContentBundle, LegalDocument, LegalSection } from '../content/types'
import { privacy } from '../content/privacy'
import { terms } from '../content/terms'
import { translate } from '../locale'
import { pathFor } from '../route'
import { Chrome } from '../components/Chrome'
import { SectionRail } from '../components/SectionRail'
import { Footer } from '../components/Footer'
import { legalTopicAnchors } from '../navigation'

/**
 * Both legal documents, and both of the shapes each one takes.
 *
 * The privacy policy (src/content/privacy.ts) and the terms of service
 * (src/content/terms.ts) are the same record: an intro, a date, anchored
 * sections, then one block per app that needs a section of its own. One
 * component renders them, so neither drifts from the other.
 *
 * `appId` switches to the second shape: that app's block alone, at
 * /privacy-policy/<id>/ or /terms-of-service/<id>/, which are the URLs a store
 * asks for when it reviews one app. The general sections are not repeated
 * there, they are linked, and the id is the same one that anchors the block on
 * the index.
 *
 * Nothing here is imported by src/App.tsx, and that is load-bearing rather
 * than incidental: these pages are prerendered and never hydrated (see
 * src/main.tsx), so neither the component nor either record ships in the
 * client bundle. A page of static prose with no event handler on it has no
 * reason to be sent twice. Anything interactive added here has to move both
 * files back into App and pay for itself against the JavaScript budget.
 *
 * TikTok Shop's Data Security and Privacy Review was sent with /privacy/,
 * which public/_redirects sends to /privacy-policy/ with a 301; that redirect
 * stays for as long as the app exists.
 *
 * The contact is the profile's email contact rather than a second copy of the
 * address, so the two cannot drift apart.
 */

/**
 * The record, its title, the word it uses for its per-entry blocks, and the two
 * links an app page carries: back to this document's general sections, and
 * across to the other document's page for the same app.
 */
const KINDS = {
  privacy: {
    document: privacy,
    title: 'privacy.title',
    group: 'privacy.projects',
    general: 'legal.generalPolicy',
    cross: 'legal.termsFor',
  },
  terms: {
    document: terms,
    title: 'terms.title',
    group: 'terms.apps',
    general: 'legal.general',
    cross: 'legal.privacyFor',
  },
} as const satisfies Record<
  string,
  { document: LegalDocument; title: StringKey; group: StringKey; general: StringKey; cross: StringKey }
>

export type LegalKind = keyof typeof KINDS

function Body({ section, locale }: { section: LegalSection; locale: Locale }) {
  return (
    <>
      {section.body[locale].map((paragraph) => (
        <p key={paragraph} className="prose">
          {paragraph}
        </p>
      ))}
      {section.items ? (
        <ul className="prose">
          {section.items[locale].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </>
  )
}

export function Legal({
  content,
  kind,
  appId,
  locale,
  pathname,
}: {
  content: ContentBundle
  kind: LegalKind
  /** Set only by a per-app page: render that app's block by itself. */
  appId?: string
  locale: Locale
  pathname: string
}) {
  const { document, title, group, general, cross } = KINDS[kind]
  const otherKind: LegalKind = kind === 'privacy' ? 'terms' : 'privacy'
  const email = content.profile.contacts.find((c) => c.kind === 'email')
  const apps = document.projects ?? []
  /* An id nothing matches falls back to the index rather than to an empty
     page: the prerender only emits real ids, so this is the client's guard. */
  const only = appId ? apps.find((app) => app.id === appId) : undefined
  const shown = only ? [only] : apps
  /* The other document's page for this same app, when it has one. Both records
     use the app's own id, so the pair can never point at different apps. */
  const crossed = only && KINDS[otherKind].document.projects?.some((app) => app.id === only.id)

  return (
    <>
      <Chrome locale={locale} pathname={pathname} leafLabel={only?.name} />
      <main className="document-layout">
        <SectionRail
          entries={legalTopicAnchors(only ? { ...document, sections: [], projects: [only] } : document)}
          locale={locale}
        />
        <div className="document-body">
          <header className="section">
            <div className="wrap">
              <h1>{translate(locale, title)}</h1>
              <p className="sub">
                {only ? `${only.name} · ${only.tagline[locale]}` : document.intro[locale]}
              </p>
              <p className="sub dim">
                <time dateTime={document.updated}>
                  {translate(locale, 'legal.updated', { date: document.updated })}
                </time>
                {email ? (
                  <>
                    {' '}
                    {translate(locale, 'legal.contact')} <a href={email.href}>{email.label}</a>
                  </>
                ) : null}
              </p>
              {/* A reader sent here for one app finds it in one activation. */}
              {apps.length && !only ? (
                <p className="sub dim">
                  {translate(locale, group)}:{' '}
                  {apps.map((app, i) => (
                    <span key={app.id}>
                      {i > 0 ? ', ' : null}
                      <a href={pathFor({ page: 'legalApp', doc: kind, id: app.id }, locale)}>
                        {app.name}
                      </a>
                    </span>
                  ))}
                </p>
              ) : null}
              {/*
               * The general sections are linked from the app page, never
               * repeated. The other document is linked at the same app's own
               * page when it has one, and at its index when it does not: a link
               * to a page that resolves to nothing is worse than none.
               */}
              {only ? (
                <p className="sub dim">
                  <a href={pathFor({ page: kind }, locale)}>{translate(locale, general)}</a>
                  {' · '}
                  <a
                    href={pathFor(
                      crossed
                        ? { page: 'legalApp', doc: otherKind, id: only.id }
                        : { page: otherKind },
                      locale,
                    )}
                  >
                    {translate(locale, cross)}
                  </a>
                </p>
              ) : null}
            </div>
          </header>

          {only
            ? null
            : document.sections.map((section) => (
                <section key={section.id} className="section" id={section.id}>
                  <div className="wrap">
                    <h2>{section.heading[locale]}</h2>
                    <Body section={section} locale={locale} />
                  </div>
                </section>
              ))}

          {shown.map((app) => {
            const record = content.projects.find((p) => p.id === app.id)
            return (
              <section key={app.id} className="section" id={app.id}>
                <div className="wrap">
                  <p className="sub dim">{translate(locale, group)}</p>
                  <h2 className="privacy-project-title">
                    {app.name}{' '}
                    <span className="dim">
                      · <span className="nowrap">{app.tagline[locale]}</span>
                    </span>
                  </h2>
                  {app.summary[locale].map((paragraph) => (
                    <p key={paragraph} className="prose">
                      {paragraph}
                    </p>
                  ))}
                  {record ? (
                    <p className="prose">
                      <a href={pathFor({ page: 'work', id: record.id }, locale)}>
                        {translate(locale, 'privacy.aboutProject')} →
                      </a>
                    </p>
                  ) : null}
                  {app.sections.map((section) => (
                    <div key={section.id} id={section.id} className="detail-block">
                      <h3>{section.heading[locale]}</h3>
                      <Body section={section} locale={locale} />
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
          <Footer locale={locale} />
        </div>
      </main>
    </>
  )
}
