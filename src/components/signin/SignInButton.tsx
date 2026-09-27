"use client";

import { Loader2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SignInButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?:    "button" | "submit";
    variant?: "primary" | "ghost";
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
 * ghost:   Uses standard Tailwind utility classes for secondary actions.
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

    const baseClasses = `
        inline-flex items-center justify-center gap-2 h-10 px-5
        rounded-full font-sans text-[14px] leading-none whitespace-nowrap select-none
        transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer
        disabled:opacity-60 disabled:cursor-not-allowed
        ${fullWidth ? "w-full" : ""}
    `;

    // primary relies on the .btn-primary class defined in globals.css for its
    // complex gloss/glow gradients. ghost uses standard utility classes.
    const variantClasses = variant === "primary"
        ? "btn-primary" 
        : "bg-surface text-foreground border border-border hover:bg-background font-medium";

    return (
        <button
            id={id}
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            aria-busy={loading}
            className={`${baseClasses} ${variantClasses}`}
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
