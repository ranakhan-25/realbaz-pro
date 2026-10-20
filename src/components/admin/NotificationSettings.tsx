"use client";

import { useState } from "react";

const notifications = [
  {
    title: "Email Notifications",
    description: "Receive important updates through email.",
  },
  {
    title: "Security Alerts",
    description: "Get notified about suspicious activities.",
  },
  {
    title: "System Updates",
    description: "Receive system maintenance notifications.",
  },
  {
    title: "User Activities",
    description: "Get updates about important user activities.",
  },
];

export default function NotificationSettings() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    "Email Notifications": true,
    "Security Alerts": true,
    "System Updates": false,
    "User Activities": true,
  });

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Control how you receive system notifications.
        </p>
      </div>

      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {notifications.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between gap-5 p-5"
          >
            <div>
              <h3 className="font-medium">{item.title}</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setEnabled((prev) => ({
                  ...prev,
                  [item.title]: !prev[item.title],
                }))
              }
              className={`relative h-6 w-11 rounded-full transition ${
                enabled[item.title] ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  enabled[item.title] ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
