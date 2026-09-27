/**
 * @file src/styles/tokens/colors.ts
 *
 * Color tokens for the Glossy Premium SaaS design system.
 * Source: DESIGN.md v2
 */

export const colorPrimitives = {
    graphite950: "#0A0B0D",
    graphite900: "#101215",
    graphite800: "#181B1F",
    graphite700: "#22262C",
    graphite600: "#2E333B",
    graphite400: "#565D68",

    fog200: "#9BA1AB",
    fog050: "#E9EBEF",
    white: "#FFFFFF",

    crimson400: "#FF3B57",
    crimson500: "#E31C3D",
    crimson600: "#C41230",
    crimson700: "#9C0E26",
    crimson900: "#3D0A14",
    crimsonGlow: "rgba(227, 28, 61, 0.35)",

    statusSuccess: "#2FBF71",
    statusWarning: "#F5A623",
    statusDanger: "#E31C3D",
    statusInfo: "#4C8DFF",
    statusNeutral: "#565D68",
} as const;

export const semanticColors = {
    surfaceBase: "var(--surface-base)",
    surfaceRaised: "var(--surface-raised)",
    surfaceOverlay: "var(--surface-overlay)",
    
    textPrimary: "var(--text-primary)",
    textSecondary: "var(--text-secondary)",
    textMuted: "var(--text-muted)",
    textOnPrimary: "var(--text-on-primary)",
    
    borderDefault: "var(--border-default)",
    borderGlass: "var(--border-glass)",
    
    focusRing: "var(--focus-ring)",
} as const;

export const gradients = {
    primaryButton: "var(--gradient-primary-button)",
    primaryButtonHover: "var(--gradient-primary-button-hover)",
    glassSurface: "var(--gradient-glass-surface)",
    heroGlow: "var(--gradient-hero-glow)",
    metricAccent: "var(--gradient-metric-accent)",
    borderSheen: "var(--gradient-border-sheen)",
} as const;
