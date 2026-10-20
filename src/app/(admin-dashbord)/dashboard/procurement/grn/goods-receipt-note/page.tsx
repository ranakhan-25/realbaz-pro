"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Eye,
  SquarePen,
  Trash2,
  PackageCheck,
  Search,
  CheckCircle2,
  Calendar,
  X,
  FileX2,
} from "lucide-react";

// --- Types ---
interface GrnRow {
  id: number;
  projectType: string;
  project: string;
  task: string;
  supplierName: string;
  code: string;
  reference: string;
  date: string;
  addedBy: string;
  approvalSteps: string[];
  isBilled: boolean;
}

// --- Mock Data ---
const INITIAL_ROWS: GrnRow[] = [
  {
    id: 1,
    projectType: "Office",
    project: "Rifat Eyecon City",
    task: "Foundation",
    supplierName: "Safety First Suppliers",
    code: "PUR7987199",
    reference: "REF-2026-001",
    date: "07 Sept 2026",
    addedBy: "Admin",
    approvalSteps: ["All Approvals Completed", "Admin"],
    isBilled: true,
  },
  {
    id: 2,
    projectType: "Office",
    project: "Rifat Eyecon City",
    task: "Glass Fitting",
    supplierName: "Delta Glass & Aluminium",
    code: "PUR7987200",
    reference: "REF-2026-002",
    date: "07 Sept 2026",
    addedBy: "Admin",
    approvalSteps: ["All Approvals Completed", "Admin"],
    isBilled: false,
  },
  {
    id: 3,
    projectType: "Office",
    project: "Rifat Eyecon City",
    task: "IT Infrastructure",
    supplierName: "Mohin Business solution",
    code: "PUR8777874",
    reference: "REF-2026-003",
    date: "08 Sept 2026",
    addedBy: "Tazmul Reza",
    approvalSteps: ["All Approvals Completed", "Rifat Hosain", "Admin"],
    isBilled: false,
  },
];

const TABLE_HEADERS = [
  "ID",
  "PROJECT TYPE",
  "PROJECT",
  "TASK",
  "SUPPLIER NAME",
  "CODE",
  "REFERENCE",
  "DATE",
  "ADDED BY",
  "ATTACHMENT",
  "APPROVAL",
  "ACTION",
];

const LG_COLUMN_WIDTHS: Record<string, string> = {
  ID: "lg:w-[4%]",
  "PROJECT TYPE": "lg:w-[8%]",
  PROJECT: "lg:w-[13%]",
  TASK: "lg:w-[8%]",
  "SUPPLIER NAME": "lg:w-[13%]",
  CODE: "lg:w-[9%]",
  REFERENCE: "lg:w-[8%]",
  DATE: "lg:w-[8%]",
  "ADDED BY": "lg:w-[8%]",
  ATTACHMENT: "lg:w-[5%]",
  APPROVAL: "lg:w-[10%]",
  ACTION: "lg:w-[6%]",
};

// --- Reusable Sub-Components ---

// Filter Select Dropdown Component
const FilterField = ({
  label,
  value,
  placeholder,
  onClear,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  onClear?: () => void;
}) => (
  <div>
    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
      {label}
    </label>
    <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-700 dark:text-slate-200 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors">
      <span className={value ? "font-medium" : "text-slate-400 dark:text-slate-500"}>
        {value || placeholder || "Select option"}
      </span>
      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
        {value && onClear && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="hover:text-slate-600 dark:hover:text-slate-300"
            aria-label={`Clear ${label}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <ChevronDown className="w-3.5 h-3.5" />
      </div>
    </div>
  </div>
);

// Main Component
export default function GoodsReceiptNoteList() {
  const [rows] = useState<GrnRow[]>(INITIAL_ROWS);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter Logic
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.project, r.projectType, r.supplierName, r.code, r.addedBy, r.reference].some(
        (field) => field.toLowerCase().includes(q)
      )
    );
  }, [search, rows]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / entriesPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * entriesPerPage;
  const visibleRows = filteredRows.slice(startIdx, startIdx + entriesPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <div className="flex-1 px-4 sm:px-6 py-6 space-y-6 max-w-[1600px] w-full mx-auto">
        
        {/* --- Header & Breadcrumb --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Goods Receipt Note (GRN)
              </h1>
              <nav className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Home
                </Link>
                <ChevronRight className="w-3 h-3" />
                <button className="flex items-center gap-0.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Inventory
                  <ChevronDown className="w-3 h-3" />
                </button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-600 dark:text-slate-400 font-medium">List</span>
              </nav>
            </div>
          </div>
        </div>

        {/* --- Filters Panel --- */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Select Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value="1 Sept, 2026 - 30 Sept, 2026"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <FilterField label="Company" value="Somikoron IT Ltd" />
            <FilterField label="Supplier" placeholder="Select supplier" />
            <FilterField label="Project" placeholder="Select project" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <FilterField label="Title / Name of Work" placeholder="Select title" />
            <FilterField label="Task" placeholder="Select task" />
          </div>
        </div>

        {/* --- Table Section Card --- */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          
          {/* Table Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search GRN..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px] lg:min-w-0 lg:table-fixed">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-b border-slate-200/80 dark:border-slate-800">
                  {TABLE_HEADERS.map((header) => (
                    <th
                      key={header}
                      className={`px-3 py-3 text-[11px] font-semibold uppercase tracking-wider ${LG_COLUMN_WIDTHS[header]}`}
                    >
                      {header === "ID" ? (
                        <div className="flex items-center gap-1 cursor-pointer select-none hover:text-indigo-600 dark:hover:text-indigo-400">
                          {header}
                          <ChevronUp className="w-3 h-3" />
                        </div>
                      ) : (
                        header
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {visibleRows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-3 py-3.5 font-medium text-slate-900 dark:text-slate-100 align-top">
                      #{row.id}
                    </td>
                    <td className="px-3 py-3.5 align-top text-slate-600 dark:text-slate-400">
                      {row.projectType}
                    </td>
                    <td className="px-3 py-3.5 font-medium text-slate-800 dark:text-slate-200 align-top break-words">
                      {row.project}
                    </td>
                    <td className="px-3 py-3.5 align-top text-slate-500 dark:text-slate-400">
                      {row.task || "—"}
                    </td>
                    <td className="px-3 py-3.5 align-top text-slate-700 dark:text-slate-300 break-words font-medium">
                      {row.supplierName}
                    </td>
                    <td className="px-3 py-3.5 align-top font-mono text-slate-600 dark:text-slate-400">
                      {row.code}
                    </td>
                    <td className="px-3 py-3.5 align-top text-slate-500 dark:text-slate-400">
                      {row.reference || "—"}
                    </td>
                    <td className="px-3 py-3.5 align-top text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="px-3 py-3.5 align-top text-slate-600 dark:text-slate-400">
                      {row.addedBy}
                    </td>
                    <td className="px-3 py-3.5 align-top text-slate-400 dark:text-slate-600">—</td>
                    
                    {/* Approvals */}
                    <td className="px-3 py-3.5 align-top">
                      <div className="flex flex-col gap-1">
                        {row.approvalSteps.map((step) => (
                          <span
                            key={step}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            {step}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Actions & Status */}
                    <td className="px-3 py-3.5 align-top">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          title="View Details"
                          className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {row.isBilled ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide uppercase bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 whitespace-nowrap">
                            Billed
                          </span>
                        ) : (
                          <>
                            <button
                              title="Edit"
                              className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all"
                            >
                              <SquarePen className="w-4 h-4" />
                            </button>
                            <button
                              title="Delete"
                              className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Empty State */}
                {visibleRows.length === 0 && (
                  <tr>
                    <td colSpan={TABLE_HEADERS.length} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
                        <FileX2 className="w-8 h-8 stroke-[1.5]" />
                        <p className="text-sm font-medium">No GRN records found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing {filteredRows.length === 0 ? 0 : startIdx + 1} to{" "}
              {Math.min(startIdx + visibleRows.length, filteredRows.length)} of{" "}
              {filteredRows.length} entries
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-800 transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-medium transition-colors ${
                    page === safePage
                      ? "bg-indigo-600 text-white dark:bg-indigo-500"
                      : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-800 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap justify-between items-center gap-2">
        <span>2026 © Somikoron IT LTD</span>
        <span>Design &amp; Developed by Somikoron IT LTD</span>
      </footer>
    </div>
  );
}