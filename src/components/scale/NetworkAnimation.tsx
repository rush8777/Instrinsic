"use client"

import { useEffect, useRef } from "react"

interface Dot {
  x: number
  y: number
  vx: number
  vy: number
}

export function NetworkAnimation({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let dots: Dot[] = []
    const numDots = 40
    const connectionDistance = 120
    const dotRadius = 2

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const initDots = () => {
      dots = []
      for (let i = 0; i < numDots; i++) {
        dots.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Update and draw dots
      dots.forEach((dot, i) => {
        // Update position
        dot.x += dot.vx
        dot.y += dot.vy

        // Bounce off edges
        if (dot.x < 0 || dot.x > canvas.offsetWidth) dot.vx *= -1
        if (dot.y < 0 || dot.y > canvas.offsetHeight) dot.vy *= -1

        // Draw connections
        for (let j = i + 1; j < dots.length; j++) {
          const other = dots[j]
          const dx = dot.x - other.x
          const dy = dot.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.15
            ctx.beginPath()
            ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`
            ctx.lineWidth = 1
            ctx.moveTo(dot.x, dot.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
          }
        }

        // Draw dot
        ctx.beginPath()
        ctx.fillStyle = "rgba(168, 85, 247, 0.4)"
        ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    resize()
    initDots()
    animate()

    window.addEventListener("resize", () => {
      resize()
      initDots()
    })

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-none ${className || ""}`} />
}
