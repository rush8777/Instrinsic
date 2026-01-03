"use client"

import { useState } from "react"
import { ScaleButton } from "./buttons"
import { ScaleCard } from "./cards"
import { H3, Body } from "./typography"
import { CodeSnippetCard } from "./CodeSnippetCard"
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

  const codeExample = `// Initialize Project Prompts
async function initializePrompts() {
  const prompts = await api.generatePrompts(
    projectId
  );
  
  return prompts;
}`

  return (
    <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        {!hasPrompts ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-6 text-center max-w-lg">
              <CodeSnippetCard 
                copyText={codeExample}
                className="w-full text-left"
              >
                <div className="space-y-1">
                  <span className="text-muted-foreground">// Initialize Project Prompts</span>
                  <div>
                    <span className="text-primary">async function</span>{" "}
                    <span className="text-foreground">initializePrompts</span>
                    <span className="text-muted-foreground">() {"{"}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-primary">const</span>{" "}
                    <span className="text-foreground">prompts</span>{" "}
                    <span className="text-muted-foreground">=</span>{" "}
                    <span className="text-primary">await</span>{" "}
                    <span className="text-foreground">api</span>
                    <span className="text-muted-foreground">.</span>
                    <span className="text-foreground">generatePrompts</span>
                    <span className="text-muted-foreground">(</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-foreground">projectId</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-muted-foreground">);</span>
                  </div>
                  <div className="pl-4 mt-2">
                    <span className="text-primary">return</span>{" "}
                    <span className="text-foreground">prompts</span>
                    <span className="text-muted-foreground">;</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{"}"}</span>
                  </div>
                </div>
              </CodeSnippetCard>
              
              <div className="space-y-2">
                <H3 className="text-xl font-semibold">No Prompts Yet</H3>
                <Body className="text-muted-foreground">
                  Initialize prompts to generate the prompts used to build this project
                </Body>
              </div>
              
              <ScaleButton
                variant="primary"
                size="md"
                onClick={handleInitializePrompts}
                disabled={generating}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {generating ? "Generating..." : "Initialize Prompts"}
              </ScaleButton>
            </div>
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
