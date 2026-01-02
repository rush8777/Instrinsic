"use client"

import { useState, useEffect, useRef } from "react"
import { H3, Body, BodySmall } from "./typography"
import { IconButton } from "./buttons"
import { SearchInput } from "./inputs"
import { TreeView } from "./TreeView"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { 
  Send, 
  Plus, 
  MessageSquare, 
  MoreHorizontal,
  Sparkles,
  User,
  ChevronDown
} from "lucide-react"

interface EditorPlansProps {
  projectId: number
}

interface PlanMessage {
  id: number
  role: "user" | "assistant"
  content: string
  created_at: string
}

interface Conversation {
  id: string
  title: string
  date: string
}

export function EditorPlans({ projectId }: EditorPlansProps) {
  const [messages, setMessages] = useState<PlanMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [inputValue, setInputValue] = useState("")
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Mock conversations for sidebar
  const conversations: Conversation[] = [
    { id: "1", title: "Project Architecture", date: "Today" },
    { id: "2", title: "API Integration", date: "Today" },
    { id: "3", title: "UI Components", date: "Yesterday" },
    { id: "4", title: "Database Schema", date: "Previous 7 Days" },
  ]

  useEffect(() => {
    loadMessages()
  }, [projectId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadMessages = async () => {
    try {
      setLoading(true)
      const data = await api.getPlanMessages(projectId) as PlanMessage[]
      setMessages(data || [])
    } catch (error: any) {
      console.error("Failed to load messages:", error)
      if (!error.message?.includes("404")) {
        toast.error("Failed to load chat history")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || sending) return

    const message = inputValue.trim()
    setInputValue("")
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    // Optimistically add user message
    const userMessage: PlanMessage = {
      id: Date.now(),
      role: "user",
      content: message,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setSending(true)

    try {
      await api.sendPlanMessage(projectId, message)
      await loadMessages()
    } catch (error: any) {
      toast.error(error.message || "Failed to send message")
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id))
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    // Auto-resize textarea
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px"
  }

  // Group conversations by date
  const groupedConversations = conversations.reduce((acc, conv) => {
    if (!acc[conv.date]) acc[conv.date] = []
    acc[conv.date].push(conv)
    return acc
  }, {} as Record<string, Conversation[]>)

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-muted/30 border-r border-border">
        {/* New Chat Button */}
        <div className="p-3">
          <button className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors text-sm font-medium text-foreground">
            <Plus className="w-4 h-4" />
            <span>New chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-3">
          <SearchInput placeholder="Search chats..." className="h-9" />
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 scrollbar-thin">
          {Object.entries(groupedConversations).map(([date, convs]) => (
            <div key={date} className="mb-4">
              <div className="px-3 py-2">
                <BodySmall className="text-muted-foreground font-medium">{date}</BodySmall>
              </div>
              {convs.map((conv) => (
                <button
                  key={conv.id}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors group"
                >
                  <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate flex-1 text-left">{conv.title}</span>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </IconButton>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Scale AI</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Body className="text-muted-foreground">Loading...</Body>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center max-w-md">
                <H3 className="text-xl mb-2">How can I help you today?</H3>
                <Body className="text-muted-foreground">
                  Start a conversation to plan your project changes
                </Body>
              </div>
              
              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mt-4">
                {[
                  "Help me plan the architecture",
                  "Suggest best practices",
                  "Review my current approach",
                  "Generate implementation steps"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInputValue(suggestion)}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors text-left"
                  >
                    <BodySmall className="text-foreground">{suggestion}</BodySmall>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-6 px-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-4 mb-6",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <Body className={message.role === "user" ? "text-primary-foreground" : "text-foreground"}>
                      {message.content}
                    </Body>
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <User className="w-4 h-4 text-foreground" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-muted/30 p-2 focus-within:border-primary/50 transition-colors">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Message Scale AI..."
                rows={1}
                className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none max-h-[200px]"
              />
              <IconButton
                variant={inputValue.trim() ? "default" : "ghost"}
                size="sm"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || sending}
                className={cn(
                  "flex-shrink-0 rounded-xl",
                  inputValue.trim() && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <Send className="w-4 h-4" />
              </IconButton>
            </div>
            <BodySmall className="text-center text-muted-foreground mt-2">
              Scale AI can make mistakes. Consider checking important info.
            </BodySmall>
          </div>
        </div>
      </div>
    </div>
  )
}
