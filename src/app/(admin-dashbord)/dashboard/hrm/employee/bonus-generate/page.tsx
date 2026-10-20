/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Trash2,
  X,
  Check,
  Loader2,
  Gift,
  FileText,
  ChevronDown,
} from "lucide-react";

// ---------- Types ----------
export interface BonusGenerate {
  id: number | string;
  uuid: string;
  bonusId: string;
  bonusName: string;
  employeeId: string;
  employeeName: string;
  amount: string;
  status: string;
}

interface EmployeeFull {
  uuid: string;
  name: string;
  code?: string;
  grossSalary: number;
}

interface BonusFull {
  uuid: string;
  name: string;
  percentage: number;
  festivalDate?: string;
}

interface OptionItem {
  uuid: string;
  name: string;
  code?: string;
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

// ---------- Fetch full bonus list (with percentage) ----------
async function fetchBonuses(): Promise<BonusFull[]> {
  try {
    const url = `${API_BASE}/realbizpro/api/v1/bonus?page=1&limit=100&status=active&sortOrder=DESC&withDeleted=false`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return [];
    const list = json?.data?.data || [];
    return list.map((b: any) => ({
      uuid: b.uuid,
      name: b.name || "Unnamed",
      percentage: Number(b.percentage) || 0,
      festivalDate: b.festivalDate,
    }));
  } catch (err) {
    console.error("fetchBonuses error →", err);
    return [];
  }
}

// ---------- Fetch full employee list (with grossSalary) ----------
async function fetchEmployees(): Promise<EmployeeFull[]> {
  try {
    const url = `${API_BASE}/realbizpro/api/v1/employee-list?page=1&limit=100&status=active&sortBy=createdAt&sortOrder=DESC&withDeleted=false`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return [];
    const list = json?.data?.data || [];
    return list.map((e: any) => ({
      uuid: e.uuid,
      name: e.name || e.employeeCode || "Unnamed",
      code: e.employeeCode || e.code,
      grossSalary: Number(e.grossSalary) || 0,
    }));
  } catch (err) {
    console.error("fetchEmployees error →", err);
    return [];
  }
}

// ---------- Fetch bonus-generate list ----------
async function fetchBonusGenerates(): Promise<{
  data: BonusGenerate[];
  meta: any;
}> {
  const url = `${API_BASE}/realbizpro/api/v1/bonus-generate?page=1&limit=100&skip=0&status=active&sortBy=createdAt&sortOrder=DESC&withDeleted=false`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const json = await handleRes(res, "fetch bonus-generate");

  const mapped: BonusGenerate[] = (json?.data?.data || [])
    .map((item: any) => ({
      id: item.id ?? item.uuid,
      uuid: item.uuid,
      bonusId: item.bonusId || item.bonus?.uuid || "",
      bonusName: item.bonus?.name || item.bonusName || "",
      employeeId: item.employeeId || item.employee?.uuid || "",
      employeeName:
        item.employee?.name ||
        item.employee?.employeeCode ||
        item.employeeName ||
        "",
      amount: String(item.amount ?? "0"),
      status: item.status || "active",
    }))
    .filter(
      (item: BonusGenerate) => item.status?.toLowerCase() === "active",
    );

  return { data: mapped, meta: json?.data?.meta };
}

async function createBonusGenerate(payload: Record<string, any>) {
  console.log("POST bonus-generate payload →", payload);
  const res = await fetch(`${API_BASE}/realbizpro/api/v1/bonus-generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await handleRes(res, "create bonus-generate");
  console.log("POST bonus-generate response →", json);
  return json;
}

async function softDeleteBonusGenerate(uuid: string) {
  const res = await fetch(
    `${API_BASE}/realbizpro/api/v1/bonus-generate/${uuid}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    },
  );
  return handleRes(res, "delete bonus-generate");
}

// ---------- Searchable Select ----------
function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select value",
  disabled = false,
}: {
  options: OptionItem[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.uuid === value);
  const displayValue = selected
    ? selected.code
      ? `${selected.code} - ${selected.name}`
      : selected.name
    : "";

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return options.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        (o.code || "").toLowerCase().includes(q),
    );
  }, [options, query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-left text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none flex items-center justify-between disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
      >
        <span className={displayValue ? "text-slate-800" : "text-slate-400"}>
          {displayValue || placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {open && !disabled && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <button
                  key={opt.uuid}
                  type="button"
                  onClick={() => {
                    onChange(opt.uuid);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    value === opt.uuid
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt.code ? `${opt.code} - ${opt.name}` : opt.name}
                </button>
              ))
            ) : (
              <div className="px-3 py-3 text-xs text-slate-400 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Generate Modal ----------
function BonusGenerateModal({
  bonuses,
  employees,
  onClose,
  onSubmit,
}: {
  bonuses: BonusFull[];
  employees: EmployeeFull[];
  onClose: () => void;
  onSubmit: (
    entries: { bonusId: string; employeeId: string; amount: number }[],
  ) => Promise<void>;
}) {
  const [bonusId, setBonusId] = useState("");
  const [allEmployees, setAllEmployees] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const selectedBonus = bonuses.find((b) => b.uuid === bonusId);
  const selectedEmployee = employees.find((e) => e.uuid === employeeId);

  // Auto-calculate amount when bonus + employee changes
  useEffect(() => {
    if (!selectedBonus) {
      setAmount("");
      return;
    }
    if (allEmployees) {
      // We'll compute per-employee on submit; show a hint in the input
      setAmount("");
      return;
    }
    if (selectedEmployee) {
      const calc =
        (selectedEmployee.grossSalary * selectedBonus.percentage) / 100;
      setAmount(calc ? String(calc) : "");
    } else {
      setAmount("");
    }
  }, [bonusId, employeeId, allEmployees, selectedBonus, selectedEmployee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bonusId) {
      setFormError("Please select a Bonus");
      return;
    }
    if (!allEmployees && !employeeId) {
      setFormError("Please select an Employee or check 'All Employees'");
      return;
    }

    const entries: {
      bonusId: string;
      employeeId: string;
      amount: number;
    }[] = [];

    if (allEmployees) {
      // Generate for every employee using each one's grossSalary
      for (const emp of employees) {
        const amt =
          selectedBonus != null
            ? (emp.grossSalary * selectedBonus.percentage) / 100
            : Number(amount) || 0;
        entries.push({
          bonusId,
          employeeId: emp.uuid,
          amount: Math.round(amt * 100) / 100,
        });
      }
    } else {
      const amt = Number(amount) || 0;
      entries.push({ bonusId, employeeId, amount: amt });
    }

    if (entries.length === 0) {
      setFormError("No employees to generate for");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      await onSubmit(entries);
    } catch (err: any) {
      setFormError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const employeeOptions: OptionItem[] = employees.map((e) => ({
    uuid: e.uuid,
    name: e.name,
    code: e.code,
  }));

  const bonusOptions: OptionItem[] = bonuses.map((b) => ({
    uuid: b.uuid,
    name: `${b.name} (${b.percentage}%)`,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
            <Gift className="w-4 h-4 text-indigo-600" />
            Bonus
          </h3>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-800 border border-slate-300 hover:bg-slate-100 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Bonus */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Bonus <span className="text-rose-500">*</span>
            </label>
            <SearchableSelect
              options={bonusOptions}
              value={bonusId}
              onChange={(v) => setBonusId(v)}
              placeholder="Select Bonus"
            />
            {selectedBonus && (
              <p className="text-xs text-slate-500 mt-1">
                Percentage: <b>{selectedBonus.percentage}%</b>
                {selectedBonus.festivalDate
                  ? ` • Festival: ${selectedBonus.festivalDate}`
                  : ""}
              </p>
            )}
          </div>

          {/* All Employees toggle */}
          <div className="flex items-center gap-2">
            <input
              id="all-employees"
              type="checkbox"
              checked={allEmployees}
              onChange={(e) => {
                setAllEmployees(e.target.checked);
                if (e.target.checked) setEmployeeId("");
              }}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="all-employees"
              className="text-sm text-slate-700 cursor-pointer"
            >
              Generate for <b>All Employees</b> (
              {employees.length} total)
            </label>
          </div>

          {/* Employee (single) */}
          {!allEmployees && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Employee <span className="text-rose-500">*</span>
              </label>
              <SearchableSelect
                options={employeeOptions}
                value={employeeId}
                onChange={(v) => setEmployeeId(v)}
                placeholder="Select Employee"
              />
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Amount{" "}
              {allEmployees ? (
                <span className="text-slate-400 font-normal">
                  (auto-calculated per employee)
                </span>
              ) : (
                <span className="text-slate-400 font-normal">
                  (auto from gross salary × %)
                </span>
              )}
            </label>
            <input
              type="number"
              step="0.01"
              value={allEmployees ? "" : amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={allEmployees}
              placeholder={allEmployees ? "Auto per employee" : "Amount"}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
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
export default function BonusGenerateListPage() {
  const [records, setRecords] = useState<BonusGenerate[]>([]);
  const [bonuses, setBonuses] = useState<BonusFull[]>([]);
  const [employees, setEmployees] = useState<EmployeeFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterBonusId, setFilterBonusId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [genRes, bonusList, empList] = await Promise.all([
        fetchBonusGenerates(),
        fetchBonuses(),
        fetchEmployees(),
      ]);

      const resolved = genRes.data.map((r) => ({
        ...r,
        bonusName:
          r.bonusName ||
          bonusList.find((b) => b.uuid === r.bonusId)?.name ||
          "",
        employeeName:
          r.employeeName ||
          empList.find((e) => e.uuid === r.employeeId)?.name ||
          "",
      }));

      setRecords(resolved);
      setBonuses(bonusList);
      setEmployees(empList);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load bonus generates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter by Bonus + search
  const filteredRecords = records.filter((item) => {
    const matchesBonus = !filterBonusId || item.bonusId === filterBonusId;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.bonusName.toLowerCase().includes(q) ||
      item.employeeName.toLowerCase().includes(q) ||
      item.amount.includes(q);
    return matchesBonus && matchesSearch;
  });

  const totalPages =
    Math.ceil(filteredRecords.length / entriesPerPage) || 1;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentTableData = filteredRecords.slice(
    startIndex,
    startIndex + entriesPerPage,
  );

  const handleDelete = async (rec: BonusGenerate) => {
    if (!confirm(`Delete bonus record for "${rec.employeeName}"?`)) return;
    const uuidToDelete = rec.uuid || String(rec.id);
    if (!uuidToDelete) {
      alert("UUID is missing – cannot delete");
      return;
    }
    try {
      setActionLoading(true);
      await softDeleteBonusGenerate(uuidToDelete);
      setRecords((prev) =>
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

  const handlePdf = () => {
    window.print();
  };

  const bonusFilterOptions: OptionItem[] = bonuses.map((b) => ({
    uuid: b.uuid,
    name: b.name,
  }));

  return (
    <div className="min-h-screen bg-white text-slate-900 p-4 sm:p-6 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
              <span>Home</span> / <span>Employee</span> /{" "}
              <span className="text-indigo-600 font-medium">
                Bonus Generate List
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Bonus Generate Management
            </h1>
          </div>

          <button
            onClick={() => setIsGenerateOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Bonus Generate
          </button>
        </div>

        {/* Filter Row: Bonus + PDF */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end max-w-3xl">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Bonus <span className="text-rose-500">*</span>
            </label>
            <SearchableSelect
              options={bonusFilterOptions}
              value={filterBonusId}
              onChange={(val) => {
                setFilterBonusId(val);
                setCurrentPage(1);
              }}
              placeholder="Select Bonus"
            />
          </div>
          <button
            onClick={handlePdf}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm transition-colors"
          >
            <FileText className="w-4 h-4" />
            Pdf
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
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="flex items-center justify-center py-16 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading bonus generates...
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
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4 w-40">Amount</th>
                    <th className="py-3 px-4 text-center w-24">Action</th>
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
                          {item.bonusName || "—"}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {item.employeeName || "—"}
                        </td>
                        <td className="py-3 px-4 font-mono text-sm text-slate-800">
                          {Number(item.amount).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDelete(item)}
                            disabled={actionLoading}
                            title="Delete"
                            className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-md transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
                Showing {filteredRecords.length > 0 ? startIndex + 1 : 0} to{" "}
                {Math.min(startIndex + entriesPerPage, filteredRecords.length)}{" "}
                of {filteredRecords.length} entries
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
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(0, 6)
                  .map((page) => (
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
                  ))}
                {totalPages > 6 && (
                  <>
                    <span className="px-1">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-1 rounded font-medium ${
                        currentPage === totalPages
                          ? "border border-indigo-600 bg-indigo-600 text-white"
                          : "border border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
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

      {/* Generate Modal */}
      {isGenerateOpen && (
        <BonusGenerateModal
          bonuses={bonuses}
          employees={employees}
          onClose={() => setIsGenerateOpen(false)}
          onSubmit={async (entries) => {
            // POST each entry sequentially
            for (const entry of entries) {
              await createBonusGenerate({
                bonusId: entry.bonusId,
                employeeId: entry.employeeId,
                amount: entry.amount,
                status: "active",
              });
            }
            setIsGenerateOpen(false);
            setToast(
              `Generated ${entries.length} bonus record(s) successfully`,
            );
            setTimeout(() => setToast(null), 2500);
            await loadData();
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <Check className="w-4 h-4" />
          {toast}
        </div>
      )}
    </div>
  );
}