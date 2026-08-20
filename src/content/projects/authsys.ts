import type { Project } from '../types'

/**
 * FR-003 names this record explicitly: it MUST read as a study skeleton and MUST NOT
 * read as a working authentication system. The schema test asserts both fields.
 */
export const authsys: Project = {
  id: 'authsys',
  name: 'authsys',
  kind: 'study',
  state: 'skeleton',
  period: { start: '2026-08-03', end: '2026-08-08' },
  commits: 6,
  wakatimeProject: 'authsys',

  summary: {
    en: 'A Go authentication API at skeleton stage — the same domain I hardened in production in .NET, rewritten to learn the language against a problem I already knew.',
    pt: 'Uma API de autenticação em Go em estágio de esqueleto — o mesmo domínio que endureci em produção em .NET, reescrito para aprender a linguagem contra um problema que eu já conhecia.',
  },

  problem: {
    en: 'Learning Go. Not a product: the fastest way to separate what is the language from what is the problem is to rewrite a domain you already understand, so I picked the auth work I had already taken to production in .NET on Telas Paraná.',
    pt: 'Aprender Go. Não é produto: o jeito mais rápido de separar o que é a linguagem do que é o problema é reescrever um domínio que você já entende, então peguei o trabalho de auth que eu já tinha levado à produção em .NET no Telas Paraná.',
  },

  capabilities: {
    en: [
      'The community-standard Go layout with clean layering — handler, service, repository, model — plus DTOs, JWT, response and configuration packages, and manual dependency injection with no container.',
      'The user model embeds an account structure carrying the security vocabulary: online state, last login and logout, failed attempt count, lock expiry and disabled flag. The structure for lockout and disabled accounts exists in the schema.',
      'The password field is tagged so it can never appear in a response.',
      'Three routes: create user, login, logout.',
    ],
    pt: [
      'O layout padrão da comunidade Go com separação limpa em camadas — handler, service, repository, model — mais pacotes de DTO, JWT, resposta e configuração, e injeção de dependência manual sem container.',
      'O model de usuário embute uma estrutura de conta com o vocabulário de segurança: estado online, último login e logout, contagem de tentativas falhas, expiração do bloqueio e flag de conta desabilitada. A estrutura para lockout e conta desabilitada existe no schema.',
      'O campo de senha é marcado de forma que nunca pode sair numa resposta.',
      'Três rotas: criar usuário, login, logout.',
    ],
  },

  stack: [{ group: 'backend', items: ['go', 'gin', 'gorm', 'postgres', 'jwt'] }],

  development: {
    en: [
      'Six commits over five days, reading as what it is: a language exercise against a familiar domain, not an attempt at a shippable service.',
      'The value is in the comparison. Having built and hardened this exact domain in .NET — Argon2id, refresh-token rotation with reuse detection, timing-attack mitigation — rewriting the skeleton in Go isolates the language from the problem.',
    ],
    pt: [
      'Seis commits em cinco dias, lendo como o que é: um exercício de linguagem contra um domínio familiar, não uma tentativa de serviço entregável.',
      'O valor está na comparação. Tendo construído e endurecido exatamente esse domínio em .NET — Argon2id, rotação de refresh token com detecção de reuso, mitigação de timing attack —, reescrever o esqueleto em Go isola a linguagem do problema.',
    ],
  },

  limitations: {
    en: [
      'This is a skeleton, not a system. Saying so plainly is the point of the entry.',
      'The authentication middleware file contains only its package declaration. The middleware does not exist, and no route is protected.',
      'The Makefile is empty.',
      'There are no tests.',
      'The lockout and disabled-account fields exist in the model, but nothing reads or writes them yet — the schema anticipates behaviour that is not implemented.',
    ],
    pt: [
      'Isto é um esqueleto, não um sistema. Dizer isso com todas as letras é o ponto da entrada.',
      'O arquivo de middleware de autenticação contém apenas a declaração de pacote. O middleware não existe, e nenhuma rota é protegida.',
      'O Makefile está vazio.',
      'Não há testes.',
      'Os campos de lockout e conta desabilitada existem no model, mas nada os lê ou escreve ainda — o schema antecipa um comportamento que não está implementado.',
    ],
  },
}
