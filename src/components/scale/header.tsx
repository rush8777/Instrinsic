import type React from "react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { ScaleButton } from "./buttons"
import { Menu, X, ChevronDown } from "lucide-react"

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
  { label: "Leaderboards", href: "#" },
  { label: "Enterprise", href: "#" },
  { label: "Government", href: "#" },
  { label: "Customers", href: "#" },
  { label: "Resources", href: "#" },
]

export function ScaleHeader({ logo, navItems = defaultNavItems, className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
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
                <a href="/" className="text-xl font-semibold text-foreground">
                  Prompt<span className="gradient-text">IT</span>
                </a>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a
                    href={item.href}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    {item.label}
                    {item.children && <ChevronDown className="w-4 h-4" />}
                  </a>

                  {/* Dropdown */}
                  {item.children && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-1 w-64 rounded-xl border border-border bg-popover p-2 shadow-lg">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-3 rounded-lg hover:bg-secondary transition-colors"
                        >
                          <div className="text-sm font-medium text-foreground">{child.label}</div>
                          {child.description && (
                            <div className="text-xs text-muted-foreground mt-0.5">{child.description}</div>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <ScaleButton variant="primary" size="sm" withArrow className="hidden sm:inline-flex">
                Get Started
              </ScaleButton>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                Log In
              </a>

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
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-border mt-4 space-y-3">
              <ScaleButton variant="primary" size="md" withArrow className="w-full">
                Get Started
              </ScaleButton>
              <ScaleButton variant="ghost" size="md" className="w-full">
                Log In
              </ScaleButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

// Simplified Header variant
export function SimpleHeader({ logo, className }: { logo?: React.ReactNode; className?: string }) {
  return (
    <header className={cn("border-b border-border bg-background", className)}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {logo || (
            <a href="/" className="text-xl font-semibold text-foreground">
              Prompt<span className="gradient-text">IT</span>
            </a>
          )}
          <div className="flex items-center gap-4">
            <ScaleButton variant="primary" size="sm" withArrow>
              Get Started
            </ScaleButton>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Log In
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
