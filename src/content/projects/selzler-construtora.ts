import type { Project } from '../types'

export const selzlerConstrutora: Project = {
  id: 'selzler-construtora',
  name: 'Selzler Construtora',
  kind: 'client',
  state: 'functional',
  context: {
    en: 'Selzler Arquitetura e Engenharia: public, industrial and residential construction, Toledo/PR. 40 years.',
    pt: 'Selzler Arquitetura e Engenharia: obras públicas, industriais e residenciais, Toledo/PR. 40 anos.',
  },
  period: { start: '2026-07-14', end: '2026-07-24' },
  commits: 119,
  wakatimeProject: 'selzler-construtora',

  summary: {
    en: 'Public site and admin panel letting the partners publish their own work, built in ten days on a modular monolith with structure and auth inherited from Telas Paraná.',
    pt: 'Site público e painel admin permitindo aos sócios publicar o próprio trabalho, construído em dez dias sobre um monolito modular com estrutura e auth herdados do Telas Paraná.',
  },

  problem: {
    en: 'The existing site is static WordPress. Every completed project, every new client in the portfolio, required calling a developer. The partners had no way to publish their own work.',
    pt: 'O site atual é WordPress estático. Cada obra concluída, cada cliente novo no portfólio, exigia acionar um desenvolvedor. Os sócios não tinham como publicar o próprio trabalho.',
  },

  capabilities: {
    en: [
      'Public frontend reproducing the existing information architecture: home, about, completed works split by public/industrial/residential, works in progress, clients, contact and privacy policy.',
      'Admin panel behind a partner login with no public signup. Users are created by seed. Full CRUD over works and clients, with image upload.',
      'Client logo carousel as a continuous JetBrains-style marquee, with real logos.',
      'Cookie consent card gating analytics, for LGPD.',
      'Google Places integration for reviews, synchronised in the background by a hosted service.',
      'Container warm-up on the contact page, a serverless cold-start detail resolved before the visitor can feel it.',
    ],
    pt: [
      'Frontend público replicando a arquitetura de informação existente: home, sobre, obras concluídas separadas em pública/industrial/residencial, obras em andamento, clientes, contato e política de privacidade.',
      'Painel admin atrás de login dos sócios, sem cadastro público. Usuários são criados por seed. CRUD completo de obras e clientes, com upload de imagem.',
      'Carousel de logos de clientes em marquee contínuo estilo JetBrains, com logos reais.',
      'Card de consentimento de cookies com gate de analytics, para LGPD.',
      'Integração com Google Places para avaliações, sincronizada em background por hosted service.',
      'Warm-up do container na página de contato, detalhe de cold start serverless resolvido antes de o visitante sentir.',
    ],
  },

  stack: [
    { group: 'frontend', items: ['nextjs', 'react', 'typescript', 'tailwind', 'shadcn', 'vitest'] },
    { group: 'backend', items: ['csharp', 'aspnetcore', 'efcore', 'postgres', 'docker'] },
    { group: 'infra', items: ['terraform', 'cloudflare-r2'] },
  ],

  development: {
    en: [
      'This is the repository where the methodology is most explicit. The stack was locked by a dated decision ("locked on 14/07/2026, do not change without explicit discussion") and the structure, authentication and testing patterns were deliberately inherited from Telas Paraná. Reuse between the same author’s projects, not reinvention. The modular monolith is likewise justified rather than copied: no process split until there is a concrete reason.',
      'The agent configuration carries a team of specialised sub-operators (architect, backend, frontend, DBA, devops, cybersecurity, DPO, QA, content and vault), each with persistent per-agent memory holding concrete lessons from the project. Those memories are behavioural corrections that outlived the session that produced them.',
      'Work is organised as numbered PRDs (client carousel, JWT auth, frontend login, an OpenAPI vulnerability, admin hardening) plus a formal audit with four separate sweeps across backend, database, frontend and security, whose twelve findings were closed in a commit of their own.',
      'Unusual for a project this size: a legal folder analysing software law, civil code, LGPD and the Brazilian internet framework, a map of data sub-processors, a signed DPA versioned as a PDF, and a claims audit of the site’s public statements so that no published number is invented.',
    ],
    pt: [
      'Este é o repositório onde a metodologia fica mais explícita. A stack foi travada por decisão datada ("travada em 14/07/2026, não trocar sem discussão explícita") e a estrutura, auth e padrões de teste foram deliberadamente herdados do Telas Paraná. Reuso entre projetos do mesmo autor, não reinvenção. A escolha do monolito modular também é justificada e não copiada: sem split de processo até haver razão concreta.',
      'A configuração de agentes carrega uma equipe de suboperadores especializados (architect, backend, frontend, DBA, devops, cybersec, DPO, QA, conteúdo e vault), cada um com memória persistente própria guardando lições concretas do projeto. Essas memórias são correções de comportamento que sobreviveram à sessão que as gerou.',
      'O trabalho é organizado em PRDs numeradas (carousel de clientes, auth JWT, login no frontend, uma vulnerabilidade de OpenAPI, hardening do admin) mais uma auditoria formal com quatro varreduras separadas em backend, banco, frontend e segurança, cujos doze achados foram fechados em commit próprio.',
      'Incomum num projeto deste porte: uma pasta jurídica analisando Lei do Software, Código Civil, LGPD e Marco Civil, um mapa de subprocessadores de dados, um DPA assinado versionado em PDF, e uma auditoria das afirmações públicas do site para nenhum número publicado ser inventado.',
    ],
  },

  limitations: {
    en: [
      'Not deployed. Everything through v0.4 is complete and working locally, but v1.0, production deployment on its own domain, is still open, so this is presented as functional rather than in production.',
      'The frontend test suite covers structural invariants, not appearance. Layout and accessibility still require direct measurement in a real browser.',
      'A designed next sprint exists on paper only: a local vector RAG over the documentation, exposed to the agents through an MCP server.',
    ],
    pt: [
      'Sem deploy. Tudo até a v0.4 está completo e funcionando localmente, mas a v1.0, deploy em produção com domínio próprio, continua aberta, então é apresentado como funcional e não como em produção.',
      'A suíte de testes do frontend cobre invariantes estruturais, não aparência. Layout e acessibilidade ainda exigem medição direta em navegador real.',
      'Há uma próxima sprint desenhada que existe só no papel: RAG vetorial local sobre a documentação, exposto aos agentes por servidor MCP.',
    ],
  },

  roadmap: {
    en: ['v0.1 health check ✓', 'v0.2 CRUD ✓', 'v0.3 public frontend ✓', 'v0.4 admin auth ✓', 'v1.0 production deployment on its own domain: pending'],
    pt: ['v0.1 health check ✓', 'v0.2 CRUD ✓', 'v0.3 frontend público ✓', 'v0.4 auth admin ✓', 'v1.0 deploy em produção com domínio próprio: pendente'],
  },

  metrics: [
    {
      label: { en: 'Commits in ten days', pt: 'Commits em dez dias' },
      value: '119',
      source: { en: 'git history, 2026-07-14 to 2026-07-24', pt: 'histórico git, 14/07/2026 a 24/07/2026' },
    },
    {
      label: { en: 'Audit findings closed', pt: 'Achados de auditoria fechados' },
      value: '12',
      source: { en: 'docs/audit/2026-07, four separate sweeps', pt: 'docs/audit/2026-07, quatro varreduras separadas' },
    },
  ],
}
