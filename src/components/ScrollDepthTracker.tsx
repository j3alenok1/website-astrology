'use client'

import { useEffect, useRef } from 'react'
import { reachGoal } from '@/lib/metrika'

const THRESHOLDS = [50, 75, 100] as const

export function ScrollDepthTracker() {
  const reached = useRef<Set<number>>(new Set())

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return

      const percent = Math.round((scrollTop / docHeight) * 100)

      for (const t of THRESHOLDS) {
        if (percent >= t && !reached.current.has(t)) {
          reached.current.add(t)
          reachGoal('scroll_depth', { depth: t })
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return null
}
