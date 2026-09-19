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
  'section.github': 'github_activity',
  'section.contact': 'get_in_touch',

  // Hero
  'hero.role': 'Full-stack developer',
  /*
   * FR-063, and the constitution's Honesty in Self-Reported Metrics clause.
   *
   * This read '{years}y {months}mo building software' beside 'since January
   * 2023', which invited a reader to take three and a half years of
   * professional software work from a figure that counts time in the field.
   * Employment began in May 2025. Both facts are true, they count different
   * things, and the clause forbids placing them so one reads as corroborating
   * the other — so the figure now names its own scope and the employment date
   * travels with it rather than being left for the reader to assume.
   */
  'hero.experience': '{years}y {months}mo in IT',
  'hero.experienceSince': 'since the Unicesumar degree in 2023; employed May 2025 to August 2026',
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
  'stats.sourceLabel': 'Source:',
  'stats.range': 'tracked {start} to current',
  'stats.rangeStale': 'tracked {start} to {date}',
  'stats.stale': 'Figures are from the last successful capture on {date}.',
  'stats.showAll': 'show all',
  'stats.experienceNote':
    'Time in IT is counted from the Unicesumar degree in 2023. Employment at TCS ran from May 2025 to August 2026. Tracked coding time covers only the range the tracker reports, which starts in March 2026. Three measures over three periods, and none of them is evidence for another.',

  // GitHub activity (a different source, unit and period from the stats above).
  // The calendar already counts private contributions, as GitHub's own does,
  // so the heading says "contributions" and never "public".
  'contrib.source': 'Source: GitHub',
  'contrib.window': '{start} to {end}',
  'contrib.stale': 'Grid is from the last successful capture, on {date}.',
  'contrib.privateNote': 'Private repositories are counted, never named.',
  'contrib.inLastYear': '{contributions} in the last year',
  'contrib.inYear': '{contributions} in {year}',
  'contrib.day.none': 'No contributions on {date}.',
  'contrib.day.some': '{contributions} on {date}.',
  'contrib.lastYear': 'last year',
  'contrib.period': 'Contribution period',
  'contrib.gridLabel': 'Contribution calendar',
  'contrib.learnHow': 'Learn how we count contributions',
  'contrib.less': 'Less',
  'contrib.more': 'More',
  'contrib.overview': 'Activity overview',
  'contrib.contributedTo': 'Contributed to',
  'contrib.and': 'and',
  'contrib.types': 'Contribution types, public repositories only',
  'contrib.type.commits': 'Commits',
  'contrib.type.pullRequests': 'Pull requests',
  'contrib.type.issues': 'Issues',
  'contrib.type.reviews': 'Code review',
  'contrib.activity': 'Contribution activity',
  'contrib.tl.commits': 'Created {items} in {repos}',
  'contrib.tl.created': 'Created {repos}',
  'contrib.tl.prs': 'Opened {items} in {repos}',
  'contrib.tl.issues': 'Opened {items} in {repos}',
  'contrib.tl.reviews': 'Reviewed {items} in {repos}',
  'contrib.tl.private': '{contributions} in private repositories',
  'contrib.fork': 'fork',
  'contrib.newer': 'newer',
  'contrib.older': 'older',
  'contrib.pageOf': 'Page {page} of {total}',
  'contrib.n.contribution.one': '{n} contribution',
  'contrib.n.contribution.other': '{n} contributions',
  'contrib.n.commit.one': '{n} commit',
  'contrib.n.commit.other': '{n} commits',
  'contrib.n.repo.one': '{n} repository',
  'contrib.n.repo.other': '{n} repositories',
  'contrib.n.otherRepo.one': '{n} other public repository',
  'contrib.n.otherRepo.other': '{n} other public repositories',
  'contrib.n.pr.one': '{n} pull request',
  'contrib.n.pr.other': '{n} pull requests',
  'contrib.n.issue.one': '{n} issue',
  'contrib.n.issue.other': '{n} issues',

  // Terminal
  // The one prompt connective. The author's own oh-my-posh prompt reads as a
  // sentence ("user@host in ~"), so this word is translated; the segments around
  // it (handle, host, path) are shell tokens and are not.
  'terminal.promptIn': 'in',
  // Names the region for a screen reader. The visible title bar it used to
  // duplicate is gone; the accessible name still has to be there.
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
  'cmd.cv': 'print the professional record and the CV download',
  'cv.heading': 'Professional record',
  'cv.downloadHint': 'the PDF in this language',
  'cv.counts.awards': 'awards',
  'cv.counts.education': 'education',
  'cv.counts.certifications': 'certifications',

  // CV
  //
  // Proper nouns stay OUT of this dictionary, following the precedent stats.ts
  // set for WAKATIME.name: employer, client, institution and technology names
  // are identical in both locales, and a string identical in both belongs in
  // neither (FR-054).
  'cv.title': 'Professional record',
  'cv.intro':
    'Where I work, since when, and what I was hired to do. The same facts as the PDF, in text you can read on a phone.',
  'cv.metaDescription':
    'Professional record of Marcos "H0wZy" Junior: roles, awards, skills, education and certifications, with the CV downloadable in English and Portuguese.',
  // FR-055: an ongoing role ends in a translated word, never a computed date.
  'cv.present': 'present',
  // FR-056, FR-080. Same wording grammar as the statistics panel's period line,
  // because a visitor reading both should not have to learn two ways of being
  // told when a figure was taken.
  'cv.captured': 'CV facts captured from {source} on {date}.',
  'cv.capturedFallback':
    'CV facts are from the last successful capture. The source was unreachable at build time.',
  // FR-081: a fact this site holds and the CV does not must read as this
  // site's, never as having come from the CV.
  'cv.siteHeld': 'start year recorded by this site, not by the CV',
  'cv.ongoing': 'ongoing',
  'cv.seeProject': 'read the full project record',

  // CV downloads
  'cv.download.heading': 'Download the CV',
  'cv.download.primary': 'Download the CV in {language}',
  'cv.download.other': 'Also available in {language}',
  'cv.language.en': 'English',
  'cv.language.pt': 'Brazilian Portuguese',
  'cv.unavailable': 'Only the {language} file is available in this build.',
  'cv.unavailableAll': 'No CV file is available in this build.',

  // Navigation
  'nav.breadcrumb': 'Breadcrumb',
  'nav.onThisPage': 'On this page',
  'nav.home': 'Home',
  // FR-084. Lowercase, matching the chrome bar's other controls (theme, lang)
  // and the terminal's own command vocabulary — not a dictionary word so much
  // as a filename in the chrome bar's own idiom.
  'nav.cv': 'cv',
  // Identical in both locales for the same reason `nav.cv` is: this is the URL
  // segment `/work/` in the bar's filename idiom, not prose. `trabalhos` was
  // tried and pushed the bar past 360px into a horizontal document scrollbar,
  // which the spec forbids outright. The breadcrumb below still says
  // "Todos os trabalhos" in Portuguese, where the words ARE prose.
  'nav.work': 'work',
  // Same idiom as `nav.work`: the URL segment, identical in both locales.
  'nav.privacy': 'privacy-policy',

  // Contact
  'contact.heading': 'Open to work and to interesting problems.',
  'contact.email': 'email',
  'contact.github': 'github',
  'contact.linktree': 'linktree',

  // Footer
  'footer.builtWith': 'Built with React, TypeScript and Vite. No trackers, no third-party fonts.',
  'footer.source': 'source on github',

  // Privacy page
  'privacy.title': 'Privacy policy',
  'privacy.metaDescription':
    'How H0wZy Solutions handles personal data on this website and in each of its projects, including viralvideogen, its private TikTok Shop app.',
  'privacy.updated': 'Last updated {date}.',
  'privacy.contact': 'Contact:',
  'privacy.projects': 'Project policies',
  'privacy.aboutProject': 'read the project record',
} as const

export type StringKey = keyof typeof en
