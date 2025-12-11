"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

// Import from your components/scale folder
import { H2, H3, Body } from "@/components/scale/typography"
import { ScaleButton, IconButton } from "@/components/scale/buttons"
import { ScaleCard, HighlightCard } from "@/components/scale/cards"
import { IconWithBackground } from "@/components/scale/icon-with-background"
import { Coins, Settings, Building, Compass, MapPin, Bookmark, MoreHorizontal, Plus, Layers, Zap } from "lucide-react"

// ============================================
// NETWORK ANIMATION COMPONENT (INLINE)
// ============================================
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

function NetworkAnimation({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.offsetWidth
        canvas.height = parent.offsetHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize particles
    const particleCount = 40
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
    }))

    const animate = () => {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(168, 85, 247, 0.4)"
        ctx.fill()
      })

      // Draw connections
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x
          const dy = particle.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 * (1 - distance / 120)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className || ""}`}
      style={{ opacity: 0.6 }}
    />
  )
}

// ============================================
// JOB CARD COMPONENT
// ============================================
function JobCard({
  icon,
  company,
  role,
  salary,
  location,
}: {
  icon: React.ReactNode
  company: string
  role: string
  salary: string
  location: string
}) {
  return (
    <ScaleCard className="flex flex-col gap-4 p-4">
      <div className="flex items-start gap-2">
        <IconWithBackground icon={icon} size="md" square />
        <div className="flex flex-1 items-center justify-end gap-1">
          <IconButton variant="ghost" size="sm">
            <Bookmark className="w-4 h-4" />
          </IconButton>
          <IconButton variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </IconButton>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-foreground line-clamp-1">{company}</span>
          <span className="text-xs text-muted-foreground line-clamp-1">{role}</span>
        </div>
        <span className="text-lg font-semibold text-foreground">{salary}</span>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </div>
      </div>
    </ScaleCard>
  )
}

// ============================================
// CREATE PROJECT CARD COMPONENT
// ============================================
function CreateProjectCard({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg border border-dashed border-border/60 bg-card/30 hover:bg-card/50 hover:border-border transition-all duration-200 min-h-[180px] cursor-pointer group"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary group-hover:bg-accent/20 transition-colors">
        <Plus className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
        Create New Project
      </span>
    </button>
  )
}

// ============================================
// QUICK ACTION CARD COMPONENT
// ============================================
function QuickActionCard({
  title,
  buttonText,
  onClick,
}: {
  title: string
  buttonText: string
  onClick?: () => void
}) {
  return (
    <HighlightCard className="flex-1 min-w-[160px]">
      <div className="flex flex-col gap-3">
        <H3 className="text-sm">{title}</H3>
        <ScaleButton size="sm" onClick={onClick}>
          {buttonText}
        </ScaleButton>
      </div>
    </HighlightCard>
  )
}

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
export default function Dashboard() {
  const [referralLink] = useState("https://app.scale.com/ref/abc123xyz")

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col gap-12 px-6 md:px-12 py-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="flex-1 text-4xl font-semibold text-foreground">Hi, Alex!</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Balance</span>
              <div className="w-px h-6 bg-border" />
              <div className="flex items-center gap-1">
                <Coins className="w-5 h-5 text-foreground" />
                <span className="text-xl font-semibold text-foreground">0</span>
              </div>
            </div>
            <ScaleButton>Refer & Earn</ScaleButton>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="relative flex flex-wrap items-center gap-4 rounded-xl overflow-hidden p-5 md:p-6 bg-gradient-to-r from-accent/20 via-purple-500/10 to-accent/15">
          {/* Network animation background */}
          <NetworkAnimation />

          {/* Content with relative positioning to appear above animation */}
          <div className="relative z-10 flex flex-1 min-w-[200px] flex-col gap-2 py-2 pr-4">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground/70">Welcome to</span>
              <span className="text-xl font-semibold text-foreground">Scale AI</span>
            </div>
            <Body className="text-foreground/70 text-sm">Full access to job openings and career help.</Body>
          </div>

          <QuickActionCard title="Find your next gig" buttonText="Browse jobs" />
          <QuickActionCard title="Career help" buttonText="Browse posts" />
          <QuickActionCard title="Refer & earn" buttonText="Earn today" />
        </div>

        {/* Projects Grid */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <H2 className="flex-1">Your Projects</H2>
            <ScaleButton variant="link" withArrow>
              View all
            </ScaleButton>
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <JobCard
              icon={<Settings className="w-4 h-4" />}
              company="Freelance Labs"
              role="Account Manager"
              salary="$250k/yr"
              location="San Francisco, CA"
            />
            <JobCard
              icon={<Building className="w-4 h-4" />}
              company="Tech Startup Inc"
              role="Product Designer"
              salary="$180k/yr"
              location="Remote"
            />
            <JobCard
              icon={<Compass className="w-4 h-4" />}
              company="Scale AI"
              role="ML Engineer"
              salary="$300k/yr"
              location="New York, NY"
            />
            <JobCard
              icon={<Layers className="w-4 h-4" />}
              company="DataFlow"
              role="Data Scientist"
              salary="$220k/yr"
              location="Austin, TX"
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <JobCard
              icon={<Zap className="w-4 h-4" />}
              company="Rapid Systems"
              role="Backend Dev"
              salary="$190k/yr"
              location="Seattle, WA"
            />
            <CreateProjectCard onClick={() => console.log("Create new project")} />
          </div>
        </div>
      </div>
    </div>
  )
}
