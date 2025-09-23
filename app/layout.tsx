import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'İyi Finans',
  description: 'Teslimatını al, ödemeni yap',
  generator: 'İyi Finans Kampanya',

  openGraph: {
    title: 'İyi Finans', 
    description: 'Teslimatını al, ödemeni yap', 
    url: 'https://duranerkamates.vercel.app/', 
    siteName: 'İyi Finans',
    images: [
      {
        url: '/iyi-finans-logo.png', 
        width: 1200,
        height: 630,
        alt: 'İyi Finans Kampanya Afişi',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'İyi Finans',
    description: 'Teslimatını al, ödemeni yap',
    images: ['/iyi-finans-logo.png'], 
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
