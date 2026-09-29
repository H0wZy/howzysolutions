---
title: H0wZy/mcp: Hub MCP Multi-Agente
description: O Hub MCP Multi-Agente definitivo e CLI em Go conectando Claude Code, OpenAI Codex e Google Antigravity.
version: v1.0.4
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

```bash
npx @h0wzy/mcp
```

Ou instale globalmente via npm:

```bash
npm install -g @h0wzy/mcp
```

## Conecte seu Agente de IA

### 1. Claude Code

Adicione o conector ao Claude Code:

```bash
claude mcp add h0wzy-mcp -- npx -y @h0wzy/mcp
```

Após configurado, o Claude Code pode invocar ferramentas do OpenAI Codex e Google Antigravity de forma autônoma.

### 2. Endpoints de Transporte

- **Streamable HTTP (Recomendado)**: `https://mcp.howzysolutions.com/mcp`
- **HTTP / SSE**: `https://mcp.howzysolutions.com/sse`
- **CLI (Local Stdio)**: `npx @h0wzy/mcp`

## Delegação Multi-Agente & Ferramentas

Como instruir o Claude Code a delegar ao Antigravity e Codex via 8 ferramentas espelhadas:

| Antigravity (Gemini 3.1) | Codex (GPT-5.6 / GPT-6) | Finalidade | Prompt Exemplo |
| --- | --- | --- | --- |
| `ask_antigravity` | `ask_codex` | Consultas e segunda opinião | "Peça uma segunda opinião ao Antigravity sobre este schema de banco." |
| `review_antigravity` | `review_codex` | Code review e segurança | "Faça um review do meu git diff usando Codex para checar segurança." |
| `brainstorm_antigravity` | `brainstorm_codex` | Trade-offs arquiteturais | "Faça um brainstorming com Codex comparando Redis e Cloudflare KV para cache." |
| `plan_antigravity` | `plan_codex` | Planos de implementação | "Gere um plano de implementação com Antigravity para refatorar auth." |

## Pacotes do Monorepo

| Pacote | Descrição | Versão |
| --- | --- | --- |
| `@h0wzy/mcp` | Runner interativo em Go e orquestrador do hub | v1.0.4 |
| `@h0wzy/mcp-shared` | Utilitários cross-platform e motor stdio JSON-RPC | v1.0.4 |
| `@h0wzy/mcp-server-antigravity` | Servidor MCP do Google Antigravity conectando ao Gemini 3.1 | v1.0.4 |
| `@h0wzy/mcp-server-codex` | Servidor MCP do OpenAI Codex conectando ao GPT-5.6 / GPT-6 | v1.0.4 |

## Binários Avulsos (v1.0.4)

Binários nativos compilados em Go, sem dependências de runtime:

- [Windows (amd64)](https://github.com/H0wZy/mcp/releases/download/v1.0.4/h0wzy-mcp-windows-amd64.exe)
- [Linux (amd64)](https://github.com/H0wZy/mcp/releases/download/v1.0.4/h0wzy-mcp-linux-amd64)
- [macOS (arm64 Apple Silicon)](https://github.com/H0wZy/mcp/releases/download/v1.0.4/h0wzy-mcp-darwin-arm64)
- [macOS (amd64 Intel)](https://github.com/H0wZy/mcp/releases/download/v1.0.4/h0wzy-mcp-darwin-amd64)

## Arquitetura & Métricas

- **Commits**: 36 no historico git
- **Versão**: v1.0.4 no npm registry e GitHub Releases
- **Agentes Suportados**: Claude Code, OpenAI Codex, Google Antigravity
- **Performance**: Execução CLI nativa sub-50ms com TUI interativa em Bubble Tea
- **Resiliência**: Captura inteligente de HTTP 429 e limites de cota
