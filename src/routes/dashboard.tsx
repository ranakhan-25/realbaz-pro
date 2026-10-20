import { Outlet, createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { getSession, type Session } from "@/lib/auth";
import { isModuleKey, type ModuleKey } from "@/lib/menus";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — RealBiz" },
      {
        name: "description",
        content: "RealBiz operations dashboard: projects, inventory, accounts, HRM, CRM and more.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const s = getSession();
    if (!s) navigate({ to: "/login", replace: true });
    else setSession(s);
  }, [navigate]);

  const rest = pathname.replace(/^\/dashboard\/?/, "");
  const [first = "", ...restParts] = rest.split("/").filter(Boolean);
  const module: ModuleKey = isModuleKey(first) ? first : "project";
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
      <Topbar session={session} onMenu={() => setOpen(true)} search={search} onSearch={setSearch} />
      <div className="flex">
        <Sidebar
          module={module}
          activePath={activePath}
          open={open}
          onClose={() => setOpen(false)}
          filter={search}
        />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
