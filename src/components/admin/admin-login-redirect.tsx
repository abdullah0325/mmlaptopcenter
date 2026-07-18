"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminLoginRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const callbackUrl = pathname || "/admin/dashboard";
    router.replace(`/admin/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }, [pathname, router]);

  return null;
}
