import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import { Overline, H2, BodyLarge } from "./typography"
import { ScaleButton } from "./buttons"
import { TextHoverEffect } from "@/components/ui/text-hover-effect"

interface SectionProps {
  children: ReactNode
  className?: string
}

// Base Section wrapper
export function Section({ children, className }: SectionProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">{children}</div>
    </section>
  )
}

// Hero Section
interface HeroSectionProps {
  overline?: string
  title: ReactNode
  description: string
  primaryCta?: { label: string; href?: string }
  secondaryCta?: { label: string; href?: string }
  className?: string
}

export function HeroSection({ overline, title, description, primaryCta, secondaryCta, className }: HeroSectionProps) {
  return (
    <section className={cn("pt-20 pb-16 md:pt-32 md:pb-24", className)}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="max-w-3xl">
          {overline && <Overline>{overline}</Overline>}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1] mb-6">{title}</h1>
          <BodyLarge className="mb-8 max-w-xl">{description}</BodyLarge>
          <div className="flex flex-wrap items-center gap-4">
            {primaryCta && (
              <ScaleButton variant="outline" size="lg" withArrow>
                {primaryCta.label}
              </ScaleButton>
            )}
            {secondaryCta && (
              <ScaleButton variant="link" withArrow>
                {secondaryCta.label}
              </ScaleButton>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// CTA Section
interface CTASectionProps {
  overline?: string
  title: string
  description?: string
  cta?: { label: string; href?: string }
  className?: string
}

export function CTASection({ overline, title, description, cta, className }: CTASectionProps) {
  return (
    <section className={cn("relative py-16 md:py-24 text-center overflow-hidden", className)}>
      {/* Background Text Hover Effect */}
      <TextHoverEffect 
        text="BUILD" 
        variant="background" 
        duration={0.15}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          {overline && <Overline className="mb-4">{overline}</Overline>}
          <H2 className="mb-4">{title}</H2>
          {description && <BodyLarge className="mb-8">{description}</BodyLarge>}
          {cta && (
            <ScaleButton variant="outline" size="lg" withArrow>
              {cta.label}
            </ScaleButton>
          )}
        </div>
      </div>
    </section>
  )
}

// Logos Section
interface LogosSectionProps {
  title?: string
  logos: { name: string; logo: ReactNode }[]
  className?: string
}

export function LogosSection({ title, logos, className }: LogosSectionProps) {
  return (
    <section className={cn("py-12 md:py-16 border-t border-border", className)}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {title && <p className="text-sm text-muted-foreground text-center mb-8">{title}</p>}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {logos.map((item) => (
            <div key={item.name} className="text-muted-foreground hover:text-foreground transition-colors">
              {item.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Feature List Section
interface FeatureListItem {
  title: string
  description: string
}

interface FeatureListSectionProps {
  overline?: string
  title: string
  features: FeatureListItem[]
  className?: string
}

export function FeatureListSection({ overline, title, features, className }: FeatureListSectionProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            {overline && <Overline>{overline}</Overline>}
            <H2>{title}</H2>
          </div>
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="border-t border-border pt-6">
                <h4 className="text-lg font-medium text-foreground mb-2">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
