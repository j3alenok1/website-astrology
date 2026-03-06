import { NebulaBg } from '@/components/NebulaBg'
import { PhotoBackground } from '@/components/PhotoBackground'
import { LunarCyclesArticle } from '@/components/LunarCyclesArticle'
import { Footer } from '@/components/Footer'
import { BackToHomeLink } from '@/components/BackToHomeLink'
import Link from 'next/link'

export const metadata = {
  title: 'Почему «не выноси мне мозг» — как лунные циклы влияют на отношения',
  description:
    'Почему спокойный разговор об отношениях иногда заканчивается конфликтом. Как лунные циклы влияют на эмоциональные реакции. Почему один день идеален для разговора, другой — для близости.',
  alternates: { canonical: 'https://astrobyndauzh.com/lunnye-cikly-otnosheniya' },
}

export default function LunarCyclesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <PhotoBackground />
      <NebulaBg />

      <div className="relative z-10 pt-6 px-4">
        <BackToHomeLink />
      </div>

      <LunarCyclesArticle />

      <footer className="relative z-10 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-400 mb-2">Если вам откликается эта тема и вы хотите заранее видеть удачные и неудачные дни для разговоров, романтики и близости:</p>
          <Link
            href="/relationshipastrology"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg"
          >
            Посмотреть календарь
          </Link>
        </div>
      </footer>

      <Footer />
    </main>
  )
}
