import { X } from "lucide-react";

import type { Role } from "@/services/roleService";

interface RoleDetailsProps {
  role: Role;
  onClose: () => void;
}

export default function RoleDetails({ role, onClose }: RoleDetailsProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]">
      <div className="max-h-[calc(100vh-32px)] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Role Details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Review role information and assigned permissions.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            aria-label="Close role details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Role name
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">
              {role.name}
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                ID
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700">
                {String(role.id)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Permissions
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700">
                {role.permissions?.length ?? 0}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Description
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {role.description || "No description provided."}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Assigned permission keys
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(role.permissions?.length ? role.permissions : []).map(
                (permission) => (
                  <span
                    key={String(permission.id)}
                    className="rounded-full bg-[#1D6BB2]/10 px-2.5 py-1 text-xs font-medium text-[#1D6BB2]"
                  >
                    {permission.name || permission.key}
                  </span>
                ),
              )}

              {(!role.permissions || role.permissions.length === 0) && (
                <span className="text-sm text-slate-400">
                  No permissions assigned.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
