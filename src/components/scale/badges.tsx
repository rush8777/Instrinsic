import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface BadgeProps {
  children: ReactNode
  variant?: "default" | "outline" | "muted" | "gradient" | "error" | "success"
  className?: string
}

export function ScaleBadge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-secondary text-secondary-foreground",
    outline: "border border-border bg-transparent text-foreground",
    muted: "bg-muted text-muted-foreground",
    gradient: "bg-gradient-to-r from-[#a78bfa]/20 to-[#60a5fa]/20 text-foreground border border-[#a78bfa]/30",
    error: "bg-destructive/20 text-destructive border border-destructive/30",
    success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

// Status Badge with dot
interface StatusBadgeProps {
  status: "active" | "pending" | "inactive"
  label: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const statusColors = {
    active: "bg-emerald-500",
    pending: "bg-amber-500",
    inactive: "bg-muted-foreground",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground",
        className,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", statusColors[status])} />
      {label}
    </span>
  )
}
