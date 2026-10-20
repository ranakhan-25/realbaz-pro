"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  Filter,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import UserForm from "@/components/modules/UserForm";
import {
  deleteUser,
  getUser,
  getUsers,
  type User,
} from "@/services/userService";
import { useTheme } from "@/lib/theme";

const DEMO_USERS: User[] = [
  {
    id: 101,
    uuid: "demo-user-101",
    email: "admin@garmentech.com",
    username: "admin",
    firstName: "System",
    lastName: "Administrator",
    phone: "+8801700000001",
    isActive: true,
    createdAt: "2024-01-15T08:30:00.000Z",
    updatedAt: "2024-06-02T10:15:00.000Z",
    roleIds: [1, 2],
    moduleIds: [1, 2, 3],
    permissionIds: [1, 2, 3],
    userType: "admin",
  },
  {
    id: 102,
    uuid: "demo-user-102",
    email: "manager@garmentech.com",
    username: "manager",
    firstName: "Project",
    lastName: "Manager",
    phone: "+8801700000002",
    isActive: true,
    createdAt: "2024-02-10T09:00:00.000Z",
    updatedAt: "2024-06-02T12:00:00.000Z",
    roleIds: [2],
    moduleIds: [2, 3],
    permissionIds: [2, 4],
    userType: "manager",
  },
  {
    id: 103,
    uuid: "demo-user-103",
    email: "sales@garmentech.com",
    username: "salesrep",
    firstName: "Sales",
    lastName: "Representative",
    phone: "+8801700000003",
    isActive: true,
    createdAt: "2024-03-12T11:20:00.000Z",
    updatedAt: "2024-06-01T15:30:00.000Z",
    roleIds: [3],
    moduleIds: [2],
    permissionIds: [3],
    userType: "staff",
  },
  {
    id: 104,
    uuid: "demo-user-104",
    email: "support@garmentech.com",
    username: "support",
    firstName: "Customer",
    lastName: "Support",
    phone: "+8801700000004",
    isActive: false,
    createdAt: "2024-04-08T13:45:00.000Z",
    updatedAt: "2024-05-20T09:50:00.000Z",
    roleIds: [4],
    moduleIds: [1],
    permissionIds: [5],
    userType: "support",
  },
];

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

function getUserIdentifier(target: User): string {
  return String(target.uuid ?? target.id);
}

export default function UsersPage() {
  const { primaryColor } = useTheme();

  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  const [menuUserId, setMenuUserId] = useState<string | number | null>(null);
  const menuRootRef = useRef<HTMLDivElement | null>(null);

  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const requestIdRef = useRef(0);
  const totalPages = Math.max(1, Math.ceil(totalUsers / PAGE_SIZE));

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [status]);

  const loadUsers = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    try {
      setLoading(true);
      setError("");

      const response = await getUsers({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        isActive: status === "all" ? undefined : status === "active",
        sortField: "created_at",
        sortOrder: "DESC",
      });

      if (requestId !== requestIdRef.current) return;

      let rawUserList: User[] = [];
      let total = 0;

      if (Array.isArray(response)) {
        rawUserList = response;
        total = response.length;
      } else if (response && typeof response === "object") {
        const result = response as any;
        if (Array.isArray(result.data)) {
          rawUserList = result.data;
          total = result.meta?.total ?? rawUserList.length;
        } else if (result.data && Array.isArray(result.data.data)) {
          rawUserList = result.data.data;
          total = result.data.meta?.total ?? rawUserList.length;
        }
      }

      const userList = rawUserList.filter((user) => {
        if (!user || typeof user !== "object") return false;
        return (
          user.id !== undefined &&
          user.id !== null &&
          String(user.id).trim() !== ""
        );
      });

      if (userList.length === 0) {
        setUsers(DEMO_USERS);
        setTotalUsers(DEMO_USERS.length);
        setError(
          "Using demo data because the API is returning no user records.",
        );
        return;
      }

      setUsers(userList);
      setTotalUsers(total || userList.length);

      if (userList.length === 0 && total > 0 && page > 1) {
        setPage((current) => Math.max(1, current - 1));
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(
        err instanceof Error
          ? `${err.message} Using demo data instead.`
          : "Using demo data because the backend is unavailable.",
      );
      setUsers(DEMO_USERS);
      setTotalUsers(DEMO_USERS.length);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [search, status, page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (menuUserId === null) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRootRef.current?.contains(event.target as Node)) {
        setMenuUserId(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuUserId(null);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuUserId]);

  const openCreate = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const openEdit = (user: User) => {
    setMenuUserId(null);
    setEditingUser(user);
    setFormOpen(true);
  };

  const openView = async (user: User) => {
    setMenuUserId(null);
    setViewOpen(true);
    setViewLoading(true);
    setViewError("");
    setViewUser(null);

    try {
      const data = await getUser(getUserIdentifier(user), true);
      setViewUser(data);
    } catch (err) {
      setViewUser(user);
      setViewError(
        err instanceof Error
          ? err.message
          : "Couldn't load full details — showing cached data.",
      );
    } finally {
      setViewLoading(false);
    }
  };

  const requestDelete = (user: User) => {
    setMenuUserId(null);
    setDeleteError("");
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setDeletingId(userToDelete.id);
    setDeleteError("");

    try {
      await deleteUser(getUserIdentifier(userToDelete));
      setUsers((current) =>
        current.filter((item) => item.id !== userToDelete.id),
      );
      setTotalUsers((current) => Math.max(0, current - 1));
      setUserToDelete(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete user.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSuccess = (savedUser: User) => {
    setFormOpen(false);
    setEditingUser(null);
    setUsers((current) => {
      const exists = current.some((item) => item.id === savedUser.id);
      if (exists) {
        return current.map((item) =>
          item.id === savedUser.id ? { ...item, ...savedUser } : item,
        );
      }
      return [savedUser, ...current];
    });
    setTotalUsers((current) => current + 1);
  };

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", page, "...", totalPages];
  };

  return (
    <div className="mx-auto max-w-[1600px]">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage platform users, roles, permissions and access.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: primaryColor }}
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* STATS */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Total Users
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalUsers}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Active (this page)
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {users.filter((user) => user.isActive).length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Page
          </p>
          <p
            className="mt-1 text-2xl font-bold"
            style={{ color: primaryColor }}
          >
            {page}{" "}
            <span className="text-base font-medium text-slate-400">
              / {totalPages}
            </span>
          </p>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* TOOLBAR */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search username or email..."
              aria-label="Search users"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:bg-white focus:ring-4"
              style={
                {
                  // focus styles via CSS variable if needed
                } as React.CSSProperties
              }
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
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as "all" | "active" | "inactive")
              }
              aria-label="Filter by status"
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primaryColor;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "";
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
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
          <table className="w-full min-w-275">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                {[
                  "User",
                  "Employee ID",
                  "User Type",
                  "Roles",
                  "Company",
                  "Status",
                  "Created",
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
                      Loading users...
                    </p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <UserRound className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      No users found.
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => {
                  const fullName =
                    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
                    user.username;
                  const roles =
                    (user as any).roles ?? (user as any).roleIds ?? [];
                  const companies = (user as any).companies ?? [];

                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-slate-50/70"
                    >
                      {/* USER */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full"
                            style={{
                              backgroundColor: `${primaryColor}1A`,
                              color: primaryColor,
                            }}
                          >
                            {user.avatarUrl ? (
                              <img
                                src={user.avatarUrl}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <UserRound className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {fullName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {user.email || "—"}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-400">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* EMPLOYEE */}
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {user.employeeId || "—"}
                        </span>
                      </td>

                      {/* USER TYPE */}
                      <td className="px-5 py-4">
                        <span
                          className="rounded-lg px-2.5 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: `${primaryColor}15`,
                            color: primaryColor,
                          }}
                        >
                          {user.userType || "—"}
                        </span>
                      </td>

                      {/* ROLES */}
                      <td className="px-5 py-4">
                        {roles.length > 0 ? (
                          <div className="flex max-w-45 flex-wrap gap-1.5">
                            {roles
                              .slice(0, 2)
                              .map((role: any, roleIndex: number) => (
                                <span
                                  key={role?.id ?? role?.uuid ?? roleIndex}
                                  className="rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-[#EE5426]"
                                >
                                  {typeof role === "object"
                                    ? (role.name ??
                                      role.title ??
                                      `Role ${role.id ?? roleIndex + 1}`)
                                    : role}
                                </span>
                              ))}
                            {roles.length > 2 && (
                              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                                +{roles.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-sm text-slate-400">
                            <ShieldCheck className="h-4 w-4" />
                            No Role
                          </div>
                        )}
                      </td>

                      {/* COMPANY */}
                      <td className="px-5 py-4">
                        {companies.length > 0 ? (
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {companies[0]?.name ??
                                companies[0]?.title ??
                                `Company ${
                                  companies[0]?.id ??
                                  user.companyIds?.[0] ??
                                  "—"
                                }`}
                            </p>
                            {companies.length > 1 && (
                              <p className="text-xs text-slate-400">
                                +{companies.length - 1} more
                              </p>
                            )}
                          </div>
                        ) : user.companyIds?.length ? (
                          <span className="text-sm text-slate-600">
                            {user.companyIds.join(", ")}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            user.isActive
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* CREATED */}
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* ACTIONS */}
                      <td className="relative px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openView(user)}
                            title="View user"
                            aria-label={`View ${fullName}`}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = primaryColor;
                              e.currentTarget.style.backgroundColor = `${primaryColor}15`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = "";
                              e.currentTarget.style.backgroundColor = "";
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEdit(user)}
                            title="Edit user"
                            aria-label={`Edit ${fullName}`}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = primaryColor;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = "";
                            }}
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => requestDelete(user)}
                            title="Delete user"
                            aria-label={`Delete ${fullName}`}
                            disabled={deletingId === user.id}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {deletingId === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setMenuUserId(
                                menuUserId === user.id ? null : user.id,
                              )
                            }
                            title="More"
                            aria-label={`More actions for ${fullName}`}
                            aria-haspopup="menu"
                            aria-expanded={menuUserId === user.id}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </div>

                        {menuUserId === user.id && (
                          <div
                            ref={menuRootRef}
                            role="menu"
                            className="absolute right-5 top-14 z-20 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
                          >
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => openView(user)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => openEdit(user)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                            >
                              <Edit3 className="h-4 w-4" />
                              Edit User
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => requestDelete(user)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete User
                            </button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!loading && totalUsers > PAGE_SIZE && (
          <div className="border-t border-slate-100 px-5 py-3">
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1}
                  className="inline-flex h-8 items-center justify-center rounded-[3px] border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                {getPageNumbers().map((item, index) => {
                  if (item === "...") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="inline-flex h-8 min-w-6 items-center justify-center px-1 text-[11px] text-slate-400"
                      >
                        ...
                      </span>
                    );
                  }

                  const active = page === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPage(item)}
                      className="inline-flex h-8 min-w-7 items-center justify-center rounded-[3px] border text-[11px] font-medium transition"
                      style={
                        active
                          ? {
                              backgroundColor: primaryColor,
                              borderColor: primaryColor,
                              color: "#ffffff",
                            }
                          : {
                              borderColor: "#e2e8f0",
                              backgroundColor: "#ffffff",
                              color: "#475569",
                            }
                      }
                    >
                      {item}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  disabled={page >= totalPages}
                  className="inline-flex h-8 items-center justify-center rounded-[3px] border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADD / EDIT */}
      <AnimatePresence>
        {formOpen && (
          <Modal
            onClose={() => {
              setFormOpen(false);
              setEditingUser(null);
            }}
            labelledBy="user-form-heading"
          >
            <UserForm
              user={editingUser}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setFormOpen(false);
                setEditingUser(null);
              }}
            />
          </Modal>
        )}
      </AnimatePresence>

      {/* VIEW */}
      <AnimatePresence>
        {viewOpen && (
          <Modal
            onClose={() => setViewOpen(false)}
            labelledBy="user-view-heading"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2
                    id="user-view-heading"
                    className="text-lg font-bold text-slate-900"
                  >
                    User Details
                  </h2>
                  <p className="text-sm text-slate-500">
                    Complete user information
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewOpen(false)}
                  aria-label="Close"
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {viewLoading ? (
                <div className="py-12 text-center">
                  <Loader2
                    className="mx-auto h-6 w-6 animate-spin"
                    style={{ color: primaryColor }}
                  />
                </div>
              ) : viewUser ? (
                <>
                  {viewError && (
                    <p
                      role="alert"
                      className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700"
                    >
                      {viewError}
                    </p>
                  )}
                  <UserDetails user={viewUser} primaryColor={primaryColor} />
                </>
              ) : null}
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM */}
      <AnimatePresence>
        {userToDelete && (
          <Modal
            onClose={() => (deletingId ? null : setUserToDelete(null))}
            labelledBy="delete-user-heading"
            maxWidthClass="max-w-md"
          >
            <div className="space-y-4">
              <h2
                id="delete-user-heading"
                className="text-lg font-bold text-slate-900"
              >
                Delete user?
              </h2>
              <p className="text-sm text-slate-500">
                This will permanently remove{" "}
                <span className="font-semibold text-slate-700">
                  {userToDelete.username}
                </span>
                . This action cannot be undone.
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
                  onClick={() => setUserToDelete(null)}
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
      </AnimatePresence>
    </div>
  );
}

function UserDetails({
  user,
  primaryColor,
}: {
  user: User;
  primaryColor: string;
}) {
  const roles = (user as any).roles ?? (user as any).roleIds ?? [];
  const companies = (user as any).companies ?? [];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            backgroundColor: `${primaryColor}1A`,
            color: primaryColor,
          }}
        >
          <UserRound className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">
            {`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
              user.username}
          </h3>
          <p className="text-sm text-slate-500">{user.email || "—"}</p>
        </div>
        <span
          className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${
            user.isActive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Detail label="Username" value={user.username} />
        <Detail label="Email" value={user.email} />
        <Detail label="Phone" value={user.phone} />
        <Detail label="User Type" value={user.userType} />
        <Detail label="Employee ID" value={user.employeeId} />
        <Detail label="Designation ID" value={user.designationId} />
        <Detail label="Distribution ID" value={user.distributionId} />
        <Detail label="Warehouse ID" value={user.warehouseId} />
        <Detail label="Factory ID" value={user.factoryId} />
        <Detail label="Receiving Point ID" value={user.receivingPointId} />
        <Detail label="Unit ID" value={user.unitId} />
        <Detail label="Created" value={formatDate(user.createdAt)} />
        <Detail label="Updated" value={formatDate(user.updatedAt)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ObjectArrayDetail label="Roles" values={roles} />
        <ObjectArrayDetail label="Companies" values={companies} />
        <ArrayDetail label="Company IDs" values={user.companyIds} />
        <ArrayDetail label="Office IDs" values={user.officeIds} />
        <ArrayDetail label="Office Type IDs" values={user.officeTypeIds} />
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value === undefined || value === null || value === "" ? "—" : value}
      </p>
    </div>
  );
}

function ArrayDetail({ label, values }: { label: string; values?: any[] }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      {values?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {values.map((value, index) => (
            <span
              key={`${String(value)}-${index}`}
              className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
            >
              {String(value)}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-sm text-slate-400">None</span>
      )}
    </div>
  );
}

function ObjectArrayDetail({
  label,
  values,
}: {
  label: string;
  values?: any[];
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      {values?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {values.map((value, index) => {
            const text =
              typeof value === "object"
                ? (value?.name ??
                  value?.title ??
                  value?.code ??
                  value?.id ??
                  `Item ${index + 1}`)
                : value;
            return (
              <span
                key={value?.id ?? value?.uuid ?? index}
                className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
              >
                {String(text)}
              </span>
            );
          })}
        </div>
      ) : (
        <span className="text-sm text-slate-400">None</span>
      )}
    </div>
  );
}

function Modal({
  children,
  onClose,
  labelledBy,
  maxWidthClass = "max-w-5xl",
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        onMouseDown={(event) => event.stopPropagation()}
        className={`max-h-[92vh] w-full ${maxWidthClass} overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function formatDate(date?: string) {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
