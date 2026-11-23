import type { Localized } from './i18n/types'
import type { ServiceId } from './contact'

/**
 * What the site sells, as data: the home page's index rows and /services/ both
 * render this, and a missing Portuguese string is a type error (FR-017).
 *
 * Nothing here is a number, a client, a price or a testimonial, because none
 * exists to cite (PRODUCT.md, Evidence on Hand). Every proof points at a
 * project that exists, and a test checks each `projectId` against the records.
 */

/** A picture of real work. Used by the home strip, the peek and the proof grids. */
export type WorkImage = {
  src: string
  width: number
  height: number
  alt: Localized
  caption: Localized
  /** The project record the picture belongs to, linked from every use of it. */
  projectId: string
}

export const workImages = {
  panel: {
    src: '/home/work-1.webp',
    width: 1170,
    height: 410,
    alt: {
      en: 'The vvv dashboard showing sales totals for a test store',
      pt: 'O painel do vvv mostrando totais de vendas de uma loja de teste',
    },
    caption: { en: 'vvv, dashboard (test data)', pt: 'vvv, painel (dados de teste)' },
    projectId: 'vvv',
  },
  pipeline: {
    src: '/home/work-2.webp',
    width: 720,
    height: 720,
    alt: {
      en: 'Engraving of a figure carrying film strips, from the vvv visual identity',
      pt: 'Gravura de uma figura carregando tiras de filme, da identidade visual do vvv',
    },
    caption: { en: 'vvv, pipeline', pt: 'vvv, pipeline' },
    projectId: 'vvv',
  },
  identity: {
    src: '/home/work-3.webp',
    width: 1376,
    height: 768,
    alt: {
      en: 'Engraving of a two-faced bust under an arch, from the vvv visual identity',
      pt: 'Gravura de um busto de duas faces sob um arco, da identidade visual do vvv',
    },
    caption: { en: 'vvv, identity', pt: 'vvv, identidade' },
    projectId: 'vvv',
  },
  console: {
    src: '/home/work-4.webp',
    width: 920,
    height: 528,
    alt: {
      en: 'The vvv live console, the form that starts a new live',
      pt: 'O console de lives do vvv, o formulário que começa uma nova live',
    },
    caption: { en: 'vvv, live console', pt: 'vvv, console de lives' },
    projectId: 'vvv',
  },
} as const satisfies Record<string, WorkImage>

export type WorkImageKey = keyof typeof workImages

/** The order the home page's hero strip shows them in. */
export const stripImages: WorkImageKey[] = ['panel', 'pipeline', 'identity', 'console']

export type Proof =
  /** A picture of the work, linked to its project. */
  | { image: WorkImageKey }
  /**
   * A project with no picture yet: a plain text line, never a grey placeholder.
   * Without `projectId` there is no page to link to and it stays plain text.
   */
  | { label: string; projectId?: string }

export type Service = {
  id: ServiceId
  /** One entry per line of the heading. */
  title: Localized<string[]>
  /** The names under the title on the home page's index row. */
  homeNote: string
  /** The picture that follows the cursor over the row on the home page. */
  peek: WorkImageKey
  what: Localized
  items: { label: Localized; tech: Localized }[]
  proof: Proof[]
}

export const services: Service[] = [
  {
    id: 'web',
    title: { en: ['Websites and', 'web apps'], pt: ['Site e', 'web app'] },
    homeNote: 'Telas Paraná · Selzler · Studio Bia Santos',
    peek: 'pipeline',
    what: {
      en: 'Sites that convert, dashboards the client edits alone, fast and in both languages.',
      pt: 'Site que converte, painel que o cliente edita sozinho, rápido e nos dois idiomas.',
    },
    items: [
      {
        label: { en: 'Business site and landing page', pt: 'Site institucional e landing' },
        tech: { en: 'React · Next', pt: 'React · Next' },
      },
      {
        label: { en: 'Dashboard and client area', pt: 'Painel e área do cliente' },
        tech: { en: 'TypeScript · shadcn', pt: 'TypeScript · shadcn' },
      },
      {
        label: { en: 'Lead capture and forms', pt: 'Captura de lead e formulários' },
        tech: { en: 'Cloudflare Workers', pt: 'Cloudflare Workers' },
      },
    ],
    proof: [
      { label: 'Telas Paraná', projectId: 'telasparana' },
      { label: 'Selzler', projectId: 'selzler-construtora' },
      { label: 'Studio Bia Santos', projectId: 'studiobiasantos' },
    ],
  },
  {
    id: 'ai',
    title: { en: ['Automation', 'and AI'], pt: ['Automação', 'e IA'] },
    homeNote: 'vvv · MCP hub',
    peek: 'panel',
    what: {
      en: 'Agents and pipelines that check what they produce before handing it over. No "the AI said it worked".',
      pt: 'Agentes e pipelines que conferem o que geram antes de entregar. Nada de "a IA disse que deu certo".',
    },
    items: [
      {
        label: { en: 'Content and video pipeline', pt: 'Pipeline de conteúdo e vídeo' },
        tech: { en: 'Python · Go', pt: 'Python · Go' },
      },
      {
        label: { en: 'Agents and MCP servers', pt: 'Agentes e servidores MCP' },
        tech: { en: 'Claude · MCP', pt: 'Claude · MCP' },
      },
      {
        label: { en: 'API and dashboard integrations', pt: 'Integração com APIs e painéis' },
        tech: { en: 'OAuth', pt: 'OAuth' },
      },
    ],
    proof: [{ image: 'panel' }, { image: 'pipeline' }, { label: 'MCP hub', projectId: 'mcp' }],
  },
  {
    id: 'infra',
    title: { en: ['Back end', 'and infra'], pt: ['Backend', 'e infra'] },
    homeNote: 'authsys · k3s · Terraform',
    peek: 'console',
    what: {
      en: 'APIs, login, database and deploy you do not have to babysit.',
      pt: 'API, login, banco e deploy que você não precisa ficar vigiando.',
    },
    items: [
      {
        label: { en: 'API and authentication', pt: 'API e autenticação' },
        tech: { en: 'Go · Keycloak', pt: 'Go · Keycloak' },
      },
      {
        label: { en: 'Database and migration', pt: 'Banco e migração' },
        tech: { en: 'Postgres', pt: 'Postgres' },
      },
      {
        label: { en: 'Deploy and CI', pt: 'Deploy e CI' },
        tech: { en: 'k3s · Terraform', pt: 'k3s · Terraform' },
      },
    ],
    proof: [
      { label: 'authsys', projectId: 'authsys' },
      { label: 'vvv, CI with GitHub Actions', projectId: 'vvv' },
      { label: 'Telas Paraná, Terraform on Cloud Run', projectId: 'telasparana' },
    ],
  },
  {
    id: 'games',
    title: { en: ['Game', 'dev'], pt: ['Game', 'dev'] },
    homeNote: 'Lei do Corre',
    peek: 'identity',
    what: {
      en: 'From the design document to a playable prototype, in Unreal or Roblox.',
      pt: 'Do documento de design ao protótipo jogável, em Unreal ou Roblox.',
    },
    items: [
      {
        label: { en: 'Playable prototype', pt: 'Protótipo jogável' },
        tech: { en: 'Unreal 5', pt: 'Unreal 5' },
      },
      {
        label: { en: 'Roblox experience', pt: 'Experiência Roblox' },
        tech: { en: 'Luau', pt: 'Luau' },
      },
      {
        label: { en: 'Game design document', pt: 'GDD e direção' },
        tech: { en: 'living document', pt: 'doc vivo' },
      },
    ],
    // No project record and no picture yet: plain text, with nothing to link.
    proof: [{ label: 'Lei do Corre, devlog' }],
  },
]

/** "How it works": four steps, each a word and a sentence. */
export const howSteps: { name: Localized; text: Localized }[] = [
  {
    name: { en: 'Tell', pt: 'Conta' },
    text: {
      en: 'You tell me the problem through the form. I answer by email.',
      pt: 'Você conta o problema pelo formulário. Eu respondo por e-mail.',
    },
  },
  {
    name: { en: 'Talk', pt: 'Conversa' },
    text: {
      en: 'A conversation to understand what needs to exist and what does not.',
      pt: 'Uma conversa pra entender o que precisa existir e o que não precisa.',
    },
  },
  {
    name: { en: 'Proposal', pt: 'Proposta' },
    text: {
      en: 'A written proposal: what is in, what is left out, how long it takes.',
      pt: 'Proposta por escrito: o que entra, o que fica de fora, prazo.',
    },
  },
  {
    name: { en: 'Delivery', pt: 'Entrega' },
    text: {
      en: 'Built in deliveries you can see working, up to the deploy.',
      pt: 'Construção com entregas que você vê funcionando, até o deploy.',
    },
  },
]
