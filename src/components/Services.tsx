'use client'

import { useState, useId, memo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Brain, Star } from 'lucide-react'
import { CosmicDustCanvas } from './CosmicDustCanvas'

const services = [
  {
    id: 'astrologiya',
    dustColor: 'purple' as const,
    icon: Sparkles,
    title: 'Астрология',
    description:
      'Глубокий анализ натальной карты, прогнозирование событий и понимание вашего жизненного пути через призму звезд.',
    color: 'from-purple-500 to-pink-600',
    glow: '0 0 25px rgba(139, 92, 246, 0.5), 0 0 50px rgba(236, 72, 153, 0.25), inset 0 0 20px rgba(139, 92, 246, 0.05)',
    buttonGlow: '0 0 15px rgba(139, 92, 246, 0.6), 0 0 30px rgba(236, 72, 153, 0.3)',
    buttonBg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.35), rgba(236, 72, 153, 0.3))',
    buttonBorder: 'rgba(139, 92, 246, 0.6)',
    iconGlow: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.25), transparent 70%)',
  },
  {
    id: 'taro',
    dustColor: 'pink' as const,
    icon: Star,
    title: 'Таро',
    description:
      'Расклады карт Таро для получения ответов на важные вопросы и понимания текущей ситуации в различных сферах жизни.',
    color: 'from-pink-500 to-orange-500',
    glow: '0 0 25px rgba(236, 72, 153, 0.5), 0 0 50px rgba(249, 115, 22, 0.25), inset 0 0 20px rgba(236, 72, 153, 0.05)',
    buttonGlow: '0 0 15px rgba(236, 72, 153, 0.6), 0 0 30px rgba(249, 115, 22, 0.3)',
    buttonBg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.35), rgba(249, 115, 22, 0.3))',
    buttonBorder: 'rgba(236, 72, 153, 0.6)',
    iconGlow: 'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.25), transparent 70%)',
  },
  {
    id: 'psihologiya',
    dustColor: 'blue' as const,
    icon: Brain,
    title: 'Психология',
    description:
      'Психологический анализ и поддержка для работы с внутренними состояниями, отношениями и личностным ростом.',
    color: 'from-blue-500 to-cyan-500',
    glow: '0 0 25px rgba(59, 130, 246, 0.5), 0 0 50px rgba(34, 211, 238, 0.25), inset 0 0 20px rgba(59, 130, 246, 0.05)',
    buttonGlow: '0 0 15px rgba(59, 130, 246, 0.6), 0 0 30px rgba(34, 211, 238, 0.3)',
    buttonBg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.35), rgba(34, 211, 238, 0.3))',
    buttonBorder: 'rgba(59, 130, 246, 0.6)',
    iconGlow: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.25), transparent 70%)',
  },
  {
    id: 'kompleksnyy-podhod',
    dustColor: 'violet' as const,
    icon: Sparkles,
    title: 'Комплексный подход',
    description:
      'Интеграция всех трех методологий для наиболее полного и глубокого понимания вашей ситуации и путей развития.',
    color: 'from-purple-500 to-violet-600',
    glow: '0 0 25px rgba(139, 92, 246, 0.5), 0 0 50px rgba(124, 58, 237, 0.25), inset 0 0 20px rgba(139, 92, 246, 0.05)',
    buttonGlow: '0 0 15px rgba(139, 92, 246, 0.6), 0 0 30px rgba(124, 58, 237, 0.3)',
    buttonBg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.35), rgba(124, 58, 237, 0.3))',
    buttonBorder: 'rgba(139, 92, 246, 0.6)',
    iconGlow: 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.25), transparent 70%)',
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
      className={`glass-effect rounded-2xl p-8 flex flex-col transition-all duration-300 relative
        ${isOpen ? '!bg-white/15' : '!bg-white/5 hover:!bg-white/10'}
        hover:scale-[1.02] group neon-card`}
      style={{
        ['--neon-glow' as string]: service.glow,
        boxShadow: service.glow,
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <div className="relative z-10 flex flex-col flex-1 min-h-0">
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`icon-with-starburst w-16 h-16 rounded-full bg-gradient-to-br ${service.color} 
                   flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300 relative overflow-visible`}
          style={{
            boxShadow: service.buttonGlow,
            ['--icon-glow' as string]: service.iconGlow,
          }}
          data-starburst={service.dustColor}
        >
          <div className="icon-glow-layer" aria-hidden />
          <Icon className="w-8 h-8 text-white relative z-10" />
          <div className="starburst-flash" aria-hidden />
        </div>
        <h3 className="text-2xl font-bold text-white flex-1 min-w-0">{service.title}</h3>
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
            <p className="text-gray-300 leading-relaxed pb-4 border-b border-white/10 mb-4">
              {service.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleToggle}
        className="mt-auto w-full py-3 px-4 rounded-full font-semibold text-white text-sm
          backdrop-blur-sm border hover:opacity-90 transition-all duration-300"
        style={{
          background: service.buttonBg,
          borderColor: service.buttonBorder,
          boxShadow: service.buttonGlow,
        }}
      >
        {isOpen ? 'Свернуть' : 'Подробнее'}
      </button>
      </div>
    </motion.div>
  )
})

export function Services() {
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <section id="methodology" className="relative py-20 px-4 z-10">
      <div ref={sectionRef} className="relative min-h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage: `linear-gradient(to bottom, transparent 0%, black 12%, black 75%, transparent 100%)`,
            WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black 12%, black 75%, transparent 100%)`,
            maskSize: '100% 100%',
            maskRepeat: 'no-repeat',
          }}
        >
          <CosmicDustCanvas containerRef={sectionRef} />
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background: `
                radial-gradient(circle at 30% 50%, rgba(140, 0, 255, 0.15), transparent 60%),
                radial-gradient(circle at 70% 40%, rgba(0, 120, 255, 0.15), transparent 60%)
              `,
            }}
            aria-hidden
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start relative">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}
