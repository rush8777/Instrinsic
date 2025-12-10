import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface TypographyProps {
  children: ReactNode
  className?: string
}

// Display - Large hero text
export function Display({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn(
        "text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-foreground leading-[1.1]",
        className,
      )}
    >
      {children}
    </h1>
  )
}

// Display with gradient accent
export function DisplayGradient({ children, className }: TypographyProps) {
  return (
    <h1 className={cn("text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1]", className)}>
      {children}
    </h1>
  )
}

// Heading 1
export function H1({ children, className }: TypographyProps) {
  return (
    <h1 className={cn("text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-tight", className)}>
      {children}
    </h1>
  )
}

// Heading 2
export function H2({ children, className }: TypographyProps) {
  return (
    <h2 className={cn("text-3xl md:text-4xl font-medium tracking-tight text-foreground leading-tight", className)}>
      {children}
    </h2>
  )
}

// Heading 3
export function H3({ children, className }: TypographyProps) {
  return <h3 className={cn("text-xl md:text-2xl font-medium text-foreground leading-snug", className)}>{children}</h3>
}

// Heading 4
export function H4({ children, className }: TypographyProps) {
  return <h4 className={cn("text-lg md:text-xl font-medium text-foreground leading-snug", className)}>{children}</h4>
}

// Body Large
export function BodyLarge({ children, className }: TypographyProps) {
  return <p className={cn("text-lg text-muted-foreground leading-relaxed", className)}>{children}</p>
}

// Body
export function Body({ children, className }: TypographyProps) {
  return <p className={cn("text-base text-muted-foreground leading-relaxed", className)}>{children}</p>
}

// Body Small
export function BodySmall({ children, className }: TypographyProps) {
  return <p className={cn("text-sm text-muted-foreground leading-relaxed", className)}>{children}</p>
}

// Caption / Label
export function Caption({ children, className }: TypographyProps) {
  return (
    <span className={cn("text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium", className)}>
      {children}
    </span>
  )
}

// Overline - Small label above headings
export function Overline({ children, className }: TypographyProps) {
  return (
    <span className={cn("text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium block mb-3", className)}>
      {children}
    </span>
  )
}

// Gradient span for inline gradient text
export function GradientText({ children, className }: TypographyProps) {
  return <span className={cn("gradient-text", className)}>{children}</span>
}

// Link text
export function TextLink({ children, className }: TypographyProps & { href?: string }) {
  return (
    <span
      className={cn(
        "text-foreground hover:text-muted-foreground transition-colors cursor-pointer inline-flex items-center gap-1",
        className,
      )}
    >
      {children}
    </span>
  )
}
