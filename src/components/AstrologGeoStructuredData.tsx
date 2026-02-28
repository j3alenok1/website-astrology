import { CONTACTS } from '@/lib/contacts'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://astrobyndauzh.com'

interface Props {
  pageUrl: string
  pageName: string
  serviceType: string
  description: string
}

export function AstrologGeoStructuredData({ pageUrl, pageName, serviceType, description }: Props) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: pageName, item: pageUrl },
    ],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    name: `${CONTACTS.nameFull} — ${pageName}`,
    description,
    provider: { '@type': 'Person', name: 'Сачкова Мария', jobTitle: 'Астролог, таролог' },
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
    offers: { '@type': 'Offer', price: '8000', priceCurrency: 'KZT' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </>
  )
}
