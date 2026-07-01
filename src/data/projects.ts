export type Project = {
  id: string;
  name: string;
  year: string;
  problem: string;
  solution: string;
  role: string;
  technologies: string[];
  impact: string;
  color: string;
  position: [number, number, number];
};

export const projects: Project[] = [
  {
    id: "howzysolutions",
    name: "howzysolutions",
    year: "2026",
    problem:
      "Criar um portfólio profissional e extremamente atrativo para expor projetos, capacidades técnicas e visão estratégica.",
    solution:
      "Desenvolver uma experiência web 3D do zero usando React, TypeScript, Vite, React Three Fiber e Three.js, com publicação na Vercel.",
    role:
      "Construção guiada do projeto, aprendizado prático da stack, tomada de decisões visuais e evolução contínua do portfólio.",
    technologies: ["React", "TypeScript", "Vite", "R3F", "Three.js", "Vercel"],
    impact:
      "Aumentar percepção de valor, destacar diferenciação técnica e ajudar na conquista de novos clientes.",
    color: "#7c3aed",
    position: [2.4, 0.7, 1.2],
  },
  {
    id: "future-ai",
    name: "AI Business Platform",
    year: "2026",
    problem:
      "Empresas precisam transformar processos manuais em fluxos inteligentes com IA.",
    solution:
      "Criar soluções com IA generativa, automação e integrações para acelerar produtividade.",
    role:
      "Estratégia, desenho da solução, priorização de casos de uso e direcionamento tecnológico.",
    technologies: ["Azure OpenAI", "Microsoft 365", "Power Platform", "APIs"],
    impact:
      "Redução de esforço operacional, aumento de produtividade e criação de novas oportunidades digitais.",
    color: "#06b6d4",
    position: [-2.2, 0.5, -1.4],
  },
  {
    id: "digital-transformation",
    name: "Digital Transformation Hub",
    year: "2026",
    problem:
      "Organizações precisam modernizar sua presença digital e seus processos internos.",
    solution:
      "Construção de experiências digitais, automação, dashboards e plataformas orientadas a valor.",
    role:
      "Condução da visão tecnológica, arquitetura inicial e conexão entre negócio e execução técnica.",
    technologies: ["Cloud", "Data", "Automation", "UX", "Analytics"],
    impact:
      "Maior maturidade digital, melhor tomada de decisão e posicionamento mais competitivo.",
    color: "#6366f1",
    position: [0.6, -0.3, -4],
  },
];