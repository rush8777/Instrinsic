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

// Mock subsections tailored per section (purely UI, no backend wiring yet)
const librarySubsections: SubsectionItem[] = [
  {
    id: "prompts",
    label: "Prompts",
    type: "folder",
    children: [
      { id: "changed-logo", label: "Changed logo", type: "file" },
      { id: "create-login", label: "Create Login", type: "file" },
      { id: "created-backend-logic", label: "Created Backend Logic", type: "file" },
    ],
  },
]

const plansSubsections: SubsectionItem[] = [
  {
    id: "history",
    label: "History",
    type: "folder",
    children: [
      { id: "chat-one", label: "Chat Name", type: "file" },
      { id: "chat-two", label: "Chat Name", type: "file" },
    ],
  },
]

const docsSubsections: SubsectionItem[] = [
  {
    id: "src",
    label: "src",
    type: "folder",
    children: [
      {
        id: "components",
        label: "components",
        type: "folder",
        children: [
          { id: "ui", label: "ui", type: "folder" },
          { id: "scale", label: "scale", type: "folder" },
        ],
      },
      { id: "pages", label: "pages", type: "folder" },
      { id: "hooks", label: "hooks", type: "folder" },
      { id: "assets", label: "assets", type: "folder" },
    ],
  },
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
        {/* Tree panel only (small icon sidebar removed) */}
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

                  {/* Plans-only action */}
                  {sectionItem.id === "plans" && (
                    <div className="px-3 pb-2">
                      <button
                        className="w-full rounded-md bg-primary text-primary-foreground text-sm font-medium py-1.5 hover:bg-primary/90 transition-colors"
                        onClick={() => {}}
                      >
                        New Plan
                      </button>
                    </div>
                  )}

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
