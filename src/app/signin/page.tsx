/**
 * @file src/app/signin/page.tsx
 *
 * Sign-in page — `/signin`
 *
 * This file is purely a Server Component used to define the route and metadata.
 * The actual UI is rendered via the SignInView component.
 */

import type { Metadata } from "next";
import { SignInView }    from "@/components/signin/SignInView";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
    title:       "Sign in — Opal Melamine Stock Balancer",
    description: "Sign in to your account to manage inventory and stock movements.",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SignInPage() {
    return <SignInView />;
}
