"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

import { SignInInput }  from "@/components/signin/SignInInput";
import { SignInButton } from "@/components/signin/SignInButton";
import { GoogleIcon }   from "@/components/signin/GoogleIcon";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormErrors {
    email?:    string;
    password?: string;
    form?:     string;
}

// ---------------------------------------------------------------------------
// Validation (client-side only — full validation is server-side)
// ---------------------------------------------------------------------------

function validateFields(email: string, password: string): FormErrors {
    const errors: FormErrors = {};
    if (!email.trim() || !email.includes("@")) {
        errors.email = "Please enter a valid email address.";
    }
    if (!password) {
        errors.password = "Password is required.";
    }
    return errors;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Sign-in form — handles both credential and Google sign-in.
 *
 * Flow (credentials):
 *   1. Client-side validation
 *   2. POST /api/auth/verify-credentials  — bcrypt check + rate-limit
 *   3. On success → signIn("credentials", { verifiedUserId })
 *
 * Flow (Google):
 *   1. signIn("google") → NextAuth handles OAuth
 *   2. signIn callback in auth.ts rejects users not in DB
 */
export function SignInForm() {
    const [email,    setEmail]    = useState("");
    const [password, setPassword] = useState("");
    const [errors,   setErrors]   = useState<FormErrors>({});
    const [isPending, startTransition] = useTransition();
    const [googlePending, setGooglePending] = useState(false);

    // -----------------------------------------------------------------------
    // Credentials sign-in
    // -----------------------------------------------------------------------

    async function handleCredentialsSubmit(e: React.FormEvent) {
        e.preventDefault();

        // 1. Client-side validation
        const clientErrors = validateFields(email, password);
        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }
        setErrors({});

        startTransition(async () => {
            try {
                // 2. Pre-verification API call
                const res = await fetch("/api/auth/verify-credentials", {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({ email: email.trim().toLowerCase(), password }),
                });

                const json = await res.json();

                if (!res.ok) {
                    setErrors({
                        form: json?.error ?? "Sign in failed. Please check your credentials.",
                    });
                    return;
                }

                const userId: string = json?.data?.userId;
                if (!userId) {
                    setErrors({ form: "Unexpected server response. Please try again." });
                    return;
                }

                // 3. Pass verified user id to NextAuth
                const result = await signIn("credentials", {
                    verifiedUserId: userId,
                    redirect:       false,
                });

                if (result?.error) {
                    setErrors({ form: "Authentication failed. Please try again." });
                    return;
                }

                // 4. Success — Redirect to callbackUrl if present, otherwise home
                const searchParams = new URLSearchParams(window.location.search);
                const callbackUrl = searchParams.get("callbackUrl") || "/";
                window.location.href = callbackUrl;
            } catch {
                setErrors({ form: "Something went wrong. Please try again." });
            }
        });
    }

    // -----------------------------------------------------------------------
    // Google sign-in
    // -----------------------------------------------------------------------

    async function handleGoogleSignIn() {
        setGooglePending(true);
        try {
            const searchParams = new URLSearchParams(window.location.search);
            const callbackUrl = searchParams.get("callbackUrl") || "/";
            await signIn("google", { callbackUrl });
        } catch {
            setErrors({ form: "Google sign-in failed. Please try again." });
            setGooglePending(false);
        }
    }

    const isLoading = isPending || googlePending;

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------

    return (
        <div className="flex flex-col gap-6">

            {/* ── Form-level error banner ───────────────────────────────── */}
            {errors.form && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="p-3 bg-[#E31C3D]/10 border border-[#E31C3D]/20 rounded-md font-body text-[13px] text-[#E31C3D]"
                >
                    {errors.form}
                </div>
            )}

            {/* ── Credentials form ─────────────────────────────────────── */}
            <form
                id="signin-credentials-form"
                onSubmit={handleCredentialsSubmit}
                noValidate
                className="flex flex-col gap-4"
            >
                <SignInInput
                    id="signin-email"
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(v) => {
                        setEmail(v);
                        setErrors((prev) => ({ ...prev, email: undefined, form: undefined }));
                    }}
                    placeholder="you@example.com"
                    disabled={isLoading}
                    error={errors.email}
                    autoComplete="email"
                />

                <SignInInput
                    id="signin-password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(v) => {
                        setPassword(v);
                        setErrors((prev) => ({ ...prev, password: undefined, form: undefined }));
                    }}
                    placeholder="••••••••"
                    disabled={isLoading}
                    error={errors.password}
                    autoComplete="current-password"
                />

                <SignInButton
                    id="signin-submit-btn"
                    type="submit"
                    variant="primary"
                    loading={isPending}
                    disabled={isLoading}
                    fullWidth
                >
                    {isPending ? "Signing in…" : "Sign in"}
                </SignInButton>
            </form>

            {/* ── Divider ──────────────────────────────────────────────── */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="font-body text-xs text-muted whitespace-nowrap select-none">
                    or continue with
                </span>
                <div className="flex-1 h-px bg-border" />
            </div>

            {/* ── Google button ─────────────────────────────────────────── */}
            <SignInButton
                id="signin-google-btn"
                variant="secondary"
                loading={googlePending}
                disabled={isLoading}
                fullWidth
                onClick={handleGoogleSignIn}
            >
                <GoogleIcon size={17} />
                Continue with Google
            </SignInButton>
        </div>
    );
}
