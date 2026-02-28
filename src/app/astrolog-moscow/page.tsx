import type { Metadata } from 'next'
import { AstrologGeoPage } from '@/components/AstrologGeoPage'
import { AstrologGeoStructuredData } from '@/components/AstrologGeoStructuredData'

const baseUrl = 'https://astrobyndauzh.com'
const pageUrl = `${baseUrl}/astrolog-moscow`

export const metadata: Metadata = {
  title: 'Астролог Москва | Консультация онлайн',
  description:
    'Астролог для жителей Москвы. Консультации онлайн: натальная карта, соляр, совместимость, Таро. Zoom, WhatsApp. Персональный разбор.',
  keywords: 'астролог москва, астролог в москве, консультация астролога москва, астролог онлайн москва',
  alternates: { canonical: pageUrl },
  openGraph: { title: 'Астролог Москва | Консультации онлайн', url: pageUrl },
}

const config = {
  slug: 'astrolog-moscow',
  h1: 'Астролог Москва',
  breadcrumb: 'Астролог Москва',
  heroText:
    'Консультации астролога для жителей Москвы — онлайн. Натальная карта, соляр, совместимость, Таро. Zoom или WhatsApp. Базируюсь в Алматы, работаю с клиентами по всему миру.',
  heroItems: [
    'Консультация — от 8 000 ₸',
    'Онлайн (Zoom, WhatsApp)',
    'Для жителей Москвы',
    'Разбор натальной карты',
    'Соляр на год',
    'Совместимость партнёров',
  ],
  servicesTitle: 'Услуги астролога для Москвы',
  seoArticleTitle: 'Астролог Москва: консультации онлайн',
  seoParagraphs: [
    {
      keyword: 'Астролог Москва',
      text: '— консультации в онлайн-формате для жителей столицы. Работаю по Zoom или WhatsApp: натальная карта, соляр, совместимость партнёров, таро-расклады. География не имеет значения — важна точность данных о рождении.',
    },
    {
      keyword: 'Консультация астролога для Москвы',
      text: 'доступна в удобное время. Клиенты из Москвы, Подмосковья и других регионов России получают такой же детальный разбор, как при очной встрече.',
    },
  ],
  structuredData: (
    <AstrologGeoStructuredData
      pageUrl={pageUrl}
      pageName="Астролог Москва"
      serviceType="Консультация астролога для Москвы"
      description="Консультации астролога для жителей Москвы — онлайн. Натальная карта, соляр, совместимость, Таро. Zoom, WhatsApp."
    />
  ),
}

export default function AstrologMoscowPage() {
  return <AstrologGeoPage config={config} />
}
