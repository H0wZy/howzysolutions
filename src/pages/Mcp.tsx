import { useEffect, useState } from 'react'
import type { Locale } from '../content/i18n/types'
import type { ContentBundle } from '../content/types'
import { Chrome } from '../components/Chrome'
import { SectionRail, type RailEntry } from '../components/SectionRail'

const TOC_ENTRIES: RailEntry[] = [
  { id: 'overview', label: { en: 'Overview', pt: 'Visao Geral' } },
  { id: 'connector', label: { en: 'Connect Agent', pt: 'Conectar Agente' } },
  { id: 'quickstart', label: { en: 'Quickstart & CLI', pt: 'Inicio Rapido & CLI' } },
  { id: 'packages', label: { en: 'npm Packages', pt: 'Pacotes npm' } },
  { id: 'bridges', label: { en: 'Supported AI CLIs', pt: 'CLIs de IA' } },
  { id: 'binaries', label: { en: 'Standalone Binaries', pt: 'Binarios Avulsos' } },
]

type AgentTab = 'claude' | 'cursor' | 'claude-code' | 'codex' | 'antigravity'

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

const STEPS: Record<AgentTab, { en: [string, string]; pt: [string, string]; action?: string }> = {
  claude: {
    en: ['Settings → Connectors → Add H0wZy MCP and paste URL.', 'Connect and start cross-model code reviews.'],
    pt: ['Ajustes → Conectores → Adicione H0wZy MCP e cole a URL.', 'Conecte e execute revisoes multi-agente.'],
    action: 'https://claude.ai/new',
  },
  cursor: {
    en: ['Settings → Features → MCP → Add new server (SSE).', 'Invoke multi-agent tools directly in Cursor chat.'],
    pt: ['Settings → Features → MCP → Add new server (SSE).', 'Invoque ferramentas do hub no chat do Cursor.'],
  },
  'claude-code': {
    en: ['Run: claude mcp add h0wzy-mcp -- npx -y @h0wzy/mcp', 'Claude Code invokes codex and agy autonomously.'],
    pt: ['Execute: claude mcp add h0wzy-mcp -- npx -y @h0wzy/mcp', 'Claude Code invoca codex e agy com autonomia.'],
  },
  codex: {
    en: ['Run: codex mcp add h0wzy-mcp -- npx -y @h0wzy/mcp', 'Codex gains cross-bridge access to Gemini and Claude.'],
    pt: ['Execute: codex mcp add h0wzy-mcp -- npx -y @h0wzy/mcp', 'Codex acessa bridges para Gemini e Claude.'],
  },
  antigravity: {
    en: ['Add to ~/.gemini/config/mcp_config.json in mcpServers.', 'Google Antigravity and AGY CLI integrated instantly.'],
    pt: ['Adicione a ~/.gemini/config/mcp_config.json em mcpServers.', 'Google Antigravity e AGY CLI integrados instantaneamente.'],
  },
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
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<AgentTab>('claude')
  const [mode, setMode] = useState<'mcp' | 'cli'>('mcp')
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    fetch('https://api.github.com/repos/H0wZy/mcp')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => typeof d?.stargazers_count === 'number' && setStars(d.stargazers_count))
      .catch(() => {})
  }, [])

  const showCopied = (msg: string) => {
    setCopiedStatus(msg)
    setDropdownOpen(false)
    setTimeout(() => setCopiedStatus(null), 3000)
  }

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => showCopied(label))
  }

  const connectorUrl = mode === 'mcp' ? 'https://mcp.howzysolutions.com/sse' : 'npx @h0wzy/mcp'
  const stepInfo = STEPS[activeTab]

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
                {/* GitHub Star Button */}
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
                  <span className="inline-flex items-center gap-1 text-[var(--accent)] font-mono">
                    <svg className="size-3 fill-current text-[var(--accent-2)]" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
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
                          copyText(
                            `# H0wZy/mcp — Multi-Agent MCP Hub\nQuickstart: npx @h0wzy/mcp\nhttps://github.com/H0wZy/mcp`,
                            locale === 'pt' ? 'Markdown copiado!' : 'Markdown copied!',
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

            {copiedStatus ? (
              <div className="wrap mt-3">
                <div className="px-3 py-1 rounded bg-[var(--surface)] border border-[var(--accent)] text-[var(--accent)] text-xs font-mono inline-block">
                  ✓ {copiedStatus}
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
              <p className="sub text-lg text-[var(--dim)] mb-6">
                {locale === 'pt'
                  ? 'O Hub MCP Multi-Agente definitivo e CLI em Go conectando Claude Code, OpenAI Codex e Google Antigravity.'
                  : 'The Ultimate Multi-Agent MCP Hub and Go CLI connecting Claude Code, OpenAI Codex, and Google Antigravity.'}
              </p>

              {/* Real hmcp ASCII Banner & Terminal Preview */}
              <div className="rounded-lg bg-[var(--bg)] border border-[var(--border)] overflow-hidden shadow-2xl font-mono text-xs">
                <div className="px-4 py-2.5 bg-[var(--surface)] border-b border-[var(--line)] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--term-user)] font-semibold">h0wzy@h0wzy</span>
                    <span className="text-[var(--dim)]">in</span>
                    <span className="text-[var(--accent)]">~</span>
                    <span className="text-[var(--dim)]">at</span>
                    <span className="text-[var(--accent-2)]">2h 32m 19s</span>
                    <span className="text-[var(--dim)]">w/</span>
                    <span className="text-[var(--fg)]">pwsh</span>
                  </div>
                  <span className="text-[var(--dim)]">Go 1.26+</span>
                </div>

                <div className="p-5 overflow-x-auto space-y-4">
                  <div className="text-[var(--dim)]">
                    <span className="text-[var(--accent)] font-bold">❯ </span>
                    <span className="text-[var(--fg)] font-bold">hmcp</span>
                  </div>

                  {/* Gradient ASCII Banner */}
                  <pre
                    className="leading-tight font-black select-none tracking-tighter"
                    style={{
                      background: 'linear-gradient(180deg, #e9d5ff 0%, #c084fc 35%, #9333ea 70%, #6b21a8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
{`██╗  ██╗ ██████╗ ██╗    ██╗███████╗██╗   ██╗  ███╗   ███╗  ██████╗ ███████╗
██║  ██║██╔═████╗██║    ██║╚══███╔╝╚██╗ ██╔╝  ████╗ ████║ ██╔════╝ ██╔══██╗
███████║██║██╔██║██║ █╗ ██║  ███╔╝   ╚████╔╝  ██╔████╔██║ ██║      ██████╔╝
██╔══██║████╔╝██║██║███╗██║ ███╔╝     ╚██╔╝   ██║╚██╔╝██║ ██║      ██╔═══╝
██║  ██║╚██████╔╝╚███╔███╔╝███████╗    ██║    ██║ ╚═╝ ██║ ╚██████╗ ██║
╚═╝  ╚═╝ ╚═════╝  ╚══╝╚══╝ ╚══════╝    ╚═╝    ╚═╝     ╚═╝  ╚═════╝ ╚═╝`}
                  </pre>

                  <div className="space-y-1 text-xs">
                    <div className="text-[var(--fg)] font-semibold">
                      H0wZy/mcp v1.0.3 • Multi-Agent MCP Hub
                    </div>
                    <div className="text-[var(--term-user)]">
                      Claude Code ↔ OpenAI Codex ↔ Google Antigravity
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--line)] space-y-2 text-[11px]">
                    <div className="text-[var(--accent)] font-semibold">
                      🔍 Scanning local AI developer CLIs...
                    </div>
                    <div className="pl-2 space-y-0.5 text-[var(--fg)]">
                      <div><span className="text-[var(--accent)]">✓</span> Claude Code <span className="text-[var(--dim)]">(C:\Users\h0wzy\.local\bin\claude.exe)</span></div>
                      <div><span className="text-[var(--accent)]">✓</span> OpenAI Codex CLI <span className="text-[var(--dim)]">(C:\Users\h0wzy\AppData\Roaming\npm\codex.cmd)</span></div>
                      <div><span className="text-[var(--accent)]">✓</span> Google Antigravity <span className="text-[var(--dim)]">(C:\Users\h0wzy\AppData\Local\agy\bin\agy.exe)</span></div>
                    </div>

                    <div className="pt-2 text-[var(--accent-2)] font-semibold">
                      Select MCP bridges to configure:
                    </div>
                    <div className="pl-2 space-y-0.5 text-[var(--dim)]">
                      <div className="text-[var(--term-user)] font-semibold">&gt; Claude Code ↔ Google Antigravity (Gemini 3.1 Pro/Flash)</div>
                      <div>  Claude Code ↔ OpenAI Codex (GPT-5.6 / GPT-6 Astra)</div>
                      <div>  OpenAI Codex ↔ Google Antigravity (Gemini 3.1)</div>
                      <div>  Google Antigravity ↔ OpenAI Codex</div>
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
                  ? 'Inspirado em conectores universais. Escolha sua IDE ou agente e conecte em 3 passos simples.'
                  : 'Inspired by universal AI connectors. Select your client and connect in 3 simple steps.'}
              </p>

              <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--border)] shadow-xl space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(['claude', 'cursor', 'claude-code', 'codex', 'antigravity'] as AgentTab[]).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                          activeTab === tab
                            ? 'bg-[var(--line)] text-[var(--accent)] border border-[var(--accent)] font-semibold'
                            : 'text-[var(--dim)] hover:text-[var(--fg)] hover:bg-[var(--bg)]'
                        }`}
                      >
                        {tab === 'claude' && 'Claude'}
                        {tab === 'cursor' && 'Cursor'}
                        {tab === 'claude-code' && 'Claude Code'}
                        {tab === 'codex' && 'OpenAI Codex'}
                        {tab === 'antigravity' && 'Antigravity'}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 p-0.5 rounded bg-[var(--bg)] border border-[var(--border)] text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setMode('mcp')}
                      className={`px-2.5 py-1 rounded ${
                        mode === 'mcp' ? 'bg-[var(--surface)] text-[var(--accent)] font-semibold' : 'text-[var(--dim)]'
                      }`}
                    >
                      MCP (SSE)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('cli')}
                      className={`px-2.5 py-1 rounded ${
                        mode === 'cli' ? 'bg-[var(--surface)] text-[var(--accent)] font-semibold' : 'text-[var(--dim)]'
                      }`}
                    >
                      CLI (Local)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                  {/* Step 1 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="size-5 rounded-full bg-[var(--line)] text-[var(--accent)] font-mono font-bold flex items-center justify-center text-[11px]">
                        1
                      </span>
                      <strong className="text-[var(--fg)]">
                        {mode === 'mcp'
                          ? (locale === 'pt' ? 'Copie a URL do conector' : 'Copy connector URL')
                          : (locale === 'pt' ? 'Comando de execucao' : 'Run CLI command')}
                      </strong>
                    </div>
                    <p className="text-[var(--dim)] text-[11px]">
                      {mode === 'mcp'
                        ? (locale === 'pt' ? 'Cole este endpoint no seu cliente MCP na proxima etapa.' : "You'll paste this URL into your client in the next step.")
                        : (locale === 'pt' ? 'Inicie instantaneamente sem instalacao previa.' : 'Zero installation execution via npx runner.')}
                    </p>

                    <div className="flex items-center gap-1 p-2 rounded bg-[var(--bg)] border border-[var(--border)] font-mono text-[11px]">
                      <span className="truncate text-[var(--fg)] select-all">{connectorUrl}</span>
                      <button
                        type="button"
                        onClick={() => copyText(connectorUrl, locale === 'pt' ? 'URL copiada!' : 'URL copied!')}
                        className="ml-auto text-[var(--accent)] hover:text-[var(--fg)] px-2 py-0.5 rounded border border-[var(--line)]"
                        title="Copy to clipboard"
                      >
                        {locale === 'pt' ? 'Copiar' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-2">
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
                  <div className="space-y-2">
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
                    {stepInfo.action ? (
                      <a
                        href={stepInfo.action}
                        target="_blank"
                        rel="noreferrer"
                        className="btn inline-block text-xs font-mono mt-2"
                      >
                        {locale === 'pt' ? 'Abrir Claude ↗' : 'Open Claude ↗'}
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--line)] flex flex-wrap items-center justify-between text-[11px] text-[var(--dim)]">
                  <span>
                    {locale === 'pt'
                      ? 'Se estiver usando Claude Code ou Codex localmente, prefira a CLI Go interativa.'
                      : 'If you are using Claude Code or Codex locally, it is best to use the Go CLI.'}
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

          {/* Quickstart & CLI */}
          <section id="quickstart" className="section">
            <div className="wrap">
              <h2 className="text-xl font-semibold mb-4 text-[var(--fg)]">
                {locale === 'pt' ? 'Inicio Rapido & CLI' : 'Quick Start & CLI'}
              </h2>

              <div className="flex flex-col gap-3 font-mono text-xs">
                <div className="p-3 rounded bg-[var(--surface)] border border-[var(--border)]">
                  <span className="text-[var(--dim)] block mb-1"># 1. Instant execution via npx:</span>
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
        </div>
      </main>
    </>
  )
}
