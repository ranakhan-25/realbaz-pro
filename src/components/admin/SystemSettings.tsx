"use client";

import { Database, Globe, HardDrive, Server, Power } from "lucide-react";
import { useState } from "react";

const systemItems = [
  {
    title: "System Status",
    value: "Operational",
    icon: Server,
  },
  {
    title: "Database",
    value: "Connected",
    icon: Database,
  },
  {
    title: "Storage",
    value: "64% Used",
    icon: HardDrive,
  },
  {
    title: "Environment",
    value: "Production",
    icon: Globe,
  },
];

export default function SystemSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleMaintenanceToggle = () => {
    setMaintenanceMode((prev) => !prev);
  };

  return (
    <section>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">System Settings</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Monitor and configure your RealBiz system.
        </p>
      </div>

      {/* System Status */}
      <div className="grid gap-4 sm:grid-cols-2">
        {systemItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>

                  <h3 className="mt-1 font-semibold">{item.value}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Maintenance Mode */}
      <div className="mt-5 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div
                className={`rounded-lg p-3 ${
                  maintenanceMode
                    ? "bg-destructive/10 text-destructive"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <Power className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold">Maintenance Mode</h3>

                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      maintenanceMode ? "bg-destructive" : "bg-primary"
                    }`}
                  />

                  <p className="text-sm text-muted-foreground">
                    {maintenanceMode ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Temporarily disable the system for maintenance.
            </p>
          </div>

          {/* Toggle Button */}
          <button
            type="button"
            onClick={handleMaintenanceToggle}
            aria-pressed={maintenanceMode}
            className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              maintenanceMode
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            }`}
          >
            {maintenanceMode
              ? "Disable Maintenance Mode"
              : "Enable Maintenance Mode"}
          </button>
        </div>
      </div>
    </section>
  );
}
