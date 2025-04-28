"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/navigation/Header";

export function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.includes("/dashboard");

  return (
    <>
      {!isDashboard && <Header />}
      {children}
    </>
  );
} 