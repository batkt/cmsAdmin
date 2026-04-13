"use client";
import { usePathname } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import AdminShell from "@/components/layout/AdminShell";

export default function WebsitesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (!useAuthGuard()) return null;
  if (pathname.includes("/edit")) return <>{children}</>;
  return <AdminShell>{children}</AdminShell>;
}
