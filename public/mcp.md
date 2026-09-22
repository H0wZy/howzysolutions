---
title: H0wZy/mcp: Multi-Agent MCP Hub
description: The Ultimate Multi-Agent MCP Hub and Go CLI connecting Claude Code, OpenAI Codex, and Google Antigravity.
version: v1.0.4
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

```bash
npx @h0wzy/mcp
```

Or install globally via npm:

```bash
npm install -g @h0wzy/mcp
```

## Connect Your AI Agent

### 1. Claude Code

Add the MCP connector to Claude Code:

```bash
claude mcp add h0wzy-mcp -- npx -y @h0wzy/mcp
```

Once registered, Claude Code can autonomously route tasks to OpenAI Codex and Google Antigravity.

### 2. Available Transport Endpoints

- **Streamable HTTP (Recommended)**: `https://mcp.howzysolutions.com/mcp`
- **HTTP / SSE**: `https://mcp.howzysolutions.com/sse`
- **CLI (Local Stdio)**: `npx @h0wzy/mcp`

## Multi-Agent Delegation & Tools

How to prompt Claude Code to delegate to Antigravity and Codex across 8 mirrored tools:

| Antigravity (Gemini 3.1) | Codex (GPT-5.6 / GPT-6) | Purpose | Example Prompt |
| --- | --- | --- | --- |
| `ask_antigravity` | `ask_codex` | Inquiries and second opinions | "Ask Antigravity for a second opinion on this database schema." |
| `review_antigravity` | `review_codex` | Code and security reviews | "Review my git diff using Codex for security edge cases." |
| `brainstorm_antigravity` | `brainstorm_codex` | Architectural trade-offs | "Brainstorm caching strategies with Codex comparing Redis and Cloudflare KV." |
| `plan_antigravity` | `plan_codex` | Implementation roadmaps | "Generate an implementation plan with Antigravity to refactor auth." |

## Monorepo Packages

| Package | Description | Version |
| --- | --- | --- |
| `@h0wzy/mcp` | Interactive Go CLI runner and hub orchestrator | v1.0.4 |
| `@h0wzy/mcp-shared` | Cross-platform utilities and JSON-RPC stdio engine | v1.0.4 |
| `@h0wzy/mcp-server-antigravity` | Google Antigravity MCP Server connecting to Gemini 3.1 | v1.0.4 |
| `@h0wzy/mcp-server-codex` | OpenAI Codex MCP Server connecting to GPT-5.6 / GPT-6 | v1.0.4 |

## Standalone Binaries (v1.0.4)

Compiled native Go binaries with zero runtime dependencies:

- [Windows (amd64)](https://github.com/H0wZy/mcp/releases/download/v1.0.4/h0wzy-mcp-windows-amd64.exe)
- [Linux (amd64)](https://github.com/H0wZy/mcp/releases/download/v1.0.4/h0wzy-mcp-linux-amd64)
- [macOS (arm64 Apple Silicon)](https://github.com/H0wZy/mcp/releases/download/v1.0.4/h0wzy-mcp-darwin-arm64)
- [macOS (amd64 Intel)](https://github.com/H0wZy/mcp/releases/download/v1.0.4/h0wzy-mcp-darwin-amd64)

## Architecture & Metrics

- **Commits**: 36 in git history
- **Shipped Version**: v1.0.4 on npm registry and GitHub Releases
- **Supported Host Agents**: Claude Code, OpenAI Codex, Google Antigravity
- **Performance**: Sub-50ms native Go CLI execution with Bubble Tea TUI
- **Resilience**: Smart trapping of HTTP 429 and quota limits
