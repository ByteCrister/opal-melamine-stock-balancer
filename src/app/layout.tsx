import type { Metadata } from "next";
import { geist, inter, geistMono } from "@/styles/fonts";
import { AuthWrapper } from "@/components/wrappers/AuthWrapper";
import { QueryProvider } from "@/components/wrappers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Opal Melamine Stock Balancer",
  description: "Product Management Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthWrapper>
              {children}
              <Toaster />
          </AuthWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
