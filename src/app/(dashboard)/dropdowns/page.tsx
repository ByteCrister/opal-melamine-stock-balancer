import { Metadata } from "next";
import { DropdownsPage } from "@/components/dropdowns/DropdownsPage";

export const metadata: Metadata = {
  title: "Dropdowns | Opal Melamine Stock Balancer",
  description: "Manage system dropdowns and categories.",
};

export default function Dropdowns() {
  return <DropdownsPage />;
}
