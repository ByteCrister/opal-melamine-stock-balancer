import { DashboardWrapper } from "@/components/wrappers/DashboardWrapper";

export default function Home() {
  return (
    <DashboardWrapper>
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-sans font-medium text-foreground">Welcome to Opal Melamine</h1>
            <p className="text-muted text-sm font-body max-w-2xl">
                The dashboard is currently empty. This area will be populated with stock balancing metrics, recent audits, and inventory controls soon.
            </p>
        </div>
    </DashboardWrapper>
  );
}
