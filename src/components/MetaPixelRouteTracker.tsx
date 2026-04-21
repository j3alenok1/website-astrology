'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/** Дополнительный PageView при клиентской навигации Next.js (после первой загрузки). */
export function MetaPixelRouteTracker() {
  const pathname = usePathname()
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim()
  const prevPathRef = useRef<string | null>(null)

  useEffect(() => {
    if (!pixelId || typeof window === 'undefined' || !window.fbq) return
    if (prevPathRef.current === null) {
      prevPathRef.current = pathname
      return
    }
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname
      window.fbq('track', 'PageView')
    }
  }, [pathname, pixelId])

  return null
}

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
  }
}
