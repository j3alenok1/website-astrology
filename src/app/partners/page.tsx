import type { Metadata } from 'next'
import Link from 'next/link'
import { NebulaBg } from '@/components/NebulaBg'
import { PhotoBackground } from '@/components/PhotoBackground'
import { CopyButton } from '@/components/CopyButton'
import { ArrowLeft } from 'lucide-react'
import { CONTACTS } from '@/lib/contacts'

export const metadata: Metadata = {
  title: 'Партнёрам и каталогам — ASTRO by NDAUZH',
  description:
    'Информация для каталогов и партнёров: астролог в Алматы, консультации по натальной карте, Таро. Готовые тексты для размещения.',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://astrobyndauzh.com/partners' },
}

const siteData = {
  url: 'https://astrobyndauzh.com',
  name: CONTACTS.nameFull,
  shortDesc:
    `Астролог в ${CONTACTS.city}. Персональные консультации по астрологии и Таро: натальная карта, соляр, совместимость, профориентация. Онлайн и очно. WhatsApp.`,
  longDesc:
    `${CONTACTS.nameFull} — астролог и таролог в ${CONTACTS.city}. Консультации по натальной карте, соляр на год, совместимость партнёров, детская карта, профориентация, кармический урок, таро-расклады. Работа на стыке астрологии, Таро и психологии. Онлайн (Zoom, WhatsApp) и очно в ${CONTACTS.city}. ${CONTACTS.address.display}. Клиенты из ${CONTACTS.country}, России и других стран.`,
  keywords:
    `астролог алматы, астролог в алматы, консультация астролога, натальная карта, соляр, таро алматы, совместимость партнёров, астролог ${CONTACTS.city}`,
  category: 'Услуги / Специалисты / Астрология',
  city: CONTACTS.city,
  region: CONTACTS.country,
  whatsapp: CONTACTS.whatsapp,
}

export default function PartnersPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <PhotoBackground />
      <NebulaBg />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>

        <h1 className="text-3xl font-bold mb-2 gradient-text">Партнёрам и каталогам</h1>
        <p className="text-gray-400 mb-10">
          Готовые тексты для размещения в каталогах, на партнёрских сайтах и в картах.
        </p>

        <div className="space-y-8">
          <CopyBlock
            title="Короткое описание (до 160 символов)"
            text={siteData.shortDesc}
            hint="Для мета-описания, карточек, сниппетов"
          />
          <CopyBlock
            title="Развёрнутое описание"
            text={siteData.longDesc}
            hint="Для каталогов и подробных карточек"
          />
          <CopyBlock title="Ключевые слова" text={siteData.keywords} hint="Через запятую" />
          <CopyBlock title="URL сайта" text={siteData.url} />
          <CopyBlock title="Название" text={siteData.name} />
          <CopyBlock title="Категория" text={siteData.category} />
          <CopyBlock title="Город" text={siteData.city} />
          <CopyBlock title="Регион" text={siteData.region} />
          <CopyBlock title="Ссылка WhatsApp" text={siteData.whatsapp} />
        </div>

        <div className="mt-12 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-gray-400 text-sm">
            Хотите разместить нас в каталоге или обменяться ссылками? Напишите в{' '}
            <a
              href={siteData.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:underline"
            >
              WhatsApp
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  )
}

function CopyBlock({
  title,
  text,
  hint,
}: {
  title: string
  text: string
  hint?: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <CopyButton text={text} />
      </div>
      <p className="text-gray-300 text-sm whitespace-pre-wrap bg-white/5 rounded-lg p-4 border border-white/10">
        {text}
      </p>
      {hint && <p className="text-gray-500 text-xs mt-1">{hint}</p>}
    </div>
  )
}

