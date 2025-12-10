import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef } from "react"
import { ArrowRight } from "lucide-react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link"
  size?: "sm" | "md" | "lg"
  withArrow?: boolean
}

export const ScaleButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", withArrow = false, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

    const variants = {
      primary: "bg-foreground text-background hover:bg-foreground/90 rounded-full",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full",
      outline: "border border-border bg-transparent text-foreground hover:bg-secondary rounded-full",
      ghost: "bg-transparent text-foreground hover:bg-secondary rounded-lg",
      link: "bg-transparent text-foreground hover:text-muted-foreground underline-offset-4 hover:underline p-0",
    }

    const sizes = {
      sm: "h-9 px-4 text-sm gap-2",
      md: "h-11 px-6 text-sm gap-2",
      lg: "h-12 px-8 text-base gap-2",
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], variant !== "link" && sizes[size], className)}
        {...props}
      >
        {children}
        {withArrow && <ArrowRight className="w-4 h-4" />}
      </button>
    )
  },
)

ScaleButton.displayName = "ScaleButton"

// Icon Button
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const variants = {
      default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-border bg-transparent text-foreground hover:bg-secondary",
      ghost: "bg-transparent text-foreground hover:bg-secondary",
    }

    const sizes = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)

IconButton.displayName = "IconButton"
