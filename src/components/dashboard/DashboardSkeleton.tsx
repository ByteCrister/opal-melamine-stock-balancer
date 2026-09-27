import { Skeleton } from "@/components/ui/skeleton";
import { SharedBreadcrumb } from "@/components/shared/SharedBreadcrumb";

function KPICardSkeleton({ featured = false }: { featured?: boolean }) {
  if (featured) {
    return (
      <div
        className="relative overflow-hidden p-5 flex flex-col gap-3 group"
        style={{
          borderRadius: "var(--radius-lg)",
          background: "linear-gradient(145deg, #FF3B57 0%, #C41230 55%, #7A0F22 100%)",
          boxShadow: "0 0 0 1px rgba(255,59,87,0.35), 0 8px 32px rgba(227,28,61,0.35), 0 2px 8px rgba(0,0,0,0.25)",
          minHeight: 132,
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}
        />
        <div className="relative z-10 flex items-center justify-between">
          <Skeleton className="h-3.5 w-24 bg-white/20" />
          <Skeleton className="h-9 w-9 rounded-xl bg-white/20" />
        </div>
        <Skeleton className="relative z-10 h-9 w-28 bg-white/30 mt-1" />
        <Skeleton className="relative z-10 h-5 w-20 rounded-full bg-white/20 mt-1" />
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden flex flex-col gap-3 group p-5 transition-all duration-300"
      style={{
        background: "var(--card-bg)",
        backgroundImage: "var(--card-bg-overlay)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--card-shadow)",
        minHeight: 132,
      }}
    >
      <div className="flex items-center justify-between relative z-10">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="h-9 w-24 mt-1 relative z-10" />
      <Skeleton className="h-5 w-16 rounded-full mt-1 relative z-10" />
      
      {/* Decorative gradient corner */}
      <div 
        className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity duration-300 group-hover:opacity-40"
        style={{ background: "var(--gradient-glow)" }}
      />
    </div>
  );
}

function ChartSkeleton({ height = 300, hideHeader = false }: { height?: number, hideHeader?: boolean }) {
  return (
    <div
      className="relative overflow-hidden flex flex-col gap-4 p-5 sm:p-6"
      style={{
        background: "var(--card-bg)",
        backgroundImage: "var(--card-bg-overlay)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      {/* Top subtle sheen */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--border-subtle), transparent)" }}
      />

      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3.5 w-56 max-w-full" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full self-start sm:self-auto" />
        </div>
      )}
      
      <div className="relative z-10 mt-2">
        <Skeleton style={{ height }} className="w-full rounded-xl" />
      </div>
      
      {/* Subtle backdrop glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full blur-[80px] opacity-10"
        style={{ background: "var(--gradient-glow)" }}
      />
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div
      className="flex items-center gap-4 py-3.5 px-2 rounded-md transition-colors"
      style={{ borderBottom: "1px solid var(--table-row-border)" }}
    >
      <Skeleton className="h-4 w-20 shrink-0" />
      <Skeleton className="h-4 w-24 shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-4 w-14 shrink-0 hidden sm:block" />
      <Skeleton className="h-6 w-12 rounded-full shrink-0" />
    </div>
  );
}

/** Full dashboard loading skeleton */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <SharedBreadcrumb items={[{ label: "Dashboard" }]} />

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6 mt-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[38px] w-[200px]" />
          <Skeleton className="h-5 w-[300px] max-w-full" />
        </div>
        <div className="relative flex-shrink-0 self-start w-full sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-[320px] rounded-[var(--radius-md)]" />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-2">
        <div className="col-span-2 sm:col-span-1">
          <KPICardSkeleton featured />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <KPICardSkeleton key={i + 1} />
        ))}
      </div>

      {/* Trend + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartSkeleton height={280} />
        </div>
        <ChartSkeleton height={280} />
      </div>

      {/* Bar charts row */}
      <div className="grid grid-cols-1 gap-4">
        <ChartSkeleton height={320} />
      </div>

      {/* Top movers */}
      <ChartSkeleton height={300} />

      {/* Recent activity */}
      <div
        className="relative overflow-hidden flex flex-col gap-5 p-5 sm:p-6"
        style={{
          background: "var(--card-bg)",
          backgroundImage: "var(--card-bg-overlay)",
          border: "1px solid var(--card-border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        {/* Top subtle sheen */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, var(--border-subtle), transparent)" }}
        />

        <div className="flex items-center gap-3 relative z-10">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-64 max-w-full" />
          </div>
          <Skeleton className="h-8 w-24 rounded-md ml-auto hidden sm:block" />
        </div>
        
        <div className="flex flex-col mt-2 relative z-10">
          {Array.from({ length: 7 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
