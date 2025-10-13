import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'En İyi Kampanya',
  description: 'Sen Evine Erken Kavuş Diye!',
  generator: 'En İyi Kampanya',

  openGraph: {
    title: 'En İyi Kampanya', 
    description: 'Sen Evine Erken Kavuş Diye!', 
    url: 'https://eniyikampanya.vercel.app/', 
    siteName: 'En İyi Kampanya',
    images: [
      {
        url: '/enIyiKampanya-logo.png', 
        width: 1200,
        height: 630,
        alt: 'En İyi Kampanya Afişi',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'En İyi Kampanya',
    description: 'Sen Evine Erken Kavuş Diye!',
    images: ['/enIyiKampanya-logo.png'], 
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
