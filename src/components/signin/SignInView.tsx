import { SignInForm } from "@/components/signin/SignInForm";

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
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="h-10 w-10 rounded-[12px] flex items-center justify-center relative overflow-hidden shrink-0 transition-shadow duration-200"
                                style={{
                                    backgroundImage: "var(--gradient-primary-button)",
                                    boxShadow: "var(--glow-primary-cta)",
                                }}
                            >
                                <span
                                    aria-hidden
                                    className="absolute inset-0"
                                    style={{
                                        background: "linear-gradient(160deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 55%)",
                                        borderRadius: "inherit",
                                    }}
                                />
                                <span className="relative font-sans font-bold text-[18px] text-white tracking-tight">O</span>
                            </div>
                            <span
                                className="font-sans font-medium text-[20px] tracking-[-0.01em] transition-colors"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Opal
                                <span className="font-semibold" style={{ color: "var(--color-crimson-400)" }}>
                                    Melamine
                                </span>
                            </span>
                        </div>
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
