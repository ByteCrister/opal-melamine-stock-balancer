/**
 * @file src/styles/tokens/components.ts
 *
 * Pre-composed component style tokens for v2 Glossy Premium SaaS.
 * In v2, components rely heavily on CSS gradients and complex shadows,
 * which are best applied via Tailwind utility classes (e.g. `bg-[var(--gradient-primary-button)]`)
 * or the helper classes in `globals.css` (e.g. `.glass-panel`, `.btn-primary`).
 *
 * This file serves as a reference for complex inline-style mappings if needed.
 */

import { semanticColors, gradients } from "./colors";
import { fonts, textSizes, weights } from "./typography";
import { radius, spacing, elevation, motion } from "./spacing";

export const buttonStyles = {
    primary: {
        background: gradients.primaryButton,
        color: semanticColors.textOnPrimary,
        borderRadius: radius.pill,
        boxShadow: "var(--glow-primary-cta)",
        fontFamily: fonts.display,
        fontWeight: weights.semibold,
        padding: `${spacing.px3} ${spacing.px6}`,
        border: "none",
        outline: "none",
        cursor: "pointer",
        transition: `all ${motion.base} ${motion.easeStd}`,
    },
    secondary: {
        background: semanticColors.surfaceRaised,
        color: semanticColors.textPrimary,
        border: `1px solid ${semanticColors.borderDefault}`,
        borderRadius: radius.pill,
        padding: `${spacing.px3} ${spacing.px6}`,
        fontFamily: fonts.display,
        fontWeight: weights.medium,
        cursor: "pointer",
        transition: `all ${motion.fast} ${motion.easeStd}`,
    },
} as const;

export const cardStyles = {
    glass: {
        background: semanticColors.surfaceRaised,
        backgroundImage: gradients.glassSurface,
        border: `1px solid ${semanticColors.borderDefault}`,
        borderRadius: radius.md,
        boxShadow: elevation.cardRest,
        padding: spacing.px6,
    },
    modal: {
        background: semanticColors.surfaceOverlay,
        border: "1px solid transparent",
        borderImage: gradients.borderSheen,
        borderRadius: radius.lg,
        boxShadow: elevation.modal,
    },
} as const;
