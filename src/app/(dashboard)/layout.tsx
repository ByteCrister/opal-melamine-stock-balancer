import { DashboardWrapper } from "@/components/wrappers/DashboardWrapper";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardWrapper>{children}</DashboardWrapper>;
}
