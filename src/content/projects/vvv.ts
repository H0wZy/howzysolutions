import type { Project } from '../types'

/*
 * Facts measured in the vvv repository on 2026-09-27 (spec 004, FR-010): git
 * history, specs/, schemas/, tests/ and src/h3v/cli.py, counted rather than
 * recalled. The repository is private, so nothing here links to it, and nothing
 * names an account, a device, a proxy or a spend figure (spec 004, FR-004).
 */
export const vvv: Project = {
  id: 'vvv',
  name: 'vvv (Viral Video Visualizer)',
  formerName: 'viralvideogen',
  kind: 'product',
  state: 'functional',
  period: { start: '2026-07-03', end: '2026-09-27' },
  commits: 338,
  /* The name most of this project's tracked time sits under. Since the
     2026-09-21 rename the snapshot also holds a small 'vvv' project, which this
     single-name join does not count yet (spec 004 follow-up). */
  wakatimeProject: 'viralvideogen',

  summary: {
    en: 'A CLI pipeline that turns a reference video into an original, production-ready video package for two accounts, a US storytelling channel and a Brazilian TikTok Shop, and never believes a result it has not measured.',
    pt: 'Pipeline CLI que transforma um vídeo de referência num pacote de vídeo original e pronto para produção, para duas contas, um canal de storytelling nos EUA e uma loja no TikTok Shop Brasil, e nunca acredita num resultado que não mediu.',
  },

  problem: {
    en: 'Making short video with AI is cheap per attempt and expensive in aggregate. Every wrong prompt is a paid call, a character whose face changes between scenes ruins a story, and a product video that shows something unlike the real product is a misleading offer. The failures that cost the most are the ones that look like success.',
    pt: 'Fazer vídeo curto com IA é barato por tentativa e caro no conjunto. Cada prompt errado é uma chamada paga, um personagem que muda de rosto entre cenas estraga a história, e um vídeo de produto que mostra algo diferente do produto real é uma oferta enganosa. As falhas que mais custam são as que parecem sucesso.',
  },

  capabilities: {
    en: [
      'Video intelligence: scene detection, keyframe extraction, local transcription and visual analysis, choosing representative frames instead of sending every frame to a model.',
      'Story intelligence: an original story built from the reference’s structure (hook, open loops, twist, payoff), with character and visual bibles fixing what must not change between scenes.',
      'Two prompts per scene: the image prompt defines the visual state, the animation prompt what changes over time.',
      'Measured assembly: returned clips are decoded and timed, narration is transcribed back against the script and checked for voice drift, and the cut is joined with levels matched.',
      'A Brazilian TikTok Shop lane: product videos gated by product, claim and compliance checks, and a client for TikTok Shop’s Affiliate Creator API, run by the operator or on a schedule.',
      'A pre-publish gate that measures the final video, labels each finding verified or attested, and never posts by itself.',
    ],
    pt: [
      'Video intelligence: detecção de cena, extração de keyframes, transcrição local e análise visual, escolhendo frames representativos em vez de mandar todo frame para um modelo.',
      'Story intelligence: uma história original construída a partir da estrutura da referência (gancho, open loops, virada, desfecho), com character e visual bibles fixando o que não pode mudar entre cenas.',
      'Dois prompts por cena: o de imagem define o estado visual, o de animação o que muda no tempo.',
      'Montagem medida: clipes devolvidos são decodificados e cronometrados, a narração é transcrita de volta contra o roteiro e checada contra deriva de voz, e o corte é unido com os níveis igualados.',
      'Uma faixa de TikTok Shop Brasil: vídeos de produto barrados por checagens de produto, alegação e compliance, e um cliente da Affiliate Creator API do TikTok Shop, acionado pelo operador ou por agendamento.',
      'Um portão de pré-publicação que mede o vídeo final, rotula cada achado como verificado ou atestado, e nunca publica sozinho.',
    ],
  },

  stack: [
    { group: 'backend', items: ['python', 'go', 'typer', 'pydantic', 'sqlalchemy', 'postgres'] },
    { group: 'infra', items: ['github-actions', 'terraform'] },
    { group: 'other', items: ['opencv', 'whisper', 'anthropic-sdk', 'mcp', 'pytest', 'spec-kit'] },
  ],

  development: {
    en: [
      'Spec-driven: 37 specifications, each a spec, a plan and its tasks. The pipeline layer orchestrates, one module per command following read, check, write; the domain packages beside it make no I/O decisions; every persisted shape has a JSON Schema contract.',
      '`record` does not take a reported result on faith. A clip reported as completed is decoded first: a file that is not a readable video becomes missing, and one that is has its measured duration recorded in place of the claimed one. The rule exists because the first render plan logged a PNG as a finished video, and an exists-check believed it.',
      'A native Go launcher opens the interactive harness in milliseconds and runs the scheduled publishing worker, which holds a single-instance lock and never fires a job late; every other command passes through to the Python CLI.',
    ],
    pt: [
      'Spec-driven: 37 specs, cada uma com spec, plano e tarefas. A camada de pipeline orquestra, um módulo por comando seguindo ler, checar, escrever; os pacotes de domínio ao lado não tomam decisão de I/O; toda shape persistida tem um contrato JSON Schema.',
      'O `record` não aceita resultado reportado como verdade. Um clipe reportado como completo é decodificado antes: arquivo que não é vídeo legível vira ausente, e o que é tem a duração medida gravada no lugar da declarada. A regra existe porque o primeiro render plan gravou um PNG como vídeo pronto, e um exists-check acreditou.',
      'Um launcher nativo em Go abre o harness interativo em milissegundos e roda o worker de publicação agendada, que segura um lock de instância única e nunca dispara um job atrasado; todo outro comando passa para a CLI em Python.',
    ],
  },

  limitations: {
    en: [
      'No end-to-end command, on purpose: three stages make paid model calls, so the chain is driven stage by stage.',
      'The storytelling account is posted by hand, after the gate reports ready.',
      'The TikTok Shop publishing path is built and tested against a fake client; no live post has been recorded yet.',
      'A remote result with no local file is stored as reported, not as measured.',
      'Local only, from a private repository; not offered to the public.',
    ],
    pt: [
      'Sem comando fim a fim, de propósito: três estágios fazem chamada paga a modelo, então a cadeia é conduzida estágio a estágio.',
      'A conta de storytelling é publicada à mão, depois que o portão reporta pronto.',
      'O caminho de publicação no TikTok Shop está construído e testado contra um cliente falso; nenhum post real foi registrado ainda.',
      'Resultado remoto sem arquivo local é gravado como reportado, não como medido.',
      'Só local, a partir de um repositório privado; não é oferecido ao público.',
    ],
  },

  metrics: [
    {
      label: { en: 'Specifications', pt: 'Specs' },
      value: '37',
      source: { en: 'specs/, 2026-07-03 to 2026-09-27', pt: 'specs/, 03/07/2026 a 27/09/2026' },
    },
    {
      label: { en: 'Machine-readable contracts', pt: 'Contratos machine-readable' },
      value: '28',
      source: { en: 'schemas/, one JSON Schema per persisted shape', pt: 'schemas/, um JSON Schema por shape persistida' },
    },
    {
      label: { en: 'Test functions', pt: 'Funções de teste' },
      value: '1782',
      source: { en: 'tests/, Python, 2026-09-27; 21 more in Go', pt: 'tests/, Python, 27/09/2026; mais 21 em Go' },
    },
    {
      label: { en: 'CLI commands', pt: 'Comandos da CLI' },
      value: '71',
      source: { en: 'src/h3v/cli.py, 2026-09-27', pt: 'src/h3v/cli.py, 27/09/2026' },
    },
    {
      label: { en: 'Lint gate', pt: 'Portão de lint' },
      value: '9.9 / 10',
      source: { en: 'pylint fail-under, enforced in CI', pt: 'fail-under do pylint, exigido no CI' },
    },
  ],

  showcase: {
    route: { page: 'vvv' },
    blurb: {
      en: 'The designed summary: what it does, the rule behind it, and the two accounts it serves.',
      pt: 'O resumo desenhado: o que faz, a regra por trás, e as duas contas que atende.',
    },
  },
}
