import { MetadataRoute } from 'next'

// Канонический домен для sitemap (Google Search Console, SEO)
// URL с trailing slash — чтобы Google находил страницы через «ссылающиеся файлы Sitemap»
const baseUrl = 'https://astrobyndauzh.com'

const pages: { path: string; changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'; priority: number }[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/astrolog-almaty', changeFrequency: 'weekly', priority: 0.95 },
  { path: '/astrolog-online', changeFrequency: 'weekly', priority: 0.95 },
  { path: '/astrolog-moscow', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/astrolog-russia', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/astrolog-kazakhstan', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/relationshipastrology', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/privacy', changeFrequency: 'monthly', priority: 0.3 },
  { path: '/partners', changeFrequency: 'monthly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, changeFrequency, priority }) => ({
    url: path === '/' ? `${baseUrl}/` : `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
