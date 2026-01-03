"use client"

import { useNavigate, useParams } from "react-router-dom"
import { cn } from "@/lib/utils"
import { 
  BookOpen, 
  MessageSquare, 
  CheckSquare, 
  FileCode, 
  Home,
  Search,
  LayoutGrid,
  Star,
  Users,
  Box,
  FolderOpen,
  MessageCircle
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EditorSidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

interface SectionItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string
}

const sections: SectionItem[] = [
  { id: "library", label: "Library", icon: <BookOpen className="w-5 h-5" />, path: "library" },
  { id: "plans", label: "Plans", icon: <MessageSquare className="w-5 h-5" />, path: "plans" },
  { id: "status", label: "Status", icon: <CheckSquare className="w-5 h-5" />, path: "status" },
  { id: "docs", label: "Docs", icon: <FileCode className="w-5 h-5" />, path: "docs" },
]

// Additional icons for the Lovable-style sidebar
const topIcons = [
  { id: "home", label: "Home", icon: <Home className="w-5 h-5" />, action: "navigate", path: "/dashboard" },
  { id: "search", label: "Search", icon: <Search className="w-5 h-5" />, action: "modal" },
]

const bottomIcons = [
  { id: "projects", label: "All Projects", icon: <FolderOpen className="w-5 h-5" />, action: "navigate", path: "/dashboard" },
]

export function EditorSidebar({ collapsed, onToggleCollapse }: EditorSidebarProps) {
  const { id, section = "library" } = useParams<{ id: string; section?: string }>()
  const navigate = useNavigate()

  const handleSectionClick = (sectionPath: string) => {
    navigate(`/editor/${id}/${sectionPath}`)
  }

  const handleIconClick = (item: typeof topIcons[0]) => {
    if (item.action === "navigate" && item.path) {
      navigate(item.path)
    }
  }

  // Always show collapsed sidebar (Lovable-style)
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col w-14 bg-muted/50 border-r border-border h-full">
        {/* Top Section - Home & Search */}
        <div className="flex flex-col items-center gap-1 pt-3 pb-2 border-b border-border/50">
          {topIcons.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleIconClick(item)}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-lg transition-colors",
                    "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {item.icon}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Main Sections */}
        <div className="flex-1 flex flex-col items-center gap-1 py-3">
          {sections.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleSectionClick(item.path)}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-lg transition-colors",
                    section === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {item.icon}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-1 py-3 border-t border-border/50">
          {bottomIcons.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleIconClick(item as typeof topIcons[0])}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-lg transition-colors",
                    "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {item.icon}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}

          {/* User Avatar */}
          <div className="mt-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
              U
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
