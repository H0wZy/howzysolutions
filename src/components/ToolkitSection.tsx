import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-15%" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export function ToolkitSection() {
  const { t } = useLanguage();

  return (
    <section className="page-section toolkit-section" id="toolkit">
      <motion.div className="section-inner toolkit-inner" {...fadeUp}>
        <div className="eyebrow">{t.toolkit.eyebrow}</div>
        <h2>{t.toolkit.title}</h2>
        <p>{t.toolkit.body}</p>

        <div className="toolkit-groups">
          {t.toolkit.groups.map((group) => (
            <div key={group.label} className="toolkit-group">
              <h3>{group.label}</h3>
              <div className="tech-list">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
