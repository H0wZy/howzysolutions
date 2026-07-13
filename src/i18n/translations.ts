export type Locale = "en" | "pt";

export const translations = {
  en: {
    nav: { about: "About", toolkit: "Toolkit", work: "Work", contact: "Contact" },
    hero: {
      eyebrow: "3D Portfolio Experience",
      name: 'Marcos "H0wZy" Junior',
      role: "Technology Executive",
      description:
        "Building digital products, interactive experiences and technology solutions that turn ideas into real business value.",
      primaryCta: "Explore projects",
      secondaryCta: "Get in touch",
    },
    about: {
      eyebrow: "About",
      title: "From strategy to code,\nbuilding products that matter.",
      body: "I work at the intersection of business vision and technical execution, leading the creation of digital platforms, AI-driven automation and product experiences that drive real results.",
    },
    toolkit: {
      eyebrow: "Toolkit",
      title: "What I bring to the table",
      body: "A stack built for speed, motion and reliability — trained across web, backend and tooling.",
      groups: [
        { label: "Frontend & Language", items: ["React", "TypeScript", "Vite"] },
        {
          label: "3D & Motion",
          items: ["Three.js", "React Three Fiber", "Framer Motion"],
        },
        { label: "Platform & Tooling", items: ["Node.js", "Vercel", "Git"] },
      ],
    },
    projects: {
      eyebrow: "Selected Work",
      title: "Keep scrolling to explore",
      body: "Click any orb in the 3D scene to open the project details: problem, solution, role and impact.",
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's build something together?",
      body: "Open to new projects, partnerships and technical challenges.",
      cta: "Get in touch",
    },
    footer: { rights: "All rights reserved." },
    panel: { problem: "Problem", solution: "Solution", role: "Role", impact: "Impact" },
  },
  pt: {
    nav: { about: "Sobre", toolkit: "Toolkit", work: "Projetos", contact: "Contato" },
    hero: {
      eyebrow: "Portfólio 3D Interativo",
      name: 'Marcos "H0wZy" Junior',
      role: "Executivo de Tecnologia",
      description:
        "Criando produtos digitais, experiências interativas e soluções tecnológicas que transformam ideias em valor real para negócios.",
      primaryCta: "Explorar projetos",
      secondaryCta: "Fale comigo",
    },
    about: {
      eyebrow: "Sobre",
      title: "Da estratégia ao código,\nconstruindo produtos que importam.",
      body: "Atuo na fronteira entre visão de negócio e execução técnica, liderando a criação de plataformas digitais, automações com IA e experiências de produto que geram resultado real.",
    },
    toolkit: {
      eyebrow: "Toolkit",
      title: "O que eu trago pra mesa",
      body: "Uma stack pensada pra velocidade, movimento e confiabilidade — testada em web, backend e tooling.",
      groups: [
        { label: "Frontend & Linguagem", items: ["React", "TypeScript", "Vite"] },
        {
          label: "3D & Motion",
          items: ["Three.js", "React Three Fiber", "Framer Motion"],
        },
        { label: "Plataforma & Tooling", items: ["Node.js", "Vercel", "Git"] },
      ],
    },
    projects: {
      eyebrow: "Projetos em Destaque",
      title: "Continue rolando para explorar",
      body: "Clique em qualquer orbe na cena 3D para abrir os detalhes do projeto: problema, solução, papel e impacto.",
    },
    contact: {
      eyebrow: "Contato",
      title: "Vamos construir algo juntos?",
      body: "Aberto a novos projetos, parcerias e desafios técnicos.",
      cta: "Fale comigo",
    },
    footer: { rights: "Todos os direitos reservados." },
    panel: { problem: "Problema", solution: "Solução", role: "Papel", impact: "Impacto" },
  },
} as const;
