"use client";

import { useState } from "react";
import { DashboardDateFilter, ComparisonPeriod } from "@/types/dashboard.types";
import { PRESET_PERIODS } from "@/const/dashboard.const";
import { Calendar, ChevronDown, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateFilterBarProps {
  value: DashboardDateFilter;
  onChange: (filter: DashboardDateFilter) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function DateFilterBar({ value, onChange, onRefresh, isLoading }: DateFilterBarProps) {
  const [activePeriod, setActivePeriod] = useState<ComparisonPeriod>("30d");
  const [showCustom, setShowCustom] = useState(false);
  const [customFrom, setCustomFrom] = useState<string>(format(value.from, "yyyy-MM-dd"));
  const [customTo, setCustomTo]     = useState<string>(format(value.to,   "yyyy-MM-dd"));
  const [dateError, setDateError]   = useState<string | null>(null);

  function applyPreset(period: ComparisonPeriod) {
    const preset = PRESET_PERIODS.find((p) => p.value === period);
    if (!preset) return;
    setActivePeriod(period);
    setShowCustom(false);
    setDateError(null);
    onChange(preset.getRange());
  }

  function applyCustom() {
    if (!customFrom || !customTo) { setDateError("Both dates are required."); return; }
    const from = new Date(customFrom + "T00:00:00");
    const to   = new Date(customTo   + "T23:59:59.999");
    if (isNaN(from.getTime()) || isNaN(to.getTime())) { setDateError("Invalid date format."); return; }
    if (from > to) { setDateError("Start date must be before end date."); return; }
    if (to.getTime() - from.getTime() > 365 * 86400 * 1000) { setDateError("Range cannot exceed 1 year."); return; }
    setDateError(null);
    setActivePeriod("custom");
    setShowCustom(false);
    onChange({ from, to });
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5 flex-wrap">

      {/* ── Preset Pills ─────────────────────────────────────────── */}
      <div
        className="flex items-center gap-0.5 p-1 rounded-[var(--radius-md)]"
        style={{
          background: "var(--surface-overlay)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--elevation-1)",
        }}
        role="group"
        aria-label="Date period presets"
      >
        {PRESET_PERIODS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => applyPreset(preset.value)}
            className={cn(
              "px-3 py-1.5 rounded-[var(--radius-sm)] font-medium transition-all duration-150 whitespace-nowrap",
              activePeriod === preset.value ? "text-white" : "hover:text-foreground"
            )}
            style={{
              fontSize: "var(--text-label)",
              color: activePeriod === preset.value ? "#FFFFFF" : "var(--text-secondary)",
              ...(activePeriod === preset.value
                ? { background: "var(--gradient-primary-button)", boxShadow: "0 1px 6px rgba(227,28,61,0.35)" }
                : {}),
            }}
            aria-pressed={activePeriod === preset.value}
          >
            {preset.label}
          </button>
        ))}

        {/* Custom toggle */}
        <button
          onClick={() => setShowCustom((v) => !v)}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] font-medium transition-all duration-150",
            activePeriod === "custom" ? "text-white" : "hover:text-foreground"
          )}
          style={{
            fontSize: "var(--text-label)",
            color: activePeriod === "custom" ? "#FFFFFF" : "var(--text-secondary)",
            ...(activePeriod === "custom"
              ? { background: "var(--gradient-primary-button)", boxShadow: "0 1px 6px rgba(227,28,61,0.35)" }
              : {}),
          }}
          aria-expanded={showCustom}
          aria-label="Custom date range"
        >
          <Calendar className="h-3 w-3" />
          Custom
          <ChevronDown className={cn("h-3 w-3 transition-transform duration-150", showCustom ? "rotate-180" : "")} />
        </button>
      </div>

      {/* ── Active Range Label ──────────────────────────────────── */}
      <span
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] font-medium"
        style={{
          fontSize: "var(--text-label)",
          color: "var(--text-secondary)",
          background: "var(--surface-overlay)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--elevation-1)",
          whiteSpace: "nowrap",
        }}
      >
        <Calendar className="h-3 w-3 opacity-60" />
        {format(value.from, "MMM d, yyyy")} – {format(value.to, "MMM d, yyyy")}
      </span>

      {/* ── Refresh Button ──────────────────────────────────────── */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] font-medium transition-all duration-150 disabled:opacity-50 hover:text-foreground"
          style={{
            fontSize: "var(--text-label)",
            color: "var(--text-secondary)",
            background: "var(--surface-overlay)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--elevation-1)",
          }}
          aria-label="Refresh dashboard data"
        >
          <RefreshCw className={cn("h-3 w-3", isLoading ? "animate-spin" : "")} />
          Refresh
        </button>
      )}

      {/* ── Custom Date Picker Dropdown ─────────────────────────── */}
      {showCustom && (
        <div
          className="w-full sm:absolute sm:top-full sm:right-0 sm:w-auto mt-1.5 sm:mt-1 z-50 flex flex-col gap-3 p-4"
          style={{
            background: "var(--popover-bg)",
            backgroundImage: "var(--popover-bg-overlay)",
            border: "1px solid var(--popover-border)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--popover-shadow)",
          }}
        >
          {/* Gloss top edge */}
          <div
            className="absolute inset-x-0 top-0 h-px pointer-events-none rounded-t-[var(--radius-lg)]"
            style={{ background: "linear-gradient(90deg, transparent 0%, var(--border-strong) 50%, transparent 100%)" }}
          />

          <div className="flex flex-col sm:flex-row gap-3">
            {/* From */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="dash-from"
                className="font-semibold uppercase"
                style={{ fontSize: "var(--text-micro)", letterSpacing: "var(--tracking-wider)", color: "var(--text-muted)" }}
              >
                From
              </label>
              <input
                id="dash-from"
                type="date"
                value={customFrom}
                max={customTo}
                onChange={(e) => { setCustomFrom(e.target.value); setDateError(null); }}
                style={{
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  background: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                  color: "var(--input-text)",
                  fontFamily: "var(--font-geist-mono)",
                  outline: "none",
                  boxShadow: "var(--input-shadow)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--input-border-focus)";
                  e.target.style.boxShadow = "var(--input-shadow-focus)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--input-border)";
                  e.target.style.boxShadow = "var(--input-shadow)";
                }}
              />
            </div>

            {/* To */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="dash-to"
                className="font-semibold uppercase"
                style={{ fontSize: "var(--text-micro)", letterSpacing: "var(--tracking-wider)", color: "var(--text-muted)" }}
              >
                To
              </label>
              <input
                id="dash-to"
                type="date"
                value={customTo}
                min={customFrom}
                max={format(new Date(), "yyyy-MM-dd")}
                onChange={(e) => { setCustomTo(e.target.value); setDateError(null); }}
                style={{
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  background: "var(--input-bg)",
                  border: "1px solid var(--input-border)",
                  color: "var(--input-text)",
                  fontFamily: "var(--font-geist-mono)",
                  outline: "none",
                  boxShadow: "var(--input-shadow)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--input-border-focus)";
                  e.target.style.boxShadow = "var(--input-shadow-focus)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--input-border)";
                  e.target.style.boxShadow = "var(--input-shadow)";
                }}
              />
            </div>
          </div>

          {dateError && (
            <p
              className="flex items-center gap-1.5 font-medium"
              style={{ fontSize: "var(--text-body-sm)", color: "var(--badge-danger-text)" }}
            >
              {dateError}
            </p>
          )}

          <div className="flex items-center gap-2 justify-end pt-1">
            <button
              onClick={() => setShowCustom(false)}
              className="px-3 py-1.5 rounded-[var(--radius-md)] font-medium transition-colors"
              style={{
                fontSize: "var(--text-label)",
                color: "var(--text-secondary)",
                background: "var(--btn-secondary-bg)",
                border: "1px solid var(--btn-secondary-border)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={applyCustom}
              className="btn-primary px-4 py-1.5"
              style={{ fontSize: "var(--text-label)" }}
            >
              Apply Range
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
