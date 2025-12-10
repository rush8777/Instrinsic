import type React from "react"
import { cn } from "@/lib/utils"
import { Twitter, Linkedin, Github, Youtube } from "lucide-react"

interface FooterLink {
  label: string
  href: string
}

interface FooterColumn {
  title: string
  links: FooterLink[]
}

interface FooterProps {
  logo?: React.ReactNode
  columns?: FooterColumn[]
  className?: string
}

const defaultColumns: FooterColumn[] = [
  {
    title: "Products",
    links: [
      { label: "Data Engine", href: "#" },
      { label: "Generative AI", href: "#" },
      { label: "Evaluation", href: "#" },
      { label: "Government", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Case Studies", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
]

export function ScaleFooter({ logo, columns = defaultColumns, className }: FooterProps) {
  return (
    <footer className={cn("border-t border-border bg-background", className)}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1">
            {logo || (
              <a href="/" className="text-xl font-semibold text-foreground">
                Prompt<span className="gradient-text">IT</span>
              </a>
            )}
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Accelerate the development of AI applications with enterprise-grade data infrastructure.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Youtube className="w-5 h-5" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-medium text-foreground mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PromptIT, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Minimal Footer variant
export function MinimalFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t border-border bg-background", className)}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <a href="/" className="text-lg font-semibold text-foreground">
            Prompt<span className="gradient-text">IT</span>
          </a>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PromptIT, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
