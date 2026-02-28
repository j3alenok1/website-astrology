import { faqsAlmaty } from '@/lib/faq-data'
import { CONTACTS } from '@/lib/contacts'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://astrobyndauzh.com'
const pageUrl = `${baseUrl}/astrolog-almaty`

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'Астролог Алматы', item: pageUrl },
  ],
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Консультация астролога в Алматы',
  name: 'Астролог в Алматы — консультации по астрологии и Таро',
  description:
    'Персональные консультации: натальная карта, соляр, совместимость, Таро. Онлайн и очно в Алматы. Решения за 60 минут, персональный разбор без шаблонов.',
  provider: {
    '@type': 'Person',
    name: 'Сачкова Мария',
    jobTitle: 'Астролог, таролог',
  },
  areaServed: [
    { '@type': 'City', name: CONTACTS.city },
    { '@type': 'Country', name: CONTACTS.country },
    { '@type': 'Country', name: 'Россия' },
    { '@type': 'Place', name: 'Онлайн по всему миру' },
  ],
  url: pageUrl,
  address: {
    '@type': 'PostalAddress',
    addressLocality: CONTACTS.city,
    addressRegion: CONTACTS.region,
    addressCountry: CONTACTS.countryCode,
  },
  offers: {
    '@type': 'Offer',
    price: '8000',
    priceCurrency: 'KZT',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqsAlmaty.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

export function AstrologAlmatyStructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
