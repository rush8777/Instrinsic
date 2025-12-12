"// Project Editor Page"

import React, { useState } from "react"
import { ScaleAvatar } from "@/components/scale/avatar"
import { ScaleButton, IconButton } from "@/components/scale/buttons"
import { ScaleBadge } from "@/components/scale/badges"
import { ChatChannelsMenu } from "@/components/scale/ChatChannelsMenu"
import { ChatMessage } from "@/components/scale/ChatMessage"
import { ChatInput } from "@/components/scale/ChatInput"
import { ScaleHeader } from "@/components/scale/header"
import { ScaleFooter } from "@/components/scale/footer"
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
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message)
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header - Fixed */}
      <ScaleHeader />

      {/* Main Content - Fixed height, no scroll */}
      <div className="flex flex-col flex-1 max-w-7xl mx-auto w-full border-x border-border overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* Channel Navigation Sidebar - Fixed */}
          <div 
            className={`hidden md:flex flex-col bg-muted/30 border-r border-border transition-all duration-300 overflow-y-auto ${
              sidebarCollapsed ? "w-14" : "w-64"
            }`}
          >
          {/* Sidebar Header */}
          <div className="flex items-center gap-2 p-3 border-b border-border">
            {!sidebarCollapsed && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:bg-muted/50 rounded-md px-2 py-1 transition-colors flex-1 min-w-0">
                    <span className="text-base font-semibold text-foreground truncate">PromptIT</span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <div className="flex items-center gap-2 border-b border-border px-3 py-3">
                    <ScaleAvatar
                      src="https://res.cloudinary.com/subframe/image/upload/v1713909352/uploads/279/rsam5v66hcvpj96fr5hc.avif"
                      square
                      size="sm"
                    />
                    <div className="flex flex-1 flex-col min-w-0">
                      <span className="text-sm font-semibold text-foreground">PromptIT</span>
                      <span className="text-xs text-muted-foreground">promptit.com</span>
                    </div>
                  </div>
                  <DropdownMenuItem>Invite team members</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <div className="flex items-center gap-1 ml-auto">
              {!sidebarCollapsed && (
                <IconButton variant="ghost" size="sm">
                  <Search className="w-3.5 h-3.5" />
                </IconButton>
              )}
              <IconButton 
                variant="ghost" 
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? (
                  <PanelLeft className="w-3.5 h-3.5" />
                ) : (
                  <PanelLeftClose className="w-3.5 h-3.5" />
                )}
              </IconButton>
            </div>
          </div>

          {/* Channels List */}
          <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
            {sidebarCollapsed ? (
              // Collapsed state - show only icons
              <div className="flex flex-col items-center gap-1">
                <IconButton variant="ghost" size="sm" className="w-full justify-center">
                  <Sparkles className="w-4 h-4" />
                </IconButton>
                <IconButton variant="ghost" size="sm" className="w-full justify-center">
                  <Inbox className="w-4 h-4" />
                </IconButton>
                <IconButton variant="ghost" size="sm" className="w-full justify-center">
                  <Bookmark className="w-4 h-4" />
                </IconButton>
                <IconButton variant="ghost" size="sm" className="w-full justify-center">
                  <MessageSquare className="w-4 h-4" />
                </IconButton>
                <div className="w-full h-px bg-border my-2" />
                <IconButton 
                  variant="ghost"
                  size="sm" 
                  className={`w-full justify-center ${selectedChannel === "design" ? "bg-secondary" : ""}`}
                  onClick={() => setSelectedChannel("design")}
                >
                  <Hash className="w-4 h-4" />
                </IconButton>
                <IconButton 
                  variant="ghost"
                  size="sm" 
                  className={`w-full justify-center ${selectedChannel === "front-end" ? "bg-secondary" : ""}`}
                  onClick={() => setSelectedChannel("front-end")}
                >
                  <Hash className="w-4 h-4" />
                </IconButton>
              </div>
            ) : (
              // Expanded state - show full menu
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
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {/* Channel Header - Fixed */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3 bg-background z-10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center rounded-md border border-border bg-card p-1">
                <Hash className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <nav className="flex items-center gap-1 text-sm">
                <span className="text-muted-foreground">Favorites</span>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium text-foreground">{selectedChannel}</span>
              </nav>
            </div>
            <div className="flex-1" />
            <IconButton variant="ghost" size="sm">
              <Star className="w-3.5 h-3.5" />
            </IconButton>
            <IconButton variant="ghost" size="sm">
              <Bell className="w-3.5 h-3.5" />
            </IconButton>
            <IconButton variant="ghost" size="sm">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </IconButton>
          </div>

          {/* Messages Area - Scrollable */}
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
                      <ScaleButton key={index} variant="secondary" size="sm" className="h-6 px-2 text-xs">
                        {reaction}
                      </ScaleButton>
                    ))}
                    <IconButton variant="ghost" size="sm" className="h-6 w-6">
                      <SmilePlus className="w-3.5 h-3.5" />
                    </IconButton>
                  </>
                }
              >
                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                {msg.hasAttachment && (
                  <div className="flex flex-wrap items-start overflow-hidden rounded-lg border border-border bg-muted/30 mt-2">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden">
                      <img
                        className="h-5 w-5 object-cover"
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
                      className="h-32 w-full object-cover"
                      src="https://res.cloudinary.com/subframe/image/upload/v1713908895/uploads/279/fgotrrosb9jl6bryufsx.avif"
                      alt=""
                    />
                  </div>
                )}
              </ChatMessage>
            ))}
          </div>

          {/* Message Input - Fixed at bottom */}
          <div className="p-4 border-t border-border bg-background flex-shrink-0">
            <ChatInput onSend={handleSendMessage} placeholder="Message #design" />
          </div>
        </div>
        </div>
        {/* Footer - Spans full width at bottom */}
      </div>
      <ScaleFooter className="border-t border-border flex-shrink-0" />
    </div>
  )
}
