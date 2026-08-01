"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton({ className, children = "Logout", redirectTo = "/sign-in" }: { className?: string; children?: ReactNode; redirectTo?: string }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace(redirectTo);
      router.refresh();
    }
  }

  return <button className={className} type="button" disabled={loggingOut} onClick={logout}>{loggingOut ? "Logging out…" : children}</button>;
}
