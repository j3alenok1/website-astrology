'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Smartphone } from 'lucide-react'

export default function PaymentSuccessPage() {
  const [orderId, setOrderId] = useState<string | null>(null)
  const [provider, setProvider] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setOrderId(params.get('orderId'))
    setProvider(params.get('provider'))
  }, [])

  const isKaspi = provider === 'kaspi'

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950">
      <div className="max-w-md w-full text-center">
        <div className="glass-effect rounded-2xl p-8">
          <div
            className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isKaspi ? 'bg-red-500/20' : 'bg-green-500/20'
            }`}
          >
            {isKaspi ? (
              <Smartphone className="w-10 h-10 text-red-400" />
            ) : (
              <CheckCircle className="w-10 h-10 text-green-400" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isKaspi ? 'Счёт отправлен в Kaspi.kz' : 'Оплата прошла успешно'}
          </h1>
          <p className="text-gray-300 mb-6">
            {isKaspi
              ? 'Откройте приложение Kaspi.kz на телефоне и оплатите счёт. После оплаты я свяжусь с вами для уточнения деталей.'
              : 'Спасибо! Ваша заявка записана. Я свяжусь с вами в ближайшее время для уточнения деталей.'}
          </p>
          {orderId && (
            <p className="text-gray-500 text-sm mb-6">Номер заказа: {orderId.slice(0, 8)}...</p>
          )}
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </main>
  )
}
