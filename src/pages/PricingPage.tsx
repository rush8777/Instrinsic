"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Check, Flame } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

// Scale AI Components
import { ScaleHeader } from "@/components/scale/header"
import { ScaleFooter } from "@/components/scale/footer"
import { H1, H3, Body, Caption } from "@/components/scale/typography"
import { ScaleButton } from "@/components/scale/buttons"
import { ScaleCard, HighlightCard } from "@/components/scale/cards"
import { ScaleBadge } from "@/components/scale/badges"
import { NetworkAnimation } from "@/components/scale/NetworkAnimation"

// Billing Toggle Component
function BillingToggle({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-2 p-1.5 rounded-full bg-muted/50 border border-border">
      <ScaleButton
        variant={value === "monthly" ? "primary" : "ghost"}
        size="sm"
        onClick={() => onChange("monthly")}
        className={value !== "monthly" ? "text-muted-foreground" : ""}
      >
        Monthly
      </ScaleButton>
      <ScaleButton
        variant={value === "yearly" ? "primary" : "ghost"}
        size="sm"
        onClick={() => onChange("yearly")}
        className={value !== "yearly" ? "text-muted-foreground" : ""}
      >
        Yearly (Save 30%)
      </ScaleButton>
    </div>
  )
}

// Feature Item Component
function FeatureItem({
  children,
  highlighted = false,
}: {
  children: React.ReactNode
  highlighted?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center justify-center w-5 h-5 rounded-full ${highlighted ? "bg-accent/20" : "bg-muted"}`}
      >
        <Check className={`w-3 h-3 ${highlighted ? "text-accent" : "text-muted-foreground"}`} />
      </div>
      <Body className="text-muted-foreground">{children}</Body>
    </div>
  )
}

// Pricing Card Component
function PricingCard({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  buttonVariant = "secondary",
  highlighted = false,
  dark = false,
}: {
  title: string
  price: string
  period?: string
  description: string
  features: string[]
  buttonText: string
  buttonVariant?: "primary" | "secondary" | "outline"
  highlighted?: boolean
  dark?: boolean
}) {
  if (dark) {
    return (
      <div className="flex flex-col gap-6 p-6 rounded-xl bg-neutral-900 border border-neutral-800 h-full">
        <div className="flex flex-col gap-4">
          <H3 className="text-white">{title}</H3>
          <div className="flex flex-col gap-1">
            <span className="text-4xl font-bold text-white">{price}</span>
            {period && <Caption className="text-neutral-400">{period}</Caption>}
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <Body className="text-neutral-400">{description}</Body>
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-800">
                <Check className="w-3 h-3 text-neutral-400" />
              </div>
              <Body className="text-neutral-400">{feature}</Body>
            </div>
          ))}
        </div>

        <ScaleButton variant="outline" withArrow className="w-full border-neutral-700 text-white hover:bg-neutral-800">
          {buttonText}
        </ScaleButton>
      </div>
    )
  }

  if (highlighted) {
    return (
      <HighlightCard className="h-full">
        <div className="relative flex flex-col gap-6 h-full overflow-hidden rounded-xl">
          <NetworkAnimation className="opacity-50" />
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <H3>{title}</H3>
                <ScaleBadge variant="success" className="bg-accent/20 text-accent border-accent/30">
                  <Flame className="w-3 h-3 mr-1" />
                  Most Popular
                </ScaleBadge>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-4xl font-bold text-foreground">{price}</span>
                {period && <Caption>{period}</Caption>}
              </div>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <Body className="text-muted-foreground">{description}</Body>
              {features.map((feature, index) => (
                <FeatureItem key={index} highlighted>
                  {feature}
                </FeatureItem>
              ))}
            </div>
            <ScaleButton variant="primary" withArrow className="w-full">
              {buttonText}
            </ScaleButton>
          </div>
        </div>
      </HighlightCard>
    )
  }

  return (
    <ScaleCard className="flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-4">
        <H3>{title}</H3>
        <div className="flex flex-col gap-1">
          <span className="text-4xl font-bold text-foreground">{price}</span>
          {period && <Caption>{period}</Caption>}
        </div>
      </div>
      <div className="flex flex-col gap-4 flex-1">
        <Body className="text-muted-foreground">{description}</Body>
        {features.map((feature, index) => (
          <FeatureItem key={index}>{feature}</FeatureItem>
        ))}
      </div>
      <ScaleButton variant="secondary" withArrow className="w-full">
        {buttonText}
      </ScaleButton>
    </ScaleCard>
  )
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState("monthly")
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await api.getPlans()
        // Transform API data to match component format
        const transformedPlans = (data as any[]).map((plan: any) => ({
          id: plan.id,
          title: plan.name,
          price: billingPeriod === "monthly" 
            ? (parseFloat(plan.price_monthly) === 0 ? "Free" : `$${plan.price_monthly}`)
            : (parseFloat(plan.price_yearly) === 0 ? "Free" : `$${plan.price_yearly}`),
          period: billingPeriod === "monthly" 
            ? (parseFloat(plan.price_monthly) === 0 ? "" : "Per month/user")
            : (parseFloat(plan.price_yearly) === 0 ? "" : "Per year/user"),
          description: plan.description || "Great plan",
          features: plan.features || [],
          buttonText: plan.slug === "enterprise" ? "Contact us" : "Get started",
          buttonVariant: plan.slug === "teams" ? "primary" as const : "secondary" as const,
          highlighted: plan.slug === "teams",
          dark: plan.slug === "enterprise",
        }))
        setPlans(transformedPlans)
      } catch (error: any) {
        console.error("Failed to load pricing plans:", error)
        // Fallback to default plans (static data)
        const defaultPlans = [
    {
      title: "Individuals",
      price: "Free",
      description: "For your hobby projects",
      features: ["Free email alerts", "3-minute checks", "Automatic data enrichment", "10 monitors", "Up to 3 seats"],
      buttonText: "Get started",
      buttonVariant: "secondary" as const,
    },
    {
      title: "Teams",
      price: billingPeriod === "monthly" ? "$90" : "$756",
      period: billingPeriod === "monthly" ? "Per month/user" : "Per year/user",
      description: "Great for small businesses",
      features: ["Unlimited phone calls", "30 second checks", "Single-user account", "20 monitors", "Up to 6 seats"],
      buttonText: "Get started",
      buttonVariant: "primary" as const,
      highlighted: true,
    },
    {
      title: "Organizations",
      price: billingPeriod === "monthly" ? "$120" : "$1,008",
      period: billingPeriod === "monthly" ? "Per month/user" : "Per year/user",
      description: "Great for large businesses",
      features: ["Unlimited phone calls", "15 second checks", "Single-user account", "50 monitors", "Up to 10 seats"],
      buttonText: "Get started",
      buttonVariant: "secondary" as const,
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: "For multiple teams",
      features: [
        "Everything in Organizations",
        "Up to 5 team members",
        "100 monitors",
        "15 status pages",
        "200+ integrations",
      ],
      buttonText: "Contact us",
      buttonVariant: "outline" as const,
      dark: true,
    },
        ]
        setPlans(defaultPlans)
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [billingPeriod])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <ScaleHeader />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center gap-12 px-6 md:px-12 py-16 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-6 max-w-xl text-center">
          <div className="flex flex-col items-center gap-3">
            <H1>Simple Pricing</H1>
            <Body className="text-muted-foreground text-lg">Choose the best plan for your needs</Body>
          </div>
          <BillingToggle value={billingPeriod} onChange={setBillingPeriod} />
        </div>

        {/* Pricing Cards Grid */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading plans...</div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              price={plan.price}
              period={plan.period}
              description={plan.description}
              features={plan.features}
              buttonText={plan.buttonText}
              buttonVariant={plan.buttonVariant}
              highlighted={plan.highlighted}
              dark={plan.dark}
            />
            ))}
          </div>
        )}

        {/* FAQ Teaser */}
        <div className="flex flex-col items-center gap-4 pt-8">
          <Body className="text-muted-foreground">Have questions? Check out our FAQ or contact support.</Body>
          <ScaleButton variant="link" withArrow>
            View FAQ
          </ScaleButton>
        </div>
      </main>

      {/* Bottom Spacer */}
      <div className="min-h-[80px]" />

      {/* Footer */}
      <ScaleFooter />
    </div>
  )
}
