'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CONTACTS } from '@/lib/contacts'

export function SeoBlock() {
  return (
    <section className="relative py-16 px-4 z-10" aria-label="Астролог в Алматы">
      <div className="max-w-3xl mx-auto">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Астролог в Алматы — консультации онлайн и очно
          </h2>
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
              <strong>Консультация астролога</strong> — это возможность получить ясность по важным вопросам: отношения, карьера, финансы, переезд, самопознание. Я работаю с натальной картой, транзитами и Таро, помогая клиентам из {CONTACTS.city}, всего {CONTACTS.country}, России, СНГ и других стран принять обоснованные решения. <strong>Астролог онлайн</strong> — формат для тех, кто предпочитает дистанционные сессии (Zoom, WhatsApp, видеозвонок).
            </p>
            <p>
              Как <strong>астролог в Алматы</strong> я провожу консультации онлайн и очно. Услуги: <strong>разбор натальной карты</strong> (астропортрет), <strong>соляр на год</strong>, <strong>совместимость партнёров</strong> (синастрия), детская карта, профориентация по натальной карте, кармический урок отношений, таро-расклады. Запись через <a href={CONTACTS.whatsapp} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-white underline underline-offset-2">WhatsApp</a> или форму на сайте.
            </p>
            <p>
              <strong>Таро</strong> — быстрые ответы на конкретные вопросы без долгого разбора карты. Один расклад, одна тема. <strong>Консультация астролога и Таро</strong> доступна на русском и английском языках — работаю с клиентами по всему миру.
            </p>
            <p>
              Очно: {CONTACTS.address.display}. Онлайн: Zoom, WhatsApp — для жителей любых городов и стран. Подробнее об услугах, ценах и формате работы — на странице{' '}
              <Link href="/astrolog-almaty" className="text-purple-300 hover:text-white underline underline-offset-2">
                Астролог в Алматы
              </Link>
              .
            </p>
          </div>
        </motion.article>
      </div>
    </section>
  )
}
