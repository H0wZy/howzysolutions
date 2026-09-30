import type { Localized } from './i18n/types'
import type { ShowcaseArt } from './types'

/*
 * The /vvv/live/ page (vvv spec 039, FR-043): the live console, presented.
 *
 * A static document like /vvv/, imported by src/entry-server.tsx and nothing on
 * the client. It collects no data and loads nothing from another origin: every
 * image is a file under public/vvv/live/, and the only link that leaves the
 * site is the one to the console, which sends nothing until it is followed.
 * The page does not depend on the console being up.
 *
 * The screenshots were taken from a local build of the console with a test
 * shop and made-up numbers. Nothing here promises reach, sales or income, and
 * nothing describes a feature as avoiding TikTok's detection (vvv spec 039
 * FR-042).
 */

/** Where "sign in" goes. A plain link: nothing is requested until it is followed. */
export const CONSOLE_URL = 'https://vvv.howzysolutions.com/live/'
export const CONSOLE_PRIVACY_URL = 'https://vvv.howzysolutions.com/live/legal/privacidade'

type Shot = ShowcaseArt & { caption: Localized }

export const vvvLive = {
  projectId: 'vvv',

  meta: {
    title: { en: 'vvv live · Live console for TikTok Shop', pt: 'vvv live · Console de live para TikTok Shop' },
    description: {
      en: 'A console for TikTok Shop sellers who run lives: numbers, product pins, chat texts and the timer in one panel, by invitation.',
      pt: 'Um console para vendedores do TikTok Shop que fazem lives: números, fixação de produtos, textos do chat e cronômetro num só painel, por convite.',
    },
  },

  hero: {
    label: { en: 'overview', pt: 'visão_geral' },
    kicker: { en: 'vvv · live console', pt: 'vvv · console de live' },
    title: {
      en: ['Your live,', 'in one panel.'],
      pt: ['Sua live,', 'num só painel.'],
    },
    summary: {
      en: 'A console for TikTok Shop sellers who run lives. A small Chrome extension reads the LIVE Manager page and carries out what you set up. Everything else runs on the server, so the computer that broadcasts installs nothing more. Access is by invitation, one shop at a time.',
      pt: 'Um console para vendedores do TikTok Shop que fazem lives. Uma pequena extensão do Chrome lê a página do Gerenciador de LIVE e executa o que você configurou. O resto roda no servidor, então o computador que transmite não instala mais nada. O acesso é por convite, uma loja de cada vez.',
    },
    signIn: { en: 'Sign in', pt: 'Entrar' },
    signInNote: {
      en: 'The link leaves this site. Nothing is sent before you follow it.',
      pt: 'O link sai deste site. Nada é enviado antes de você segui-lo.',
    },
    art: {
      src: '/vvv/live/dashboard.webp',
      width: 1170,
      height: 410,
      alt: {
        en: 'The console dashboard for a test shop: three cards showing sales and revenue for today, yesterday and the last seven days, and a row of links to lives, clips, devices, account and log.',
        pt: 'O painel do console para uma loja de teste: três cartões com vendas e faturamento de hoje, ontem e dos últimos sete dias, e uma linha de links para lives, clipes, dispositivos, conta e registro.',
      },
    } satisfies ShowcaseArt,
  },

  does: {
    label: { en: 'what_it_does', pt: 'o_que_faz' },
    heading: { en: 'Six jobs during a live.', pt: 'Seis tarefas durante a live.' },
    items: [
      {
        verb: { en: 'read', pt: 'ler' },
        heading: { en: 'The numbers, as they change', pt: 'Os números, conforme mudam' },
        body: {
          en: 'Viewers, revenue, sales and items sold are read from the LIVE Manager page every two seconds and shown in the panel. A number it cannot read is shown as unreadable, never as zero.',
          pt: 'Espectadores, faturamento, vendas e itens vendidos são lidos da página do Gerenciador de LIVE a cada dois segundos e mostrados no painel. Um número que não dá para ler aparece como ilegível, nunca como zero.',
        },
      },
      {
        verb: { en: 'pin', pt: 'fixar' },
        heading: { en: 'Products, on a cycle you choose', pt: 'Produtos, num ciclo que você escolhe' },
        body: {
          en: 'List the products in the order of the LIVE Manager and how often the next one is pinned. The cycle keeps running from what is saved on the computer if the connection drops.',
          pt: 'Liste os produtos na ordem do Gerenciador de LIVE e de quanto em quanto tempo o próximo é fixado. O ciclo continua com o que está guardado no computador se a conexão cair.',
        },
      },
      {
        verb: { en: 'chat', pt: 'chat' },
        heading: { en: 'Only the texts the shop wrote', pt: 'Só os textos que a loja escreveu' },
        body: {
          en: 'A thank-you for each purchase and a few messages at random intervals, posted exactly as written and only after the shop confirms them. Names containing a blocked keyword can be blocked.',
          pt: 'Um agradecimento a cada compra e algumas mensagens em intervalos aleatórios, postados exatamente como escritos e só depois de a loja confirmá-los. Nomes com uma palavra bloqueada podem ser bloqueados.',
        },
      },
      {
        verb: { en: 'clips', pt: 'clipes' },
        heading: { en: 'The seller’s own clips', pt: 'Os clipes do próprio vendedor' },
        body: {
          en: 'Clips recorded by the seller can be played into a virtual microphone, in an order that does not repeat until all have played. Read the notice below before using them.',
          pt: 'Clipes gravados pelo próprio vendedor podem ser tocados num microfone virtual, numa ordem que não repete até todos tocarem. Leia o aviso abaixo antes de usá-los.',
        },
      },
      {
        verb: { en: 'end', pt: 'encerrar' },
        heading: { en: 'A timer, and a confirmation', pt: 'Um cronômetro, e uma confirmação' },
        body: {
          en: 'The live can end at a time you set. Ending it by hand asks for confirmation first.',
          pt: 'A live pode terminar na hora que você definir. Encerrar à mão pede confirmação antes.',
        },
      },
      {
        verb: { en: 'review', pt: 'revisar' },
        heading: { en: 'A summary afterwards', pt: 'Um resumo depois' },
        body: {
          en: 'Sales, revenue, average ticket, peak viewers, pins, blocks, TikTok warnings and the questions viewers asked most, kept for every live.',
          pt: 'Vendas, faturamento, ticket médio, pico de espectadores, fixações, bloqueios, avisos do TikTok e as perguntas mais feitas, guardados de cada live.',
        },
      },
    ],
  },

  shots: {
    label: { en: 'screens', pt: 'telas' },
    heading: { en: 'What the panel looks like.', pt: 'Como é o painel.' },
    note: {
      en: 'Screenshots of a test shop with made-up numbers.',
      pt: 'Capturas de uma loja de teste com números inventados.',
    },
    items: [
      {
        src: '/vvv/live/newlive.webp',
        width: 920,
        height: 528,
        alt: {
          en: 'The new live form: the computer to use, the products to pin one per line, how often to pin the next, and when to end the live.',
          pt: 'O formulário de nova live: o computador a usar, os produtos a fixar um por linha, de quanto em quanto tempo fixar o próximo e quando encerrar a live.',
        },
        caption: { en: 'Setting up a live', pt: 'Configurando uma live' },
      },
      {
        src: '/vvv/live/summary.webp',
        width: 920,
        height: 385,
        alt: {
          en: 'The summary of a finished live: sales, revenue, average ticket and peak viewers, the count of pins and blocks, and the three questions viewers asked most.',
          pt: 'O resumo de uma live encerrada: vendas, faturamento, ticket médio e pico de espectadores, a contagem de fixações e bloqueios, e as três perguntas mais feitas.',
        },
        caption: { en: 'After the live', pt: 'Depois da live' },
      },
    ] satisfies Shot[],
  },

  notice: {
    label: { en: 'read_this_first', pt: 'leia_primeiro' },
    heading: { en: 'TikTok’s rule on recorded voice.', pt: 'A regra do TikTok sobre voz gravada.' },
    body: {
      en: 'The console shows the following notice to every shop before its first live, and again in its settings.',
      pt: 'O console mostra o aviso a seguir a toda loja antes da primeira live, e de novo nas configurações.',
    },
    points: {
      en: [
        'TikTok Shop’s rules prohibit recorded voice on a sales live. The speech has to come from a person, live. That includes recordings of your own voice played in sequence.',
        'TikTok detects recorded audio on lives automatically. The consequence can go from a warning and a suspended live to a restricted or removed shop account, and account health only recovers through completed orders.',
        'The console plays the seller’s own recorded voice if the seller chooses to use clips. Nothing in it hides that from TikTok or claims to avoid detection. Using clips is the seller’s decision, taken with that risk.',
        'Nothing on this page or in the console promises reach, sales or income.',
      ],
      pt: [
        'As regras do TikTok Shop proíbem voz gravada numa live de venda. A fala tem que ser de uma pessoa, ao vivo. Isso inclui gravações da sua própria voz tocadas em sequência.',
        'O TikTok detecta áudio gravado em lives automaticamente. A consequência pode ir de um aviso e uma live suspensa até uma conta de loja restrita ou removida, e a saúde da conta só se recupera com pedidos concluídos.',
        'O console toca a voz gravada do próprio vendedor se o vendedor escolher usar clipes. Nada nele esconde isso do TikTok nem promete evitar a detecção. Usar clipes é uma decisão do vendedor, tomada com esse risco.',
        'Nada nesta página nem no console promete alcance, vendas ou renda.',
      ],
    },
    art: {
      src: '/vvv/live/notice.webp',
      width: 915,
      height: 470,
      alt: {
        en: 'The notice inside the console, in Portuguese: a box explaining that TikTok Shop prohibits recorded voice on a sales live, and a button to confirm it was read.',
        pt: 'O aviso dentro do console: uma caixa explicando que o TikTok Shop proíbe voz gravada numa live de venda, e um botão para confirmar a leitura.',
      },
    } satisfies ShowcaseArt,
  },

  privacy: {
    label: { en: 'this_page', pt: 'esta_página' },
    heading: { en: 'This page collects nothing.', pt: 'Esta página não coleta nada.' },
    body: {
      en: 'It has no form, sets no cookie, runs no analytics and loads no script, font or image from another site. It renders on its own, whether or not the console is running. The console has its own privacy policy, which says what it collects once you sign in.',
      pt: 'Não tem formulário, não define cookie, não roda analytics e não carrega script, fonte ou imagem de outro site. Ela abre sozinha, com o console no ar ou não. O console tem a própria política de privacidade, que diz o que ele coleta depois que você entra.',
    },
    policy: { en: 'Console privacy policy', pt: 'Política de privacidade do console' },
  },

  faq: {
    label: { en: 'faq', pt: 'perguntas' },
    heading: { en: 'Questions.', pt: 'Perguntas.' },
    items: [
      {
        question: { en: 'Who can use it?', pt: 'Quem pode usar?' },
        answer: {
          en: 'Only people invited by a shop’s owner. There is no open sign-up. Each person sees only the shops they belong to, and sign-in asks for a password and a code from an authenticator app.',
          pt: 'Só quem foi convidado pelo dono de uma loja. Não há cadastro aberto. Cada pessoa vê apenas as lojas de que faz parte, e a entrada pede senha e um código de um aplicativo autenticador.',
        },
      },
      {
        question: { en: 'What is installed on the computer that broadcasts?', pt: 'O que se instala no computador que transmite?' },
        answer: {
          en: 'A Chrome extension, and a virtual audio cable if you use clips. The extension connects out to the server, so no port is opened on your network, and it carries out a fixed set of actions: pin a product, post a text, block a name, end the live, play a clip.',
          pt: 'Uma extensão do Chrome, e um cabo de áudio virtual se você usar clipes. A extensão se conecta ao servidor de dentro para fora, então nenhuma porta é aberta na sua rede, e executa um conjunto fixo de ações: fixar um produto, postar um texto, bloquear um nome, encerrar a live, tocar um clipe.',
        },
      },
      {
        question: { en: 'What if the connection drops?', pt: 'E se a conexão cair?' },
        answer: {
          en: 'The pin cycle, the timer and the clips keep running from what is saved on the computer. The panel says it is offline, and the history is sent when the connection returns.',
          pt: 'O ciclo de fixação, o cronômetro e os clipes continuam com o que está guardado no computador. O painel avisa que está offline, e o histórico é enviado quando a conexão volta.',
        },
      },
      {
        question: { en: 'Is it made by TikTok?', pt: 'É feito pelo TikTok?' },
        answer: {
          en: 'No. It is an independent project of H0wZy and is not affiliated with or endorsed by TikTok.',
          pt: 'Não. É um projeto independente de H0wZy e não é afiliado nem endossado pelo TikTok.',
        },
      },
    ],
  },
}
