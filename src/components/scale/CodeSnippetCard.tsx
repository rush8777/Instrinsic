"use client"

import { ReactNode, useState } from "react"
import { Copy, Check, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface CodeSnippetCardProps {
  children: ReactNode
  className?: string
  copyText?: string
  showActions?: boolean
}

export function CodeSnippetCard({ 
  children, 
  className,
  copyText,
  showActions = true 
}: CodeSnippetCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (copyText) {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      toast.success("Copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={cn(
      "relative rounded-xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-lg overflow-hidden",
      className
    )}>
      {/* Actions bar */}
      {showActions && (
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button 
            className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            title="Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          {copyText && (
            <button 
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      )}
      
      {/* Content */}
      <div className="p-6 font-mono text-sm">
        {children}
      </div>
    </div>
  )
}
