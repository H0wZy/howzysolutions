import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-15%" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export function PageSections() {
  return (
    <>
      <section className="page-section about-section">
        <motion.div className="section-inner" {...fadeUp}>
          <div className="eyebrow">Sobre</div>
          <h2>
            Da estratégia ao código,
            <br />
            construindo produtos que importam.
          </h2>
          <p>
            Atuo na fronteira entre visão de negócio e execução técnica,
            liderando a criação de plataformas digitais, automações com IA e
            experiências de produto que geram resultado real.
          </p>
        </motion.div>
      </section>

      <section className="page-section projects-section" id="projects">
        <motion.div className="section-inner" {...fadeUp}>
          <div className="eyebrow">Projetos</div>
          <h2>Continue rolando para explorar</h2>
          <p>
            Clique em qualquer orbe na cena 3D para abrir os detalhes do
            projeto: problema, solução, papel e impacto.
          </p>
        </motion.div>
      </section>

      <section className="page-section contact-section">
        <motion.div className="section-inner" {...fadeUp}>
          <div className="eyebrow">Contato</div>
          <h2>Vamos construir algo juntos?</h2>
          <p>Aberto a novos projetos, parcerias e desafios técnicos.</p>

          <div className="hero-actions">
            <a
              className="primary-button"
              href="mailto:howzysolutions@gmail.com"
            >
              Fale comigo
            </a>
          </div>
        </motion.div>
      </section>
    </>
  );
}
