"use client"

import { useState } from "react"
import { ScaleButton } from "./buttons"
import { ScaleCard } from "./cards"
import { H3, Body } from "./typography"
import { CodeSnippetCard } from "./CodeSnippetCard"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Sparkles } from "lucide-react"

interface EditorLibraryProps {
  projectId: number
  project: any
  onProjectUpdate: (project: any) => void
}

export function EditorLibrary({ projectId, project, onProjectUpdate }: EditorLibraryProps) {
  const [generating, setGenerating] = useState(false)

  const handleInitializePrompts = async () => {
    setGenerating(true)
    try {
      const response = await api.generatePrompts(projectId) as any
      if (response.project) {
        onProjectUpdate(response.project)
      } else {
        const updatedProject = await api.getProject(projectId)
        onProjectUpdate(updatedProject)
      }
      toast.success("Prompts generated successfully!")
    } catch (error: any) {
      toast.error(error.message || "Failed to generate prompts. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  const hasPrompts = project?.content_blocks && project.content_blocks.length > 0

  return (
    <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        {!hasPrompts ? (
          <div className="relative flex items-center justify-center h-full">
            <BackgroundBeams />
            <CodeSnippetCard className="max-w-md w-full relative z-10" showActions={false}>
              <div className="space-y-4 text-center">
                <div className="space-y-2">
                  <p className="text-foreground font-mono text-lg">No Prompts Yet</p>
                  <p className="text-muted-foreground font-mono text-sm">
                    Initialize prompts to generate the prompts used to build this project
                  </p>
                </div>
                <ScaleButton
                  variant="primary"
                  size="md"
                  onClick={handleInitializePrompts}
                  disabled={generating}
                  className="mx-auto"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {generating ? "Generating..." : "Initialize Prompts"}
                </ScaleButton>
              </div>
            </CodeSnippetCard>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Project Prompts</h2>
            <div className="space-y-4">
              {project.content_blocks?.map((block: any, index: number) => (
                <ScaleCard key={index} className="p-6">
                  <div className="space-y-2">
                    {block.title && (
                      <H3 className="text-lg font-semibold">{block.title}</H3>
                    )}
                    {block.content && (
                      <Body className="text-muted-foreground whitespace-pre-wrap">
                        {block.content}
                      </Body>
                    )}
                  </div>
                </ScaleCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
