/** Route parsing. Separate from App so the component file exports only a component. */
export type Route = { page: 'home' } | { page: 'work'; id: string }

export function routeFor(pathname: string): Route {
  const match = /^\/work\/([a-z0-9-]+)\/?$/.exec(pathname)
  return match ? { page: 'work', id: match[1] } : { page: 'home' }
}
