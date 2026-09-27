import { SharedBreadcrumb } from "@/components/shared/SharedBreadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Scale } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col gap-6 p-4 md:p-8 pt-6">
      {/* Breadcrumb */}
      <SharedBreadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Stock Balancer" },
        ]}
      />

      {/* Page Header skeleton */}
      <div className="flex items-center gap-4 mt-2">
        <div
          className="relative h-12 w-12 rounded-[12px] flex items-center justify-center shrink-0 overflow-hidden"
          style={{
            backgroundImage: "var(--gradient-primary-button)",
            boxShadow: "var(--glow-primary-cta)",
          }}
        >
          <div className="absolute inset-0 opacity-20 bg-white" />
          <Scale className="relative z-10 h-5 w-5 text-white/50" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
      </div>

      {/* KPI Cards skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-[var(--radius-lg)] p-4 flex items-center gap-4"
            style={{
              background: "var(--card-bg)",
              backgroundImage: "var(--card-bg-overlay)",
              border: "1px solid var(--card-border)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            {/* Top sheen */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, var(--border-subtle), transparent)" }}
            />
            
            <Skeleton className="h-11 w-11 rounded-[10px] shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            
            {/* Subtle glow */}
            <div 
              className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-xl opacity-10"
              style={{ background: "var(--gradient-glow)" }}
            />
          </div>
        ))}
      </div>

      {/* Toolbar skeleton */}
      <div
        className="relative overflow-hidden flex items-center gap-3 p-3 rounded-[var(--radius-lg)]"
        style={{
          background: "var(--card-bg)",
          backgroundImage: "var(--card-bg-overlay)",
          border: "1px solid var(--card-border)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <Skeleton className="h-9 w-full sm:w-80 rounded-[var(--input-radius)]" />
        <Skeleton className="h-9 w-28 rounded-[9px] ml-auto hidden sm:block" />
      </div>

      {/* Table skeleton */}
      <div
        className="relative overflow-hidden rounded-[var(--radius-lg)] flex flex-col"
        style={{
          background: "var(--card-bg)",
          backgroundImage: "var(--card-bg-overlay)",
          border: "1px solid var(--card-border)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <div className="flex items-center gap-4 py-4 px-6 border-b" style={{ borderColor: "var(--table-header-border)", background: "var(--table-header-bg)" }}>
          <Skeleton className="h-4 w-20 shrink-0" />
          <Skeleton className="h-4 w-32 shrink-0" />
          <Skeleton className="h-4 w-24 shrink-0 hidden sm:block" />
          <div className="flex-1" />
          <Skeleton className="h-4 w-16 shrink-0" />
          <Skeleton className="h-4 w-16 shrink-0 ml-4" />
          <Skeleton className="h-4 w-16 shrink-0 ml-4" />
        </div>
        
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-4 px-6 border-b" style={{ borderColor: "var(--table-row-border)" }}>
            <Skeleton className="h-4 w-16 shrink-0" />
            <Skeleton className="h-4 w-40 shrink-0" />
            <Skeleton className="h-4 w-28 shrink-0 hidden sm:block" />
            <div className="flex-1" />
            <Skeleton className="h-4 w-12 shrink-0" />
            <Skeleton className="h-4 w-12 shrink-0 ml-8" />
            <Skeleton className="h-4 w-16 shrink-0 ml-8" />
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div
        className="flex items-center justify-between px-5 py-4 rounded-[var(--radius-lg)] relative overflow-hidden"
        style={{
          background: "var(--card-bg)",
          backgroundImage: "var(--card-bg-overlay)",
          border: "1px solid var(--card-border)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <Skeleton className="h-4 w-40" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-[7px]" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-8 w-8 rounded-[7px]" />
        </div>
      </div>
    </div>
  );
}
