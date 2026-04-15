'use client'

import { motion } from 'framer-motion'
import { Calendar, Heart, Sparkles } from 'lucide-react'
import Link from 'next/link'

const CALENDAR_WHATSAPP_URL =
  'https://wa.clck.bar/77759098093?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%A5%D0%BE%D1%87%D1%83%20%D0%BA%D1%83%D0%BF%D0%B8%D1%82%D1%8C%20%D0%BA%D0%B0%D0%BB%D0%B5%D0%BD%D0%B4%D0%B0%D1%80%D1%8C'

export function RelationshipAstrologyContent() {
  return (
    <div className="relative z-10 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Календарь удачных и неудачных дат для отношений
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Узнайте заранее:
          </p>
          <ul className="text-gray-300 space-y-2 mb-6 max-w-xl mx-auto text-left">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              когда лучше говорить о важных вещах
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              в какие дни разговоры чаще заканчиваются конфликтом
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              когда идеальный момент для свиданий и близости
            </li>
          </ul>
          <p className="text-purple-200 mb-8">
            Основано на анализе лунных циклов.
          </p>
          <p className="text-gray-300 mb-8">
            Начните выбирать правильные моменты для отношений.
          </p>
          <a
            href={CALENDAR_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg"
          >
            Получить календарь
          </a>
        </motion.div>

        {/* Блок «Знакомо?» */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass-effect rounded-2xl p-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Знакомо?</h2>
          <p className="text-gray-300 mb-4">
            Вы хотите спокойно поговорить об отношениях…<br />
            а партнёр закрывается или раздражается.
          </p>
          <p className="text-gray-300 mb-4">
            Или наоборот — отношения хорошие,<br />
            но хочется больше романтики и близости.
          </p>
          <p className="text-purple-200 font-medium mb-4">
            Иногда проблема не в словах.<br />
            А в неподходящем моменте.
          </p>
          <Link
            href="/lunnye-cikly-otnosheniya"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 text-sm transition-colors"
          >
            Подробнее об этом в статье →
          </Link>
        </motion.div>

        {/* Блок «Решение» */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="glass-effect rounded-2xl p-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Решение</h2>
          <p className="text-gray-300 mb-4">
            Календарь помогает заранее понимать:
          </p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
              какие дни подходят для серьёзных разговоров
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
              когда лучше не поднимать сложные темы
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
              какие периоды идеально подходят для романтики и близости
            </li>
          </ul>
        </motion.div>

        {/* Блок «Что вы получите» */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass-effect rounded-2xl p-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Что вы получите</h2>
          <p className="text-gray-300 mb-4">
            В календаре:
          </p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
              удачные и неудачные дни для отношений
            </li>
            <li className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
              периоды повышенной эмоциональности
            </li>
            <li className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
              лучшие дни для разговоров
            </li>
            <li className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
              лучшие даты для свиданий и близости
            </li>
          </ul>
          <p className="text-purple-200 mt-6 font-medium">
            Простой инструмент, который помогает выбирать правильный момент.
          </p>
        </motion.div>

        {/* Блок доверия */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="glass-effect rounded-2xl p-8 border-2 border-purple-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-pink-400" />
            <h2 className="text-xl font-bold text-white">Обо мне</h2>
          </div>
          <p className="text-gray-300">
            Я практикующий астролог с опытом более 5 лет. Моя прогностика основана не только на транзитах планет — я также учитываю лунные сутки, положение Луны в знаках и другие факторы, которые формируют эмоциональный фон дня.
          </p>
          <p className="text-gray-300 mt-4">
            Эта система планирования дней сформировалась за годы ежедневной практики и анализа.
          </p>
        </motion.div>

        {/* Блок цены и CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="glass-effect rounded-2xl p-8"
        >
          <p className="text-gray-300 mb-4">
            Иногда отношения рушатся не потому, что люди сказали что-то не то.
          </p>
          <p className="text-gray-300 mb-6">
            А потому что разговор произошёл в неподходящий момент.
          </p>
          <p className="text-purple-200 font-medium mb-6">
            Календарь помогает заранее понимать такие моменты.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-green-500/20 rounded-xl border border-green-500/30">
            <p className="text-green-200 font-medium text-center sm:text-left">
              Стоимость календаря 3500 тг.
            </p>
            <a
              href={CALENDAR_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shrink-0"
            >
              Получить календарь
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
