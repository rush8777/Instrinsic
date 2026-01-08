"use client";

import { Box, Lock, Search, Settings, Sparkles, Zap, Shield, BarChart3, Globe, Cpu } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CapabilityItem {
  icon: ReactNode;
  title: string;
  description: string;
  area?: string;
}

interface CapabilitiesGridProps {
  items: CapabilityItem[];
  className?: string;
}

export function CapabilitiesGrid({ items, className }: CapabilitiesGridProps) {
  return (
    <ul className={cn(
      "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
      className
    )}>
      {items.map((item, index) => (
        <GridItem
          key={index}
          icon={item.icon}
          title={item.title}
          description={item.description}
        />
      ))}
    </ul>
  );
}

interface GridItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const GridItem = ({ icon, title, description }: GridItemProps) => {
  return (
    <li className="min-h-[14rem] list-none">
      <div className="relative h-full rounded-xl border border-border bg-card p-2 hover:border-muted-foreground/30 transition-colors">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          movementDuration={2}
          borderWidth={1}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-lg border-0 bg-card p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            {icon && (
              <div className="w-fit rounded-lg border border-border bg-secondary p-2">
                {icon}
              </div>
            )}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-foreground leading-tight">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

