import type { Project } from '../types'

export const studiobiasantos: Project = {
  id: 'studiobiasantos',
  name: 'Studio Bia Santos',
  kind: 'client',
  state: 'production',
  context: {
    en: 'A manicurist offering private at-home appointments in Londrina and the surrounding region.',
    pt: 'Manicure com atendimento particular a domicílio em Londrina e região.',
  },
  period: { start: '2026-07-08', end: '2026-08-16' },
  commits: 23,
  wakatimeProject: 'studiobiasantos',

  summary: {
    en: 'A single static page with no backend, where the booking card composes a WhatsApp message instead of reserving a calendar — the right product decision for the business.',
    pt: 'Página única estática sem backend, onde o card de agendamento monta uma mensagem de WhatsApp em vez de reservar agenda — a decisão de produto certa para o negócio.',
  },

  problem: {
    en: 'A self-employed professional with no digital presence, whose booking happened entirely through loose WhatsApp conversation — no service context, no visible pricing, no organised social proof.',
    pt: 'Uma profissional autônoma sem presença digital, cujo agendamento acontecia inteiramente por conversa solta no WhatsApp — sem contexto do serviço, sem preço visível, sem prova social organizada.',
  },

  capabilities: {
    en: [
      'One page, static, with no backend, no database and no server state.',
      'A booking card that does not reserve a slot: it composes the message and opens the WhatsApp conversation, where the appointment is confirmed by a human. There is no system to operate, and confirmation stays where it already was.',
      'Hero, about with a real portrait, services with prices, a gallery of real client photos, testimonials as genuine WhatsApp screenshots, closing call to action and a four-column footer.',
      'Date picker, floating WhatsApp button, an Open Graph image generated in the brand’s theme, and generated robots and sitemap.',
    ],
    pt: [
      'Página única, estática, sem backend, sem banco e sem estado de servidor.',
      'Um card de agendamento que não reserva horário: monta a mensagem e abre a conversa no WhatsApp, onde o horário é confirmado por uma pessoa. Não há sistema para operar, e a confirmação continua onde já estava.',
      'Hero, sobre com retrato real, serviços com preço, galeria com fotos reais de clientes, depoimentos como screenshots reais de WhatsApp, CTA final e rodapé de quatro colunas.',
      'Calendário para escolha de data, WhatsApp flutuante, imagem de Open Graph gerada no tema da marca, e robots e sitemap gerados.',
    ],
  },

  stack: [
    { group: 'frontend', items: ['nextjs', 'react', 'typescript', 'tailwind', 'shadcn', 'vitest'] },
    { group: 'other', items: ['vercel', 'spec-kit', 'skeeper'] },
  ],

  development: {
    en: [
      'Spec-driven with four specifications, a project constitution prevailing over everything else, and a living product specification kept beside it.',
      'The rebrand from neighbourhood salon to boutique is documented as its own specification, and the rules that survived it are written prohibitively: a named typeface "is gone, do not reintroduce it"; the old wine, ivory and blush palette "is over, do not reintroduce it". Components read semantic tokens, never a literal hex.',
      'The typographic detail is the project’s signature: the display face has exactly one weight. Hierarchy comes from size, letter-spacing and breathing room, never from a heavier weight — headings are pinned to weight 400 with weight synthesis disabled, because faux-bold smears a didone.',
      'Typography is self-hosted. Google Fonts at runtime is prohibited in the project, including when a tool tries to inject it.',
      'A single configuration module is the sole source of contact details, services, prices, hours and availability.',
    ],
    pt: [
      'Spec-driven com quatro specs, uma constituição de projeto que prevalece sobre todo o resto, e uma especificação viva do produto mantida ao lado.',
      'O rebranding de salão de bairro para boutique está documentado como spec própria, e as regras que sobraram dela estão escritas de forma proibitiva: uma fonte nomeada "acabou, não reintroduzir"; a paleta antiga vinho, marfim e blush "acabou, não reintroduzir". Componentes leem tokens semânticos, nunca um hex literal.',
      'O detalhe tipográfico é a assinatura do projeto: a fonte de display tem exatamente um peso. Hierarquia vem de tamanho, entreletra e respiro, nunca de peso mais forte — headings ficam fixos em peso 400 com síntese de peso desligada, porque faux-bold borra uma didone.',
      'A tipografia é auto-hospedada. Google Fonts em tempo de execução é proibido no projeto, inclusive quando uma ferramenta tenta injetar.',
      'Um único módulo de configuração é a fonte exclusiva de contato, serviços, preços, horários e disponibilidade.',
    ],
  },

  limitations: {
    en: [
      'The booking card does not reserve anything. This is a product decision, not a missing feature — there is no system for the client to operate.',
      'The test suite covers structural invariants — label counts, the six section headings, anchor integrity — and explicitly does not cover appearance. jsdom does not load the stylesheet, so a test proves a token was applied and never proves a pixel was painted.',
      'Because of that limit, layout and accessibility validation stays a mandatory manual measurement in a real browser, with twenty-five numbered procedures rather than an automated substitute.',
      'Content rules are not stylistic: there are two services and exactly two, no social proof is invented, and every published number derives from real data at runtime.',
    ],
    pt: [
      'O card de agendamento não reserva nada. É decisão de produto, não funcionalidade faltando — não há sistema para a cliente operar.',
      'A suíte de testes cobre invariantes estruturais — contagem de rótulos, os seis cabeçalhos de seção, integridade das âncoras — e explicitamente não cobre aparência. O jsdom não carrega a folha de estilo, então o teste prova que o token foi aplicado e nunca que o pixel foi pintado.',
      'Por causa desse limite, a validação de layout e acessibilidade continua sendo medição manual obrigatória em navegador real, com vinte e cinco procedimentos numerados em vez de um substituto automatizado.',
      'Regras de conteúdo não são estilísticas: existem dois serviços e apenas dois, nenhuma prova social é inventada, e todo número publicado deriva de dado real em tempo de execução.',
    ],
  },

  metrics: [
    {
      label: { en: 'Numbered browser validation procedures', pt: 'Procedimentos numerados de validação em navegador' },
      value: '25',
      source: { en: 'V-001 to V-025 across the specification quickstarts', pt: 'V-001 a V-025 nos quickstarts das specs' },
    },
    {
      label: { en: 'Display typeface weights', pt: 'Pesos da fonte de display' },
      value: '1',
      source: { en: 'hierarchy comes from size and spacing, by design', pt: 'hierarquia vem de tamanho e respiro, por decisão' },
    },
  ],
}
