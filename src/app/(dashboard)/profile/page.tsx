import { SharedBreadcrumb } from "@/components/shared/SharedBreadcrumb";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AuditLogsSection } from "@/components/profile/AuditLogsSection";
import { Metadata } from "next";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/shared/motion";

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
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full relative px-4 sm:px-0 mt-4">
      <FadeInUp delay={0.1}>
        <SharedBreadcrumb items={breadcrumbItems} />
      </FadeInUp>

      <FadeInUp delay={0.15}>
        <div>
          <h1 className="text-display-md font-geist font-medium text-foreground mb-1 tracking-tight">My Profile</h1>
          <p className="text-muted text-body-md font-body">
            Manage your personal information and preferences.
          </p>
        </div>
      </FadeInUp>

      <StaggerContainer delay={0.2} className="flex flex-col gap-6 mt-2">
        <StaggerItem>
          <ProfileForm />
        </StaggerItem>
        <StaggerItem>
          <AuditLogsSection />
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}
