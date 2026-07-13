export type LocalizedText = {
  en: string;
  pt: string;
};

export type Project = {
  id: string;
  name: string;
  year: string;
  problem: LocalizedText;
  solution: LocalizedText;
  role: LocalizedText;
  technologies: string[];
  impact: LocalizedText;
  color: string;
  position: [number, number, number];
};

export const projects: Project[] = [
  {
    id: "howzysolutions",
    name: "howzysolutions",
    year: "2026",
    problem: {
      en: "Build a professional, highly compelling portfolio to showcase projects, technical skills and strategic vision.",
      pt: "Criar um portfólio profissional e extremamente atrativo para expor projetos, capacidades técnicas e visão estratégica.",
    },
    solution: {
      en: "Built a 3D web experience from scratch with React, TypeScript, Vite, React Three Fiber and Three.js, deployed on Vercel.",
      pt: "Desenvolver uma experiência web 3D do zero usando React, TypeScript, Vite, React Three Fiber e Three.js, com publicação na Vercel.",
    },
    role: {
      en: "Guided project build, hands-on stack learning, visual decision-making and ongoing evolution of the portfolio.",
      pt: "Construção guiada do projeto, aprendizado prático da stack, tomada de decisões visuais e evolução contínua do portfólio.",
    },
    technologies: ["React", "TypeScript", "Vite", "R3F", "Three.js", "Vercel"],
    impact: {
      en: "Raised perceived value, highlighted technical differentiation and helped win new clients.",
      pt: "Aumentar percepção de valor, destacar diferenciação técnica e ajudar na conquista de novos clientes.",
    },
    color: "#7c3aed",
    position: [2.0, 0.6, -2.0],
  },
  {
    id: "future-ai",
    name: "AI Business Platform",
    year: "2026",
    problem: {
      en: "Companies need to turn manual processes into intelligent, AI-driven workflows.",
      pt: "Empresas precisam transformar processos manuais em fluxos inteligentes com IA.",
    },
    solution: {
      en: "Built generative-AI solutions, automation and integrations to accelerate productivity.",
      pt: "Criar soluções com IA generativa, automação e integrações para acelerar produtividade.",
    },
    role: {
      en: "Strategy, solution design, use-case prioritization and technology direction.",
      pt: "Estratégia, desenho da solução, priorização de casos de uso e direcionamento tecnológico.",
    },
    technologies: ["Azure OpenAI", "Microsoft 365", "Power Platform", "APIs"],
    impact: {
      en: "Reduced operational effort, increased productivity and unlocked new digital opportunities.",
      pt: "Redução de esforço operacional, aumento de produtividade e criação de novas oportunidades digitais.",
    },
    color: "#06b6d4",
    position: [-2.0, 0.4, -3.4],
  },
  {
    id: "digital-transformation",
    name: "Digital Transformation Hub",
    year: "2026",
    problem: {
      en: "Organizations need to modernize their digital presence and internal processes.",
      pt: "Organizações precisam modernizar sua presença digital e seus processos internos.",
    },
    solution: {
      en: "Built digital experiences, automation, dashboards and value-driven platforms.",
      pt: "Construção de experiências digitais, automação, dashboards e plataformas orientadas a valor.",
    },
    role: {
      en: "Led technology vision, initial architecture and the bridge between business and execution.",
      pt: "Condução da visão tecnológica, arquitetura inicial e conexão entre negócio e execução técnica.",
    },
    technologies: ["Cloud", "Data", "Automation", "UX", "Analytics"],
    impact: {
      en: "Greater digital maturity, better decision-making and a stronger competitive position.",
      pt: "Maior maturidade digital, melhor tomada de decisão e posicionamento mais competitivo.",
    },
    color: "#6366f1",
    position: [0.4, -0.3, -5.0],
  },
];
