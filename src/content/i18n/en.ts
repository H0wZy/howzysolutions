/**
 * Canonical interface-string dictionary. This object is the source of the key set:
 * `StringKey` is derived from it, and pt.ts must satisfy that set (FR-017).
 */

export const en = {
  // Chrome
  'chrome.file': 'README.md',
  'chrome.theme': 'theme',
  'chrome.theme.switchTo': 'switch to {theme} theme',
  'chrome.theme.dark': 'dark',
  'chrome.theme.light': 'light',
  'chrome.lang': 'lang',
  // A rotating pool. See theme/jokes.ts pickJoke() — never Math.random(), so the terminal
  // engine's purity gate stays satisfied (research D12).
  'theme.joke.0': 'Closed as wontfix.',
  'theme.joke.1': "Filed under 'someday'. Someday hasn't shipped yet.",
  'theme.joke.2': 'Behind a feature flag. The flag is load-bearing.',
  'theme.joke.3': 'Reviewed it myself and rejected it myself. At least it was fast.',
  'theme.joke.4': "It's on the roadmap, right after the roadmap.",
  'chrome.skipToContent': 'Skip to content',

  // Sections
  'section.terminal': 'the_terminal',
  'section.work': 'selected_work',
  'section.about': 'the_whole_idea',
  'section.stats': 'measured_activity',
  'section.contact': 'get_in_touch',

  // Hero
  'hero.role': 'Full-stack developer',
  'hero.experience': '{years}y {months}mo building software',
  'hero.experienceSince': 'since January 2023',
  'hero.location': 'Londrina, Paraná, Brazil',

  // Project listing
  'work.heading': 'Nine projects, and what each one does not do.',
  'work.intro':
    'Every entry states its problem, its stack, its honest current state, and the limitations its own documentation declares.',
  'work.commits': 'commits',
  'work.period': '{start} to {end}',
  'work.viewProject': 'open project',
  'work.backToAll': 'back to all work',
  'work.page': 'Work pages',
  'work.pagePrev': 'previous page',
  'work.pageNext': 'next page',
  'work.allWork': 'all work',
  'work.listingTitle': 'All work',

  // Project detail
  'project.problem': 'the_problem',
  'project.capabilities': 'what_it_does',
  'project.stack': 'stack',
  'project.development': 'how_it_was_built',
  'project.limitations': 'known_limitations',
  'project.roadmap': 'roadmap',
  'project.metrics': 'measured',
  'project.links': 'links',
  'project.trackedTime': 'tracked coding time',
  'project.period': 'period',

  // Project state vocabulary
  'state.production': 'in production',
  'state.delivered': 'delivered',
  'state.functional': 'functional, not deployed',
  'state.inProgress': 'in progress',
  'state.skeleton': 'study skeleton',

  // Project kind vocabulary
  'kind.client': 'client work',
  'kind.product': 'own product',
  'kind.study': 'study',
  'kind.tooling': 'tooling',
  'kind.training': 'training programme',

  // Stack groups
  'stack.frontend': 'frontend',
  'stack.backend': 'backend',
  'stack.infra': 'infra',
  'stack.other': 'other',

  // Statistics
  'stats.heading': 'Measured, not asserted.',
  'stats.total': 'total tracked',
  'stats.dailyAverage': 'daily average',
  'stats.languages': 'languages',
  'stats.editors': 'editors',
  'stats.categories': 'activity',
  'stats.projects': 'by project',
  'stats.source': 'Source: WakaTime',
  'stats.range': 'tracked {start} to current',
  'stats.rangeStale': 'tracked {start} to {date}',
  'stats.stale': 'Figures are from the last successful capture on {date}.',
  'stats.showAll': 'show all',
  'stats.experienceNote':
    'Experience is counted from January 2023. Tracked coding time begins when tracking was installed, in March 2026. They measure different things over different periods.',

  // Terminal
  'terminal.hint': "Type 'help' and press Enter.",
  'terminal.label': 'Interactive terminal',
  'terminal.inputLabel': 'Terminal command input',
  'terminal.outputLabel': 'Terminal output',
  'terminal.notFound': "command not found: {input}",
  'terminal.tryHelp': "type 'help' to see what's available",
  'terminal.didYouMean': "did you mean '{candidate}'?",
  'terminal.noSuchProject': 'no such project: {id}',
  'terminal.noSuchTech': 'no technology matches: {id}',
  'terminal.badValue': 'accepted values: {values}',
  'terminal.tooLong': 'input too long. 512 characters maximum',
  'terminal.usage': 'usage: {usage}',
  'terminal.candidates': 'candidates: {candidates}',
  'terminal.localeSet': 'language set to {locale}',
  'terminal.currentLocale': 'language: {locale}',
  'terminal.themeAlwaysDark': 'dark. the only theme there is',
  'terminal.emptyHistory': 'no commands yet',

  // Terminal command summaries
  'cmd.help': 'list available commands',
  'cmd.version': 'experience duration and tracked build info',
  'cmd.whoami': 'who is behind this',
  'cmd.about': 'longer biography',
  'cmd.projects': 'list or inspect projects',
  'cmd.stack': 'technologies, grouped, with project counts',
  'cmd.stats': 'measured coding activity',
  'cmd.contact': 'how to reach me',
  'cmd.lang': 'show or change the language',
  'cmd.theme': 'the theme (there is only one)',
  'cmd.open': 'open a project page',
  'cmd.ls': 'list the content surface',
  'cmd.clear': 'clear the screen',
  'cmd.history': 'show this session’s commands',

  // Contact
  'contact.heading': 'Open to work and to interesting problems.',
  'contact.email': 'email',
  'contact.github': 'github',
  'contact.linktree': 'linktree',

  // Footer
  'footer.builtWith': 'Built with React, TypeScript and Vite. No trackers, no third-party fonts.',
  'footer.source': 'source on github',
} as const

export type StringKey = keyof typeof en
