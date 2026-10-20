"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  ChevronUp,
  FileSpreadsheet,
  FileText,
  ShoppingBag,
  Search,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

// --- Types & Interfaces ---
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

interface FilterState {
  search: string;
  company: string;
  supplier: string;
  project: string;
}

// --- Mock Data ---
const INITIAL_ROWS: PurchaseOrderRow[] = [
  {
    id: 1,
    projectType: "Real Estate",
    project: "Estern 19",
    titleOfWork: "Foundation Works",
    task: "Piling & Civil Structure",
    supplierName: "Mohin Business solution__",
    code: "PUR8777875",
    reference: "taz00009",
    date: "08 Sept 2026",
    subTotal: 0,
    grandTotal: 0,
    addedBy: "Admin",
    approvalSteps: ["All Approvals Completed", "Admin"],
  },
  {
    id: 2,
    projectType: "Office",
    project: "Rifat Eyecon City",
    titleOfWork: "Interior Design & Electrical",
    task: "Wiring & Lighting Installation",
    supplierName: "Mohin Business solution__",
    code: "PUR8777874",
    reference: "taz00015",
    date: "08 Sept 2026",
    subTotal: 450000,
    grandTotal: 450000,
    addedBy: "Tazmul Reza",
    approvalSteps: ["All Approvals Completed", "Rifat Hosain", "Admin"],
  },
  {
    id: 3,
    projectType: "Real Estate",
    project: "Estern 19",
    titleOfWork: "Safety Equipment Supply",
    task: "Helmets & Harnesses",
    supplierName: "Safety First",
    code: "PUR4141481",
    reference: "",
    date: "08 Sept 2026",
    subTotal: 110750,
    grandTotal: 110750,
    addedBy: "Admin",
    approvalSteps: ["All Approvals Completed"],
  },
];

const TABLE_HEADERS = [
  { key: "id", label: "ID", align: "left", width: "lg:w-[5%]" },
  { key: "projectType", label: "PROJECT TYPE", align: "left", width: "lg:w-[8%]" },
  { key: "project", label: "PROJECT", align: "left", width: "lg:w-[10%]" },
  { key: "titleOfWork", label: "TITLE / WORK", align: "left", width: "lg:w-[13%]" },
  { key: "supplierName", label: "SUPPLIER NAME", align: "left", width: "lg:w-[13%]" },
  { key: "code", label: "CODE / REF", align: "left", width: "lg:w-[9%]" },
  { key: "date", label: "DATE", align: "left", width: "lg:w-[8%]" },
  { key: "subTotal", label: "SUB TOTAL", align: "right", width: "lg:w-[8%]" },
  { key: "grandTotal", label: "GRAND TOTAL", align: "right", width: "lg:w-[9%]" },
  { key: "addedBy", label: "ADDED BY", align: "left", width: "lg:w-[7%]" },
  { key: "approvalLayer", label: "APPROVAL LAYER", align: "left", width: "lg:w-[12%]" },
  { key: "action", label: "ACTION", align: "center", width: "lg:w-[6%]" },
];

// --- Helper Functions ---
const formatCurrency = (amount: number) => {
  if (!amount) return "৳ 0";
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("BDT", "৳");
};

// --- Sub-Components ---

// 1. Page Header
const PageHeader = () => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20 dark:shadow-none">
        <ShoppingBag className="w-5 h-5 text-white" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          Purchase Order List
        </h1>
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
            Inventory
          </span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">List</span>
        </nav>
      </div>
    </div>

    <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40">
      <Plus className="w-4 h-4" />
      Create New Purchase Order
    </button>
  </div>
);

// 2. Filter Panel
const FilterPanel: React.FC<{
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  suppliers: string[];
  projects: string[];
}> = ({ filters, setFilters, suppliers, projects }) => {
  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 transition-colors">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Select Date Range
          </label>
          <input
            type="text"
            readOnly
            value="1 Sept, 2026 - 30 Sept, 2026"
            className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Company
          </label>
          <select
            value={filters.company}
            onChange={(e) => handleFilterChange("company", e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="Somikoron IT Ltd">Somikoron IT Ltd</option>
            <option value="All">All Companies</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Supplier
          </label>
          <select
            value={filters.supplier}
            onChange={(e) => handleFilterChange("supplier", e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Suppliers</option>
            {suppliers.map((sup) => (
              <option key={sup} value={sup}>
                {sup}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Project
          </label>
          <select
            value={filters.project}
            onChange={(e) => handleFilterChange("project", e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Projects</option>
            {projects.map((proj) => (
              <option key={proj} value={proj}>
                {proj}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// 3. Table Header Controls
const TableControls: React.FC<{
  entriesPerPage: number;
  setEntriesPerPage: (val: number) => void;
  search: string;
  setSearch: (val: string) => void;
}> = ({ entriesPerPage, setEntriesPerPage, search, setSearch }) => (
  <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
    <div className="flex items-center gap-2.5">
      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm">
        <FileSpreadsheet className="w-3.5 h-3.5" />
        Excel
      </button>
      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-sm">
        <FileText className="w-3.5 h-3.5" />
        PDF
      </button>
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 ml-2">
        <span>Show</span>
        <select
          value={entriesPerPage}
          onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
        >
          {[10, 25, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <span>entries</span>
      </div>
    </div>

    <div className="relative flex items-center">
      <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
      <input
        type="text"
        placeholder="Search orders..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-9 pr-3.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-52 transition-all"
      />
    </div>
  </div>
);

// 4. Data Table Component
const POTable: React.FC<{ visibleRows: PurchaseOrderRow[] }> = ({ visibleRows }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse min-w-[1000px] lg:min-w-0 lg:table-fixed">
      <thead>
        <tr className="bg-indigo-50/60 dark:bg-slate-800/60 text-indigo-900 dark:text-indigo-300 border-b border-slate-100 dark:border-slate-800">
          {TABLE_HEADERS.map((header) => (
            <th
              key={header.key}
              className={`px-3 py-3.5 text-[11px] font-bold tracking-wider uppercase whitespace-nowrap lg:whitespace-normal ${
                header.width
              } ${
                header.align === "right"
                  ? "text-right"
                  : header.align === "center"
                  ? "text-center"
                  : "text-left"
              }`}
            >
              {header.key === "id" ? (
                <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-600">
                  {header.label}
                  <ChevronUp className="w-3 h-3" />
                </div>
              ) : (
                header.label
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {visibleRows.map((row) => (
          <tr
            key={row.id}
            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors text-slate-700 dark:text-slate-300"
          >
            <td className="px-3 py-3.5 text-xs font-semibold text-slate-900 dark:text-slate-100 align-top">
              #{row.id}
            </td>
            <td className="px-3 py-3.5 text-xs align-top whitespace-nowrap lg:whitespace-normal">
              <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {row.projectType}
              </span>
            </td>
            <td className="px-3 py-3.5 text-xs font-medium align-top whitespace-nowrap lg:whitespace-normal">
              {row.project}
            </td>
            <td className="px-3 py-3.5 text-xs align-top whitespace-nowrap lg:whitespace-normal">
              <span className="font-medium text-slate-800 dark:text-slate-200 block">
                {row.titleOfWork || "—"}
              </span>
              {row.task && (
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                  Task: {row.task}
                </span>
              )}
            </td>
            <td className="px-3 py-3.5 text-xs align-top font-medium whitespace-nowrap lg:whitespace-normal">
              {row.supplierName}
            </td>
            <td className="px-3 py-3.5 text-xs align-top font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap lg:whitespace-normal">
              <div>{row.code}</div>
              {row.reference && (
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                  Ref: {row.reference}
                </div>
              )}
            </td>
            <td className="px-3 py-3.5 text-xs align-top text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {row.date}
            </td>
            <td className="px-3 py-3.5 text-xs font-medium text-right align-top whitespace-nowrap">
              {formatCurrency(row.subTotal)}
            </td>
            <td className="px-3 py-3.5 text-xs font-bold text-right align-top text-slate-900 dark:text-slate-100 whitespace-nowrap">
              {formatCurrency(row.grandTotal)}
            </td>
            <td className="px-3 py-3.5 text-xs align-top text-slate-600 dark:text-slate-400 whitespace-nowrap">
              {row.addedBy}
            </td>
            <td className="px-3 py-3.5 text-xs align-top">
              <div className="flex flex-wrap gap-1">
                {row.approvalSteps.map((step) => {
                  const isCompleted = step === "All Approvals Completed";
                  return (
                    <span
                      key={step}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        isCompleted
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
                          : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      ) : (
                        <UserCheck className="w-2.5 h-2.5" />
                      )}
                      {step}
                    </span>
                  );
                })}
              </div>
            </td>
            <td className="px-3 py-3.5 align-top text-center">
              <button className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm">
                Action
                <ChevronDown className="w-3 h-3" />
              </button>
            </td>
          </tr>
        ))}

        {visibleRows.length === 0 && (
          <tr>
            <td
              colSpan={TABLE_HEADERS.length}
              className="px-3 py-10 text-center text-xs text-slate-400 dark:text-slate-500"
            >
              No matching purchase orders found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// 5. Pagination Component
const Pagination: React.FC<{
  startIdx: number;
  visibleCount: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}> = ({ startIdx, visibleCount, totalCount, currentPage, totalPages, setCurrentPage }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-slate-100 dark:border-slate-800">
    <span className="text-xs text-slate-500 dark:text-slate-400">
      Showing {totalCount === 0 ? 0 : startIdx + 1} to {startIdx + visibleCount} of {totalCount} entries
    </span>
    <div className="flex items-center gap-1.5">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
            page === currentPage
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  </div>
);

// --- Main Component ---
const PurchaseOrderList = () => {
  const [rows] = useState<PurchaseOrderRow[]>(INITIAL_ROWS);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    company: "Somikoron IT Ltd",
    supplier: "",
    project: "",
  });

  // Extract Unique Dynamic Options
  const suppliers = useMemo(() => Array.from(new Set(rows.map((r) => r.supplierName))), [rows]);
  const projects = useMemo(() => Array.from(new Set(rows.map((r) => r.project))), [rows]);

  // Combined Search & Filter Logic
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const q = filters.search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        [row.project, row.projectType, row.supplierName, row.code, row.addedBy, row.titleOfWork].some(
          (field) => field.toLowerCase().includes(q)
        );

      const matchesSupplier = !filters.supplier || row.supplierName === filters.supplier;
      const matchesProject = !filters.project || row.project === filters.project;

      return matchesSearch && matchesSupplier && matchesProject;
    });
  }, [filters, rows]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / entriesPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * entriesPerPage;
  const visibleRows = filteredRows.slice(startIdx, startIdx + entriesPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 transition-colors">
      <div className="flex-1 px-4 sm:px-6 py-6 space-y-5 max-w-[1600px] mx-auto w-full">
        {/* Page Header */}
        <PageHeader />

        {/* Filters Section */}
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          suppliers={suppliers}
          projects={projects}
        />

        {/* Table Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <TableControls
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
            search={filters.search}
            setSearch={(val) => {
              setFilters((prev) => ({ ...prev, search: val }));
              setCurrentPage(1);
            }}
          />

          <POTable visibleRows={visibleRows} />

          <Pagination
            startIdx={startIdx}
            visibleCount={visibleRows.length}
            totalCount={filteredRows.length}
            currentPage={safePage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <span>2026 © Somikoron IT LTD</span>
        <span>Design &amp; Developed by Somikoron IT LTD</span>
      </footer>
    </div>
  );
};

export default PurchaseOrderList;