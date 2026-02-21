'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Brain, Star, ChevronDown } from 'lucide-react'

const services = [
  {
    icon: Sparkles,
    title: 'Астрология',
    description:
      'Глубокий анализ натальной карты, прогнозирование событий и понимание вашего жизненного пути через призму звезд.',
    color: 'from-purple-500 to-purple-700',
  },
  {
    icon: Star,
    title: 'Таро',
    description:
      'Расклады карт Таро для получения ответов на важные вопросы и понимания текущей ситуации в различных сферах жизни.',
    color: 'from-pink-500 to-pink-700',
  },
  {
    icon: Brain,
    title: 'Психология',
    description:
      'Психологический анализ и поддержка для работы с внутренними состояниями, отношениями и личностным ростом.',
    color: 'from-blue-500 to-blue-700',
  },
  {
    icon: Sparkles,
    title: 'Комплексный подход',
    description:
      'Интеграция всех трех методологий для наиболее полного и глубокого понимания вашей ситуации и путей развития.',
    color: 'from-indigo-500 to-indigo-700',
  },
]

export function Services() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  const toggle = (index: number) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  return (
    <section id="methodology" className="relative py-20 px-4 z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Методология работы
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Три взаимодополняющих инструмента, с которыми я работаю на консультациях
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            if (!Icon) return null
            const isExpanded = expanded[index]

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="glass-effect rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 
                         transform hover:scale-[1.02] group cursor-pointer flex flex-col"
                onClick={() => toggle(index)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.color} 
                               flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    className="shrink-0 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center 
                             ml-4 text-gray-400 group-hover:text-purple-400 group-hover:bg-white/10 
                             transition-colors duration-300"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </div>
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-300 leading-relaxed pt-4 border-t border-white/10">
                        {service.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
