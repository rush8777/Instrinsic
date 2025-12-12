"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import { ScaleButton } from "@/components/scale/buttons"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface WizardOption {
  id: string
  label: string
}

const projectTypes: WizardOption[] = [
  { id: "web", label: "Web Application" },
  { id: "mobile", label: "Mobile App" },
  { id: "api", label: "API / Backend" },
  { id: "ml", label: "Machine Learning" },
  { id: "data", label: "Data Pipeline" },
  { id: "automation", label: "Automation" },
  { id: "integration", label: "Integration" },
  { id: "other", label: "Other" },
]

const teamSizes: WizardOption[] = [
  { id: "solo", label: "Just Me" },
  { id: "small", label: "2-5 People" },
  { id: "medium", label: "6-15 People" },
  { id: "large", label: "16+ People" },
]

const timelines: WizardOption[] = [
  { id: "asap", label: "ASAP" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "quarter", label: "This Quarter" },
  { id: "flexible", label: "Flexible" },
]

interface Step {
  title: string
  options: WizardOption[]
  multiSelect?: boolean
}

const steps: Step[] = [
  { title: "What type of project is this?", options: projectTypes, multiSelect: true },
  { title: "How big is your team?", options: teamSizes },
  { title: "When do you need it done?", options: timelines },
]

function CheckboxCard({
  label,
  checked,
  onClick,
}: {
  label: string
  checked: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-3 rounded-lg border text-sm font-semibold transition-all duration-200",
        checked
          ? "bg-accent/20 border-accent text-foreground"
          : "bg-card border-border text-foreground hover:bg-muted hover:border-border"
      )}
    >
      {label}
    </button>
  )
}

interface CreateProjectWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateProjectWizard({ open, onOpenChange }: CreateProjectWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState<Record<number, string[]>>({})

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleSelect = (optionId: string) => {
    setSelections((prev) => {
      const current = prev[currentStep] || []
      if (step.multiSelect) {
        if (current.includes(optionId)) {
          return { ...prev, [currentStep]: current.filter((id) => id !== optionId) }
        }
        return { ...prev, [currentStep]: [...current, optionId] }
      }
      return { ...prev, [currentStep]: [optionId] }
    })
  }

  const isSelected = (optionId: string) => {
    return selections[currentStep]?.includes(optionId) || false
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final step - create project
      console.log("Creating project with selections:", selections)
      onOpenChange(false)
      setCurrentStep(0)
      setSelections({})
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setCurrentStep(0)
    setSelections({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-background/80 backdrop-blur-sm" />
        <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] p-0 border-0 bg-transparent shadow-none">
          <div className="flex flex-col gap-8 bg-card rounded-2xl border border-border p-8 md:p-12 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Logo */}
            <div className="flex justify-center">
              <span className="text-xl font-bold text-foreground">PromptIT</span>
            </div>

            {/* Content */}
            <div className="flex flex-col items-center gap-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center">
                {step.title}
              </h2>

              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {step.options.map((option) => (
                  <CheckboxCard
                    key={option.id}
                    label={option.label}
                    checked={isSelected(option.id)}
                    onClick={() => handleSelect(option.id)}
                  />
                ))}
              </div>
            </div>

            {/* Progress */}
            <Progress value={progress} className="h-1.5" />

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <ScaleButton
                variant="secondary"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </ScaleButton>

              <ScaleButton
                variant="primary"
                onClick={handleNext}
                disabled={!selections[currentStep]?.length}
                className="gap-2"
              >
                {currentStep === steps.length - 1 ? "Create Project" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </ScaleButton>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
