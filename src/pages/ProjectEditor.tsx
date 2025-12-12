"use client"

import React, { useState } from "react"
import { ScaleAvatar } from "@/components/scale/avatar"
import { ScaleButton, IconButton } from "@/components/scale/buttons"
import { ScaleBadge } from "@/components/scale/badges"
import { ChatChannelsMenu } from "@/components/scale/ChatChannelsMenu"
import { ChatMessage } from "@/components/scale/ChatMessage"
import { ChatInput } from "@/components/scale/ChatInput"
import {
  ChevronDown,
  Search,
  Sparkles,
  Inbox,
  Bookmark,
  MessageSquare,
  Hash,
  Star,
  Bell,
  SlidersHorizontal,
  SmilePlus,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Workspace avatars data
const workspaces = [
  { id: 1, image: "https://res.cloudinary.com/subframe/image/upload/v1713909352/uploads/279/rsam5v66hcvpj96fr5hc.avif", active: true },
  { id: 2, image: "https://res.cloudinary.com/subframe/image/upload/v1713909410/uploads/279/lrksle90ypvwqhk1pksk.avif", active: false },
  { id: 3, image: "https://res.cloudinary.com/subframe/image/upload/v1711417525/shared/elkoy8wipvhulayviq7t.png", active: false },
]

// Sample messages data
const messages = [
  {
    id: 1,
    avatar: "https://res.cloudinary.com/subframe/image/upload/v1711417514/shared/ubsk7cs5hnnaj798efej.jpg",
    author: "Alex Chan",
    timestamp: "9:03 AM",
    content: "Morning team! 👋 I've just pushed the latest mockups for the dashboard redesign to our project. @Sarah could you take a look at the color scheme? I'm not sure if it aligns with our new brand guidelines.",
    reactions: ["🔥 2", "👀"],
    hasAttachment: true,
  },
  {
    id: 2,
    avatar: "https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/fychrij7dzl8wgq2zjq9.avif",
    author: "Diana T.",
    timestamp: "9:15 AM",
    content: "Good morning, Alex! Sure thing, I'll review the color palette right away. 👀",
    reactions: ["🙌"],
  },
  {
    id: 3,
    avatar: "https://res.cloudinary.com/subframe/image/upload/v1711417513/shared/kwut7rhuyivweg8tmyzl.jpg",
    author: "Daniel A.",
    timestamp: "9:22 AM",
    content: "@Alex, quick question - did you consider the mobile view for those new data visualization components? I'm a bit concerned about how they'll render on smaller screens.",
    hasImage: true,
  },
  {
    id: 4,
    avatar: "https://res.cloudinary.com/subframe/image/upload/v1711417514/shared/ubsk7cs5hnnaj798efej.jpg",
    author: "Alex Chan",
    timestamp: "9:30 AM",
    content: "Good point! I focused mainly on the desktop version. Could you take a stab at adapting those for mobile? Your expertise in responsive design would be really helpful here.",
  },
]

export default function ProjectEditor() {
  const [selectedChannel, setSelectedChannel] = useState("design")

  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message)
    // Add message logic here
  }

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Left Workspace Sidebar */}
      <div className="hidden md:flex flex-col items-center gap-2 bg-muted/50 py-4 px-2">
        {workspaces.map((workspace) => (
          <div key={workspace.id} className="flex items-center justify-center gap-2 py-2">
            {workspace.active && (
              <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
            )}
            <ScaleAvatar
              src={workspace.image}
              size="lg"
              square
              className={workspace.active ? "ring-2 ring-violet-500 shadow-lg" : ""}
            />
            {!workspace.active && <div className="w-2.5 h-2.5" />}
          </div>
        ))}
      </div>

      {/* Channel Navigation Sidebar */}
      <div className="hidden md:flex w-72 flex-col bg-muted/30 border-r border-border">
        {/* Workspace Header */}
        <div className="flex items-center gap-4 p-4 border-b border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-muted/50 rounded-md px-2 py-1 transition-colors">
                <span className="text-lg font-semibold text-foreground">PromptIT</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <div className="flex items-center gap-2 border-b border-border px-3 py-3">
                <ScaleAvatar
                  src="https://res.cloudinary.com/subframe/image/upload/v1713909352/uploads/279/rsam5v66hcvpj96fr5hc.avif"
                  square
                />
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-semibold text-foreground">PromptIT</span>
                  <span className="text-xs text-muted-foreground">promptit.com</span>
                </div>
              </div>
              <DropdownMenuItem>Invite team members</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex-1" />
          <IconButton variant="ghost" size="sm">
            <Search className="w-4 h-4" />
          </IconButton>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
          <ChatChannelsMenu>
            <ChatChannelsMenu.Item icon={<Sparkles className="w-4 h-4" />}>
              Assistant
            </ChatChannelsMenu.Item>
            <ChatChannelsMenu.Item
              icon={<Inbox className="w-4 h-4" />}
              rightSlot={<ScaleBadge variant="muted">1</ScaleBadge>}
            >
              Inbox
            </ChatChannelsMenu.Item>
            <ChatChannelsMenu.Item>Drafts</ChatChannelsMenu.Item>
            <ChatChannelsMenu.Item icon={<Bookmark className="w-4 h-4" />}>
              Saved
            </ChatChannelsMenu.Item>
            <ChatChannelsMenu.Item
              icon={<MessageSquare className="w-4 h-4" />}
              rightSlot={<ScaleBadge variant="muted">2</ScaleBadge>}
            >
              Direct messages
            </ChatChannelsMenu.Item>

            <ChatChannelsMenu.Folder label="Favorites">
              <ChatChannelsMenu.Item
                selected={selectedChannel === "design"}
                icon={<Hash className="w-4 h-4" />}
                rightSlot={<ScaleBadge variant="muted">2</ScaleBadge>}
                onClick={() => setSelectedChannel("design")}
              >
                design
              </ChatChannelsMenu.Item>
              <ChatChannelsMenu.Item
                selected={selectedChannel === "front-end"}
                icon={<Hash className="w-4 h-4" />}
                rightSlot={<ScaleBadge variant="muted">4</ScaleBadge>}
                onClick={() => setSelectedChannel("front-end")}
              >
                front-end
              </ChatChannelsMenu.Item>
            </ChatChannelsMenu.Folder>

            <ChatChannelsMenu.Folder label="Channels">
              <ChatChannelsMenu.Item
                selected={selectedChannel === "general"}
                icon={<Hash className="w-4 h-4" />}
                rightSlot={<ScaleBadge variant="muted">1</ScaleBadge>}
                onClick={() => setSelectedChannel("general")}
              >
                general
              </ChatChannelsMenu.Item>
              <ChatChannelsMenu.Item
                selected={selectedChannel === "inspo"}
                icon={<Hash className="w-4 h-4" />}
                onClick={() => setSelectedChannel("inspo")}
              >
                inspo
              </ChatChannelsMenu.Item>
              <ChatChannelsMenu.Item
                selected={selectedChannel === "engineering"}
                icon={<Hash className="w-4 h-4" />}
                rightSlot={<ScaleBadge variant="muted">12</ScaleBadge>}
                onClick={() => setSelectedChannel("engineering")}
              >
                engineering
              </ChatChannelsMenu.Item>
              <ChatChannelsMenu.Item
                selected={selectedChannel === "gtm"}
                icon={<Hash className="w-4 h-4" />}
                rightSlot={<ScaleBadge variant="muted">2</ScaleBadge>}
                onClick={() => setSelectedChannel("gtm")}
              >
                gtm
              </ChatChannelsMenu.Item>
            </ChatChannelsMenu.Folder>
          </ChatChannelsMenu>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Channel Header */}
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-md border border-border bg-card p-1">
              <Hash className="w-4 h-4 text-muted-foreground" />
            </div>
            <nav className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">Favorites</span>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium text-foreground">{selectedChannel}</span>
            </nav>
          </div>
          <div className="flex-1" />
          <IconButton variant="ghost" size="sm">
            <Star className="w-4 h-4" />
          </IconButton>
          <IconButton variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </IconButton>
          <IconButton variant="ghost" size="sm">
            <SlidersHorizontal className="w-4 h-4" />
          </IconButton>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              avatar={msg.avatar}
              author={msg.author}
              timestamp={msg.timestamp}
              toolbar={
                <>
                  {msg.reactions?.map((reaction, index) => (
                    <ScaleButton key={index} variant="secondary" size="sm" className="h-7 px-2 text-xs">
                      {reaction}
                    </ScaleButton>
                  ))}
                  <IconButton variant="ghost" size="sm" className="h-7 w-7">
                    <SmilePlus className="w-4 h-4" />
                  </IconButton>
                </>
              }
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.hasAttachment && (
                <div className="flex flex-wrap items-start overflow-hidden rounded-lg border border-border bg-muted/30 mt-2">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden">
                    <img
                      className="h-6 w-6 object-cover"
                      src="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/y2rsnhq3mex4auk54aye.png"
                      alt=""
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 p-3">
                    <span className="font-semibold text-sm text-foreground line-clamp-1">
                      Dashboard Redesign
                    </span>
                    <span className="text-xs text-muted-foreground line-clamp-2">
                      app.promptit.com
                    </span>
                  </div>
                </div>
              )}
              {msg.hasImage && (
                <div className="mt-2 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                  <img
                    className="h-40 w-full object-cover"
                    src="https://res.cloudinary.com/subframe/image/upload/v1713908895/uploads/279/fgotrrosb9jl6bryufsx.avif"
                    alt=""
                  />
                </div>
              )}
            </ChatMessage>
          ))}
        </div>

        {/* Message Input */}
        <div className="px-8 pb-8 md:px-8 md:pb-8">
          <ChatInput onSend={handleSendMessage} placeholder="Message #design" />
        </div>
      </div>
    </div>
  )
}
