'use client'

import { useEffect, useRef, type RefObject } from 'react'

interface Star {
  x: number
  y: number
  size: number
  alpha: number
  twinkleSpeed: number
}

interface CosmicDustCanvasProps {
  containerRef?: RefObject<HTMLDivElement | null>
}

export function CosmicDustCanvas({ containerRef }: CosmicDustCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef?.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const initStars = (width: number, height: number) => {
      const stars: Star[] = []
      for (let i = 0; i < 120; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5,
          alpha: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.005,
        })
      }
      return stars
    }

    const drawStar = (x: number, y: number, size: number, alpha: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.globalAlpha = alpha
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(-size, 0)
      ctx.lineTo(size, 0)
      ctx.moveTo(0, -size)
      ctx.lineTo(0, size)
      ctx.stroke()
      ctx.restore()
    }

    const getDimensions = () => {
      if (container) {
        const rect = container.getBoundingClientRect()
        return { w: rect.width, h: rect.height }
      }
      return { w: window.innerWidth, h: window.innerHeight }
    }

    const resize = () => {
      const { w, h } = getDimensions()
      if (w <= 0 || h <= 0) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      starsRef.current = initStars(w, h)
    }

    const animate = () => {
      const { w, h } = getDimensions()
      if (w <= 0 || h <= 0) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      ctx.clearRect(0, 0, w, h)

      starsRef.current.forEach((star) => {
        star.alpha += star.twinkleSpeed
        if (star.alpha > 1 || star.alpha < 0.1) {
          star.twinkleSpeed *= -1
        }
        drawStar(star.x, star.y, star.size, star.alpha)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    resize()
    animate()

    const handleResize = () => {
      const { w, h } = getDimensions()
      if (w <= 0 || h <= 0) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (starsRef.current.length === 0) {
        starsRef.current = initStars(w, h)
      } else {
        starsRef.current.forEach((star) => {
          if (star.x > w) star.x = Math.random() * w
          if (star.y > h) star.y = Math.random() * h
        })
      }
    }

    const resizeObserver = container ? new ResizeObserver(handleResize) : null
    if (container) resizeObserver?.observe(container)
    window.addEventListener('resize', handleResize)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [containerRef])

  const isScoped = !!containerRef

  return (
    <canvas
      ref={canvasRef}
      id={isScoped ? undefined : 'dust'}
      className={isScoped ? 'absolute inset-0 w-full h-full pointer-events-none' : 'fixed inset-0 w-full h-full z-0'}
      style={{ pointerEvents: 'none' }}
      aria-hidden
    />
  )
}
