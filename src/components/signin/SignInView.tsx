import { SignInForm } from "@/components/signin/SignInForm";
import { Logo } from "@/components/shared/Logo";

/**
 * Client component that renders the complete Sign-in UI.
 * Redesigned for a premium, minimalist aesthetic following DESIGN.md v2
 */
export function SignInView() {
    return (
        <main
            aria-label="Sign in"
            className="hero-glow min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
        >
            <div className="w-full max-w-[380px] flex flex-col gap-6 relative z-10 animate-slide-up">
                {/* ── Premium Glass Card ────────────────────────────────── */}
                <div className="glass-panel flex flex-col gap-8 p-8 sm:p-10">
                    
                    {/* ── Header ──────────────────────────────────────── */}
                    <div className="flex flex-col gap-2 text-center items-center">
                        <Logo size="lg" className="mb-2" />
                        <h2 className="m-0 tracking-tight">
                            Welcome back
                        </h2>
                        <p className="text-secondary m-0">
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
