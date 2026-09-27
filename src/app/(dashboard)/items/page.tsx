import { Metadata } from "next";
import { ItemsList } from "@/components/items/ItemsList";
import { SharedBreadcrumb } from "@/components/shared/SharedBreadcrumb";

export const metadata: Metadata = {
  title: "Items | Opal Melamine Stock Balancer",
  description: "Manage your inventory items",
};

export default function ItemsPage() {
  return (
    <div className="flex flex-col gap-6">
      <SharedBreadcrumb items={[{ label: "Items" }]} />
      <ItemsList />
    </div>
  );
}
