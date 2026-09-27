import type { Metadata } from "next";
import { geist, inter, geistMono } from "@/styles/fonts";
import { AuthWrapper } from "@/components/wrappers/AuthWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Opal Melamine Stock Balancer",
  description: "Product Management Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthWrapper>
            {children}
        </AuthWrapper>
      </body>
    </html>
  );
}
