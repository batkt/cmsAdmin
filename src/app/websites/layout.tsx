"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import AdminShell from "@/components/layout/AdminShell";

export default function WebsitesLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  if (!user) return null;

  // Editor is full-screen — no sidebar wrapper
  if (pathname.includes("/edit")) return <>{children}</>;

  return <AdminShell>{children}</AdminShell>;
}
