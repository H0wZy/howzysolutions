/**
 * Generates static Markdown documentation files (/mcp.md and /pt/mcp.md)
 * inspired by shadcn/ui documentation exports.
 *
 * Emitted at build time to `public/` (for Vite dev and dist build)
 * and directly to `dist/` if present.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const mcpArtifactPath = join(root, 'src', 'content', 'mcp.generated.json')

/* The same four tools /mcp/ renders, read from the one file both share. */
const tools = JSON.parse(readFileSync(join(root, 'src', 'content', 'mcp-tools.json'), 'utf8'))
const toolRows = (lang) =>
  tools
    .map((t) => `| \`${t.a}_antigravity\` | \`${t.a}_codex\` | ${t.d[lang]} | "${t.p[lang]}" |`)
    .join('\n')

let version = 'v1.0.4'
let commits = 36
try {
  if (existsSync(mcpArtifactPath)) {
    const data = JSON.parse(readFileSync(mcpArtifactPath, 'utf8'))
    if (data?.version) version = data.version
    if (data?.commits) commits = data.commits
  }
} catch {
  // Use fallback
}

export function buildMarkdown(locale = 'en') {
  const isPt = locale === 'pt'

  if (isPt) {
    return `---
title: H0wZy/mcp: Hub MCP Multi-Agente
description: O Hub MCP Multi-Agente definitivo e CLI em Go conectando Claude Code, OpenAI Codex e Google Antigravity.
version: ${version}
package: "@h0wzy/mcp"
npm: https://www.npmjs.com/package/@h0wzy/mcp
repo: https://github.com/H0wZy/mcp
docs: https://howzysolutions.com/pt/mcp
license: MIT
---

# H0wZy/mcp

> O Hub MCP Multi-Agente definitivo e CLI em Go conectando Claude Code, OpenAI Codex e Google Antigravity.

## Início Rápido

Execute diretamente sem instalação prévia:

\`\`\`bash
npx @h0wzy/mcp
\`\`\`

Ou instale globalmente via npm:

\`\`\`bash
npm install -g @h0wzy/mcp
\`\`\`

## Conecte seu Agente de IA

### 1. Claude Code

Adicione o conector ao Claude Code:

\`\`\`bash
claude mcp add h0wzy-mcp -- npx -y @h0wzy/mcp
\`\`\`

Após configurado, o Claude Code pode invocar ferramentas do OpenAI Codex e Google Antigravity de forma autônoma.

### 2. Endpoints de Transporte

- **Streamable HTTP (Recomendado)**: \`https://mcp.howzysolutions.com/mcp\`
- **HTTP / SSE**: \`https://mcp.howzysolutions.com/sse\`
- **CLI (Local Stdio)**: \`npx @h0wzy/mcp\`

## Delegação Multi-Agente & Ferramentas

Como instruir o Claude Code a delegar ao Antigravity e Codex via 8 ferramentas espelhadas:

| Antigravity (Gemini 3.1) | Codex (GPT-5.6 / GPT-6) | Finalidade | Prompt Exemplo |
| --- | --- | --- | --- |
${toolRows('pt')}

## Pacotes do Monorepo

| Pacote | Descrição | Versão |
| --- | --- | --- |
| \`@h0wzy/mcp\` | Runner interativo em Go e orquestrador do hub | ${version} |
| \`@h0wzy/mcp-shared\` | Utilitários cross-platform e motor stdio JSON-RPC | ${version} |
| \`@h0wzy/mcp-server-antigravity\` | Servidor MCP do Google Antigravity conectando ao Gemini 3.1 | ${version} |
| \`@h0wzy/mcp-server-codex\` | Servidor MCP do OpenAI Codex conectando ao GPT-5.6 / GPT-6 | ${version} |

## Binários Avulsos (${version})

Binários nativos compilados em Go, sem dependências de runtime:

- [Windows (amd64)](https://github.com/H0wZy/mcp/releases/download/${version}/h0wzy-mcp-windows-amd64.exe)
- [Linux (amd64)](https://github.com/H0wZy/mcp/releases/download/${version}/h0wzy-mcp-linux-amd64)
- [macOS (arm64 Apple Silicon)](https://github.com/H0wZy/mcp/releases/download/${version}/h0wzy-mcp-darwin-arm64)
- [macOS (amd64 Intel)](https://github.com/H0wZy/mcp/releases/download/${version}/h0wzy-mcp-darwin-amd64)

## Arquitetura & Métricas

- **Commits**: ${commits} no historico git
- **Versão**: ${version} no npm registry e GitHub Releases
- **Agentes Suportados**: Claude Code, OpenAI Codex, Google Antigravity
- **Performance**: Execução CLI nativa sub-50ms com TUI interativa em Bubble Tea
- **Resiliência**: Captura inteligente de HTTP 429 e limites de cota
`
  }

  return `---
title: H0wZy/mcp: Multi-Agent MCP Hub
description: The Ultimate Multi-Agent MCP Hub and Go CLI connecting Claude Code, OpenAI Codex, and Google Antigravity.
version: ${version}
package: "@h0wzy/mcp"
npm: https://www.npmjs.com/package/@h0wzy/mcp
repo: https://github.com/H0wZy/mcp
docs: https://howzysolutions.com/mcp
license: MIT
---

# H0wZy/mcp

> The Ultimate Multi-Agent MCP Hub and Go CLI connecting Claude Code, OpenAI Codex, and Google Antigravity.

## Quickstart

Run directly without installation:

\`\`\`bash
npx @h0wzy/mcp
\`\`\`

Or install globally via npm:

\`\`\`bash
npm install -g @h0wzy/mcp
\`\`\`

## Connect Your AI Agent

### 1. Claude Code

Add the MCP connector to Claude Code:

\`\`\`bash
claude mcp add h0wzy-mcp -- npx -y @h0wzy/mcp
\`\`\`

Once registered, Claude Code can autonomously route tasks to OpenAI Codex and Google Antigravity.

### 2. Available Transport Endpoints

- **Streamable HTTP (Recommended)**: \`https://mcp.howzysolutions.com/mcp\`
- **HTTP / SSE**: \`https://mcp.howzysolutions.com/sse\`
- **CLI (Local Stdio)**: \`npx @h0wzy/mcp\`

## Multi-Agent Delegation & Tools

How to prompt Claude Code to delegate to Antigravity and Codex across 8 mirrored tools:

| Antigravity (Gemini 3.1) | Codex (GPT-5.6 / GPT-6) | Purpose | Example Prompt |
| --- | --- | --- | --- |
${toolRows('en')}

## Monorepo Packages

| Package | Description | Version |
| --- | --- | --- |
| \`@h0wzy/mcp\` | Interactive Go CLI runner and hub orchestrator | ${version} |
| \`@h0wzy/mcp-shared\` | Cross-platform utilities and JSON-RPC stdio engine | ${version} |
| \`@h0wzy/mcp-server-antigravity\` | Google Antigravity MCP Server connecting to Gemini 3.1 | ${version} |
| \`@h0wzy/mcp-server-codex\` | OpenAI Codex MCP Server connecting to GPT-5.6 / GPT-6 | ${version} |

## Standalone Binaries (${version})

Compiled native Go binaries with zero runtime dependencies:

- [Windows (amd64)](https://github.com/H0wZy/mcp/releases/download/${version}/h0wzy-mcp-windows-amd64.exe)
- [Linux (amd64)](https://github.com/H0wZy/mcp/releases/download/${version}/h0wzy-mcp-linux-amd64)
- [macOS (arm64 Apple Silicon)](https://github.com/H0wZy/mcp/releases/download/${version}/h0wzy-mcp-darwin-arm64)
- [macOS (amd64 Intel)](https://github.com/H0wZy/mcp/releases/download/${version}/h0wzy-mcp-darwin-amd64)

## Architecture & Metrics

- **Commits**: ${commits} in git history
- **Shipped Version**: ${version} on npm registry and GitHub Releases
- **Supported Host Agents**: Claude Code, OpenAI Codex, Google Antigravity
- **Performance**: Sub-50ms native Go CLI execution with Bubble Tea TUI
- **Resilience**: Smart trapping of HTTP 429 and quota limits
`
}

export function writeAllMarkdown() {
  const publicDir = join(root, 'public')
  const distDir = join(root, 'dist')

  mkdirSync(join(publicDir, 'pt'), { recursive: true })
  writeFileSync(join(publicDir, 'mcp.md'), buildMarkdown('en'), 'utf8')
  writeFileSync(join(publicDir, 'pt', 'mcp.md'), buildMarkdown('pt'), 'utf8')

  if (existsSync(distDir)) {
    mkdirSync(join(distDir, 'pt'), { recursive: true })
    writeFileSync(join(distDir, 'mcp.md'), buildMarkdown('en'), 'utf8')
    writeFileSync(join(distDir, 'pt', 'mcp.md'), buildMarkdown('pt'), 'utf8')
  }

  console.log(`ok generated /mcp.md and /pt/mcp.md (${version})`)
}

// Run directly if invoked as script
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  writeAllMarkdown()
}
