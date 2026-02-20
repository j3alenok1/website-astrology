'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { CheckCircle, Smartphone, Download } from 'lucide-react'

const DIGITAL_PRODUCT = 'astrologiya-otnosheniy'

export default function PaymentSuccessPage() {
  const [orderId, setOrderId] = useState<string | null>(null)
  const [provider, setProvider] = useState<string | null>(null)
  const [product, setProduct] = useState<string | null>(null)
  const [downloadStatus, setDownloadStatus] = useState<'pending' | 'downloading' | 'done' | 'retry' | 'error'>('pending')
  const retryCount = useRef(0)
  const maxRetries = 5

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setOrderId(params.get('orderId'))
    setProvider(params.get('provider'))
    setProduct(params.get('product'))
  }, [])

  useEffect(() => {
    if (product !== DIGITAL_PRODUCT || !orderId) return

    const tryDownload = async () => {
      setDownloadStatus('downloading')
      try {
        const res = await fetch(`/api/download/calendar?orderId=${orderId}`)
        if (res.ok) {
          const blob = await res.blob()
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'relationship-calendar.pdf'
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          setDownloadStatus('done')
        } else if (res.status === 402 && retryCount.current < maxRetries) {
          retryCount.current += 1
          setDownloadStatus('retry')
          setTimeout(tryDownload, 3000)
        } else {
          setDownloadStatus('error')
        }
      } catch {
        if (retryCount.current < maxRetries) {
          retryCount.current += 1
          setDownloadStatus('retry')
          setTimeout(tryDownload, 3000)
        } else {
          setDownloadStatus('error')
        }
      }
    }

    tryDownload()
  }, [product, orderId])

  const isKaspi = provider === 'kaspi'
  const isDigitalProduct = product === DIGITAL_PRODUCT

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
              : isDigitalProduct
                ? 'Спасибо! Календарь «Астрология Отношений» скачивается автоматически.'
                : 'Спасибо! Ваша заявка записана. Я свяжусь с вами в ближайшее время для уточнения деталей.'}
          </p>

          {isDigitalProduct && orderId && (
            <div className="mb-6">
              {downloadStatus === 'retry' && (
                <p className="text-amber-400 text-sm mb-2">
                  Ожидаем подтверждение оплаты... ({retryCount.current}/{maxRetries})
                </p>
              )}
              {downloadStatus === 'done' && (
                <p className="text-green-400 text-sm mb-2">Календарь скачан</p>
              )}
              {downloadStatus === 'error' && (
                <a
                  href={`/api/download/calendar?orderId=${orderId}`}
                  download="relationship-calendar.pdf"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-full text-white font-semibold transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Скачать календарь
                </a>
              )}
            </div>
          )}

          {orderId && !isDigitalProduct && (
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
