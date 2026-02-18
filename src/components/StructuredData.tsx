export function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://astrobyndauzh.com'

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'ASTRO by NDAUZH',
    description:
      'Персональные астрологические и тарологические консультации. Разбор натальной карты, соляр, совместимость, детская карта, профориентация. Онлайн по всему миру.',
    url: baseUrl,
    image: `${baseUrl}/favicon-tarot.svg`,
    areaServed: [
      { '@type': 'Country', name: 'Россия' },
      { '@type': 'Country', name: 'Казахстан' },
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
    name: 'ASTRO by NDAUZH',
    url: baseUrl,
    description: 'Астролог и таро. Консультации онлайн. Россия, Казахстан, весь мир.',
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
