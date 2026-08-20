import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/jetbrains-mono/index.css'
import './index.css'
import App from './App.tsx'
import { resolveLocale } from './locale'

/**
 * Hydrates the prerendered markup rather than rendering into an empty root —
 * the text is already in the HTML payload before this script runs (research D3).
 */
const root = document.getElementById('root')
if (root) {
  hydrateRoot(
    root,
    <StrictMode>
      <App pathname={window.location.pathname} locale={resolveLocale()} />
    </StrictMode>,
  )
}
