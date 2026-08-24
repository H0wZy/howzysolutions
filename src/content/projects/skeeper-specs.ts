import type { Project } from '../types'

export const skeeperSpecs: Project = {
  id: 'skeeper-specs',
  name: 'skeeper-specs',
  kind: 'tooling',
  state: 'functional',
  period: { start: '2026-08-14', end: '2026-08-16' },
  commits: 2,
  wakatimeProject: 'skeeper-specs',

  summary: {
    en: 'A tool-written sidecar repository mirroring specifications out of the code repositories, so a code review is not buried under eight spec files.',
    pt: 'Um repositório sidecar escrito por ferramenta que espelha specs para fora dos repositórios de código, para uma revisão de código não ficar soterrada em oito arquivos de spec.',
  },

  problem: {
    en: 'A pull request carrying code plus eight specification files is a pull request nobody reviews properly. The specification needs to leave the review path without losing its history.',
    pt: 'Um pull request que carrega código mais oito arquivos de spec é um pull request que ninguém revisa direito. A especificação precisa sair do caminho da revisão sem perder o histórico.',
  },

  capabilities: {
    en: [
      'Content organised by namespace, one per source project, each published on its own branch. The default branch holds only the README, and the tool never writes to it.',
      'Every commit in a source repository pins an exact sidecar commit through a lock file, so any historical state is recoverable.',
      'Editing a namespace branch by hand makes the source repository report drift on its next status check, so manual tampering is visible rather than silent.',
      'The specification stays auditable through normal git history, log and blame, just in its own repository.',
    ],
    pt: [
      'Conteúdo organizado por namespace, um por projeto de origem, cada um publicado na própria branch. A branch padrão guarda só o README, e a ferramenta nunca escreve nela.',
      'Cada commit no repositório de origem fixa um commit exato do sidecar através de um lock file, então qualquer estado histórico é recuperável.',
      'Editar uma branch de namespace à mão faz o repositório de origem reportar drift no próximo status, então adulteração manual fica visível em vez de silenciosa.',
      'A especificação continua auditável por histórico, log e blame normais do git, só que no repositório dela.',
    ],
  },

  stack: [{ group: 'other', items: ['git', 'skeeper'] }],

  development: {
    en: [
      'Written by tooling rather than by hand, which is why it has two commits and no source of its own. It is included here because the practice it supports, keeping specifications auditable but out of the code review path, is part of how the other projects were built.',
    ],
    pt: [
      'Escrito por ferramenta e não à mão, que é por que tem dois commits e nenhum código próprio. Está aqui porque a prática que ele sustenta, manter specs auditáveis mas fora do caminho da revisão de código, faz parte de como os outros projetos foram construídos.',
    ],
  },

  limitations: {
    en: [
      'Specifications must be committed with LF line endings. A file committed with CRLF is normalised inside the sidecar, which makes the source repository’s working tree disagree with the pinned blob and report drift permanently.',
      'Three namespaces are active: studiobiasantos, viralvideogen and howzysolutions.',
      'It has no independent value: it is support infrastructure, and it is listed as such.',
    ],
    pt: [
      'Specs precisam ser commitadas com fim de linha LF. Arquivo commitado com CRLF é normalizado dentro do sidecar, o que faz a working tree do repositório de origem discordar do blob travado e reportar drift permanente.',
      'Três namespaces ativos: studiobiasantos, viralvideogen e howzysolutions.',
      'Não tem valor independente: é infraestrutura de apoio, e está listado como tal.',
    ],
  },
}
