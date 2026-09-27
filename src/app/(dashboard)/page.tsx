import { DashboardContent } from "@/components/dashboard/DashboardContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Opal Melamine Stock Balancer",
  description: "Real-time overview of stock movements, inventory KPIs, category breakdowns, and top-moving products for Opal Melamine.",
};

export default function Home() {
  return (
    <DashboardContent />
  );
}
