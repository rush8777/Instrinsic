"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScaleInput } from "@/components/scale/inputs"
import { ScaleButton } from "@/components/scale/buttons"
import { GitBranch } from "lucide-react"

interface RepositoryInputDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnect: (repositoryName: string) => void
}

export function RepositoryInputDialog({ open, onOpenChange, onConnect }: RepositoryInputDialogProps) {
  const [repositoryName, setRepositoryName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleConnect = async () => {
    if (!repositoryName.trim()) {
      return
    }

    setLoading(true)
    try {
      await onConnect(repositoryName.trim())
      setRepositoryName("")
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleConnect()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-background/80 backdrop-blur-sm" />
        <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-0 border-0 bg-transparent shadow-none">
          <div className="flex flex-col gap-6 bg-card rounded-2xl border border-border p-6 md:p-8 shadow-2xl">
            <DialogHeader>
              <div className="flex items-center justify-center mb-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary">
                  <GitBranch className="w-6 h-6 text-foreground" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl font-semibold">
                Connect Repository
              </DialogTitle>
              <DialogDescription className="text-center">
                Enter the name of the GitHub repository you'd like to connect
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <ScaleInput
                placeholder="owner/repository-name"
                value={repositoryName}
                onChange={(e) => setRepositoryName(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />

              <ScaleButton
                variant="primary"
                size="md"
                onClick={handleConnect}
                disabled={!repositoryName.trim() || loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? "Connecting..." : "Connect"}
              </ScaleButton>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

