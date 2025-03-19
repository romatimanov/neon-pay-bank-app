import { Aside } from './components/aside/Aside'
import { Header } from './components/header/Header'
import ClientProvider from './components/provider/ClientProvider'
import './globals.css'
export const dynamic = 'force-dynamic'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="container body-main">
        <ClientProvider>
          <Aside />
          <div className="main">
            <Header />
            <main>{children}</main>
          </div>
        </ClientProvider>
      </body>
    </html>
  )
}
