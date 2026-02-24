'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void
  }
}

export function YandexMetrika() {
  const pathname = usePathname()

  useEffect(() => {
    const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || '106988269'
    if (typeof window === 'undefined' || !window.ym) return

    const id = parseInt(metrikaId, 10)
    if (isNaN(id)) return

    window.ym(id, 'hit', pathname)
  }, [pathname])

  return null
}
