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
                        <div className="w-12 h-12 mb-2 flex items-center justify-center rounded-xl bg-[linear-gradient(180deg,#FF3B57_0%,#C41230_100%)] shadow-[0_0_0_1px_rgba(227,28,61,0.45),0_4px_20px_rgba(227,28,61,0.35)] text-white">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
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
