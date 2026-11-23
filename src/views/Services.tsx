import type { Locale } from '../content/i18n/types'
import type { ContentBundle } from '../content/types'
import { howSteps, services, workImages, type Proof } from '../content/services'
import { translate } from '../locale'
import { pathFor } from '../route'
import { Arrow } from '../components/site/Arrow'
import { ContactForm } from '../components/site/ContactForm'
import { Lines, LineList } from '../components/site/Lines'
import { SiteFooter } from '../components/site/SiteFooter'
import { SiteNav } from '../components/site/SiteNav'

/**
 * /services/: the four things on offer, each proven by projects that exist,
 * then how a job runs and the contact form. A static document, like the home
 * page; the sticky index follows the scroll through src/enhance/services.ts
 * and is a plain list of anchors without it.
 */
export function Services({
  content,
  locale,
  pathname,
}: {
  content: ContentBundle
  locale: Locale
  pathname: string
}) {
  const { profile } = content
  const projectHref = (id: string) => pathFor({ page: 'work', id }, locale)
  const pictures = (proof: Proof[]) =>
    proof.flatMap((p) => ('image' in p ? [workImages[p.image]] : []))
  const lines = (proof: Proof[]) => proof.flatMap((p) => ('label' in p ? [p] : []))

  return (
    <div className="site" data-page="services">
      <SiteNav locale={locale} pathname={pathname} />

      <main id="main">
        <header className="head">
          <h1>
            {translate(locale, 'services.heading')}
            <i>.</i>
          </h1>
          <p>{translate(locale, 'services.lead')}</p>
        </header>

        <div className="wrap2">
          <nav className="idx mono" aria-label={translate(locale, 'services.index')} data-index>
            {services.map((service) => (
              <a key={service.id} href={`#${service.id}`}>
                {service.title[locale].join(' ')}
              </a>
            ))}
            <a href="#contato" className="to-contact">
              {translate(locale, 'services.index.contact')} <Arrow />
            </a>
          </nav>

          <div className="list">
            {services.map((service) => {
              const shown = pictures(service.proof)
              const text = lines(service.proof)
              return (
                <section key={service.id} className="s" id={service.id} aria-labelledby={`${service.id}-h`}>
                  <h2 id={`${service.id}-h`}>
                    <LineList lines={service.title[locale]} />
                  </h2>
                  <p className="what">{service.what[locale]}</p>
                  <ul className="items">
                    {service.items.map((item) => (
                      <li key={item.label.en}>
                        <span>{item.label[locale]}</span>
                        <span>{item.tech[locale]}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="proof" role="group" aria-label={translate(locale, 'services.proof')}>
                    {shown.length > 0 && (
                      <div className="pics">
                        {shown.map((image) => (
                          <a key={image.src} href={projectHref(image.projectId)}>
                            <div className="img">
                              <img src={image.src} width={image.width} height={image.height} alt={image.alt[locale]} loading="lazy" />
                            </div>
                            <span className="mono">{image.caption[locale]}</span>
                          </a>
                        ))}
                      </div>
                    )}
                    <ul className="names mono">
                      {text.map((p) => (
                        <li key={p.label}>
                          {p.projectId ? (
                            <a href={projectHref(p.projectId)}>
                              {p.label} <Arrow />
                            </a>
                          ) : (
                            <span>{p.label}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )
            })}
          </div>
        </div>

        <section className="how" aria-labelledby="how-heading">
          <h2 id="how-heading">{translate(locale, 'services.how.heading')}</h2>
          <ol>
            {howSteps.map((step) => (
              <li key={step.name.en}>
                <b>{step.name[locale]}</b>
                <p>{step.text[locale]}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="contact" id="contato" aria-labelledby="contact-heading" data-contact>
          <div>
            <h2 id="contact-heading">
              <Lines text={translate(locale, 'services.contact.heading')} />
            </h2>
            <div className="ways mono">
              {profile.contacts.map((contact) => (
                <a key={contact.kind} href={contact.href}>
                  {translate(locale, contact.labelKey)} <Arrow />
                </a>
              ))}
            </div>
          </div>
          <div>
            <ContactForm locale={locale} />
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </div>
  )
}
