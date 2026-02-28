import Link from 'next/link'
import { NebulaBg } from '@/components/NebulaBg'
import { PhotoBackground } from '@/components/PhotoBackground'
import { ArrowRight, Check, Sparkles, Heart, Briefcase, Target, MapPin } from 'lucide-react'
import { CONTACTS } from '@/lib/contacts'
import { faqsAlmaty } from '@/lib/faq-data'
import { AstrologAlmatyFAQ } from '@/components/AstrologAlmatyFAQ'

export interface AstrologGeoConfig {
  slug: string
  h1: string
  breadcrumb: string
  heroText: string
  heroItems: string[]
  servicesTitle: string
  seoArticleTitle: string
  seoParagraphs: { keyword: string; text: string }[]
  structuredData: React.ReactNode
}

const whenNeeded = [
  { icon: Target, title: 'Периоды неопределённости и кризиса', items: ['Сложно принять решение', 'Ощущение застоя', 'Повторяющиеся проблемы'] },
  { icon: Briefcase, title: 'Важные жизненные выборы', items: ['Смена работы или профессии', 'Переезд', 'Начало нового проекта'] },
  { icon: Heart, title: 'Отношения и личная жизнь', items: ['Сложности в паре', 'Поиск партнёра', 'Анализ совместимости'] },
  { icon: Sparkles, title: 'Самопознание и развитие', items: ['Понимание сильных сторон', 'Поиск предназначения', 'Планирование будущего'] },
]

const services = [
  { title: 'Натальная карта', desc: 'Подробный разбор личности, жизненного пути, талантов и ключевых задач' },
  { title: 'Личный гороскоп', desc: 'Индивидуальный прогноз с учётом текущих планетных влияний' },
  { title: 'Гороскоп на год (соляр)', desc: 'Прогноз главных событий, возможностей и рисков на 12 месяцев' },
  { title: 'Совместимость', desc: 'Общий анализ отношений, перспективы союза и точки роста' },
  { title: 'Любовный прогноз', desc: 'Прогноз в сфере чувств, знакомств и развития отношений' },
  { title: 'Профориентация', desc: 'Выбор профессии, анализ способностей по натальной карте' },
  { title: 'Кармический урок', desc: 'Анализ кармических задач и узлов в натальной карте' },
  { title: 'Таро-расклады', desc: 'Быстрые ответы на конкретные вопросы без долгого разбора карты' },
]

const prices = [
  { service: 'Экспресс-вопрос / Один запрос', price: 'от 8 000 ₸', format: 'Онлайн (текст/аудио)' },
  { service: 'Астропортрет (разбор натальной карты)', price: '45 000 ₸', format: 'Консультация 2–4 часа + PDF' },
  { service: 'Соляр на год', price: '30 000 ₸', format: 'Разбор в PDF' },
  { service: 'Совместимость партнёров', price: '40 000 ₸', format: 'Консультация + PDF' },
  { service: 'Детская карта', price: '20 000 ₸', format: 'Разбор в PDF' },
  { service: 'Кармический урок отношений', price: '20 000 ₸', format: 'Разбор в PDF' },
  { service: 'Профориентация', price: '20 000 ₸', format: 'Разбор в PDF или консультация' },
  { service: 'Таро-расклад', price: '8 000 ₸', format: 'Расклад, ответ голосовым' },
]

const steps = [
  { n: 1, title: 'Знакомство и запрос', desc: 'Уточняем вашу цель: отношения, работа, финансы, самоопределение или выбор удачного времени.' },
  { n: 2, title: 'Сбор данных', desc: 'Аккуратно собираем дату, время и место рождения — только то, что нужно для точного разбора.' },
  { n: 3, title: 'Построение карты', desc: 'Формируем натальную карту и выделяем ключевые акценты, связанные с вашим запросом.' },
  { n: 4, title: 'Разбор ресурсов', desc: 'Показываем сильные стороны, таланты и опоры — чтобы понимать, на что вы можете рассчитывать.' },
  { n: 5, title: 'Текущий период', desc: 'Смотрим, какие темы сейчас активны, где лучше действовать, а где — дать себе время.' },
  { n: 6, title: 'Прогноз по запросу', desc: 'Определяем благоприятные окна и возможные развилки, чтобы вы планировали уверенно.' },
  { n: 7, title: 'Рекомендации', desc: 'Даём практичные шаги: что усилить, что беречь и как пройти период с максимальной пользой.' },
]

export function AstrologGeoPage({ config }: { config: AstrologGeoConfig }) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {config.structuredData}
      <PhotoBackground />
      <NebulaBg />

      <div className="relative z-10">
        <nav className="max-w-4xl mx-auto px-4 pt-8 pb-4" aria-label="Хлебные крошки">
          <ol className="flex items-center gap-2 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-white transition-colors">Главная</Link></li>
            <li>/</li>
            <li className="text-white">{config.breadcrumb}</li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto px-4 pb-24">
          <section className="py-12 md:py-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">{config.h1}</h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">{config.heroText}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-10 text-gray-300">
              {config.heroItems.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/#booking" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all">
              Записаться на консультацию <ArrowRight className="w-5 h-5" />
            </Link>
          </section>

          <section className="py-12 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Сачкова Мария</h2>
            <p className="text-gray-300 mb-2">Астролог-консультант, эксперт по натальной и прогностической астрологии, таролог</p>
            <p className="text-gray-400 text-sm mb-6">Работаю на стыке астрологии, Таро и психологии. Консультации на русском и английском языках.</p>
            <div className="glass-effect rounded-xl p-4 flex flex-wrap gap-4">
              <a href={CONTACTS.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors">WhatsApp</a>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span>{CONTACTS.address.display}</span>
              </div>
            </div>
          </section>

          <section className="py-12 border-t border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8">Когда нужна консультация астролога?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {whenNeeded.map((block, i) => {
                const Icon = block.icon
                return (
                  <div key={i} className="glass-effect rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-6 h-6 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">{block.title}</h3>
                    </div>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {block.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="py-12 border-t border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8">{config.servicesTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((s, i) => (
                <div key={i} className="glass-effect rounded-xl p-4">
                  <h3 className="font-semibold text-white mb-1">{s.title}</h3>
                  <p className="text-gray-400 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="py-12 border-t border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8">Цены на консультации астролога</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="py-3 px-4 text-white font-semibold">Услуга</th>
                    <th className="py-3 px-4 text-white font-semibold">Стоимость</th>
                    <th className="py-3 px-4 text-white font-semibold">Формат</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((row, i) => (
                    <tr key={i} className="border-b border-white/10">
                      <td className="py-3 px-4 text-gray-300">{row.service}</td>
                      <td className="py-3 px-4 text-white font-medium">{row.price}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{row.format}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="py-12 border-t border-white/10">
            <h2 className="text-3xl font-bold text-white mb-4">Как проходит астрологическая консультация</h2>
            <p className="text-gray-300 mb-8">60–90 минут • Онлайн • Конфиденциально. Работа выстроена по понятным шагам — спокойно, бережно и без «страшилок».</p>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.n} className="glass-effect rounded-xl p-4 flex gap-4">
                  <span className="text-2xl font-bold gradient-text shrink-0">{step.n}</span>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-gray-400 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <article className="py-12 border-t border-white/10 prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-6">{config.seoArticleTitle}</h2>
            <div className="text-gray-300 space-y-4 leading-relaxed">
              {config.seoParagraphs.map((p, i) => (
                <p key={i}><strong>{p.keyword}</strong> {p.text}</p>
              ))}
              <p>
                Консультации проходят <strong>онлайн</strong> (Zoom, WhatsApp). Запись через <a href={CONTACTS.whatsapp} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-white underline">WhatsApp</a> или форму на главной странице — свяжусь в течение 24–48 часов. Работаю с клиентами из {CONTACTS.city}, {CONTACTS.country}, России и других стран.
              </p>
            </div>
          </article>

          <section id="faq" className="py-12 border-t border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8">Часто задаваемые вопросы об астрологии</h2>
            <AstrologAlmatyFAQ faqs={faqsAlmaty} />
          </section>

          <section className="py-12">
            <Link href="/#booking" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all">
              Записаться на консультацию <ArrowRight className="w-5 h-5" />
            </Link>
          </section>
        </div>
      </div>
    </main>
  )
}
