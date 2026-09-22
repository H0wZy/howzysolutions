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

## Inicio Rapido

Execute diretamente sem instalacao previa:

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

Apos configurado, o Claude Code pode invocar ferramentas do OpenAI Codex e Google Antigravity de forma autonoma.

### 2. Endpoints de Transporte

- **Streamable HTTP (Recomendado)**: `https://mcp.howzysolutions.com/mcp`
- **HTTP / SSE**: `https://mcp.howzysolutions.com/sse`
- **CLI (Local Stdio)**: `npx @h0wzy/mcp`

## Delegacao Multi-Agente & Ferramentas

Como instruir o Claude Code a delegar ao Antigravity e Codex via 8 ferramentas espelhadas:

| Antigravity (Gemini 3.1) | Codex (GPT-5.6 / GPT-6) | Finalidade | Prompt Exemplo |
| --- | --- | --- | --- |
| `ask_antigravity` | `ask_codex` | Consultas e segunda opiniao | "Peca uma segunda opiniao ao Antigravity sobre este schema de banco." |
| `review_antigravity` | `review_codex` | Code review e seguranca | "Faca um review do meu git diff usando Codex para checar seguranca." |
| `brainstorm_antigravity` | `brainstorm_codex` | Trade-offs arquiteturais | "Faca um brainstorming com Codex comparando Redis e Cloudflare KV para cache." |
| `plan_antigravity` | `plan_codex` | Planos de implementacao | "Gere um plano de implementacao com Antigravity para refatorar auth." |

## Pacotes do Monorepo

| Pacote | Descricao | Versao |
| --- | --- | --- |
| `@h0wzy/mcp` | Runner interativo em Go e orquestrador de hub | v1.0.4 |
| `@h0wzy/mcp-shared` | Utilitarios cross-platform e motor stdio JSON-RPC | v1.0.4 |
| `@h0wzy/mcp-server-antigravity` | Servidor MCP Google Antigravity conectando ao Gemini 3.1 | v1.0.4 |
| `@h0wzy/mcp-server-codex` | Servidor MCP OpenAI Codex conectando ao GPT-5.6 / GPT-6 | v1.0.4 |

## Binarios Avulsos (v1.0.4)

Binarios compilados nativos em Go com zero dependencias de runtime:

- [Windows (amd64)](https://github.com/H0wZy/mcp/releases/download/v1.0.4/h0wzy-mcp-windows-amd64.exe)
- [Linux (amd64)](https://github.com/H0wZy/mcp/releases/download/v1.0.4/h0wzy-mcp-linux-amd64)
- [macOS (arm64 Apple Silicon)](https://github.com/H0wZy/mcp/releases/download/v1.0.4/h0wzy-mcp-darwin-arm64)
- [macOS (amd64 Intel)](https://github.com/H0wZy/mcp/releases/download/v1.0.4/h0wzy-mcp-darwin-amd64)

## Arquitetura & Metricas

- **Commits**: 36 no historico git
- **Versao**: v1.0.4 no npm registry e GitHub Releases
- **Agentes Suportados**: Claude Code, OpenAI Codex, Google Antigravity
- **Performance**: Execucao CLI nativa sub-50ms com TUI interativa em Bubble Tea
- **Resiliencia**: Captura inteligente de HTTP 429 e limites de cota
