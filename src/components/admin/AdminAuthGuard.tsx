"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { getStoredAccessToken } from "@/lib/admin-auth/adminAuthStorage";

export default function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getStoredAccessToken();

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F8FAFC] text-sm text-slate-500">
        Checking admin session...
      </div>
    );
  }

  return <>{children}</>;
}
