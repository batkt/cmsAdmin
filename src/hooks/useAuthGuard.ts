"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

const DEV_AUTH = process.env.NEXT_PUBLIC_DEV_AUTH === "1";

/**
 * Guards a route behind authentication.
 * Returns true when the page should render, false while loading or unauthenticated.
 * Pass skip=true for publicly accessible pages (e.g. preview routes).
 */
export function useAuthGuard(skip = false): boolean {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (!DEV_AUTH && !skip && hasHydrated && !user) router.replace("/login");
  }, [user, hasHydrated, router, skip]);

  return DEV_AUTH || skip || (hasHydrated && !!user);
}
