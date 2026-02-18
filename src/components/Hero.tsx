'use client'

import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-[75vh] flex items-center justify-center px-4 pt-16 pb-20">
      <div className="max-w-4xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl font-semibold mb-3 text-gray-200">
            ASTRO by NDAUZH
          </h1>
          <p className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Астрология — твой ключ к лучшей жизни!
          </p>
          <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Помогаю вам принимать сложные решения, выстраивать отношения и карьеру,
            опираясь на глубокий анализ вашей натальной карты, запросов и текущего жизненного этапа.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="#booking"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold 
                       hover:from-purple-500 hover:to-pink-500 transition-all duration-300 cosmic-glow
                       transform hover:scale-105"
            >
              Записаться на консультацию
            </a>
            <a
              href="#methodology"
              className="px-8 py-4 glass-effect rounded-full text-white font-semibold 
                       hover:bg-white/20 transition-all duration-300"
            >
              Как я работаю
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-10"
        >
          <a href="#products" className="inline-block animate-bounce">
            <ArrowDown className="w-8 h-8 text-purple-400" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
