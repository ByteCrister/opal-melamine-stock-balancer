"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number; // percentage change (positive/negative)
  icon: LucideIcon;
  featured?: boolean; // makes the card the "hero" crimson card
  className?: string;
}

function TrendBadge({ change }: { change: number }) {
  if (change === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: "var(--color-graphite-400)" }}>
        <Minus className="h-3 w-3" />
        0%
      </span>
    );
  }

  const isUp = change > 0;
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-medium"
      style={{ color: isUp ? "var(--color-status-success)" : "var(--color-status-danger)" }}
    >
      {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {isUp ? "+" : ""}{change}%
    </span>
  );
}

/**
 * KPI card for the dashboard.
 * `featured` variant uses the metricAccent gradient (one glossy hero moment).
 */
export function KPICard({ title, value, subtitle, change, icon: Icon, featured = false, className }: KPICardProps) {
  if (featured) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-md)] p-5 flex flex-col gap-3",
          className
        )}
        style={{
          background: "linear-gradient(135deg, #E31C3D 0%, #3D0A14 100%)",
          boxShadow: "0 0 0 1px rgba(255,59,87,0.3), 0 8px 24px rgba(227,28,61,0.3)",
        }}
      >
        {/* Top gloss edge */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
        />

        <div className="flex items-center justify-between">
          <p className="text-[12.5px] font-medium uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.7)" }}>
            {title}
          </p>
          <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        </div>

        <p
          className="font-bold leading-none"
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "var(--text-metric-lg)",
            color: "#FFFFFF",
            letterSpacing: "var(--tracking-tight)",
          }}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>

        <div className="flex items-center gap-2">
          {change !== undefined && (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-medium"
              style={{ color: change >= 0 ? "rgba(47,191,113,0.9)" : "rgba(255,255,255,0.7)" }}
            >
              {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {change >= 0 ? "+" : ""}{change}% vs prev period
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
    <div className={cn("glass-panel p-5 flex flex-col gap-3 group hover:border-border transition-all duration-200", className)}>
      <div className="flex items-center justify-between">
        <p
          className="font-medium uppercase tracking-wide"
          style={{
            fontSize: "var(--text-label)",
            color: "var(--text-secondary)",
            lineHeight: "var(--leading-label)",
          }}
        >
          {title}
        </p>
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: "var(--surface-overlay)" }}
        >
          <Icon className="h-4 w-4" style={{ color: "var(--text-secondary)" }} />
        </div>
      </div>

      <p
        className="font-semibold leading-none"
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "var(--text-metric-lg)",
          color: "var(--text-primary)",
          letterSpacing: "var(--tracking-tight)",
        }}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        {change !== undefined && <TrendBadge change={change} />}
        {subtitle && (
          <span style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)" }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
