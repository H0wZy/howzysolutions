import type { Locale } from '../content/i18n/types'
import type { ContentBundle, PrivacySection } from '../content/types'
import { translate } from '../locale'
import { pathFor } from '../route'
import { Chrome } from '../components/Chrome'

/**
 * The privacy policy (src/content/privacy.ts): the general policy, then one
 * block per project that handles data of its own. TikTok Shop's Data Security
 * and Privacy Review was sent with /privacy/, which public/_redirects sends
 * here with a 301; that redirect stays for as long as the app exists.
 *
 * The contact is the profile's email contact rather than a second copy of the
 * address, so the two cannot drift apart.
 */

function Body({ section, locale }: { section: PrivacySection; locale: Locale }) {
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

export function Privacy({
  content,
  locale,
  pathname,
}: {
  content: ContentBundle
  locale: Locale
  pathname: string
}) {
  const { privacy } = content
  const email = content.profile.contacts.find((c) => c.kind === 'email')

  return (
    <>
      <Chrome locale={locale} path="h0wzy/privacy-policy" pathname={pathname} />
      <main>
        <header className="section">
          <div className="wrap">
            <h1>{translate(locale, 'privacy.title')}</h1>
            <p className="sub">{privacy.intro[locale]}</p>
            <p className="sub dim">
              <time dateTime={privacy.updated}>
                {translate(locale, 'privacy.updated', { date: privacy.updated })}
              </time>
              {email ? (
                <>
                  {' '}
                  {translate(locale, 'privacy.contact')} <a href={email.href}>{email.label}</a>
                </>
              ) : null}
            </p>
            {/* A reader sent here for one project finds it in one activation. */}
            <p className="sub dim">
              {translate(locale, 'privacy.projects')}:{' '}
              {privacy.projects.map((project, i) => (
                <span key={project.id}>
                  {i > 0 ? ', ' : null}
                  <a href={`#${project.id}`}>{project.name}</a>
                </span>
              ))}
            </p>
          </div>
        </header>

        {privacy.sections.map((section) => (
          <section key={section.id} className="section" id={section.id}>
            <div className="wrap">
              <h2>{section.heading[locale]}</h2>
              <Body section={section} locale={locale} />
            </div>
          </section>
        ))}

        {privacy.projects.map((project) => {
          const record = content.projects.find((p) => p.id === project.id)
          return (
            <section key={project.id} className="section" id={project.id}>
              <div className="wrap">
                <p className="sub dim">{translate(locale, 'privacy.projects')}</p>
                <h2>
                  {project.name} <span className="dim">· {project.tagline[locale]}</span>
                </h2>
                {project.summary[locale].map((paragraph) => (
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
                {project.sections.map((section) => (
                  <div key={section.id} id={section.id} className="detail-block">
                    <h3>{section.heading[locale]}</h3>
                    <Body section={section} locale={locale} />
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </main>
    </>
  )
}
