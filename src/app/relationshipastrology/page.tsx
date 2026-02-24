import { Suspense } from 'react'
import { NebulaBg } from '@/components/NebulaBg'
import { PhotoBackground } from '@/components/PhotoBackground'
import { RelationshipAstrologyContent } from '@/components/RelationshipAstrologyContent'
import { PaymentFormMinimal } from '@/components/PaymentFormMinimal'
import { Footer } from '@/components/Footer'
import { BackToHomeLink } from '@/components/BackToHomeLink'

export const metadata = {
  title: 'Астрология Отношений — живая встреча в Алматы',
  description:
    'Живой мастер-класс по астрологии отношений в Алматы. Научитесь считывать натальную карту для гармоничных отношений. В подарок — календарь на год.',
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

      <Suspense fallback={<div id="payment" className="min-h-[400px]" />}>
        <PaymentFormMinimal productSlug="astrologiya-otnosheniy" />
      </Suspense>

      <Footer />
    </main>
  )
}
