/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@/lib/theme";
import Link from "next/link";
import {
  Search,
  Plus,
  ShieldCheck,
  Lock,
  Users,
  ChevronLeft,
  ChevronRight,
  Settings2,
} from "lucide-react";
import RoleCreateModal from "./components/RoleCreateModal";

const DUMMY_ROLES = [
  {
    uuid: "1",
    name: "Super Admin",
    code: "super-admin",
    is_system: true,
    users_count: 2,
    permissions_count: 150,
    description: "Full access to all modules and settings.",
  },
  {
    uuid: "2",
    name: "Admin",
    code: "admin",
    is_system: false,
    users_count: 5,
    permissions_count: 85,
    description: "Can manage users, organizations, and content.",
  },
  {
    uuid: "3",
    name: "Editor",
    code: "editor",
    is_system: false,
    users_count: 12,
    permissions_count: 20,
    description: "Can create and edit content, but not publish.",
  },
  {
    uuid: "4",
    name: "Viewer",
    code: "viewer",
    is_system: false,
    users_count: 40,
    permissions_count: 5,
    description: "Read-only access to dashboards and reports.",
  },
];

const ITEMS_PER_PAGE = 5;

export default function RoleListPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingDummy, setIsUsingDummy] = useState(false);

  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  // Modal & Search States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ডেটা ফেচ
  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/roles");
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      if (!data || data.length === 0) {
        setRoles(DUMMY_ROLES);
        setIsUsingDummy(true);
      } else {
        setRoles(data);
        setIsUsingDummy(false);
      }
    } catch (error) {
      setRoles(DUMMY_ROLES);
      setIsUsingDummy(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Create Role
  const handleCreate = async (payload: any) => {
    try {
      const res = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Create failed");
      const newRole = await res.json();
      setRoles((prev) => [newRole, ...prev]);
    } catch (error) {
      setRoles((prev) => [
        {
          ...payload,
          uuid: Date.now().toString(),
          is_system: false,
          users_count: 0,
          permissions_count: 0,
        },
        ...prev,
      ]);
    }
  };

  // Delete Role
  const handleDelete = async (uuid: string, isSystem: boolean) => {
    if (isSystem) return alert("System roles cannot be deleted.");
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      const res = await fetch(`/api/roles/${uuid}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setRoles((prev) => prev.filter((r) => r.uuid !== uuid));
    } catch (error) {
      setRoles((prev) => prev.filter((r) => r.uuid !== uuid));
    }
  };

  // Search
  const filteredRoles = useMemo(() => {
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.code.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [roles, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredRoles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRoles = filteredRoles.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-7 w-7" style={{ color: brandColor }} />
              Roles & Access Control
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage roles and assign granular permissions across modules.
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-5 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap"
            style={{ backgroundColor: brandColor }}
          >
            <Plus className="h-4 w-4" /> Create Role
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

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search roles by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all"
              style={{ "--tw-ring-color": `${brandColor}40` } as any}
            />
          </div>
        </div>

        {/* Roles Grid (Card View - Premium) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              Loading roles...
            </div>
          ) : paginatedRoles.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No roles found.
            </div>
          ) : (
            paginatedRoles.map((role) => (
              <div
                key={role.uuid}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col group hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${brandColor}15` }}
                  >
                    <ShieldCheck
                      className="h-6 w-6"
                      style={{ color: brandColor }}
                    />
                  </div>
                  {role.is_system && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                      <Lock className="h-3 w-3" /> System
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  {role.code}
                </p>
                <p className="text-sm text-gray-500 mt-3 flex-1">
                  {role.description || "No description provided."}
                </p>

                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                    <Users className="h-4 w-4 text-gray-400" />{" "}
                    {role.users_count} Users
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                    <Settings2 className="h-4 w-4 text-gray-400" />{" "}
                    {role.permissions_count} Rules
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Link
                    href={`/admin/roles/${role.uuid}/permissions`}
                    className="flex-1 text-center py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: brandColor }}
                  >
                    Manage Permissions
                  </Link>
                  <button
                    onClick={() => handleDelete(role.uuid, role.is_system)}
                    disabled={role.is_system}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-red-600 border border-red-100 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && filteredRoles.length > 0 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
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
                    currentPage === i + 1 ? { backgroundColor: brandColor } : {}
                  }
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <RoleCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
