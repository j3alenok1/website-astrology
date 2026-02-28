import type { Metadata } from 'next'
import { AstrologGeoPage } from '@/components/AstrologGeoPage'
import { AstrologGeoStructuredData } from '@/components/AstrologGeoStructuredData'
import { CONTACTS } from '@/lib/contacts'

const baseUrl = 'https://astrobyndauzh.com'
const pageUrl = `${baseUrl}/astrolog-kazakhstan`

export const metadata: Metadata = {
  title: 'Астролог Казахстан | Консультации онлайн и очно',
  description:
    'Астролог Казахстан. Консультации в Алматы очно и онлайн: натальная карта, соляр, совместимость, Таро. Zoom, WhatsApp. Клиенты из всех городов КЗ.',
  keywords: 'астролог казахстан, астролог в казахстане, консультация астролога казахстан, астролог алматы',
  alternates: { canonical: pageUrl },
  openGraph: { title: 'Астролог Казахстан | Консультации онлайн и очно', url: pageUrl },
}

const config = {
  slug: 'astrolog-kazakhstan',
  h1: 'Астролог Казахстан',
  breadcrumb: 'Астролог Казахстан',
  heroText:
    `Консультации астролога для Казахстана — онлайн и очно в ${CONTACTS.city}. Натальная карта, соляр, совместимость, Таро. Zoom, WhatsApp или личная встреча.`,
  heroItems: [
    'Консультация — от 8 000 ₸',
    'Онлайн по всему Казахстану',
    `Очно в ${CONTACTS.city}`,
    'Разбор натальной карты',
    'Соляр на год',
    'Совместимость партнёров',
  ],
  servicesTitle: 'Услуги астролога в Казахстане',
  seoArticleTitle: 'Астролог Казахстан: консультации в Алматы и онлайн',
  seoParagraphs: [
    {
      keyword: 'Астролог Казахстан',
      text: `— консультации для жителей всех городов страны. Очно в ${CONTACTS.city}, онлайн — для Астаны, Шымкента, Караганды и других городов. Натальная карта, соляр, совместимость, Таро.`,
    },
    {
      keyword: 'Консультация астролога в Казахстане',
      text: `доступна в двух форматах: личная встреча в ${CONTACTS.city} или сессия по Zoom/WhatsApp. Услуги: разбор натальной карты, соляр на год, совместимость партнёров, профориентация, кармический урок, таро-расклады.`,
    },
  ],
  structuredData: (
    <AstrologGeoStructuredData
      pageUrl={pageUrl}
      pageName="Астролог Казахстан"
      serviceType="Консультация астролога в Казахстане"
      description={`Консультации астролога для Казахстана — очно в ${CONTACTS.city} и онлайн. Натальная карта, соляр, совместимость, Таро.`}
    />
  ),
}

export default function AstrologKazakhstanPage() {
  return <AstrologGeoPage config={config} />
}
