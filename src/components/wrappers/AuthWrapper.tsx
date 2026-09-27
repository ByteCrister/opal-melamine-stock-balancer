"use client";

import { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useUserStore } from "@/store/useUserStore";

function AuthSync({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const fetchUser = useUserStore((state) => state.fetchUser);
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        if (status === "authenticated" && !user) {
            fetchUser();
        }
    }, [status, fetchUser, user]);

    return <>{children}</>;
}

/**
 * AuthWrapper
 * 
 * Provides NextAuth session context and ensures the Zustand store 
 * stays in sync with the session. Once a session is established, it triggers 
 * the fetchUser() action to populate the global state with full user details.
 */
export function AuthWrapper({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthSync>{children}</AuthSync>
        </SessionProvider>
    );
}
