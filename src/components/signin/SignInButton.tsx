"use client";

import { Loader2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SignInButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?:    "button" | "submit";
    variant?: "primary" | "secondary";
    disabled?: boolean;
    loading?:  boolean;
    fullWidth?: boolean;
    id?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Button component — follows the v2 Glossy Premium SaaS design.
 * 
 * primary: Uses `.btn-primary` helper class (crimson gradient + glow).
 * secondary: Uses `.btn-secondary` helper class (graphite + hover glow).
 */
export function SignInButton({
    children,
    onClick,
    type     = "button",
    variant  = "primary",
    disabled = false,
    loading  = false,
    fullWidth = false,
    id,
}: SignInButtonProps) {
    const isDisabled = disabled || loading;

    const widthClass = fullWidth ? "w-full" : "";

    const variantClass = variant === "primary" ? "btn-primary" : "btn-secondary";

    return (
        <button
            id={id}
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            aria-busy={loading}
            className={`${variantClass} ${widthClass}`.trim()}
        >
            {loading && (
                <Loader2
                    size={15}
                    strokeWidth={2}
                    className="animate-spin"
                />
            )}
            {children}
        </button>
    );
}
