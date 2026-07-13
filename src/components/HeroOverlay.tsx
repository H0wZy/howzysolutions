import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export function HeroOverlay() {
  const { t } = useLanguage();

  return (
    <section className="page-section hero-overlay" id="hero">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <div className="eyebrow">{t.hero.eyebrow}</div>

        <h1>
          {t.hero.name}
          <span>{t.hero.role}</span>
        </h1>

        <p>{t.hero.description}</p>

        <div className="hero-actions">
          <a
            className="primary-button"
            href="#projects"
            data-scroll-to="projects"
          >
            {t.hero.primaryCta}
          </a>

          <a
            className="secondary-button"
            href="mailto:howzysolutions@gmail.com"
          >
            {t.hero.secondaryCta}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
