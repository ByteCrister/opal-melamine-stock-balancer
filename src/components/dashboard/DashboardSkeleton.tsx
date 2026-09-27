import { Skeleton } from "@/components/ui/skeleton";
import { SharedBreadcrumb } from "@/components/shared/SharedBreadcrumb";

function KPICardSkeleton() {
  return (
    <div
      className="flex flex-col gap-3"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--card-shadow)",
        padding: "20px",
        minHeight: 120,
      }}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-9 w-28" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  );
}

function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div
      className="flex flex-col gap-4"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--card-shadow)",
        padding: "20px",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4.5 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>
      <Skeleton style={{ height }} className="w-full rounded-lg" />
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div
      className="flex items-center gap-4 py-3"
      style={{ borderBottom: "1px solid var(--table-row-border)" }}
    >
      <Skeleton className="h-3.5 w-16 shrink-0" />
      <Skeleton className="h-3.5 w-20 shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-3.5 w-36" />
      </div>
      <Skeleton className="h-3.5 w-12" />
      <Skeleton className="h-5 w-10 rounded-full shrink-0" />
    </div>
  );
}

/** Full dashboard loading skeleton */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <SharedBreadcrumb items={[{ label: "Dashboard" }]} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-56 rounded-[var(--radius-md)]" />
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>

      {/* Trend + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartSkeleton height={300} />
        </div>
        <ChartSkeleton height={300} />
      </div>

      {/* Bar charts row */}
      <div className="grid grid-cols-1 gap-4">
        <ChartSkeleton height={280} />
      </div>

      {/* Top movers */}
      <ChartSkeleton height={260} />

      {/* Recent activity */}
      <div
        className="flex flex-col gap-4"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: "var(--radius-lg)",
          padding: "20px",
        }}
      >
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-4.5 w-36" />
          <Skeleton className="h-5 w-16 rounded-full ml-auto" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
