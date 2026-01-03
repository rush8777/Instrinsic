import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  MessageSquare,
  CheckSquare,
  FileCode,
  PanelLeft,
  Gift,
  Zap,
  Bell,
  ChevronDown,
  Home,
  Search,
  Grid3x3,
  Star,
  Users,
  Compass,
  Box,
  Square
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface HoverSidebarProps {
  isVisible: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

interface SectionItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string
}

// Editor sections (shown when expanded)
const editorSections: SectionItem[] = [
  { id: "library", label: "Library", icon: <BookOpen className="w-4 h-4" />, path: "library" },
  { id: "plans", label: "Plans", icon: <MessageSquare className="w-4 h-4" />, path: "plans" },
  { id: "status", label: "Status", icon: <CheckSquare className="w-4 h-4" />, path: "status" },
  { id: "docs", label: "Docs", icon: <FileCode className="w-4 h-4" />, path: "docs" },
]

// Navigation items (shown when collapsed)
const navItems = [
  { id: "home", label: "Home", icon: <Home className="w-4 h-4" />, path: "/dashboard" },
  { id: "search", label: "Search", icon: <Search className="w-4 h-4" />, path: "/dashboard" },
  { id: "all-projects", label: "All projects", icon: <Grid3x3 className="w-4 h-4" />, path: "/dashboard" },
  { id: "starred", label: "Starred", icon: <Star className="w-4 h-4" />, path: "/dashboard" },
  { id: "shared", label: "Shared with me", icon: <Users className="w-4 h-4" />, path: "/dashboard" },
  { id: "discover", label: "Discover", icon: <Compass className="w-4 h-4" />, path: "/dashboard" },
  { id: "templates", label: "Templates", icon: <Box className="w-4 h-4" />, path: "/dashboard" },
  { id: "learn", label: "Learn", icon: <BookOpen className="w-4 h-4" />, path: "/dashboard" },
]

export function HoverSidebar({ isVisible, onMouseEnter, onMouseLeave }: HoverSidebarProps) {
  const { user } = useAuth()
  const { id, section = "library" } = useParams<{ id: string; section?: string }>()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleSectionClick = (sectionPath: string) => {
    if (id) {
      navigate(`/editor/${id}/${sectionPath}`)
    }
  }

  const handleNavClick = (path: string) => {
    navigate(path)
  }

  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#1a1a1a] border-r border-border/20 z-50 transition-all duration-300 ease-in-out",
        collapsed ? "w-14" : "w-64",
        isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <div className="flex flex-col h-full">
        {/* Top Section */}
        <div className="px-2 py-3 border-b border-border/20 space-y-2">
          {/* Collapse Icon */}
          <button 
            onClick={toggleCollapse}
            className={cn(
              "w-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
              collapsed ? "p-2" : "p-2 ml-auto w-auto"
            )}
          >
            {collapsed ? (
              <Square className="w-4 h-4" />
            ) : (
              <PanelLeft className="w-4 h-4" />
            )}
          </button>

          {/* Workspace Selector */}
          {collapsed ? (
            <button className="w-full flex items-center justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold border border-border/30">
                {user?.username?.[0] || user?.email?.[0] || "R"}
              </div>
            </button>
          ) : (
            <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition-colors">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-xs font-semibold">
                {user?.username?.[0] || user?.email?.[0] || "U"}
              </div>
              <span className="text-sm font-medium text-foreground flex-1 text-left">
                {user?.username || user?.email?.split("@")[0] || "User"}'s Lovable
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-2 py-4 scrollbar-thin">
          {collapsed ? (
            // Collapsed state - show navigation icons only
            <div className="flex flex-col items-center gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a] rounded-lg transition-colors"
                  title={item.label}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          ) : (
            // Expanded state - show editor sections with labels
            <div className="flex flex-col gap-1">
              {editorSections.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSectionClick(item.path)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    "hover:bg-[#2a2a2a]",
                    section === item.id
                      ? "bg-[#2a2a2a] text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Cards - Only show when expanded */}
        {!collapsed && (
          <div className="px-3 py-4 space-y-2 border-t border-border/20">
            {/* Share Lovable Card */}
            <div className="bg-[#2a2a2a] rounded-lg p-3 hover:bg-[#333] transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">Share Lovable</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Get 10 credits each</div>
                </div>
                <Gift className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            {/* Upgrade to Pro Card */}
            <div className="bg-[#2a2a2a] rounded-lg p-3 hover:bg-[#333] transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">Upgrade to Pro</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Unlock more benefits</div>
                </div>
                <Zap className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Icons */}
        <div className={cn(
          "flex flex-col items-center border-t border-border/20 gap-2",
          collapsed ? "px-2 py-3" : "px-4 py-3"
        )}>
          {collapsed ? (
            <>
              <button className="w-8 h-8 rounded-full bg-amber-200/20 flex items-center justify-center hover:bg-amber-200/30 transition-colors">
                <span className="text-amber-200 text-xs font-semibold">H</span>
              </button>
              <button className="relative w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a] rounded-lg transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button className="w-8 h-8 rounded-full bg-amber-200/20 flex items-center justify-center hover:bg-amber-200/30 transition-colors">
                <span className="text-amber-200 text-xs font-semibold">H</span>
              </button>
              <button className="relative w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#2a2a2a] transition-colors">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Background gradient overlay on the right */}
      <div className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none opacity-30">
        <div className="h-full w-full bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
      </div>
    </div>
  )
}

