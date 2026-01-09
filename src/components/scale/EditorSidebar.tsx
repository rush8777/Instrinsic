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
import { HighlightCard } from "@/components/scale/cards"

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

const statusSubsections: SubsectionItem[] = [
  {
    id: "tasks",
    label: "Tasks",
    type: "folder",
    children: [
      { id: "pending", label: "Pending", type: "file" },
      { id: "in-progress", label: "In Progress", type: "file" },
      { id: "completed", label: "Completed", type: "file" },
    ],
  },
]

const sectionSubsections: Record<string, SubsectionItem[]> = {
  library: librarySubsections,
  plans: plansSubsections,
  status: statusSubsections,
  docs: docsSubsections,
}

const sections: SectionItem[] = [
  { id: "library", label: "Library", icon: <BookOpen className="w-5 h-5" />, path: "library" },
  { id: "plans", label: "Plans", icon: <MessageSquare className="w-5 h-5" />, path: "plans" },
  { id: "status", label: "Status", icon: <CheckSquare className="w-5 h-5" />, path: "status" },
  { id: "docs", label: "Docs", icon: <FileCode className="w-5 h-5" />, path: "docs" },
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

  // Get active section data
  const activeSection = sections.find(s => s.id === section) || sections[0]
  const activeSubsections = sectionSubsections[section] || []

  return (
    <TooltipProvider delayDuration={0}>
      <div className="relative h-full">
        {/* Hover edge + icon rail for section switching (overlays tree view) */}
        <div className="absolute inset-y-0 left-0 group z-30">
          {/* Thin hover zone at the very left edge that reveals the sidebar */}
          <div className="absolute inset-y-0 left-0 w-1 cursor-pointer z-20" />

          <div className="w-12 bg-background border-r border-border h-full flex flex-col items-center py-3 gap-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
            {/* Top navigation icons */}
            {topIcons.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleIconClick(item)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    {item.icon}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
            
            <div className="w-6 h-px bg-border my-2" />
            
            {/* Section icons */}
            {sections.map((sectionItem) => (
              <Tooltip key={sectionItem.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleSectionClick(sectionItem.path)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      section === sectionItem.id
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {sectionItem.icon}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  {sectionItem.label}
                </TooltipContent>
              </Tooltip>
            ))}
            
            <div className="flex-1" />
            
            {/* Bottom icons */}
            {bottomIcons.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleIconClick(item)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    {item.icon}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Section-specific tree panel */}
        <div className="w-48 bg-muted/30 border-r border-border h-full overflow-y-auto">
          <div className="py-3 px-2">
            {/* Section header */}
            <div className="flex items-center gap-2 px-2 pb-3 border-b border-border/50 mb-3">
              <span className="text-primary">{activeSection.icon}</span>
              <span className="font-semibold text-sm text-foreground">{activeSection.label}</span>
            </div>

            {/* Section-specific action button */}
            {section === "plans" && (
              <button
                className="w-full rounded-md bg-primary text-primary-foreground text-sm font-medium py-2 mb-3 hover:bg-primary/90 transition-colors"
                onClick={() => {}}
              >
                + New Plan
              </button>
            )}
            
            {section === "library" && (
              <button
                className="w-full rounded-md bg-primary/10 text-primary text-sm font-medium py-2 mb-3 hover:bg-primary/20 transition-colors border border-primary/20"
                onClick={() => {}}
              >
                Initialize Prompts
              </button>
            )}

            {/* Tree view for active section */}
            <HighlightCard className="p-3">
              {activeSubsections.length > 0 ? (
                <div className="space-y-0.5">
                  {activeSubsections.map((sub) => (
                    <TreeItem
                      key={sub.id}
                      item={sub}
                      depth={0}
                      expandedPaths={expandedPaths}
                      togglePath={togglePath}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground text-center py-2">
                  No items yet
                </div>
              )}
            </HighlightCard>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
