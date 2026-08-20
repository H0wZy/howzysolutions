import type { Project } from '../types'

export const generativeAiE2: Project = {
  id: 'generative-ai-e2',
  name: 'generative-ai-e2',
  kind: 'training',
  state: 'delivered',
  context: {
    en: 'TCS Gen AI E2 bootcamp.',
    pt: 'Bootcamp Gen AI E2 da TCS.',
  },
  period: { start: '2026-07-24', end: '2026-08-02' },
  commits: 71,
  wakatimeProject: 'generative-ai-e2',

  summary: {
    en: 'Freshservice-to-Jira automation plus a local RAG lab, built spec-driven — and notable mainly for the classifier that was measured and then switched off.',
    pt: 'Automação Freshservice→Jira e laboratório de RAG local, construídos spec-driven — e notável sobretudo pelo classificador que foi medido e depois desligado.',
  },

  problem: {
    en: 'In an ITSM operation the ticket is born in Freshservice and the work happens in Jira. Moving one to the other is manual, and the link between the two systems exists only as free text somebody typed into a card title.',
    pt: 'Numa operação de ITSM o chamado nasce no Freshservice e o trabalho acontece no Jira. O tombamento de um para o outro é manual, e o vínculo entre os dois sistemas só existe como texto livre que alguém digitou no título do card.',
  },

  capabilities: {
    en: [
      'Freshservice to Jira: ticket ingestion, routing to the correct squad, idempotent issue creation, traceability and audit.',
      'An agile workspace — sprint, backlog, drag-and-drop board — projected from Jira at request time rather than cached.',
      'A local RAG lab over the repository’s own documentation, indexed in SQLite with sqlite-vec and exposed over MCP.',
      'A conversational assistant with document upload and tree-structured retrieval.',
    ],
    pt: [
      'Freshservice para Jira: ingestão de tickets, roteamento para a squad correta, criação idempotente de issue, rastreabilidade e auditoria.',
      'Um workspace ágil — sprint, backlog, quadro com drag-and-drop — projetado do Jira em tempo de requisição, sem cache.',
      'Um laboratório de RAG local sobre a documentação do próprio repositório, indexado em SQLite com sqlite-vec e exposto por MCP.',
      'Um assistente conversacional com upload de documento e busca em árvore.',
    ],
  },

  stack: [
    { group: 'frontend', items: ['nextjs', 'react', 'tailwind', 'shadcn'] },
    { group: 'backend', items: ['python', 'fastapi', 'sqlalchemy', 'alembic', 'postgres'] },
    { group: 'other', items: ['sqlite-vec', 'sentence-transformers', 'openrouter', 'mcp', 'spec-kit'] },
  ],

  development: {
    en: [
      'Spec-driven through GitHub Spec Kit: thirteen numbered specifications, each with its specification, plan, research, data model, task list, quickstart, contracts and requirements checklist. A project constitution that prevails over everything else. Architectural decisions recorded as numbered ADRs, 005 through 013.',
      'The problem was measured against real exports rather than estimated. Of 428 cards exported, 368 carried an extractable ticket number in the title and 312 matched a real ticket — 72.9% link coverage. The official Freshservice ticket field was filled in on exactly one card out of 428. Against the automation, where the identifier lives in a structured issue label rather than depending on anyone typing it, coverage is 100% by construction.',
      'The README spends more space on deliberate limitations than on features, and each one carries its reason and its exit condition. That is the point of the project, not a caveat to it.',
    ],
    pt: [
      'Spec-driven via GitHub Spec Kit: treze specs numeradas, cada uma com spec, plano, pesquisa, modelo de dados, lista de tarefas, quickstart, contratos e checklist de requisitos. Uma constituição de projeto que prevalece sobre o resto. Decisões arquiteturais registradas como ADRs numerados, 005 a 013.',
      'O problema foi medido contra exports reais, não estimado. De 428 cards exportados, 368 traziam número de chamado extraível do título e 312 batiam com um chamado real — 72,9% de cobertura de vínculo. O campo oficial de chamado do Freshservice estava preenchido em exatamente um card entre 428. Contra a automação, onde o identificador vai num rótulo estruturado da issue em vez de depender de alguém digitá-lo, a cobertura é 100% por construção.',
      'O README dedica mais espaço às limitações deliberadas do que às funcionalidades, e cada uma traz a razão e a condição de saída. Esse é o ponto do projeto, não uma ressalva a ele.',
    ],
  },

  limitations: {
    en: [
      'The LLM classifier is implemented, tested and switched off by default. Against a 19-case golden set measured on 2026-07-30: 83.33% accuracy, 37.50% abstention, and one of three prompt-injection vectors succeeded. A ticket’s subject and description are untrusted input written by whoever opens it, so enabling the classifier would hand the choice of destination squad to that person. A closed enum protects against malformed output, not against output that is valid but manipulated.',
      'The accuracy drop against the previous provider, 100% to 83.33%, is declared as expected rather than reported as a regression — different models, each measured honestly against its own provider. The golden set decides, it does not confirm.',
      'SLA status does not exist at source. The queue has an SLA column because the requirement asks for one, but no deadline arrives from Freshservice, so the column renders an em dash labelled "no deadline known at source". Deriving a deadline from the retry timestamp would be inventing a number nobody could audit in a presentation.',
      'The agile workspace does not work offline, by decision: a cached sprint would lie during a live demonstration. Without credentials the screens render a named state — not configured, unauthorised, unavailable, rate limited — rather than an error.',
      'Freshservice runs against a mock rather than the real tenant, because the client’s administrator never released the API key. The squad enum was made generic, and the test suite runs green with no credentials and no network.',
      'One dependency was added against the project’s own rule about not adding a dependency where an installed one would do. It is recorded as a conscious decision rather than quietly left in.',
    ],
    pt: [
      'O classificador por LLM está implementado, testado e desligado por padrão. Contra um golden set de 19 casos medido em 30/07/2026: 83,33% de acurácia, 37,50% de abstenção, e um de três vetores de prompt injection passou. Assunto e descrição do chamado são entrada não confiável, escrita por quem abre o chamado, então ativar o classificador transferiria a escolha da squad de destino para essa pessoa. Enum fechado protege contra saída malformada, não contra saída válida-porém-manipulada.',
      'A queda de acurácia frente ao provedor anterior, 100% para 83,33%, é declarada como esperada e não reportada como regressão — modelos diferentes, cada um medido honestamente contra o próprio provedor. O golden set decide, não confirma.',
      'Situação de SLA não existe na origem. A fila tem coluna de SLA porque o requisito pede, mas nenhum prazo chega do Freshservice, então a coluna mostra um travessão com o rótulo "sem prazo conhecido na origem". Derivar um prazo do timestamp de retentativa seria inventar número que ninguém consegue auditar numa apresentação.',
      'O workspace ágil não funciona offline, por decisão: cache de sprint mentiria numa demonstração ao vivo. Sem credencial, as telas renderizam estado nomeado — não configurado, não autorizado, indisponível, com rate limit — em vez de erro.',
      'O Freshservice roda contra mock e não contra o tenant real, porque o administrador do cliente nunca liberou a API key. O enum de squad virou genérico, e a suíte de testes roda verde sem credencial e sem rede.',
      'Uma dependência foi adicionada contra a própria regra do projeto de não adicionar dependência onde a instalada resolve. Está registrada como decisão consciente, não deixada quieta.',
    ],
  },

  metrics: [
    {
      label: { en: 'Link coverage, manual process', pt: 'Cobertura de vínculo, processo manual' },
      value: '72.9%',
      source: { en: '312 of 428 exported cards matched a real ticket', pt: '312 de 428 cards exportados bateram com um chamado real' },
    },
    {
      label: { en: 'Official ticket field filled in', pt: 'Campo oficial de chamado preenchido' },
      value: '1 / 428',
      source: { en: 'Freshservice ticket field across the historical export', pt: 'campo de chamado do Freshservice no export histórico' },
    },
    {
      label: { en: 'Classifier accuracy', pt: 'Acurácia do classificador' },
      value: '83.33%',
      source: { en: '19-case golden set, measured 2026-07-30', pt: 'golden set de 19 casos, medido em 30/07/2026' },
    },
    {
      label: { en: 'Prompt-injection vectors that succeeded', pt: 'Vetores de prompt injection que passaram' },
      value: '1 / 3',
      source: { en: 'the reason the classifier ships disabled', pt: 'a razão de o classificador ser entregue desligado' },
    },
  ],
}
