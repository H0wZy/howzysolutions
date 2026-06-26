import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "../data/projects";

type ProjectPanelProps = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectPanel({ project, onClose }: ProjectPanelProps) {
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
          <button className="close-button" onClick={onClose}>
            ×
          </button>

          <div className="panel-year">{project.year}</div>

          <h2>{project.name}</h2>

          <section>
            <h3>Problema</h3>
            <p>{project.problem}</p>
          </section>

          <section>
            <h3>Solução</h3>
            <p>{project.solution}</p>
          </section>

          <section>
            <h3>Meu papel</h3>
            <p>{project.role}</p>
          </section>

          <section>
            <h3>Tecnologias</h3>
            <div className="tech-list">
              {project.technologies.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </section>

          <section>
            <h3>Impacto</h3>
            <p>{project.impact}</p>
          </section>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}