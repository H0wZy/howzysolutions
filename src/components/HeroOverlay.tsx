import { motion } from "framer-motion";

export function HeroOverlay() {
  return (
    <div className="hero-overlay">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <div className="eyebrow">Portfolio 3D Experience</div>

        <h1>
          Marcos "H0wZy" Junior
          <span>Technology Executive</span>
        </h1>

        <p>
          Criando soluções digitais, experiências interativas e produtos
          tecnológicos para transformar ideias em valor real para negócios.
        </p>

        <div className="hero-actions">
          <a className="primary-button" href="#projects">
            Explorar projetos
          </a>

          <a
            className="secondary-button"
            href="mailto:howzysolutions@gmail.com"
          >
            Fale comigo
          </a>
        </div>
      </motion.div>
    </div>
  );
}