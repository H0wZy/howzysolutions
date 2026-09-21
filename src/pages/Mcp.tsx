import { useEffect, useState } from 'react'
import type { Locale } from '../content/i18n/types'
import type { ContentBundle } from '../content/types'
import { Chrome } from '../components/Chrome'
import { SectionRail, type RailEntry } from '../components/SectionRail'
import { Footer } from '../components/Footer'

const TOC_ENTRIES: RailEntry[] = [
  { id: 'overview', label: { en: 'Overview', pt: 'Visao Geral' } },
  { id: 'connector', label: { en: 'Connect Agent', pt: 'Conectar Agente' } },
  { id: 'quickstart', label: { en: 'Quickstart & CLI', pt: 'Inicio Rapido & CLI' } },
  { id: 'packages', label: { en: 'npm Packages', pt: 'Pacotes npm' } },
  { id: 'bridges', label: { en: 'Supported AI CLIs', pt: 'CLIs de IA' } },
  { id: 'binaries', label: { en: 'Standalone Binaries', pt: 'Binarios Avulsos' } },
]

type TransportMode = 'streamable' | 'sse' | 'cli'

const PACKAGES = [
  { n: '@h0wzy/mcp', d: 'Interactive Go CLI runner and hub orchestrator' },
  { n: '@h0wzy/mcp-shared', d: 'Cross-platform utilities and JSON-RPC stdio engine' },
  { n: '@h0wzy/mcp-server-antigravity', d: 'Google Antigravity MCP Server connecting to Gemini 3.1' },
  { n: '@h0wzy/mcp-server-codex', d: 'OpenAI Codex MCP Server connecting to GPT-5.6 / GPT-6' },
]

const BINARIES = [
  { p: 'Windows (amd64)', f: 'h0wzy-mcp-windows-amd64.exe' },
  { p: 'Linux (amd64)', f: 'h0wzy-mcp-linux-amd64' },
  { p: 'macOS (arm64)', f: 'h0wzy-mcp-darwin-arm64' },
]

const BRIDGES = [
  {
    n: 'Claude Code',
    b: 'Anthropic',
    d: {
      en: 'Native ~/.claude.json bridge allowing Claude to invoke codex and agy.',
      pt: 'Integracao ~/.claude.json para o Claude invocar codex e agy.',
    },
  },
  {
    n: 'OpenAI Codex CLI',
    b: 'GPT-5.6 / GPT-6',
    d: {
      en: 'Bridge for official Codex CLI with sanitization and timeout protection.',
      pt: 'Bridge para CLI Codex oficial com protecao e timeout.',
    },
  },
  {
    n: 'Google Antigravity',
    b: 'Gemini 3.1',
    d: {
      en: 'Connects agy CLI and IDE via ~/.gemini/config/mcp_config.json.',
      pt: 'Conecta agy CLI e IDE em ~/.gemini/config/mcp_config.json.',
    },
  },
]

const CLAUDE_STEPS = {
  en: ['Run: claude mcp add h0wzy-mcp -- npx -y @h0wzy/mcp', 'Claude Code invokes codex and agy autonomously.'],
  pt: ['Execute: claude mcp add h0wzy-mcp -- npx -y @h0wzy/mcp', 'Claude Code invoca codex e agy com autonomia.'],
}

function CopyIcon() {
  return (
    <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="size-3.5 shrink-0 text-[var(--accent)] transition-transform duration-300 scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function Mcp({
  locale,
  pathname,
}: {
  content: ContentBundle
  locale: Locale
  pathname: string
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [mode, setMode] = useState<TransportMode>('streamable')
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    fetch('https://api.github.com/repos/H0wZy/mcp')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => typeof d?.stargazers_count === 'number' && setStars(d.stargazers_count))
      .catch(() => {})
  }, [])

  const triggerCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key)
      setDropdownOpen(false)
      setTimeout(() => setCopiedKey((cur) => (cur === key ? null : cur)), 3000)
    })
  }

  const connectorUrl =
    mode === 'streamable'
      ? 'https://mcp.howzysolutions.com/mcp'
      : mode === 'sse'
        ? 'https://mcp.howzysolutions.com/sse'
        : 'npx @h0wzy/mcp'

  const stepInfo = CLAUDE_STEPS

  return (
    <>
      <Chrome locale={locale} pathname={pathname} />

      <main className="document-layout">
        <SectionRail entries={TOC_ENTRIES} locale={locale} />

        <div className="document-body">
          {/* Header Bar */}
          <header className="section">
            <div className="wrap flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--line)]">
              <div className="flex items-center gap-3 font-mono">
                <span className="text-sm px-2.5 py-1 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] font-semibold">
                  H0wZy/mcp v1.0.3
                </span>
                <span className="text-xs text-[var(--dim)]">MIT · Go 1.26+ · Node 20+</span>
              </div>

              <div className="flex items-center gap-2 relative">
                {/* GitHub Star Button with Stroke-Only Star */}
                <a
                  href="https://github.com/H0wZy/mcp"
                  target="_blank"
                  rel="noreferrer"
                  className="chrome-btn inline-flex items-center gap-2 text-xs"
                  title="GitHub repository"
                >
                  <svg className="size-3.5 fill-current" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  <span>GitHub</span>
                  <span className="inline-flex items-center gap-1 font-mono text-[var(--fg)]">
                    <svg className="size-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {stars !== null ? stars : 'v1.0.3'}
                  </span>
                </a>

                {/* Minimalist Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    className="chrome-btn inline-flex items-center gap-1.5 text-xs bg-[var(--surface)] hover:text-[var(--accent)]"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}
                  >
                    <span>{locale === 'pt' ? 'Copiar / Acoes' : 'Copy / Actions'}</span>
                    <span>▾</span>
                  </button>

                  {dropdownOpen ? (
                    <div className="absolute right-0 mt-2 w-56 rounded border border-[var(--border)] bg-[var(--surface)] shadow-2xl p-1 z-50 flex flex-col gap-0.5 text-xs font-mono">
                      <button
                        type="button"
                        onClick={() =>
                          triggerCopy(
                            `# H0wZy/mcp — Multi-Agent MCP Hub\nQuickstart: npx @h0wzy/mcp\nhttps://github.com/H0wZy/mcp`,
                            'dropdown-md',
                          )
                        }
                        className="text-left px-2.5 py-1.5 rounded hover:bg-[var(--line)] hover:text-[var(--accent)] transition-colors"
                      >
                        📄 {locale === 'pt' ? 'Copiar Markdown' : 'Copy Markdown'}
                      </button>
                      <a
                        href="https://claude.ai/new?q=Tell%20me%20about%20the%20multi-agent%20MCP%20hub%20at%20github.com/H0wZy/mcp"
                        target="_blank"
                        rel="noreferrer"
                        className="text-left px-2.5 py-1.5 rounded hover:bg-[var(--line)] hover:text-[var(--accent)] transition-colors"
                      >
                        ⚡ Open in Claude ↗
                      </a>
                      <a
                        href="https://www.npmjs.com/package/@h0wzy/mcp"
                        target="_blank"
                        rel="noreferrer"
                        className="text-left px-2.5 py-1.5 rounded hover:bg-[var(--line)] hover:text-[var(--accent)] transition-colors"
                      >
                        📦 View on npm ↗
                      </a>
                      <a
                        href="https://github.com/H0wZy/mcp/issues"
                        target="_blank"
                        rel="noreferrer"
                        className="text-left px-2.5 py-1.5 rounded hover:bg-[var(--line)] hover:text-[var(--accent)] transition-colors border-t border-[var(--line)] pt-1"
                      >
                        🐛 {locale === 'pt' ? 'Abrir issue ↗' : 'Open issue ↗'}
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {copiedKey ? (
              <div className="wrap mt-3">
                <div className="px-3 py-1 rounded bg-[var(--surface)] border border-[var(--accent)] text-[var(--accent)] text-xs font-mono inline-block">
                  ✓ {locale === 'pt' ? 'Copiado para a area de transferencia' : 'Copied to clipboard'}
                </div>
              </div>
            ) : null}
          </header>

          {/* Overview Section */}
          <section id="overview" className="section">
            <div className="wrap">
              <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)] mb-3">
                {locale === 'pt' ? 'O que e H0wZy/mcp?' : 'What is H0wZy/mcp?'}
              </h1>
              <p className="sub text-lg text-[var(--dim)] mb-8">
                {locale === 'pt'
                  ? 'O Hub MCP Multi-Agente definitivo e CLI em Go conectando Claude Code, OpenAI Codex e Google Antigravity.'
                  : 'The Ultimate Multi-Agent MCP Hub and Go CLI connecting Claude Code, OpenAI Codex, and Google Antigravity.'}
              </p>

              {/* Real hmcp ASCII Banner & Terminal Preview */}
              <div className="rounded-lg bg-[var(--bg)] border border-[var(--border)] overflow-hidden shadow-2xl font-mono text-xs mt-8">
                <div className="px-4 py-2.5 bg-[var(--surface)] border-b border-[var(--line)] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--term-user)] font-semibold">h0wzy@howzysolutions</span>
                    <span className="text-[var(--dim)]">in</span>
                    <span className="text-[var(--accent)]">~/mcp</span>
                  </div>
                </div>

                <div className="p-5 overflow-x-auto space-y-4">
                  <div className="text-[var(--dim)]">
                    <span className="text-[var(--accent)] font-bold">❯ </span>
                    <span className="text-[var(--fg)] font-bold">hmcp</span>
                  </div>

                  {/* Gradient ASCII Banner with Perfectly Aligned 74-col block font */}
                  <pre
                    className="leading-tight font-black select-none tracking-tighter"
                    style={{
                      background: 'linear-gradient(180deg, #e9d5ff 0%, #c084fc 35%, #9333ea 70%, #6b21a8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
{`██╗  ██╗ ██████╗ ██╗    ██╗███████╗██╗   ██╗   ███╗   ███╗ ██████╗██████╗ 
██║  ██║██╔═══██╗██║    ██║╚══███╔╝╚██╗ ██╔╝   ████╗ ████║██╔════╝██╔══██╗
███████║██║   ██║██║ █╗ ██║  ███╔╝   ╚████╔╝   ██╔████╔██║██║     ██████╔╝
██╔══██║██║   ██║██║███╗██║ ███╔╝     ╚██╔╝    ██║╚██╔╝██║██║     ██╔═══╝ 
██║  ██║╚██████╔╝╚███╔███╔╝███████╗    ██║     ██║ ╚═╝ ██║╚██████╗██║     
╚═╝  ╚═╝ ╚═════╝  ╚══╝╚══╝ ╚══════╝    ╚═╝     ╚═╝     ╚═╝ ╚═════╝╚═╝     `}
                  </pre>

                  <div className="space-y-1 text-xs pt-1">
                    <div className="text-[var(--fg)] font-semibold">
                      H0wZy/mcp v1.0.3 • Multi-Agent MCP Hub
                    </div>
                    <div className="text-[var(--term-user)]">
                      Claude Code ↔ OpenAI Codex ↔ Google Antigravity
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Connector Widget */}
          <section id="connector" className="section">
            <div className="wrap">
              <h2 className="text-xl font-semibold mb-2 text-[var(--fg)]">
                {locale === 'pt' ? 'Conecte seu Agente de IA' : 'Connect Your AI Agent'}
              </h2>
              <p className="text-xs text-[var(--dim)] mb-4">
                {locale === 'pt'
                  ? 'Escolha seu cliente e conecte ao hub com Streamable HTTP moderno ou SSE legado.'
                  : 'Select your client and connect to the hub via modern Streamable HTTP or legacy SSE.'}
              </p>

              <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--border)] shadow-xl space-y-5">
                {/* Agent selector tabs + Mode Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
                  {/* Left: Agent tabs */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Active / Clickable: Claude Code */}
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-all border outline-none bg-[var(--line)] border-[var(--accent)] text-[var(--accent)] shadow-sm focus-visible:ring-2 focus-visible:ring-[var(--accent)] cursor-default"
                    >
                      Claude Code
                    </button>

                    {/* Disabled / Future: Codex & Antigravity */}
                    {(['Codex', 'Antigravity'] as const).map((name) => (
                      <div key={name} className="relative group inline-flex">
                        <button
                          type="button"
                          disabled
                          className="px-2.5 py-1 rounded text-[11px] font-mono border border-dashed border-[var(--border)] bg-[var(--bg)]/60 text-[var(--dim)] opacity-50 cursor-not-allowed inline-flex items-center gap-1 select-none transition-all group-hover:opacity-85"
                          title={locale === 'pt' ? 'TODO: Suporte nativo em breve' : 'TODO: Native support coming soon'}
                        >
                          <span>{name}</span>
                          <span className="text-[8.5px] uppercase tracking-wider px-1 py-0.2 rounded bg-[var(--line)] text-[var(--accent-2)] border border-[var(--line)]">
                            TODO
                          </span>
                        </button>
                        <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg)] text-[var(--fg)] border border-[var(--border)] px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap shadow-lg z-20">
                          {locale === 'pt' ? 'TODO: Em breve' : 'TODO: Coming soon'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right: Transport Mode Switcher */}
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: 'streamable' as const, label: 'Streamable', title: 'Modern Streamable HTTP endpoint' },
                      { id: 'sse' as const, label: 'SSE', title: 'Legacy HTTP + SSE endpoint' },
                      { id: 'cli' as const, label: 'CLI (Local)', title: 'Zero-install CLI execution' },
                    ].map((t, idx) => {
                      const isSelected = mode === t.id
                      return (
                        <div key={t.id} className="inline-flex items-center gap-2">
                          {idx > 0 && (
                            <span className="text-[var(--border)] text-[10px] select-none" aria-hidden="true">
                              •
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setMode(t.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all border outline-none cursor-pointer ${
                              isSelected
                                ? 'bg-[var(--line)] border-[var(--accent)] text-[var(--accent)] font-semibold shadow-sm opacity-100'
                                : 'bg-[var(--bg)]/60 border-[var(--border)] text-[var(--dim)] opacity-60 hover:opacity-100 hover:text-[var(--fg)] hover:border-[var(--accent)]/60'
                            } focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:opacity-100`}
                            title={t.title}
                          >
                            {t.label}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Full-width Connector URL / Command display (never cut off) */}
                <div className="p-3 rounded-md bg-[var(--bg)] border border-[var(--border)] font-mono text-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-[var(--accent)] select-none font-bold">$</span>
                    <span className="text-[var(--fg)] select-all break-all">{connectorUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerCopy(connectorUrl, 'connector-url')}
                    className="shrink-0 px-2.5 py-1.5 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--dim)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors cursor-pointer inline-flex items-center gap-1.5 focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
                    title={copiedKey === 'connector-url' ? 'Copied!' : 'Copy to clipboard'}
                    aria-label="Copy connector URL"
                  >
                    {copiedKey === 'connector-url' ? <CheckIcon /> : <CopyIcon />}
                    <span className="text-[11px] font-mono">
                      {copiedKey === 'connector-url'
                        ? (locale === 'pt' ? 'Copiado' : 'Copied')
                        : (locale === 'pt' ? 'Copiar' : 'Copy')}
                    </span>
                  </button>
                </div>

                {/* 3 Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                  {/* Step 1 */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="size-5 rounded-full bg-[var(--line)] text-[var(--accent)] font-mono font-bold flex items-center justify-center text-[11px]">
                        1
                      </span>
                      <strong className="text-[var(--fg)]">
                        {mode === 'cli'
                          ? (locale === 'pt' ? 'Comando de execucao' : 'Run CLI command')
                          : (locale === 'pt' ? 'Copie o endpoint' : 'Copy endpoint URL')}
                      </strong>
                    </div>
                    <p className="text-[var(--dim)] text-[11px] leading-relaxed">
                      {mode === 'streamable'
                        ? (locale === 'pt' ? 'Endpoint Streamable HTTP unificado recomendado pelo padrao MCP.' : 'Unified Streamable HTTP endpoint recommended by modern MCP spec.')
                        : mode === 'sse'
                          ? (locale === 'pt' ? 'Endpoint SSE compativel com clientes e IDEs legadas.' : 'Legacy SSE endpoint for backwards-compatible IDEs.')
                          : (locale === 'pt' ? 'Inicie instantaneamente sem instalacao previa via npx.' : 'Zero-installation runner via npx execution.')}
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="size-5 rounded-full bg-[var(--line)] text-[var(--accent)] font-mono font-bold flex items-center justify-center text-[11px]">
                        2
                      </span>
                      <strong className="text-[var(--fg)]">
                        {locale === 'pt' ? 'Configure no cliente' : 'Configure client'}
                      </strong>
                    </div>
                    <p className="text-[var(--dim)] text-[11px] leading-relaxed">
                      {stepInfo[locale][0]}
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="size-5 rounded-full bg-[var(--line)] text-[var(--accent)] font-mono font-bold flex items-center justify-center text-[11px]">
                        3
                      </span>
                      <strong className="text-[var(--fg)]">
                        {locale === 'pt' ? 'Pronto para usar' : 'Ready to use'}
                      </strong>
                    </div>
                    <p className="text-[var(--dim)] text-[11px] leading-relaxed">
                      {stepInfo[locale][1]}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--line)] flex flex-wrap items-center justify-between text-[11px] text-[var(--dim)]">
                  <span>
                    {locale === 'pt'
                      ? 'Recomendado: use Streamable HTTP para servicos remotos e CLI Go para dev local.'
                      : 'Recommended: use Streamable HTTP for remote services and Go CLI for local dev.'}
                  </span>
                  <a
                    href="https://github.com/H0wZy/mcp"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--accent)] hover:underline"
                  >
                    GitHub Repository ↗
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Quickstart & CLI with Copy Buttons */}
          <section id="quickstart" className="section">
            <div className="wrap">
              <h2 className="text-xl font-semibold mb-4 text-[var(--fg)]">
                {locale === 'pt' ? 'Inicio Rapido & CLI' : 'Quick Start & CLI'}
              </h2>

              <div className="flex flex-col gap-3 font-mono text-xs">
                {[
                  { label: '# 1. Instant execution via npx:', cmd: 'npx @h0wzy/mcp', key: 'cmd-npx' },
                  { label: '# 2. Global install with hmcp CLI:', cmd: 'npm install -g @h0wzy/mcp && hmcp', key: 'cmd-npm' },
                  { label: '# 3. Direct from source with Go:', cmd: 'go run ./cli setup-path && hmcp', key: 'cmd-go' },
                ].map((item) => (
                  <div key={item.key} className="p-3 rounded bg-[var(--surface)] border border-[var(--border)]">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[var(--dim)]">{item.label}</span>
                      <button
                        type="button"
                        onClick={() => triggerCopy(item.cmd, item.key)}
                        className="p-1 rounded border-0 outline-none bg-transparent text-[var(--dim)] hover:text-[var(--accent)] hover:bg-[var(--line)] transition-colors cursor-pointer"
                        title={copiedKey === item.key ? 'Copied!' : 'Copy command'}
                        aria-label="Copy command"
                      >
                        {copiedKey === item.key ? <CheckIcon /> : <CopyIcon />}
                      </button>
                    </div>
                    <code className="text-[var(--accent)] font-bold text-sm select-all block">{item.cmd}</code>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Official Packages */}
          <section id="packages" className="section">
            <div className="wrap">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--fg)]">
                    {locale === 'pt' ? 'Pacotes Oficiais npm' : 'Official npm Packages'}
                  </h2>
                  <p className="text-xs text-[var(--dim)]">
                    {locale === 'pt' ? 'Publicados e versionados no registro publico do npm.' : 'Published and versioned on the public npm registry.'}
                  </p>
                </div>
                <a
                  href="https://www.npmjs.com/~h0wzy"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs text-[var(--accent)] hover:underline"
                >
                  npmjs.com/~h0wzy ↗
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                {PACKAGES.map((pkg) => (
                  <a
                    key={pkg.n}
                    href={`https://www.npmjs.com/package/${pkg.n}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors block space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-[var(--accent)] text-sm">{pkg.n}</strong>
                      <span className="text-[var(--dim)] text-[11px]">v1.0.3</span>
                    </div>
                    <p className="text-[var(--dim)] text-[11px] leading-relaxed">{pkg.d}</p>
                    <div className="text-[10px] text-[var(--dim)] pt-1 border-t border-[var(--line)]">
                      Published via GitHub Actions
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Supported AI CLIs */}
          <section id="bridges" className="section">
            <div className="wrap">
              <h2 className="text-xl font-semibold mb-4 text-[var(--fg)]">
                {locale === 'pt' ? 'CLIs de IA Suportados' : 'Supported AI Developer CLIs'}
              </h2>

              <div className="space-y-3 font-mono text-xs">
                {BRIDGES.map((b) => (
                  <div key={b.n} className="p-3 rounded border border-[var(--border)] bg-[var(--surface)]">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-[var(--fg)] text-sm">{b.n}</strong>
                      <span className="text-[var(--accent)] text-[11px]">{b.b}</span>
                    </div>
                    <p className="text-[var(--dim)] leading-relaxed">{b.d[locale]}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Standalone Binaries */}
          <section id="binaries" className="section">
            <div className="wrap">
              <h2 className="text-xl font-semibold mb-4 text-[var(--fg)]">
                {locale === 'pt' ? 'Binarios Avulsos (v1.0.3)' : 'Precompiled Standalone Binaries (v1.0.3)'}
              </h2>
              <p className="text-xs text-[var(--dim)] mb-4">
                {locale === 'pt'
                  ? 'Binarios nativos sem dependencias gerados via GoReleaser para Windows, Linux e macOS.'
                  : 'Zero-dependency native binaries compiled via GoReleaser for Windows, Linux, and macOS.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                {BINARIES.map((bin) => (
                  <a
                    key={bin.p}
                    href={`https://github.com/H0wZy/mcp/releases/download/v1.0.3/${bin.f}`}
                    className="p-3 rounded border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors block"
                  >
                    <span className="text-[var(--fg)] font-semibold block mb-1">{bin.p}</span>
                    <span className="text-[var(--accent)] text-[11px]">{bin.f} ↗</span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Footer Component */}
          <Footer locale={locale} />
        </div>
      </main>
    </>
  )
}
