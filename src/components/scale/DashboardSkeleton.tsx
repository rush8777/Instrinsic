import { Skeleton } from "@/components/ui/skeleton";
import { ScaleCard, HighlightCard } from "@/components/scale/cards";
import { ScaleHeader } from "@/components/scale/header";
import { ScaleFooter } from "@/components/scale/footer";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ScaleHeader />

      <div className="flex-1 flex flex-col gap-12 px-6 md:px-12 py-12 pb-24 max-w-7xl mx-auto w-full">
        {/* Header Skeleton */}
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-10 w-64 flex-1 min-w-[200px]" />
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-16" />
              <div className="w-px h-6 bg-border" />
              <div className="flex items-center gap-1">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-7 w-12" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Welcome Banner Skeleton */}
        <div className="relative flex flex-wrap items-center gap-4 rounded-xl overflow-hidden p-5 md:p-6 bg-gradient-to-r from-accent/20 via-purple-500/10 to-accent/15">
          <div className="relative z-10 flex flex-1 min-w-[200px] flex-col gap-2 py-2 pr-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48 mt-1" />
            </div>
          </div>
          <HighlightCard className="flex-1 min-w-[160px]">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
          </HighlightCard>
          <HighlightCard className="flex-1 min-w-[160px]">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-9 w-full" />
            </div>
          </HighlightCard>
          <HighlightCard className="flex-1 min-w-[160px]">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          </HighlightCard>
        </div>

        {/* Projects Section Skeleton */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-40 flex-1" />
            <Skeleton className="h-6 w-20" />
          </div>

          {/* Projects Grid - Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <ScaleCard key={i} className="flex flex-col gap-4 p-4">
                <div className="flex items-start gap-2">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex flex-1 items-center justify-end gap-1">
                    <Skeleton className="w-8 h-8 rounded-md" />
                    <Skeleton className="w-8 h-8 rounded-md" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </ScaleCard>
            ))}
          </div>

          {/* Projects Grid - Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <ScaleCard key={i} className="flex flex-col gap-4 p-4">
                <div className="flex items-start gap-2">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex flex-1 items-center justify-end gap-1">
                    <Skeleton className="w-8 h-8 rounded-md" />
                    <Skeleton className="w-8 h-8 rounded-md" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </ScaleCard>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-[120px]" />
      </div>

      <ScaleFooter />
    </div>
  );
}

