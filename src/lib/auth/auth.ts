/**
 * @file src/auth.ts
 *
 * NextAuth v5 (beta) configuration.
 *
 * Auth strategy:
 * - Credentials: pre-verified via /api/auth/verify-credentials before
 *   calling signIn() on the client. The authorize() callback here only
 *   validates the token passed from that pre-check, NOT the raw password —
 *   avoids double-hashing in the NextAuth callback.
 *
 * - Google OAuth: only existing users (in DB) are allowed through.
 *   New Google accounts that don't have a matching email → error.
 */

import NextAuth, { type DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import ConnectDB from "@/config/db";
import UserModel from "@/models/user.model";
import { env } from "@/config/env";

// ---------------------------------------------------------------------------
// Type augmentation — add id + role to session.user
// ---------------------------------------------------------------------------

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}

// ---------------------------------------------------------------------------
// NextAuth config
// ---------------------------------------------------------------------------

export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: env.AUTH_SECRET,

    session: { 
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    pages: {
        signIn: "/signin",
        error:  "/signin",
    },

    providers: [
        // ------------------------------------------------------------------
        // Google OAuth
        // Only allow sign-in if the user already exists in the DB.
        // ------------------------------------------------------------------
        GoogleProvider({
            clientId:     env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "select_account",
                },
            },
        }),

        // ------------------------------------------------------------------
        // Credentials
        // At this point the email/password have already been verified by the
        // pre-check API (/api/auth/verify-credentials). The client passes
        // the user id as `verifiedUserId` to confirm the pre-check passed.
        // ------------------------------------------------------------------
        CredentialsProvider({
            name: "credentials",
            credentials: {
                verifiedUserId: { type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.verifiedUserId) return null;

                await ConnectDB();
                const user = await UserModel.findOne({
                    _id: credentials.verifiedUserId,
                    deletedAt: null,
                }).lean();

                if (!user) return null;

                return {
                    id:    user._id.toString(),
                    name:  user.name,
                    email: user.email,
                };
            },
        }),
    ],

    callbacks: {
        // ------------------------------------------------------------------
        // Google signIn callback — block unknown users
        // ------------------------------------------------------------------
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                await ConnectDB();
                const existing = await UserModel.findOne({
                    email:     user.email,
                    deletedAt: null,
                }).lean();

                if (!existing) {
                    // Returning a URL redirects to that URL with error param
                    return "/signin?error=AccountNotFound";
                }
            }

            return true;
        },

        // ------------------------------------------------------------------
        // JWT — persist user id in token
        // ------------------------------------------------------------------
        async jwt({ token, user }) {
            if (user?.id) {
                token.id = user.id;
            }
            return token;
        },

        // ------------------------------------------------------------------
        // Session — expose user id to client
        // ------------------------------------------------------------------
        async session({ session, token }) {
            if (token.id) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
});
