import { DashboardWrapper } from "@/components/wrappers/DashboardWrapper";
import { DropdownsPage } from "@/components/dropdowns/DropdownsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dropdowns | Opal Melamine Stock Balancer",
  description: "Manage system dropdowns and categories.",
};

export default function Dropdowns() {
  return (
    <DashboardWrapper>
      <DropdownsPage />
    </DashboardWrapper>
  );
}
