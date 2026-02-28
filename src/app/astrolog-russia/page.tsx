import type { Metadata } from 'next'
import { AstrologGeoPage } from '@/components/AstrologGeoPage'
import { AstrologGeoStructuredData } from '@/components/AstrologGeoStructuredData'

const baseUrl = 'https://astrobyndauzh.com'
const pageUrl = `${baseUrl}/astrolog-russia`

export const metadata: Metadata = {
  title: 'Астролог Россия | Консультации онлайн',
  description:
    'Астролог для России. Консультации онлайн: натальная карта, соляр, совместимость, Таро. Zoom, WhatsApp. Клиенты из всех регионов РФ.',
  keywords: 'астролог россия, астролог в россии, консультация астролога россия, астролог онлайн россия',
  alternates: { canonical: pageUrl },
  openGraph: { title: 'Астролог Россия | Консультации онлайн', url: pageUrl },
}

const config = {
  slug: 'astrolog-russia',
  h1: 'Астролог Россия',
  breadcrumb: 'Астролог Россия',
  heroText:
    'Консультации астролога для клиентов из России — онлайн. Натальная карта, соляр, совместимость, Таро. Zoom или WhatsApp. Любой город, любое время.',
  heroItems: [
    'Консультация — от 8 000 ₸',
    'Онлайн по всей России',
    'Zoom или WhatsApp',
    'Разбор натальной карты',
    'Соляр на год',
    'Совместимость партнёров',
  ],
  servicesTitle: 'Услуги астролога для России',
  seoArticleTitle: 'Астролог Россия: консультации онлайн для всех регионов',
  seoParagraphs: [
    {
      keyword: 'Астролог Россия',
      text: '— онлайн-консультации для жителей всех регионов. Москва, Санкт-Петербург, Екатеринбург, Новосибирск и любой другой город — формат Zoom или WhatsApp позволяет работать без ограничений по географии.',
    },
    {
      keyword: 'Консультация астролога в России',
      text: 'включает разбор натальной карты, соляр на год, совместимость партнёров, профориентацию, таро-расклады. Работаю на русском и английском языках.',
    },
  ],
  structuredData: (
    <AstrologGeoStructuredData
      pageUrl={pageUrl}
      pageName="Астролог Россия"
      serviceType="Консультация астролога для России"
      description="Консультации астролога для клиентов из России — онлайн. Натальная карта, соляр, совместимость, Таро."
    />
  ),
}

export default function AstrologRussiaPage() {
  return <AstrologGeoPage config={config} />
}
