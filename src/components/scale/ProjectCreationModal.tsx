"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import { ScaleCard } from "@/components/scale/cards"
import { ScaleButton } from "@/components/scale/buttons"
import { H3, Body } from "@/components/scale/typography"
import { RepositoryInputDialog } from "./RepositoryInputDialog"
import { CreateProjectWizard } from "./CreateProjectWizard"
import { GitBranch, Sparkles } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface ProjectCreationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectCreationModal({ open, onOpenChange }: ProjectCreationModalProps) {
  const [showRepositoryDialog, setShowRepositoryDialog] = useState(false)
  const [showWizard, setShowWizard] = useState(false)
  const navigate = useNavigate()

  const handleConnectRepository = () => {
    setShowRepositoryDialog(true)
  }

  const handleFromScratch = () => {
    setShowWizard(true)
    onOpenChange(false)
  }

  const handleRepositoryConnect = async (repositoryName: string) => {
    try {
      const project = await api.createProject({
        name: repositoryName,
        repository_name: repositoryName,
      }) as any
      
      toast.success("Repository connected successfully!")
      setShowRepositoryDialog(false)
      onOpenChange(false)
      
      // Navigate to plans section for repository projects
      navigate(`/editor/${project.id}/plans`)
    } catch (error: any) {
      toast.error(error.message || "Failed to connect repository. Please try again.")
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogPortal>
          <DialogOverlay className="bg-background/80 backdrop-blur-sm" />
          <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] p-0 border-0 bg-transparent shadow-none overflow-auto">
            <div className="flex flex-col gap-6 bg-card rounded-2xl border border-border p-6 md:p-10 shadow-2xl">
              {/* Title */}
              <div className="flex justify-center">
                <H3 className="text-2xl font-semibold text-foreground">Create New Project</H3>
              </div>

              {/* Description */}
              <Body className="text-center text-muted-foreground">
                Choose how you'd like to create your project
              </Body>

              {/* Two Option Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Connect Repository Option */}
                <ScaleCard
                  className="flex flex-col items-center justify-center gap-4 p-8 cursor-pointer hover:border-muted-foreground/30 transition-all min-h-[200px]"
                  onClick={handleConnectRepository}
                >
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
                    <GitBranch className="w-8 h-8 text-foreground" />
                  </div>
                  <H3 className="text-lg font-semibold text-foreground">Connect Repository</H3>
                  <Body className="text-center text-muted-foreground text-sm">
                    Connect an existing GitHub repository to start planning and managing your project
                  </Body>
                </ScaleCard>

                {/* From Scratch Option */}
                <ScaleCard
                  className="flex flex-col items-center justify-center gap-4 p-8 cursor-pointer hover:border-muted-foreground/30 transition-all min-h-[200px]"
                  onClick={handleFromScratch}
                >
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
                    <Sparkles className="w-8 h-8 text-foreground" />
                  </div>
                  <H3 className="text-lg font-semibold text-foreground">From Scratch</H3>
                  <Body className="text-center text-muted-foreground text-sm">
                    Create a new project from scratch using our guided wizard
                  </Body>
                </ScaleCard>
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Repository Input Dialog */}
      <RepositoryInputDialog
        open={showRepositoryDialog}
        onOpenChange={setShowRepositoryDialog}
        onConnect={handleRepositoryConnect}
      />

      {/* Create Project Wizard */}
      <CreateProjectWizard 
        open={showWizard} 
        onOpenChange={(open) => {
          setShowWizard(open)
          if (!open) {
            onOpenChange(false)
          }
        }}
      />
    </>
  )
}

