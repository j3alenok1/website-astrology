import { NebulaBg } from '@/components/NebulaBg'
import { PhotoBackground } from '@/components/PhotoBackground'
import { RelationshipAstrologyContent } from '@/components/RelationshipAstrologyContent'
import { Footer } from '@/components/Footer'
import { BackToHomeLink } from '@/components/BackToHomeLink'

export const metadata = {
  title: 'Календарь удачных дат для отношений — Астрология | ASTRO by NDAUZH',
  description:
    'Узнайте заранее: когда говорить о важном, в какие дни избегать конфликтов и когда идеальный момент для свиданий и близости. Основано на лунных циклах.',
  alternates: { canonical: 'https://astrobyndauzh.com/relationshipastrology' },
}

export default function RelationshipAstrologyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <PhotoBackground />
      <NebulaBg />

      <div className="relative z-10 pt-6 px-4">
        <BackToHomeLink />
      </div>

      <RelationshipAstrologyContent />

      <Footer />
    </main>
  )
}
