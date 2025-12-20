import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import { ArrowRight, ArrowUpRight } from "lucide-react"

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

// Base Card
export function ScaleCard({ children, className, onClick }: CardProps) {
  return <div className={cn("rounded-xl border border-border bg-card p-6", className)} onClick={onClick}>{children}</div>
}

// Feature Card - with icon and description
interface FeatureCardProps {
  icon?: ReactNode
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 hover:border-muted-foreground/30 transition-colors",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-secondary">{icon}</div>
      )}
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

// Link Card - clickable card with arrow
interface LinkCardProps {
  title: string
  description?: string
  href?: string
  className?: string
  external?: boolean
}

export function LinkCard({ title, description, href = "#", className, external = false }: LinkCardProps) {
  return (
    <a
      href={href}
      className={cn(
        "group block rounded-xl border border-border bg-card p-6 hover:border-muted-foreground/30 transition-all",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-foreground mb-1 group-hover:text-muted-foreground transition-colors">
            {title}
          </h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {external ? (
          <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        ) : (
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        )}
      </div>
    </a>
  )
}

// Stats Card
interface StatsCardProps {
  value: string
  label: string
  className?: string
}

export function StatsCard({ value, label, className }: StatsCardProps) {
  return (
    <div className={cn("text-center p-6", className)}>
      <div className="text-4xl md:text-5xl font-medium text-foreground mb-2">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

// Product Card - for showcasing features/products
interface ProductCardProps {
  overline?: string
  title: string
  description: string
  children?: ReactNode
  className?: string
}

export function ProductCard({ overline, title, description, children, className }: ProductCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      <div className="p-6 md:p-8">
        {overline && (
          <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium block mb-3">
            {overline}
          </span>
        )}
        <h3 className="text-xl md:text-2xl font-medium text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {children && <div className="border-t border-border">{children}</div>}
    </div>
  )
}

// Glass Card - subtle glass morphism effect
export function GlassCard({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6", className)}>
      {children}
    </div>
  )
}

// Highlight Card - with gradient border
export function HighlightCard({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl p-[1px] bg-gradient-to-br from-[#a78bfa]/50 via-transparent to-[#60a5fa]/50",
        className,
      )}
    >
      <div className="rounded-xl bg-card p-6 h-full">{children}</div>
    </div>
  )
}
