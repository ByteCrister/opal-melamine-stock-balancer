"use client";

import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { usePathname } from "next/navigation";
import { FadeIn } from "@/components/shared/motion";

/**
 * DashboardWrapper — Sidebar & Main Content
 * Provides the shell layout for authorized users.
 * Manages mobile drawer state and passes it down to AppSidebar.
 */
export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useUserStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close drawer on route change
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--surface-base)" }}>
        <div
          className="animate-spin h-6 w-6 border-2 rounded-full"
          style={{ borderColor: "var(--border-default)", borderTopColor: "var(--color-crimson-500)" }}
        />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "var(--surface-base)" }}>
      {/* ── Sidebar (desktop: static, mobile: drawer via prop) ── */}
      <AppSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative overflow-hidden">

        {/* Mobile top bar — only visible below md */}
        <header
          className="md:hidden flex items-center gap-3 h-14 px-4 shrink-0"
          style={{
            background: "var(--sidebar-bg)",
            backgroundImage: "var(--sidebar-bg-overlay)",
            borderBottom: "1px solid var(--sidebar-border)",
            boxShadow: "var(--sidebar-shadow)",
          }}
        >
          <FadeIn className="flex items-center gap-3 w-full" delay={0.1}>
          {/* Hamburger */}
          <button
            id="mobile-nav-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            className="flex flex-col justify-center items-center h-9 w-9 rounded-lg gap-[5px] transition-colors duration-150 shrink-0"
            style={{ background: "var(--surface-glass)" }}
          >
            <span
              className="block h-[1.5px] w-5 rounded-full transition-all duration-150"
              style={{ background: "var(--text-secondary)" }}
            />
            <span
              className="block h-[1.5px] w-3.5 rounded-full transition-all duration-150"
              style={{ background: "var(--text-secondary)" }}
            />
            <span
              className="block h-[1.5px] w-5 rounded-full transition-all duration-150"
              style={{ background: "var(--text-secondary)" }}
            />
          </button>

          {/* Logo mark + wordmark */}
          <div className="flex items-center gap-2.5">
            <div
              className="h-7 w-7 rounded-[8px] flex items-center justify-center relative overflow-hidden shrink-0"
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
              <span className="relative font-sans font-bold text-[13px] text-white tracking-tight">O</span>
            </div>
            <span
              className="font-sans font-medium text-[14.5px]"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
            >
              Opal
              <span className="font-semibold" style={{ color: "var(--color-crimson-400)" }}>
                Melamine
              </span>
            </span>
          </div>
          </FadeIn>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
