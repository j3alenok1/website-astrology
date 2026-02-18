'use client'

import { useEffect, useRef } from 'react'

export function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const stars: Array<{ x: number; y: number; radius: number; vx: number; vy: number; brightness: number; hue: number }> = []
    const starCount = 180

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        brightness: Math.random() * 0.6 + 0.3,
        hue: Math.random() > 0.7 ? 1 : 0,
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        star.x += star.vx
        star.y += star.vy

        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0
        if (star.y < 0) star.y = canvas.height
        if (star.y > canvas.height) star.y = 0

        const r = star.radius * 4
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, r)
        if (star.hue > 0.5) {
          gradient.addColorStop(0, `rgba(236, 72, 153, ${star.brightness * 0.8})`)
          gradient.addColorStop(1, 'rgba(236, 72, 153, 0)')
        } else {
          gradient.addColorStop(0, `rgba(139, 92, 246, ${star.brightness})`)
          gradient.addColorStop(0.5, `rgba(59, 130, 246, ${star.brightness * 0.5})`)
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0)')
        }

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, r, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  )
}
