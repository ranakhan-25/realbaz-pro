"use client";

import { usePathname } from "next/navigation";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const standaloneRoutes = [
    "/",
    "/pricing",
    "/crm-module",
    "/dashboard",
    "/login",
    "/features",
    "/about",
    "/contact",
    "/services",
  ];

  const isStandalone = standaloneRoutes.some((route) =>
    route === "/" ? pathname === "/" : pathname?.startsWith(route),
  );

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
