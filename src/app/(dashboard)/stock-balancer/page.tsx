import { Metadata } from "next";
import { StockBalancerList } from "@/components/stock-balancer/StockBalancerList";
import { SharedBreadcrumb } from "@/components/shared/SharedBreadcrumb";

export const metadata: Metadata = {
  title: "Stock Balancer | Opal & Melamine Stock Balancer",
  description: "View aggregated stock balance for all items",
};

export default function StockBalancerPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <SharedBreadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Stock Balancer" },
        ]}
      />
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Stock Balancer</h2>
      </div>
      <StockBalancerList />
    </div>
  );
}
