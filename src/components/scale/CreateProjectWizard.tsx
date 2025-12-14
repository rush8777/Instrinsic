"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import { ScaleButton } from "@/components/scale/buttons"
import { ScaleInput, ScaleTextarea } from "@/components/scale/inputs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

// ============ TYPES ============

type AITool = "v0" | "bolt" | "replit" | "chatgpt" | "claude"
type TargetUsers = "students" | "developers" | "business" | "general"
type ExperienceLevel = "beginner" | "intermediate" | "advanced"
type OutputType = "single_component" | "page" | "multi_page_app" | "api_only" | "full_project"

interface WizardData {
  // Step 1
  ai_tools: AITool[]
  // Step 2
  project_name: string
  project_description: string
  target_users: TargetUsers | ""
  experience_level: ExperienceLevel | ""
  // Step 3
  output_type: OutputType | ""
  expected_outputs: {
    code: boolean
    explanation: boolean
    file_structure: boolean
    comments: boolean
  }
  // Step 4
  frontend_framework: string
  styling: string
  backend_framework: string
  database: string
  language: string
}

const initialWizardData: WizardData = {
  ai_tools: [],
  project_name: "",
  project_description: "",
  target_users: "",
  experience_level: "",
  output_type: "",
  expected_outputs: {
    code: false,
    explanation: false,
    file_structure: false,
    comments: false,
  },
  frontend_framework: "",
  styling: "",
  backend_framework: "",
  database: "",
  language: "",
}

// ============ OPTIONS ============

const aiTools: { id: AITool; label: string; icon: string }[] = [
  { id: "v0", label: "v0", icon: "▲" },
  { id: "bolt", label: "Bolt", icon: "⚡" },
  { id: "replit", label: "Replit", icon: "◉" },
  { id: "chatgpt", label: "ChatGPT", icon: "◯" },
  { id: "claude", label: "Claude", icon: "◈" },
]

const targetUsersOptions: { id: TargetUsers; label: string }[] = [
  { id: "students", label: "Students" },
  { id: "developers", label: "Developers" },
  { id: "business", label: "Business Users" },
  { id: "general", label: "General Users" },
]

const experienceLevelOptions: { id: ExperienceLevel; label: string }[] = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
]

const outputTypeOptions: { id: OutputType; label: string }[] = [
  { id: "single_component", label: "Single Component" },
  { id: "page", label: "Page" },
  { id: "multi_page_app", label: "Multi-Page App" },
  { id: "api_only", label: "API Only" },
  { id: "full_project", label: "Full Project" },
]

const expectedOutputOptions: { id: keyof WizardData["expected_outputs"]; label: string }[] = [
  { id: "code", label: "Code" },
  { id: "explanation", label: "Explanation" },
  { id: "file_structure", label: "File Structure" },
  { id: "comments", label: "Comments" },
]

const frontendOptions = ["React", "Vue", "Svelte", "Next.js", "Nuxt", "Angular"]
const stylingOptions = ["Tailwind CSS", "CSS Modules", "Styled Components", "Sass", "Plain CSS"]
const backendOptions = ["Node.js", "Python", "Go", "Rust", "Java", "None"]
const databaseOptions = ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Supabase", "None"]
const languageOptions = ["TypeScript", "JavaScript", "Python", "Go", "Rust"]

// ============ STEP TITLES ============

const stepTitles = [
  "Which AI tools will you use?",
  "Tell us about your project",
  "What type of output do you need?",
  "Configure your tech stack",
]

// ============ COMPONENTS ============

function SelectCard({
  label,
  icon,
  checked,
  onClick,
}: {
  label: string
  icon?: string
  checked: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-5 py-4 rounded-xl border text-sm font-semibold transition-all duration-200",
        checked
          ? "bg-accent/20 border-accent text-foreground ring-2 ring-accent/30"
          : "bg-card border-border text-foreground hover:bg-muted hover:border-muted-foreground/30"
      )}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{label}</span>
      {checked && <Check className="w-4 h-4 ml-auto text-accent" />}
    </button>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { id: string; label: string }[]
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 px-3 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
      >
        <option value="">{placeholder || "Select..."}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
          checked
            ? "bg-accent border-accent"
            : "border-border group-hover:border-muted-foreground"
        )}
      >
        {checked && <Check className="w-3 h-3 text-accent-foreground" />}
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </label>
  )
}

// ============ WIZARD ============

interface CreateProjectWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateProjectWizard({ open, onOpenChange }: CreateProjectWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData)

  const totalSteps = 4
  const progress = ((currentStep + 1) / totalSteps) * 100

  // ============ VALIDATION ============

  const isStep1Valid = wizardData.ai_tools.length > 0

  const isStep2Valid =
    wizardData.project_description.trim().length > 0 &&
    wizardData.target_users !== "" &&
    wizardData.experience_level !== ""

  const isStep3Valid =
    wizardData.output_type !== "" &&
    Object.values(wizardData.expected_outputs).some(Boolean)

  const isStep4Valid = useMemo(() => {
    const hasV0 = wizardData.ai_tools.includes("v0")
    const hasBolt = wizardData.ai_tools.includes("bolt")
    const hasReplit = wizardData.ai_tools.includes("replit")
    const hasChatGPT = wizardData.ai_tools.includes("chatgpt")
    const hasClaude = wizardData.ai_tools.includes("claude")

    // v0 requires frontend + styling
    if (hasV0 && (!wizardData.frontend_framework || !wizardData.styling)) return false
    
    // bolt requires frontend + backend + database
    if (hasBolt && (!wizardData.frontend_framework || !wizardData.backend_framework || !wizardData.database)) return false
    
    // replit requires language
    if (hasReplit && !wizardData.language) return false
    
    // chatgpt/claude are flexible, no strict requirements
    if ((hasChatGPT || hasClaude) && !wizardData.language) return false

    return true
  }, [wizardData])

  const isCurrentStepValid = [isStep1Valid, isStep2Valid, isStep3Valid, isStep4Valid][currentStep]

  // ============ HANDLERS ============

  const toggleAITool = (tool: AITool) => {
    setWizardData((prev) => ({
      ...prev,
      ai_tools: prev.ai_tools.includes(tool)
        ? prev.ai_tools.filter((t) => t !== tool)
        : [...prev.ai_tools, tool],
    }))
  }

  const updateField = <K extends keyof WizardData>(field: K, value: WizardData[K]) => {
    setWizardData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleExpectedOutput = (key: keyof WizardData["expected_outputs"]) => {
    setWizardData((prev) => ({
      ...prev,
      expected_outputs: {
        ...prev.expected_outputs,
        [key]: !prev.expected_outputs[key],
      },
    }))
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      console.log("Final wizard data:", wizardData)
      onOpenChange(false)
      setCurrentStep(0)
      setWizardData(initialWizardData)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setCurrentStep(0)
    setWizardData(initialWizardData)
  }

  // ============ TECH STACK VISIBILITY ============

  const showFrontend = wizardData.ai_tools.some((t) => ["v0", "bolt"].includes(t))
  const showStyling = wizardData.ai_tools.includes("v0")
  const showBackend = wizardData.ai_tools.includes("bolt")
  const showDatabase = wizardData.ai_tools.includes("bolt")
  const showLanguage = wizardData.ai_tools.some((t) => ["replit", "chatgpt", "claude"].includes(t))

  // ============ RENDER STEPS ============

  const renderStep1 = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-lg">
      {aiTools.map((tool) => (
        <SelectCard
          key={tool.id}
          label={tool.label}
          icon={tool.icon}
          checked={wizardData.ai_tools.includes(tool.id)}
          onClick={() => toggleAITool(tool.id)}
        />
      ))}
    </div>
  )

  const renderStep2 = () => (
    <div className="flex flex-col gap-4 w-full max-w-lg">
      <ScaleInput
        label="Project Name (optional)"
        placeholder="My Awesome Project"
        value={wizardData.project_name}
        onChange={(e) => updateField("project_name", e.target.value)}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-muted-foreground">
          Project Description <span className="text-destructive">*</span>
        </label>
        <ScaleTextarea
          placeholder="Describe what you want to build..."
          value={wizardData.project_description}
          onChange={(e) => updateField("project_description", e.target.value.slice(0, 300))}
          className="min-h-[100px]"
        />
        <span className="text-xs text-muted-foreground text-right">
          {wizardData.project_description.length}/300
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Target Users"
          value={wizardData.target_users}
          onChange={(v) => updateField("target_users", v as TargetUsers)}
          options={targetUsersOptions}
          placeholder="Select users..."
        />
        <SelectField
          label="Experience Level"
          value={wizardData.experience_level}
          onChange={(v) => updateField("experience_level", v as ExperienceLevel)}
          options={experienceLevelOptions}
          placeholder="Select level..."
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground">Output Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {outputTypeOptions.map((opt) => (
            <SelectCard
              key={opt.id}
              label={opt.label}
              checked={wizardData.output_type === opt.id}
              onClick={() => updateField("output_type", opt.id)}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-muted-foreground">Expected Outputs</label>
        <div className="grid grid-cols-2 gap-3">
          {expectedOutputOptions.map((opt) => (
            <CheckboxItem
              key={opt.id}
              label={opt.label}
              checked={wizardData.expected_outputs[opt.id]}
              onChange={() => toggleExpectedOutput(opt.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="flex flex-col gap-4 w-full max-w-lg">
      {!showFrontend && !showStyling && !showBackend && !showDatabase && !showLanguage && (
        <p className="text-sm text-muted-foreground text-center">
          No additional configuration needed for selected tools.
        </p>
      )}
      
      {showFrontend && (
        <SelectField
          label="Frontend Framework"
          value={wizardData.frontend_framework}
          onChange={(v) => updateField("frontend_framework", v)}
          options={frontendOptions.map((f) => ({ id: f, label: f }))}
          placeholder="Select framework..."
        />
      )}
      
      {showStyling && (
        <SelectField
          label="Styling"
          value={wizardData.styling}
          onChange={(v) => updateField("styling", v)}
          options={stylingOptions.map((s) => ({ id: s, label: s }))}
          placeholder="Select styling..."
        />
      )}
      
      {showBackend && (
        <SelectField
          label="Backend Framework"
          value={wizardData.backend_framework}
          onChange={(v) => updateField("backend_framework", v)}
          options={backendOptions.map((b) => ({ id: b, label: b }))}
          placeholder="Select backend..."
        />
      )}
      
      {showDatabase && (
        <SelectField
          label="Database"
          value={wizardData.database}
          onChange={(v) => updateField("database", v)}
          options={databaseOptions.map((d) => ({ id: d, label: d }))}
          placeholder="Select database..."
        />
      )}
      
      {showLanguage && (
        <SelectField
          label="Primary Language"
          value={wizardData.language}
          onChange={(v) => updateField("language", v)}
          options={languageOptions.map((l) => ({ id: l, label: l }))}
          placeholder="Select language..."
        />
      )}
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderStep1()
      case 1: return renderStep2()
      case 2: return renderStep3()
      case 3: return renderStep4()
      default: return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-background/80 backdrop-blur-sm" />
        <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] p-0 border-0 bg-transparent shadow-none overflow-auto">
          <div className="flex flex-col gap-6 bg-card rounded-2xl border border-border p-6 md:p-10 shadow-2xl">
            
            {/* Logo */}
            <div className="flex justify-center">
              <span className="text-xl font-bold text-foreground">PromptIT</span>
            </div>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    i === currentStep ? "bg-accent w-6" : i < currentStep ? "bg-accent/50" : "bg-border"
                  )}
                />
              ))}
            </div>

            {/* Title */}
            <h2 className="text-xl md:text-2xl font-semibold text-foreground text-center">
              {stepTitles[currentStep]}
            </h2>

            {/* Content */}
            <div className="flex justify-center py-4">
              {renderCurrentStep()}
            </div>

            {/* Progress */}
            <Progress value={progress} className="h-1" />

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
                disabled={!isCurrentStepValid}
                className="gap-2"
              >
                {currentStep === totalSteps - 1 ? "Create Prompt" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </ScaleButton>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
