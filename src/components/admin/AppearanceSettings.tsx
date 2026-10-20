"use client";

import { Monitor, Moon, Sun } from "lucide-react";

const themes = [
  {
    name: "Light",
    icon: Sun,
  },
  {
    name: "Dark",
    icon: Moon,
  },
  {
    name: "System",
    icon: Monitor,
  },
];

export default function AppearanceSettings() {
  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Appearance</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Customize how the Super Admin panel looks.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold">Theme</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Select your preferred theme.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {themes.map((theme) => {
            const Icon = theme.icon;

            return (
              <button
                key={theme.name}
                className="flex flex-col items-center gap-3 rounded-xl border border-border p-6 transition hover:border-primary hover:bg-primary/5"
              >
                <Icon className="h-6 w-6 text-primary" />

                <span className="text-sm font-medium">{theme.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
