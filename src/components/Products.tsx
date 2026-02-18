'use client'

import { motion } from 'framer-motion'
import {
  UserCircle,
  Sun,
  Heart,
  Users,
  BookOpen,
  HelpCircle,
  Target,
  Sparkles,
} from 'lucide-react'

const products = [
  {
    icon: UserCircle,
    title: 'Астропортрет',
    description:
      'Устали гадать, «кто я на самом деле» и почему одни и те же сценарии повторяются? Разбор натальной карты даёт опору: ваши сильные и уязвимые стороны, конкретные шаги по финансам, отношениям, реализации или переезду — и практики, чтобы проработать сложные темы самостоятельно.',
    format: 'Консультация 2–4 часа + PDF',
    extra: 'В подарок — психологические практики для проработки сложных тем.',
    price: '50 000 ₸',
  },
  {
    icon: Sun,
    title: 'Соляр',
    description:
      'Год впереди — а вы не знаете, когда действовать, а когда не давить на судьбу. Соляр снимает тревогу: вы видите окна возможностей, риски и точки роста на 12 месяцев. Заказывайте вблизи дня рождения — входите в новый цикл с ясностью.',
    format: 'Разбор в PDF',
    price: '35 000 ₸',
  },
  {
    icon: Heart,
    title: 'Детская карта',
    description:
      'Ребёнок «как с другой планеты», не понимаете, как его мотивировать и поддерживать? Разбор покажет тип мышления, способ общения и зоны талантов — плюс как ваши отношения с партнёром влияют на малыша. Меньше конфликтов, больше контакта.',
    format: 'Разбор в PDF',
    price: '32 000 ₸',
  },
  {
    icon: Users,
    title: 'Совместимость',
    description:
      'Отношения есть, а глубины и понимания «зачем мы вместе» не хватает — или тянет к человеку и непонятно, строить ли пару. Разбор по картам двоих: уроки союза, точки притяжения и зоны роста. Решение без долгих разговоров «в пустоту».',
    format: 'Консультация + PDF',
    price: '45 000 ₸',
  },
  {
    icon: BookOpen,
    title: 'Кармический урок отношений',
    description:
      'Один и тот же сценарий с разными людьми или не можете отпустить тяжёлые отношения. Разбор по картам: откуда повтор, как выйти из травмы и не тащить её в следующий союз. Для тех, кто хочет разомкнуть цикл, а не жить в нём.',
    format: 'Разбор в PDF',
    price: '25 000 ₸',
  },
  {
    icon: HelpCircle,
    title: 'Один вопрос',
    description:
      'Один вопрос не даёт покоя — карьера, переезд, отношения, деньги — а полный разбор карты не нужен. Фокус только на вашем запросе: формулируем его так, чтобы ответ закрыл мучающую неопределённость.',
    format: 'Разбор в PDF или созвон',
    price: '20 000 ₸',
  },
  {
    icon: Target,
    title: 'Профориентация',
    description:
      'Не знаете, в какую сторону развиваться, или чувствуете, что занимаетесь не своим? Разбор по натальной карте покажет зоны талантов, подходящие направления и способы монетизации. Ясность в карьере и призвании.',
    format: 'Разбор в PDF или консультация',
    price: '32 000 ₸',
  },
  {
    icon: Sparkles,
    title: 'Таро-расклад',
    description:
      'Нужен быстрый и чёткий ответ без долгого разбора карты. Один расклад — одна тема, 3–5 вопросов. Подходит для любой темы; при необходимости уточним формулировку, чтобы ответ попал в точку.',
    format: 'Расклад, ответ только голосовым',
    price: '8 000 ₸',
  },
]

export function Products() {
  return (
    <section id="products" className="relative py-20 px-4 z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Продукты</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Выберите формат под ваш запрос. Каждый разбор — астрология, таро или психология, в зависимости от темы. Результат: ясность, PDF и при необходимости практики для самостоятельной работы.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const Icon = product.icon
            const withExtra = 'extra' in product && product.extra
            return (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="glass-effect rounded-2xl p-6 flex flex-col justify-between h-full hover:bg-white/15 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{product.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">{product.description}</p>
                  <p className="text-sm text-purple-200 mb-1">{product.format}</p>
                  {withExtra && (
                    <p className="text-xs text-purple-200/90 mb-2 italic">{product.extra}</p>
                  )}
                  <p className="text-sm font-semibold text-white">{product.price}</p>
                </div>
                <button
                  className="mt-4 w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold text-sm
                           hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      const el = document.getElementById('booking')
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                >
                  Записаться
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

