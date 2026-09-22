import type { LegalDocument } from './types'

/**
 * The privacy policy of H0wZy Solutions, served at /privacy-policy/.
 *
 * A general policy first (who we are, this website, rights, security), then
 * one section per project that handles personal data beyond the website. A
 * project with no entry here collects none.
 *
 * A project's block keeps a stable `id`, so /privacy-policy/#vvv is an anchor
 * and /privacy-policy/vvv/ is that same block on a page of its own. The per-app
 * URL is what a store asks for when it reviews one app.
 *
 * TikTok Shop's Data Security and Privacy Review was sent with /privacy/, which
 * public/_redirects 301s here. That redirect may not go away.
 *
 * The app was renamed from `viralvideogen` to `vvv`. Partner Center still
 * carries the old name, so the record says so once, in prose, in the same words
 * the terms use, and the old URL 301s to the new one (public/_redirects). The
 * old `#viralvideogen` anchor is deliberately not kept: it was a fragment on a
 * page that still answers, never a URL given out on its own.
 *
 * That project's section is the same text as vvv's
 * docs/tiktok-shop/partner-center/PRIVACY_POLICY.md; a change to either is a
 * change to both, and `updated` moves with it.
 */
export const privacy: LegalDocument = {
  updated: '2026-09-22',

  intro: {
    en: 'How H0wZy Solutions handles personal data: first on this website, then in each project that handles data of its own.',
    pt: 'Como a H0wZy Solutions trata dados pessoais: primeiro neste site, depois em cada projeto que trata dados próprios.',
  },

  sections: [
    {
      id: 'who-we-are',
      heading: { en: 'Who we are', pt: 'Quem somos' },
      body: {
        en: [
          'H0wZy Solutions is a one-person company in Londrina, Brazil, run by Marcos "H0wZy" Junior. This website is its portfolio.',
        ],
        pt: [
          'A H0wZy Solutions é uma empresa de uma pessoa só, em Londrina, Brasil, tocada por Marcos "H0wZy" Junior. Este site é o portfólio dela.',
        ],
      },
    },
    {
      id: 'this-website',
      heading: { en: 'This website', pt: 'Este site' },
      body: {
        en: [
          'This site runs no analytics, trackers or third-party fonts, and sets no cookies of its own. Your language choice and scroll position are kept in your browser\'s own storage and never leave it.',
          'The site is hosted on Cloudflare, which handles the technical data every request carries, such as IP address and browser, to deliver the pages and protect them from abuse. Cloudflare may set a strictly necessary security cookie when it has to check a request. We see only aggregate traffic figures, never individual visitors.',
        ],
        pt: [
          'Este site não usa analytics, rastreadores nem fontes de terceiros, e não grava cookies próprios. O idioma escolhido e a posição de rolagem ficam no armazenamento do próprio navegador e não saem dele.',
          'O site é hospedado na Cloudflare, que trata os dados técnicos de toda requisição, como endereço IP e navegador, para entregar as páginas e protegê-las de abuso. A Cloudflare pode gravar um cookie de segurança estritamente necessário quando precisa verificar uma requisição. Nós vemos só números agregados de tráfego, nunca visitantes individuais.',
        ],
      },
    },
    {
      id: 'your-rights',
      heading: { en: 'Your rights', pt: 'Seus direitos' },
      body: {
        en: [
          'Under Brazil\'s LGPD (Lei 13.709/2018) you may ask us to confirm, access, correct, provide or delete your data. Write to the address at the top of this page and we will answer within 15 days.',
        ],
        pt: [
          'Pela LGPD (Lei 13.709/2018), você pode nos pedir para confirmar, acessar, corrigir, fornecer ou apagar seus dados. Escreva para o endereço no topo desta página e respondemos em até 15 dias.',
        ],
      },
    },
    {
      id: 'security',
      heading: { en: 'Security', pt: 'Segurança' },
      body: {
        en: [
          'Connections use HTTPS with TLS 1.2 or higher. The computer that runs our tools has an encrypted disk, and access to it is limited to the operator.',
        ],
        pt: [
          'As conexões usam HTTPS com TLS 1.2 ou superior. O computador que roda nossas ferramentas tem o disco criptografado e o acesso é restrito ao operador.',
        ],
      },
    },
    {
      id: 'changes',
      heading: { en: 'Changes', pt: 'Mudanças' },
      body: {
        en: [
          'We will update this page when our processing changes, and we will change its date when we do.',
        ],
        pt: [
          'Atualizaremos esta página quando o tratamento mudar, e mudaremos a data dela quando isso acontecer.',
        ],
      },
    },
  ],

  projects: [
    {
      id: 'vvv',
      name: 'vvv',
      tagline: { en: 'TikTok Shop app', pt: 'app do TikTok Shop' },
      summary: {
        en: [
          'vvv (Viral Video Visualizer) is the tool H0wZy Solutions uses to publish product videos to a TikTok Shop creator account and to keep that account\'s showcase, the list of products the creator promotes, up to date. It runs on the operator\'s computer, has no website or sign-up of its own, and works only for creator accounts that have authorized it in TikTok Shop. It is not offered to the public.',
          'The app is registered in TikTok Shop\'s Partner Center under its former name, viralvideogen.',
        ],
        pt: [
          'O vvv (Viral Video Visualizer) é a ferramenta que a H0wZy Solutions usa para publicar vídeos de produto numa conta de criador do TikTok Shop e manter atualizada a vitrine dessa conta, a lista de produtos que o criador divulga. Ele roda no computador do operador, não tem site nem cadastro próprio e só funciona para contas de criador que o autorizaram no TikTok Shop. Não é oferecido ao público.',
          'O app está registrado no Partner Center do TikTok Shop sob o nome anterior, viralvideogen.',
        ],
      },
      sections: [
        {
          id: 'vvv-data',
          heading: { en: 'What the app receives and why', pt: 'O que o app recebe e por quê' },
          body: {
            en: [
              'When a creator authorizes the app, TikTok Shop gives us the three things below and nothing else. We do not receive or store buyer, order or payment data.',
            ],
            pt: [
              'Quando um criador autoriza o app, o TikTok Shop nos entrega as três coisas abaixo e nada além delas. Não recebemos nem guardamos dados de compradores, pedidos ou pagamentos.',
            ],
          },
          items: {
            en: [
              'The creator\'s account id, authorization tokens and granted scopes, so the app can act for that account.',
              'The creator\'s showcase products (ids and titles), so a video can be attached to the right product.',
              'The status TikTok reports for each upload and post, so the app can confirm a video was published.',
            ],
            pt: [
              'O id da conta do criador, os tokens de autorização e os escopos concedidos, para o app poder agir por essa conta.',
              'Os produtos da vitrine do criador (ids e títulos), para o vídeo ser ligado ao produto certo.',
              'O status que o TikTok informa de cada envio e publicação, para o app confirmar que o vídeo foi publicado.',
            ],
          },
        },
        {
          id: 'vvv-storage',
          heading: { en: 'Where it is stored and who processes it', pt: 'Onde fica e quem trata' },
          body: { en: [], pt: [] },
          items: {
            en: [
              'Storage: data is stored on the operator\'s computer in Brazil and is not sold. Credentials never leave that computer except to be sent to TikTok.',
              'AI tools: the operator may use AI assistant tools, whose providers are in the United States, to run the app. Those tools can see product and post metadata. They do not receive credentials.',
            ],
            pt: [
              'Armazenamento: os dados ficam no computador do operador, no Brasil, e não são vendidos. As credenciais só saem desse computador para serem enviadas ao TikTok.',
              'Ferramentas de IA: o operador pode usar assistentes de IA, de empresas nos Estados Unidos, para operar o app. Essas ferramentas podem ver metadados de produtos e publicações. Elas não recebem credenciais.',
            ],
          },
        },
        {
          id: 'vvv-retention',
          heading: { en: 'How long we keep it', pt: 'Por quanto tempo guardamos' },
          body: {
            en: [
              'A creator can withdraw the app\'s authorization at any time in TikTok Shop, which starts the deadlines below.',
            ],
            pt: [
              'O criador pode retirar a autorização do app a qualquer momento no TikTok Shop, e isso inicia os prazos abaixo.',
            ],
          },
          items: {
            en: [
              'Tokens: deleted as soon as the creator revokes access.',
              'Post records: kept for at most 12 months.',
              'Everything else: deleted within 30 days of revocation, the end of the service, or a verified request.',
            ],
            pt: [
              'Tokens: apagados assim que o criador revoga o acesso.',
              'Registros de publicação: guardados por no máximo 12 meses.',
              'Todo o resto: apagado em até 30 dias após a revogação, o fim do serviço ou um pedido verificado.',
            ],
          },
        },
      ],
    },
  ],
}
