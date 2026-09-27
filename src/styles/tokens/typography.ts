/**
 * @file src/styles/tokens/typography.ts
 * Typography tokens for v2 Glossy Premium SaaS
 */

export const fonts = {
    display: "var(--font-geist)",
    body: "var(--font-inter)",
    mono: "var(--font-geist-mono)",
} as const;

export const textSizes = {
    displayLg: "var(--text-display-lg)",
    displayMd: "var(--text-display-md)",
    headingLg: "var(--text-heading-lg)",
    headingMd: "var(--text-heading-md)",
    bodyLg: "var(--text-body-lg)",
    bodyMd: "var(--text-body-md)",
    bodySm: "var(--text-body-sm)",
    label: "var(--text-label)",
    metricLg: "var(--text-metric-lg)",
    numeric: "var(--text-numeric)",
    code: "var(--text-code)",
} as const;

export const lineHeights = {
    displayLg: "var(--leading-display-lg)",
    displayMd: "var(--leading-display-md)",
    headingLg: "var(--leading-heading-lg)",
    headingMd: "var(--leading-heading-md)",
    bodyLg: "var(--leading-body-lg)",
    bodyMd: "var(--leading-body-md)",
    bodySm: "var(--leading-body-sm)",
    label: "var(--leading-label)",
    metricLg: "var(--leading-metric-lg)",
    numeric: "var(--leading-numeric)",
    code: "var(--leading-code)",
} as const;

export const tracking = {
    tight: "var(--tracking-tight)",
    snug: "var(--tracking-snug)",
    normal: "var(--tracking-normal)",
    wide: "var(--tracking-wide)",
} as const;

export const weights = {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
} as const;
