// src/components/dashboard/DashboardSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { SharedBreadcrumb } from "@/components/shared/SharedBreadcrumb";

function KPICardSkeleton() {
  return (
    <div className="glass-panel p-5 flex flex-col gap-3 min-h-[120px]">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-9 w-36" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div className="glass-panel p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <Skeleton style={{ height }} className="w-full rounded-lg" />
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-border/40 last:border-0">
      <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-6 w-12 rounded-full" />
    </div>
  );
}

/** Full dashboard loading skeleton */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <SharedBreadcrumb items={[{ label: "Dashboard" }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-48 rounded-lg" />
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartSkeleton height={280} />
        </div>
        <ChartSkeleton height={280} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-panel p-5">
          <Skeleton className="h-5 w-40 mb-4" />
          {Array.from({ length: 8 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
        <div className="glass-panel p-5">
          <Skeleton className="h-5 w-40 mb-4" />
          {Array.from({ length: 8 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
