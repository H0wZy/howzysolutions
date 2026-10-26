import type { ReactNode } from 'react'
import '@fontsource-variable/jetbrains-mono/index.css'
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
