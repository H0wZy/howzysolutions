import type { Showcase } from './types'

/*
 * The /vvv/ showcase (spec 004). Only the page's own copy lives here: the
 * project's facts (period, commits, metrics) are read from
 * src/content/projects/vvv.ts, so the two pages cannot drift.
 *
 * Imported by src/entry-server.tsx and nothing on the client, which is what
 * keeps this prose out of the JavaScript budget (FR-002). The repository is
 * private, so nothing here links into it or names an account, a device, a
 * proxy or a spend figure (FR-004). Every command in the transcript is one the
 * vvv README documents.
 *
 * The artwork was generated in Google Flow (Nano Banana Pro) on 2026-09-27
 * from the prompts in specs/004-vvv-showcase/art-prompts.md, then flattened to
 * grayscale WebP under public/vvv/. Each slot is optional: remove one and the
 * page closes the gap.
 */
export const vvvShowcase: Showcase = {
  projectId: 'vvv',

  meta: {
    title: { en: 'vvv · Viral Video Visualizer', pt: 'vvv · Viral Video Visualizer' },
    description: {
      en: 'A CLI pipeline that turns a reference video into an original video package, and measures every result before it believes it.',
      pt: 'Pipeline CLI que transforma um vídeo de referência num pacote de vídeo original, e mede cada resultado antes de acreditar nele.',
    },
  },

  hero: {
    label: { en: 'overview', pt: 'visão_geral' },
    kicker: { en: 'vvv · private repository', pt: 'vvv · repositório privado' },
    title: {
      en: ['Video in.', 'Original out.', 'Measured', 'in between.'],
      pt: ['Entra vídeo.', 'Sai original.', 'Tudo medido', 'no caminho.'],
    },
    summary: {
      en: 'vvv (h3v on the command line) analyses a reference video and produces an original, production-ready package: the story, its character and visual bibles, image and animation prompts, narration, a measured cut and its caption. It serves a US storytelling account and a Brazilian TikTok Shop, and it never believes a result it has not measured.',
      pt: 'O vvv (h3v na linha de comando) analisa um vídeo de referência e produz um pacote original e pronto para produção: a história, suas character e visual bibles, prompts de imagem e animação, narração, um corte medido e sua legenda. Atende uma conta de storytelling nos EUA e uma loja no TikTok Shop Brasil, e nunca acredita num resultado que não mediu.',
    },
    art: {
      src: '/vvv/hero.webp',
      width: 720,
      height: 720,
      alt: {
        en: 'Engraving, white on black: a muse crowned with laurel floats diagonally, pulling two bundles of ruled lines that turn into strips of film, before a grid of film frames and a halo of fine rays.',
        pt: 'Gravura, branco sobre preto: uma musa coroada de louros flutua na diagonal, puxando dois feixes de linhas retas que viram tiras de filme, diante de uma grade de fotogramas e de um halo de raios finos.',
      },
    },
  },

  pipeline: {
    label: { en: 'the_pipeline', pt: 'o_pipeline' },
    heading: {
      en: 'One command per stage, three human steps.',
      pt: 'Um comando por estágio, três passos humanos.',
    },
    intro: {
      en: 'There is no single command from reference to post, on purpose. Each stage writes a file the next one checks, and three steps stay human: writing the story, generating the media through the MCP tools an agent calls, and deciding to post.',
      pt: 'Não existe comando único da referência ao post, de propósito. Cada estágio escreve um arquivo que o próximo checa, e três passos continuam humanos: escrever a história, gerar a mídia pelas ferramentas MCP que um agente chama, e decidir publicar.',
    },
    lines: [
      {
        command: 'h3v analyze ./reference.mp4',
        note: {
          en: 'scene map, keyframes and transcript, without sending every frame to a model',
          pt: 'mapa de cenas, keyframes e transcrição, sem mandar todo frame para um modelo',
        },
      },
      {
        command: 'h3v draft promote ./story_idea.json',
        note: {
          en: 'a story written in chat enters here, validated and unpaid',
          pt: 'uma história escrita no chat entra aqui, validada e sem custo',
        },
      },
      {
        command: 'h3v validate ./tiktok_project.json',
        note: {
          en: 'schema, timeline and prompts, checked offline before a credit is spent',
          pt: 'schema, linha do tempo e prompts, checados offline antes de gastar um crédito',
        },
      },
      {
        command: 'h3v render ./tiktok_project.json',
        note: {
          en: 'the ordered job list; the agent runs each job through MCP',
          pt: 'a lista ordenada de jobs; o agente executa cada um via MCP',
        },
      },
      {
        command: 'h3v verify-narration ./tiktok_project.json --plan ./render_plan.json',
        note: {
          en: 'every clip transcribed back and compared with its line, and its voice with the others',
          pt: 'cada clipe transcrito de volta e comparado com sua fala, e sua voz com as demais',
        },
      },
      {
        command: 'h3v concat ./tiktok_project.json --plan ./render_plan.json',
        note: {
          en: 'one file, levels matched, captions burned in on the storytelling account',
          pt: 'um arquivo, níveis igualados, legendas gravadas na conta de storytelling',
        },
      },
      {
        command: 'h3v publish check ./tiktok_project.json --video ./final.mp4 --profile ./publishing_profile.json',
        note: {
          en: 'ready or blocked, every finding marked verified or attested; it never posts',
          pt: 'pronto ou bloqueado, cada achado marcado como verificado ou atestado; nunca publica',
        },
      },
    ],
  },

  stages: {
    label: { en: 'what_it_does', pt: 'o_que_faz' },
    heading: {
      en: 'Six stages, each one checked before the next.',
      pt: 'Seis estágios, cada um checado antes do próximo.',
    },
    items: [
      {
        verb: { en: 'analyse', pt: 'analisar' },
        heading: { en: 'Read the reference', pt: 'Ler a referência' },
        body: {
          en: 'Scene changes, visual similarity and transcript boundaries pick the frames worth looking at. What gets extracted is the structure: pacing, beats, archetypes, the twist.',
          pt: 'Mudanças de cena, similaridade visual e limites da transcrição escolhem os frames que valem ser vistos. O que se extrai é a estrutura: ritmo, beats, arquétipos, a virada.',
        },
      },
      {
        verb: { en: 'write', pt: 'escrever' },
        heading: { en: 'Write an original story', pt: 'Escrever uma história original' },
        body: {
          en: 'The reference lends its mechanics, never its plot: a new hook, open loops, a twist between 55% and 75% of the runtime, a payoff and a moral.',
          pt: 'A referência empresta a mecânica, nunca o enredo: um gancho novo, open loops, uma virada entre 55% e 75% da duração, um desfecho e uma moral.',
        },
      },
      {
        verb: { en: 'fix', pt: 'fixar' },
        heading: { en: 'Fix who everyone is', pt: 'Fixar quem é quem' },
        body: {
          en: 'A character bible holds each face, age and wardrobe; a visual bible holds the light, the lens and the palette. Every prompt reuses them word for word.',
          pt: 'Uma character bible guarda o rosto, a idade e o figurino de cada personagem; uma visual bible guarda a luz, a lente e a paleta. Todo prompt as reusa palavra por palavra.',
        },
      },
      {
        verb: { en: 'prompt', pt: 'descrever' },
        heading: { en: 'Two prompts per scene', pt: 'Dois prompts por cena' },
        body: {
          en: 'The image prompt defines the visual state; the animation prompt defines what changes over time. Collapsing the two is how characters drift.',
          pt: 'O prompt de imagem define o estado visual; o de animação define o que muda no tempo. Juntar os dois é como os personagens derivam.',
        },
      },
      {
        verb: { en: 'generate', pt: 'gerar' },
        heading: { en: 'Generate through the agent', pt: 'Gerar pelo agente' },
        body: {
          en: 'h3v plans the jobs and records what comes back; the agent calls the image and video models through MCP. h3v holds no provider credential, so it cannot pretend to have called one.',
          pt: 'O h3v planeja os jobs e registra o que volta; o agente chama os modelos de imagem e vídeo via MCP. O h3v não guarda credencial de provedor, então não pode fingir que chamou um.',
        },
      },
      {
        verb: { en: 'assemble', pt: 'montar' },
        heading: { en: 'Assemble what was measured', pt: 'Montar o que foi medido' },
        body: {
          en: 'Clips are decoded and timed, the narration is read back, levels are matched, captions are burned in, and a gate says ready or blocked before anyone posts.',
          pt: 'Clipes são decodificados e cronometrados, a narração é lida de volta, os níveis são igualados, as legendas são gravadas, e um portão diz pronto ou bloqueado antes de alguém publicar.',
        },
      },
    ],
  },

  rule: {
    label: { en: 'the_rule', pt: 'a_regra' },
    heading: {
      en: 'A result is measured before it is believed.',
      pt: 'Um resultado é medido antes de ser acreditado.',
    },
    body: {
      en: 'AI providers report success generously. A job marked completed can point at a picture instead of a video, a clip can come back shorter than it was asked to be, and a take can say the right words in a second actor’s voice. The first and the last of those happened here, before a check existed for them.',
      pt: 'Provedores de IA reportam sucesso com generosidade. Um job marcado como completo pode apontar para uma imagem em vez de um vídeo, um clipe pode voltar mais curto do que foi pedido, e um take pode dizer as palavras certas com a voz de outro ator. O primeiro e o último caso aconteceram aqui, antes de existir uma checagem para eles.',
    },
    points: {
      en: [
        '`record` decodes every returned file. One that is not a readable video becomes missing; one that is has its measured duration recorded in place of the claimed one.',
        '`assemble` totals measured durations, not requested ones, and warns when the gap passes one second.',
        '`verify-narration` transcribes each clip locally and compares it with its line, then flags a clip whose median pitch drifts two semitones from the cut’s, and blocks at three.',
        '`compose verify` measures how much a product photograph changed inside the region a model was told to preserve, because the product in a Shop video has to be the real one.',
        '`publish check` labels every finding verified, when it measured the file itself, or attested, when a person asserted it. Presenting one as the other would be fabricated verification.',
      ],
      pt: [
        'O `record` decodifica todo arquivo devolvido. O que não é vídeo legível vira ausente; o que é tem a duração medida gravada no lugar da declarada.',
        'O `assemble` soma durações medidas, não pedidas, e avisa quando a diferença passa de um segundo.',
        'O `verify-narration` transcreve cada clipe localmente e compara com sua fala, depois sinaliza o clipe cujo pitch mediano se afasta dois semitons do corte, e bloqueia a partir de três.',
        'O `compose verify` mede quanto uma foto de produto mudou dentro da região que o modelo foi instruído a preservar, porque o produto num vídeo de Shop tem de ser o real.',
        'O `publish check` rotula cada achado como verificado, quando mediu o próprio arquivo, ou atestado, quando uma pessoa afirmou. Apresentar um como o outro seria verificação fabricada.',
      ],
    },
    art: {
      src: '/vvv/rule.webp',
      width: 1376,
      height: 768,
      alt: {
        en: 'Engraving, white on black: Lachesis, the Fate who measures, seated in profile, sets drafting dividers on a strip of film that crosses the whole image.',
        pt: 'Gravura, branco sobre preto: Láquesis, a Moira que mede, sentada de perfil, apoia um compasso numa tira de filme que atravessa a imagem inteira.',
      },
    },
  },

  lanes: {
    label: { en: 'two_accounts', pt: 'duas_contas' },
    art: {
      src: '/vvv/lanes.webp',
      width: 1376,
      height: 768,
      alt: {
        en: 'Engraving, white on black: a bust of two-faced Janus in a stone arch, one face looking left and one right, each sending a bundle of rays towards its own edge.',
        pt: 'Gravura, branco sobre preto: um busto de Jano, de duas faces, num arco de pedra, uma olhando para a esquerda e outra para a direita, cada uma lançando um feixe de raios para a sua borda.',
      },
    },
    heading: { en: 'One pipeline, two different businesses.', pt: 'Um pipeline, dois negócios diferentes.' },
    items: [
      {
        name: { en: 'US storytelling', pt: 'Storytelling nos EUA' },
        body: {
          en: 'Emotional stories of 65 to 90 seconds in native American English, assembled from short clips. The viewer pays in attention, and the video is finished when they feel something. It is posted by hand, after the gate says ready.',
          pt: 'Histórias emocionais de 65 a 90 segundos em inglês americano nativo, montadas a partir de clipes curtos. O espectador paga com atenção, e o vídeo termina quando ele sente algo. É publicado à mão, depois que o portão diz pronto.',
        },
      },
      {
        name: { en: 'Brazilian TikTok Shop', pt: 'TikTok Shop Brasil' },
        body: {
          en: 'Product videos in Brazilian Portuguese that must depict the real product, down to the brand printed on it, and end in one clear ask. They pass product, claim and compliance checks; the publishing path runs through TikTok Shop’s own API (upload, TikTok’s precheck, post, status) and is built and tested, with no live post recorded yet. In a LIVE, the machine prepares the host and never speaks.',
          pt: 'Vídeos de produto em português que precisam mostrar o produto real, até a marca impressa nele, e terminar num pedido claro. Passam por checagens de produto, alegação e compliance; o caminho de publicação usa a API do próprio TikTok Shop (upload, a pré-checagem do TikTok, post, status) e está construído e testado, sem post real registrado ainda. Numa LIVE, a máquina prepara o apresentador e nunca fala.',
        },
      },
    ],
  },

  numbers: {
    label: { en: 'measured', pt: 'medido' },
    heading: { en: 'Counted, not recalled.', pt: 'Contado, não lembrado.' },
    note: {
      en: 'Counted in the repository on 2026-09-27. The project record shows the same figures.',
      pt: 'Contado no repositório em 27/09/2026. O registro do projeto mostra os mesmos números.',
    },
  },

  faq: {
    label: { en: 'questions', pt: 'perguntas' },
    heading: { en: 'What a reader asks first.', pt: 'O que se pergunta primeiro.' },
    items: [
      {
        question: { en: 'Is the code public?', pt: 'O código é público?' },
        answer: {
          en: 'No. The repository is private, so this page summarises what the project does and links to nothing inside it. The project record has the longer account, and the numbers here were counted in the repository itself.',
          pt: 'Não. O repositório é privado, então esta página resume o que o projeto faz e não aponta para nada dentro dele. O registro do projeto tem o relato mais longo, e os números daqui foram contados no próprio repositório.',
        },
      },
      {
        question: { en: 'Does it post by itself?', pt: 'Ele publica sozinho?' },
        answer: {
          en: 'Not on the storytelling account: the gate reports ready or blocked, and a person posts. On the Shop account, the path through TikTok’s API is built and tested against a fake client; it runs only when the operator confirms or schedules a job, and no live post has been recorded yet.',
          pt: 'Não na conta de storytelling: o portão reporta pronto ou bloqueado, e uma pessoa publica. Na conta de Shop, o caminho pela API do TikTok está construído e testado contra um cliente falso; só roda quando o operador confirma ou agenda um job, e nenhum post real foi registrado ainda.',
        },
      },
      {
        question: {
          en: 'Why is there no single command from video to post?',
          pt: 'Por que não existe um comando único do vídeo ao post?',
        },
        answer: {
          en: 'Three stages make paid model calls, and a chain that runs end to end spends money on its own mistakes. Driving it stage by stage puts a checked file, not a hope, between every paid step.',
          pt: 'Três estágios fazem chamadas pagas a modelos, e uma cadeia que roda de ponta a ponta gasta dinheiro com os próprios erros. Conduzir estágio a estágio põe um arquivo checado, não uma esperança, entre cada passo pago.',
        },
      },
      {
        question: { en: 'Does it promise reach or monetisation?', pt: 'Ele promete alcance ou monetização?' },
        answer: {
          en: 'No. No hashtag, duration, resolution or model produces reach, and a video longer than a minute does not guarantee payment. The pipeline makes each attempt cheaper and more honest; what the platform does afterwards is up to the platform.',
          pt: 'Não. Nenhuma hashtag, duração, resolução ou modelo produz alcance, e um vídeo com mais de um minuto não garante pagamento. O pipeline deixa cada tentativa mais barata e mais honesta; o que a plataforma faz depois é com a plataforma.',
        },
      },
    ],
  },
}
