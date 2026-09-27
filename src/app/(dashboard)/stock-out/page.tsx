import { Metadata } from "next";
import { StockOutList } from "@/components/stock-out/StockOutList";
import { SharedBreadcrumb } from "@/components/shared/SharedBreadcrumb";
import { FadeInUp } from "@/components/shared/motion";
import { ArrowUpFromLine } from "lucide-react";

export const metadata: Metadata = {
  title: "Stock Out | Opal & Melamine Stock Balancer",
  description: "Manage your outgoing stock records",
};

export default function StockOutPage() {
  return (
    <div className="flex-1 flex flex-col gap-6 p-4 md:p-8 pt-6">
      {/* Breadcrumb */}
      <SharedBreadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Stock Out" },
        ]}
      />

      {/* Page Header */}
      <FadeInUp delay={0.0} duration={0.45}>
        <div className="flex items-center gap-4">
          <div
            className="h-12 w-12 rounded-[12px] flex items-center justify-center shrink-0"
            style={{
              background: "var(--badge-danger-bg)",
              border: "1px solid var(--badge-danger-border)",
              boxShadow: "var(--glow-card-crimson)",
            }}
          >
            <ArrowUpFromLine
              className="h-5 w-5"
              style={{ color: "var(--color-crimson-400)" }}
              strokeWidth={2.5}
            />
          </div>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-geist)",
                fontSize: "var(--text-display-md)",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "var(--tracking-tight)",
                lineHeight: "var(--leading-display-md)",
              }}
            >
              Stock Out
            </h1>
            <p style={{ fontSize: "var(--text-body-md)", color: "var(--text-secondary)" }}>
              Record and track all outgoing stock movements
            </p>
          </div>
        </div>
      </FadeInUp>

      {/* List */}
      <StockOutList />
    </div>
  );
}
