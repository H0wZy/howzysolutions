import { useEffect, useState } from 'react'
import type { Locale } from '../content/i18n/types'
import type { ContentBundle } from '../content/types'
import mcpData from '../content/mcp.generated.json'
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
  { n: '', d: 'Interactive Go CLI runner and hub orchestrator' },
  { n: '-shared', d: 'Cross-platform utilities and JSON-RPC stdio engine' },
  { n: '-server-antigravity', d: 'Google Antigravity MCP Server connecting to Gemini 3.1' },
  { n: '-server-codex', d: 'OpenAI Codex MCP Server connecting to GPT-5.6 / GPT-6' },
]

const BINARIES = [
  { p: 'Windows (amd64)', f: 'windows-amd64.exe' },
  { p: 'Linux (amd64)', f: 'linux-amd64' },
  { p: 'macOS (arm64)', f: 'darwin-arm64' },
  { p: 'macOS (amd64)', f: 'darwin-amd64' },
]

const BRIDGES = [
  {
    n: 'Claude Code',
    b: 'Anthropic',
    d: {
      en: 'Native ~/.claude.json bridge to invoke codex and agy.',
      pt: 'Bridge ~/.claude.json para invocar codex e agy.',
    },
  },
  {
    n: 'OpenAI Codex CLI',
    b: 'GPT-5.6 / GPT-6',
    d: {
      en: 'Bridge for Codex CLI with sanitization and timeout.',
      pt: 'Bridge para CLI Codex com protecao e timeout.',
    },
  },
  {
    n: 'Google Antigravity',
    b: 'Gemini 3.1',
    d: {
      en: 'Connects agy CLI and IDE via mcp_config.json.',
      pt: 'Conecta agy CLI e IDE via mcp_config.json.',
    },
  },
]

const CLAUDE_STEPS = {
  en: ['Run: claude mcp add h0wzy-mcp -- npx -y @h0wzy/mcp', 'Claude Code invokes codex and agy autonomously.'],
  pt: ['Execute: claude mcp add h0wzy-mcp -- npx -y @h0wzy/mcp', 'Claude Code invoca codex e agy com autonomia.'],
}

function Svg({ children, className = 'size-3.5 shrink-0' }: { children: React.ReactNode; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

function CopyIcon() {
  return (
    <Svg>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </Svg>
  )
}

function CheckIcon() {
  return (
    <Svg className="size-3.5 shrink-0 text-[var(--accent)]">
      <polyline points="20 6 9 17 4 12" />
    </Svg>
  )
}

function GithubIcon({ className = 'size-3.5 shrink-0' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.08.55-.17.55-.38v-1.49c-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52 0-.53.64 0 1.09.59 1.24.83.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .22.15.47.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

function ClaudeIcon() {
  return <img src="/assets/icons/claude.svg" alt="" aria-hidden="true" className="size-3.5 shrink-0" width={14} height={14} />
}

function OpenAIIcon() {
  return <img src="/assets/icons/chatgpt.svg" alt="" aria-hidden="true" className="size-3.5 shrink-0" width={14} height={14} />
}

function NpmIcon() {
  return <img src="/assets/icons/npm.svg" alt="" aria-hidden="true" className="size-3.5 shrink-0" width={14} height={14} />
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

  const copyFullMarkdown = async () => {
    try {
      const res = await fetch(locale === 'pt' ? '/pt/mcp.md' : '/mcp.md')
      if (res.ok) {
        await navigator.clipboard.writeText(await res.text())
        setCopiedKey('page-md')
        setDropdownOpen(false)
        setTimeout(() => setCopiedKey((cur) => (cur === 'page-md' ? null : cur)), 3000)
      }
    } catch {
      // Fallback
    }
  }

  const triggerCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key)
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
                  H0wZy/mcp {mcpData.version}
                </span>
                <span className="text-xs text-[var(--dim)]">MIT · Go 1.26+ · Node 20+</span>
              </div>

              <div className="flex items-center gap-2 relative">
                {/* GitHub Star Button */}
                <a
                  href="https://github.com/H0wZy/mcp"
                  target="_blank"
                  rel="noreferrer"
                  className="chrome-btn inline-flex items-center gap-2 text-xs font-mono"
                  title="GitHub repository"
                >
                  <GithubIcon />
                  <span>GitHub</span>
                  <span className="text-[var(--accent)] font-semibold">★ {stars !== null ? stars : mcpData.stars}</span>
                </a>

                {/* Shadcn-inspired Copy Page Dropdown */}
                <div className="relative inline-flex items-center">
                  <button
                    type="button"
                    onClick={copyFullMarkdown}
                    className="chrome-btn inline-flex items-center gap-2 text-xs bg-[var(--surface)] hover:text-[var(--accent)] rounded-r-none border-r-0"
                    title={locale === 'pt' ? 'Copiar pagina inteira como Markdown' : 'Copy entire page as Markdown'}
                  >
                    {copiedKey === 'page-md' ? <CheckIcon /> : <CopyIcon />}
                    <span>
                      {copiedKey === 'page-md'
                        ? (locale === 'pt' ? 'Copiado!' : 'Copied!')
                        : (locale === 'pt' ? 'Copiar Pagina' : 'Copy Page')}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="chrome-btn px-2 text-xs bg-[var(--surface)] hover:text-[var(--accent)] rounded-l-none"
                    aria-expanded={dropdownOpen}
                    title={locale === 'pt' ? 'Mais opcoes' : 'More options'}
                  >
                    <span>▾</span>
                  </button>

                  {dropdownOpen ? (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded border border-[var(--border)] bg-[var(--surface)] shadow-2xl p-1 z-50 flex flex-col gap-0.5 text-xs font-mono">
                      <a
                        href={locale === 'pt' ? '/pt/mcp.md' : '/mcp.md'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-left px-2.5 py-1.5 rounded hover:bg-[var(--line)] text-[var(--accent)] transition-colors flex items-center gap-2"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span className="text-[10px] px-1 py-0.5 rounded border border-[var(--accent)] font-bold">M↓</span>
                        <span>{locale === 'pt' ? 'Ver como Markdown' : 'View as Markdown'}</span>
                      </a>
                      <a
                        href="https://claude.ai/new?q=H0wZy/mcp"
                        target="_blank"
                        rel="noreferrer"
                        className="text-left px-2.5 py-1.5 rounded hover:bg-[var(--line)] text-[var(--accent)] transition-colors flex items-center gap-2"
                      >
                        <ClaudeIcon />
                        <span>Open in Claude ↗</span>
                      </a>
                      <a
                        href="https://chatgpt.com/?q=H0wZy/mcp"
                        target="_blank"
                        rel="noreferrer"
                        className="text-left px-2.5 py-1.5 rounded hover:bg-[var(--line)] text-[var(--accent)] transition-colors flex items-center gap-2"
                      >
                        <OpenAIIcon />
                        <span>Open in ChatGPT ↗</span>
                      </a>
                      <a
                        href="https://www.npmjs.com/package/@h0wzy/mcp"
                        target="_blank"
                        rel="noreferrer"
                        className="text-left px-2.5 py-1.5 rounded hover:bg-[var(--line)] text-[var(--accent)] transition-colors flex items-center gap-2 border-t border-[var(--line)] pt-1 mt-0.5"
                      >
                        <NpmIcon />
                        <span>View on npm ↗</span>
                      </a>
                      <a
                        href="https://github.com/H0wZy/mcp"
                        target="_blank"
                        rel="noreferrer"
                        className="text-left px-2.5 py-1.5 rounded hover:bg-[var(--line)] text-[var(--accent)] transition-colors flex items-center gap-2"
                      >
                        <GithubIcon />
                        <span>GitHub Repository ↗</span>
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
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
                      H0wZy/mcp {mcpData.version} • Multi-Agent MCP Hub
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
                      <button
                        key={name}
                        type="button"
                        disabled
                        className="px-2.5 py-1 rounded text-[11px] font-mono border border-dashed border-[var(--border)] bg-[var(--bg)]/60 text-[var(--dim)] opacity-50 cursor-not-allowed inline-flex items-center gap-1 select-none transition-opacity hover:opacity-80"
                        title={locale === 'pt' ? 'TODO: Suporte em breve' : 'TODO: Coming soon'}
                      >
                        <span>{name}</span>
                        <span className="text-[8.5px] uppercase tracking-wider px-1 py-0.2 rounded bg-[var(--line)] text-[var(--accent-2)] border border-[var(--line)]">
                          TODO
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Right: Transport Mode Switcher */}
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: 'streamable' as const, label: 'Streamable', title: 'Modern Streamable HTTP endpoint' },
                      { id: 'sse' as const, label: 'SSE', title: 'Legacy HTTP + SSE endpoint' },
                      { id: 'cli' as const, label: 'CLI', title: 'Zero-install CLI execution' },
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
                  {[
                    {
                      title:
                        mode === 'cli'
                          ? (locale === 'pt' ? 'Comando de execucao' : 'Run CLI command')
                          : (locale === 'pt' ? 'Copie o endpoint' : 'Copy endpoint URL'),
                      desc:
                        mode === 'streamable'
                          ? (locale === 'pt' ? 'Endpoint Streamable HTTP unificado recomendado pelo MCP.' : 'Unified Streamable HTTP endpoint recommended by modern MCP spec.')
                          : mode === 'sse'
                            ? (locale === 'pt' ? 'Endpoint SSE compativel com IDEs legadas.' : 'Legacy SSE endpoint for backwards-compatible IDEs.')
                            : (locale === 'pt' ? 'Inicie instantaneamente sem instalacao previa via npx.' : 'Zero-installation runner via npx execution.'),
                    },
                    {
                      title: locale === 'pt' ? 'Configure no cliente' : 'Configure client',
                      desc: stepInfo[locale][0],
                    },
                    {
                      title: locale === 'pt' ? 'Pronto para usar' : 'Ready to use',
                      desc: stepInfo[locale][1],
                    },
                  ].map((s, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="size-5 rounded-full bg-[var(--line)] text-[var(--accent)] font-mono font-bold flex items-center justify-center text-[11px]">
                          {i + 1}
                        </span>
                        <strong className="text-[var(--fg)]">{s.title}</strong>
                      </div>
                      <p className="text-[var(--dim)] text-[11px] leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
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
                  { label: '# 1. Instant execution:', cmd: 'npx @h0wzy/mcp', key: 'cmd-npx' },
                  { label: '# 2. Global install:', cmd: 'npm install -g @h0wzy/mcp && hmcp', key: 'cmd-npm' },
                  { label: '# 3. From source (Go):', cmd: 'go run ./cli setup-path && hmcp', key: 'cmd-go' },
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
                {PACKAGES.map((pkg) => {
                  const pkgName = `@h0wzy/mcp${pkg.n}`
                  return (
                    <a
                      key={pkg.n}
                      href={`https://www.npmjs.com/package/${pkgName}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors block space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-[var(--accent)] text-sm">{pkgName}</strong>
                        <span className="text-[var(--dim)] text-[11px]">{mcpData.version}</span>
                      </div>
                      <p className="text-[var(--dim)] text-[11px] leading-relaxed">{pkg.d}</p>
                      <div className="text-[10px] text-[var(--dim)] pt-1 border-t border-[var(--line)]">
                        Published via GitHub Actions
                      </div>
                    </a>
                  )
                })}
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
                {locale === 'pt' ? `Binarios Avulsos (${mcpData.version})` : `Precompiled Standalone Binaries (${mcpData.version})`}
              </h2>
              <p className="text-xs text-[var(--dim)] mb-4">
                {locale === 'pt'
                  ? 'Binarios nativos sem dependencias gerados via GoReleaser para Windows, Linux e macOS.'
                  : 'Zero-dependency native binaries compiled via GoReleaser for Windows, Linux, and macOS.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                {BINARIES.map((bin) => {
                  const binName = `h0wzy-mcp-${bin.f}`
                  return (
                    <a
                      key={bin.p}
                      href={`https://github.com/H0wZy/mcp/releases/download/${mcpData.version}/${binName}`}
                      className="p-3 rounded border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors block"
                    >
                      <span className="text-[var(--fg)] font-semibold block mb-1">{bin.p}</span>
                      <span className="text-[var(--accent)] text-[11px]">{binName} ↗</span>
                    </a>
                  )
                })}
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
