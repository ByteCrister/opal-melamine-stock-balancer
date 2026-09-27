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

/** Date Filter Bar with preset periods and custom date range */
export function DateFilterBar({ value, onChange, onRefresh, isLoading }: DateFilterBarProps) {
  const [activePeriod, setActivePeriod] = useState<ComparisonPeriod>("30d");
  const [showCustom, setShowCustom] = useState(false);

  // Custom date inputs state
  const [customFrom, setCustomFrom] = useState<string>(format(value.from, "yyyy-MM-dd"));
  const [customTo, setCustomTo]     = useState<string>(format(value.to, "yyyy-MM-dd"));
  const [dateError, setDateError]   = useState<string | null>(null);

  function applyPreset(period: ComparisonPeriod) {
    const preset = PRESET_PERIODS.find((p) => p.value === period);
    if (!preset) return;
    const range = preset.getRange();
    setActivePeriod(period);
    setShowCustom(false);
    setDateError(null);
    onChange(range);
  }

  function applyCustom() {
    if (!customFrom || !customTo) {
      setDateError("Both dates are required.");
      return;
    }

    const from = new Date(customFrom + "T00:00:00");
    const to   = new Date(customTo   + "T23:59:59.999");

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      setDateError("Invalid date format.");
      return;
    }
    if (from > to) {
      setDateError("Start date must be before end date.");
      return;
    }

    const maxMs = 365 * 24 * 60 * 60 * 1000; // 1 year
    if (to.getTime() - from.getTime() > maxMs) {
      setDateError("Date range cannot exceed 1 year.");
      return;
    }

    setDateError(null);
    setActivePeriod("custom");
    setShowCustom(false);
    onChange({ from, to });
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 flex-wrap">
      {/* Preset Period Tabs */}
      <div
        className="flex items-center gap-1 p-1 rounded-lg"
        style={{ background: "var(--surface-overlay)" }}
        role="group"
        aria-label="Date period presets"
      >
        {PRESET_PERIODS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => applyPreset(preset.value)}
            className={cn(
              "px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-all duration-150",
              activePeriod === preset.value
                ? "text-white"
                : "text-secondary hover:text-foreground"
            )}
            style={
              activePeriod === preset.value
                ? {
                    background: "var(--gradient-primary-button)",
                    boxShadow: "0 1px 4px rgba(227,28,61,0.3)",
                  }
                : {}
            }
            aria-pressed={activePeriod === preset.value}
          >
            {preset.label}
          </button>
        ))}

        {/* Custom range toggle */}
        <button
          onClick={() => setShowCustom((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-all duration-150",
            activePeriod === "custom"
              ? "text-white"
              : "text-secondary hover:text-foreground"
          )}
          style={
            activePeriod === "custom"
              ? { background: "var(--gradient-primary-button)", boxShadow: "0 1px 4px rgba(227,28,61,0.3)" }
              : {}
          }
          aria-expanded={showCustom}
          aria-label="Custom date range"
        >
          <Calendar className="h-3.5 w-3.5" />
          Custom
          <ChevronDown className={cn("h-3 w-3 transition-transform duration-150", showCustom ? "rotate-180" : "")} />
        </button>
      </div>

      {/* Active range label */}
      <span
        className="hidden sm:block text-[12px] font-medium px-3 py-1.5 rounded-lg"
        style={{ background: "var(--surface-overlay)", color: "var(--text-secondary)" }}
      >
        {format(value.from, "MMM d, yyyy")} – {format(value.to, "MMM d, yyyy")}
      </span>

      {/* Refresh button */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-all duration-150 hover:text-foreground disabled:opacity-50"
          style={{ background: "var(--surface-overlay)", color: "var(--text-secondary)" }}
          aria-label="Refresh dashboard data"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isLoading ? "animate-spin" : "")} />
          Refresh
        </button>
      )}

      {/* Custom date picker dropdown */}
      {showCustom && (
        <div
          className="w-full mt-1 sm:absolute sm:mt-0 sm:top-full sm:right-0 sm:w-auto z-50 rounded-[var(--radius-md)] p-4 flex flex-col gap-3"
          style={{
            background: "var(--surface-overlay)",
            border: "1px solid var(--border-default)",
            boxShadow: "var(--elevation-2)",
          }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="dash-from"
                className="text-[12px] font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                From
              </label>
              <input
                id="dash-from"
                type="date"
                value={customFrom}
                max={customTo}
                onChange={(e) => {
                  setCustomFrom(e.target.value);
                  setDateError(null);
                }}
                className="px-3 py-2 rounded-lg text-[13px] outline-none transition-all duration-150"
                style={{
                  background: "var(--surface-base)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-geist-mono)",
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="dash-to"
                className="text-[12px] font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                To
              </label>
              <input
                id="dash-to"
                type="date"
                value={customTo}
                min={customFrom}
                max={format(new Date(), "yyyy-MM-dd")}
                onChange={(e) => {
                  setCustomTo(e.target.value);
                  setDateError(null);
                }}
                className="px-3 py-2 rounded-lg text-[13px] outline-none transition-all duration-150"
                style={{
                  background: "var(--surface-base)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-geist-mono)",
                }}
              />
            </div>
          </div>

          {dateError && (
            <p className="text-[11px] font-medium" style={{ color: "var(--color-status-danger)" }}>
              {dateError}
            </p>
          )}

          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => setShowCustom(false)}
              className="px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors"
              style={{ color: "var(--text-secondary)", background: "var(--surface-base)", border: "1px solid var(--border-default)" }}
            >
              Cancel
            </button>
            <button
              onClick={applyCustom}
              className="btn-primary px-4 py-1.5 text-[12.5px]"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
