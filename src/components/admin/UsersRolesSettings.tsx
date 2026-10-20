"use client";

import { Plus, Shield, Users } from "lucide-react";

const roles = [
  {
    name: "Super Admin",
    users: 2,
    description: "Full system access",
  },
  {
    name: "Admin",
    users: 8,
    description: "Manage assigned modules",
  },
  {
    name: "Manager",
    users: 15,
    description: "Manage team operations",
  },
  {
    name: "Staff",
    users: 42,
    description: "Limited access",
  },
];

export default function UsersRolesSettings() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users & Roles</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage system users and access roles.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" />
          Add Role
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((role) => (
          <div
            key={role.name}
            className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                  <Shield className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold">{role.name}</h3>

                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {role.users}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
