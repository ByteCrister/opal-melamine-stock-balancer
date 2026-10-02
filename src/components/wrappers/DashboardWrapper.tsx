"use client";

import { useState, useRef } from "react";
import { useUserStore } from "@/store/useUserStore";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";


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

  // Scroll state
  const [isTopbarVisible, setIsTopbarVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    
    if (currentScrollY <= 10) {
      setIsTopbarVisible(true);
      lastScrollY.current = currentScrollY;
      return;
    }
    
    if (currentScrollY > lastScrollY.current + 10) {
      // Scrolling down
      setIsTopbarVisible(false);
      lastScrollY.current = currentScrollY;
    } else if (currentScrollY < lastScrollY.current - 10) {
      // Scrolling up
      setIsTopbarVisible(true);
      lastScrollY.current = currentScrollY;
    }
  };

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
    <div className="flex h-screen w-full" style={{ background: "var(--surface-base)" }}>
      {/* ── Sidebar (desktop: static, mobile: drawer via prop) ── */}
      <AppSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative overflow-hidden">

        {/* Mobile top bar — only visible below md */}
        <header
          className={cn(
            "md:hidden absolute top-0 left-0 right-0 z-30 flex items-center gap-3 h-14 px-4 shrink-0 transition-transform duration-300 ease-in-out",
            isTopbarVisible ? "translate-y-0" : "-translate-y-full"
          )}
          style={{
            background: "var(--sidebar-bg)",
            backgroundImage: "var(--sidebar-bg-overlay)",
            borderBottom: "1px solid var(--sidebar-border)",
            boxShadow: "var(--sidebar-shadow)",
          }}
        >
          <div className="flex items-center gap-3 w-full">
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
          <Logo size="sm" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden" onScroll={handleScroll}>
          <div className="p-4 pt-[72px] md:pt-6 md:px-6 md:py-6 lg:px-8 lg:py-6 max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
