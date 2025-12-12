"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { ScaleAvatar } from "./avatar"
import { IconButton } from "./buttons"
import { MoreHorizontal } from "lucide-react"

interface ChatMessageProps {
  avatar?: string
  author: string
  timestamp: string
  children: React.ReactNode
  toolbar?: React.ReactNode
  className?: string
}

export function ChatMessage({
  avatar,
  author,
  timestamp,
  children,
  toolbar,
  className,
}: ChatMessageProps) {
  return (
    <div className={cn("flex w-full items-start gap-3 p-4 hover:bg-muted/30 rounded-lg transition-colors group", className)}>
      <ScaleAvatar src={avatar} size="md">
        {author.charAt(0)}
      </ScaleAvatar>
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-foreground">{author}</span>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        <div className="text-sm text-foreground/90">{children}</div>
        {toolbar && (
          <div className="flex items-center gap-1 mt-1">
            {toolbar}
          </div>
        )}
      </div>
      <IconButton
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <MoreHorizontal className="w-4 h-4" />
      </IconButton>
    </div>
  )
}
