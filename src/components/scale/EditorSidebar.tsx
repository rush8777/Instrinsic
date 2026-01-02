"use client"

import { useNavigate, useParams } from "react-router-dom"
import { cn } from "@/lib/utils"
import { IconButton } from "./buttons"
import { H4 } from "./typography"
import { BookOpen, MessageSquare, CheckSquare, FileCode, PanelLeft } from "lucide-react"

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
  { id: "library", label: "Library", icon: <BookOpen className="w-4 h-4" />, path: "library" },
  { id: "plans", label: "Plans", icon: <MessageSquare className="w-4 h-4" />, path: "plans" },
  { id: "status", label: "Status", icon: <CheckSquare className="w-4 h-4" />, path: "status" },
  { id: "docs", label: "Docs", icon: <FileCode className="w-4 h-4" />, path: "docs" },
]

export function EditorSidebar({ collapsed, onToggleCollapse }: EditorSidebarProps) {
  const { id, section = "library" } = useParams<{ id: string; section?: string }>()
  const navigate = useNavigate()

  const handleSectionClick = (sectionPath: string) => {
    navigate(`/editor/${id}/${sectionPath}`)
  }

  return (
    <div 
      className={cn(
        "hidden md:flex flex-col bg-muted/30 border-r border-border transition-all duration-300 overflow-y-auto",
        collapsed ? "w-14" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center gap-2 p-3">
        {!collapsed && (
          <>
            <BookOpen className="w-5 h-5 text-foreground" />
            <H4 className="flex-1 truncate">SECTIONS</H4>
          </>
        )}
        <IconButton 
          variant="ghost" 
          size="sm"
          onClick={onToggleCollapse}
          className="ml-auto"
        >
          <PanelLeft className="w-4 h-4" />
        </IconButton>
      </div>

      {/* Section Navigation */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin">
        {collapsed ? (
          // Collapsed state - show only icons
          <div className="flex flex-col items-center gap-1">
            {sections.map((item) => (
              <IconButton
                key={item.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-center",
                  section === item.id && "bg-secondary"
                )}
                onClick={() => handleSectionClick(item.path)}
                title={item.label}
              >
                {item.icon}
              </IconButton>
            ))}
          </div>
        ) : (
          // Expanded state - show labels
          <div className="flex flex-col gap-1">
            {sections.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.path)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  "hover:bg-secondary/50",
                  section === item.id
                    ? "bg-secondary text-foreground"
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
    </div>
  )
}

