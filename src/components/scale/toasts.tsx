"use client"

import { cn } from "@/lib/utils"
import { type ReactNode, createContext, useContext, useState, useCallback, useEffect } from "react"
import { 
  Check, 
  X, 
  AlertTriangle, 
  Info, 
  Loader2, 
  Globe, 
  Lock, 
  Sparkles,
  Trash2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Toast Types
export type ToastType = 
  | "success" 
  | "error" 
  | "warning" 
  | "info" 
  | "loading" 
  | "actionable" 
  | "system" 
  | "auth" 
  | "ai"

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
  action?: ToastAction
  dismissible?: boolean
  icon?: ReactNode
}

// Toast Context
interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => string
  removeToast: (id: string) => void
  updateToast: (id: string, updates: Partial<Toast>) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToasts() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToasts must be used within a ToastProvider")
  }
  return context
}

// Toast Provider
interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const updateToast = useCallback((id: string, updates: Partial<Toast>) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    )
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, updateToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

// Toast Container
function ToastContainer() {
  const { toasts } = useToasts()

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Default durations by type
const defaultDurations: Record<ToastType, number> = {
  success: 4000,
  error: 6000,
  warning: 5000,
  info: 4000,
  loading: 0, // No auto-dismiss
  actionable: 8000,
  system: 0, // No auto-dismiss (sticky)
  auth: 6000,
  ai: 4000,
}

// Icon mapping
const iconMap: Record<ToastType, ReactNode> = {
  success: <Check className="w-3 h-3" />,
  error: <X className="w-3 h-3" />,
  warning: <AlertTriangle className="w-3 h-3" />,
  info: <Info className="w-3 h-3" />,
  loading: <Loader2 className="w-3 h-3 animate-spin" />,
  actionable: <Trash2 className="w-3 h-3" />,
  system: <Globe className="w-3 h-3" />,
  auth: <Lock className="w-3 h-3" />,
  ai: <Sparkles className="w-3 h-3" />,
}

// Style classes by type
const styleMap: Record<ToastType, string> = {
  success: "bg-background border-toast-success-border text-foreground",
  error: "bg-background border-toast-error-border text-foreground",
  warning: "bg-background border-toast-warning-border text-foreground",
  info: "bg-background border-toast-info-border text-foreground",
  loading: "bg-background border-toast-loading-border text-foreground",
  actionable: "bg-background border-border text-foreground",
  system: "bg-background border-toast-system-border text-foreground",
  auth: "bg-background border-toast-auth-border text-foreground",
  ai: "bg-background border-toast-ai-border text-foreground",
}

const iconStyleMap: Record<ToastType, string> = {
  success: "bg-toast-success text-toast-success-foreground",
  error: "bg-toast-error text-toast-error-foreground",
  warning: "bg-toast-warning text-toast-warning-foreground",
  info: "bg-toast-info text-toast-info-foreground",
  loading: "bg-toast-loading text-toast-loading-foreground",
  actionable: "bg-muted text-muted-foreground",
  system: "bg-toast-system text-toast-system-foreground",
  auth: "bg-toast-auth text-toast-auth-foreground",
  ai: "bg-toast-ai text-toast-ai-foreground",
}

// Toast Item
interface ToastItemProps {
  toast: Toast
}

function ToastItem({ toast }: ToastItemProps) {
  const { removeToast } = useToasts()
  const duration = toast.duration ?? defaultDurations[toast.type]
  const dismissible = toast.dismissible ?? true

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        removeToast(toast.id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, removeToast, toast.id])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 35,
        opacity: { duration: 0.15 }
      }}
      className="pointer-events-auto"
    >
      <div
        className={cn(
          "relative flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-muted-foreground/30 transition-colors",
          styleMap[toast.type]
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            "flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-secondary",
            iconStyleMap[toast.type]
          )}
        >
          {toast.icon || iconMap[toast.type]}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-tight">{toast.title}</p>
          {toast.description && (
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{toast.description}</p>
          )}
          
          {/* Action Button */}
          {toast.action && (
            <button
              onClick={() => {
                toast.action?.onClick()
                removeToast(toast.id)
              }}
              className="mt-2 text-xs font-medium underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 p-1 rounded-md hover:bg-foreground/10 transition-colors"
          >
            <X className="w-3.5 h-3.5 opacity-50" />
          </button>
        )}

        {/* Progress bar for timed toasts */}
        {duration > 0 && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-foreground/20 rounded-full"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        )}
      </div>
    </motion.div>
  )
}

// Convenience functions for creating toasts
export function createToastHelpers(addToast: (toast: Omit<Toast, "id">) => string) {
  return {
    success: (title: string, description?: string) =>
      addToast({ type: "success", title, description }),
    
    error: (title: string, description?: string) =>
      addToast({ type: "error", title, description }),
    
    warning: (title: string, description?: string) =>
      addToast({ type: "warning", title, description }),
    
    info: (title: string, description?: string) =>
      addToast({ type: "info", title, description }),
    
    loading: (title: string, description?: string) =>
      addToast({ type: "loading", title, description, dismissible: false }),
    
    actionable: (title: string, action: ToastAction, description?: string) =>
      addToast({ type: "actionable", title, description, action }),
    
    system: (title: string, description?: string) =>
      addToast({ type: "system", title, description }),
    
    auth: (title: string, description?: string) =>
      addToast({ type: "auth", title, description }),
    
    ai: (title: string, description?: string) =>
      addToast({ type: "ai", title, description }),
  }
}

// Hook for easy toast usage
export function useScaleToast() {
  const { addToast, removeToast, updateToast } = useToasts()
  const helpers = createToastHelpers(addToast)

  return {
    ...helpers,
    dismiss: removeToast,
    update: updateToast,
    promise: async <T,>(
      promise: Promise<T>,
      messages: {
        loading: string
        success: string
        error: string
      }
    ) => {
      const id = addToast({ type: "loading", title: messages.loading, dismissible: false })
      try {
        const result = await promise
        updateToast(id, { type: "success", title: messages.success, dismissible: true })
        setTimeout(() => removeToast(id), defaultDurations.success)
        return result
      } catch (err) {
        updateToast(id, { type: "error", title: messages.error, dismissible: true })
        setTimeout(() => removeToast(id), defaultDurations.error)
        throw err
      }
    },
  }
}

export { ToastItem }
