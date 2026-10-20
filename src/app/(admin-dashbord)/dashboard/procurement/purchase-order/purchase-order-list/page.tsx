"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Plus,
  ArrowUpDown,
  FileSpreadsheet,
  FileText,
  ShoppingBag,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

interface PurchaseOrderRow {
  id: number;
  projectType: string;
  project: string;
  titleOfWork: string;
  task: string;
  supplierName: string;
  code: string;
  reference: string;
  date: string;
  subTotal: number;
  grandTotal: number;
  addedBy: string;
  approvalSteps: string[];
}

interface PurchaseOrderListProps {
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const initialRows: PurchaseOrderRow[] = [
  {
    id: 1,
    projectType: "Real Estate",
    project: "Estern 19",
    titleOfWork: "Civil Work",
    task: "Foundation",
    supplierName: "Mohin Business solution__",
    code: "PUR8777875",
    reference: "taz00009",
    date: "2026-09-08",
    subTotal: 0,
    grandTotal: 0,
    addedBy: "Admin",
    approvalSteps: ["All Approvals Completed", "Admin"],
  },
  {
    id: 2,
    projectType: "Office",
    project: "Rifat Eyecon City",
    titleOfWork: "Interior Work",
    task: "Decoration",
    supplierName: "Mohin Business solution__",
    code: "PUR8777874",
    reference: "taz00015",
    date: "2026-09-08",
    subTotal: 450000,
    grandTotal: 450000,
    addedBy: "Tazmul Reza",
    approvalSteps: ["All Approvals Completed", "Rifat Hosain", "Admin"],
  },
  {
    id: 3,
    projectType: "Real Estate",
    project: "Estern 19",
    titleOfWork: "Electrical Work",
    task: "Wiring",
    supplierName: "Safety First",
    code: "PUR4141481",
    reference: "",
    date: "2026-09-08",
    subTotal: 110750,
    grandTotal: 110750,
    addedBy: "Admin",
    approvalSteps: ["All Approvals Completed"],
  },
];

const tableHeaders = [
  { label: "ID", key: "id" },
  { label: "PROJECT TYPE", key: "projectType" },
  { label: "PROJECT", key: "project" },
  { label: "TITLE/NAME OF WORK", key: "titleOfWork" },
  { label: "SUPPLIER NAME", key: "supplierName" },
  { label: "CODE", key: "code" },
  { label: "DATE", key: "date" },
  { label: "SUB TOTAL", key: "subTotal" },
  { label: "GRAND TOTAL", key: "grandTotal" },
  { label: "ADDED BY", key: "addedBy" },
  { label: "APPROVAL LAYER", key: "approvalSteps" },
  { label: "ACTION", key: "action" },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default function PurchaseOrderList({
  isDarkMode: externalDarkMode,
  onToggleDarkMode,
}: PurchaseOrderListProps) {
  // Dark Mode Internal State & Toggle Logic (Without Toggle Button)
  const [internalDarkMode, setInternalDarkMode] = useState(false);
  const isDark = externalDarkMode ?? internalDarkMode;

  // Dark Mode Toggle Function
  const toggleDarkMode = () => {
    if (onToggleDarkMode) {
      onToggleDarkMode();
    } else {
      setInternalDarkMode((prev) => !prev);
    }
  };

  const [rows] = useState<PurchaseOrderRow[]>(initialRows);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionId, setActiveActionId] = useState<number | null>(null);

  // Filters State
  const [supplierFilter, setSupplierFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PurchaseOrderRow;
    direction: "asc" | "desc";
  }>({ key: "id", direction: "desc" });

  const suppliers = useMemo(
    () => Array.from(new Set(rows.map((r) => r.supplierName))),
    [rows]
  );
  const projects = useMemo(
    () => Array.from(new Set(rows.map((r) => r.project))),
    [rows]
  );

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        [r.project, r.projectType, r.supplierName, r.code, r.addedBy].some(
          (field) => field.toLowerCase().includes(q)
        );

      const matchesSupplier =
        !supplierFilter || r.supplierName === supplierFilter;
      const matchesProject = !projectFilter || r.project === projectFilter;

      return matchesSearch && matchesSupplier && matchesProject;
    });
  }, [search, supplierFilter, projectFilter, rows]);

  const sortedRows = useMemo(() => {
    const items = [...filteredRows];
    items.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return items;
  }, [filteredRows, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / entriesPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * entriesPerPage;
  const visibleRows = sortedRows.slice(startIdx, startIdx + entriesPerPage);

  const handleSort = (key: keyof PurchaseOrderRow) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 transition-colors duration-200">
        <div className="flex-1 px-6 py-6 space-y-5">
          {/* Page Header */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-200 dark:shadow-none">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-[19px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                  Purchase Order List
                </h1>
                <nav className="flex items-center gap-1.5 text-[12.5px] text-slate-400 dark:text-slate-500">
                  <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Home
                  </Link>
                  <ChevronRight className="w-3 h-3" />
                  <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                    Inventory
                  </span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-slate-500 dark:text-slate-400">List</span>
                </nav>
              </div>
            </div>

            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-sm transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Create New Purchase Order
            </button>
          </div>

          {/* Filter Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm p-5 transition-colors">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[13px] text-slate-500 dark:text-slate-400 mb-1.5">
                  Date Range
                </label>
                <input
                  type="text"
                  readOnly
                  value="1 Sept, 2026 - 30 Sept, 2026"
                  className="w-full px-3.5 py-2.5 text-[13px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-600 dark:text-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] text-slate-500 dark:text-slate-400 mb-1.5">
                  Supplier
                </label>
                <select
                  value={supplierFilter}
                  onChange={(e) => {
                    setSupplierFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3.5 py-2.5 text-[13px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
                >
                  <option value="">All Suppliers</option>
                  {suppliers.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] text-slate-500 dark:text-slate-400 mb-1.5">
                  Project
                </label>
                <select
                  value={projectFilter}
                  onChange={(e) => {
                    setProjectFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3.5 py-2.5 text-[13px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
                >
                  <option value="">All Projects</option>
                  {projects.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSupplierFilter("");
                    setProjectFilter("");
                    setSearch("");
                  }}
                  className="w-full py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm overflow-hidden transition-colors">
            {/* Table Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Excel
                </button>
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium text-white bg-rose-500 hover:bg-rose-600 shadow-sm transition-colors">
                  <FileText className="w-3.5 h-3.5" />
                  PDF
                </button>
                <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 ml-2">
                  <span>Show</span>
                  <select
                    value={entriesPerPage}
                    onChange={(e) => {
                      setEntriesPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-[13px] text-slate-700 dark:text-slate-200"
                  >
                    {[10, 25, 50].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <span>entries</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
                <span>Search:</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search orders..."
                  className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 rounded-lg px-3.5 py-1.5 text-[13px] w-48 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
                />
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                    {tableHeaders.map((header) => (
                      <th
                        key={header.key}
                        onClick={() =>
                          header.key !== "action" &&
                          header.key !== "approvalSteps" &&
                          handleSort(header.key as keyof PurchaseOrderRow)
                        }
                        className="px-3 py-3 text-[11px] font-semibold tracking-wide whitespace-nowrap cursor-pointer select-none hover:bg-indigo-100/50 dark:hover:bg-indigo-900/40 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          {header.label}
                          {header.key !== "action" &&
                            header.key !== "approvalSteps" && (
                              <ArrowUpDown className="w-3 h-3 text-indigo-400 dark:text-indigo-500" />
                            )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                        idx !== visibleRows.length - 1
                          ? "border-b border-slate-100 dark:border-slate-800/60"
                          : ""
                      }`}
                    >
                      <td className="px-3 py-3.5 text-[13px] font-medium text-slate-800 dark:text-slate-200">
                        #{row.id}
                      </td>
                      <td className="px-3 py-3.5 text-[13px] text-slate-600 dark:text-slate-300">
                        {row.projectType}
                      </td>
                      <td className="px-3 py-3.5 text-[13px] font-medium text-slate-800 dark:text-slate-200">
                        {row.project}
                      </td>
                      <td className="px-3 py-3.5 text-[13px] text-slate-600 dark:text-slate-300">
                        <div>{row.titleOfWork || "—"}</div>
                        {row.task && (
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                            Task: {row.task}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3.5 text-[13px] text-slate-600 dark:text-slate-300">
                        {row.supplierName}
                      </td>
                      <td className="px-3 py-3.5 text-[13px]">
                        <span className="font-mono text-slate-600 dark:text-slate-400">
                          {row.code}
                        </span>
                        {row.reference && (
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                            Ref: {row.reference}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3.5 text-[13px] whitespace-nowrap text-slate-600 dark:text-slate-300">
                        {row.date}
                      </td>
                      <td className="px-3 py-3.5 text-[13px] font-medium text-slate-700 dark:text-slate-300">
                        ৳{formatCurrency(row.subTotal)}
                      </td>
                      <td className="px-3 py-3.5 text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                        ৳{formatCurrency(row.grandTotal)}
                      </td>
                      <td className="px-3 py-3.5 text-[13px] text-slate-600 dark:text-slate-300">
                        {row.addedBy}
                      </td>
                      <td className="px-3 py-3.5 text-[13px]">
                        <div className="flex flex-col gap-1">
                          {row.approvalSteps.map((step) => (
                            <span
                              key={step}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 px-2 py-0.5 rounded-full w-fit"
                            >
                              ✓ {step}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-[13px] relative">
                        <button
                          onClick={() =>
                            setActiveActionId(
                              activeActionId === row.id ? null : row.id
                            )
                          }
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeActionId === row.id && (
                          <div className="absolute right-3 top-10 z-10 w-36 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-lg rounded-xl py-1 text-[12.5px]">
                            <button
                              onClick={() => setActiveActionId(null)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400" /> View
                            </button>
                            <button
                              onClick={() => setActiveActionId(null)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                            >
                              <Edit className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400" /> Edit
                            </button>
                            <button
                              onClick={() => setActiveActionId(null)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                  {visibleRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={tableHeaders.length}
                        className="px-3 py-8 text-center text-[13px] text-slate-400 dark:text-slate-500"
                      >
                        No purchase orders matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[12.5px] text-slate-400 dark:text-slate-500">
                Showing {sortedRows.length === 0 ? 0 : startIdx + 1} to{" "}
                {Math.min(startIdx + entriesPerPage, sortedRows.length)} of{" "}
                {sortedRows.length} entries
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-colors ${
                      page === safePage
                        ? "bg-indigo-600 text-white dark:bg-indigo-600"
                        : "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  disabled={safePage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 text-[12px] text-slate-500 dark:text-slate-400 transition-colors">
          <span>2026 © Somikoron IT LTD</span>
          <span>Designed & Developed by Somikoron IT LTD</span>
        </footer>
      </div>
    </div>
  );
}