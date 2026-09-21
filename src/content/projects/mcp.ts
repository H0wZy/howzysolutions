import type { Project } from '../types'
import mcpData from '../mcp.generated.json'

export const mcp: Project = {
  id: 'mcp',
  name: 'H0wZy/mcp',
  kind: 'tooling',
  state: 'production',
  context: {
    en: 'Multi-agent Model Context Protocol hub and Go CLI bridging Claude Code, OpenAI Codex and Google Antigravity.',
    pt: 'Hub Model Context Protocol multi-agente e CLI em Go conectando Claude Code, OpenAI Codex e Google Antigravity.',
  },
  period: { start: '2026-09-19', end: mcpData.lastCommitDate },
  commits: mcpData.commits,
  wakatimeProject: 'mcp',

  summary: {
    en: 'Centralised, high-performance MCP server hub and interactive Go TUI CLI enabling cross-model code reviews and multi-agent coordination across Claude, Codex and Antigravity.',
    pt: 'Hub centralizado de alta performance para servidores MCP e CLI interativo em Go com TUI, habilitando revisoes de codigo cross-model e coordenacao multi-agente entre Claude, Codex e Antigravity.',
  },

  problem: {
    en: 'Leading AI developer CLIs (Claude Code, OpenAI Codex, Google Antigravity) operate in isolation with separate configurations, duplicate stdio JSON-RPC boilerplate, platform-specific path bugs on Windows, and zero cross-model collaboration.',
    pt: 'Os principais CLIs de IA (Claude Code, OpenAI Codex, Google Antigravity) operam isolados com configuracoes separadas, duplicacao de boilerplate stdio JSON-RPC, falhas de path no Windows e zero colaboracao cruzada entre modelos.',
  },

  capabilities: {
    en: [
      'DRY Shared Core (@h0wzy/mcp-shared): generic JSON-RPC 2.0 stdio engine managing 100% of handshake, lifecycle, and error trapping.',
      'Native cross-platform execution with automatic PATHEXT resolution (.exe, .cmd, .bat) and delimiter handling, eliminating Windows glitches.',
      'Sub-50ms native Go CLI (hmcp / h0wzy-mcp) with interactive Bubble Tea TUI, environment diagnostics, and zero npx network latency.',
      'Resilient rate limit and quota handling: traps HTTP 429 and ResourceExhausted limits with structured fallback so host agents never crash.',
      'Decoupled bridges for Claude Code, OpenAI Codex (GPT-5.6 / GPT-6 Astra), and Google Antigravity (Gemini 3.1 Pro / Flash).',
      'Distributed via npm (npx @h0wzy/mcp) and precompiled zero-dependency standalone binaries for Windows, Linux, and macOS.',
    ],
    pt: [
      'Nucleo compartilhado DRY (@h0wzy/mcp-shared): motor generico JSON-RPC 2.0 stdio gerenciando handshake, ciclo de vida e captura de erros.',
      'Execucao cross-platform nativa com resolucao automatica de PATHEXT (.exe, .cmd, .bat) e delimitadores, eliminando bugs no Windows.',
      'CLI nativo em Go sub-50ms (hmcp / h0wzy-mcp) com TUI interativa em Bubble Tea, diagnosticos de ambiente e zero latencia de rede npx.',
      'Tratamento resiliente de rate limits e cotas: intercepta HTTP 429 e ResourceExhausted com fallback estruturado sem derrubar a sessao.',
      'Bridges desacopladas para Claude Code, OpenAI Codex (GPT-5.6 / GPT-6 Astra) e Google Antigravity (Gemini 3.1 Pro / Flash).',
      'Distribuido via npm (npx @h0wzy/mcp) e binarios avulsos pre-compilados sem dependencias para Windows, Linux e macOS.',
    ],
  },

  stack: [
    { group: 'backend', items: ['go', 'typescript'] },
    { group: 'infra', items: ['github-actions'] },
    { group: 'other', items: ['mcp'] },
  ],

  development: {
    en: [
      'Designed with Spec Kit methodology under specs/001-multi-agent-mcp-hub with formal architecture diagrams, test suites, and security audits.',
      'Monorepo architecture separating the Go Bubble Tea CLI (cli/), host bridges (servers/), reusable JSON-RPC core (shared/), and npm wrapper (npm/).',
      'Comprehensive security audit (SECURITY_AUDIT.md) ensuring zero secret leakage, token sanitization on error responses, and clean process isolation.',
      'GitHub Actions CI matrix validating builds across Windows, Linux and macOS, with automated GoReleaser standalone binary generation.',
    ],
    pt: [
      'Projetado com metodologia Spec Kit em specs/001-multi-agent-mcp-hub com diagramas formais de arquitetura, suite de testes e auditorias de seguranca.',
      'Arquitetura monorepo separando o CLI Go em Bubble Tea (cli/), bridges dos hosts (servers/), nucleo reutilizavel JSON-RPC (shared/) e wrapper npm (npm/).',
      'Auditoria de seguranca abrangente (SECURITY_AUDIT.md) garantindo zero vazamento de credenciais, sanitizacao de tokens e isolamento de processos.',
      'Matriz de CI em GitHub Actions validando compilacoes no Windows, Linux e macOS, com geracao automatizada de binarios via GoReleaser.',
    ],
  },

  limitations: {
    en: [
      'Transport is currently stdio JSON-RPC 2.0; remote network transport over SSE and streamable HTTP is planned in spec 004.',
      'Local CLI detection requires the host binaries (claude, codex, agy) to be installed and available in PATH.',
      'Background update detection depends on GitHub Release API availability and degrades cleanly when offline.',
    ],
    pt: [
      'O transporte atual e stdio JSON-RPC 2.0; transporte remoto de rede sobre SSE e streamable HTTP esta planejado na spec 004.',
      'A deteccao local de CLIs requer que os binarios dos hosts (claude, codex, agy) estejam instalados e disponiveis no PATH.',
      'A verificacao de updates em background depende da API de Releases do GitHub e degrada de forma limpa quando offline.',
    ],
  },

  roadmap: {
    en: [
      'v1.0 multi-agent stdio hub (completed)',
      'v1.1 interactive TUI doctor and config manager (completed)',
      'v1.2 automated binary distribution via GoReleaser and npx (completed)',
      'v2.0 remote SSE / Streamable HTTP endpoint via Cloudflare Tunnel: in design (spec 004)',
    ],
    pt: [
      'v1.0 hub multi-agente stdio (concluido)',
      'v1.1 diagnostico interativo TUI doctor e gerenciador de configs (concluido)',
      'v1.2 distribuicao automatizada de binarios via GoReleaser e npx (concluido)',
      'v2.0 endpoint remoto SSE / Streamable HTTP via Cloudflare Tunnel: em desenho (spec 004)',
    ],
  },

  metrics: [
    {
      label: { en: 'Commits', pt: 'Commits' },
      value: String(mcpData.commits),
      source: { en: `git history, 2026-09-19 to ${mcpData.lastCommitDate}`, pt: `historico git, 19/09/2026 a ${mcpData.lastCommitDate}` },
    },
    {
      label: { en: 'Shipped version', pt: 'Versao lancada' },
      value: mcpData.version,
      source: { en: 'npm registry and GitHub Releases', pt: 'registro npm e GitHub Releases' },
    },
    {
      label: { en: 'Supported host agents', pt: 'Agentes suportados' },
      value: String(mcpData.supportedAgents),
      source: { en: 'Claude Code, OpenAI Codex, Google Antigravity', pt: 'Claude Code, OpenAI Codex, Google Antigravity' },
    },
  ],

  links: [
    { kind: 'repo', href: 'https://github.com/H0wZy/mcp', label: 'GitHub' },
    { kind: 'live', href: 'https://howzysolutions.com/mcp', label: 'Showcase' },
  ],
}
