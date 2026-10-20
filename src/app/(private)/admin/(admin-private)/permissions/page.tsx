"use client";

import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  Filter,
  KeyRound,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  createPermission,
  deletePermission,
  getPermission,
  getPermissions,
  updatePermission,
  type Permission,
} from "@/services/permissionService";

import { adminAuthStorage } from "@/lib/admin-auth/adminAuthStorage";
import { useTheme } from "@/lib/theme";

const DEMO_PERMISSIONS: Permission[] = [
  {
    id: "perm-1",
    key: "users.manage",
    name: "Manage Users",
    description: "Create, update and deactivate user accounts.",
    resource: "users",
    action: "update",
    context: "any",
    featureId: 1,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-06-01T00:00:00.000Z",
    feature: {
      id: 1,
      name: "User Management",
      moduleId: 1,
      module: { id: 1, name: "Admin" },
    },
  },
  {
    id: "perm-2",
    key: "roles.manage",
    name: "Manage Roles",
    description: "Assign permissions and configure role access.",
    resource: "roles",
    action: "update",
    context: "any",
    featureId: 2,
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-06-01T00:00:00.000Z",
    feature: {
      id: 2,
      name: "Role Access",
      moduleId: 1,
      module: { id: 1, name: "Admin" },
    },
  },
  {
    id: "perm-3",
    key: "projects.read",
    name: "View Projects",
    description: "Read project details and progress data.",
    resource: "projects",
    action: "read",
    context: "any",
    featureId: 3,
    createdAt: "2024-01-03T00:00:00.000Z",
    updatedAt: "2024-06-01T00:00:00.000Z",
    feature: {
      id: 3,
      name: "Project Overview",
      moduleId: 2,
      module: { id: 2, name: "Projects" },
    },
  },
  {
    id: "perm-4",
    key: "sales.leads.create",
    name: "Create Leads",
    description: "Create sales leads and pipeline records.",
    resource: "leads",
    action: "create",
    context: "team",
    featureId: 4,
    createdAt: "2024-01-04T00:00:00.000Z",
    updatedAt: "2024-06-01T00:00:00.000Z",
    feature: {
      id: 4,
      name: "Sales Pipeline",
      moduleId: 3,
      module: { id: 3, name: "CRM" },
    },
  },
];

interface FeatureOption {
  id: string | number;
  name: string;
  key?: string;
}

interface FeatureDropdownResponse {
  data?: unknown;
  items?: unknown;
  results?: unknown;
  features?: unknown;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://backend.garmentech.online/hrm/api/v1";

const FEATURE_ENDPOINT = "/features";

function normalizeFeatureOptions(payload: unknown): FeatureOption[] {
  let list: unknown = payload;

  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const object = payload as FeatureDropdownResponse & Record<string, unknown>;
    list =
      object.features ?? object.data ?? object.items ?? object.results ?? [];
  }

  if (list && typeof list === "object" && !Array.isArray(list)) {
    const object = list as Record<string, unknown>;
    list =
      object.features ?? object.data ?? object.items ?? object.results ?? [];
  }

  if (!Array.isArray(list)) {
    return [];
  }

  const unique = new Map<string, FeatureOption>();

  for (const item of list) {
    if (!item || typeof item !== "object") continue;

    const object = item as Record<string, unknown>;
    const id = object.id ?? object.featureId ?? object.value ?? object._id;

    if (id === undefined || id === null) continue;

    const name =
      object.name ?? object.title ?? object.label ?? object.displayName ?? id;

    const key =
      typeof object.key === "string"
        ? object.key
        : typeof object.code === "string"
          ? object.code
          : undefined;

    const option: FeatureOption = {
      id: id as string | number,
      name: String(name),
      ...(key ? { key } : {}),
    };

    unique.set(String(option.id), option);
  }

  return Array.from(unique.values());
}

async function fetchFeatures(): Promise<FeatureOption[]> {
  const token = adminAuthStorage.getAccessToken();

  if (!token) {
    throw new Error("Unauthorized. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}${FEATURE_ENDPOINT}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    cache: "no-store",
  });

  const text = await response.text();
  let json: unknown = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!response.ok) {
    const object =
      json && typeof json === "object"
        ? (json as Record<string, unknown>)
        : null;

    throw new Error(
      typeof object?.message === "string"
        ? object.message
        : typeof object?.error === "string"
          ? object.error
          : `Failed to load features (${response.status})`,
    );
  }

  return normalizeFeatureOptions(json);
}

const ACTIONS = ["create", "read", "update", "delete", "list"] as const;
const CONTEXTS = ["own", "any", "team", "department"] as const;

type PermissionFormValues = {
  name: string;
  key: string;
  description: string;
  resource: string;
  action: string;
  context: string;
  featureId: string;
};

export default function PermissionsPage() {
  const { primaryColor } = useTheme();

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [action, setAction] = useState("all");
  const [context, setContext] = useState("all");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null,
  );

  const [viewingId, setViewingId] = useState<string | null>(null);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);
  const [viewError, setViewError] = useState("");

  const [permissionToDelete, setPermissionToDelete] =
    useState<Permission | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const loadRequestIdRef = useRef(0);
  const viewRequestIdRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchInput.trim();
      setSearch((current) => (current === trimmed ? current : trimmed));
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [action, context]);

  const loadPermissions = useCallback(async () => {
    const requestId = ++loadRequestIdRef.current;

    try {
      setLoading(true);
      setError("");

      const response = await getPermissions({
        page,
        limit,
        search: search || undefined,
        action: action === "all" ? undefined : action,
        context: context === "all" ? undefined : context,
        sortField: "createdAt",
        sortOrder: "DESC",
      });

      if (requestId !== loadRequestIdRef.current) return;

      const permissionList = Array.isArray(response?.data) ? response.data : [];

      if (permissionList.length === 0) {
        setPermissions(DEMO_PERMISSIONS);
        setTotal(DEMO_PERMISSIONS.length);
        setTotalPages(1);
        setError(
          "Using demo data because the API is returning no permissions.",
        );
        return;
      }

      setPermissions(permissionList);
      setTotal(Number(response?.meta?.total ?? permissionList.length));
      setTotalPages(Math.max(Number(response?.meta?.totalPages ?? 1), 1));
    } catch (err) {
      if (requestId !== loadRequestIdRef.current) return;

      setError(
        err instanceof Error
          ? `${err.message} Using demo data instead.`
          : "Using demo data because the backend is unavailable.",
      );

      setPermissions(DEMO_PERMISSIONS);
      setTotal(DEMO_PERMISSIONS.length);
      setTotalPages(1);
    } finally {
      if (requestId === loadRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, [page, limit, search, action, context]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || loading || newPage === page) {
      return;
    }
    setPage(newPage);
  };

  const openCreate = () => {
    setEditingPermission(null);
    setShowForm(true);
  };

  const openEdit = (permission: Permission) => {
    setEditingPermission(permission);
    setShowForm(true);
  };

  const openView = async (permission: Permission) => {
    const requestId = ++viewRequestIdRef.current;
    setViewingId(permission.id);
    setViewError("");

    try {
      const full = await getPermission(permission.id);
      if (requestId !== viewRequestIdRef.current) return;
      setSelectedPermission(full);
    } catch (err) {
      if (requestId !== viewRequestIdRef.current) return;
      setSelectedPermission(permission);
      setViewError(
        err instanceof Error
          ? err.message
          : "Couldn't load full details. Showing available data.",
      );
    } finally {
      if (requestId === viewRequestIdRef.current) {
        setViewingId(null);
      }
    }
  };

  const requestDelete = (permission: Permission) => {
    setDeleteError("");
    setPermissionToDelete(permission);
  };

  const confirmDelete = async () => {
    if (!permissionToDelete) return;

    const id = permissionToDelete.id;
    setDeletingId(id);
    setDeleteError("");

    try {
      await deletePermission(id);
      setPermissionToDelete(null);

      if (permissions.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadPermissions();
      }
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete permission.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingPermission(null);
    await loadPermissions();
  };

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);
  const pageNumbers = useMemo(
    () => getPageNumbers(page, totalPages),
    [page, totalPages],
  );

  return (
    <div className="mx-auto max-w-[1600px]">
      {/* HEADER */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Permission Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Define granular permissions for platform resources.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: primaryColor }}
        >
          <Plus className="h-4 w-4" />
          Add Permission
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* FILTERS */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search permissions..."
              aria-label="Search permissions"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:bg-white"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primaryColor;
                e.currentTarget.style.boxShadow = `0 0 0 4px ${primaryColor}1A`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.boxShadow = "";
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              aria-label="Filter by action"
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primaryColor;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "";
              }}
            >
              <option value="all">All Actions</option>
              {ACTIONS.map((value) => (
                <option key={value} value={value}>
                  {capitalize(value)}
                </option>
              ))}
            </select>
          </div>

          <select
            value={context}
            onChange={(e) => setContext(e.target.value)}
            aria-label="Filter by context"
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none"
            onFocus={(e) => {
              e.currentTarget.style.borderColor = primaryColor;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "";
            }}
          >
            <option value="all">All Contexts</option>
            {CONTEXTS.map((value) => (
              <option key={value} value={value}>
                {capitalize(value)}
              </option>
            ))}
          </select>
        </div>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                {[
                  "Permission",
                  "Key",
                  "Module",
                  "Feature",
                  "Resource",
                  "Action",
                  "Context",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    scope="col"
                    className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <Loader2
                      className="mx-auto h-6 w-6 animate-spin"
                      style={{ color: primaryColor }}
                    />
                    <p className="mt-2 text-sm text-slate-400">
                      Loading permissions...
                    </p>
                  </td>
                </tr>
              ) : permissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <KeyRound className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      No permissions found.
                    </p>
                    {(search || action !== "all" || context !== "all") && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchInput("");
                          setSearch("");
                          setAction("all");
                          setContext("all");
                          setPage(1);
                        }}
                        className="mt-3 text-sm font-semibold hover:underline"
                        style={{ color: primaryColor }}
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                permissions.map((permission, index) => (
                  <motion.tr
                    key={permission.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: `${primaryColor}1A`,
                            color: primaryColor,
                          }}
                        >
                          <KeyRound className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800">
                            {permission.name}
                          </p>
                          {permission.description && (
                            <p className="mt-0.5 max-w-xs truncate text-xs text-slate-400">
                              {permission.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <code className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        {permission.key}
                      </code>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {permission.feature?.module?.name || "—"}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {permission.feature?.name || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-500">
                        {permission.resource || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-medium capitalize"
                        style={{
                          backgroundColor: `${primaryColor}1A`,
                          color: primaryColor,
                        }}
                      >
                        {permission.action || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                        {permission.context || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openView(permission)}
                          disabled={viewingId === permission.id}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                          title="View"
                          aria-label={`View ${permission.name}`}
                          onMouseEnter={(e) => {
                            if (viewingId !== permission.id) {
                              e.currentTarget.style.color = primaryColor;
                              e.currentTarget.style.backgroundColor = `${primaryColor}15`;
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "";
                            e.currentTarget.style.backgroundColor = "";
                          }}
                        >
                          {viewingId === permission.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => openEdit(permission)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
                          title="Edit"
                          aria-label={`Edit ${permission.name}`}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = primaryColor;
                            e.currentTarget.style.backgroundColor = `${primaryColor}15`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "";
                            e.currentTarget.style.backgroundColor = "";
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => requestDelete(permission)}
                          disabled={deletingId === permission.id}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete"
                          aria-label={`Delete ${permission.name}`}
                        >
                          {deletingId === permission.id ? (
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

        {/* PAGINATION */}
        {!loading && total > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">{startItem}</span>{" "}
              to <span className="font-semibold text-slate-700">{endItem}</span>{" "}
              of <span className="font-semibold text-slate-700">{total}</span>{" "}
              permissions
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1 || loading}
                onClick={() => goToPage(page - 1)}
                aria-label="Previous page"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {pageNumbers.map((pageNumber, index) =>
                pageNumber === "..." ? (
                  <span
                    key={`dots-${index}`}
                    className="flex h-9 w-9 items-center justify-center text-sm text-slate-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => goToPage(pageNumber)}
                    disabled={loading}
                    aria-current={page === pageNumber ? "page" : undefined}
                    aria-label={`Page ${pageNumber}`}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition disabled:cursor-not-allowed ${
                      page === pageNumber
                        ? "text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                    style={
                      page === pageNumber
                        ? { backgroundColor: primaryColor }
                        : undefined
                    }
                  >
                    {pageNumber}
                  </button>
                ),
              )}

              <button
                type="button"
                disabled={page === totalPages || loading}
                onClick={() => goToPage(page + 1)}
                aria-label="Next page"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showForm && (
        <Modal
          onClose={() => {
            setShowForm(false);
            setEditingPermission(null);
          }}
          labelledBy="permission-form-heading"
          maxWidthClass="max-w-4xl"
        >
          <div className="flex items-start justify-between border-b border-slate-100 px-7 py-5">
            <div>
              <h2
                id="permission-form-heading"
                className="text-lg font-bold text-slate-900"
              >
                {editingPermission ? "Edit Permission" : "Create Permission"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {editingPermission
                  ? "Update this permission's details."
                  : "Define a new permission for a resource."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingPermission(null);
              }}
              aria-label="Close"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[calc(100vh-180px)] overflow-y-auto p-7">
            <PermissionForm
              permission={editingPermission}
              onCancel={() => {
                setShowForm(false);
                setEditingPermission(null);
              }}
              onSuccess={handleFormSuccess}
            />
          </div>
        </Modal>
      )}

      {/* VIEW MODAL */}
      {selectedPermission && (
        <Modal
          onClose={() => {
            setSelectedPermission(null);
            setViewError("");
          }}
          labelledBy="permission-view-heading"
          maxWidthClass="max-w-lg"
        >
          <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2
                id="permission-view-heading"
                className="text-lg font-bold text-slate-900"
              >
                Permission Details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Detailed information about this permission.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedPermission(null);
                setViewError("");
              }}
              aria-label="Close"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 p-6">
            {viewError && (
              <p
                role="alert"
                className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700"
              >
                {viewError}
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Detail label="Name" value={selectedPermission.name} />
              <Detail label="Key" value={selectedPermission.key} mono />
              <Detail
                label="Module"
                value={selectedPermission.feature?.module?.name}
              />
              <Detail
                label="Feature"
                value={selectedPermission.feature?.name}
              />
              <Detail
                label="Feature ID"
                value={selectedPermission.featureId}
                mono
              />
              <Detail label="Resource" value={selectedPermission.resource} />
              <Detail label="Action" value={selectedPermission.action} />
              <Detail label="Context" value={selectedPermission.context} />
              <Detail label="UUID" value={selectedPermission.uuid} mono />
            </div>

            {selectedPermission.description && (
              <Detail
                label="Description"
                value={selectedPermission.description}
              />
            )}
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRM */}
      {permissionToDelete && (
        <Modal
          onClose={() => (deletingId ? undefined : setPermissionToDelete(null))}
          labelledBy="delete-permission-heading"
          maxWidthClass="max-w-md"
        >
          <div className="space-y-4 p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <Trash2 className="h-5 w-5" />
            </div>

            <div>
              <h2
                id="delete-permission-heading"
                className="text-lg font-bold text-slate-900"
              >
                Delete permission?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                This will permanently remove{" "}
                <span className="font-semibold text-slate-700">
                  {permissionToDelete.name}
                </span>
                . Any roles using it may lose this permission. This action
                cannot be undone.
              </p>
            </div>

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
                onClick={() => setPermissionToDelete(null)}
                disabled={deletingId !== null}
                className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
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
    </div>
  );
}

/* =========================================================
   PERMISSION FORM
========================================================= */

function PermissionForm({
  permission,
  onCancel,
  onSuccess,
}: {
  permission: Permission | null;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const { primaryColor } = useTheme();

  const [values, setValues] = useState<PermissionFormValues>({
    name: permission?.name ?? "",
    key: permission?.key ?? "",
    description: permission?.description ?? "",
    resource: permission?.resource ?? "",
    action: permission?.action ?? ACTIONS[0],
    context: permission?.context ?? CONTEXTS[0],
    featureId:
      permission?.featureId !== undefined && permission?.featureId !== null
        ? String(permission.featureId)
        : "",
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [features, setFeatures] = useState<FeatureOption[]>([]);
  const [featuresLoading, setFeaturesLoading] = useState(true);
  const [featuresError, setFeaturesError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadFeatures = async () => {
      try {
        setFeaturesLoading(true);
        setFeaturesError("");
        const loaded = await fetchFeatures();
        if (!cancelled) setFeatures(loaded);
      } catch (err) {
        if (!cancelled) {
          setFeatures([]);
          setFeaturesError(
            err instanceof Error ? err.message : "Failed to load features.",
          );
        }
      } finally {
        if (!cancelled) setFeaturesLoading(false);
      }
    };

    loadFeatures();
    return () => {
      cancelled = true;
    };
  }, []);

  const featureOptions = useMemo(() => {
    if (!permission?.featureId) return features;

    const currentId = String(permission.featureId);
    if (features.some((feature) => String(feature.id) === currentId)) {
      return features;
    }

    if (!permission.feature?.name) return features;

    return [
      {
        id: permission.featureId,
        name: permission.feature.name,
        ...((permission.feature as { key?: string } | undefined)?.key
          ? { key: (permission.feature as { key?: string }).key }
          : {}),
      },
      ...features,
    ];
  }, [features, permission]);

  useEffect(() => {
    setValues({
      name: permission?.name ?? "",
      key: permission?.key ?? "",
      description: permission?.description ?? "",
      resource: permission?.resource ?? "",
      action: permission?.action ?? ACTIONS[0],
      context: permission?.context ?? CONTEXTS[0],
      featureId:
        permission?.featureId !== undefined && permission?.featureId !== null
          ? String(permission.featureId)
          : "",
    });
    setFormError("");
  }, [permission]);

  const update = (field: keyof PermissionFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = values.name.trim();
    const key = values.key.trim();
    const description = values.description.trim();
    const resource = values.resource.trim();
    const action = values.action.trim();
    const context = values.context.trim();
    const featureIdText = values.featureId.trim();

    if (!name || !key) {
      setFormError("Name and key are required.");
      return;
    }

    if (!permission && !resource) {
      setFormError("Resource is required when creating a permission.");
      return;
    }

    if (!featureIdText) {
      setFormError("Feature is required.");
      return;
    }

    const featureId = Number(featureIdText);
    if (!Number.isInteger(featureId) || featureId <= 0) {
      setFormError("Please select a valid feature.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      if (permission) {
        await updatePermission(permission.id, {
          name,
          key,
          description: description || undefined,
          resource: resource || undefined,
          action,
          context,
          featureId,
        });
      } else {
        await createPermission({
          name,
          key,
          description: description || undefined,
          resource,
          action,
          context,
          featureId,
        });
      }
      onSuccess();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : permission
            ? "Failed to update permission."
            : "Failed to create permission.",
      );
    } finally {
      setSaving(false);
    }
  };

  const focusHandlers = {
    onFocus: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      e.currentTarget.style.borderColor = primaryColor;
      e.currentTarget.style.boxShadow = `0 0 0 4px ${primaryColor}1A`;
    },
    onBlur: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      e.currentTarget.style.borderColor = "";
      e.currentTarget.style.boxShadow = "";
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {formError && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600"
        >
          {formError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Name" htmlFor="perm-name">
          <input
            id="perm-name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            required
            disabled={saving}
            placeholder="e.g. Create User"
            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition disabled:bg-slate-50"
            {...focusHandlers}
          />
        </Field>

        <Field
          label="Key"
          htmlFor="perm-key"
          hint="Use a unique permission key, e.g. users.create"
        >
          <input
            id="perm-key"
            value={values.key}
            onChange={(e) => update("key", e.target.value)}
            required
            disabled={saving}
            placeholder="e.g. users.create"
            className="h-11 w-full rounded-lg border border-slate-200 px-3 font-mono text-sm outline-none transition disabled:bg-slate-50"
            {...focusHandlers}
          />
        </Field>
      </div>

      <Field label="Description" htmlFor="perm-description">
        <textarea
          id="perm-description"
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          rows={3}
          disabled={saving}
          placeholder="Describe what this permission allows..."
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition disabled:bg-slate-50"
          {...focusHandlers}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Action" htmlFor="perm-action">
          <select
            id="perm-action"
            value={values.action}
            onChange={(e) => update("action", e.target.value)}
            disabled={saving}
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none disabled:bg-slate-50"
            {...focusHandlers}
          >
            {ACTIONS.map((value) => (
              <option key={value} value={value}>
                {capitalize(value)}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Context" htmlFor="perm-context">
          <select
            id="perm-context"
            value={values.context}
            onChange={(e) => update("context", e.target.value)}
            disabled={saving}
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none disabled:bg-slate-50"
            {...focusHandlers}
          >
            {CONTEXTS.map((value) => (
              <option key={value} value={value}>
                {capitalize(value)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label={`Resource${permission ? "" : " *"}`}
          htmlFor="perm-resource"
          hint="The resource this permission applies to."
        >
          <input
            id="perm-resource"
            value={values.resource}
            onChange={(e) => update("resource", e.target.value)}
            required={!permission}
            disabled={saving}
            placeholder="e.g. users"
            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition disabled:bg-slate-50"
            {...focusHandlers}
          />
        </Field>

        <Field
          label="Feature *"
          htmlFor="perm-feature"
          hint="Select a feature. The selected feature ID is sent to the API."
        >
          <div className="relative">
            <select
              id="perm-feature"
              name="featureId"
              value={values.featureId}
              onChange={(e) => update("featureId", e.target.value)}
              required
              disabled={saving || featuresLoading}
              className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-slate-50"
              {...focusHandlers}
            >
              <option value="">
                {featuresLoading ? "Loading features..." : "Select Feature"}
              </option>
              {featureOptions.map((feature) => (
                <option
                  key={`feature-${String(feature.id)}`}
                  value={String(feature.id)}
                >
                  {feature.name}
                  {feature.key ? ` — ${feature.key}` : ""}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
          </div>
          {featuresError && (
            <p className="mt-1 text-xs text-red-500">{featuresError}</p>
          )}
        </Field>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving || featuresLoading}
          className="flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ backgroundColor: primaryColor }}
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {permission ? "Save Changes" : "Create Permission"}
        </button>
      </div>
    </form>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function Detail({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | number | null;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1 break-words text-sm font-semibold text-slate-700 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value === undefined || value === null || value === "" ? "—" : value}
      </p>
    </div>
  );
}

function Modal({
  children,
  onClose,
  labelledBy,
  maxWidthClass = "max-w-2xl",
}: {
  children: ReactNode;
  onClose: () => void;
  labelledBy?: string;
  maxWidthClass?: string;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onMouseDown={(event) => event.stopPropagation()}
        className={`max-h-[calc(100vh-32px)] w-full ${maxWidthClass} overflow-hidden rounded-2xl bg-white shadow-2xl`}
      >
        {children}
      </motion.div>
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}
