"use client";
import { usePathname } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPreview = pathname?.endsWith("/preview");
  if (!useAuthGuard(isPreview)) return null;
  return <>{children}</>;
}
