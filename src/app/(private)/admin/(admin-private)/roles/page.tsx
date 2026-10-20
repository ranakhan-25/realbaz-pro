"use client";

import { motion } from "framer-motion";
import {
  Edit3,
  Eye,
  KeyRound,
  Loader2,
  Plus,
  Search,
  Shield,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  deleteRole,
  getRole,
  getRoles,
  type Role,
} from "@/services/roleService";

import RoleDetails from "@/components/modules/roles/RoleDetails";
import { useTheme } from "@/lib/theme";

import RolePermissionModal, {
  Modal,
  type RolePermissionData,
  type RolePermissionSavePayload,
} from "./Modal";

/* -------------------------------------------------------------------------- */
/*                                DEMO ROLES                                  */
/* -------------------------------------------------------------------------- */

const DEMO_ROLES: Role[] = [
  {
    id: 1,
    name: "Super Admin",
    description: "Full access to all system modules and management tools.",
    permissions: [
      {
        id: 1,
        name: "Create Users",
        key: "users.create",
        action: "create",
      },
      {
        id: 2,
        name: "Manage Roles",
        key: "roles.manage",
        action: "update",
      },
      {
        id: 3,
        name: "View Reports",
        key: "reports.view",
        action: "read",
      },
    ],
  },
  {
    id: 2,
    name: "Project Manager",
    description: "Can manage project workflows and daily operational tasks.",
    permissions: [
      {
        id: 4,
        name: "Project Access",
        key: "projects.read",
        action: "read",
      },
      {
        id: 5,
        name: "Update Project",
        key: "projects.update",
        action: "update",
      },
    ],
  },
  {
    id: 3,
    name: "Sales Team",
    description: "Limited access for sales pipeline, leads, and follow-ups.",
    permissions: [
      {
        id: 6,
        name: "View Leads",
        key: "leads.view",
        action: "read",
      },
      {
        id: 7,
        name: "Create Leads",
        key: "leads.create",
        action: "create",
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                                ROLES PAGE                                  */
/* -------------------------------------------------------------------------- */

export default function RolesPage() {
  const { primaryColor } = useTheme();

  /* ------------------------------------------------------------------------ */
  /* STATE                                                                    */
  /* ------------------------------------------------------------------------ */

  const [permissionModalOpen, setPermissionModalOpen] = useState(false);

  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [viewingId, setViewingId] = useState<string | number | null>(null);

  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const [deleteError, setDeleteError] = useState("");

  const loadRequestIdRef = useRef(0);
  const viewRequestIdRef = useRef(0);

  /* ------------------------------------------------------------------------ */
  /* LOAD ROLES                                                               */
  /* ------------------------------------------------------------------------ */

  const loadRoles = useCallback(async () => {
    const requestId = ++loadRequestIdRef.current;

    try {
      setLoading(true);
      setError("");

      const data = await getRoles();

      if (requestId !== loadRequestIdRef.current) {
        return;
      }

      if (!Array.isArray(data) || data.length === 0) {
        setRoles(DEMO_ROLES);
        setError("Using demo data because the API is returning no roles.");
        return;
      }

      setRoles(data);
    } catch (err) {
      if (requestId !== loadRequestIdRef.current) {
        return;
      }

      setRoles(DEMO_ROLES);

      setError(
        err instanceof Error
          ? `${err.message} Using demo data instead.`
          : "Using demo data because the backend is unavailable.",
      );
    } finally {
      if (requestId === loadRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  /* ------------------------------------------------------------------------ */
  /* ADD ROLE                                                                 */
  /* ------------------------------------------------------------------------ */

  const handleAddRole = () => {
    setEditingRole(null);
    setPermissionModalOpen(true);
  };

  /* ------------------------------------------------------------------------ */
  /* EDIT ROLE                                                                */
  /* ------------------------------------------------------------------------ */

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setPermissionModalOpen(true);
  };

  /* ------------------------------------------------------------------------ */
  /* CLOSE PERMISSION MODAL                                                   */
  /* ------------------------------------------------------------------------ */

  const closePermissionModal = () => {
    setPermissionModalOpen(false);
    setEditingRole(null);
  };

  /* ------------------------------------------------------------------------ */
  /* VIEW ROLE                                                                */
  /* ------------------------------------------------------------------------ */

  const handleView = async (role: Role) => {
    const requestId = ++viewRequestIdRef.current;

    setViewingId(role.id);
    setError("");

    try {
      const fullRole = await getRole(role.id);

      if (requestId !== viewRequestIdRef.current) {
        return;
      }

      setSelectedRole(fullRole);
    } catch (err) {
      if (requestId !== viewRequestIdRef.current) {
        return;
      }

      setError(err instanceof Error ? err.message : "Failed to load role.");
    } finally {
      if (requestId === viewRequestIdRef.current) {
        setViewingId(null);
      }
    }
  };

  /* ------------------------------------------------------------------------ */
  /* DELETE ROLE                                                              */
  /* ------------------------------------------------------------------------ */

  const requestDelete = (role: Role) => {
    setDeleteError("");
    setRoleToDelete(role);
  };

  const closeDeleteModal = () => {
    if (deletingId !== null) {
      return;
    }

    setRoleToDelete(null);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!roleToDelete || deletingId !== null) {
      return;
    }

    setDeletingId(roleToDelete.id);
    setDeleteError("");

    try {
      await deleteRole(roleToDelete.id);

      setRoleToDelete(null);
      setDeleteError("");

      await loadRoles();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete role.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* FILTER ROLES                                                             */
  /* ------------------------------------------------------------------------ */

  const filteredRoles = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return roles;
    }

    return roles.filter((role) =>
      `${role.name} ${role.description ?? ""}`.toLowerCase().includes(query),
    );
  }, [roles, search]);

  /* ------------------------------------------------------------------------ */
  /* PERMISSION API LOADER                                                    */
  /* ------------------------------------------------------------------------ */

  const loadPermissionData =
    useCallback(async (): Promise<RolePermissionData> => {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!apiUrl) {
        throw new Error("API base URL is not configured.");
      }

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(`${apiUrl}/roles/permissions`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Permission API failed with status ${response.status}`);
      }

      const result: unknown = await response.json();

      /* -------------------------------------------------------------------- */
      /* Wrapped response                                                     */
      /* -------------------------------------------------------------------- */

      if (typeof result === "object" && result !== null && "data" in result) {
        const wrapped = result as {
          data?: RolePermissionData;
        };

        if (wrapped.data && Array.isArray(wrapped.data.roles)) {
          return wrapped.data;
        }
      }

      /* -------------------------------------------------------------------- */
      /* Direct response                                                      */
      /* -------------------------------------------------------------------- */

      if (typeof result === "object" && result !== null && "roles" in result) {
        const direct = result as RolePermissionData;

        if (Array.isArray(direct.roles)) {
          return direct;
        }
      }

      throw new Error("Invalid permission API response.");
    }, []);

  /* ------------------------------------------------------------------------ */
  /* SAVE ROLE + PERMISSIONS                                                  */
  /* ------------------------------------------------------------------------ */

  const handlePermissionSave = async (payload: RolePermissionSavePayload) => {
    try {
      console.log("Role permission payload:", payload);

      /*
       * Connect your actual create/update API here.
       *
       * Example:
       *
       * if (editingRole) {
       *   await updateRole(editingRole.id, payload);
       * } else {
       *   await createRole(payload);
       * }
       */

      closePermissionModal();

      await loadRoles();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save role permissions.",
      );
    }
  };

  /* ------------------------------------------------------------------------ */
  /* UI                                                                       */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="w-full">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <section className="mb-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${primaryColor}1A`,
                  color: primaryColor,
                }}
              >
                <Shield className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Role Management
                </h1>

                <p className="mt-0.5 text-sm text-slate-500">
                  Manage roles and their assigned permissions.
                </p>
              </div>
            </div>
          </div>

          {/* ADD ROLE */}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddRole}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md active:scale-[0.98]"
              style={{
                backgroundColor: primaryColor,
              }}
            >
              <Plus className="h-4 w-4" />
              Add Role
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* ERROR                                                              */}
      {/* ------------------------------------------------------------------ */}

      {error && (
        <motion.div
          initial={{
            opacity: 0,
            y: -5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          role="alert"
          className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
            className="ml-4 font-semibold text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </motion.div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TABLE                                                              */}
      {/* ------------------------------------------------------------------ */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* SEARCH */}

        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              System Roles
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              {filteredRoles.length}{" "}
              {filteredRoles.length === 1 ? "role" : "roles"} available
            </p>
          </div>

          <div className="relative w-full sm:w-[280px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search roles..."
              aria-label="Search roles"
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:bg-white"
              onFocus={(event) => {
                event.currentTarget.style.borderColor = primaryColor;

                event.currentTarget.style.boxShadow = `0 0 0 4px ${primaryColor}1A`;
              }}
              onBlur={(event) => {
                event.currentTarget.style.borderColor = "";
                event.currentTarget.style.boxShadow = "";
              }}
            />
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Role
                </th>

                <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Description
                </th>

                <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Permissions
                </th>

                <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Created
                </th>

                <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* LOADING */}

              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-20 text-center">
                    <Loader2
                      className="mx-auto h-6 w-6 animate-spin"
                      style={{
                        color: primaryColor,
                      }}
                    />

                    <p className="mt-3 text-sm font-medium text-slate-500">
                      Loading roles...
                    </p>
                  </td>
                </tr>
              ) : filteredRoles.length === 0 ? (
                /* EMPTY */

                <tr>
                  <td colSpan={5} className="px-5 py-20 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                      <Shield className="h-6 w-6 text-slate-300" />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      No roles found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {search
                        ? "Try changing your search query."
                        : "Create your first role to get started."}
                    </p>
                  </td>
                </tr>
              ) : (
                /* ROLES */

                filteredRoles.map((role, index) => (
                  <motion.tr
                    key={role.id}
                    initial={{
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.025,
                    }}
                    className="group transition-colors hover:bg-slate-50/80"
                  >
                    {/* ROLE */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: `${primaryColor}1A`,
                            color: primaryColor,
                          }}
                        >
                          <Shield className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {role.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            ID: {role.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* DESCRIPTION */}

                    <td className="px-5 py-4">
                      <p className="max-w-[360px] truncate text-sm text-slate-500">
                        {role.description || "No description available"}
                      </p>
                    </td>

                    {/* PERMISSIONS */}

                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                        style={{
                          backgroundColor: `${primaryColor}1A`,
                          color: primaryColor,
                        }}
                      >
                        <KeyRound className="h-3.5 w-3.5" />

                        {role.permissions?.length ?? 0}

                        <span
                          style={{
                            opacity: 0.7,
                          }}
                        >
                          permissions
                        </span>
                      </span>
                    </td>

                    {/* CREATED */}

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                      {role.createdAt
                        ? new Date(role.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {/* VIEW */}

                        <button
                          type="button"
                          onClick={() => void handleView(role)}
                          disabled={viewingId === role.id}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                          title="View role"
                          aria-label={`View ${role.name}`}
                          onMouseEnter={(event) => {
                            if (viewingId !== role.id) {
                              event.currentTarget.style.color = primaryColor;

                              event.currentTarget.style.backgroundColor = `${primaryColor}15`;
                            }
                          }}
                          onMouseLeave={(event) => {
                            event.currentTarget.style.color = "";

                            event.currentTarget.style.backgroundColor = "";
                          }}
                        >
                          {viewingId === role.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>

                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() => handleEdit(role)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
                          title="Edit role"
                          aria-label={`Edit ${role.name}`}
                          onMouseEnter={(event) => {
                            event.currentTarget.style.color = primaryColor;

                            event.currentTarget.style.backgroundColor = `${primaryColor}15`;
                          }}
                          onMouseLeave={(event) => {
                            event.currentTarget.style.color = "";

                            event.currentTarget.style.backgroundColor = "";
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() => requestDelete(role)}
                          disabled={deletingId === role.id}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete role"
                          aria-label={`Delete ${role.name}`}
                        >
                          {deletingId === role.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* BOTTOM */}

        {!loading && filteredRoles.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/40 px-5 py-3">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-600">
                {filteredRoles.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-600">
                {roles.length}
              </span>{" "}
              roles
            </p>
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CREATE / EDIT ROLE + PERMISSIONS                                   */}
      {/* ------------------------------------------------------------------ */}

      <RolePermissionModal
        open={permissionModalOpen}
        onClose={closePermissionModal}
        loadData={loadPermissionData}
        title={
          editingRole ? "Edit Role & Permissions" : "Create Role & Permissions"
        }
        role={editingRole}
        onSave={handlePermissionSave}
      />

      {/* ------------------------------------------------------------------ */}
      {/* VIEW ROLE                                                          */}
      {/* ------------------------------------------------------------------ */}

      {selectedRole && (
        <RoleDetails
          role={selectedRole}
          onClose={() => setSelectedRole(null)}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* DELETE CONFIRMATION                                                */}
      {/* ------------------------------------------------------------------ */}

      {roleToDelete && (
        <Modal
          onClose={closeDeleteModal}
          labelledBy="delete-role-heading"
          maxWidthClass="max-w-md"
          closeOnOverlayClick={deletingId === null}
        >
          <div className="space-y-4 p-6">
            <h2
              id="delete-role-heading"
              className="text-lg font-bold text-slate-900"
            >
              Delete role?
            </h2>

            <p className="text-sm text-slate-500">
              This will permanently remove{" "}
              <span className="font-semibold text-slate-700">
                {roleToDelete.name}
              </span>
              . Any users currently assigned this role may lose its permissions.
              This action cannot be undone.
            </p>

            {deleteError && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600"
              >
                {deleteError}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deletingId !== null}
                className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void confirmDelete()}
                disabled={deletingId !== null}
                className="flex h-10 items-center gap-2 rounded-xl bg-red-500 px-4 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId !== null && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}
