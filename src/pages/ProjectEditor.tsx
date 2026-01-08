// Project Editor Page

import React, { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ProjectEditorSkeleton } from "@/components/scale/ProjectEditorSkeleton"
import { EditorSidebar } from "@/components/scale/EditorSidebar"
import { EditorLibrary } from "@/components/scale/EditorLibrary"
import { EditorPlans } from "@/components/scale/EditorPlans"
import { EditorStatus } from "@/components/scale/EditorStatus"
import { EditorDocs } from "@/components/scale/EditorDocs"
import { SimpleHeader } from "@/components/scale/header"
import { api } from "@/lib/api"
import { toast } from "sonner"

// TypeScript types
interface ContentBlock {
  id: string
  type: string
  content: string
}

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
  content?: string
  repository_name?: string
  [key: string]: any
}

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


  if (loading) {
    return <ProjectEditorSkeleton />;
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Simple Header */}
      <SimpleHeader 
        projectName={project?.name}
        projectStatus="Previewing last saved version"
      />

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
