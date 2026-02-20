'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CalendarHeart, ArrowRight } from 'lucide-react'

export function WorkshopBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative py-12 px-4 z-10"
    >
      <Link href="/relationshipastrology">
        <div className="max-w-4xl mx-auto glass-effect rounded-2xl p-8 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10 cursor-pointer">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shrink-0">
              <CalendarHeart className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-1">Астрология Отношений</h3>
              <p className="text-gray-300 text-sm">
                Живой мастер-класс в Алматы · Календарь на год в подарок
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-purple-300 font-semibold">
              Подробнее
              <ArrowRight className="w-5 h-5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.section>
  )
}
