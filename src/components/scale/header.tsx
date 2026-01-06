import * as React from "react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ScaleButton } from "./buttons"
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  User, 
  LogOut, 
  Settings,
  Heart,
  RotateCcw,
  Save,
  Globe,
  Cloud,
  Palette,
  Code,
  TrendingUp,
  Plus,
  Laptop,
  Maximize2,
  RefreshCw,
  Share2,
  Zap,
  Upload,
  Eye,
  Code2,
  Database,
  Github,
  Lock,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconButton } from "./buttons"
import { HoverSidebar } from "./HoverSidebar"


interface NavItem {
  label: string
  href?: string
  children?: { label: string; href: string; description?: string }[]
}

interface HeaderProps {
  logo?: React.ReactNode
  navItems?: NavItem[]
  className?: string
}

const defaultNavItems: NavItem[] = [
  {
    label: "Products",
    href: "#",
    children: [
      { label: "Data Engine", href: "#", description: "Enterprise data solutions" },
      { label: "Generative AI", href: "#", description: "Build AI applications" },
      { label: "Evaluation", href: "#", description: "Test and evaluate models" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "#" },
]

export function ScaleHeader({ logo, navItems = defaultNavItems, className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  // Filter nav items based on authentication
  const filteredNavItems = navItems.map(item => {
    if (item.label === "Dashboard" && !isAuthenticated) {
      return null
    }
    return item
  }).filter(Boolean) as NavItem[]

  // Add Dashboard to nav items if authenticated
  const displayNavItems = isAuthenticated 
    ? [{ label: "Dashboard", href: "/dashboard" }, ...filteredNavItems]
    : filteredNavItems

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <>
      <header className={cn("relative z-50", className)}>
      {/* Announcement Bar */}
      <div className="bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">
              Introducing SEAL Showdown: Real People, Real Conversations, Real Rankings
            </span>
            <a
              href="#"
              className="text-foreground hover:text-muted-foreground transition-colors inline-flex items-center gap-1"
            >
              Visit Now <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              {logo || (
                <Link to="/" className="text-xl font-semibold text-foreground">
                  Prompt<span className="gradient-text">IT</span>
                </Link>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {displayNavItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.href || "#"}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    {item.label}
                    {item.children && <ChevronDown className="w-4 h-4" />}
                  </Link>

                  {/* Dropdown */}
                  {item.children && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-1 w-64 rounded-xl border border-border bg-popover p-2 shadow-lg">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-4 py-3 rounded-lg hover:bg-secondary transition-colors"
                        >
                          <div className="text-sm font-medium text-foreground">{child.label}</div>
                          {child.description && (
                            <div className="text-xs text-muted-foreground mt-0.5">{child.description}</div>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-accent">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user?.email} />
                        <AvatarFallback className="bg-accent text-accent-foreground">
                          {user?.email ? getInitials(user.email) : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.username || user?.email?.split("@")[0]}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/pricing" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Pricing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <ScaleButton 
                    variant="primary" 
                    size="sm" 
                    withArrow 
                    className="hidden sm:inline-flex"
                    onClick={() => navigate("/signup")}
                  >
                    Get Started
                  </ScaleButton>
                  <Link
                    to="/login"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
                  >
                    Log In
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button className="lg:hidden p-2 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {displayNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.href || "#"}
                className="block px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border mt-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={user?.email} />
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        {user?.email ? getInitials(user.email) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user?.username || user?.email?.split("@")[0]}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <ScaleButton variant="ghost" size="md" className="w-full" onClick={handleLogout}>
                    Log Out
                  </ScaleButton>
                </>
              ) : (
                <>
                  <ScaleButton 
                    variant="primary" 
                    size="md" 
                    withArrow 
                    className="w-full"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      navigate("/signup")
                    }}
                  >
                    Get Started
                  </ScaleButton>
                  <ScaleButton 
                    variant="ghost" 
                    size="md" 
                    className="w-full"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      navigate("/login")
                    }}
                  >
                    Log In
                  </ScaleButton>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
      </header>
    </>
  )
}

// Simplified Header variant - Editor Style
export function SimpleHeader({ 
  logo, 
  className,
  projectName,
  projectStatus
}: { 
  logo?: React.ReactNode
  className?: string
  projectName?: string
  projectStatus?: string
}) {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const hideTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    setSidebarVisible(true)
  }

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setSidebarVisible(false)
    }, 200) // Small delay to allow moving mouse to sidebar
  }

  React.useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* Invisible hover zone to reveal the sidebar when moving to the far left */}
      <div
        className="fixed inset-y-0 left-0 w-2 z-40"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-hidden="true"
      />
      <HoverSidebar 
        isVisible={sidebarVisible}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <header className={cn("border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70", className)}>
        <div className="flex items-center justify-between h-14 px-4 md:px-6 gap-4">
          <div 
            className="flex items-center gap-3 min-w-0"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {logo ? (
              <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-secondary text-foreground">
                {logo}
              </div>
            ) : (
              <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 via-fuchsia-500 to-indigo-500 text-background font-semibold">
                b
              </div>
            )}

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">
                  {projectName || "Advanced React NPM Live Editor"}
                </span>
                <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
              <span className="text-xs text-muted-foreground truncate">
                {projectStatus || "Previewing last saved version"}
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center gap-2 text-xs text-muted-foreground flex-1">
            <span>Preview mode</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
            <span>{projectStatus || "Last saved moments ago"}</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <IconButton variant="ghost" size="sm" title="Preview">
              <Eye className="w-4 h-4" />
            </IconButton>
            <div className="hidden md:flex items-center gap-1">
              <IconButton variant="ghost" size="sm" title="Back">
                <ChevronLeft className="w-4 h-4" />
              </IconButton>
              <IconButton variant="ghost" size="sm" title="Forward">
                <ChevronRight className="w-4 h-4" />
              </IconButton>
              <div className="h-4 w-px bg-border mx-1" />
              <IconButton variant="ghost" size="sm" title="Code view">
                <Code2 className="w-4 h-4" />
              </IconButton>
              <IconButton variant="ghost" size="sm" title="Data">
                <Database className="w-4 h-4" />
              </IconButton>
              <IconButton variant="ghost" size="sm" title="Settings">
                <Settings className="w-4 h-4" />
              </IconButton>
            </div>

            <ScaleButton
              variant="secondary"
              size="sm"
              className="bg-muted hover:bg-muted/80 text-foreground"
            >
              Share
            </ScaleButton>
            <ScaleButton
              variant="primary"
              size="sm"
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              Publish
            </ScaleButton>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 focus:outline-none focus:ring-2 focus:ring-accent">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user?.email} />
                      <AvatarFallback className="bg-gradient-to-br from-amber-200 to-amber-400 text-amber-900 font-medium text-xs">
                        {user?.email ? getInitials(user.email) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.username || user?.email?.split("@")[0]}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <ScaleButton variant="ghost" size="sm" onClick={() => navigate("/login")} className="hidden sm:inline-flex">
                Log in
              </ScaleButton>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
