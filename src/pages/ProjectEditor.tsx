"// Project Editor Page"

import React, { useState } from "react"
import { ScaleAvatar } from "@/components/scale/avatar"
import { ScaleButton, IconButton } from "@/components/scale/buttons"
import { ScaleBadge } from "@/components/scale/badges"
import { ChatChannelsMenu } from "@/components/scale/ChatChannelsMenu"
import { BlogPost } from "@/components/scale/BlogPost"


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
      

      {/* Main Content - Fixed height, no scroll */}
      <div className="flex flex-1 overflow-hidden">

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

        {/* Main Blog Area */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {/* Blog Content - Scrollable */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <BlogPost />
          </div>
        </div>
        </div>
        {/* Footer - Spans full width at bottom */}
      </div>
      
    </div>
  )
}
