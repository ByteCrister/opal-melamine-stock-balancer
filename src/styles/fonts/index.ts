/**
 * @file src/styles/fonts/index.ts
 *
 * Font definitions for the Glossy Premium SaaS design system.
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  DESIGN.md FONT REFERENCE                                       │
 * │                                                                 │
 * │  Geist        → Display / Headline font                         │
 * │                 Weights: 500, 600                               │
 * │                                                                 │
 * │  Inter        → Body / UI / Nav font                            │
 * │                 Weights: 400, 500                               │
 * │                                                                 │
 * │  Geist Mono   → Numeric / Code / ID font                        │
 * │                 Weights: 500, 600                               │
 * └─────────────────────────────────────────────────────────────────┘
 */

import { Inter, Geist, Geist_Mono } from "next/font/google";

export const geist = Geist({
    variable: "--font-display",
    subsets: ["latin"],
    weight: ["500", "600"],
    display: "swap",
    preload: true,
});

export const inter = Inter({
    variable: "--font-body",
    subsets: ["latin"],
    weight: ["400", "500"],
    display: "swap",
    preload: true,
});

export const geistMono = Geist_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
    weight: ["500", "600"],
    display: "swap",
    preload: true,
});
