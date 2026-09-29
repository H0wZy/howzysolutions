import { useState, type CSSProperties, type ReactNode } from 'react'
import type { Locale } from '../content/i18n/types'
import type { ContentBundle } from '../content/types'
import mcpData from '../content/mcp.generated.json'
import tools from '../content/mcp-tools.json'
import { mcpPage as t, type TransportMode } from '../content/mcp-page'
import { Chrome } from '../components/Chrome'
import { CopyIcon } from '../components/CopyIcon'
import { SectionRail, type RailEntry } from '../components/SectionRail'
import { Footer } from '../components/Footer'

const TOC_ENTRIES: RailEntry[] = [
  { id: 'overview', label: t.toc.overview },
  { id: 'connector', label: t.toc.connector },
  { id: 'quickstart', label: t.toc.quickstart },
  { id: 'tools', label: t.toc.tools },
  { id: 'packages', label: t.toc.packages },
  { id: 'bridges', label: t.toc.bridges },
  { id: 'binaries', label: t.toc.binaries },
]

const BINARIES = [
  { p: 'Windows (amd64)', f: 'windows-amd64.exe' },
  { p: 'Linux (amd64)', f: 'linux-amd64' },
  { p: 'macOS (arm64)', f: 'darwin-arm64' },
  { p: 'macOS (amd64)', f: 'darwin-amd64' },
]

/*
 * The hmcp wordmark, as text. It was an SVG with a four-stop purple gradient,
 * which no token can reach and the design direction forbids; as text it takes
 * --accent like everything else and needs no file.
 */
const BANNER = [
  '██╗  ██╗ ██████╗ ██╗    ██╗███████╗██╗   ██╗   ███╗   ███╗ ██████╗██████╗ ',
  '██║  ██║██╔═══██╗██║    ██║╚══███╔╝╚██╗ ██╔╝   ████╗ ████║██╔════╝██╔══██╗',
  '███████║██║   ██║██║ █╗ ██║  ███╔╝   ╚████╔╝   ██╔████╔██║██║     ██████╔╝',
  '██╔══██║██║   ██║██║███╗██║ ███╔╝     ╚██╔╝    ██║╚██╔╝██║██║     ██╔═══╝ ',
  '██║  ██║╚██████╔╝╚███╔███╔╝███████╗    ██║     ██║ ╚═╝ ██║╚██████╗██║     ',
  '╚═╝  ╚═╝ ╚═════╝  ╚══╝╚══╝ ╚══════╝    ╚═╝     ╚═╝     ╚═╝ ╚═════╝╚═╝     ',
].join('\n')

/** A brand mark that keeps its own colours. */
function ImgIcon({ src }: { src: string }) {
  return <img src={src} alt="" aria-hidden="true" className="size-3.5 shrink-0" width={14} height={14} />
}

/** A single-colour glyph painted in the text's colour, so hover and tokens reach it. */
function MaskIcon({ src }: { src: string }) {
  return <span className="icon-mask" style={{ '--icon': `url(${src})` } as CSSProperties} aria-hidden="true" />
}

const GITHUB_ICON = <MaskIcon src="/brand/icons/github.svg" />

/**
 * `what` names the thing copied, for a screen reader: five buttons that all
 * announce "Copy" cannot be told apart, and the visible word alone cannot say
 * which one is which. The visible label still changes to "Copied!"; the
 * announcement itself comes from the page's status region.
 */
function CopyBtn({
  copied,
  onClick,
  locale,
  what,
}: {
  copied: boolean
  onClick: () => void
  locale: Locale
  what: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 px-2.5 py-1.5 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--dim)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors cursor-pointer inline-flex items-center gap-1.5 focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
    >
      <CopyIcon ok={copied} />
      <span className="text-[11px] font-mono">{copied ? t.copied[locale] : t.copy[locale]}</span>
      <span className="visually-hidden">{what}</span>
    </button>
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
  const [status, setStatus] = useState({ text: '', fail: false })

  const announce = (text: string, fail = false) => {
    setStatus({ text, fail })
    setTimeout(() => setStatus((cur) => (cur.text === text ? { text: '', fail: false } : cur)), 4000)
  }

  const flash = (key: string) => {
    setCopiedKey(key)
    announce(t.copied[locale])
    setTimeout(() => setCopiedKey((cur) => (cur === key ? null : cur)), 3000)
  }

  /* A rejected write (no permission, an unfocused document, an in-app webview)
     or a missing clipboard API both land here, and both say so on screen. */
  const triggerCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      flash(key)
    } catch {
      announce(t.copyFailed[locale], true)
    }
  }

  const mdUrl = locale === 'pt' ? '/pt/mcp.md' : '/mcp.md'

  /*
   * The clipboard write starts inside the click and the fetch is handed to it
   * as a promise: Safari rejects a write that only begins after an awaited
   * fetch, because by then the user gesture has expired. Where ClipboardItem is
   * missing the plain path runs, and where both fail the Markdown opens in a
   * tab, the same fallback the CV page uses.
   */
  const copyFullMarkdown = async () => {
    const markdown = () =>
      fetch(mdUrl).then((res) => {
        if (!res.ok) throw new Error(String(res.status))
        return res.text()
      })
    try {
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        const blob = markdown().then((text) => new Blob([text], { type: 'text/plain' }))
        await navigator.clipboard.write([new ClipboardItem({ 'text/plain': blob })])
      } else {
        await navigator.clipboard.writeText(await markdown())
      }
      flash('page-md')
      setDropdownOpen(false)
    } catch {
      window.open(mdUrl, '_blank')
    }
  }

  const connectorUrl =
    mode === 'streamable'
      ? 'https://mcp.howzysolutions.com/mcp'
      : mode === 'sse'
        ? 'https://mcp.howzysolutions.com/sse'
        : 'npx @h0wzy/mcp'

  const menu: { href: string; label: string; icon: ReactNode; border?: boolean }[] = [
    {
      href: mdUrl,
      label: t.viewMarkdown[locale],
      icon: <span className="text-[10px] px-1 py-0.5 rounded border border-[var(--accent)] font-bold">M↓</span>,
    },
    { href: 'https://claude.ai/new?q=H0wZy/mcp', label: t.openClaude[locale], icon: <ImgIcon src="/brand/icons/claude.svg" /> },
    { href: 'https://chatgpt.com/?q=H0wZy/mcp', label: t.openChatgpt[locale], icon: <ImgIcon src="/brand/icons/chatgpt.svg" /> },
    {
      href: 'https://www.npmjs.com/package/@h0wzy/mcp',
      label: t.viewNpm[locale],
      icon: <ImgIcon src="/brand/icons/npm.svg" />,
      border: true,
    },
    { href: 'https://github.com/H0wZy/mcp', label: t.githubRepoLink[locale], icon: GITHUB_ICON },
  ]

  return (
    <>
      <Chrome locale={locale} pathname={pathname} />

      <main className="document-layout">
        <SectionRail entries={TOC_ENTRIES} locale={locale} />

        <div className="document-body">
          {/* Where "Copied!" is announced, and where a blocked copy says so in sight. */}
          <p
            role="status"
            className={status.fail ? 'wrap text-xs text-[var(--danger)] pt-3' : 'visually-hidden'}
          >
            {status.text}
          </p>

          <header className="section">
            <div className="wrap flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--line)]">
              <div className="flex items-center gap-3 font-mono">
                <span className="text-sm px-2.5 py-1 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] font-semibold">
                  H0wZy/mcp {mcpData.version}
                </span>
                <span className="text-xs text-[var(--dim)]">MIT · Go 1.26+ · Node 20+</span>
              </div>

              <div className="flex items-center gap-2 relative">
                {/* The star count is the build's, from scripts/fetch-mcp.mjs: the page
                    asks GitHub for nothing, so a visit tells GitHub nothing. */}
                <a
                  href="https://github.com/H0wZy/mcp"
                  target="_blank"
                  rel="noreferrer"
                  className="chrome-btn inline-flex items-center gap-2 text-xs font-mono"
                  title={t.githubRepo[locale]}
                >
                  {GITHUB_ICON}
                  <span>GitHub</span>
                  <span className="text-[var(--accent)] font-semibold">★ {mcpData.stars}</span>
                </a>

                <div
                  className="relative inline-flex items-center"
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropdownOpen(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setDropdownOpen(false)
                  }}
                >
                  <button
                    type="button"
                    onClick={copyFullMarkdown}
                    className="chrome-btn inline-flex items-center gap-2 text-xs bg-[var(--surface)] hover:text-[var(--accent)] rounded-r-none border-r-0"
                    title={t.copyPageTitle[locale]}
                  >
                    <CopyIcon ok={copiedKey === 'page-md'} />
                    <span>{copiedKey === 'page-md' ? t.copied[locale] : t.copyPage[locale]}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="chrome-btn px-2 text-xs bg-[var(--surface)] hover:text-[var(--accent)] rounded-l-none"
                    aria-haspopup="menu"
                    aria-expanded={dropdownOpen}
                    aria-label={t.moreOptions[locale]}
                  >
                    <span aria-hidden="true">▾</span>
                  </button>

                  {dropdownOpen ? (
                    <div
                      role="menu"
                      className="absolute right-0 top-full mt-2 w-52 rounded border border-[var(--border)] bg-[var(--surface)] shadow-2xl p-1 z-50 flex flex-col gap-0.5 text-xs font-mono"
                    >
                      {menu.map((item) => (
                        <a
                          key={item.href}
                          role="menuitem"
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className={`text-left px-2.5 py-1.5 rounded hover:bg-[var(--line)] text-[var(--accent)] transition-colors flex items-center gap-2 ${item.border ? 'border-t border-[var(--line)] pt-1 mt-0.5' : ''}`}
                          onClick={() => setDropdownOpen(false)}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <section id="overview" className="section">
            <div className="wrap">
              <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)] mb-3">{t.title[locale]}</h1>
              <p className="sub text-lg text-[var(--dim)] mb-8">{t.subtitle[locale]}</p>

              <div className="rounded-lg bg-[var(--bg)] border border-[var(--border)] overflow-hidden shadow-2xl font-mono text-xs mt-8">
                <div className="px-4 py-2.5 bg-[var(--surface)] border-b border-[var(--line)] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--term-user)] font-semibold">h0wzy@howzysolutions</span>
                    <span className="text-[var(--dim)]">{locale === 'pt' ? 'em' : 'in'}</span>
                    <span className="text-[var(--accent)]">~/mcp</span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="text-[var(--dim)]">
                    <span className="text-[var(--accent)] font-bold">❯ </span>
                    <span className="text-[var(--fg)] font-bold">hmcp</span>
                  </div>

                  <pre className="mcp-banner" role="img" aria-label={t.bannerAlt[locale]}>
                    {BANNER}
                  </pre>

                  <div className="space-y-1 text-xs pt-1">
                    <div className="text-[var(--fg)] font-semibold">H0wZy/mcp {mcpData.version} • Multi-Agent MCP Hub</div>
                    <div className="text-[var(--term-user)]">Claude Code ↔ OpenAI Codex ↔ Google Antigravity</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="connector" className="section">
            <div className="wrap">
              <h2 className="text-xl font-semibold mb-2 text-[var(--fg)]">{t.connect.heading[locale]}</h2>
              <p className="text-xs text-[var(--dim)] mb-4">{t.connect.intro[locale]}</p>

              <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--border)] shadow-xl space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2.5 py-1 rounded text-[11px] font-mono font-semibold border bg-[var(--line)] border-[var(--accent)] text-[var(--accent)] shadow-sm">
                      Claude Code
                    </span>

                    {(['Codex', 'Antigravity'] as const).map((name) => (
                      <button
                        key={name}
                        type="button"
                        disabled
                        className="px-2.5 py-1 rounded text-[11px] font-mono border border-dashed border-[var(--border)] text-[var(--dim)] opacity-50 cursor-not-allowed inline-flex items-center gap-1 select-none"
                        title={t.connect.soon[locale]}
                      >
                        <span>{name}</span>
                        <span className="text-[8.5px] uppercase px-1 rounded bg-[var(--line)] text-[var(--accent-2)]">TODO</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {t.connect.modes.map((m, idx) => {
                      const isSelected = mode === m.id
                      return (
                        <div key={m.id} className="inline-flex items-center gap-2">
                          {idx > 0 && (
                            <span className="text-[var(--border)] text-[10px] select-none" aria-hidden="true">
                              •
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setMode(m.id)}
                            aria-pressed={isSelected}
                            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all border outline-none cursor-pointer ${
                              isSelected
                                ? 'bg-[var(--line)] border-[var(--accent)] text-[var(--accent)] font-semibold shadow-sm opacity-100'
                                : 'bg-[var(--bg)]/60 border-[var(--border)] text-[var(--dim)] opacity-60 hover:opacity-100 hover:text-[var(--fg)] hover:border-[var(--accent)]/60'
                            } focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:opacity-100`}
                            title={m.title[locale]}
                          >
                            {m.label[locale]}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="p-3 rounded-md bg-[var(--bg)] border border-[var(--border)] font-mono text-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-[var(--accent)] select-none font-bold">$</span>
                    <span className="text-[var(--fg)] select-all break-all">{connectorUrl}</span>
                  </div>
                  <CopyBtn
                    copied={copiedKey === 'connector-url'}
                    onClick={() => triggerCopy(connectorUrl, 'connector-url')}
                    locale={locale}
                    what={t.connect.copyConnector[locale]}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                  {[
                    {
                      title: mode === 'cli' ? t.connect.stepCommand[locale] : t.connect.stepEndpoint[locale],
                      desc: t.connect[mode][locale],
                    },
                    {
                      title: t.connect.stepConfigure[locale],
                      desc: (
                        <>
                          {t.connect.run[locale]} <code className="select-all">{t.connect.claudeCommand}</code>
                        </>
                      ),
                    },
                    { title: t.connect.stepReady[locale], desc: t.connect.claudeReady[locale] },
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
                  <span>{t.connect.recommended[locale]}</span>
                  <a href="https://github.com/H0wZy/mcp" target="_blank" rel="noreferrer" className="text-[var(--accent)] hover:underline">
                    {t.githubRepoLink[locale]}
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section id="quickstart" className="section">
            <div className="wrap">
              <h2 className="text-xl font-semibold mb-4 text-[var(--fg)]">{t.quickstart.heading[locale]}</h2>

              <div className="flex flex-col gap-3 font-mono text-xs">
                {t.quickstart.commands.map((item) => (
                  <div key={item.key} className="p-3 rounded bg-[var(--surface)] border border-[var(--border)]">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[var(--dim)]">{item.label[locale]}</span>
                      <button
                        type="button"
                        onClick={() => triggerCopy(item.command, item.key)}
                        className="p-1 rounded border-0 outline-none bg-transparent text-[var(--dim)] hover:text-[var(--accent)] hover:bg-[var(--line)] transition-colors cursor-pointer"
                        aria-label={`${t.copy[locale]}: ${item.command}`}
                      >
                        <CopyIcon ok={copiedKey === item.key} />
                      </button>
                    </div>
                    <code className="text-[var(--accent)] font-bold text-sm select-all block">{item.command}</code>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="tools" className="section">
            <div className="wrap">
              <h2 className="text-xl font-semibold mb-2 text-[var(--fg)]">{t.tools.heading[locale]}</h2>
              <p className="text-xs text-[var(--dim)] mb-6">{t.tools.intro[locale]}</p>

              <div className="space-y-4">
                {tools.map((tool) => (
                  <div
                    key={tool.a}
                    className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] font-mono text-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[var(--line)]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--accent)] text-[var(--accent)] font-bold">
                          {tool.a}_antigravity
                        </span>
                        <span className="text-[var(--dim)]" aria-hidden="true">
                          ↔
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--accent-2)] text-[var(--accent-2)] font-bold">
                          {tool.a}_codex
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--dim)]">{tool.d[locale]}</span>
                    </div>

                    <div className="p-2.5 rounded bg-[var(--bg)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-start gap-2 min-w-0 flex-1">
                        <span className="text-[var(--accent)] select-none font-bold" aria-hidden="true">
                          ❯
                        </span>
                        <span className="text-[var(--fg)] italic select-all leading-relaxed">
                          &ldquo;{tool.p[locale]}&rdquo;
                        </span>
                      </div>
                      <CopyBtn
                        copied={copiedKey === `p-${tool.a}`}
                        onClick={() => triggerCopy(tool.p[locale], `p-${tool.a}`)}
                        locale={locale}
                        what={`${t.tools.copyPrompt[locale]}: ${tool.a}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="packages" className="section">
            <div className="wrap">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--fg)]">{t.packages.heading[locale]}</h2>
                  <p className="text-xs text-[var(--dim)]">{t.packages.intro[locale]}</p>
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
                {t.packages.items.map((pkg) => {
                  const pkgName = `@h0wzy/mcp${pkg.suffix}`
                  return (
                    <a
                      key={pkg.suffix}
                      href={`https://www.npmjs.com/package/${pkgName}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors block space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-[var(--accent)] text-sm">{pkgName}</strong>
                        <span className="text-[var(--dim)] text-[11px]">{mcpData.version}</span>
                      </div>
                      <p className="text-[var(--dim)] text-[11px] leading-relaxed">{pkg.description[locale]}</p>
                      <div className="text-[10px] text-[var(--dim)] pt-1 border-t border-[var(--line)]">
                        {t.packages.viaCi[locale]}
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          </section>

          <section id="bridges" className="section">
            <div className="wrap">
              <h2 className="text-xl font-semibold mb-4 text-[var(--fg)]">{t.bridges.heading[locale]}</h2>

              <div className="space-y-3 font-mono text-xs">
                {t.bridges.items.map((b) => (
                  <div key={b.name} className="p-3 rounded border border-[var(--border)] bg-[var(--surface)]">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-[var(--fg)] text-sm">{b.name}</strong>
                      <span className="text-[var(--accent)] text-[11px]">{b.by}</span>
                    </div>
                    <p className="text-[var(--dim)] leading-relaxed">{b.description[locale]}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="binaries" className="section">
            <div className="wrap">
              <h2 className="text-xl font-semibold mb-4 text-[var(--fg)]">
                {t.binaries.heading[locale]} ({mcpData.version})
              </h2>
              <p className="text-xs text-[var(--dim)] mb-4">{t.binaries.intro[locale]}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                {BINARIES.map((bin) => (
                  <a
                    key={bin.p}
                    href={`https://github.com/H0wZy/mcp/releases/download/${mcpData.version}/h0wzy-mcp-${bin.f}`}
                    className="p-3 rounded border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors block"
                  >
                    <span className="text-[var(--fg)] font-semibold block mb-1">{bin.p}</span>
                    <span className="text-[var(--accent)] text-[11px]">h0wzy-mcp-{bin.f} ↗</span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <Footer locale={locale} />
        </div>
      </main>
    </>
  )
}
