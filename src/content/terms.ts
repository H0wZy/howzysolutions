import type { LegalDocument } from './types'

/**
 * The terms of service of H0wZy Solutions, served at /terms-of-service/.
 *
 * Same shape as the privacy policy and rendered by the same page: the general
 * terms, then one block per app. An app's block keeps a stable `id`, so
 * /terms-of-service/#vvv is an anchor and /terms-of-service/vvv/ is that same
 * block on a page of its own. The per-app URL is what a store asks for when it
 * reviews one app, which TikTok Partner Center and Google both do.
 *
 * The app was renamed from `viralvideogen` to `vvv`. Partner Center still
 * carries the old name, so the record says so once, in prose, and the old URL
 * 301s to the new one (public/_redirects). The privacy policy's own rename is
 * a separate change; until it lands its anchor is still #viralvideogen, which
 * is why the app page links that policy rather than a fragment of it.
 *
 * The contact is the profile's email contact rather than a second copy of the
 * address, so the two cannot drift apart.
 *
 * Nothing here invents a registration number, a price, an SLA or a refund
 * rule, and nothing claims a consumer right that the Consumer Protection Code
 * and the LGPD do not already give.
 */
export const terms: LegalDocument = {
  updated: '2026-09-22',

  intro: {
    en: 'The terms under which this website is published and may be used.',
    pt: 'Os termos sob os quais este site é publicado e pode ser usado.',
  },

  sections: [
    {
      id: 'what-this-is',
      heading: { en: 'What this site is', pt: 'O que é este site' },
      body: {
        en: [
          'howzysolutions.com is the portfolio of H0wZy Solutions, a one-person company in Londrina, Brazil, run by Marcos "H0wZy" Junior. It shows completed work, the tools behind it and the professional record of its author.',
          'Nothing is sold here and no account is offered. Using the site means accepting these terms. An app listed below is also covered by its own section.',
        ],
        pt: [
          'O howzysolutions.com é o portfólio da H0wZy Solutions, uma empresa de uma pessoa só, em Londrina, Brasil, tocada por Marcos "H0wZy" Junior. Ele mostra trabalhos concluídos, as ferramentas por trás deles e o histórico profissional do autor.',
          'Nada é vendido aqui e nenhuma conta é oferecida. Usar o site significa aceitar estes termos. Um app listado abaixo também é regido pela seção dele.',
        ],
      },
    },
    {
      id: 'acceptable-use',
      heading: { en: 'Acceptable use', pt: 'Uso aceitável' },
      body: {
        en: [
          'You may read this site, link to it and quote it with credit. Please do not attack it, do not collect from it by automated means at a rate that degrades it for other readers, and do not present the work shown here as your own.',
        ],
        pt: [
          'Você pode ler este site, criar links para ele e citá-lo dando crédito. Por favor não ataque o site, não colete dados dele por meios automatizados num ritmo que o degrade para outros leitores, e não apresente como seu o trabalho mostrado aqui.',
        ],
      },
    },
    {
      id: 'content-and-code',
      heading: { en: 'Content and code', pt: 'Conteúdo e código' },
      body: {
        en: [
          'The text, images and code samples on this site belong to their author. Code published under an open licence keeps that licence, which is stated with the code itself.',
          'Names, logos and trademarks of other companies belong to their owners and appear here only to identify the work they were used in.',
        ],
        pt: [
          'Os textos, imagens e trechos de código deste site pertencem ao seu autor. O código publicado sob licença aberta mantém essa licença, que é declarada junto do próprio código.',
          'Nomes, logotipos e marcas de outras empresas pertencem aos seus donos e aparecem aqui apenas para identificar o trabalho em que foram usados.',
        ],
      },
    },
    {
      id: 'no-warranty',
      heading: { en: 'Provided as is', pt: 'Fornecido como está' },
      body: {
        en: [
          'This site is provided as is, with no warranty of any kind. Its pages, figures and project records may be corrected, changed or taken offline at any time, without notice.',
        ],
        pt: [
          'Este site é fornecido como está, sem garantia de nenhum tipo. Suas páginas, seus números e seus registros de projeto podem ser corrigidos, alterados ou tirados do ar a qualquer momento, sem aviso.',
        ],
      },
    },
    {
      id: 'external-links',
      heading: { en: 'External links', pt: 'Links externos' },
      body: {
        en: [
          "Links to repositories, clients and other sites are references, not endorsements. What happens on another site is governed by that site's own terms, not by these.",
        ],
        pt: [
          'Links para repositórios, clientes e outros sites são referências, não recomendações. O que acontece em outro site é regido pelos termos daquele site, não por estes.',
        ],
      },
    },
    {
      id: 'privacy',
      heading: { en: 'Privacy', pt: 'Privacidade' },
      body: {
        en: [
          'How personal data is handled is described in the privacy policy, at /privacy-policy/. That page is part of these terms.',
        ],
        pt: [
          'O tratamento de dados pessoais está descrito na política de privacidade, em /privacy-policy/. Aquela página faz parte destes termos.',
        ],
      },
    },
    {
      id: 'changes',
      heading: { en: 'Changes', pt: 'Mudanças' },
      body: {
        en: [
          'These terms may change. The date at the top of this page moves when they do, and using the site after that means accepting the version then published.',
        ],
        pt: [
          'Estes termos podem mudar. A data no topo desta página muda junto, e usar o site depois disso significa aceitar a versão publicada naquele momento.',
        ],
      },
    },
    {
      id: 'applicable-law',
      heading: { en: 'Applicable law', pt: 'Lei aplicável' },
      body: {
        en: [
          'These terms are governed by Brazilian law, and the courts of Londrina, Paraná are the forum for any dispute arising from them.',
          'Rights granted by the Consumer Protection Code (Lei 8.078/1990) and by the LGPD (Lei 13.709/2018) are not affected by anything written here.',
        ],
        pt: [
          'Estes termos são regidos pela lei brasileira, e o foro de Londrina, Paraná é o competente para qualquer disputa decorrente deles.',
          'Os direitos garantidos pelo Código de Defesa do Consumidor (Lei 8.078/1990) e pela LGPD (Lei 13.709/2018) não são afetados por nada escrito aqui.',
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
          "vvv (Viral Video Visualizer) is the tool H0wZy Solutions uses to publish product videos to a TikTok Shop creator account and to keep that account's showcase, the list of products the creator promotes, up to date. It runs on the operator's computer, has no website or sign-up of its own, and works only for creator accounts that have authorized it in TikTok Shop. It is not offered to the public.",
          "The app is registered in TikTok Shop's Partner Center under its former name, viralvideogen.",
        ],
        pt: [
          'O vvv (Viral Video Visualizer) é a ferramenta que a H0wZy Solutions usa para publicar vídeos de produto numa conta de criador do TikTok Shop e manter atualizada a vitrine dessa conta, a lista de produtos que o criador divulga. Ele roda no computador do operador, não tem site nem cadastro próprio e só funciona para contas de criador que o autorizaram no TikTok Shop. Não é oferecido ao público.',
          'O app está registrado no Partner Center do TikTok Shop sob o nome anterior, viralvideogen.',
        ],
      },
      sections: [
        {
          id: 'vvv-who',
          heading: { en: 'Who may use it', pt: 'Quem pode usar' },
          body: {
            en: [
              'The app is used by its operator, on accounts he controls. There is no account to create and nothing to pay: no plan, no subscription and no refund to claim.',
            ],
            pt: [
              'O app é usado pelo operador, em contas que ele mesmo controla. Não há conta para criar nem nada a pagar: sem plano, sem assinatura e sem reembolso a pedir.',
            ],
          },
        },
        {
          id: 'vvv-authorization',
          heading: { en: 'Authorization', pt: 'Autorização' },
          body: {
            en: [
              'The app acts for a creator account only while that account has authorized it in TikTok Shop, and only within the scopes granted there. The creator can withdraw that authorization at any time, in TikTok Shop, and the app then stops acting for the account.',
            ],
            pt: [
              'O app age por uma conta de criador só enquanto essa conta o tiver autorizado no TikTok Shop, e só dentro dos escopos concedidos ali. O criador pode retirar a autorização a qualquer momento, no TikTok Shop, e o app deixa de agir pela conta.',
            ],
          },
        },
        {
          id: 'vvv-conduct',
          heading: { en: 'Content and platform rules', pt: 'Conteúdo e regras da plataforma' },
          body: {
            en: [
              "What the app publishes is the operator's own responsibility and is subject to TikTok's rules, including the disclosure of AI generated content. The app cannot guarantee that a post is accepted, distributed or monetized.",
            ],
            pt: [
              'O que o app publica é responsabilidade do próprio operador e está sujeito às regras do TikTok, inclusive a sinalização de conteúdo gerado por IA. O app não garante que uma publicação seja aceita, distribuída ou monetizada.',
            ],
          },
        },
        {
          id: 'vvv-warranty',
          heading: { en: 'No warranty', pt: 'Sem garantia' },
          body: {
            en: [
              'The app is provided as is, with no warranty and no service level. It depends on interfaces run by other companies, which may change or stop, and it may be changed or discontinued at any time.',
            ],
            pt: [
              'O app é fornecido como está, sem garantia e sem nível de serviço. Ele depende de interfaces mantidas por outras empresas, que podem mudar ou parar, e pode ser alterado ou descontinuado a qualquer momento.',
            ],
          },
        },
      ],
    },
  ],
}
