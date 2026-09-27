import { Metadata } from "next";
import { StockBalancerList } from "@/components/stock-balancer/StockBalancerList";
import { SharedBreadcrumb } from "@/components/shared/SharedBreadcrumb";
import { FadeInUp } from "@/components/shared/motion";
import { Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Stock Balancer | Opal & Melamine Stock Balancer",
  description: "View aggregated stock balance for all items",
};

export default function StockBalancerPage() {
  return (
    <div className="flex-1 flex flex-col gap-6 p-4 md:p-8 pt-6">
      {/* Breadcrumb */}
      <SharedBreadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Stock Balancer" },
        ]}
      />

      {/* Page Header */}
      <FadeInUp delay={0.0} duration={0.45}>
        <div className="flex items-center gap-4">
          <div
            className="h-12 w-12 rounded-[12px] flex items-center justify-center shrink-0"
            style={{
              backgroundImage: "var(--gradient-primary-button)",
              boxShadow:       "var(--glow-primary-cta)",
            }}
          >
            <Scale className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1
              style={{
                fontFamily:    "var(--font-geist)",
                fontSize:      "var(--text-display-md)",
                fontWeight:    700,
                color:         "var(--text-primary)",
                letterSpacing: "var(--tracking-tight)",
                lineHeight:    "var(--leading-display-md)",
              }}
            >
              Stock Balancer
            </h1>
            <p style={{ fontSize: "var(--text-body-md)", color: "var(--text-secondary)" }}>
              Aggregated real-time stock balance across all items
            </p>
          </div>
        </div>
      </FadeInUp>

      {/* List */}
      <StockBalancerList />
    </div>
  );
}
