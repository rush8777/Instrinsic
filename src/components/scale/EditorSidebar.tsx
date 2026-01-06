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
  File,
  Bell
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/contexts/AuthContext"

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
  const { user } = useAuth()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["library", "plans", "docs"]))
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
  const [isHovered, setIsHovered] = useState(false)

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

  // Get the current section's data
  const currentSection = sections.find(s => s.id === section) || sections[0]
  const hasSubsections = currentSection.subsections && currentSection.subsections.length > 0

  // Get user initials for avatar
  const userInitial = user?.email?.charAt(0).toUpperCase() || "U"

  return (
    <TooltipProvider delayDuration={0}>
      <div 
        className="flex h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Always visible collapsed icon bar */}
        <div className="w-14 bg-muted/50 border-r border-border h-full flex flex-col items-center py-3 flex-shrink-0">
          {/* Top icons */}
          <div className="flex flex-col items-center gap-1 mb-4">
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
                <TooltipContent side="right" sideOffset={8}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Separator */}
          <div className="w-8 h-px bg-border mb-4" />

          {/* Section icons */}
          <div className="flex flex-col items-center gap-1 flex-1">
            {sections.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleSectionClick(item.path)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      section === item.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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

          {/* Bottom section */}
          <div className="flex flex-col items-center gap-1 mt-auto">
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
                <TooltipContent side="right" sideOffset={8}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}

            {/* Notification bell */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                Notifications
              </TooltipContent>
            </Tooltip>

            {/* User avatar */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-medium text-sm mt-2">
                  {userInitial}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                {user?.email || "Account"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Expandable tree panel - shows on hover */}
        <div 
          className={cn(
            "bg-muted/30 border-r border-border h-full overflow-y-auto transition-all duration-200",
            isHovered ? "w-56 opacity-100" : "w-0 opacity-0 overflow-hidden"
          )}
        >
          <div className="py-2 min-w-56">
            {/* Section header */}
            <button
              onClick={() => hasSubsections && toggleSection(currentSection.id)}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-sm font-medium transition-colors text-foreground"
            >
              {hasSubsections ? (
                expandedSections.has(currentSection.id) ? (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                )
              ) : (
                <div className="w-4" />
              )}
              <span className="uppercase text-xs tracking-wider">{currentSection.label}</span>
            </button>

            {/* Section-specific content */}
            {currentSection.id === "library" && (
              <>
                {hasSubsections && expandedSections.has(currentSection.id) && (
                  <div className="mt-0.5">
                    {currentSection.subsections!.map((sub) => (
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
              </>
            )}

            {currentSection.id === "plans" && (
              <>
                {/* New Plan button */}
                <div className="px-3 py-2">
                  <button
                    className="w-full rounded-md bg-primary text-primary-foreground text-sm font-medium py-1.5 hover:bg-primary/90 transition-colors"
                    onClick={() => {}}
                  >
                    New Plan
                  </button>
                </div>
                {/* History subsection */}
                {hasSubsections && expandedSections.has(currentSection.id) && (
                  <div className="mt-0.5">
                    {currentSection.subsections!.map((sub) => (
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
              </>
            )}

            {currentSection.id === "status" && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {/* Status has no tree, just displays status content */}
              </div>
            )}

            {currentSection.id === "docs" && (
              <>
                {hasSubsections && expandedSections.has(currentSection.id) && (
                  <div className="mt-0.5">
                    {currentSection.subsections!.map((sub) => (
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
              </>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
