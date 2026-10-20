/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  Check,
  Loader2,
  Gift,
} from "lucide-react";

// ---------- Types ----------
export interface Bonus {
  id: number | string;
  uuid: string;
  name: string;
  percentage: string;
  festivalDate: string; // YYYY-MM-DD
  status: string;
}

// ---------- API helpers ----------
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5002";

async function handleRes(res: Response, action: string) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      json?.message || json?.error || `Failed to ${action} (${res.status})`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return json;
}

// "2026-03-20" → "20 Mar 2026"
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

async function fetchBonuses(): Promise<{ data: Bonus[]; meta: any }> {
  const url = `${API_BASE}/realbizpro/api/v1/bonus?page=1&limit=100&skip=0&status=active&sortBy=createdAt&sortOrder=DESC&withDeleted=false`;
  console.log("GET bonuses →", url);
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const json = await handleRes(res, "fetch bonuses");
  console.log("GET bonuses response →", json);

  const mapped: Bonus[] = (json?.data?.data || [])
    .map((item: any) => ({
      id: item.id ?? item.uuid,
      uuid: item.uuid,
      name: item.name || "",
      percentage: String(item.percentage ?? "0"),
      festivalDate: item.festivalDate || "",
      status: item.status || "active",
    }))
    .filter((item: Bonus) => item.status?.toLowerCase() === "active");

  return { data: mapped, meta: json?.data?.meta };
}

async function createBonus(payload: Record<string, any>) {
  console.log("POST payload →", payload);
  const res = await fetch(`${API_BASE}/realbizpro/api/v1/bonus`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await handleRes(res, "create bonus");
  console.log("POST response →", json);
  return json;
}

async function updateBonus(uuid: string, payload: Record<string, any>) {
  console.log("PATCH", uuid, "payload →", payload);
  const res = await fetch(`${API_BASE}/realbizpro/api/v1/bonus/${uuid}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await handleRes(res, "update bonus");
  console.log("PATCH response →", json);
  return json;
}

async function softDeleteBonus(uuid: string) {
  console.log("DELETE →", uuid);
  const res = await fetch(`${API_BASE}/realbizpro/api/v1/bonus/${uuid}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const json = await handleRes(res, "delete bonus");
  console.log("DELETE response →", json);
  return json;
}

async function restoreBonus(uuid: string) {
  console.log("PATCH restore →", uuid);
  const res = await fetch(
    `${API_BASE}/realbizpro/api/v1/bonus/${uuid}/restore`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    },
  );
  const json = await handleRes(res, "restore bonus");
  console.log("RESTORE response →", json);
  return json;
}

const toApiPayload = (data: {
  name: string;
  percentage: string;
  festivalDate: string;
}) => ({
  name: data.name,
  percentage: Number(data.percentage) || 0,
  festivalDate: data.festivalDate,
  status: "active",
});

// ---------- Form Modal ----------
function BonusFormModal({
  title,
  initialData,
  onClose,
  onSubmit,
}: {
  title: string;
  initialData?: Bonus;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    percentage: string;
    festivalDate: string;
  }) => Promise<void>;
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    percentage: initialData?.percentage || "",
    festivalDate: initialData?.festivalDate || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.festivalDate) {
      setFormError("Festival Date is required");
      return;
    }
    if (!formData.name.trim()) {
      setFormError("Name is required");
      return;
    }
    if (!formData.percentage) {
      setFormError("Percentage is required");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setFormError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
            <Gift className="w-4 h-4 text-indigo-600" />
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-800 border border-slate-300 hover:bg-slate-100 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Festival Date */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Festival Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.festivalDate}
              onChange={(e) =>
                setFormData({ ...formData, festivalDate: e.target.value })
              }
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Percentage */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Percentage(%) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="Enter Percentage"
              value={formData.percentage}
              onChange={(e) =>
                setFormData({ ...formData, percentage: e.target.value })
              }
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {formError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-lg text-xs">
              {formError}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2 bg-slate-400 hover:bg-slate-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-1.5"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- Main Page ----------
export default function BonusListPage() {
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBonus, setEditingBonus] = useState<Bonus | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchBonuses();
      console.log("Loaded bonuses →", res.data.length);
      setBonuses(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load bonuses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBonuses = bonuses.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.percentage.includes(searchQuery) ||
      item.festivalDate.includes(searchQuery),
  );

  const totalPages =
    Math.ceil(filteredBonuses.length / entriesPerPage) || 1;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentTableData = filteredBonuses.slice(
    startIndex,
    startIndex + entriesPerPage,
  );

  const handleDelete = async (bonus: Bonus) => {
    if (!confirm(`Delete bonus "${bonus.name}"?`)) return;

    const uuidToDelete = bonus.uuid || String(bonus.id);
    if (!uuidToDelete) {
      alert("UUID is missing – cannot delete");
      return;
    }

    try {
      setActionLoading(true);
      await softDeleteBonus(uuidToDelete);

      // Optimistic UI
      setBonuses((prev) =>
        prev.filter(
          (item) => (item.uuid || String(item.id)) !== uuidToDelete,
        ),
      );

      if (currentTableData.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Delete failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Optional: restore handler (for future use with a "Show Deleted" toggle)
  const handleRestore = async (uuid: string) => {
    try {
      setActionLoading(true);
      await restoreBonus(uuid);
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Restore failed.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 p-4 sm:p-6 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
              <span>Home</span> / <span>Employee</span> /{" "}
              <span className="text-indigo-600 font-medium">Bonus List</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Bonus Management
            </h1>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Bonus Add
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-slate-300 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-slate-600">Search:</span>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search bonuses..."
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="flex items-center justify-center py-16 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading bonuses...
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={loadData} className="underline text-xs font-medium">
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-indigo-500 text-white font-medium text-xs tracking-wider uppercase">
                    <th className="py-3 px-4 w-20">SL</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4 w-40">Percentage</th>
                    <th className="py-3 px-4 w-48">Festival Date</th>
                    <th className="py-3 px-4 text-center w-32">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentTableData.length > 0 ? (
                    currentTableData.map((item, index) => (
                      <tr
                        key={item.uuid || item.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-slate-600">
                          {startIndex + index + 1}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {item.name || "—"}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {item.percentage}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {formatDate(item.festivalDate)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setEditingBonus(item)}
                              title="Edit Bonus"
                              className="p-1.5 bg-cyan-400 hover:bg-cyan-500 text-white rounded-md transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              disabled={actionLoading}
                              title="Delete Bonus"
                              className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-md transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-10 text-slate-400 font-medium"
                      >
                        No matching records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-3 border-t border-slate-200 bg-white gap-2 text-xs text-slate-500">
              <div>
                Showing {filteredBonuses.length > 0 ? startIndex + 1 : 0} to{" "}
                {Math.min(startIndex + entriesPerPage, filteredBonuses.length)}{" "}
                of {filteredBonuses.length} entries
              </div>
              <div className="inline-flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border border-slate-200 ${
                    currentPage === 1
                      ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                      : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded font-medium ${
                        currentPage === page
                          ? "border border-indigo-600 bg-indigo-600 text-white"
                          : "border border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-3 py-1 rounded border border-slate-200 ${
                    currentPage === totalPages || totalPages === 0
                      ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                      : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <BonusFormModal
          title="Bonus"
          onClose={() => setIsAddOpen(false)}
          onSubmit={async (data) => {
            await createBonus(toApiPayload(data));
            setIsAddOpen(false);
            await loadData();
          }}
        />
      )}

      {/* Edit Modal */}
      {editingBonus && (
        <BonusFormModal
          title="Bonus"
          initialData={editingBonus}
          onClose={() => setEditingBonus(null)}
          onSubmit={async (data) => {
            if (!editingBonus.uuid) throw new Error("UUID is missing");
            await updateBonus(editingBonus.uuid, toApiPayload(data));
            setEditingBonus(null);
            await loadData();
          }}
        />
      )}
    </div>
  );
}