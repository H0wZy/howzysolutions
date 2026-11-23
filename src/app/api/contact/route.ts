import { handleContact, type ContactEnv } from '../../../server/contact'

// Bindings and secrets come from the Worker, never from NEXT_PUBLIC_*. The
// import is dynamic and hidden from the bundler: `next build` and the tests run
// in Node, where `cloudflare:workers` does not exist, and fall back to process.env
// (empty, so the route answers "failed" instead of crashing).
async function workerEnv(): Promise<ContactEnv> {
  try {
    const mod = (await import(/* webpackIgnore: true */ 'cloudflare:workers' as string)) as { env: ContactEnv }
    return mod.env
  } catch {
    return process.env as unknown as ContactEnv
  }
}

export async function POST(request: Request) {
  return handleContact(request, await workerEnv())
}

// Anything else on this path is a 405 with the right Allow header.
export function GET() {
  return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } })
}
