import { ScaleHeader } from "@/components/scale/header";
import { ScaleFooter } from "@/components/scale/footer";
import { ScaleButton } from "@/components/scale/buttons";
import { FeatureCard, StatsCard, HighlightCard, GlassCard } from "@/components/scale/cards";
import { ScaleBadge } from "@/components/scale/badges";
import { Section, CTASection } from "@/components/scale/sections";
import { H2, BodyLarge, Overline } from "@/components/scale/typography";
import { 
  Sparkles, 
  Zap, 
  Shield, 
  BarChart3, 
  Globe, 
  Cpu,
  ArrowRight,
  Play
} from "lucide-react";
import { NetworkAnimation } from "@/components/scale/NetworkAnimation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScaleHeader />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse-glow animation-delay-200" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="opacity-0 animate-fade-in-up">
              <ScaleBadge variant="gradient" className="mb-6">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Now Available: GPT-5 Integration
              </ScaleBadge>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1] mb-6 opacity-0 animate-fade-in-up animation-delay-200">
              Build the future with{" "}
              <span className="gradient-text">intelligent AI</span>
            </h1>
            
            <BodyLarge className="mb-10 max-w-2xl mx-auto opacity-0 animate-fade-in-up animation-delay-400">
              Enterprise-grade AI infrastructure that scales with your ambitions. 
              Train, deploy, and optimize models with unprecedented efficiency.
            </BodyLarge>
            
            <div className="flex flex-wrap items-center justify-center gap-4 opacity-0 animate-fade-in-up animation-delay-600">
              <ScaleButton variant="primary" size="lg" withArrow>
                Start Building Free
              </ScaleButton>
              <ScaleButton variant="outline" size="lg">
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </ScaleButton>
            </div>
          </div>
          
          {/* Hero Visual */}
          <div className="mt-16 relative">
            <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
              {/* Left - Network Animation */}
              <GlassCard className="overflow-hidden p-0 aspect-square max-w-sm">
                <NetworkAnimation className="rounded-xl" />
              </GlassCard>
              
              {/* Right - Text Content */}
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-medium text-foreground">
                  Intelligent Neural Networks
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our advanced neural network architecture adapts in real-time, learning from billions of data points to deliver unprecedented accuracy. Watch as connections form and evolve, mirroring the dynamic nature of human thought.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Built on cutting-edge transformer technology, Scale AI processes complex patterns across multiple domains simultaneously, enabling breakthrough performance in natural language, vision, and multimodal understanding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="text-sm text-muted-foreground text-center mb-8">
            Trusted by leading enterprises worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
            {["OpenAI", "Microsoft", "Google", "Amazon", "Meta", "NVIDIA"].map((company) => (
              <span key={company} className="text-lg font-medium text-muted-foreground">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Section>
        <div className="text-center mb-16">
          <Overline>Capabilities</Overline>
          <H2 className="mb-4">Everything you need to build with AI</H2>
          <BodyLarge className="max-w-2xl mx-auto">
            From data preparation to model deployment, we provide the complete toolkit for AI development at scale.
          </BodyLarge>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Zap className="w-5 h-5 text-foreground" />}
            title="Lightning Fast Training"
            description="Reduce training time by up to 10x with our optimized infrastructure and distributed computing capabilities."
          />
          <FeatureCard
            icon={<Shield className="w-5 h-5 text-foreground" />}
            title="Enterprise Security"
            description="SOC 2 Type II certified with end-to-end encryption and comprehensive audit logging for compliance."
          />
          <FeatureCard
            icon={<BarChart3 className="w-5 h-5 text-foreground" />}
            title="Real-time Analytics"
            description="Monitor model performance, track metrics, and gain insights with our comprehensive analytics dashboard."
          />
          <FeatureCard
            icon={<Globe className="w-5 h-5 text-foreground" />}
            title="Global Infrastructure"
            description="Deploy models across 50+ regions worldwide with automatic failover and edge optimization."
          />
          <FeatureCard
            icon={<Sparkles className="w-5 h-5 text-foreground" />}
            title="Auto Model Optimization"
            description="Our AI automatically optimizes your models for inference speed and cost efficiency."
          />
          <FeatureCard
            icon={<Cpu className="w-5 h-5 text-foreground" />}
            title="Custom Hardware"
            description="Access to the latest GPU clusters including H100s, TPUs, and custom AI accelerators."
          />
        </div>
      </Section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 border-y border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatsCard value="50B+" label="API Calls Monthly" />
            <StatsCard value="99.99%" label="Uptime SLA" />
            <StatsCard value="10,000+" label="Enterprise Customers" />
            <StatsCard value="<100ms" label="Average Latency" />
          </div>
        </div>
      </section>

      {/* Highlight Feature Section */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Overline>Data Engine</Overline>
            <H2 className="mb-6">The foundation for world-class AI</H2>
            <BodyLarge className="mb-8">
              Our Data Engine combines human expertise with machine learning to create the highest quality training data at scale. Accelerate your AI development with data you can trust.
            </BodyLarge>
            <ul className="space-y-4 mb-8">
              {[
                "Human-in-the-loop data labeling",
                "Automated quality assurance",
                "Custom annotation workflows",
                "Real-time collaboration tools"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  {item}
                </li>
              ))}
            </ul>
            <ScaleButton variant="outline" withArrow>
              Explore Data Engine
            </ScaleButton>
          </div>
          
          <HighlightCard className="h-full">
            <div className="aspect-square bg-gradient-to-br from-violet-500/10 via-transparent to-blue-500/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-secondary mb-4">
                  <Sparkles className="w-8 h-8 text-foreground" />
                </div>
                <p className="text-muted-foreground">Data Pipeline Visualization</p>
              </div>
            </div>
          </HighlightCard>
        </div>
      </Section>

      {/* CTA Section */}
      <CTASection
        overline="Get Started Today"
        title="Ready to transform your AI development?"
        description="Join thousands of teams building the future with our enterprise AI platform."
        cta={{ label: "Start Free Trial" }}
        className="border-t border-border"
      />

      <ScaleFooter />
    </div>
  );
};

export default Index;
