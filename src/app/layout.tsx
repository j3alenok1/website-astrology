import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { Analytics } from '@/components/Analytics'
import { MetaPixel } from '@/components/MetaPixel'
import { StructuredData } from '@/components/StructuredData'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: {
    default: 'ASTRO by NDAUZH — Астролог, Таро, Консультации онлайн',
    template: '%s | ASTRO by NDAUZH',
  },
  description:
    'Персональные астрологические и тарологические консультации. Разбор натальной карты, соляр, совместимость, детская карта, профориентация. Онлайн по всему миру. Россия, Казахстан.',
  keywords: [
    'астролог',
    'астролог онлайн',
    'консультация астролога',
    'таро',
    'таро консультация',
    'таро онлайн',
    'расклад таро',
    'консультация таролога',
    'разбор натальной карты',
    'натальная карта',
    'натальная карта разбор',
    'соляр',
    'соляр на год',
    'годовой прогноз астрология',
    'совместимость по дате рождения',
    'совместимость партнёров',
    'детская карта астрология',
    'астрология дети',
    'профориентация астрология',
    'астропортрет',
    'кармический урок',
    'психологическая астрология',
    'психологическая консультация',
    'астрология отношения',
    'астрология карьера',
    'астрология деньги',
    'астролог Россия',
    'астролог Казахстан',
    'астролог Алматы',
    'астролог Москва',
    'таро Россия',
    'таро Казахстан',
    'таро Алматы',
    'консультация онлайн',
    'запись к астрологу',
    'ASTRO by NDAUZH',
    'Сачкова Мария',
  ].join(', '),
  authors: [{ name: 'ASTRO by NDAUZH', url: 'https://astrobyndauzh.com' }],
  creator: 'ASTRO by NDAUZH',
  publisher: 'ASTRO by NDAUZH',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://astrobyndauzh.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ASTRO by NDAUZH — Астролог, Таро, Консультации',
    description:
      'Персональные астрологические и тарологические консультации. Разбор натальной карты, соляр, совместимость. Онлайн по всему миру.',
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: 'ASTRO by NDAUZH',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASTRO by NDAUZH — Астролог, Таро',
    description: 'Консультации по астрологии и Таро онлайн. Россия, Казахстан, весь мир.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'https://astrobyndauzh.com'} />
        <StructuredData />
      </head>
      <body className={inter.className}>
        {children}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <MetaPixel />
      </body>
    </html>
  )
}
