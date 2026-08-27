/**
 * Brazilian Portuguese. Declared `satisfies Record<StringKey, string>`, so a missing
 * or misspelled key fails `tsc -b` rather than degrading at runtime (FR-017).
 */

import type { StringKey } from './en'

export const pt = {
  // Chrome
  'chrome.file': 'LEIAME.md',
  'chrome.theme': 'tema',
  'chrome.theme.switchTo': 'mudar para o tema {theme}',
  'chrome.theme.dark': 'escuro',
  'chrome.theme.light': 'claro',
  'chrome.lang': 'idioma',
  // Pool rotativo. Ver theme/jokes.ts pickJoke() — nunca Math.random(), pra não
  // quebrar o gate de pureza do engine do terminal (research D12).
  'theme.joke.0': 'Fechado como wontfix.',
  'theme.joke.1': "Arquivado em 'algum dia'. Algum dia ainda não foi publicado.",
  'theme.joke.2': 'Atrás de uma feature flag. A flag é estrutural.',
  'theme.joke.3': 'Revisei eu mesmo e rejeitei eu mesmo. Pelo menos foi rápido.',
  'theme.joke.4': 'Tá no roadmap, logo depois do roadmap.',
  'chrome.skipToContent': 'Pular para o conteúdo',

  // Seções
  'section.terminal': 'o_terminal',
  'section.work': 'trabalhos_selecionados',
  'section.about': 'a_ideia_toda',
  'section.stats': 'atividade_medida',
  'section.contact': 'fale_comigo',

  // Hero
  'hero.role': 'Desenvolvedor full-stack',
  'hero.experience': '{years}a {months}m em TI',
  'hero.experienceSince': 'desde a graduação na Unicesumar em 2023; empregado desde maio de 2025',
  'hero.location': 'Londrina, Paraná, Brasil',

  // Listagem de projetos
  'work.heading': 'Nove projetos, e o que cada um não faz.',
  'work.intro':
    'Cada entrada declara o problema, a stack, o estado real e as limitações que a própria documentação do projeto registra.',
  'work.commits': 'commits',
  'work.period': 'de {start} a {end}',
  'work.viewProject': 'abrir projeto',
  'work.backToAll': 'voltar para todos os trabalhos',
  'work.page': 'Páginas de trabalhos',
  'work.pagePrev': 'página anterior',
  'work.pageNext': 'próxima página',
  'work.allWork': 'todos os trabalhos',
  'work.listingTitle': 'Todos os trabalhos',

  // Detalhe do projeto
  'project.problem': 'o_problema',
  'project.capabilities': 'o_que_faz',
  'project.stack': 'stack',
  'project.development': 'como_foi_construido',
  'project.limitations': 'limitacoes_conhecidas',
  'project.roadmap': 'roadmap',
  'project.metrics': 'medido',
  'project.links': 'links',
  'project.trackedTime': 'tempo de código rastreado',
  'project.period': 'período',

  // Vocabulário de estado
  'state.production': 'em produção',
  'state.delivered': 'entregue',
  'state.functional': 'funcional, sem deploy',
  'state.inProgress': 'em construção',
  'state.skeleton': 'esqueleto de estudo',

  // Vocabulário de natureza
  'kind.client': 'trabalho para cliente',
  'kind.product': 'produto próprio',
  'kind.study': 'estudo',
  'kind.tooling': 'ferramental',
  'kind.training': 'programa de formação',

  // Grupos de stack
  'stack.frontend': 'frontend',
  'stack.backend': 'backend',
  'stack.infra': 'infra',
  'stack.other': 'outros',

  // Estatísticas
  'stats.heading': 'Medido, não afirmado.',
  'stats.total': 'total rastreado',
  'stats.dailyAverage': 'média diária',
  'stats.languages': 'linguagens',
  'stats.editors': 'editores',
  'stats.categories': 'atividade',
  'stats.projects': 'por projeto',
  'stats.sourceLabel': 'Fonte:',
  'stats.range': 'rastreado desde {start} até agora',
  'stats.rangeStale': 'rastreado desde {start} até {date}',
  'stats.stale': 'Números da última captura bem-sucedida, em {date}.',
  'stats.showAll': 'ver tudo',
  'stats.experienceNote':
    'O tempo em TI é contado desde a graduação na Unicesumar, em 2023. O emprego começou em maio de 2025 na TCS. O tempo de código rastreado cobre apenas o intervalo que o rastreador reporta, que começa em março de 2026. Três medidas, três períodos, e nenhuma delas é evidência da outra.',

  // Calendário de contribuições (fonte, unidade e período diferentes das estatísticas acima)
  'contrib.heading': 'commits públicos, dia a dia',
  'contrib.source': 'Fonte: GitHub',
  'contrib.window': 'de {start} a {end}',
  'contrib.cell': '{count} contribuições em {date}',
  'contrib.stale': 'Grade da última captura bem-sucedida, em {date}.',
  'contrib.scopePublic': 'contribuições públicas',
  'contrib.scopeAll': 'contribuições públicas e privadas',

  // Terminal
  'terminal.promptIn': 'em',
  'terminal.label': 'Terminal interativo',
  'terminal.inputLabel': 'Entrada de comando do terminal',
  'terminal.outputLabel': 'Saída do terminal',
  'terminal.notFound': 'comando não encontrado: {input}',
  'terminal.tryHelp': "digite 'help' para ver o que existe",
  'terminal.didYouMean': "você quis dizer '{candidate}'?",
  'terminal.noSuchProject': 'projeto inexistente: {id}',
  'terminal.noSuchTech': 'nenhuma tecnologia corresponde a: {id}',
  'terminal.badValue': 'valores aceitos: {values}',
  'terminal.tooLong': 'entrada longa demais. máximo de 512 caracteres',
  'terminal.usage': 'uso: {usage}',
  'terminal.candidates': 'candidatos: {candidates}',
  'terminal.localeSet': 'idioma alterado para {locale}',
  'terminal.currentLocale': 'idioma: {locale}',
  'terminal.themeAlwaysDark': 'escuro. o único tema que existe',
  'terminal.emptyHistory': 'nenhum comando ainda',

  // Resumos dos comandos
  'cmd.help': 'lista os comandos disponíveis',
  'cmd.version': 'tempo de experiência e informação de build',
  'cmd.whoami': 'quem está por trás disto',
  'cmd.about': 'biografia mais longa',
  'cmd.projects': 'lista ou inspeciona projetos',
  'cmd.stack': 'tecnologias, agrupadas, com contagem de projetos',
  'cmd.stats': 'atividade de código medida',
  'cmd.contact': 'como falar comigo',
  'cmd.lang': 'mostra ou altera o idioma',
  'cmd.theme': 'o tema (só existe um)',
  'cmd.open': 'abre a página de um projeto',
  'cmd.ls': 'lista a superfície de conteúdo',
  'cmd.clear': 'limpa a tela',
  'cmd.history': 'mostra os comandos desta sessão',
  'cmd.cv': 'imprime a trajetória profissional e o download do currículo',
  'cv.heading': 'Trajetória profissional',
  'cv.downloadHint': 'o PDF neste idioma',
  'cv.counts.awards': 'prêmios',
  'cv.counts.education': 'formação',
  'cv.counts.certifications': 'certificações',

  // Contato
  // CV
  //
  // Nomes próprios ficam FORA deste dicionário, seguindo o precedente de
  // WAKATIME.name em stats.ts: empregador, cliente, instituição e nomes de
  // tecnologia são idênticos nos dois idiomas, e uma string idêntica nos dois
  // não pertence a nenhum (FR-054).
  'cv.title': 'Trajetória profissional',
  'cv.intro':
    'Onde trabalho, desde quando, e para quê fui contratado. Os mesmos fatos do PDF, em texto que dá para ler no celular.',
  'cv.metaDescription':
    'Trajetória profissional de Marcos "H0wZy" Junior: cargos, prêmios, habilidades, formação e certificações, com o currículo disponível em inglês e português.',
  'cv.present': 'presente',
  'cv.captured': 'Fatos do currículo capturados de {source} em {date}.',
  'cv.capturedFallback':
    'Os fatos do currículo são da última captura bem-sucedida. A fonte estava inacessível no build.',
  'cv.siteHeld': 'ano de início registrado por este site, não pelo currículo',
  'cv.ongoing': 'em andamento',
  'cv.seeProject': 'ler o registro completo do projeto',

  // Downloads do CV
  'cv.download.heading': 'Baixar o currículo',
  'cv.download.primary': 'Baixar o currículo em {language}',
  'cv.download.other': 'Também disponível em {language}',
  'cv.language.en': 'inglês',
  'cv.language.pt': 'português do Brasil',
  'cv.unavailable': 'Apenas o arquivo em {language} está disponível neste build.',
  'cv.unavailableAll': 'Nenhum arquivo de currículo está disponível neste build.',

  // Navegação
  'nav.breadcrumb': 'Trilha de navegação',
  'nav.onThisPage': 'Nesta página',
  'nav.home': 'Início',
  'nav.cv': 'cv',

  // Contact
  'contact.heading': 'Aberto a trabalho e a problemas interessantes.',
  'contact.email': 'e-mail',
  'contact.github': 'github',
  'contact.linktree': 'linktree',

  // Rodapé
  'footer.builtWith':
    'Feito com React, TypeScript e Vite. Sem rastreadores, sem fontes de terceiros.',
  'footer.source': 'código no github',
} satisfies Record<StringKey, string>
