"use client";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import AdminShell from "@/components/layout/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!useAuthGuard()) return null;
  return <AdminShell>{children}</AdminShell>;
}
