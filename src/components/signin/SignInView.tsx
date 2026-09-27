import { SignInForm } from "@/components/signin/SignInForm";

/**
 * Client component that renders the complete Sign-in UI.
 * Redesigned for a premium, minimalist aesthetic following DESIGN.md v2
 */
export function SignInView() {
    return (
        <main
            aria-label="Sign in"
            className="min-h-screen bg-background flex flex-col items-center justify-center p-6"
        >
            <div className="w-full max-w-[360px] flex flex-col gap-6">
                {/* ── Premium Glass Card ────────────────────────────────── */}
                <div className="glass-panel flex flex-col gap-8 p-8 sm:p-10">
                    
                    {/* ── Header ──────────────────────────────────────── */}
                    <div className="flex flex-col gap-1.5 text-center">
                        <h1 className="font-sans text-2xl font-medium tracking-tight text-foreground m-0">
                            Welcome back
                        </h1>
                        <p className="font-body text-sm text-secondary m-0">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    {/* ── Form ────────────────────────────────────────── */}
                    <SignInForm />
                </div>

                {/* ── Footer note ──────────────────────────────────────── */}
                <p className="text-center font-body text-xs text-muted leading-relaxed m-0">
                    Authorized access only.
                </p>
            </div>
        </main>
    );
}
