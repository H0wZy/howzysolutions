// Copies ../public/** into next/public/ (plan D3: one source of truth for static files).
// Run by predev and prebuild. Fails if the source is missing, a source file cannot be
// copied, or the copied file count differs from the source count (T010).
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const src = join(here, '..', '..', 'public')
const dest = join(here, '..', 'public')

export function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? listFiles(join(dir, e.name)) : [join(dir, e.name)],
  )
}

function main() {
  if (!existsSync(src) || !statSync(src).isDirectory()) {
    console.error(`sync-public: source directory missing: ${src}`)
    process.exit(1)
  }
  mkdirSync(dest, { recursive: true })
  // Clear stale copies so a file deleted at the source disappears here; keep .gitkeep.
  for (const e of readdirSync(dest)) if (e !== '.gitkeep') rmSync(join(dest, e), { recursive: true, force: true })
  cpSync(src, dest, { recursive: true, errorOnExist: false })
  const a = listFiles(src).length
  const b = listFiles(dest).filter((f) => !f.endsWith('.gitkeep')).length
  if (a !== b) {
    console.error(`sync-public: ${a} source files, ${b} copied`)
    process.exit(1)
  }
  console.log(`sync-public: ${b} files copied to next/public`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
