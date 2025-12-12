"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { IconButton } from "./buttons"
import {
  Bold,
  Italic,
  Strikethrough,
  Link,
  List,
  ListChecks,
  ListOrdered,
  Code2,
  MoreHorizontal,
  AtSign,
  Video,
  Mic,
  Send,
  Paperclip,
} from "lucide-react"

interface ChatInputProps {
  placeholder?: string
  onSend?: (message: string) => void
  className?: string
}

export function ChatInput({ placeholder = "Type a message...", onSend, className }: ChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (message.trim() && onSend) {
      onSend(message)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={cn("flex w-full flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-lg", className)}>
      {/* Formatting toolbar */}
      <div className="flex w-full items-center gap-1">
        <IconButton variant="ghost" size="sm" className="h-7 w-7">
          <Bold className="w-4 h-4" />
        </IconButton>
        <IconButton variant="ghost" size="sm" className="h-7 w-7">
          <Italic className="w-4 h-4" />
        </IconButton>
        <IconButton variant="ghost" size="sm" className="h-7 w-7">
          <Strikethrough className="w-4 h-4" />
        </IconButton>
        <div className="w-px h-4 bg-border mx-1" />
        <IconButton variant="ghost" size="sm" className="h-7 w-7">
          <Link className="w-4 h-4" />
        </IconButton>
        <div className="w-px h-4 bg-border mx-1" />
        <IconButton variant="ghost" size="sm" className="h-7 w-7">
          <List className="w-4 h-4" />
        </IconButton>
        <IconButton variant="ghost" size="sm" className="h-7 w-7">
          <ListChecks className="w-4 h-4" />
        </IconButton>
        <IconButton variant="ghost" size="sm" className="h-7 w-7">
          <ListOrdered className="w-4 h-4" />
        </IconButton>
        <div className="w-px h-4 bg-border mx-1" />
        <IconButton variant="ghost" size="sm" className="h-7 w-7">
          <Code2 className="w-4 h-4" />
        </IconButton>
        <IconButton variant="ghost" size="sm" className="h-7 w-7">
          <MoreHorizontal className="w-4 h-4" />
        </IconButton>
      </div>

      {/* Text input */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full min-h-[60px] resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />

      {/* Bottom actions */}
      <div className="flex w-full items-center gap-1">
        <IconButton variant="ghost" size="sm" className="h-7 w-7">
          <Paperclip className="w-4 h-4" />
        </IconButton>
        <IconButton variant="ghost" size="sm" className="h-7 w-7">
          <AtSign className="w-4 h-4" />
        </IconButton>
        <div className="w-px h-4 bg-border mx-1" />
        <IconButton variant="ghost" size="sm" className="h-7 w-7">
          <Video className="w-4 h-4" />
        </IconButton>
        <IconButton variant="ghost" size="sm" className="h-7 w-7">
          <Mic className="w-4 h-4" />
        </IconButton>
        <div className="flex-1" />
        <IconButton
          variant="default"
          size="sm"
          className="h-8 w-8 bg-violet-500 hover:bg-violet-600"
          onClick={handleSend}
        >
          <Send className="w-4 h-4" />
        </IconButton>
      </div>
    </div>
  )
}
