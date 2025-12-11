import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface IconWithBackgroundProps {
  icon: ReactNode
  size?: "sm" | "md" | "lg"
  square?: boolean
  className?: string
}

export function IconWithBackground({ icon, size = "md", square = false, className }: IconWithBackgroundProps) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center bg-secondary text-foreground",
        sizes[size],
        square ? "rounded-lg" : "rounded-full",
        className
      )}
    >
      {icon}
    </div>
  )
}
