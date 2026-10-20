import Link from "next/link";

import { findNode, type MenuNode, type ModuleKey } from "@/lib/menus";

import AccountsDashboard from "./AccountsDashboard";
import AllDashboard from "./AllDashboard";
import CrDashboard from "./CrDashboard";
import CrmDashboard from "./CrmDashboard";
import HrmDashboard from "./HrmDashboard";
import InventoryDashboard from "./InventoryDashboard";
import LamsDashboardWrapper from "./LamsDashboardWrapper";
import ProcurementDashboard from "./ProcurementDashboard";
import ProjectsDashboard from "./ProjectsDashboard";

const KPIS = [
  {
    label: "Active projects",
    value: "38",
    note: "▲ 4 this qtr",
    hot: true,
  },
  {
    label: "Revenue YTD",
    value: "৳ 1.9B",
    note: "of ৳ 2.6B target",
  },
  {
    label: "Open work orders",
    value: "127",
    note: "23 overdue",
  },
  {
    label: "On-time delivery",
    value: "99.2%",
    note: "rolling 90 days",
    lime: true,
  },
];

const ROWS = [
  {
    name: "Riverside Horizon",
    type: "Residential",
    pct: 68,
    status: "On track",
    budget: "৳ 420M",
  },
  {
    name: "Meridian Tower",
    type: "Commercial",
    pct: 41,
    status: "In build",
    budget: "৳ 780M",
  },
  {
    name: "Meridian Yards",
    type: "Mixed-use",
    pct: 88,
    status: "Handover",
    budget: "৳ 315M",
  },
  {
    name: "Greenfield Court",
    type: "Residential",
    pct: 12,
    status: "Planning",
    budget: "৳ 260M",
  },
];

const statusClass: Record<string, string> = {
  "On track": "bg-accent/20 text-foreground",
  "In build": "bg-primary text-primary-foreground",
  Handover: "bg-signal/15 text-signal",
  Planning: "bg-foreground/10 text-foreground/70",
};

export function ModulePage({
  module,
  path,
}: {
  module: ModuleKey;
  path: string;
}) {
  if (module === "lams") {
    return (
      <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-8">
        <LamsDashboardWrapper path={path} />
      </div>
    );
  }

  const node = path ? findNode(module, path) : undefined;

  const crumbs = path.split("/").filter(Boolean);

  const title = node?.label ?? "Overview";

  const isOverview = !path || node?.slug === "dashboard";

  /*
   * ==========================================
   * CONDITIONAL DASHBOARD COMPONENT
   * ==========================================
   */

  const renderModuleDashboard = () => {
    // Only overview/dashboard route
    if (!isOverview) {
      return null;
    }

    switch (module) {
      case "inventory":
        return <InventoryDashboard />;

      case "accounts":
        return <AccountsDashboard />;

      case "crm":
        return <CrmDashboard />;

      case "hrm":
        return <HrmDashboard />;

      case "project":
        return <ProjectsDashboard />;

      case "cr":
        return <CrDashboard />;

      case "procurement":
        return <ProcurementDashboard />;

      case "all":
        return <AllDashboard />;

      default:
        return null;
    }
  };

  const moduleDashboard = renderModuleDashboard();

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8">
      {/* ==========================================
          CUSTOM MODULE DASHBOARD
      ========================================== */}

      {moduleDashboard ? (
        <div className="mt-6">{moduleDashboard}</div>
      ) : node?.children?.length ? (
        /* ==========================================
           CHILD MENU
        ========================================== */

        <div className=" grid gap-4 sm:grid-cols-2 mt-6 lg:grid-cols-3">
          {node.children.map((c: MenuNode) => (
            <Link
              key={c.path}
              href={`/dashboard/${module}/${c.path}`}
              className="
                group rounded-xl border border-border
                bg-card p-5 transition
                hover:-translate-y-0.5 hover:shadow-lg
              "
            >
              <div className="font-display text-lg font-semibold">
                {c.label}
              </div>

              <div className="mt-1 text-sm text-muted-foreground">
                {c.children?.length ? `${c.children.length} sections` : "Open"}
              </div>

              <div
                className="
                  mt-3 text-sm font-semibold text-foreground/70
                  transition group-hover:translate-x-1
                "
              >
                Open →
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* ==========================================
           GENERIC PAGE
        ========================================== */

        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {KPIS.map((k) => (
              <div
                key={k.label}
                className="
                  rounded-xl border border-border
                  bg-card p-5
                "
              >
                <div
                  className="
                    text-xs font-semibold uppercase
                    tracking-wide text-muted-foreground
                  "
                >
                  {k.label}
                </div>

                <div
                  className={`mt-2 font-display text-3xl font-bold ${k.lime ? "text-accent" : ""}`}
                >
                  {k.value}
                </div>

                {k.hot ? (
                  <div
                    className="
                      mt-1 inline-block -skew-x-6
                      bg-primary px-1.5 py-0.5
                      text-xs font-semibold
                      text-primary-foreground
                    "
                  >
                    {k.note}
                  </div>
                ) : (
                  <div className="mt-1 text-xs font-medium text-muted-foreground">
                    {k.note}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-lg font-semibold">
                {isOverview ? "Projects" : `${title} list`}
              </h2>

              <span className="text-xs font-semibold text-muted-foreground">
                Updated 2 min ago
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-border text-[11px] uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Project</th>

                    <th className="px-5 py-3 font-semibold">Type</th>

                    <th className="px-5 py-3 font-semibold">Progress</th>

                    <th className="px-5 py-3 font-semibold">Status</th>

                    <th className="px-5 py-3 text-right font-semibold">
                      Budget
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {ROWS.map((r) => (
                    <tr key={r.name} className="hover:bg-foreground/[0.03]">
                      <td className="px-5 py-3.5 font-semibold">{r.name}</td>

                      <td className="px-5 py-3.5 text-muted-foreground">
                        {r.type}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-28 rounded-full bg-foreground/10">
                            <div
                              className="h-1.5 rounded-full bg-accent"
                              style={{
                                width: `${r.pct}%`,
                              }}
                            />
                          </div>

                          <span className="font-mono text-xs text-muted-foreground">
                            {r.pct}%
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-bold ${
                            statusClass[r.status]
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right font-mono">
                        {r.budget}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
