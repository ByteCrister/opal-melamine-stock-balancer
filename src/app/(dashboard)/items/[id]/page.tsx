import { Metadata } from "next";
import EditItemPage from "@/components/items/new/EditItemPage";

export const metadata: Metadata = {
  title: "Edit Item | Opal Melamine Stock Balancer",
  description: "Edit an existing item in your inventory",
};

export default function Page() {
  return <EditItemPage />;
}
