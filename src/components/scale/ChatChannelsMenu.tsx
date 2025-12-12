"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, File, Plus } from "lucide-react"
import { IconButton } from "./buttons"

interface FolderProps {
  children?: React.ReactNode
  label?: React.ReactNode
  icon?: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

const Folder = React.forwardRef<HTMLDivElement, FolderProps>(function Folder(
  { children, label, icon, defaultOpen = true, className },
  ref
) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn("w-full", className)} ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 hover:bg-muted/50 transition-colors group"
      >
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {label && (
          <span className="flex-1 text-left text-sm font-medium text-muted-foreground">
            {label}
          </span>
        )}
        <IconButton
          variant="ghost"
          size="sm"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation()
            // Add action here
          }}
        >
          <Plus className="w-3 h-3" />
        </IconButton>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && children && (
        <div className="flex w-full flex-col items-start gap-0.5 pt-1 pl-2">
          {children}
        </div>
      )}
    </div>
  )
})

interface ItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  children?: React.ReactNode
  icon?: React.ReactNode
  rightSlot?: React.ReactNode
  className?: string
}

const Item = React.forwardRef<HTMLButtonElement, ItemProps>(function Item(
  { selected = false, children, icon = <File className="w-4 h-4" />, rightSlot, className, ...props },
  ref
) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 hover:bg-muted/50 transition-colors text-left",
        selected && "bg-muted hover:bg-muted",
        className
      )}
      ref={ref}
      {...props}
    >
      <div className="flex items-center justify-center rounded-md border border-border bg-card p-1">
        <span className={cn("text-muted-foreground", selected && "text-foreground")}>
          {icon}
        </span>
      </div>
      {children && (
        <span
          className={cn(
            "flex-1 text-sm text-muted-foreground truncate",
            selected && "font-medium text-foreground"
          )}
        >
          {children}
        </span>
      )}
      {rightSlot && <div className="flex items-center">{rightSlot}</div>}
    </button>
  )
})

interface ChatChannelsMenuRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
}

const ChatChannelsMenuRoot = React.forwardRef<HTMLDivElement, ChatChannelsMenuRootProps>(
  function ChatChannelsMenuRoot({ children, className, ...props }, ref) {
    return children ? (
      <div className={cn("flex w-full flex-col items-start gap-1", className)} ref={ref} {...props}>
        {children}
      </div>
    ) : null
  }
)

export const ChatChannelsMenu = Object.assign(ChatChannelsMenuRoot, {
  Folder,
  Item,
})
