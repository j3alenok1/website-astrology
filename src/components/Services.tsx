'use client'

import { useState, useId, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Brain, Star, ChevronDown } from 'lucide-react'

const services = [
  {
    id: 'astrologiya',
    icon: Sparkles,
    title: 'Астрология',
    description:
      'Глубокий анализ натальной карты, прогнозирование событий и понимание вашего жизненного пути через призму звезд.',
    color: 'from-purple-500 to-purple-700',
  },
  {
    id: 'taro',
    icon: Star,
    title: 'Таро',
    description:
      'Расклады карт Таро для получения ответов на важные вопросы и понимания текущей ситуации в различных сферах жизни.',
    color: 'from-pink-500 to-pink-700',
  },
  {
    id: 'psihologiya',
    icon: Brain,
    title: 'Психология',
    description:
      'Психологический анализ и поддержка для работы с внутренними состояниями, отношениями и личностным ростом.',
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 'kompleksnyy-podhod',
    icon: Sparkles,
    title: 'Комплексный подход',
    description:
      'Интеграция всех трех методологий для наиболее полного и глубокого понимания вашей ситуации и путей развития.',
    color: 'from-indigo-500 to-indigo-700',
  },
]

const TRANSITION = { duration: 0.35, ease: [0.32, 0.72, 0, 1] }

interface ServiceCardProps {
  service: (typeof services)[0]
  index: number
}

const ServiceCard = memo(function ServiceCard({ service, index }: ServiceCardProps) {
  const uniqueId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const Icon = service.icon

  if (!Icon) return null

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className={`glass-effect rounded-2xl p-8 cursor-pointer flex flex-col transition-all duration-300
        ${isOpen ? '!bg-white/15' : '!bg-white/5 hover:!bg-white/10'}
        hover:scale-[1.02] group`}
      onClick={handleToggle}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.color} 
                   flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white flex-1 min-w-0">{service.title}</h3>
      </div>

      <div className="flex justify-end mt-2">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center 
                   transition-colors duration-300
                   ${isOpen ? 'bg-white/10 text-purple-400' : 'bg-white/5 text-gray-400 group-hover:text-purple-400 group-hover:bg-white/10'}`}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={TRANSITION}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={`${uniqueId}-content`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={TRANSITION}
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
})

export function Services() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
