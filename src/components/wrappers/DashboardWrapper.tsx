"use client";

import { useUserStore } from "@/store/useUserStore";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { AppHeader } from "@/components/sidebar/AppHeader";

/**
 * DashboardWrapper (Sidebar & Main Content)
 * 
 * Provides the main layout for authorized users.
 */
export function DashboardWrapper({ children }: { children: React.ReactNode }) {
    const { user, isLoadingUser } = useUserStore();

    if (isLoadingUser) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!user) {
        // Technically NextAuth middleware should prevent this, but just in case
        return null; 
    }

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            <AppSidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden">
                <AppHeader />
                
                {/* Page Content */}
                <div className="p-4 md:p-8 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
