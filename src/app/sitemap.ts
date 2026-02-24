import { MetadataRoute } from 'next'

// Канонический домен для sitemap (Google Search Console, SEO)
const baseUrl = 'https://astrobyndauzh.com'

export default function sitemap(): MetadataRoute.Sitemap {

  return [
    {
      url: canonicalBase,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${canonicalBase}/relationshipastrology`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${canonicalBase}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
}
