import type { Project } from '../types'

export const terminal: Project = {
  id: 'terminal',
  name: 'terminal',
  kind: 'tooling',
  state: 'functional',
  period: { start: '2026-07-31', end: '2026-08-10' },
  commits: 7,
  wakatimeProject: 'terminal',

  summary: {
    en: 'Cross-OS terminal dotfiles that never overwrite the real file and never version a secret. Idempotent setup for Windows 11 and Fedora from one Makefile.',
    pt: 'Dotfiles de terminal cross-OS que nunca sobrescrevem o arquivo real e nunca versionam segredo. Setup idempotente para Windows 11 e Fedora a partir de um Makefile.',
  },

  problem: {
    en: 'Keeping the same terminal configuration on two machines with different operating systems (Windows 11 and Fedora KDE Plasma) without copying files by hand and without versioning a secret.',
    pt: 'Manter a mesma configuração de terminal em duas máquinas com sistemas diferentes (Windows 11 e Fedora KDE Plasma) sem copiar arquivo à mão nem versionar segredo.',
  },

  capabilities: {
    en: [
      'Synchronises the prompt theme, a startup snippet for both Bash and PowerShell, and the Nerd Font.',
      'A Makefile detects the operating system and calls the right setup script, so the same commands work on both systems.',
      'Assisted migration: if an older loose configuration already exists in the real file, setup shows the lines and asks before migrating. Declining aborts without touching anything.',
    ],
    pt: [
      'Sincroniza o tema do prompt, um snippet de inicialização para Bash e PowerShell, e a Nerd Font.',
      'Um Makefile detecta o sistema operacional e chama o script de setup certo, então os mesmos comandos funcionam nos dois sistemas.',
      'Migração assistida: se já existia configuração antiga solta no arquivo real, o setup mostra as linhas e pergunta antes de migrar. Recusar aborta sem mexer em nada.',
    ],
  },

  stack: [{ group: 'other', items: ['bash', 'powershell', 'make', 'oh-my-posh'] }],

  development: {
    en: [
      'No complete shell profile is ever versioned. Those hold PATH entries, version-manager hooks and machine-specific settings. The repository keeps only the prompt snippet, and setup appends it to the real file inside a delimited block.',
      'The scripts are idempotent: running again duplicates nothing and touches only what changed. The real file is never overwritten: setup rewrites only the block between its markers, and takes a timestamped backup before touching anything.',
      'The theme is installed as a hard link rather than a copy, so editing it in the repository is reflected in the prompt without re-copying. The README explains the condition that makes it work and the fallback for when it does not.',
    ],
    pt: [
      'Nenhum profile de shell completo é versionado. Eles têm PATH, hooks de gerenciador de versão e coisas específicas de cada máquina. O repositório guarda só o trecho do prompt, e o setup pendura ele no arquivo real dentro de um bloco delimitado.',
      'Os scripts são idempotentes: rodar de novo não duplica nada e só mexe no que mudou. O arquivo real nunca é sobrescrito: o setup reescreve apenas o bloco entre os marcadores, e faz backup com timestamp antes de tocar em qualquer coisa.',
      'O tema é instalado como hardlink e não cópia, então editar no repositório reflete no prompt sem re-copiar. O README explica a condição que faz isso funcionar e o fallback para quando ela não vale.',
    ],
  },

  limitations: {
    en: [
      'Choosing the font in Windows Terminal or Konsole is a click in a GUI, and the README documents it as a manual step rather than pretending to automate it.',
      'PowerShell 7 only, not 5.1: the two editions point at different profile folders, so the script aborts on the wrong edition rather than writing to a file nobody reads.',
      'The hard link requires the repository and the home directory to sit on the same volume. When they do not, setup falls back to copying, and the README says so.',
    ],
    pt: [
      'Escolher a fonte no Windows Terminal ou no Konsole é clique na GUI, e o README documenta isso como passo manual em vez de fingir que automatiza.',
      'Só PowerShell 7, não o 5.1: as duas edições apontam para pastas de profile diferentes, então o script aborta na edição errada em vez de escrever num arquivo que ninguém lê.',
      'O hardlink exige que o repositório e o diretório home estejam no mesmo volume. Quando não estão, o setup cai para cópia, e o README diz isso.',
    ],
  },
}
