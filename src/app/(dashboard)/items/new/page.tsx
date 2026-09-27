import { Metadata } from "next";
import { ItemForm } from "@/components/items/ItemForm";
import { SharedBreadcrumb } from "@/components/shared/SharedBreadcrumb";

export const metadata: Metadata = {
  title: "Add New Item | Opal Melamine Stock Balancer",
  description: "Add a new item to your inventory",
};

export default function NewItemPage() {
  return (
    <div className="flex flex-col gap-6">
      <SharedBreadcrumb
        items={[
          { label: "Items", href: "/items" },
          { label: "Add New Item" },
        ]}
      />
      <ItemForm />
    </div>
  );
}
