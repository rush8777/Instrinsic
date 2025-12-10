import { cn } from "@/lib/utils"
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react"
import { Search } from "lucide-react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const ScaleInput = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <input
        ref={ref}
        className={cn(
          "w-full h-11 px-4 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
          "transition-colors",
          error && "border-destructive focus:ring-destructive",
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
})

ScaleInput.displayName = "ScaleInput"

// Search Input
export const SearchInput = forwardRef<HTMLInputElement, Omit<InputProps, "type">>(({ className, ...props }, ref) => {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        ref={ref}
        type="search"
        className={cn(
          "w-full h-11 pl-11 pr-4 rounded-full border border-border bg-input text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
          "transition-colors",
          className,
        )}
        {...props}
      />
    </div>
  )
})

SearchInput.displayName = "SearchInput"

// Textarea
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const ScaleTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <label className="text-sm font-medium text-foreground">{label}</label>}
        <textarea
          ref={ref}
          className={cn(
            "w-full min-h-[120px] px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "transition-colors resize-y",
            error && "border-destructive focus:ring-destructive",
            className,
          )}
          {...props}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  },
)

ScaleTextarea.displayName = "ScaleTextarea"
