import { faqs } from '@/lib/faq-data'
import { CONTACTS } from '@/lib/contacts'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://astrobyndauzh.com'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: `Консультация астролога в ${CONTACTS.city}`,
  name: `${CONTACTS.nameFull} — консультации по астрологии и Таро`,
  description:
    `Персональные консультации: натальная карта, соляр, совместимость, Таро. Онлайн и очно в ${CONTACTS.city}.`,
  provider: {
    '@type': 'Person',
    name: 'Сачкова Мария',
    jobTitle: 'Астролог, таролог',
  },
  areaServed: [
    { '@type': 'City', name: CONTACTS.city },
    { '@type': 'Country', name: CONTACTS.country },
  ],
  url: baseUrl,
  address: {
    '@type': 'PostalAddress',
    addressLocality: CONTACTS.city,
    addressRegion: CONTACTS.region,
    addressCountry: CONTACTS.countryCode,
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: baseUrl },
  ],
}

export function HomeStructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
