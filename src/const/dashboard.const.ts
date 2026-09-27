// src/const/dashboard.const.ts
import { ComparisonPeriod } from "@/types/dashboard.types";
import { subDays, startOfDay, endOfDay } from "date-fns";

/** Chart color palette matching DESIGN.md data-viz palette */
export const CHART_COLORS = {
  stockIn:  "#2FBF71", // green
  stockOut: "#E31C3D", // crimson
  balance:  "#4C8DFF", // blue
  neutral:  "#565D68", // grey
  amber:    "#F5A623",
  violet:   "#9B6BFF",
} as const;

/** Recharts tick style matching design system */
export const CHART_TICK_STYLE = {
  fill: "#9BA1AB",   // --color-fog-200
  fontSize: 11,
  fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
} as const;

/** Recharts tooltip style overrides */
export const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    background: "#181B1F",
    border: "1px solid #2E333B",
    borderRadius: "10px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
    padding: "10px 14px",
    color: "#E9EBEF",
    fontSize: 12,
    fontFamily: "Inter, ui-sans-serif",
  },
  labelStyle: {
    color: "#9BA1AB",
    marginBottom: 4,
    fontSize: 11,
  },
  itemStyle: {
    color: "#E9EBEF",
  },
} as const;

/** Quick-select preset periods for the date filter */
export const PRESET_PERIODS: {
  label: string;
  value: ComparisonPeriod;
  getRange: () => { from: Date; to: Date };
}[] = [
  {
    label: "Last 7 days",
    value: "7d",
    getRange: () => ({
      from: startOfDay(subDays(new Date(), 6)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Last 30 days",
    value: "30d",
    getRange: () => ({
      from: startOfDay(subDays(new Date(), 29)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Last 90 days",
    value: "90d",
    getRange: () => ({
      from: startOfDay(subDays(new Date(), 89)),
      to: endOfDay(new Date()),
    }),
  },
];

/** Default date filter: last 30 days */
export const DEFAULT_DATE_FILTER = () => ({
  from: startOfDay(subDays(new Date(), 29)),
  to: endOfDay(new Date()),
});

/** Recharts cartesian grid style */
export const CHART_GRID_STYLE = {
  stroke: "#22262C",   // --color-graphite-700
  strokeDasharray: "3 3",
} as const;
