import { cn } from "@/lib/utils"

interface ScaleAvatarProps {
  src?: string
  alt?: string
  size?: "sm" | "md" | "lg" | "xl"
  square?: boolean
  className?: string
  children?: React.ReactNode
}

export function ScaleAvatar({ src, alt = "", size = "md", square = false, className, children }: ScaleAvatarProps) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-secondary text-muted-foreground font-medium",
        sizes[size],
        square ? "rounded-lg" : "rounded-full",
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className={textSizes[size]}>{children}</span>
      )}
    </div>
  )
}
