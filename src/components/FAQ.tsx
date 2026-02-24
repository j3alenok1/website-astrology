'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { reachGoal } from '@/lib/metrika'

const faqs = [
  {
    question: 'Как проходит консультация?',
    answer: 'Консультация проходит онлайн или очно (в зависимости от вашего местоположения). Я работаю с астрологией, Таро или психологическими техниками — в зависимости от вашего запроса.',
  },
  {
    question: 'Сколько длится консультация?',
    answer: 'Стандартная консультация длится 60-90 минут. Этого времени достаточно, чтобы провести полный анализ и дать развёрнутые ответы на ваш запрос.',
  },
  {
    question: 'Нужна ли точная информация о времени рождения?',
    answer: 'Точное время рождения желательно для построения полной натальной карты, но если оно неизвестно, я могу работать с примерным временем или только с датой рождения.',
  },
  {
    question: 'Как быстро вы свяжетесь со мной после подачи заявки?',
    answer: 'Я связываюсь с вами в течение 24-48 часов после получения заявки, чтобы согласовать удобное время консультации.',
  },
  {
    question: 'Можно ли получить консультацию на английском языке?',
    answer: 'Да, консультации доступны на русском и английском языках. Укажите предпочитаемый язык в заявке.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="relative py-32 px-4 z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Часто задаваемые вопросы
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-effect rounded-xl overflow-hidden"
            >
              <button
                onClick={() => {
                  const willOpen = openIndex !== index
                  if (willOpen) reachGoal('faq_open', { index: String(index) })
                  setOpenIndex(openIndex === index ? null : index)
                }}
                className="w-full px-6 py-4 flex items-center justify-between text-left 
                         hover:bg-white/10 transition-colors"
              >
                <span className="text-white font-semibold text-lg">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-purple-400 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 text-gray-300 leading-relaxed">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
