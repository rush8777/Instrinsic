"use client"

import { useState, useEffect, useRef } from "react"
import { H3, Body, BodySmall } from "./typography"
import { IconButton } from "./buttons"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { 
  ArrowUp,
  Paperclip,
  Globe,
  ChevronDown,
  Sparkles,
  User,
  Image,
  PencilLine,
  FileText,
  Terminal,
  Lightbulb,
  Settings,
  LogOut,
  Laptop,
  Cloud,
  Info,
  MessageCircle,
  FilePlus2,
  BookOpen
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"

interface EditorPlansProps {
  projectId: number
}

interface PlanMessage {
  id: number
  role: "user" | "assistant"
  content: string
  created_at: string
}

export function EditorPlans({ projectId }: EditorPlansProps) {
  const [messages, setMessages] = useState<PlanMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [inputValue, setInputValue] = useState("")
  const [sending, setSending] = useState(false)
  const [temporaryChat, setTemporaryChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

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
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px"
  }

  const quickActions = [
    { icon: Image, label: "Create image" },
    { icon: PencilLine, label: "Help me write" },
    { icon: FileText, label: "Summarize text" },
    { icon: Terminal, label: "Code" },
    { icon: Lightbulb, label: "Brainstorm" },
  ]

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header - Glassmorphism */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 backdrop-blur-xl bg-background/70">
        {/* Model Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted/30 backdrop-blur-sm transition-colors">
              <span className="font-semibold text-lg text-foreground">ChatGPT</span>
              <span className="text-muted-foreground text-lg">o1</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72 backdrop-blur-xl bg-popover/90 border-border/50 shadow-xl">
            <div className="px-3 py-2">
              <div className="flex items-center justify-between mb-2">
                <BodySmall className="text-muted-foreground font-medium">Model</BodySmall>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <Info className="w-3 h-3" />
                  <span>Learn more about models</span>
                </button>
              </div>
            </div>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2">
              <Sparkles className="w-4 h-4" />
              <span>GPT-4o</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2">
              <Sparkles className="w-4 h-4" />
              <span>GPT-4</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2">
              <Sparkles className="w-4 h-4" />
              <span>GPT-3.5</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-muted-foreground" />
                <BodySmall>Temporary chat</BodySmall>
              </div>
              <Switch checked={temporaryChat} onCheckedChange={setTemporaryChat} />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
              A
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 backdrop-blur-xl bg-popover/90 border-border/50 shadow-xl">
            <DropdownMenuItem className="flex items-center gap-3">
              <Sparkles className="w-4 h-4" />
              <span>My GPTs</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3">
              <Settings className="w-4 h-4" />
              <span>Customize ChatGPT</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-3">
              <Laptop className="w-4 h-4" />
              <span>Download the macOS app</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3">
              <Cloud className="w-4 h-4" />
              <span>Upgrade plan</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-3 text-destructive">
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Body className="text-muted-foreground">Loading...</Body>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 px-4 pb-24">
            <H3 className="text-3xl font-medium text-foreground">What can I help with?</H3>
            
            {/* Input Area - Centered */}
            <div className="w-full max-w-2xl">
              <div className="relative flex items-end rounded-2xl border border-border/50 backdrop-blur-xl bg-muted/20 p-2 focus-within:border-primary/50 shadow-lg transition-all">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Message ChatGPT"
                  rows={1}
                  className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none max-h-[200px]"
                />
                
                {/* Input Actions */}
                <div className="flex items-center gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <IconButton variant="ghost" size="sm">
                        <Paperclip className="w-4 h-4" />
                      </IconButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="backdrop-blur-xl bg-popover/90 border-border/50 shadow-xl">
                      <DropdownMenuItem className="flex items-center gap-3">
                        <Cloud className="w-4 h-4" />
                        <span>Connect to Google Drive</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-3">
                        <FilePlus2 className="w-4 h-4" />
                        <span>Upload from computer</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <IconButton variant="ghost" size="sm">
                    <Globe className="w-4 h-4" />
                  </IconButton>
                </div>

                <IconButton
                  variant={inputValue.trim() ? "default" : "ghost"}
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || sending}
                  className={cn(
                    "ml-1",
                    inputValue.trim() && "bg-foreground text-background hover:bg-foreground/90"
                  )}
                >
                  <ArrowUp className="w-4 h-4" />
                </IconButton>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => setInputValue(action.label)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 backdrop-blur-sm bg-background/50 hover:bg-muted/30 hover:border-border transition-all text-sm text-foreground shadow-sm"
                >
                  <action.icon className="w-4 h-4" />
                  <span>{action.label}</span>
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
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground/90 backdrop-blur-sm flex items-center justify-center shadow-md">
                    <Sparkles className="w-4 h-4 text-background" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 backdrop-blur-sm",
                    message.role === "user"
                      ? "bg-muted/50 border border-border/30 shadow-sm"
                      : "bg-transparent"
                  )}
                >
                  <Body className="text-foreground">
                    {message.content}
                  </Body>
                </div>
                {message.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                    A
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Bottom Input (when there are messages) */}
      {messages.length > 0 && (
        <div className="border-t border-border/50 p-4 backdrop-blur-xl bg-background/70">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end rounded-2xl border border-border/50 backdrop-blur-xl bg-muted/20 p-2 focus-within:border-primary/50 shadow-lg transition-all">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Message ChatGPT"
                rows={1}
                className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none max-h-[200px]"
              />
              
              <div className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconButton variant="ghost" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </IconButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="backdrop-blur-xl bg-popover/90 border-border/50 shadow-xl">
                    <DropdownMenuItem className="flex items-center gap-3">
                      <Cloud className="w-4 h-4" />
                      <span>Connect to Google Drive</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-3">
                      <FilePlus2 className="w-4 h-4" />
                      <span>Upload from computer</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <IconButton variant="ghost" size="sm">
                  <Globe className="w-4 h-4" />
                </IconButton>
              </div>

              <IconButton
                variant={inputValue.trim() ? "default" : "ghost"}
                size="sm"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || sending}
                className={cn(
                  "ml-1",
                  inputValue.trim() && "bg-foreground text-background hover:bg-foreground/90"
                )}
              >
                <ArrowUp className="w-4 h-4" />
              </IconButton>
            </div>
            <BodySmall className="text-center text-muted-foreground mt-2">
              ChatGPT can make mistakes. Check important info.
            </BodySmall>
          </div>
        </div>
      )}

      {/* Footer disclaimer (empty state) */}
      {messages.length === 0 && (
        <div className="pb-4">
          <BodySmall className="text-center text-muted-foreground">
            ChatGPT can make mistakes. Check important info.
          </BodySmall>
        </div>
      )}
    </div>
  )
}
