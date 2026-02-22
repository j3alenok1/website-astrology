'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  radius: number
  speedY: number
  opacity: number
  color: string
}

export function CosmicDustCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const colors = [
      'rgba(255,255,255,',
      'rgba(200,180,255,',
      'rgba(180,150,255,',
      'rgba(236,72,153,',
      'rgba(139,92,246,',
    ]

    const initParticles = (width: number, height: number) => {
      const particles: Particle[] = []
      for (let i = 0; i < 120; i++) {
        const colorIdx = Math.floor(Math.random() * colors.length)
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 0.5,
          speedY: Math.random() * 0.5 + 0.2,
          opacity: Math.random() * 0.6 + 0.3,
          color: colors[colorIdx],
        })
      }
      return particles
    }

    const resize = (reinitParticles = false) => {
      const rect = container.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (reinitParticles || particlesRef.current.length === 0) {
        particlesRef.current = initParticles(rect.width, rect.height)
      } else {
        particlesRef.current.forEach((p) => {
          if (p.x > rect.width) p.x = Math.random() * rect.width
          if (p.y > rect.height) p.y = Math.random() * rect.height
        })
      }
    }

    let width = 0
    let height = 0

    const animate = () => {
      const rect = container.getBoundingClientRect()
      width = rect.width
      height = rect.height
      if (width <= 0 || height <= 0) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      ctx.clearRect(0, 0, width, height)

      particlesRef.current.forEach((p) => {
        p.y -= p.speedY
        if (p.y < 0) {
          p.y = height
          p.x = Math.random() * width
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${p.opacity})`
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    resize(true)
    animate()

    const resizeObserver = new ResizeObserver(() => resize(false))
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
        aria-hidden
      />
    </div>
  )
}
