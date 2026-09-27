import { SharedBreadcrumb } from "@/components/shared/SharedBreadcrumb";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AuditLogsSection } from "@/components/profile/AuditLogsSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Opal Melamine Stock Balancer",
  description: "Manage your profile and account settings.",
};

export default function ProfilePage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Profile" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <SharedBreadcrumb items={breadcrumbItems} />
      
      <div>
        <h1 className="text-display-md font-geist font-medium text-foreground mb-2 tracking-tight">My Profile</h1>
        <p className="text-muted text-body-lg font-body">
          Manage your personal information and preferences.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-8">
        <ProfileForm />
        <AuditLogsSection />
      </div>
    </div>
  );
}
