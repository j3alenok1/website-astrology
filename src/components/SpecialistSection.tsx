'use client'

import { motion } from 'framer-motion'

export function SpecialistSection() {
  return (
    <section id="specialist" className="relative py-20 px-4 z-10">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">
            Астролог и таролог в Алматы
          </h2>

          <div className="space-y-6 text-left text-gray-300 text-lg leading-relaxed">
            <p>
              Я — практикующий <strong>астролог в Алматы</strong> и таролог. Работаю на стыке астрологии и психологии, чтобы вы получали не только ясность, но и практические шаги и поддержку.
            </p>
            <p>
              В своей практике я сочетаю натальную астрологию, транзиты и таро. Мне важно, чтобы каждый запрос находил отклик: я помогаю разобраться в отношениях, выборе пути, сложных решениях и внутренних конфликтах.
            </p>
            <p>
              Я верю, что звёзды и карты — это инструменты для самопознания, а не приговор. Моя задача — быть проводником: мягко направлять, задавать вопросы и помогать находить ответы внутри себя.
            </p>
            <p>
              Буду рада познакомиться и поддержать вас на этом пути.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
