"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Header } from "@/components/navigation/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "LearnHub - Learn and Grow",
  description: "LearnHub is a platform for online learning and teaching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname?.includes("/dashboard");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {!isDashboard && <Header />}
            {children}
            <ToastProvider />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
