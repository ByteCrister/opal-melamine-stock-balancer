"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, useId } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SignInInputProps {
    label: string;
    id?: string;
    type?: "text" | "email" | "password";
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    autoComplete?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Styled text/email/password input that follows the v2 Glossy Premium SaaS design.
 * Adapts to system Light/Dark mode automatically via Tailwind variables.
 */
export function SignInInput({
    label,
    id,
    type = "text",
    value,
    onChange,
    placeholder,
    disabled = false,
    error,
    autoComplete,
}: SignInInputProps) {
    const generatedId = useId();
    const inputId     = id ?? generatedId;
    const [showPwd, setShowPwd] = useState(false);

    const resolvedType =
        type === "password" ? (showPwd ? "text" : "password") : type;

    return (
        <div className="flex flex-col gap-1.5">
            {/* Label */}
            <label
                htmlFor={inputId}
                className="font-body text-[13px] font-medium text-foreground select-none"
            >
                {label}
            </label>

            {/* Input wrapper */}
            <div className="relative">
                <input
                    id={inputId}
                    type={resolvedType}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    className={`
                        w-full h-10 px-3
                        ${type === "password" ? "pr-11" : ""}
                        bg-background rounded-md
                        font-body text-sm font-normal text-foreground
                        outline-none transition-all duration-200 ease-in-out
                        disabled:opacity-55 disabled:cursor-not-allowed
                        placeholder:text-muted
                        border
                        focus:ring-2 focus:border-primary focus:ring-primary/20
                        ${error ? "border-status-danger focus:border-status-danger focus:ring-status-danger/20" : "border-border"}
                    `}
                />

                {/* Password toggle */}
                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPwd((v) => !v)}
                        aria-label={showPwd ? "Hide password" : "Show password"}
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors p-0 bg-transparent border-none cursor-pointer flex items-center justify-center leading-none"
                    >
                        {showPwd ? (
                            <EyeOff size={16} strokeWidth={1.5} />
                        ) : (
                            <Eye size={16} strokeWidth={1.5} />
                        )}
                    </button>
                )}
            </div>

            {/* Inline error */}
            {error && (
                <span role="alert" className="font-body text-xs text-[#E31C3D] mt-0.5">
                    {error}
                </span>
            )}
        </div>
    );
}
