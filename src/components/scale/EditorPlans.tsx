"use client"

import { useState, useEffect, useRef } from "react"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { H3 } from "./typography"
import { api } from "@/lib/api"
import { toast } from "sonner"

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      // Don't show error toast for empty state
      if (!error.message?.includes("404")) {
        toast.error("Failed to load chat history")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    // Optimistically add user message
    const userMessage: PlanMessage = {
      id: Date.now(),
      role: "user",
      content: message,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])

    try {
      // Send message to backend
      await api.sendPlanMessage(projectId, message)
      
      // Reload messages to get assistant response
      await loadMessages()
    } catch (error: any) {
      toast.error(error.message || "Failed to send message")
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id))
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6 flex items-center justify-center">
          <div className="text-muted-foreground">Loading chat history...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <H3 className="text-xl font-semibold mb-2">Start Planning</H3>
                <p className="text-muted-foreground">
                  Begin a conversation to plan future changes to your project
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  author={message.role === "user" ? "You" : "Assistant"}
                  timestamp={new Date(message.created_at).toLocaleTimeString()}
                >
                  {message.content}
                </ChatMessage>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            placeholder="Type your message..."
            onSend={handleSendMessage}
          />
        </div>
      </div>
    </div>
  )
}

