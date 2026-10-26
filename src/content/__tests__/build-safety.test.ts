import { describe, expect, it } from 'vitest'
import {
  WAKATIME_BLOCKLIST,
  dropBlocked,
  isValidReleaseTag,
  replaceLiteral,
} from '../../../scripts/build-safety.mjs'
import raw from '../wakatime.generated.json'

describe('WakaTime project blocklist', () => {
  it('names the project the owner no longer has', () => {
    expect(WAKATIME_BLOCKLIST).toContain('former-project')
  })

  it('dropBlocked removes the blocked names and keeps the rest', () => {
    const slices = [{ name: 'vvv' }, { name: 'former-project' }, { name: 'LeiDoCorreUE' }]
    expect(dropBlocked(slices)).toEqual([{ name: 'vvv' }, { name: 'LeiDoCorreUE' }])
  })

  it('the committed snapshot carries no blocked project', () => {
    const leaked = raw.projects.map((p) => p.name).filter((n) => WAKATIME_BLOCKLIST.includes(n))
    expect(leaked).toEqual([])
  })
})

describe('replaceLiteral', () => {
  it('does not interpret $& or $$ in the replacement', () => {
    const out = replaceLiteral('<a></a>', '<a></a>', 'cost $& and $$ and $` and $\'')
    expect(out).toBe('cost $& and $$ and $` and $\'')
  })
})

describe('isValidReleaseTag', () => {
  it('accepts semver tags', () => {
    for (const t of ['v1.0.4', '1.0.4', 'v2.10.0-rc.1']) expect(isValidReleaseTag(t)).toBe(true)
  })
  it('rejects anything that could carry markup or markdown', () => {
    for (const t of ['v1.0', 'latest', 'v1.0.4"><script>', 'v1.0.4\n# x', '[x](http://e)', '', undefined, 4])
      expect(isValidReleaseTag(t)).toBe(false)
  })
})
