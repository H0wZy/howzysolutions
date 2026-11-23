import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { Document } from '../views/Document'

/**
 * The server-rendered HTML of one document's body, as the app's catch-all page
 * produces it. Tests read prose from it; it leaves out <head> and the layout,
 * which Next owns.
 */
export function render(pathname: string): string {
  return renderToString(createElement(Document, { pathname }))
}
