import { describe, expect, it } from 'vitest'
import {
  WAKATIME_BLOCKLIST,
  dropBlocked,
  isValidReleaseTag,
  nameDigest,
  replaceLiteral,
} from '../../../scripts/build-safety.mjs'
import raw from '../wakatime.generated.json'

describe('WakaTime project blocklist', () => {
  it('lists the project the owner no longer has by digest, not by name', () => {
    expect(WAKATIME_BLOCKLIST).toHaveLength(1)
    for (const d of WAKATIME_BLOCKLIST) expect(d).toMatch(/^[0-9a-f]{64}$/)
  })

  it('digests a name with SHA-256', () => {
    expect(nameDigest('example-gone')).toBe('66f113bbba56b94972489f7827a4dd8cae6f0cd2890987ffce676c01b670a8ef')
  })

  it('dropBlocked removes the blocked names and keeps the rest', () => {
    const slices = [{ name: 'vvv' }, { name: 'example-gone' }, { name: 'LeiDoCorreUE' }]
    expect(dropBlocked(slices, [nameDigest('example-gone')])).toEqual([{ name: 'vvv' }, { name: 'LeiDoCorreUE' }])
  })

  it('the committed snapshot carries no blocked project', () => {
    expect(dropBlocked(raw.projects)).toEqual(raw.projects)
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
