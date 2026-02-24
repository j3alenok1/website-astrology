'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { products } from '@/lib/products'
import { reachGoal } from '@/lib/metrika'

export function Products() {
  const router = useRouter()

  const scrollToBooking = (productSlug: string) => {
    reachGoal('click_product', { product: productSlug })
    const params = new URLSearchParams(window.location.search)
    params.set('product', productSlug)
    const url = `/?${params.toString()}`
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    router.replace(url, { scroll: false })
  }

  return (
    <section id="products" className="relative py-20 px-4 z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Продукты</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Выберите формат под ваш запрос. Результат: ясность, PDF и при необходимости практики для самостоятельной работы.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products
            .filter((p) => p.slug !== 'astrologiya-otnosheniy')
            .map((product, index) => {
            const Icon = product.icon
            const withExtra = product.extra
            return (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="glass-effect rounded-2xl p-6 flex flex-col justify-between h-full hover:bg-white/15 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{product.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">{product.description}</p>
                  <p className="text-sm text-purple-200 mb-1">{product.format}</p>
                  {withExtra && (
                    <p className="text-xs text-purple-200/90 mb-2 italic">{product.extra}</p>
                  )}
                  <p className="text-sm font-semibold text-white">{product.price}</p>
                </div>
                <button
                  className="mt-4 w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold text-sm
                           hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                  onClick={() => scrollToBooking(product.slug)}
                >
                  Записаться
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
