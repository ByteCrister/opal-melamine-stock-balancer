"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  icon: LucideIcon;
  featured?: boolean;
  className?: string;
}

function TrendBadge({ change }: { change: number }) {
  if (change === 0) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
        style={{ background: "var(--badge-neutral-bg)", color: "var(--badge-neutral-text)", border: "1px solid var(--badge-neutral-border)" }}
      >
        <Minus className="h-2.5 w-2.5" />
        0%
      </span>
    );
  }
  const isUp = change > 0;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={
        isUp
          ? { background: "var(--badge-success-bg)", color: "var(--badge-success-text)", border: "1px solid var(--badge-success-border)" }
          : { background: "var(--badge-danger-bg)", color: "var(--badge-danger-text)", border: "1px solid var(--badge-danger-border)" }
      }
    >
      {isUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
      {isUp ? "+" : ""}{change}%
    </span>
  );
}

export function KPICard({ title, value, subtitle, change, icon: Icon, featured = false, className }: KPICardProps) {
  if (featured) {
    return (
      <div
        className={cn("relative overflow-hidden rounded-[var(--radius-lg)] p-5 flex flex-col gap-3 group", className)}
        style={{
          background: "linear-gradient(145deg, #FF3B57 0%, #C41230 55%, #7A0F22 100%)",
          boxShadow: "0 0 0 1px rgba(255,59,87,0.35), 0 8px 32px rgba(227,28,61,0.35), 0 2px 8px rgba(0,0,0,0.25)",
        }}
      >
        {/* Top gloss shine */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)" }}
        />
        {/* Inner top glass sheen */}
        <div
          className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)" }}
        />

        <div className="flex items-start justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "rgba(255,255,255,0.70)" }}>
            {title}
          </p>
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(4px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)" }}
          >
            <Icon className="h-4 w-4 text-white" />
          </div>
        </div>

        <p
          className="font-bold leading-none tabular-nums"
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "var(--text-metric-lg)",
            color: "#FFFFFF",
            letterSpacing: "var(--tracking-tight)",
            textShadow: "0 1px 8px rgba(0,0,0,0.25)",
          }}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {change !== undefined && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{
                background: change >= 0 ? "rgba(47,191,113,0.22)" : "rgba(0,0,0,0.20)",
                color: change >= 0 ? "#4DDE8A" : "rgba(255,255,255,0.75)",
                border: change >= 0 ? "1px solid rgba(47,191,113,0.35)" : "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {change >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
              {change >= 0 ? "+" : ""}{change}% vs prev
            </span>
          )}
          {subtitle && !change && (
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.6)" }}>{subtitle}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] p-5 flex flex-col gap-3 group cursor-default",
        "transition-all duration-200",
        className
      )}
      style={{
        background: "var(--card-bg)",
        backgroundImage: "var(--card-bg-overlay)",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--card-shadow)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--card-hover-border)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--card-hover-shadow)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--card-border)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--card-shadow)";
      }}
    >
      {/* Top gloss edge */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 0%, var(--border-strong) 50%, transparent 100%)" }}
      />

      <div className="flex items-start justify-between">
        <p
          className="font-bold uppercase"
          style={{
            fontSize: "var(--text-micro)",
            letterSpacing: "var(--tracking-wider)",
            color: "var(--text-muted)",
          }}
        >
          {title}
        </p>
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200"
          style={{ background: "var(--surface-glass)" }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color: "var(--text-secondary)" }} />
        </div>
      </div>

      <p
        className="font-bold leading-none tabular-nums"
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "var(--text-metric-lg)",
          color: "var(--metric-value-color)",
          letterSpacing: "var(--tracking-tight)",
        }}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        {change !== undefined && <TrendBadge change={change} />}
        {subtitle && (
          <span style={{ fontSize: "var(--text-micro)", color: "var(--text-muted)" }}>{subtitle}</span>
        )}
      </div>
    </div>
  );
}
