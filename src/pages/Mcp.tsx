import { useState } from 'react'
import type { Locale } from '../content/i18n/types'
import type { ContentBundle } from '../content/types'
import { Chrome } from '../components/Chrome'
import { SectionRail, type RailEntry } from '../components/SectionRail'

const TOC_ENTRIES: RailEntry[] = [
  { id: 'what-is-it', label: { en: 'What is H0wZy/mcp?', pt: 'O que e H0wZy/mcp?' } },
  { id: 'three-things', label: { en: 'Key Advantages', pt: 'Principais Vantagens' } },
  { id: 'quickstart', label: { en: 'Quick Start', pt: 'Inicio Rapido' } },
  { id: 'binaries', label: { en: 'Standalone Binaries', pt: 'Binarios Avulsos' } },
  { id: 'bridges', label: { en: 'Supported AI CLIs', pt: 'CLIs de IA Suportados' } },
  { id: 'architecture', label: { en: 'Architecture & Hub', pt: 'Arquitetura e Hub' } },
  { id: 'home-server', label: { en: 'Public URL & Tunnel', pt: 'URL Publica e Tunnel' } },
]

export function Mcp({
  locale,
  pathname,
}: {
  content: ContentBundle
  locale: Locale
  pathname: string
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null)

  const showCopied = (msg: string) => {
    setCopiedStatus(msg)
    setDropdownOpen(false)
    setTimeout(() => setCopiedStatus(null), 3000)
  }

  const copyPageMarkdown = () => {
    const md = `# H0wZy/mcp — Multi-Agent MCP Hub & Go CLI\n\nCentralize, enhance, and distribute high-performance Model Context Protocol (MCP) servers connecting Claude Code, OpenAI Codex, and Google Antigravity.\n\nQuickstart:\n- Instant execution: npx @h0wzy/mcp\n- Global install: npm i -g @h0wzy/mcp && hmcp\n- Go source: go run ./cli setup-path\n\nGitHub: https://github.com/H0wZy/mcp\nShowcase: https://howzysolutions.com/mcp`
    navigator.clipboard.writeText(md).then(() => showCopied(locale === 'pt' ? 'Markdown copiado!' : 'Markdown copied!'))
  }

  const copyCursorConfig = () => {
    const snippet = JSON.stringify(
      {
        mcpServers: {
          'h0wzy-mcp': {
            command: 'npx',
            args: ['-y', '@h0wzy/mcp'],
          },
        },
      },
      null,
      2,
    )
    navigator.clipboard.writeText(snippet).then(() => showCopied('Cursor MCP config copied!'))
  }

  const copyVsCodeConfig = () => {
    const snippet = JSON.stringify(
      {
        servers: {
          'h0wzy-mcp': {
            command: 'npx',
            args: ['-y', '@h0wzy/mcp'],
          },
        },
      },
      null,
      2,
    )
    navigator.clipboard.writeText(snippet).then(() => showCopied('VS Code MCP config copied!'))
  }

  const copyMcpCommand = () => {
    navigator.clipboard.writeText('npx @h0wzy/mcp').then(() => showCopied(locale === 'pt' ? 'Comando MCP copiado!' : 'MCP command copied!'))
  }

  return (
    <>
      <Chrome locale={locale} pathname={pathname} />

      <main className="document-layout">
        <SectionRail entries={TOC_ENTRIES} locale={locale} />

        <div className="document-body">
          {/* Top Bar Header */}
          <header className="section">
            <div className="wrap flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--line)]">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm px-2.5 py-1 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] font-semibold">
                  H0wZy/mcp v1.0.3
                </span>
                <span className="font-mono text-xs text-[var(--dim)]">
                  MIT License · Go 1.26+ · Node 20+
                </span>
              </div>

              <div className="flex items-center gap-2 relative">
                <a
                  href="https://github.com/H0wZy/mcp"
                  target="_blank"
                  rel="noreferrer"
                  className="chrome-btn inline-flex items-center gap-1.5 text-xs"
                >
                  <span>⭐ GitHub</span>
                  <span className="text-[var(--accent)] font-mono">v1.0.3</span>
                </a>

                <div className="relative">
                  <button
                    type="button"
                    className="chrome-btn inline-flex items-center gap-1.5 text-xs bg-[var(--surface)] hover:text-[var(--accent)]"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}
                  >
                    <span>{locale === 'pt' ? 'Copiar / Conectar' : 'Copy page'}</span>
                    <span className="text-xs">▾</span>
                  </button>

                  {dropdownOpen ? (
                    <div className="absolute right-0 mt-2 w-72 rounded border border-[var(--border)] bg-[var(--surface)] shadow-2xl p-2 z-50 flex flex-col gap-1 text-xs font-mono">
                      <button
                        type="button"
                        onClick={copyPageMarkdown}
                        className="text-left px-3 py-2 rounded hover:bg-[var(--line)] hover:text-[var(--accent)] transition-colors flex flex-col"
                      >
                        <span className="font-semibold text-[var(--fg)]">📄 {locale === 'pt' ? 'Copiar pagina' : 'Copy page'}</span>
                        <span className="text-[var(--dim)] text-[11px]">{locale === 'pt' ? 'Markdown para LLMs' : 'Copy as Markdown for LLMs'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={copyCursorConfig}
                        className="text-left px-3 py-2 rounded hover:bg-[var(--line)] hover:text-[var(--accent)] transition-colors flex flex-col"
                      >
                        <span className="font-semibold text-[var(--fg)]">⬡ Connect to Cursor</span>
                        <span className="text-[var(--dim)] text-[11px]">{locale === 'pt' ? 'Copiar config JSON para Cursor' : 'Install MCP Server on Cursor'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={copyVsCodeConfig}
                        className="text-left px-3 py-2 rounded hover:bg-[var(--line)] hover:text-[var(--accent)] transition-colors flex flex-col"
                      >
                        <span className="font-semibold text-[var(--fg)]">💻 Connect to VS Code</span>
                        <span className="text-[var(--dim)] text-[11px]">{locale === 'pt' ? 'Copiar config para VS Code' : 'Install MCP Server on VS Code'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={copyMcpCommand}
                        className="text-left px-3 py-2 rounded hover:bg-[var(--line)] hover:text-[var(--accent)] transition-colors flex flex-col"
                      >
                        <span className="font-semibold text-[var(--fg)]">🔌 {locale === 'pt' ? 'Copiar comando MCP' : 'Copy MCP command'}</span>
                        <span className="text-[var(--dim)] text-[11px]">npx @h0wzy/mcp</span>
                      </button>

                      <a
                        href="https://claude.ai/new?q=Tell%20me%20about%20the%20multi-agent%20MCP%20hub%20at%20github.com/H0wZy/mcp"
                        target="_blank"
                        rel="noreferrer"
                        className="text-left px-3 py-2 rounded hover:bg-[var(--line)] hover:text-[var(--accent)] transition-colors flex flex-col"
                      >
                        <span className="font-semibold text-[var(--fg)]">⚡ Open in Claude ↗</span>
                        <span className="text-[var(--dim)] text-[11px]">{locale === 'pt' ? 'Perguntar sobre este hub' : 'Ask questions about this hub'}</span>
                      </a>

                      <a
                        href="https://github.com/H0wZy/mcp/issues"
                        target="_blank"
                        rel="noreferrer"
                        className="text-left px-3 py-2 rounded hover:bg-[var(--line)] hover:text-[var(--accent)] transition-colors flex flex-col border-t border-[var(--line)] pt-2"
                      >
                        <span className="font-semibold text-[var(--fg)]">🐛 {locale === 'pt' ? 'Abrir uma issue' : 'Open an issue ↗'}</span>
                        <span className="text-[var(--dim)] text-[11px]">{locale === 'pt' ? 'Reportar bug ou sugerir recurso' : 'Report bug or request feature'}</span>
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {copiedStatus ? (
              <div className="wrap mt-3">
                <div className="px-3 py-1.5 rounded bg-[var(--surface)] border border-[var(--accent)] text-[var(--accent)] text-xs font-mono inline-block">
                  ✓ {copiedStatus}
                </div>
              </div>
            ) : null}
          </header>

          {/* Hero Section */}
          <section id="what-is-it" className="section">
            <div className="wrap">
              <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)] mb-3">
                {locale === 'pt' ? 'O que e H0wZy/mcp?' : 'What is H0wZy/mcp?'}
              </h1>
              <p className="sub text-lg text-[var(--dim)] mb-6">
                {locale === 'pt'
                  ? 'O Hub MCP Multi-Agente definitivo e CLI em Go conectando Claude Code, OpenAI Codex e Google Antigravity.'
                  : 'The Ultimate Multi-Agent MCP Hub and Go CLI connecting Claude Code, OpenAI Codex, and Google Antigravity.'}
              </p>

              {/* Terminal ASCII Banner Preview */}
              <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] font-mono text-xs overflow-x-auto shadow-xl">
                <pre className="text-[var(--term-user)] leading-none mb-3">
{` _   _  _____         ______       __  __  _____ _____  
| | | ||  _  |       |___  /      |  \\/  |/  __ \\  __ \\ 
| |_| || |/' |__  __    / / _   _ | .  . || /  \\/ |  \\/ 
|  _  ||  /| |\\ \\/\\ \\  / / | | | || |\\/| || |   | | __  
| | | |\\ |_/ / \\ \\/ /./ /__| |_| || |  | || \\__/\\ |_\\ \\ 
\\_| |_/ \\___/   \\_/  \\_____/\\__, |\\_|  |_/ \\____/\\____/ 
                             __/ |                      
                            |___/  `}
                </pre>
                <div className="flex flex-wrap items-center gap-3 text-[11px] pt-3 border-t border-[var(--line)]">
                  <span className="text-[var(--accent)] font-semibold">
                    [claude] ✓ Connected
                  </span>
                  <span className="text-[var(--accent)] font-semibold">
                    [codex] ✓ Connected
                  </span>
                  <span className="text-[var(--accent)] font-semibold">
                    [antigravity] ✓ Connected
                  </span>
                  <span className="text-[var(--dim)] ml-auto">
                    sub-50ms JSON-RPC 2.0 stdio
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Key Advantages */}
          <section id="three-things" className="section">
            <div className="wrap">
              <h2 className="text-xl font-semibold mb-4 text-[var(--fg)]">
                {locale === 'pt' ? 'Principais Vantagens' : 'Three Key Advantages'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface)]">
                  <span className="text-[var(--accent)] font-mono text-xs font-bold block mb-1">01 / DRY SHARED CORE</span>
                  <h3 className="font-semibold text-sm mb-2 text-[var(--fg)]">@h0wzy/mcp-shared</h3>
                  <p className="text-xs text-[var(--dim)] leading-relaxed">
                    {locale === 'pt'
                      ? 'Elimina duplicacao de codigo entre hosts. Um motor unico gerencia 100% de stdio JSON-RPC 2.0, handshakes e captura de erros.'
                      : 'Eliminates duplication across host agents. A single engine manages 100% of JSON-RPC 2.0 stdio handling, error catching and handshakes.'}
                  </p>
                </div>

                <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface)]">
                  <span className="text-[var(--accent)] font-mono text-xs font-bold block mb-1">02 / CROSS-PLATFORM</span>
                  <h3 className="font-semibold text-sm mb-2 text-[var(--fg)]">Native Windows & POSIX</h3>
                  <p className="text-xs text-[var(--dim)] leading-relaxed">
                    {locale === 'pt'
                      ? 'Zero glitches no Windows. Resolucao automatica de extensoes (.exe, .cmd, .bat) e delimitadores nativos sem overrides manuais de PATH.'
                      : 'Zero Windows glitches. Automatic PATHEXT resolution (.exe, .cmd, .bat) and native delimiters without manual PATH overrides.'}
                  </p>
                </div>

                <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface)]">
                  <span className="text-[var(--accent)] font-mono text-xs font-bold block mb-1">03 / PERFORMANCE</span>
                  <h3 className="font-semibold text-sm mb-2 text-[var(--fg)]">Sub-50ms Go TUI</h3>
                  <p className="text-xs text-[var(--dim)] leading-relaxed">
                    {locale === 'pt'
                      ? 'Execucao instantanea de binarios locais com menos de 50ms de overhead, removendo latencia de checagem de rede do npx.'
                      : 'Direct execution of local binaries with sub-50ms invocation overhead, removing runtime npx network check delays.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Start */}
          <section id="quickstart" className="section">
            <div className="wrap">
              <h2 className="text-xl font-semibold mb-4 text-[var(--fg)]">
                {locale === 'pt' ? 'Inicio Rapido' : 'Quick Start'}
              </h2>

              <div className="flex flex-col gap-3 font-mono text-xs">
                <div className="p-3 rounded bg-[var(--surface)] border border-[var(--border)]">
                  <span className="text-[var(--dim)] block mb-1"># 1. Instant execution via npx (Zero setup):</span>
                  <code className="text-[var(--accent)] font-bold text-sm select-all">npx @h0wzy/mcp</code>
                </div>

                <div className="p-3 rounded bg-[var(--surface)] border border-[var(--border)]">
                  <span className="text-[var(--dim)] block mb-1"># 2. Global install with hmcp CLI:</span>
                  <code className="text-[var(--accent)] font-bold text-sm select-all">npm install -g @h0wzy/mcp && hmcp</code>
                </div>

                <div className="p-3 rounded bg-[var(--surface)] border border-[var(--border)]">
                  <span className="text-[var(--dim)] block mb-1"># 3. Direct from source with Go:</span>
                  <code className="text-[var(--accent)] font-bold text-sm select-all">go run ./cli setup-path && hmcp</code>
                </div>
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
                <a
                  href="https://github.com/H0wZy/mcp/releases/download/v1.0.3/h0wzy-mcp-windows-amd64.exe"
                  className="p-3 rounded border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors block"
                >
                  <span className="text-[var(--fg)] font-semibold block mb-1">🪟 Windows (amd64)</span>
                  <span className="text-[var(--accent)] text-[11px]">h0wzy-mcp-windows-amd64.exe ↗</span>
                </a>

                <a
                  href="https://github.com/H0wZy/mcp/releases/download/v1.0.3/h0wzy-mcp-linux-amd64"
                  className="p-3 rounded border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors block"
                >
                  <span className="text-[var(--fg)] font-semibold block mb-1">🐧 Linux (amd64)</span>
                  <span className="text-[var(--accent)] text-[11px]">h0wzy-mcp-linux-amd64 ↗</span>
                </a>

                <a
                  href="https://github.com/H0wZy/mcp/releases/download/v1.0.3/h0wzy-mcp-darwin-arm64"
                  className="p-3 rounded border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors block"
                >
                  <span className="text-[var(--fg)] font-semibold block mb-1">🍏 macOS (arm64)</span>
                  <span className="text-[var(--accent)] text-[11px]">h0wzy-mcp-darwin-arm64 ↗</span>
                </a>
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
                <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface)]">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-[var(--fg)] text-sm">Claude Code</strong>
                    <span className="text-[var(--accent)] text-[11px]">Anthropic</span>
                  </div>
                  <p className="text-[var(--dim)] leading-relaxed">
                    {locale === 'pt'
                      ? 'Integracao nativa com ~/.claude.json. Permite que o Claude invoque codex e agy para revisoes de codigo e validacoes cruzadas.'
                      : 'Native integration with ~/.claude.json. Allows Claude to invoke codex and agy for code reviews and second opinions.'}
                  </p>
                </div>

                <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface)]">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-[var(--fg)] text-sm">OpenAI Codex CLI</strong>
                    <span className="text-[var(--accent)] text-[11px]">GPT-5.6 / GPT-6 Astra</span>
                  </div>
                  <p className="text-[var(--dim)] leading-relaxed">
                    {locale === 'pt'
                      ? 'Bridge para o CLI Codex oficial com sanitizacao de tokens de saida e execucao com timeout protegido.'
                      : 'Bridge for official Codex CLI with output token sanitization and protected timeout execution.'}
                  </p>
                </div>

                <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface)]">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-[var(--fg)] text-sm">Google Antigravity</strong>
                    <span className="text-[var(--accent)] text-[11px]">Gemini 3.1 Pro / Flash</span>
                  </div>
                  <p className="text-[var(--dim)] leading-relaxed">
                    {locale === 'pt'
                      ? 'Conexao com o CLI agy e antigravity IDE, injetando MCP servers em ~/.gemini/config/mcp_config.json.'
                      : 'Connection with agy CLI and antigravity IDE, injecting MCP servers in ~/.gemini/config/mcp_config.json.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Architecture & Hub */}
          <section id="architecture" className="section">
            <div className="wrap">
              <h2 className="text-xl font-semibold mb-4 text-[var(--fg)]">
                {locale === 'pt' ? 'Arquitetura e Hub' : 'System Architecture'}
              </h2>
              <p className="text-xs text-[var(--dim)] leading-relaxed mb-4">
                {locale === 'pt'
                  ? 'O H0wZy/mcp adota uma arquitetura desacoplada onde o CLI interativo em Go orquestra a configuracao, e o nucleo compartilhado executa servidores JSON-RPC 2.0 independentes para cada modelo de IA.'
                  : 'H0wZy/mcp adopts a decoupled architecture where the interactive Go CLI orchestrates configuration, and the shared core executes independent JSON-RPC 2.0 servers for each AI model.'}
              </p>

              <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] font-mono text-xs space-y-2">
                <div><span className="text-[var(--accent)] font-bold">H0wZy/mcp/</span></div>
                <div className="pl-4 text-[var(--dim)]">├── <strong className="text-[var(--fg)]">cli/</strong> : Interactive Go TUI (Bubble Tea / Lip Gloss)</div>
                <div className="pl-4 text-[var(--dim)]">├── <strong className="text-[var(--fg)]">servers/</strong> : Decoupled bridges (claude, codex, antigravity)</div>
                <div className="pl-4 text-[var(--dim)]">├── <strong className="text-[var(--fg)]">shared/</strong> : Reusable JSON-RPC 2.0 stdio engine (@h0wzy/mcp-shared)</div>
                <div className="pl-4 text-[var(--dim)]">├── <strong className="text-[var(--fg)]">npm/</strong> : Cross-platform binary installer & npx runner</div>
                <div className="pl-4 text-[var(--dim)]">└── <strong className="text-[var(--fg)]">specs/</strong> : Formal specifications and architecture diagrams</div>
              </div>
            </div>
          </section>

          {/* Home Server & Public Tunnel */}
          <section id="home-server" className="section">
            <div className="wrap">
              <h2 className="text-xl font-semibold mb-4 text-[var(--fg)]">
                {locale === 'pt' ? 'URL Publica e Cloudflare Tunnel' : 'Public Remote Endpoint & Cloudflare Tunnel'}
              </h2>
              <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] text-xs leading-relaxed space-y-3">
                <p className="text-[var(--dim)]">
                  {locale === 'pt'
                    ? 'Proximo marco arquitetural (Spec 004): exposicao de endpoint remoto SSE / Streamable HTTP hospedado no servidor domestico Ubuntu (h0wzy-server) via Cloudflare Tunnel.'
                    : 'Next architectural milestone (Spec 004): exposing a public remote SSE / Streamable HTTP endpoint hosted on the Ubuntu home server (h0wzy-server) via Cloudflare Tunnel.'}
                </p>

                <div className="p-3 rounded bg-[var(--bg)] border border-[var(--line)] font-mono">
                  <div className="text-[var(--accent)] font-semibold mb-1">
                    mcp.howzysolutions.com/sse
                  </div>
                  <div className="text-[var(--dim)] text-[11px]">
                    Internet → Cloudflare Edge → cloudflared tunnel → h0wzy-server (Docker) → MCP Hub
                  </div>
                </div>

                <p className="text-[var(--dim)] text-[11px]">
                  {locale === 'pt'
                    ? 'Isso permitira que agentes remotos e IDEs na nuvem se conectem diretamente ao servidor MCP sem depender de execucao local stdio.'
                    : 'This will allow remote agents and cloud IDEs to connect directly to the MCP server without requiring local stdio execution.'}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
