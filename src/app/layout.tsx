import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@/components/Analytics'
import { MetaPixel } from '@/components/MetaPixel'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'ASTRO by NDAUZH',
  description:
    'Персональные астрологические и тарологические разборы с психологическим сопровождением от Сачковой Марии Геннадьевны. Осознанные решения, ясность в отношениях и карьере.',
  keywords:
    'Сачкова Мария Геннадьевна, астролог, консультации по астрологии, таро, психологическая консультация, разбор натальной карты, совместимость, годовой прогноз',
  authors: [{ name: 'ASTRO by NDAUZH' }],
  openGraph: {
    title: 'ASTRO by NDAUZH',
    description:
      'Персональные астрологические и тарологические разборы с психологическим сопровождением. Интеллектуальный подход к вашим запросам.',
    type: 'website',
    locale: 'ru_RU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASTRO by NDAUZH',
    description: 'Интеллектуальный консультационный сервис',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon-tarot.svg" type="image/svg+xml" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
        <MetaPixel />
      </body>
    </html>
  )
}
