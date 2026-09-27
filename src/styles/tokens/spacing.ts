/**
 * @file src/styles/tokens/spacing.ts
 * Spacing and Radius tokens for v2 Glossy Premium SaaS
 */

export const spacing = {
    px1: "var(--spacing-1)",   // 4px
    px2: "var(--spacing-2)",   // 8px
    px3: "var(--spacing-3)",   // 12px
    px4: "var(--spacing-4)",   // 16px
    px5: "var(--spacing-5)",   // 20px
    px6: "var(--spacing-6)",   // 24px
    px8: "var(--spacing-8)",   // 32px
    px10: "var(--spacing-10)", // 40px
    px12: "var(--spacing-12)", // 48px
    px16: "var(--spacing-16)", // 64px
} as const;

export const radius = {
    sm: "var(--radius-sm)",     // 6px
    md: "var(--radius-md)",     // 10px
    lg: "var(--radius-lg)",     // 16px
    pill: "var(--radius-pill)", // 999px
} as const;

export const elevation = {
    none: "var(--elevation-0)",
    cardRest: "var(--elevation-1)",
    dropdown: "var(--elevation-2)",
    modal: "var(--elevation-3)",
} as const;

export const motion = {
    fast: "var(--motion-fast)",
    base: "var(--motion-base)",
    slow: "var(--motion-slow)",
    easeStd: "var(--motion-ease-std)",
    easeEmp: "var(--motion-ease-emp)",
} as const;
