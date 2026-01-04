"use client"

import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { cn } from "@/lib/utils"
import { 
  BookOpen, 
  MessageSquare, 
  CheckSquare, 
  FileCode, 
  Home,
  Search,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  FileText,
  File
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
  subsections?: SubsectionItem[]
}

interface SubsectionItem {
  id: string
  label: string
  type: "file" | "folder"
  children?: SubsectionItem[]
}

// Mock subsections for each section
const librarySubsections: SubsectionItem[] = [
  { id: "prompts", label: "prompts", type: "folder", children: [
    { id: "initial-setup", label: "initial-setup.md", type: "file" },
    { id: "ui-components", label: "ui-components.md", type: "file" },
    { id: "api-integration", label: "api-integration.md", type: "file" },
  ]},
  { id: "templates", label: "templates", type: "folder", children: [
    { id: "auth-template", label: "auth-template.md", type: "file" },
    { id: "dashboard-template", label: "dashboard-template.md", type: "file" },
  ]},
]

const plansSubsections: SubsectionItem[] = [
  { id: "active", label: "active", type: "folder", children: [
    { id: "feature-roadmap", label: "feature-roadmap.md", type: "file" },
    { id: "refactor-plan", label: "refactor-plan.md", type: "file" },
  ]},
  { id: "archived", label: "archived", type: "folder", children: [
    { id: "v1-plan", label: "v1-plan.md", type: "file" },
  ]},
]

const docsSubsections: SubsectionItem[] = [
  { id: "src", label: "src", type: "folder", children: [
    { id: "components", label: "components", type: "folder", children: [
      { id: "ui", label: "ui", type: "folder" },
      { id: "scale", label: "scale", type: "folder" },
    ]},
    { id: "pages", label: "pages", type: "folder" },
    { id: "hooks", label: "hooks", type: "folder" },
  ]},
  { id: "readme", label: "README.md", type: "file" },
]

const sections: SectionItem[] = [
  { id: "library", label: "Library", icon: <BookOpen className="w-5 h-5" />, path: "library", subsections: librarySubsections },
  { id: "plans", label: "Plans", icon: <MessageSquare className="w-5 h-5" />, path: "plans", subsections: plansSubsections },
  { id: "status", label: "Status", icon: <CheckSquare className="w-5 h-5" />, path: "status" },
  { id: "docs", label: "Docs", icon: <FileCode className="w-5 h-5" />, path: "docs", subsections: docsSubsections },
]

const topIcons = [
  { id: "home", label: "Home", icon: <Home className="w-5 h-5" />, action: "navigate", path: "/dashboard" },
  { id: "search", label: "Search", icon: <Search className="w-5 h-5" />, action: "modal" },
]

const bottomIcons = [
  { id: "projects", label: "All Projects", icon: <FolderOpen className="w-5 h-5" />, action: "navigate", path: "/dashboard" },
]

function TreeItem({ 
  item, 
  depth = 0, 
  expandedPaths, 
  togglePath, 
  parentPath = "" 
}: { 
  item: SubsectionItem
  depth?: number
  expandedPaths: Set<string>
  togglePath: (path: string) => void
  parentPath?: string
}) {
  const fullPath = parentPath ? `${parentPath}/${item.id}` : item.id
  const isExpanded = expandedPaths.has(fullPath)
  const hasChildren = item.type === "folder" && item.children && item.children.length > 0

  return (
    <div>
      <button
        onClick={() => hasChildren && togglePath(fullPath)}
        className={cn(
          "flex items-center gap-1.5 w-full text-left py-1 text-sm transition-colors",
          "text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded",
          hasChildren ? "cursor-pointer" : "cursor-default"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {item.type === "folder" ? (
          <>
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            )}
            <span className="truncate">{item.label}</span>
          </>
        ) : (
          <>
            <File className="w-3.5 h-3.5 flex-shrink-0 ml-3.5" />
            <span className="truncate">{item.label}</span>
          </>
        )}
      </button>
      {hasChildren && isExpanded && (
        <div>
          {item.children!.map((child) => (
            <TreeItem
              key={child.id}
              item={child}
              depth={depth + 1}
              expandedPaths={expandedPaths}
              togglePath={togglePath}
              parentPath={fullPath}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function EditorSidebar({ collapsed, onToggleCollapse }: EditorSidebarProps) {
  const { id, section = "library" } = useParams<{ id: string; section?: string }>()
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["library", "plans", "docs"]))
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())

  const handleSectionClick = (sectionPath: string) => {
    navigate(`/editor/${id}/${sectionPath}`)
  }

  const handleIconClick = (item: typeof topIcons[0]) => {
    if (item.action === "navigate" && item.path) {
      navigate(item.path)
    }
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  const togglePath = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full">
        {/* Icon sidebar */}
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

        {/* Expandable tree panel */}
        <div className="w-56 bg-muted/30 border-r border-border h-full overflow-y-auto">
          <div className="py-2">
            {sections.map((sectionItem) => {
              const isExpanded = expandedSections.has(sectionItem.id)
              const hasSubsections = sectionItem.subsections && sectionItem.subsections.length > 0

              return (
                <div key={sectionItem.id}>
                  {/* Section header */}
                  <button
                    onClick={() => {
                      if (hasSubsections) toggleSection(sectionItem.id)
                      handleSectionClick(sectionItem.path)
                    }}
                    className={cn(
                      "flex items-center gap-2 w-full px-3 py-1.5 text-sm font-medium transition-colors",
                      section === sectionItem.id
                        ? "text-foreground bg-muted/50"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    )}
                  >
                    {hasSubsections ? (
                      isExpanded ? (
                        <ChevronDown className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                      )
                    ) : (
                      <div className="w-4" />
                    )}
                    <span className="uppercase text-xs tracking-wider">{sectionItem.label}</span>
                  </button>

                  {/* Subsections */}
                  {hasSubsections && isExpanded && (
                    <div className="mt-0.5">
                      {sectionItem.subsections!.map((sub) => (
                        <TreeItem
                          key={sub.id}
                          item={sub}
                          depth={1}
                          expandedPaths={expandedPaths}
                          togglePath={togglePath}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
