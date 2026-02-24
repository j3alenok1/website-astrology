export function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://astrobyndauzh.com'

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'ASTRO by NDAUZH — Астролог в Алматы',
    description:
      'Астролог в Алматы. Персональные консультации по астрологии и Таро: разбор натальной карты, соляр, совместимость, профориентация. Онлайн и очно.',
    url: baseUrl,
    image: `${baseUrl}/favicon-tarot.svg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Алматы',
      addressRegion: 'Алматы',
      addressCountry: 'KZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.238949,
      longitude: 76.945465,
    },
    areaServed: [
      { '@type': 'City', name: 'Алматы' },
      { '@type': 'Country', name: 'Казахстан' },
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
    name: 'ASTRO by NDAUZH — Астролог в Алматы',
    url: baseUrl,
    description: 'Астролог в Алматы. Консультации по астрологии и Таро онлайн и очно.',
    inLanguage: 'ru',
  }

  return (
    <>
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
