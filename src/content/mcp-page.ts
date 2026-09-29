import type { Localized } from './i18n/types'

/*
 * Every visitor-facing string on /mcp/ that is not a project fact (Principle V).
 * `Localized` needs both locales, so a missing translation is a type error
 * instead of an English string on a Portuguese page, which is what this file
 * replaced. The punctuation test walks it (src/content/__tests__).
 *
 * The four delegation tools live in mcp-tools.json instead, because
 * scripts/generate-mcp-markdown.mjs publishes the same table and cannot import
 * TypeScript: one file, two readers, no second copy to drift.
 */
const L = (en: string, pt: string): Localized => ({ en, pt })

export type TransportMode = 'streamable' | 'sse' | 'cli'

export const mcpPage = {
  toc: {
    overview: L('Overview', 'Visão geral'),
    connector: L('Connect Agent', 'Conectar agente'),
    quickstart: L('Quickstart & CLI', 'Início rápido & CLI'),
    tools: L('Agent Delegation', 'Delegação'),
    packages: L('npm Packages', 'Pacotes npm'),
    bridges: L('Supported AI CLIs', 'CLIs de IA'),
    binaries: L('Standalone Binaries', 'Binários avulsos'),
  },
  title: L('What is H0wZy/mcp?', 'O que é H0wZy/mcp?'),
  subtitle: L(
    'The Ultimate Multi-Agent MCP Hub and Go CLI connecting Claude Code, OpenAI Codex, and Google Antigravity.',
    'O Hub MCP Multi-Agente definitivo e CLI em Go conectando Claude Code, OpenAI Codex e Google Antigravity.',
  ),
  githubRepo: L('GitHub repository', 'Repositório no GitHub'),
  bannerAlt: L('H0wZy/mcp banner', 'Banner do H0wZy/mcp'),
  copy: L('Copy', 'Copiar'),
  copied: L('Copied!', 'Copiado!'),
  copyFailed: L(
    'Copying was blocked. Select the text and copy it by hand.',
    'A cópia foi bloqueada. Selecione o texto e copie manualmente.',
  ),
  copyPage: L('Copy Page', 'Copiar página'),
  copyPageTitle: L('Copy entire page as Markdown', 'Copiar a página inteira como Markdown'),
  moreOptions: L('More options', 'Mais opções'),
  viewMarkdown: L('View as Markdown', 'Ver como Markdown'),
  openClaude: L('Open in Claude ↗', 'Abrir no Claude ↗'),
  openChatgpt: L('Open in ChatGPT ↗', 'Abrir no ChatGPT ↗'),
  viewNpm: L('View on npm ↗', 'Ver no npm ↗'),
  githubRepoLink: L('GitHub Repository ↗', 'Repositório no GitHub ↗'),
  connect: {
    heading: L('Connect Your AI Agent', 'Conecte seu agente de IA'),
    intro: L(
      'Select your client and connect to the hub via modern Streamable HTTP or legacy SSE.',
      'Escolha seu cliente e conecte ao hub com Streamable HTTP moderno ou SSE legado.',
    ),
    soon: L('TODO: Coming soon', 'TODO: Suporte em breve'),
    copyConnector: L('connector URL', 'URL do conector'),
    stepEndpoint: L('Copy endpoint URL', 'Copie o endpoint'),
    stepCommand: L('Run CLI command', 'Comando de execução'),
    streamable: L(
      'Unified Streamable HTTP endpoint recommended by modern MCP spec.',
      'Endpoint Streamable HTTP unificado recomendado pelo MCP.',
    ),
    sse: L(
      'Legacy SSE endpoint for backwards-compatible IDEs.',
      'Endpoint SSE compatível com IDEs legadas.',
    ),
    cli: L(
      'Zero-installation runner via npx execution.',
      'Inicie instantaneamente sem instalação prévia via npx.',
    ),
    stepConfigure: L('Configure client', 'Configure no cliente'),
    stepReady: L('Ready to use', 'Pronto para usar'),
    run: L('Run:', 'Execute:'),
    /* A shell command: its `--` is syntax, which the punctuation test knows by the field's name. */
    claudeCommand: 'claude mcp add h0wzy-mcp -- npx -y @h0wzy/mcp',
    claudeReady: L('Claude Code invokes codex and agy autonomously.', 'O Claude Code invoca codex e agy com autonomia.'),
    recommended: L(
      'Recommended: use Streamable HTTP for remote services and Go CLI for local dev.',
      'Recomendado: use Streamable HTTP para serviços remotos e a CLI em Go para dev local.',
    ),
    modes: [
      {
        id: 'streamable',
        label: L('Streamable', 'Streamable'),
        title: L('Modern Streamable HTTP endpoint', 'Endpoint Streamable HTTP moderno'),
      },
      {
        id: 'sse',
        label: L('SSE', 'SSE'),
        title: L('Legacy HTTP + SSE endpoint', 'Endpoint HTTP + SSE legado'),
      },
      {
        id: 'cli',
        label: L('CLI', 'CLI'),
        title: L('Zero-install CLI execution', 'Execução da CLI sem instalação'),
      },
    ] satisfies Array<{ id: TransportMode; label: Localized; title: Localized }>,
  },
  quickstart: {
    heading: L('Quick Start & CLI', 'Início rápido & CLI'),
    commands: [
      { key: 'cmd-npx', label: L('# 1. Instant execution:', '# 1. Execução instantânea:'), command: 'npx @h0wzy/mcp' },
      {
        key: 'cmd-npm',
        label: L('# 2. Global install:', '# 2. Instalação global:'),
        command: 'npm install -g @h0wzy/mcp && hmcp',
      },
      {
        key: 'cmd-go',
        label: L('# 3. From source (Go):', '# 3. A partir do código (Go):'),
        command: 'go run ./cli setup-path && hmcp',
      },
    ],
  },
  tools: {
    heading: L('Multi-Agent Delegation & Tools', 'Delegação multi-agente & ferramentas'),
    intro: L(
      'How to prompt Claude Code to delegate to Antigravity and Codex across 8 mirrored tools.',
      'Como instruir o Claude Code a delegar ao Antigravity e Codex via 8 ferramentas espelhadas.',
    ),
    copyPrompt: L('prompt', 'prompt'),
  },
  packages: {
    heading: L('Official npm Packages', 'Pacotes oficiais npm'),
    intro: L(
      'Published and versioned on the public npm registry.',
      'Publicados e versionados no registro público do npm.',
    ),
    viaCi: L('Published via CI', 'Publicado via CI'),
    items: [
      {
        suffix: '',
        description: L('Interactive Go CLI runner and hub orchestrator', 'Runner interativo em Go e orquestrador do hub'),
      },
      {
        suffix: '-shared',
        description: L('Cross-platform utilities and JSON-RPC stdio engine', 'Utilitários cross-platform e motor stdio JSON-RPC'),
      },
      {
        suffix: '-server-antigravity',
        description: L('Google Antigravity MCP Server connecting to Gemini 3.1', 'Servidor MCP do Google Antigravity conectando ao Gemini 3.1'),
      },
      {
        suffix: '-server-codex',
        description: L('OpenAI Codex MCP Server connecting to GPT-5.6 / GPT-6', 'Servidor MCP do OpenAI Codex conectando ao GPT-5.6 / GPT-6'),
      },
    ],
  },
  bridges: {
    heading: L('Supported AI Developer CLIs', 'CLIs de IA suportados'),
    items: [
      {
        name: 'Claude Code',
        by: 'Anthropic',
        description: L('Bridge in ~/.claude.json to invoke codex and agy.', 'Bridge em ~/.claude.json para invocar codex e agy.'),
      },
      {
        name: 'OpenAI Codex CLI',
        by: 'GPT-5.6 / GPT-6',
        description: L('Bridge for Codex CLI with safety and timeout.', 'Bridge para a CLI do Codex com proteção e timeout.'),
      },
      {
        name: 'Google Antigravity',
        by: 'Gemini 3.1',
        description: L('Connects agy CLI and IDE via mcp_config.json.', 'Conecta a CLI agy e a IDE via mcp_config.json.'),
      },
    ],
  },
  binaries: {
    heading: L('Precompiled Standalone Binaries', 'Binários avulsos pré-compilados'),
    intro: L(
      'Zero-dependency native binaries compiled for Windows, Linux, and macOS.',
      'Binários nativos sem dependências compilados para Windows, Linux e macOS.',
    ),
  },
}
