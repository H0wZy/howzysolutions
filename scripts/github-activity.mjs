/**
 * The pure half of scripts/fetch-github.mjs: query text out, GraphQL payload
 * in, one period of the committed artifact back. No network and no file
 * system, so the privacy rule below is tested against a fake payload
 * (src/content/__tests__/github-activity-mapping.test.ts) rather than trusted.
 *
 * PRIVATE REPOSITORY NAMES NEVER LEAVE THIS MODULE. The owner's token can list
 * private repositories; the Actions token cannot. Every name-bearing list is
 * filtered on `isPrivate`, a private row's count is folded into the month's
 * private total, and the name goes into `privateNames` (memory only) so the
 * caller can assert none reached the artifact before anything is written.
 *
 * Day and month boundaries are the viewer's time zone as GitHub reports it
 * through `startedAt` (owner token: the profile's zone; Actions token: UTC).
 * The offset is derived, never hard-coded, so months and calendar agree.
 */

const DAY_MS = 86_400_000
/** Also what keeps an href built from it on github.com (and out of CSS). */
const REPO_NAME = /^[\w.-]+\/[\w.-]+$/
const COLOR = /^#[0-9a-fA-F]{6}$/

export const addDays = (iso, n) =>
  new Date(Date.parse(`${iso}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10)

/** `2025-09-14T03:00:00Z` (local midnight at 03:00 UTC) -> `-03:00`. */
export function utcOffsetOf(startedAt) {
  const t = new Date(startedAt)
  const minutes = t.getUTCHours() * 60 + t.getUTCMinutes()
  const offset = minutes <= 720 ? -minutes : 1440 - minutes
  const abs = Math.abs(offset)
  const hh = String(Math.floor(abs / 60)).padStart(2, '0')
  const mm = String(abs % 60).padStart(2, '0')
  return `${offset < 0 ? '-' : '+'}${hh}:${mm}`
}

/** An instant as a calendar date in `offset`. Repo creation is an exact UTC time. */
export function localDate(instant, offset) {
  const sign = offset.startsWith('-') ? -1 : 1
  const [h, m] = offset.slice(1).split(':').map(Number)
  return new Date(Date.parse(instant) + sign * (h * 60 + m) * 60_000).toISOString().slice(0, 10)
}

/** Calendar months overlapping `start..end`, each clipped to it. */
export function monthRanges(start, end) {
  const out = []
  let [y, m] = start.split('-').map(Number)
  for (;;) {
    const month = `${y}-${String(m).padStart(2, '0')}`
    if (month > end.slice(0, 7)) return out
    const first = `${month}-01`
    const last = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10)
    out.push({ month, from: first < start ? start : first, to: last > end ? end : last })
    if (++m > 12) [y, m] = [y + 1, 1]
  }
}

const FRAGMENTS = `fragment Repo on Repository { nameWithOwner isPrivate isFork primaryLanguage { name color } }
fragment Month on ContributionsCollection {
  restrictedContributionsCount earliestRestrictedContributionDate latestRestrictedContributionDate
  commitContributionsByRepository(maxRepositories: 100) { repository { ...Repo } contributions { totalCount } }
  repositoryContributions(first: 100) { nodes { occurredAt repository { ...Repo } } }
  pullRequestContributionsByRepository(maxRepositories: 100) { repository { ...Repo } contributions { totalCount } }
  issueContributionsByRepository(maxRepositories: 100) { repository { ...Repo } contributions { totalCount } }
  pullRequestReviewContributionsByRepository(maxRepositories: 100) { repository { ...Repo } contributions { totalCount } }
}
`

/**
 * One request per period: the period itself (no bounds = GitHub's rolling
 * year) plus one alias per month. Each costs one rate-limit point.
 */
export function periodQuery({ from, to, offset, months }) {
  const at = (date, time) => `"${date}T${time}${offset}"`
  const range = (a, b) => `(from: ${at(a, '00:00:00')}, to: ${at(b, '23:59:59')})`
  const aliases = months
    .map((m) => `    m${m.month.replace('-', '_')}: contributionsCollection${range(m.from, m.to)} { ...Month }`)
    .join('\n')
  // GraphQL rejects a fragment nothing spreads, so the header query has none.
  const fragments = months.length ? FRAGMENTS : ''
  return `query($login: String!) {
  user(login: $login) {
    period: contributionsCollection${from ? range(from, to) : ''} {
      startedAt contributionYears
      contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
    }
${aliases}
  }
}
${fragments}`
}

function publicName(repository) {
  if (!REPO_NAME.test(repository.nameWithOwner)) throw new Error('unexpected repository name shape')
  return repository.nameWithOwner
}

/**
 * GraphQL `user` (a `period` plus `mYYYY_MM` aliases) -> one artifact period.
 * Throws on anything that would publish a wrong number: a gap in the
 * calendar, or days that do not add up to the source's own total.
 */
export function toPeriod(user, { start, end, offset, months: ranges }) {
  const calendar = user.period.contributionCalendar
  const days = calendar.weeks
    .flatMap((w) => w.contributionDays)
    .filter((d) => d.date >= start && d.date <= end)
  days.forEach((d, i) => {
    if (d.date !== addDays(start, i)) throw new Error(`calendar has a gap at ${addDays(start, i)}`)
  })
  if (days.at(-1)?.date !== end) throw new Error(`calendar does not reach ${end}`)
  const counts = days.map((d) => d.contributionCount)
  const total = calendar.totalContributions
  if (counts.reduce((a, b) => a + b, 0) !== total) {
    throw new Error(`calendar days do not add up to its total (${total})`)
  }

  const privateNames = new Set()
  const contributed = new Map()
  const types = { commits: 0, pullRequests: 0, issues: 0, reviews: 0, private: 0 }

  const months = ranges
    .map((range) => {
      const m = user[`m${range.month.replace('-', '_')}`]
      if (!m) throw new Error(`month ${range.month} missing from the response`)
      let privateCount = m.restrictedContributionsCount ?? 0

      const byRepo = (rows, type) => {
        const out = []
        for (const { repository, contributions } of rows ?? []) {
          const count = contributions.totalCount
          if (repository.isPrivate) {
            privateNames.add(repository.nameWithOwner)
            privateCount += count
            continue
          }
          const name = publicName(repository)
          out.push([name, count])
          types[type] += count
          contributed.set(name, (contributed.get(name) ?? 0) + count)
        }
        return out.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      }

      const month = { month: range.month }
      const commits = byRepo(m.commitContributionsByRepository, 'commits')
      const created = []
      for (const { occurredAt, repository } of m.repositoryContributions?.nodes ?? []) {
        if (repository.isPrivate) {
          privateNames.add(repository.nameWithOwner)
          privateCount += 1
          continue
        }
        const language = repository.primaryLanguage
        const color = language?.color && COLOR.test(language.color) ? language.color : ''
        created.push([
          publicName(repository),
          localDate(occurredAt, offset),
          repository.isFork ? 1 : 0,
          language?.name ?? '',
          color,
        ])
      }
      created.sort((a, b) => b[1].localeCompare(a[1]))
      const pullRequests = byRepo(m.pullRequestContributionsByRepository, 'pullRequests')
      const issues = byRepo(m.issueContributionsByRepository, 'issues')
      const reviews = byRepo(m.pullRequestReviewContributionsByRepository, 'reviews')

      if (commits.length) month.commits = commits
      if (created.length) month.created = created
      if (pullRequests.length) month.pullRequests = pullRequests
      if (issues.length) month.issues = issues
      if (reviews.length) month.reviews = reviews
      if (privateCount > 0) {
        types.private += privateCount
        // A range only when GitHub measured it for every one of them: the
        // restricted dates say nothing about private rows the token could see,
        // and GitHub sometimes returns them null. Never the month as a guess.
        const from = m.earliestRestrictedContributionDate
        const to = m.latestRestrictedContributionDate
        const measured = from && to && privateCount === m.restrictedContributionsCount
        month.private = measured ? [privateCount, from, to] : [privateCount]
      }
      return month
    })
    .filter((m) => Object.keys(m).length > 1)
    .reverse()

  const contributedTo = [...contributed]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name]) => name)

  return { period: { start, end, total, counts, types, contributedTo, months }, privateNames }
}

/** Every repository name the artifact carries. */
export function namesIn(artifact) {
  const names = new Set()
  for (const period of Object.values(artifact.periods)) {
    for (const name of period.contributedTo) names.add(name)
    for (const month of period.months) {
      for (const key of ['commits', 'created', 'pullRequests', 'issues', 'reviews']) {
        for (const row of month[key] ?? []) names.add(row[0])
      }
    }
  }
  return names
}

/** The last check before anything is written: no private name, by exact match. */
export function assertNoPrivateNames(artifact, privateNames) {
  for (const name of namesIn(artifact)) {
    if (privateNames.has(name)) throw new Error('a private repository name reached the artifact')
  }
}
