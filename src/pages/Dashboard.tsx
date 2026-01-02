"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// Import from your components/scale folder
import { H2, H3, Body } from "@/components/scale/typography"
import { ScaleButton, IconButton } from "@/components/scale/buttons"
import { ScaleCard, HighlightCard } from "@/components/scale/cards"
import { IconWithBackground } from "@/components/scale/icon-with-background"
import { ScaleHeader } from "@/components/scale/header"
import { ScaleFooter } from "@/components/scale/footer"
import { ProjectCreationModal } from "@/components/scale/ProjectCreationModal"
import { NetworkAnimation } from "@/components/scale/NetworkAnimation"
import { DashboardSkeleton } from "@/components/scale/DashboardSkeleton"
import { StatusBadge } from "@/components/scale/badges"
import { Coins, Settings, Building, Compass, MapPin, Bookmark, MoreHorizontal, Plus, Layers, Zap } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

// ============================================
// NETWORK ANIMATION COMPONENT (INLINE)
// ============================================

// ============================================
// JOB CARD COMPONENT
// ============================================
function JobCard({
  icon,
  company,
  role,
  status,
  location,
  onClick,
}: {
  icon: React.ReactNode
  company: string
  role: string
  status: string
  location: string
  onClick?: () => void
}) {
  // Map project status to StatusBadge status
  const getStatusBadgeStatus = (status: string): "active" | "pending" | "inactive" => {
    if (status === "active") return "active"
    if (status === "archived") return "inactive"
    return "inactive" // deleted or any other status
  }

  // Format status label - keep it short and concise
  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      active: "Active",
      archived: "Arch",
      deleted: "Del",
    }
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1, 4)
  }

  return (
    <ScaleCard 
      className="flex flex-col gap-4 p-4 cursor-pointer hover:border-muted-foreground/30 transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <IconWithBackground icon={icon} size="md" square />
        <div className="flex flex-1 items-center justify-end gap-1">
          <IconButton 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              // Handle bookmark action
            }}
          >
            <Bookmark className="w-4 h-4" />
          </IconButton>
          <IconButton 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              // Handle more options
            }}
          >
            <MoreHorizontal className="w-4 h-4" />
          </IconButton>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-foreground line-clamp-1">{company}</span>
          <span className="text-xs text-muted-foreground line-clamp-1">{role}</span>
        </div>
        <StatusBadge 
          status={getStatusBadgeStatus(status)} 
          label={getStatusLabel(status)}
          className="px-2"
        />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </div>
      </div>
    </ScaleCard>
  )
}

// ============================================
// CREATE PROJECT CARD COMPONENT
// ============================================
function CreateProjectCard({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg border border-dashed border-border/60 bg-card/30 hover:bg-card/50 hover:border-border transition-all duration-200 min-h-[180px] cursor-pointer group"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary group-hover:bg-accent/20 transition-colors">
        <Plus className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
        Create New Project
      </span>
    </button>
  )
}

// ============================================
// QUICK ACTION CARD COMPONENT
// ============================================
function QuickActionCard({
  title,
  buttonText,
  onClick,
}: {
  title: string
  buttonText: string
  onClick?: () => void
}) {
  return (
    <HighlightCard className="flex-1 min-w-[160px]">
      <div className="flex flex-col gap-3">
        <H3 className="text-sm">{title}</H3>
        <ScaleButton size="sm" onClick={onClick}>
          {buttonText}
        </ScaleButton>
      </div>
    </HighlightCard>
  )
}

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
export default function Dashboard() {
  const [referralLink, setReferralLink] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, projectsData, referralData] = await Promise.all([
          api.getCurrentUser(),
          api.getProjects(),
          api.getReferralLink().catch(() => ({ referral_link: "" }))
        ])
        setUser(userData)
        // Handle both paginated (with results) and non-paginated (direct array) responses
        const projectsList = Array.isArray(projectsData) 
          ? projectsData 
          : ((projectsData as any).results || (projectsData as any).data || [])
        console.log("Projects loaded:", projectsList)
        setProjects(projectsList)
        setReferralLink((referralData as any).referral_link || "")
      } catch (error: any) {
        if (error.message.includes("401") || error.message.includes("Unauthorized")) {
          navigate("/login")
        } else {
          toast.error("Failed to load dashboard data")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [navigate])

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ScaleHeader />

      <div className="flex-1 flex flex-col gap-12 px-6 md:px-12 py-12 pb-24 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="flex-1 text-4xl font-semibold text-foreground">
            Hi, {user?.username || user?.email?.split("@")[0] || "User"}!
          </h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Balance</span>
              <div className="w-px h-6 bg-border" />
              <div className="flex items-center gap-1">
                <Coins className="w-5 h-5 text-foreground" />
                <span className="text-xl font-semibold text-foreground">{user?.balance || 0}</span>
              </div>
            </div>
            <ScaleButton onClick={() => referralLink && navigator.clipboard.writeText(referralLink)}>
              Refer & Earn
            </ScaleButton>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="relative flex flex-wrap items-center gap-4 rounded-xl overflow-hidden p-5 md:p-6 bg-gradient-to-r from-accent/20 via-purple-500/10 to-accent/15">
          {/* Network animation background */}
          <NetworkAnimation />

          {/* Content with relative positioning to appear above animation */}
          <div className="relative z-10 flex flex-1 min-w-[200px] flex-col gap-2 py-2 pr-4">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground/70">Welcome to</span>
              <span className="text-xl font-semibold text-foreground">Scale AI</span>
            </div>
            <Body className="text-foreground/70 text-sm">Full access to job openings and career help.</Body>
          </div>

          <QuickActionCard title="Find your next gig" buttonText="Browse jobs" />
          <QuickActionCard title="Career help" buttonText="Browse posts" />
          <QuickActionCard title="Refer & earn" buttonText="Earn today" />
        </div>

        {/* Projects Grid */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <H2 className="flex-1">Your Projects</H2>
            <ScaleButton variant="link" withArrow>
              View all
            </ScaleButton>
          </div>

          {projects.length > 0 ? (
            <>
              {/* Row 1 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {projects.slice(0, 4).map((project) => (
                  <JobCard
                    key={project.id}
                    icon={<Settings className="w-4 h-4" />}
                    company={project.name}
                    role={project.output_type || "Project"}
                    status={project.status}
                    location={new Date(project.created_at).toLocaleDateString()}
                    onClick={() => {
                      if (project.id) {
                        navigate(`/editor/${project.id}`)
                      } else {
                        console.error("Project ID is missing:", project)
                      }
                    }}
                  />
                ))}
                {projects.length < 4 && (
                  <CreateProjectCard onClick={() => setModalOpen(true)} />
                )}
              </div>

              {/* Row 2 */}
              {projects.length > 4 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {projects.slice(4, 8).map((project) => (
                    <JobCard
                      key={project.id}
                      icon={<Zap className="w-4 h-4" />}
                      company={project.name}
                      role={project.output_type || "Project"}
                      status={project.status}
                      location={new Date(project.created_at).toLocaleDateString()}
                      onClick={() => {
                        if (project.id) {
                          navigate(`/editor/${project.id}/library`)
                        } else {
                          console.error("Project ID is missing:", project)
                        }
                      }}
                    />
                  ))}
                  {projects.length < 8 && (
                    <CreateProjectCard onClick={() => setModalOpen(true)} />
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CreateProjectCard onClick={() => setModalOpen(true)} />
            </div>
          )}
        </div>

        {/* Spacer div for extra bottom space */}
        <div className="flex-1 min-h-[120px]" />
      </div>

      {/* Create Project Modal */}
      <ProjectCreationModal open={modalOpen} onOpenChange={setModalOpen} />

      {/* Scale Footer */}
      <ScaleFooter />
    </div>
  )
}
