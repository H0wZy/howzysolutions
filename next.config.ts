import type { NextConfig } from 'next'

/**
 * Every internal link in this site ends in a slash, and the documents it
 * serves are /cv/, /works/<id>/ and so on, so the framework agrees: a request
 * without the slash is redirected to the one with it. English is unprefixed and
 * Portuguese lives under /pt/, which the catch-all page in src/app/[[...path]]
 * resolves with src/route.ts, not with the framework's i18n routing.
 */
const config: NextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
}

export default config
