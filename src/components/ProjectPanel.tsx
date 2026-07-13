import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "../data/projects";
import { useLanguage } from "../context/LanguageContext";

type ProjectPanelProps = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectPanel({ project, onClose }: ProjectPanelProps) {
  const { locale, t } = useLanguage();

  return (
    <AnimatePresence>
      {project && (
        <motion.aside
          className="project-panel"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 80 }}
          transition={{ duration: 0.35 }}
        >
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>

          <div className="panel-year">{project.year}</div>

          <h2>{project.name}</h2>

          <section>
            <h3>{t.panel.problem}</h3>
            <p>{project.problem[locale]}</p>
          </section>

          <section>
            <h3>{t.panel.solution}</h3>
            <p>{project.solution[locale]}</p>
          </section>

          <section>
            <h3>{t.panel.role}</h3>
            <p>{project.role[locale]}</p>
          </section>

          <section>
            <h3>Tech</h3>
            <div className="tech-list">
              {project.technologies.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </section>

          <section>
            <h3>{t.panel.impact}</h3>
            <p>{project.impact[locale]}</p>
          </section>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
