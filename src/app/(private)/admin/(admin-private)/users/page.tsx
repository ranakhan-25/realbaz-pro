/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@/lib/theme";

import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  ShieldCheck,
  Mail,
  MoreHorizontal,
} from "lucide-react";
import UserCreateModal from "./components/UserCreateModal";
import UserEditModal from "./components/UserEditModal";
import UserRoleAssignModal from "./components/UserRoleAssignModal";
import UserViewModal from "./components/UserViewModal";

const DUMMY_USERS = [
  {
    uuid: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    roles: ["Admin", "Manager"],
    status: "active",
    mfa: true,
    last_login_at: "2024-05-20 10:30 AM",
    avatar: "JD",
  },
  {
    uuid: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+0987654321",
    roles: ["Editor"],
    status: "active",
    mfa: false,
    last_login_at: "2024-05-19 14:15 PM",
    avatar: "JS",
  },
  {
    uuid: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1122334455",
    roles: ["Viewer"],
    status: "inactive",
    mfa: false,
    last_login_at: "2024-04-10 09:00 AM",
    avatar: "MJ",
  },
];

const ITEMS_PER_PAGE = 5;

export default function UserListPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingDummy, setIsUsingDummy] = useState(false);

  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isRoleAssignOpen, setIsRoleAssignOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Search, Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // ১. ডেটা ফেচ
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      if (!data || data.length === 0) {
        setUsers(DUMMY_USERS);
        setIsUsingDummy(true);
      } else {
        setUsers(data);
        setIsUsingDummy(false);
      }
    } catch (error) {
      setUsers(DUMMY_USERS);
      setIsUsingDummy(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ২. CRUD Operations
  const handleCreate = async (payload: any) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Create failed");
      const newUser = await res.json();
      setUsers((prev) => [newUser, ...prev]);
    } catch (error) {
      const initials = (payload.name || "U")
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
      setUsers((prev) => [
        {
          ...payload,
          uuid: Date.now().toString(),
          avatar: initials,
          last_login_at: "Never",
        },
        ...prev,
      ]);
    }
  };

  const handleUpdate = async (uuid: string, payload: any) => {
    try {
      const res = await fetch(`/api/users/${uuid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.uuid === uuid ? updated : u)));
    } catch (error) {
      setUsers((prev) =>
        prev.map((u) => (u.uuid === uuid ? { ...u, ...payload } : u)),
      );
    }
  };

  const handleRoleAssign = async (uuid: string, roles: string[]) => {
    try {
      const res = await fetch(`/api/users/${uuid}/roles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roles }),
      });
      if (!res.ok) throw new Error("Update failed");
      setUsers((prev) =>
        prev.map((u) => (u.uuid === uuid ? { ...u, roles } : u)),
      );
    } catch (error) {
      setUsers((prev) =>
        prev.map((u) => (u.uuid === uuid ? { ...u, roles } : u)),
      );
    }
  };

  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/users/${uuid}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setUsers((prev) => prev.filter((u) => u.uuid !== uuid));
    } catch (error) {
      setUsers((prev) => prev.filter((u) => u.uuid !== uuid));
    }
  };

  // ৩. Search & Filter
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  // ৪. Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Users className="h-7 w-7" style={{ color: brandColor }} />
              System Users
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage team members, roles, and access permissions.
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-5 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap"
            style={{ backgroundColor: brandColor }}
          >
            <Plus className="h-4 w-4" /> Create User
          </button>
        </div>

        {isUsingDummy && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>
              API is offline. Showing <strong>Demo Data</strong>.
            </span>
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all"
              style={{ "--tw-ring-color": `${brandColor}40` } as any}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter className="h-4 w-4" />
              <span>Filters:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 appearance-none min-w-[130px]"
              style={{ "--tw-ring-color": `${brandColor}40` } as any}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Roles
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status & MFA
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center flex flex-col items-center"
                    >
                      <Users className="h-10 w-10 text-gray-200 mb-3" />
                      <p className="text-gray-500 font-medium">
                        No users found.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr
                      key={user.uuid}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                            style={{ backgroundColor: brandColor }}
                          >
                            {user.avatar ||
                              user.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 text-sm">
                              {user.name}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roles?.map((role: string) => (
                            <span
                              key={role}
                              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span
                            className={`inline-flex items-center w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              user.status === "active"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {user.status}
                          </span>
                          {user.mfa && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600">
                              <ShieldCheck className="h-3 w-3" /> MFA On
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.last_login_at || "Never"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsViewOpen(true);
                            }}
                            className="px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditOpen(true);
                            }}
                            className="px-2 py-1 text-xs font-medium rounded hover:bg-gray-100 transition-colors"
                            style={{ color: brandColor }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsRoleAssignOpen(true);
                            }}
                            className="px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            Roles
                          </button>
                          <button
                            onClick={() => handleDelete(user.uuid)}
                            className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && filteredUsers.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {filteredUsers.length}
                </span>{" "}
                results
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1 ? "text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
                      style={
                        currentPage === i + 1
                          ? { backgroundColor: brandColor }
                          : {}
                      }
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <UserCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />
      <UserEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        userData={selectedUser}
        onUpdate={handleUpdate}
      />
      <UserViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        userData={selectedUser}
      />
      <UserRoleAssignModal
        isOpen={isRoleAssignOpen}
        onClose={() => setIsRoleAssignOpen(false)}
        userData={selectedUser}
        onAssign={handleRoleAssign}
      />
    </div>
  );
}
