import { Suspense } from 'react'
import { NebulaBg } from '@/components/NebulaBg'
import { PhotoBackground } from '@/components/PhotoBackground'
import { RelationshipAstrologyContent } from '@/components/RelationshipAstrologyContent'
import { PaymentFormMinimal } from '@/components/PaymentFormMinimal'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

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
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          На главную
        </Link>
      </div>

      <RelationshipAstrologyContent />

      <Suspense fallback={<div id="payment" className="min-h-[400px]" />}>
        <PaymentFormMinimal productSlug="astrologiya-otnosheniy" />
      </Suspense>

      <Footer />
    </main>
  )
}
