/* eslint-disable prettier/prettier */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { getSession, type Session } from "@/lib/auth";
import { isModuleKey, type ModuleKey } from "@/lib/menus";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const s = getSession();
    if (!s) router.replace("/login");
    else setSession(s);
  }, [router]);

  const rest = pathname.replace(/^\/dashboard\/?/, "");
  const [first = "", ...restParts] = rest.split("/").filter(Boolean);
  const moduleKey: ModuleKey = isModuleKey(first) ? first : "project";
  const activePath = restParts.join("/");

  if (!session) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Loading workspace…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Topbar
        session={session}
        onMenu={() => setOpen(true)}
        search={search}
        onSearch={setSearch}
      />
      <div className="flex">
        <Sidebar
          module={moduleKey}
          activePath={activePath}
          open={open}
          onClose={() => setOpen(false)}
          filter={search}
        />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
