import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { Analytics } from '@/components/Analytics'
import { MetaPixel } from '@/components/MetaPixel'
import { YandexMetrika } from '@/components/YandexMetrika'
import { ScrollDepthTracker } from '@/components/ScrollDepthTracker'
import { StructuredData } from '@/components/StructuredData'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: {
    default: 'Астролог в Алматы — ASTRO by NDAUZH | Консультации онлайн',
    template: '%s | ASTRO by NDAUZH',
  },
  description:
    'Астролог в Алматы. Персональные консультации по астрологии и Таро: разбор натальной карты, соляр, совместимость, профориентация. Онлайн и очно в Алматы. Казахстан, Россия.',
  keywords: [
    'астролог алматы',
    'астролог в алматы',
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
    title: 'Астролог в Алматы — ASTRO by NDAUZH | Консультации',
    description:
      'Астролог в Алматы. Консультации по астрологии и Таро: натальная карта, соляр, совместимость. Онлайн и очно.',
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: 'ASTRO by NDAUZH',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Астролог в Алматы — ASTRO by NDAUZH',
    description: 'Астролог в Алматы. Консультации по астрологии и Таро онлайн и очно.',
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r)return;}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js?id=106988269","ym");ym(106988269,"init",{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});`,
          }}
        />
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/106988269" style={{ position: 'absolute', left: '-9999px' }} alt="" />
          </div>
        </noscript>
      </head>
      <body className={inter.className}>
        {children}
        <Suspense fallback={null}>
          <Analytics />
          <YandexMetrika />
          <ScrollDepthTracker />
        </Suspense>
        <MetaPixel />
      </body>
    </html>
  )
}
