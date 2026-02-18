'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void
  }
}

export function YandexMetrika() {
  const pathname = usePathname()
  const initialized = useRef(false)

  useEffect(() => {
    const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
    if (!metrikaId || typeof window === 'undefined') return

    const id = parseInt(metrikaId, 10)
    if (isNaN(id)) return

    const initAndHit = () => {
      if (initialized.current) return
      initialized.current = true
      window.ym?.(id, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      })
      window.ym?.(id, 'hit', window.location.pathname + window.location.search)
    }

    if (window.ym) {
      initAndHit()
      return
    }

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://mc.yandex.ru/metrika/tag.js'
    script.onload = initAndHit
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
    if (!metrikaId || typeof window === 'undefined' || !window.ym) return

    const id = parseInt(metrikaId, 10)
    if (isNaN(id)) return

    window.ym(id, 'hit', pathname)
  }, [pathname])

  const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
  if (!metrikaId) return null

  return (
    <noscript>
      <div>
        <img
          src={`https://mc.yandex.ru/watch/${metrikaId}`}
          style={{ position: 'absolute', left: '-9999px' }}
          alt=""
        />
      </div>
    </noscript>
  )
}
