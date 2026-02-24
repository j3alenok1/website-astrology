import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Hero } from '@/components/Hero'

export const metadata: Metadata = {
  alternates: { canonical: 'https://astrobyndauzh.com/' },
}
import { SpecialistSection } from '@/components/SpecialistSection'
import { Services } from '@/components/Services'
import { Products } from '@/components/Products'
import { Methodology } from '@/components/Methodology'
import { BookingForm } from '@/components/BookingForm'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'
import { NebulaBg } from '@/components/NebulaBg'
import { PhotoBackground } from '@/components/PhotoBackground'
export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden space-y-8">
      <PhotoBackground />
      <NebulaBg />
      <Hero />
      <SpecialistSection />
      <Services />
      <Suspense fallback={null}>
        <Products />
      </Suspense>
      <Methodology />
      <Suspense fallback={<div id="booking" className="min-h-[400px]" />}>
        <BookingForm />
      </Suspense>
      <FAQ />
      <Footer />
    </main>
  )
}
