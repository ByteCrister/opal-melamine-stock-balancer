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
} from "lucide-react";

export const SIDEBAR_LINKS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Items", href: "/items", icon: Package2 },
  { name: "Stock-in", href: "/stock-in", icon: ArrowDownToLine },
  { name: "Stock-out", href: "/stock-out", icon: ArrowUpFromLine },
  { name: "Stock-balancer", href: "/stock-balancer", icon: Scale },
  { name: "DropdownList", href: "/dropdowns", icon: List },
  { name: "RecycleBin", href: "/recycle-bin", icon: Trash2 },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-surface shadow-sm">
      <div className="h-16 flex items-center px-6 border-b border-border/40">
        <span className="font-sans font-bold text-xl text-foreground tracking-tight flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
            O
          </div>
          <span>
            Opal<span className="text-primary font-black">Melamine</span>
          </span>
        </span>
      </div>
      <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
        {SIDEBAR_LINKS.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 group",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors")} />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
