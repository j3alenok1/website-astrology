/**
 * NAP (Name, Address, Phone) — единый источник контактных данных для локального SEO
 */
export const CONTACTS = {
  name: 'ASTRO by NDAUZH',
  nameFull: 'ASTRO by NDAUZH — Астролог в Алматы',
  phone: '+7 775 909 80 93',
  phoneRaw: '+77759098093',
  whatsapp: 'https://wa.clck.bar/77759098093',
  city: 'Алматы',
  region: 'Алматы',
  country: 'Казахстан',
  countryCode: 'KZ',
  /** Полный адрес для разметки (офлайн-консультации по записи в Алматы) */
  address: {
    streetAddress: 'г. Алматы',
    addressLocality: 'Алматы',
    addressRegion: 'Алматы',
    addressCountry: 'KZ',
    /** Строка для отображения */
    display: 'Алматы, Казахстан',
    /** Для карт — центр города */
    geo: {
      latitude: 43.238949,
      longitude: 76.945465,
    },
  },
} as const
