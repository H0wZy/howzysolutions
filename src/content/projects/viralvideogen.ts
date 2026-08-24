import type { Project } from '../types'

export const viralvideogen: Project = {
  id: 'viralvideogen',
  name: 'viralvideogen (storylab)',
  kind: 'product',
  state: 'functional',
  period: { start: '2026-08-16', end: '2026-08-18' },
  commits: 38,
  wakatimeProject: 'viralvideogen',

  summary: {
    en: 'A CLI pipeline turning a reference video into a production-ready storytelling package, whose defining rule is that it never believes a result it has not measured.',
    pt: 'Pipeline CLI que transforma um vídeo de referência num pacote de storytelling pronto para produção, cuja regra definidora é nunca acreditar num resultado que não mediu.',
  },

  problem: {
    en: 'Producing emotional storytelling video for TikTok with character consistency and retention is repetitive, manual and expensive: every prompt mistake is a paid call wasted, and a character whose face changes between scenes destroys the whole video.',
    pt: 'Produzir vídeo de storytelling emocional para TikTok com consistência de personagem e retenção é trabalho manual repetitivo e caro: cada erro de prompt é uma chamada paga desperdiçada, e personagem que muda de rosto entre cenas destrói o vídeo inteiro.',
  },

  capabilities: {
    en: [
      'Video intelligence: scene detection, keyframe extraction, audio transcription and visual analysis, selecting representative frames instead of sending every frame to a model.',
      'Story intelligence: narrative structure, character archetypes, an original story rather than a renamed character with translated dialogue, and a retention strategy built on open loops and emotional escalation.',
      'A character bible and a visual bible fixing immutable traits per recurring character and the environment’s visual language.',
      'A deliberate split between the image prompt, which defines visual state, and the animation prompt, which defines what changes over time. That separation is what makes character consistency controllable.',
      'A publishing gate that measures the final video, reads the attested environment, and refuses when something blocks. It never publishes on its own.',
      'Thirteen versioned JSON Schema files, one per persisted shape, as machine-readable contracts.',
    ],
    pt: [
      'Video intelligence: detecção de cena, extração de keyframes, transcrição de áudio e análise visual, selecionando frames representativos em vez de mandar todo frame para um modelo.',
      'Story intelligence: estrutura narrativa, arquétipos de personagem, história original em vez de personagem renomeado com diálogo traduzido, e estratégia de retenção com open loops e escalada emocional.',
      'Character bible e visual bible fixando características imutáveis por personagem recorrente e a linguagem visual do ambiente.',
      'Separação deliberada entre prompt de imagem, que define o estado visual, e prompt de animação, que define o que muda no tempo. Essa separação é o que torna a consistência de personagem controlável.',
      'Publishing gate que mede o vídeo final, lê o ambiente atestado e recusa quando algo bloqueia. Nunca publica sozinho.',
      'Treze arquivos JSON Schema versionados, um por shape persistida, como contratos machine-readable.',
    ],
  },

  stack: [{ group: 'other', items: ['python', 'typer', 'pydantic', 'opencv', 'whisper', 'anthropic-sdk', 'pytest', 'spec-kit'] }],

  development: {
    en: [
      'Spec-driven, fourteen specifications in two days. The architecture has one clear rule: the pipeline layer orchestrates, one module per CLI command following read-check-write; the domain packages beside it make no I/O decisions; models is the only place a persisted shape is declared; and every persisted shape has a contract in schemas.',
      'There is no `generate` command that runs the whole chain. Three stages make paid model calls, and the operational decision is that stories are written by hand in chat and enter through a promote step, the unpaid path.',
      '`record` does not accept a declared result as truth. A video job reported as completed against a local file is decoded before being believed: a file that is not a readable video demotes the job to missing, and a file that is has its measured duration recorded, replacing the declared one. The reason is on the record: the repository’s own first render plan logged a job as completed against a PNG, and an exists-check believed it. Anything with nothing local to measure is stored as reported, because inventing a measurement would be the same failure in the opposite direction.',
      '`assemble` sums measured duration, not requested duration. A gap over one second becomes a warning, because a provider returning five-second clips for eight-second requests passes every check in the pipeline and produces a video under the minimum length.',
      'Deterministic, LLM-free commands never modify their source file. They write a new file alongside it. Storage is split by nature: code, config, schemas, tests and light manifests in git; video, image, frames, audio and renders synced outside it.',
    ],
    pt: [
      'Spec-driven, catorze specs em dois dias. A arquitetura tem uma regra clara: a camada de pipeline orquestra, um módulo por comando CLI seguindo ler-checar-escrever; os pacotes de domínio ao lado não tomam decisão de I/O; models é o único lugar onde uma shape persistida é declarada; e toda shape persistida tem contrato em schemas.',
      'Não existe um comando `generate` que roda a cadeia inteira. Três estágios fazem chamada paga a modelo, e a decisão operacional é que histórias são escritas à mão no chat e entram por um passo de promoção, o caminho não pago.',
      'O `record` não aceita resultado declarado como verdade. Um job de vídeo reportado como completo contra um arquivo local é decodificado antes de ser acreditado: arquivo que não é vídeo legível rebaixa o job para ausente, e arquivo que é tem sua duração medida gravada, substituindo a declarada. A razão está registrada: o primeiro render plan do próprio repositório gravou um job como completo contra um PNG, e um exists-check acreditou. O que não tem nada local para medir é gravado como reportado, porque inventar medição seria a mesma falha na direção oposta.',
      'O `assemble` soma a duração medida, não a pedida. Um gap acima de um segundo vira warning, porque um provedor devolvendo clipes de cinco segundos para pedidos de oito passa por todo check do pipeline e produz um vídeo abaixo do mínimo.',
      'Comandos determinísticos e sem LLM nunca modificam o arquivo de origem. Escrevem um arquivo novo ao lado. O armazenamento é separado por natureza: código, config, schemas, testes e manifestos leves no git; vídeo, imagem, frames, áudio e renders sincronizados fora dele.',
    ],
  },

  limitations: {
    en: [
      'No end-to-end command exists, and that is deliberate rather than missing: three stages cost money per call, so the chain is driven stage by stage.',
      'Publishing is never automatic. The final post is manual, on a phone. The gate reports ready or blocked, and a human acts on it.',
      'A remote result with no local artifact is stored as reported, not as measured. The distinction is kept in the data rather than smoothed over.',
      'Not deployed anywhere: it is a local CLI, run by its author.',
    ],
    pt: [
      'Não existe comando fim-a-fim, e isso é deliberado e não uma falta: três estágios custam dinheiro por chamada, então a cadeia é conduzida estágio a estágio.',
      'A publicação nunca é automática. O post final é manual, no telefone. O gate reporta pronto ou bloqueado, e um humano age sobre isso.',
      'Resultado remoto sem artefato local é gravado como reportado, não como medido. A distinção fica no dado em vez de ser suavizada.',
      'Sem deploy em lugar nenhum: é uma CLI local, rodada pelo autor.',
    ],
  },

  metrics: [
    {
      label: { en: 'Specifications in two days', pt: 'Specs em dois dias' },
      value: '14',
      source: { en: 'specs/, 38 commits 2026-08-16 to 2026-08-18', pt: 'specs/, 38 commits de 16/08/2026 a 18/08/2026' },
    },
    {
      label: { en: 'Machine-readable contracts', pt: 'Contratos machine-readable' },
      value: '13',
      source: { en: 'schemas/, one JSON Schema per persisted shape', pt: 'schemas/, um JSON Schema por shape persistida' },
    },
    {
      label: { en: 'Lint gate', pt: 'Portão de lint' },
      value: '9.9 / 10',
      source: { en: 'pylint fail-under threshold', pt: 'limiar fail-under do pylint' },
    },
  ],
}
