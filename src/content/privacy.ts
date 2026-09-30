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
 *
 * 2026-09-30, section `this-website`: the sentence "This site runs no analytics,
 * trackers or third-party fonts" was replaced by one that discloses Cloudflare
 * Web Analytics. The earlier wording is the one TikTok Shop's Data Security and
 * Privacy Review saw (approved 2026-09-23, sent with /privacy/), so `updated`
 * moving from 2026-09-22 to 2026-09-30 is the before and after. The decision to
 * keep the counter on is the operator's, recorded in the constitution (2.3.0).
 *
 * The four legal decisions behind that paragraph, all 2026-09-30, made by the
 * operator (the first two delegated to the assistant working for them):
 *
 *  1. Legal basis: legitimate interest, LGPD art. 7, IX. No formal balancing
 *     test (LIA) was written. The counting is aggregate and sets no cookie, so
 *     the risk to a visitor is minimal, and a formal document nobody reads is
 *     cost without gain. This is a decision, not an omission: if the ANPD ever
 *     asks, this is the reasoning, and a LIA can be written then.
 *  2. Retention: NO period is declared. A period stated here ("7 days") stops
 *     being true the day Cloudflare changes it, and nobody would notice, which
 *     is how "runs no analytics" stayed wrong. The policy says only what the
 *     operator controls (aggregate figures) and attributes the rest to
 *     Cloudflare, with a pointer to its privacy policy. Do not copy a number
 *     from Cloudflare's documentation into the text.
 *  3. International transfer: declared, and kept apart from the console. The
 *     site's counting is handled by Cloudflare outside Brazil; the vvv live
 *     console (vvvapp) stores its data on the operator's own server in Brazil.
 *     The two sentences sit side by side so nobody reads the first as meaning
 *     the console's data leaves the country. The LGPD art. 33 mechanism that
 *     legitimates the transfer is NOT named here; it has not been decided.
 *  4. Consent banner: none. Web Analytics sets no cookie, so a banner saying
 *     "this site uses cookies" would be false, which is the defect this change
 *     exists to remove; and setting a cookie only to justify a banner would
 *     buy an obligation with no metric. Revisit if click-level measurement
 *     (which needs a cookie or storage) is ever added: then a banner is back
 *     on the table.
 *
 * The privacy policy stays linked from the footer of every page and from the
 * chrome bar, so the disclosure is one click from anywhere.
 *
 * 2026-09-30, section `vvv-retention`: "Everything else: deleted within 30 days"
 * promised total deletion, and it was not true. The data is deleted from the
 * database in time, but the nightly encrypted dump goes to a cloud folder and is
 * not pruned there (infra/bin/h3v-backup.sh in H0wZy/vvv deletes only the local
 * copy, after 14 days; 52 files were in the remote on that day, the oldest from
 * 2026-09-22). The operator chose to keep the backups so the system can be
 * restored, not to prune them, so the text was changed to say what is true: the
 * deletion covers the active systems, and the encrypted backups have no defined
 * disposal period. No number of days is stated for them because none exists.
 * The same paragraph lives in vvv's docs/tiktok-shop/partner-center/PRIVACY_POLICY.md,
 * and a change to either is a change to both (see the note above).
 *
 * 2026-09-30, section `vvv-storage`: "data is stored on the operator's computer
 * in Brazil" was out of date. Measured that day: the metadata database runs on
 * the operator's own server (Brazil by IP geolocation of the server), a nightly
 * dump of every database on that server goes to a Google Drive folder through an
 * rclone crypt remote (file and directory names encrypted; the remote root holds
 * only crypt/), so the copy leaves Brazil. Credentials: the TikTok tokens are
 * written only to .env on the operator's computer (pipeline/tiktok_authorize.py),
 * the table platform_connections documents "No token is stored", and no env file
 * on the server carries the token keys. The LGPD art. 33 mechanism for this
 * transfer, like the one for Cloudflare's counting, is NOT named: it has not been
 * decided, and naming one that is not in place would be worse than naming none.
 * Not verified by query: the database content itself (a probe of it was not run).
 *
 * "An encrypted copy" is true because of a cleanup, not by default. Until
 * 2026-09-30 the nightly dumps (2026-09-22 to 2026-09-29) were sent unencrypted;
 * the crypt remote was configured that day, and 35 unencrypted dump files were
 * found in the Drive trash (38 entries in all). The operator emptied them the same
 * day, and it was measured twice afterwards, at 2026-09-30T17:15Z by the assistant
 * working on this file: the trash holds only the crypt/ folder and one folder with
 * an encrypted name (no readable .dump, .sql, .tsv or .gz name), the live root holds
 * only crypt/, and the crypt remote still lists 52 entries. If a readable dump ever
 * turns up in the Drive trash again, this sentence is false again.
 *
 * Also 2026-09-30, after review. Measured by the reviewer: the server's disks are
 * NOT encrypted (no crypt layer in lsblk, `dmsetup ls --target crypt` finds no
 * device), so the general Security section no longer says "encrypted disk"; what is
 * encrypted is the backup copy, before it leaves. The nightly copy covers EVERY
 * database on the server (and pg_basebackup is a physical copy of the whole
 * cluster), so the console's data leaves Brazil too, and the sentence that kept the
 * console "apart" from the transfer was removed. The dump also carries the
 * `tfstate` database, which holds infrastructure credentials in the clear, so
 * "credentials are kept only on the operator's computer" was narrowed to the TikTok
 * authorization tokens. Two rows in vvvmetadata match a token-like name and nobody
 * has classified them as name or value; if the operator says value, the sentence on
 * the tokens changes again.
 *
 * The Security section says "only the operator has personal access" and names the
 * automated deployment runner (the `ghrunner` service account on the server) as having
 * access of its own, because "limited to the operator" while a runner can reach the
 * server would be the same kind of false statement this file was corrected for. The
 * operator's own computer is not described beyond access: its disk was never measured.
 *
 * The encryption sentence was reworded because "what is encrypted is the backup copy"
 * can be read as "only the backup is encrypted". That is not so: the console encrypts
 * e-mail addresses and the authenticator secret inside its database. What the sentence
 * must not suggest is encryption at rest of the server's disks, which there is none of.
 * It now says the backup copy is encrypted before it leaves, the disks are not, and
 * points to the console's own policy for what the console encrypts.
 *
 * ONE SENTENCE DIFFERS ON PURPOSE from vvv's docs/tiktok-shop/partner-center/PRIVACY_POLICY.md:
 * the encryption sentence in Security. Here "the console" is defined on the same page; the
 * mirror is the TikTok app's policy and never says what the console is, so it says "the vvv
 * live console, a separate service of ours" and "its own database". Every other mirrored
 * sentence is identical; when comparing the two, do not treat this one as a divergence.
 */
export const privacy: LegalDocument = {
  updated: '2026-09-30',

  intro: {
    en: 'How H0wZy Solutions handles personal data: first on this website, then in each project that handles data of its own.',
    pt: 'Como a H0wZy Solutions trata dados pessoais: primeiro neste site, depois em cada projeto que trata dados próprios.',
  },

  sections: [
    {
      id: 'who-we-are',
      withApp: true,
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
          'This site sets no cookies of its own and uses no third-party fonts. Your language choice and scroll position are kept in your browser\'s own storage and never leave it.',
          'The site is hosted on Cloudflare, which handles the technical data every request carries, such as IP address and browser, to deliver the pages and protect them from abuse. Cloudflare may set a strictly necessary security cookie when it has to check a request. We see only aggregate traffic figures, never individual visitors.',
          'The site also uses Cloudflare Web Analytics to count visits in aggregate. It works through a small script that your browser loads from static.cloudflareinsights.com on each page, so that address receives a request when you open one. Cloudflare states that this counting uses no cookies or local storage and does not fingerprint individuals. Our legal basis is legitimate interest (LGPD art. 7, IX): knowing how many people visit the site. What Cloudflare keeps about these requests, and for how long, is decided by Cloudflare and described in its privacy policy (cloudflare.com/privacypolicy). What we see is only the aggregate figures. This was added to this policy on 30 September 2026.',
          'This counting is handled by Cloudflare, which operates outside Brazil, so the visit counts of this website leave the country. The vvv live console is a separate service with its own privacy policy. Its data is stored on our own server in Brazil, but the nightly backup of that server covers it too, so an encrypted copy of it also goes to Google Drive, outside Brazil (see the vvv section below).',
        ],
        pt: [
          'Este site não grava cookies próprios e não usa fontes de terceiros. O idioma escolhido e a posição de rolagem ficam no armazenamento do próprio navegador e não saem dele.',
          'O site é hospedado na Cloudflare, que trata os dados técnicos de toda requisição, como endereço IP e navegador, para entregar as páginas e protegê-las de abuso. A Cloudflare pode gravar um cookie de segurança estritamente necessário quando precisa verificar uma requisição. Nós vemos só números agregados de tráfego, nunca visitantes individuais.',
          'O site também usa o Cloudflare Web Analytics para contar visitas de forma agregada. Ele funciona por um pequeno script que o seu navegador carrega de static.cloudflareinsights.com em cada página, então esse endereço recebe uma requisição quando você abre uma. A Cloudflare afirma que essa contagem não usa cookies nem armazenamento local e não identifica indivíduos por impressão digital. Nossa base legal é o legítimo interesse (LGPD, art. 7º, IX): saber quantas pessoas visitam o site. O que a Cloudflare guarda sobre essas requisições, e por quanto tempo, é decidido pela Cloudflare e descrito na política de privacidade dela (cloudflare.com/privacypolicy). O que nós vemos são só os números agregados. Isto foi acrescentado a esta política em 30 de setembro de 2026.',
          'Essa contagem é feita pela Cloudflare, que opera fora do Brasil, então as contagens de visitas deste site saem do país. O console de lives do vvv é um serviço separado, com política de privacidade própria. Os dados dele ficam no nosso próprio servidor, no Brasil, mas a cópia de segurança noturna desse servidor também o cobre, então uma cópia criptografada dele vai igualmente para o Google Drive, fora do Brasil (veja a seção do vvv abaixo).',
        ],
      },
    },
    {
      id: 'your-rights',
      withApp: true,
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
      withApp: true,
      heading: { en: 'Security', pt: 'Segurança' },
      body: {
        en: [
          'Connections use HTTPS with TLS 1.2 or higher. Only the operator has personal access to the operator\'s computer and to our server; an automated deployment runner on the server has access of its own. The backup copy that leaves our server is encrypted before it leaves. The server\'s own disks are not encrypted, but the console encrypts some personal data inside its database (see its own policy).',
        ],
        pt: [
          'As conexões usam HTTPS com TLS 1.2 ou superior. Só o operador tem acesso pessoal ao computador do operador e ao nosso servidor; um executor automático de entrega (deploy) no servidor tem acesso próprio. A cópia de segurança que sai do nosso servidor é criptografada antes de sair. Os discos do próprio servidor não são criptografados, mas o console criptografa alguns dados pessoais dentro do banco dele (veja a política própria dele).',
        ],
      },
    },
    {
      id: 'changes',
      withApp: true,
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
              'Storage: the data above, except the TikTok authorization tokens, is stored in a database on the operator\'s own server in Brazil and is not sold. The tokens are kept only on the operator\'s computer and are sent only to TikTok.',
              'Backups: every night an encrypted copy of all the databases on the operator\'s own server, this app\'s and others\', is sent to Google Drive, in the operator\'s own Google account. The copy is encrypted on our server before it leaves, file names included. Google Drive is operated outside Brazil, so the copy leaves the country.',
              'AI tools: the operator may use AI assistant tools, whose providers are in the United States, to run the app. Those tools can see product and post metadata. They do not receive credentials.',
            ],
            pt: [
              'Armazenamento: os dados acima, exceto os tokens de autorização do TikTok, ficam num banco de dados no servidor do próprio operador, no Brasil, e não são vendidos. Os tokens ficam só no computador do operador e são enviados apenas ao TikTok.',
              'Cópias de segurança: toda noite uma cópia criptografada de todos os bancos de dados do servidor do próprio operador, os deste app e os de outros, é enviada ao Google Drive, na conta Google do próprio operador. A cópia é criptografada no nosso servidor antes de sair, inclusive os nomes dos arquivos. O Google Drive opera fora do Brasil, então a cópia sai do país.',
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
              'Everything else: deleted from our active systems within 30 days of revocation, the end of the service, or a verified request.',
              'Backups: the deletion above covers our active systems. Encrypted backup copies are kept so the system can be restored, and no disposal period is set for them, so deleted data can remain in them. The copies are encrypted and kept in a folder that only the operator and the server can open.',
            ],
            pt: [
              'Tokens: apagados assim que o criador revoga o acesso.',
              'Registros de publicação: guardados por no máximo 12 meses.',
              'Todo o resto: apagado dos nossos sistemas ativos em até 30 dias após a revogação, o fim do serviço ou um pedido verificado.',
              'Cópias de segurança: o apagamento acima vale para os nossos sistemas ativos. Cópias de segurança criptografadas são mantidas para permitir a restauração do sistema, e não há prazo de descarte definido para elas, então dados apagados podem continuar nelas. As cópias ficam criptografadas, numa pasta que só o operador e o servidor conseguem abrir.',
            ],
          },
        },
      ],
    },
  ],
}
