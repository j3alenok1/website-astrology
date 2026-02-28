import type { Metadata } from 'next'
import { AstrologGeoPage } from '@/components/AstrologGeoPage'
import { AstrologGeoStructuredData } from '@/components/AstrologGeoStructuredData'

const baseUrl = 'https://astrobyndauzh.com'
const pageUrl = `${baseUrl}/astrolog-online`

export const metadata: Metadata = {
  title: 'Астролог онлайн | Консультация астролога по Zoom, WhatsApp',
  description:
    'Консультация астролога онлайн: натальная карта, соляр, совместимость, Таро. Zoom, WhatsApp. Персональный разбор без шаблонов. Клиенты из России, Казахстана и мира.',
  keywords: 'астролог онлайн, консультация астролога онлайн, астролог по скайпу, натальная карта онлайн, таро онлайн',
  alternates: { canonical: pageUrl },
  openGraph: { title: 'Астролог онлайн | Консультации по Zoom, WhatsApp', url: pageUrl },
}

const config = {
  slug: 'astrolog-online',
  h1: 'Астролог онлайн',
  breadcrumb: 'Астролог онлайн',
  heroText:
    'Консультации по натальной карте, соляр, совместимость и Таро — онлайн. Zoom или WhatsApp. Работаю с клиентами из России, Казахстана и любой точки мира.',
  heroItems: [
    'Консультация — от 8 000 ₸',
    'Zoom или WhatsApp',
    'В любое удобное время',
    'Разбор натальной карты',
    'Соляр на год',
    'Совместимость партнёров',
  ],
  servicesTitle: 'Услуги астролога онлайн',
  seoArticleTitle: 'Астролог онлайн: консультация без границ',
  seoParagraphs: [
    {
      keyword: 'Консультация астролога онлайн',
      text: '— это возможность получить ясность по важным вопросам жизни, не выходя из дома. Работаю по Zoom или WhatsApp: натальная карта, соляр, совместимость, таро-расклады. Клиенты из Москвы, Алматы, России, Казахстана и других стран.',
    },
    {
      keyword: 'Астролог онлайн',
      text: 'подходит тем, кто ценит время и предпочитает дистанционный формат. Качество консультации не зависит от локации — важны дата, время и место рождения, а они передаются в любом формате.',
    },
    {
      keyword: 'Натальная карта онлайн',
      text: 'строится так же точно, как при очной встрече. Разбор личности, жизненного пути, талантов, текущих транзитов — всё доступно в видео- или аудиоформате.',
    },
  ],
  structuredData: (
    <AstrologGeoStructuredData
      pageUrl={pageUrl}
      pageName="Астролог онлайн"
      serviceType="Консультация астролога онлайн"
      description="Консультации по натальной карте, соляр, совместимость, Таро. Онлайн по Zoom или WhatsApp. Клиенты из России, Казахстана и мира."
    />
  ),
}

export default function AstrologOnlinePage() {
  return <AstrologGeoPage config={config} />
}
