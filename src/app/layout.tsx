'use client'

import { useState } from 'react'
import { Aside } from './components/aside/Aside'
import { Header } from './components/header/Header'
import ClientProvider from './components/provider/ClientProvider'
import './globals.css'
export const dynamic = 'force-dynamic'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isAsideOpen, setIsAsideOpen] = useState(false)

  const toggleAside = () => setIsAsideOpen((prev) => !prev)
  const closeAside = () => setIsAsideOpen(false)
  return (
    <html lang="en">
      <body className="container body-main">
        <ClientProvider>
          <Aside isOpen={isAsideOpen} onClose={closeAside} />
          <div className="main">
            <Header isAsideOpen={isAsideOpen} onToggleAside={() => setIsAsideOpen((v) => !v)} />
            <main>{children}</main>
          </div>
        </ClientProvider>
      </body>
    </html>
  )
}
