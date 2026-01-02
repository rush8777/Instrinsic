"// Project Editor Page"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { IconButton, ScaleButton } from "@/components/scale/buttons"
import { ProjectEditorSkeleton } from "@/components/scale/ProjectEditorSkeleton"
import { EditorSidebar } from "@/components/scale/EditorSidebar"
import { EditorLibrary } from "@/components/scale/EditorLibrary"
import { EditorPlans } from "@/components/scale/EditorPlans"
import { EditorStatus } from "@/components/scale/EditorStatus"
import { EditorDocs } from "@/components/scale/EditorDocs"
import { api } from "@/lib/api"
import { toast } from "sonner"

// TypeScript types
interface Project {
  id: number
  name: string
  description?: string
  title?: string
  author?: string
  category?: string
  tags?: string[]
  output_type?: string
  created_at?: string
  updated_at?: string
  content_blocks?: ContentBlock[]
  content?: string // Keep for backward compatibility during migration
  [key: string]: any // Allow other project properties
}

import {
  ArrowLeft,
  Save,
  MoreVertical,
  Share2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ProjectEditor() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const { id, section } = useParams<{ id: string; section?: string }>()
  const navigate = useNavigate()
  const currentIdRef = useRef<string | null>(null)

  // Default to library if no section is provided
  useEffect(() => {
    if (id && !section) {
      navigate(`/editor/${id}/library`, { replace: true })
    }
  }, [id, section, navigate])

  const generatePrompts = useCallback(async (projectData: Project) => {
    const projectId = projectData.id.toString()
    
    // Only proceed if this is still the current project
    if (currentIdRef.current !== projectId) {
      return
    }
    
    setGenerating(true)
    try {
      const response = await api.generatePrompts(projectData.id) as any
      
      // Only update state if this is still the current project
      if (currentIdRef.current === projectId) {
        // Response should contain the updated project
        if (response.project) {
          setProject(response.project as Project)
        } else {
          // If response doesn't have project, fetch it again
          const updatedProject = await api.getProject(projectData.id) as Project
          setProject(updatedProject)
        }
        toast.success("Prompts generated successfully!")
      }
    } catch (error: any) {
      // Only show error if this is still the current project
      if (currentIdRef.current === projectId) {
        console.error("Generate prompts error:", error)
        toast.error(error.message || "Failed to generate prompts. Please try again.")
        setGenerating(false)
      }
    } finally {
      // Only update generating state if this is still the current project
      if (currentIdRef.current === projectId) {
        setGenerating(false)
      }
    }
  }, [])

  useEffect(() => {
    // Reset state when id changes
    if (!id) {
      toast.error("Project ID not found")
      navigate("/dashboard")
      return
    }

    // Update the current ID ref and reset state
    currentIdRef.current = id
    setProject(null)
    setLoading(true)
    setGenerating(false)

    const fetchProject = async () => {
      const projectId = parseInt(id)
      
      try {
        const projectData = await api.getProject(projectId) as Project
        
        // Only update state if this is still the current project
        if (currentIdRef.current === id) {
          setProject(projectData)
          
          // Only auto-generate prompts for library section if no content blocks
          // Don't auto-generate for repository projects (they go to plans section)
          if ((!section || section === "library") && 
              (!projectData.content_blocks || projectData.content_blocks.length === 0) &&
              !projectData.repository_name) {
            generatePrompts(projectData)
          }
        }
      } catch (error: any) {
        // Only show error if this is still the current project
        if (currentIdRef.current === id) {
          toast.error("Failed to load project")
          navigate("/dashboard")
        }
      } finally {
        // Only update loading state if this is still the current project
        if (currentIdRef.current === id) {
          setLoading(false)
        }
      }
    }

    fetchProject()

    // Cleanup function
    return () => {
      // Mark this request as stale
      currentIdRef.current = null
    }
  }, [id, navigate, generatePrompts])

  const handleSave = async () => {
    if (!project) return

    try {
      await api.updateProject(project.id, project)
      toast.success("Project saved successfully!")
    } catch (error: any) {
      toast.error("Failed to save project")
    }
  }

  if (loading) {
    return <ProjectEditorSkeleton />;
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between h-14 px-4 md:px-6">
          {/* Left Side */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <IconButton
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </IconButton>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-foreground truncate">
                {project?.name || "Untitled Project"}
              </h1>
              {project?.description && (
                <p className="text-xs text-muted-foreground truncate">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {generating && (
              <span className="text-sm text-muted-foreground">Generating prompts...</span>
            )}
            <ScaleButton
              variant="secondary"
              size="sm"
              onClick={handleSave}
              className="gap-2"
              disabled={generating}
            >
              <Save className="w-4 h-4" />
              Save
            </ScaleButton>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Project
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this project?")) {
                      try {
                        await api.deleteProject(project.id)
                        toast.success("Project deleted")
                        navigate("/dashboard")
                      } catch (error) {
                        toast.error("Failed to delete project")
                      }
                    }
                  }}
                >
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content - Fixed height, no scroll */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Sidebar */}
        <EditorSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Section Content */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {project && (
            <>
              {section === "library" && (
                <EditorLibrary
                  projectId={project.id}
                  project={project}
                  onProjectUpdate={setProject}
                />
              )}
              {section === "plans" && <EditorPlans projectId={project.id} />}
              {section === "status" && <EditorStatus projectId={project.id} />}
              {section === "docs" && <EditorDocs projectId={project.id} />}
              {!section && (
                <EditorLibrary
                  projectId={project.id}
                  project={project}
                  onProjectUpdate={setProject}
                />
              )}
            </>
          )}
        </div>
      </div>
      
    </div>
  )
}
