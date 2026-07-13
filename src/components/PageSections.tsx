import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { ToolkitSection } from "./ToolkitSection";

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-15%" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export function PageSections() {
  const { t } = useLanguage();
  const aboutLines = t.about.title.split("\n");

  return (
    <>
      <section className="page-section about-section" id="about">
        <motion.div className="section-inner" {...fadeUp}>
          <div className="eyebrow">{t.about.eyebrow}</div>
          <h2>
            {aboutLines.map((line, i) => (
              <span key={line}>
                {line}
                {i < aboutLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p>{t.about.body}</p>
        </motion.div>
      </section>

      <ToolkitSection />

      <section className="page-section projects-section" id="projects">
        <motion.div className="section-inner" {...fadeUp}>
          <div className="eyebrow">{t.projects.eyebrow}</div>
          <h2>{t.projects.title}</h2>
          <p>{t.projects.body}</p>
        </motion.div>
      </section>

      <section className="page-section contact-section" id="contact">
        <motion.div className="section-inner" {...fadeUp}>
          <div className="eyebrow">{t.contact.eyebrow}</div>
          <h2>{t.contact.title}</h2>
          <p>{t.contact.body}</p>

          <div className="hero-actions">
            <a
              className="primary-button"
              href="mailto:howzysolutions@gmail.com"
            >
              {t.contact.cta}
            </a>
          </div>

          <footer className="site-footer">
            <span>
              © {new Date().getFullYear()} Marcos "H0wZy" Junior. {t.footer.rights}
            </span>
            <div className="footer-links">
              <a href="https://github.com/H0wZy" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href="https://linktr.ee/h0wzymarcos" target="_blank" rel="noreferrer">
                Linktree
              </a>
            </div>
          </footer>
        </motion.div>
      </section>
    </>
  );
}
