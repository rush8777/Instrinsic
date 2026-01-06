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
  Bell,
  Gift,
  Zap,
  PanelLeft,
  Grid3x3,
  Star,
  Users,
  Compass,
  Box
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
  { id: "home", label: "Home", icon: <Home className="w-5 h-5" />, path: "/dashboard" },
  { id: "search", label: "Search", icon: <Search className="w-5 h-5" />, path: "" },
]

const navItems = [
  { id: "all-projects", label: "All projects", icon: <Grid3x3 className="w-4 h-4" />, path: "/dashboard" },
  { id: "starred", label: "Starred", icon: <Star className="w-4 h-4" />, path: "/dashboard" },
  { id: "shared", label: "Shared with me", icon: <Users className="w-4 h-4" />, path: "/dashboard" },
  { id: "discover", label: "Discover", icon: <Compass className="w-4 h-4" />, path: "/dashboard" },
  { id: "templates", label: "Templates", icon: <Box className="w-4 h-4" />, path: "/dashboard" },
  { id: "learn", label: "Learn", icon: <BookOpen className="w-4 h-4" />, path: "/dashboard" },
]

const bottomIcons = [
  { id: "projects", label: "All Projects", icon: <FolderOpen className="w-5 h-5" />, path: "/dashboard" },
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
  const { user } = useAuth()
  const { id, section = "library" } = useParams<{ id: string; section?: string }>()
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["library", "plans", "docs"]))
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
  const [iconSidebarCollapsed, setIconSidebarCollapsed] = useState(false)

  const handleSectionClick = (sectionPath: string) => {
    navigate(`/editor/${id}/${sectionPath}`)
  }

  const handleNavClick = (path: string) => {
    if (path) {
      navigate(path)
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

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full">
        {/* Main Icon Sidebar - Always Visible */}
        <div className={cn(
          "bg-[#1a1a1a] border-r border-border/20 h-full flex flex-col transition-all duration-300",
          iconSidebarCollapsed ? "w-14" : "w-56"
        )}>
          {/* Top Section */}
          <div className="px-2 py-3 border-b border-border/20 space-y-2">
            {/* Collapse Icon */}
            <button 
              onClick={() => setIconSidebarCollapsed(!iconSidebarCollapsed)}
              className={cn(
                "flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
                iconSidebarCollapsed ? "w-full p-2" : "p-2 ml-auto"
              )}
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            {/* Workspace Selector */}
            {iconSidebarCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="w-full flex items-center justify-center">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold border border-border/30">
                      {user?.username?.[0] || user?.email?.[0] || "U"}
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {user?.username || user?.email?.split("@")[0] || "User"}'s Workspace
                </TooltipContent>
              </Tooltip>
            ) : (
              <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition-colors">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-xs font-semibold">
                  {user?.username?.[0] || user?.email?.[0] || "U"}
                </div>
                <span className="text-sm font-medium text-foreground flex-1 text-left truncate">
                  {user?.username || user?.email?.split("@")[0] || "User"}'s Lovable
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>
            )}
          </div>

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto px-2 py-4 scrollbar-thin">
            {iconSidebarCollapsed ? (
              // Collapsed state - show section icons only
              <div className="flex flex-col items-center gap-1">
                {/* Top navigation icons */}
                {topIcons.map((item) => (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleNavClick(item.path)}
                        className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a] rounded-lg transition-colors"
                      >
                        {item.icon}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ))}
                
                <div className="w-8 h-px bg-border/30 my-2" />
                
                {/* Editor section icons */}
                {sections.map((item) => (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleSectionClick(item.path)}
                        className={cn(
                          "w-10 h-10 flex items-center justify-center rounded-lg transition-colors",
                          section === item.id
                            ? "bg-[#2a2a2a] text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a]"
                        )}
                      >
                        {item.icon}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ) : (
              // Expanded state - show editor sections with labels
              <div className="flex flex-col gap-1">
                {/* Top navigation items */}
                {topIcons.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.path)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a]"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
                
                <div className="h-px bg-border/30 my-2 mx-3" />
                
                {/* Editor sections */}
                {sections.map((item) => (
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
          {!iconSidebarCollapsed && (
            <div className="px-3 py-4 space-y-2 border-t border-border/20">
              <div className="bg-[#2a2a2a] rounded-lg p-3 hover:bg-[#333] transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">Share Lovable</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Get 10 credits each</div>
                  </div>
                  <Gift className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
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
            "flex items-center border-t border-border/20 gap-2",
            iconSidebarCollapsed ? "flex-col px-2 py-3" : "px-4 py-3 justify-between"
          )}>
            <button className="w-8 h-8 rounded-full bg-amber-200/20 flex items-center justify-center hover:bg-amber-200/30 transition-colors">
              <span className="text-amber-200 text-xs font-semibold">
                {user?.username?.[0] || user?.email?.[0] || "U"}
              </span>
            </button>
            <button className="relative w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[#2a2a2a] rounded-lg transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Tree panel showing only the active section's tree */}
        <div className="w-56 bg-muted/30 border-r border-border h-full overflow-y-auto">
          <div className="py-2">
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
