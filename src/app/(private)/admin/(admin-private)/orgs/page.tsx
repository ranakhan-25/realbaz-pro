/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useMemo } from "react";
import OrgCreateModal from "./components/OrgCreateModal";
import OrgEditModal from "./components/OrgEditModal";
import OrgViewModal from "./components/OrgViewModal";
import { useTheme } from "@/lib/theme";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  Building2,
} from "lucide-react";

const DUMMY_ORGS = [
  {
    uuid: "1",
    name: "Acme Corp",
    slug: "acme-corp",
    email: "admin@acme.com",
    phone: "+1234567890",
    plan: "Pro",
    plan_id: "2",
    status: "active",
    trial_ends_at: "2024-12-31",
    created_at: "2024-01-15",
  },
  {
    uuid: "2",
    name: "Beta LLC",
    slug: "beta-llc",
    email: "info@beta.com",
    phone: "+0987654321",
    plan: "Basic",
    plan_id: "1",
    status: "trial",
    trial_ends_at: "2024-06-30",
    created_at: "2024-03-10",
  },
  {
    uuid: "3",
    name: "Gamma Inc",
    slug: "gamma-inc",
    email: "contact@gamma.com",
    phone: "+1122334455",
    plan: "Pro",
    plan_id: "2",
    status: "suspended",
    trial_ends_at: "2024-05-15",
    created_at: "2024-02-20",
  },
  {
    uuid: "4",
    name: "Delta Co",
    slug: "delta-co",
    email: "hello@delta.com",
    phone: "+1222333444",
    plan: "Enterprise",
    plan_id: "3",
    status: "active",
    trial_ends_at: "2025-01-01",
    created_at: "2024-04-05",
  },
  {
    uuid: "5",
    name: "Epsilon Ltd",
    slug: "epsilon-ltd",
    email: "contact@epsilon.com",
    phone: "+1333444555",
    plan: "Basic",
    plan_id: "1",
    status: "active",
    trial_ends_at: "2024-08-20",
    created_at: "2024-05-12",
  },
  {
    uuid: "6",
    name: "Zeta Group",
    slug: "zeta-group",
    email: "info@zeta.com",
    phone: "+1444555666",
    plan: "Pro",
    plan_id: "2",
    status: "trial",
    trial_ends_at: "2024-09-10",
    created_at: "2024-06-01",
  },
];

const ITEMS_PER_PAGE = 5;

export default function OrgListPage() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingDummy, setIsUsingDummy] = useState(false);

  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

  // Search, Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // ১. ডেটা ফেচ
  const fetchOrgs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/orgs");
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      if (!data || data.length === 0) {
        setOrgs(DUMMY_ORGS);
        setIsUsingDummy(true);
      } else {
        setOrgs(data);
        setIsUsingDummy(false);
      }
    } catch (error) {
      setOrgs(DUMMY_ORGS);
      setIsUsingDummy(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  // ২. CRUD (Create, Update, Delete)
  const handleCreate = async (payload: any) => {
    try {
      const res = await fetch("/api/orgs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Create failed");
      const newOrg = await res.json();
      setOrgs((prev) => [newOrg, ...prev]);
    } catch (error) {
      const newOrg = {
        ...payload,
        uuid: Date.now().toString(),
        created_at: new Date().toISOString(),
      };
      setOrgs((prev) => [newOrg, ...prev]);
    }
  };

  const handleUpdate = async (uuid: string, payload: any) => {
    try {
      const res = await fetch(`/api/orgs/${uuid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setOrgs((prev) => prev.map((o) => (o.uuid === uuid ? updated : o)));
    } catch (error) {
      setOrgs((prev) =>
        prev.map((o) => (o.uuid === uuid ? { ...o, ...payload } : o)),
      );
    }
  };

  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this organization?")) return;
    try {
      const res = await fetch(`/api/orgs/${uuid}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setOrgs((prev) => prev.filter((o) => o.uuid !== uuid));
    } catch (error) {
      setOrgs((prev) => prev.filter((o) => o.uuid !== uuid));
    }
  };

  // ৩. Search & Filter Logic
  const filteredOrgs = useMemo(() => {
    return orgs.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || org.status === statusFilter;
      const matchesPlan = planFilter === "all" || org.plan === planFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [orgs, searchQuery, statusFilter, planFilter]);

  // ৪. Pagination Logic
  const totalPages = Math.ceil(filteredOrgs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrgs = filteredOrgs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // ফিল্টার পরিবর্তন হলে পেজ ১ এ ফিরে যাবে
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, planFilter]);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Building2 className="h-7 w-7" style={{ color: brandColor }} />
              Organizations
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your SaaS clients, their plans, and subscription statuses.
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-5 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap"
            style={{ backgroundColor: brandColor }}
          >
            <Plus className="h-4 w-4" /> Create Organization
          </button>
        </div>

        {isUsingDummy && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>
              API is currently offline. Showing <strong>Demo Data</strong>.
            </span>
          </div>
        )}

        {/* Toolbar: Search & Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or slug..."
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
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 appearance-none min-w-[120px]"
              style={{ "--tw-ring-color": `${brandColor}40` } as any}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="suspended">Suspended</option>
            </select>

            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 appearance-none min-w-[120px]"
              style={{ "--tw-ring-color": `${brandColor}40` } as any}
            >
              <option value="all">All Plans</option>
              <option value="Basic">Basic</option>
              <option value="Pro">Pro</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-gray-300 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
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
                      Loading organizations...
                    </td>
                  </tr>
                ) : paginatedOrgs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center flex flex-col items-center"
                    >
                      <Building2 className="h-10 w-10 text-gray-200 mb-3" />
                      <p className="text-gray-500 font-medium">
                        No organizations found.
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Try adjusting your search or filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedOrgs.map((org) => (
                    <tr
                      key={org.uuid}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 text-sm">
                            {org.name}
                          </span>
                          <span className="text-xs text-gray-400 font-mono mt-0.5">
                            {org.slug}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-700">
                            {org.email}
                          </span>
                          <span className="text-xs text-gray-400 mt-0.5">
                            {org.phone || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border"
                          style={{
                            backgroundColor: `${brandColor}10`,
                            color: brandColor,
                            borderColor: `${brandColor}20`,
                          }}
                        >
                          {org.plan || org.plan_id || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                            org.status === "active"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : org.status === "trial"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              org.status === "active"
                                ? "bg-green-500"
                                : org.status === "trial"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                          ></span>
                          {org.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setSelectedOrg(org);
                              setIsViewOpen(true);
                            }}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrg(org);
                              setIsEditOpen(true);
                            }}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors"
                            style={{ color: brandColor }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(org.uuid)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-red-50 text-red-600 transition-colors"
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

          {/* Premium Pagination */}
          {!isLoading && filteredOrgs.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(startIndex + ITEMS_PER_PAGE, filteredOrgs.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {filteredOrgs.length}
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
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === i + 1
                          ? "text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
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
      <OrgCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />
      <OrgEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        orgData={selectedOrg}
        onUpdate={handleUpdate}
      />
      <OrgViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        orgData={selectedOrg}
      />
    </div>
  );
}
