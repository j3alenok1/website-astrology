'use client'

import { motion } from 'framer-motion'

const methodology = [
  {
    step: '01',
    title: 'Знакомство и прояснение запроса',
    description:
      'Бережно выслушиваю вашу историю, уточняю контекст и формулирую главный запрос так, чтобы работать именно с корнем, а не с поверхностным симптомом.',
  },
  {
    step: '02',
    title: 'Выбор инструмента: астрология или Таро',
    description:
      'Вместе с вами определяю, что сейчас даст больше пользы: разбор натальной карты и текущих транзитов или работа через таро-расклад. При необходимости соединяю оба подхода, если это усиливает результат.',
  },
  {
    step: '03',
    title: 'Глубокий разбор и поиск решений',
    description:
      'Погружаюсь в вашу ситуацию через выбранный инструмент: вижу причины, сценарии и точки выбора, собираю варианты действий и даю понятные, приземлённые рекомендации.',
  },
  {
    step: '04',
    title: 'Результат и поддержка после сессии',
    description:
      'По итогу вы получаете разбор в удобном формате: PDF-файл с выводами и рекомендациями. По вашему желанию возможна дополнительная консультация для углубления или уточнений. Если в процессе работы проявились темы, с которыми важно поработать мягко и самостоятельно, подбираю психологические практики для домашней работы — чтобы пройти выявленное более экологично и в своём ритме.',
  },
]

export function Methodology() {
  return (
    <section id="process" className="relative py-20 px-4 z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Как проходит консультация
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            От первого контакта до ощутимого внутреннего результата — в ясной и бережной структуре работы.
          </p>
        </motion.div>

        <div className="space-y-8">
          {methodology.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="glass-effect rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-start
                       hover:bg-white/15 transition-all duration-300"
            >
              <div className="text-6xl font-bold gradient-text shrink-0">{item.step}</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
