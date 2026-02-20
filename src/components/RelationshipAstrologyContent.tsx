'use client'

import { motion } from 'framer-motion'
import { Heart, Calendar } from 'lucide-react'

export function RelationshipAstrologyContent() {
  return (
    <div className="relative z-10 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-purple-300 text-sm uppercase tracking-widest mb-2">ASTRO by NDAUZH</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Астрология Отношений
          </h1>
          <p className="text-xl text-gray-300">
            Если вы уже в отношениях — как их углубить и улучшить.
            <br />
            А если ещё нет — найти те самые!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass-effect rounded-2xl p-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Эта встреча для тебя, если в мыслях есть вопросы:</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              «Почему меня тянет к одним и тем же типажам?»
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              «Почему в начале всё хорошо, а после становится непонятно»
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              «Я вообще умею быть в здоровых отношениях или со мной что-то не так?»
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              «Как понять, мой ли это человек, опираясь на факты»
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-pink-400" />
              <h3 className="text-lg font-bold text-white">Если ты в отношениях</h3>
            </div>
            <p className="text-gray-300 mb-2">и хочешь понять:</p>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• что реально происходит между вами</li>
              <li>• устала ходить по кругу одних и тех же конфликтов</li>
              <li>• ищешь не советы, а причины и механизмы</li>
            </ul>
          </div>
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Если ты без отношений</h3>
            </div>
            <p className="text-gray-300 mb-2">и хочешь разобраться:</p>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• почему они не складываются</li>
              <li>• боишься снова «выбрать не того»</li>
              <li>• хочешь понять, какие отношения тебе вообще нужны</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass-effect rounded-2xl p-8"
        >
          <p className="text-purple-200 text-sm mb-4">Уровень знаний в астрологии не важен. Будем идти от базы, но глубоко.</p>
          <h3 className="text-lg font-bold text-white mb-4">Только представь! В натальной карте ты можешь увидеть:</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• где смотреть информацию об отношениях (партнёры, место встречи, слабые точки)</li>
            <li>• какие люди тебе подходят, а какие — триггерят старые сценарии</li>
            <li>• кого выбираешь ты и кто выбирает тебя</li>
            <li>• твои сильные и слабые стороны в близости</li>
            <li>• где и каким способом притянуть нужного партнёра или разжечь страсть с уже имеющимся</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="glass-effect rounded-2xl p-8 border-2 border-purple-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-green-400" />
            <h3 className="text-xl font-bold gradient-text">Готовая методичка «Астрология Отношений»</h3>
          </div>
          <p className="text-gray-300 mb-6">
            Всё, о чём мы говорили выше — в одном готовом материале. Методичка отвечает на твои вопросы: почему тянет к одним и тем же типажам, как понять «своего» человека, где искать в натальной карте подсказки для отношений — и даёт календарь благоприятных дат на год. Оплатил — получил. Сразу.
          </p>
          <div className="flex items-center gap-2 p-4 bg-green-500/20 rounded-xl border border-green-500/30">
            <Calendar className="w-6 h-6 text-green-400 shrink-0" />
            <p className="text-green-200 font-medium">
              4 990 ₸ — полная методичка с ответами на все вопросы выше + календарь удачных дат на год. Скачивание сразу после оплаты.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
