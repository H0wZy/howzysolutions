import type { PrivacyPolicy } from './types'

/**
 * The privacy policy of H0wZy Solutions, served at /privacy/.
 *
 * It covers two things: viralvideogen, the private TikTok Shop app whose Data
 * Security and Privacy Review links here, and this website. The app half is
 * the same text as viralvideogen's docs/tiktok-shop/partner-center/PRIVACY_POLICY.md;
 * a change to either is a change to both, and `updated` moves with it.
 */
export const privacy: PrivacyPolicy = {
  updated: '2026-09-19',

  intro: {
    en: 'This page covers what H0wZy Solutions does with personal data in the two things it runs: viralvideogen, a private TikTok Shop app, and this website.',
    pt: 'Esta página diz o que a H0wZy Solutions faz com dados pessoais nas duas coisas que opera: o viralvideogen, um app privado do TikTok Shop, e este site.',
  },

  sections: [
    {
      id: 'who-we-are',
      heading: { en: 'Who we are', pt: 'Quem somos' },
      body: {
        en: [
          'H0wZy Solutions is a one-person company in Londrina, Brazil. It operates viralvideogen, a private TikTok Shop app that publishes product videos to a TikTok Shop creator account and manages that account\'s showcase. It works only for creator accounts that have authorized it. It is not offered to the public.',
        ],
        pt: [
          'A H0wZy Solutions é uma empresa de uma pessoa só, em Londrina, Brasil. Ela opera o viralvideogen, um app privado do TikTok Shop que publica vídeos de produto numa conta de criador do TikTok Shop e administra a vitrine dessa conta. Ele só funciona para contas de criador que o autorizaram e não é oferecido ao público.',
        ],
      },
    },
    {
      id: 'what-we-receive',
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
      id: 'where-it-is-stored',
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
      id: 'how-long',
      heading: { en: 'How long we keep it', pt: 'Por quanto tempo guardamos' },
      body: { en: [], pt: [] },
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
    {
      id: 'your-rights',
      heading: { en: 'Your rights', pt: 'Seus direitos' },
      body: {
        en: [
          'Under Brazil\'s LGPD (Lei 13.709/2018) you may ask us to confirm, access, correct, provide or delete your data. You may also withdraw your authorization at any time in TikTok Shop. Write to the address at the top of this page and we will answer within 15 days.',
        ],
        pt: [
          'Pela LGPD (Lei 13.709/2018), você pode nos pedir para confirmar, acessar, corrigir, fornecer ou apagar seus dados. Também pode retirar sua autorização a qualquer momento no TikTok Shop. Escreva para o endereço no topo desta página e respondemos em até 15 dias.',
        ],
      },
    },
    {
      id: 'security',
      heading: { en: 'Security', pt: 'Segurança' },
      body: {
        en: [
          'Connections use HTTPS with TLS 1.2 or higher. The computer\'s disk is encrypted, and access is limited to the operator.',
        ],
        pt: [
          'As conexões usam HTTPS com TLS 1.2 ou superior. O disco do computador é criptografado e o acesso é restrito ao operador.',
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
}
