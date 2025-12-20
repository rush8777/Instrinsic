import { Skeleton } from "@/components/ui/skeleton";

export function ProjectEditorSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Sticky Header Skeleton */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between h-14 px-4 md:px-6">
          {/* Left Side */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Skeleton className="w-8 h-8 rounded-md flex-shrink-0" />
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="w-8 h-8 rounded-md" />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Skeleton */}
          <div className="hidden md:flex flex-col bg-muted/30 border-r border-border w-64">
            {/* Sidebar Header */}
            <div className="flex items-center gap-2 p-3">
              <Skeleton className="w-5 h-5 rounded-md" />
              <Skeleton className="h-5 w-24 flex-1" />
              <Skeleton className="w-8 h-8 rounded-md ml-auto" />
            </div>

            {/* Search Skeleton */}
            <div className="px-2 pb-2">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>

            {/* Tree View Skeleton */}
            <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-2 p-2">
                  <Skeleton className="w-4 h-4 rounded-sm" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area Skeleton */}
          <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Title Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>

                {/* Content Skeleton */}
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  ))}
                </div>

                {/* Code Block Skeleton */}
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

