import { CONTACTS } from '@/lib/contacts'

export function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://astrobyndauzh.com'
  const { address } = CONTACTS

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: CONTACTS.name,
    alternateName: 'Астролог в Алматы',
    url: baseUrl,
    logo: `${baseUrl}/favicon-48.png`,
    description: `Астролог в ${CONTACTS.city}. Консультации по астрологии и Таро онлайн и очно.`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      addressCountry: address.addressCountry,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      areaServed: ['KZ', 'RU'],
      availableLanguage: ['Russian', 'English'],
      url: CONTACTS.whatsapp,
    },
  }

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: CONTACTS.nameFull,
    description:
      `Астролог в ${CONTACTS.city}. Персональные консультации по астрологии и Таро: разбор натальной карты, соляр, совместимость, профориентация. Онлайн и очно.`,
    url: baseUrl,
    image: `${baseUrl}/favicon-tarot.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      addressCountry: address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: address.geo.latitude,
      longitude: address.geo.longitude,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'booking',
      areaServed: [{ '@type': 'City', name: CONTACTS.city }, { '@type': 'Country', name: CONTACTS.country }],
      url: CONTACTS.whatsapp,
    },
    areaServed: [
      { '@type': 'City', name: CONTACTS.city },
      { '@type': 'Country', name: CONTACTS.country },
      { '@type': 'Country', name: 'Россия' },
      { '@type': 'Place', name: 'Онлайн по всему миру' },
    ],
    priceRange: '₸₸',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '21:00',
    },
    sameAs: [],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: CONTACTS.nameFull,
    url: baseUrl,
    description: `Астролог в ${CONTACTS.city}. Консультации по астрологии и Таро онлайн и очно.`,
    inLanguage: 'ru',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organization),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusiness),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(website),
        }}
      />
    </>
  )
}
