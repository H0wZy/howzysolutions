import type { Project } from '../types'

export const howzysolutions: Project = {
  id: 'howzysolutions',
  name: 'howzysolutions',
  kind: 'product',
  state: 'in-progress',
  period: { start: '2026-06-26', end: '2026-08-20' },
  commits: 12,
  wakatimeProject: 'howzysolutions',

  summary: {
    en: 'This site. A terminal-minimal portfolio with an interactive command line, rebuilt spec-driven from a 3D experience whose content was three records, two of them placeholders.',
    pt: 'Este site. Um portfólio terminal-minimal com linha de comando interativa, reconstruído spec-driven a partir de uma experiência 3D cujo conteúdo eram três registros, dois deles placeholders.',
  },

  problem: {
    en: 'My own portfolio. The first version was a scroll-driven 3D experience that looked finished and said nothing: the engineering worked, the content did not exist. Eight real projects were missing from a site whose entire job was to show them.',
    pt: 'Meu próprio portfólio. A primeira versão era uma experiência 3D dirigida por scroll que parecia pronta e não dizia nada: a engenharia funcionava, o conteúdo não existia. Oito projetos reais estavam de fora de um site cujo trabalho inteiro era mostrá-los.',
  },

  capabilities: {
    en: [
      'An interactive terminal answering real commands about the author and every project, driven by a pure command engine with no framework import.',
      'The command engine is renderer-agnostic by construction: a second renderer (an opt-in WebGL/immersive presentation) was built, worked exactly as specified, and was later removed without touching the engine at all. That is proof the separation holds, not just a claim about it.',
      'All content as typed records, so adding a project is a data-only edit and the list, the project page and the terminal cannot contradict each other.',
      'English and Brazilian Portuguese at parity, where a missing translation is a compile error rather than a runtime fallback.',
      'Dark and light themes from a single token set, applied before first paint, with contrast verified by a script rather than asserted.',
      'Coding activity measured at build time from WakaTime, every figure carrying its own period.',
    ],
    pt: [
      'Um terminal interativo respondendo comandos reais sobre o autor e cada projeto, movido por um engine de comandos puro, sem import de framework.',
      'O engine de comandos é agnóstico de renderer por construção: um segundo renderer (uma apresentação WebGL/imersiva opt-in) foi construído, funcionou exatamente como especificado, e depois foi removido sem tocar no engine. Isso é prova de que a separação se sustenta, não só uma alegação sobre ela.',
      'Todo o conteúdo como registros tipados, então adicionar um projeto é edição só de dado e a lista, a página do projeto e o terminal não conseguem se contradizer.',
      'Inglês e português brasileiro em paridade, onde tradução faltando é erro de compilação e não fallback em runtime.',
      'Temas escuro e claro de um único conjunto de tokens, aplicados antes do primeiro paint, com contraste verificado por script em vez de afirmado.',
      'Atividade de código medida em tempo de build a partir do WakaTime, cada número carregando seu próprio período.',
    ],
  },

  stack: [
    { group: 'frontend', items: ['react', 'typescript', 'vite'] },
    { group: 'other', items: ['vercel', 'spec-kit', 'vitest'] },
  ],

  development: {
    en: [
      'The rebrand is spec-driven: a ratified project constitution, a specification with thirty-eight functional requirements and fifteen success criteria, a plan whose decisions each record the alternatives rejected, and a task list of a hundred and six items ordered by dependency.',
      'The organising constraint was measured, not assumed. The previous build shipped 519.3 KB of gzipped JavaScript against a 120 KB budget, 4.3× over. Each dependency group was then bundled in isolation to find where the weight was: React and react-dom at 58.7 KB, the WebGL group at 358.1 KB, and an animation library at 44.5 KB used for three fades.',
      'Every technical decision follows from that measurement. The animation library was removed and replaced with CSS and an intersection observer. The WebGL group went behind an opt-in dynamic import. Routing was solved by prerendering one HTML document per project rather than shipping a router at all.',
      'The 3D work from the first version was carried forward once, into an opt-in immersive renderer, then reviewed next to the plain DOM terminal it wrapped, and cut. Both calls are recorded as dated decisions rather than smoothed into a single "always was this way" narrative.',
    ],
    pt: [
      'O rebranding é spec-driven: uma constituição de projeto ratificada, uma spec com trinta e oito requisitos funcionais e quinze critérios de sucesso, um plano cujas decisões registram cada uma as alternativas rejeitadas, e uma lista de cento e seis tarefas ordenada por dependência.',
      'A restrição organizadora foi medida, não presumida. O build anterior entregava 519,3 KB de JavaScript gzipped contra um budget de 120 KB, 4,3× acima. Cada grupo de dependência foi então empacotado isoladamente para achar onde estava o peso: React e react-dom em 58,7 KB, o grupo WebGL em 358,1 KB, e uma biblioteca de animação em 44,5 KB usada para três fades.',
      'Toda decisão técnica decorre dessa medição. A biblioteca de animação saiu e foi substituída por CSS e um intersection observer. O grupo WebGL foi para trás de um import dinâmico opt-in. O roteamento foi resolvido prerenderizando um HTML por projeto, em vez de embarcar um router.',
      'O trabalho 3D da primeira versão foi levado adiante uma vez, para um renderer imersivo opt-in, depois revisado ao lado do terminal DOM simples que ele envolvia, e cortado. As duas decisões ficam registradas com data, em vez de suavizadas numa narrativa de "sempre foi assim".',
    ],
  },

  limitations: {
    en: [
      'In progress. This entry describes a rebrand under construction, and it is the least finished project on this site, which is exactly why it says so rather than waiting to be described in the past tense.',
      'No screenshots exist for any project yet. Every layout is built to read correctly with no image, so they can be added later without a layout change, but the site currently shows no screens.',
      'The domain howzysolutions.dev is intended and not yet acquired.',
      'An opt-in 3D/WebGL renderer was built and then removed after review. This site does not currently demonstrate that capability as running code, only as this account of building and then cutting it.',
    ],
    pt: [
      'Em construção. Esta entrada descreve um rebranding em andamento, e é o projeto menos acabado deste site, que é exatamente por que ela diz isso em vez de esperar para ser descrita no passado.',
      'Ainda não existem screenshots de nenhum projeto. Todo layout é construído para ler corretamente sem imagem, então podem ser adicionados depois sem mudança de layout, mas o site hoje não mostra telas.',
      'O domínio howzysolutions.dev é pretendido e ainda não foi comprado.',
      'Um renderer 3D/WebGL opt-in foi construído e depois removido após revisão. Este site não demonstra essa capacidade como código rodando no momento, só como este relato de construir e depois cortar.',
    ],
  },

  metrics: [
    {
      label: { en: 'Bundle before the rebrand', pt: 'Bundle antes do rebranding' },
      value: '519.3 KB',
      source: { en: 'gzipped entry chunk, measured with npm run build', pt: 'entry chunk gzipped, medido com npm run build' },
    },
    {
      label: { en: 'Budget', pt: 'Budget' },
      value: '120 KB',
      source: { en: 'project constitution, performance budgets', pt: 'constituição do projeto, budgets de performance' },
    },
    {
      label: { en: 'Functional requirements', pt: 'Requisitos funcionais' },
      value: '33',
      source: { en: 'specs/001-terminal-portfolio-rebrand/spec.md', pt: 'specs/001-terminal-portfolio-rebrand/spec.md' },
    },
  ],

  links: [{ kind: 'repo', href: 'https://github.com/H0wZy/howzysolutions', label: 'H0wZy/howzysolutions' }],
}
