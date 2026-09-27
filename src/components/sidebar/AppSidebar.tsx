"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package2,
  ArrowDownToLine,
  ArrowUpFromLine,
  Scale,
  List,
  Trash2,
  User as UserIcon,
  LogOut,
  ChevronUp,
  ShieldCheck,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useUserStore } from "@/store/useUserStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FadeInLeft, FadeInUp, StaggerContainer, StaggerItem } from "@/components/shared/motion";

export const SIDEBAR_LINKS = [
  { name: "Dashboard",      href: "/",              icon: LayoutDashboard },
  { name: "Items",          href: "/items",          icon: Package2 },
  { name: "Stock-in",       href: "/stock-in",       icon: ArrowDownToLine },
  { name: "Stock-out",      href: "/stock-out",      icon: ArrowUpFromLine },
  { name: "Stock-balancer", href: "/stock-balancer", icon: Scale },
  { name: "DropdownList",   href: "/dropdowns",      icon: List },
  { name: "RecycleBin",     href: "/recycle-bin",    icon: Trash2 },
];

interface AppSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

/* ─────────────────────────────────────────────────────────────────────────
   Shared inner sidebar content (reused in both desktop and mobile drawer)
   ───────────────────────────────────────────────────────────────────────── */
function SidebarContent({ onLinkClick, onLogoutClick }: { onLinkClick?: () => void; onLogoutClick: () => void }) {
  const pathname = usePathname();
  const { user } = useUserStore();
  
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
      <>
        {/* ── Logo ────────────────────────────────────────────────── */}
        <div style={{ borderBottom: "1px solid var(--sidebar-divider)" }}>
          <FadeInLeft className="h-16 flex items-center px-5" delay={0.1}>
            <Link href="/" className="flex items-center gap-3 select-none group" onClick={onLinkClick}>
              {/* Glossy logo-mark */}
            <div
              className="h-8 w-8 rounded-[10px] flex items-center justify-center relative overflow-hidden shrink-0 transition-shadow duration-200"
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
              <span className="relative font-sans font-bold text-[15px] text-white tracking-tight">O</span>
            </div>
            <span
              className="font-sans font-medium text-[15.5px] tracking-[-0.01em] transition-colors"
              style={{ color: "var(--text-primary)" }}
            >
              Opal
              <span className="font-semibold" style={{ color: "var(--color-crimson-400)" }}>
                Melamine
              </span>
            </span>
          </Link>

          {/* Mobile close button — only inside the drawer */}
          {onLinkClick !== undefined && (
            <button
              onClick={onLinkClick}
              aria-label="Close navigation menu"
              className="ml-auto h-8 w-8 rounded-lg flex items-center justify-center transition-colors duration-150 md:hidden"
              style={{ background: "var(--surface-glass)", color: "var(--text-secondary)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>
          )}
          </FadeInLeft>
        </div>

        {/* ── Navigation ──────────────────────────────────────────── */}
        <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5 overflow-y-auto">
          <p
            className="px-3 mb-3 text-[10.5px] font-semibold uppercase tracking-widest select-none"
            style={{ color: "var(--sidebar-section-label)" }}
          >
            Navigation
          </p>

          <StaggerContainer delay={0.2} className="flex flex-col gap-0.5">
          {SIDEBAR_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname?.startsWith(link.href));
            const Icon = link.icon;

            return (
              <StaggerItem key={link.name}>
                <Link
                  href={link.href}
                onClick={onLinkClick}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-[9px] rounded-[9px] text-[13.5px] transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-crimson-400)]",
                  isActive ? "font-medium" : "font-normal"
                )}
                style={
                  isActive
                    ? {
                        color: "var(--text-primary)",
                        backgroundColor: "rgba(227,28,61,0.14)",
                        backgroundImage: "linear-gradient(135deg, rgba(255,59,87,0.1) 0%, rgba(196,18,48,0.06) 100%)",
                        boxShadow: "inset 0 0 0 1px rgba(227,28,61,0.22), 0 2px 12px rgba(227,28,61,0.15)",
                      }
                    : { color: "var(--text-secondary)" }
                }
              >
                {/* Active left indicator bar */}
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full"
                    style={{
                      backgroundImage: "var(--gradient-primary-button)",
                      boxShadow: "0 0 8px var(--color-crimson-glow)",
                    }}
                  />
                )}

                {/* Icon badge */}
                <span
                  className="flex items-center justify-center h-[30px] w-[30px] rounded-[7px] shrink-0 transition-all duration-150"
                  style={
                    isActive
                      ? {
                          backgroundImage: "var(--gradient-primary-button)",
                          boxShadow: "0 1px 6px rgba(227,28,61,0.45)",
                        }
                      : undefined
                  }
                >
                  <Icon
                    className="h-[15px] w-[15px] transition-colors"
                    style={isActive ? { color: "#fff" } : { color: "var(--text-muted)" }}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </span>

                {link.name}

                {/* Hover sheen overlay */}
                {!isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-[9px] opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
                    style={{ background: "var(--sidebar-item-hover-bg)" }}
                  />
                )}
                </Link>
              </StaggerItem>
            );
          })}
          </StaggerContainer>
        </nav>

        {/* ── Profile footer ──────────────────────────────────────── */}
        <div className="p-3" style={{ borderTop: "1px solid var(--sidebar-divider)" }}>
          <FadeInUp delay={0.4}>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="group w-full px-3 py-2.5 rounded-[10px] flex items-center gap-3 outline-none transition-all duration-150 hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[var(--color-crimson-400)]"
              style={{
                background: "var(--sidebar-trigger-bg)",
                border: "1px solid var(--sidebar-trigger-border)",
                boxShadow: "var(--sidebar-trigger-shadow)",
              }}
            >
              <Avatar className="h-8 w-8 shrink-0 ring-2 ring-[rgba(227,28,61,0.35)] ring-offset-1 ring-offset-[var(--sidebar-avatar-ring-offset)]">
                <AvatarImage src="" alt={user?.name || "User"} />
                <AvatarFallback
                  className="text-[11px] font-bold text-white"
                  style={{ backgroundImage: "var(--gradient-primary-button)" }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col min-w-0 flex-1 text-left">
                <span
                  className="text-[13px] font-semibold font-sans truncate leading-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user?.name || "User"}
                </span>
                {user?.role && (
                  <span
                    className="text-[10.5px] uppercase tracking-wider font-semibold leading-tight mt-0.5"
                    style={{ color: "var(--color-crimson-400)" }}
                  >
                    {user.role}
                  </span>
                )}
              </div>

              <ChevronUp
                className="h-3.5 w-3.5 shrink-0 transition-transform duration-150 group-data-[popup-open]:rotate-180"
                style={{ color: "var(--text-muted)" }}
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-64 p-0 overflow-hidden"
              side="top"
              align="start"
              sideOffset={10}
              style={{
                backgroundColor: "var(--sidebar-popover-bg)",
                backgroundImage: "var(--sidebar-popover-overlay)",
                border: "1px solid var(--sidebar-popover-border)",
                boxShadow: "var(--sidebar-popover-shadow)",
                borderRadius: "14px",
              }}
            >
              {/* Identity card */}
              <div
                className="px-4 py-4 relative overflow-hidden"
                style={{
                  borderBottom: "1px solid var(--sidebar-id-card-border)",
                  background: "var(--sidebar-id-card-bg)",
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-4 -right-4 h-24 w-24 rounded-full blur-2xl"
                  style={{ background: "rgba(227,28,61,0.18)" }}
                />
                <div className="flex items-center gap-3 relative">
                  <Avatar className="h-11 w-11 shrink-0">
                    <AvatarImage src="" alt={user?.name || "User"} />
                    <AvatarFallback
                      className="text-[14px] font-bold text-white"
                      style={{ backgroundImage: "var(--gradient-primary-button)" }}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <p className="text-[14px] font-semibold font-sans truncate leading-snug" style={{ color: "var(--text-primary)" }}>
                      {user?.name || "User"}
                    </p>
                    <p className="text-[11.5px] truncate leading-snug mt-0.5" style={{ color: "var(--text-secondary)" }}>
                      {user?.email || ""}
                    </p>
                    {user?.role && (
                      <span
                        className="mt-1.5 inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                        style={{
                          backgroundImage: "var(--gradient-metric-accent)",
                          boxShadow: "0 1px 6px rgba(227,28,61,0.35)",
                        }}
                      >
                        <ShieldCheck className="h-2.5 w-2.5" strokeWidth={2.5} />
                        {user.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-2">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="px-3 py-2.5 rounded-[8px] text-[13px] cursor-pointer gap-2.5 transition-colors duration-100"
                    style={{ color: "var(--text-secondary)" }}
                    render={<Link href="/profile" className="flex items-center w-full" />}
                  >
                    <span
                      className="flex items-center justify-center h-6 w-6 rounded-md shrink-0"
                      style={{ backgroundColor: "var(--sidebar-menu-icon-bg)" }}
                    >
                      <UserIcon className="h-3.5 w-3.5" />
                    </span>
                    Profile settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1.5" style={{ backgroundColor: "var(--sidebar-menu-sep)" }} />

                <DropdownMenuItem
                  className="px-3 py-2.5 rounded-[8px] text-[13px] cursor-pointer gap-2.5 transition-colors duration-100"
                  data-variant="destructive"
                  onClick={onLogoutClick}
                >
                  <span
                    className="flex items-center justify-center h-6 w-6 rounded-md shrink-0"
                    style={{ backgroundColor: "rgba(227,28,61,0.15)" }}
                  >
                    <LogOut className="h-3.5 w-3.5" style={{ color: "var(--color-crimson-400)" }} />
                  </span>
                  <span style={{ color: "var(--color-crimson-400)" }}>Sign out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          </FadeInUp>
        </div>
      </>
    );
}

export function AppSidebar({ mobileOpen = false, onMobileClose }: AppSidebarProps) {
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/signin", redirect: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          MOBILE DRAWER  (only below md)
          ══════════════════════════════════════════════════════════════ */}

      {/* Backdrop — blurred dark overlay behind the drawer */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}
        onClick={onMobileClose}
        aria-hidden
      />

      {/* Slide-in panel */}
      <aside
        aria-label="Mobile navigation"
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-50 w-[272px] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          backgroundColor: "var(--sidebar-bg)",
          backgroundImage: "var(--sidebar-bg-overlay)",
          borderRight: "1px solid var(--sidebar-border)",
          boxShadow: "4px 0 32px rgba(0,0,0,0.45), inset -1px 0 0 rgba(0,0,0,0.2)",
        }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-6 h-48 w-48 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(227,28,61,0.12) 0%, transparent 70%)" }}
        />
        <SidebarContent onLinkClick={onMobileClose} onLogoutClick={() => setLogoutOpen(true)} />
      </aside>

      {/* ══════════════════════════════════════════════════════════════
          DESKTOP SIDEBAR  (md and above — static in flow)
          ══════════════════════════════════════════════════════════════ */}
      <aside
        className="hidden md:flex w-[260px] flex-col shrink-0 relative"
        style={{
          backgroundColor: "var(--sidebar-bg)",
          backgroundImage: "var(--sidebar-bg-overlay)",
          borderRight: "1px solid var(--sidebar-border)",
          boxShadow: "var(--sidebar-shadow)",
        }}
      >
        {/* Ambient crimson glow spot */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-6 h-48 w-48 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(227,28,61,0.12) 0%, transparent 70%)" }}
        />
        <SidebarContent onLogoutClick={() => setLogoutOpen(true)} />
      </aside>

      {/* ══════════════════════════════════════════════════════════════
          Logout confirmation — premium glass dialog
          ══════════════════════════════════════════════════════════════ */}
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent
          className="p-0 overflow-hidden"
          style={{
            backgroundColor: "var(--sidebar-dialog-bg)",
            backgroundImage: "var(--sidebar-dialog-overlay)",
            border: "1px solid var(--sidebar-dialog-border)",
            boxShadow: "var(--sidebar-dialog-shadow)",
            borderRadius: "18px",
            maxWidth: "360px",
          }}
        >
          {/* Top crimson accent bar */}
          <div aria-hidden className="h-[3px] w-full" style={{ backgroundImage: "var(--gradient-primary-button)" }} />

          <AlertDialogHeader className="px-6 pt-5 pb-0 text-left">
            {/* Icon medallion */}
            <div
              className="mb-4 h-11 w-11 rounded-[12px] flex items-center justify-center"
              style={{
                backgroundImage: "var(--gradient-metric-accent)",
                boxShadow: "0 4px 16px rgba(227,28,61,0.4)",
              }}
            >
              <LogOut className="h-5 w-5 text-white" strokeWidth={2} />
            </div>

            <AlertDialogTitle
              className="text-[16px] font-semibold font-sans leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              Sign out of Opal?
            </AlertDialogTitle>
            <AlertDialogDescription
              className="mt-1.5 text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              You&apos;ll be redirected to the sign-in page and will need to authenticate again to access the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter
            className="px-6 py-5 flex flex-row justify-end gap-2 sm:flex-row"
            style={{ background: "none", border: "none", margin: 0 }}
          >
            <AlertDialogCancel
              className="px-4 py-2 text-[13px] font-medium rounded-[9px] transition-all duration-150 border focus-visible:ring-2 focus-visible:ring-[var(--color-crimson-400)]"
              style={{
                backgroundColor: "var(--sidebar-dialog-cancel-bg)",
                borderColor: "var(--sidebar-dialog-cancel-border)",
                color: "var(--text-secondary)",
              }}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleLogout}
              className="px-4 py-2 text-[13px] font-semibold rounded-[9px] text-white transition-all duration-150 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[var(--color-crimson-400)]"
              style={{
                backgroundImage: "var(--gradient-primary-button)",
                boxShadow: "var(--glow-primary-cta)",
              }}
            >
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
