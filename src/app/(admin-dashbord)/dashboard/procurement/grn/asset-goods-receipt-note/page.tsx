"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  ChevronUp,
  PackageCheck,
  Search,
  Calendar,
  Filter,
  FileText,
  Paperclip,
  CheckCircle2,
  X,
  RotateCcw,
} from "lucide-react";

interface AssetGrnRow {
  id: number;
  projectType: string;
  project: string;
  titleOfWork: string;
  supplierName: string;
  code: string;
  reference: string;
  date: string;
  subTotal: number;
  grandTotal: number;
  addedBy: string;
  hasAttachment?: boolean;
  approvalSteps: string[];
}

// Sample Data for preview (Replace or fetch from API)
const initialRows: AssetGrnRow[] = [
  {
    id: 1,
    projectType: "Internal",
    project: "HQ Expansion",
    titleOfWork: "Electrical Wiring & Setup",
    supplierName: "ElectroTech Ltd",
    code: "GRN-2026-001",
    reference: "PO-8821",
    date: "2026-09-02",
    subTotal: 45000,
    grandTotal: 51750,
    addedBy: "Admin User",
    hasAttachment: true,
    approvalSteps: ["Manager", "Accounts"],
  },
  {
    id: 2,
    projectType: "Client Project",
    project: "Smart City Automation",
    titleOfWork: "Sensor Hardware Supply",
    supplierName: "Global Net Solutions",
    code: "GRN-2026-002",
    reference: "PO-8845",
    date: "2026-09-05",
    subTotal: 120000,
    grandTotal: 138000,
    addedBy: "Rahim Ahmed",
    hasAttachment: false,
    approvalSteps: ["Manager"],
  },
];

const tableHeaders = [
  "ID",
  "PROJECT TYPE",
  "PROJECT",
  "TITLE/NAME OF WORK",
  "SUPPLIER NAME",
  "CODE",
  "REFERENCE",
  "DATE",
  "SUB TOTAL",
  "GRAND TOTAL",
  "ADDED BY",
  "ATTACHMENT",
  "APPROVAL",
  "ACTION",
];

// Large screen Column Widths - Sums to exactly 100% (No horizontal scrolling on lg+)
const lgColumnWidths: Record<string, string> = {
  ID: "lg:w-[4%]",
  "PROJECT TYPE": "lg:w-[8%]",
  PROJECT: "lg:w-[9%]",
  "TITLE/NAME OF WORK": "lg:w-[11%]",
  "SUPPLIER NAME": "lg:w-[11%]",
  CODE: "lg:w-[8%]",
  REFERENCE: "lg:w-[7%]",
  DATE: "lg:w-[7%]",
  "SUB TOTAL": "lg:w-[7%]",
  "GRAND TOTAL": "lg:w-[7%]",
  "ADDED BY": "lg:w-[7%]",
  ATTACHMENT: "lg:w-[5%]",
  APPROVAL: "lg:w-[5%]",
  ACTION: "lg:w-[4%]",
};

const AssetGoodsReceiptNoteList = () => {
  const [rows] = useState<AssetGrnRow[]>(initialRows);
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("Somikoron IT Ltd");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(false);

  // Filter & Search Logic
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesSearch =
        !q ||
        [r.project, r.projectType, r.supplierName, r.code, r.addedBy, r.titleOfWork].some(
          (field) => field?.toLowerCase().includes(q)
        );
      const matchesSupplier = !selectedSupplier || r.supplierName === selectedSupplier;
      const matchesProject = !selectedProject || r.project === selectedProject;

      return matchesSearch && matchesSupplier && matchesProject;
    });
  }, [search, rows, selectedSupplier, selectedProject]);

  // Sorting
  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => (sortAsc ? a.id - b.id : b.id - a.id));
  }, [filteredRows, sortAsc]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / entriesPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * entriesPerPage;
  const visibleRows = sortedRows.slice(startIdx, startIdx + entriesPerPage);

  const resetFilters = () => {
    setSearch("");
    setSelectedSupplier("");
    setSelectedProject("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <div className="flex-1 px-4 sm:px-6 py-6 space-y-6 max-w-[1600px] w-full mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Asset Goods Receipt Note (GRN)
              </h1>
              <nav className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-1">
                <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Home
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                  Accounts
                </span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">GRN List</span>
              </nav>
            </div>
          </div>

          <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] shadow-sm shadow-emerald-600/20 transition-all">
            <Plus className="w-4 h-4" />
            <span>New Goods Receipt Note</span>
          </button>
        </div>

        {/* Filters Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-indigo-500" />
              <span>Filter Options</span>
            </div>
            {(search || selectedSupplier || selectedProject) && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range Picker */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Select Date Range
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  readOnly
                  value="1 Sep, 2026 - 30 Sep, 2026"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Company Select */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Company
              </label>
              <div className="relative">
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Somikoron IT Ltd">Somikoron IT Ltd</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Supplier Select */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Supplier
              </label>
              <div className="relative">
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">All Suppliers</option>
                  <option value="ElectroTech Ltd">ElectroTech Ltd</option>
                  <option value="Global Net Solutions">Global Net Solutions</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Project Select */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Project
              </label>
              <div className="relative">
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">All Projects</option>
                  <option value="HQ Expansion">HQ Expansion</option>
                  <option value="Smart City Automation">Smart City Automation</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Container Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 w-full sm:w-auto">
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

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search records..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Table - Responsive without scrolling on lg screens */}
          <div className="w-full overflow-x-auto lg:overflow-x-visible">
            <table className="w-full text-left border-collapse min-w-[900px] lg:min-w-0 lg:table-fixed">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-b border-slate-200/80 dark:border-slate-800">
                  {tableHeaders.map((header) => (
                    <th
                      key={header}
                      className={`px-2 py-3 text-[10px] xl:text-[11px] font-bold tracking-wider uppercase ${lgColumnWidths[header]}`}
                    >
                      {header === "ID" ? (
                        <button
                          onClick={() => setSortAsc(!sortAsc)}
                          className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          <span>{header}</span>
                          <ChevronUp
                            className={`w-3 h-3 transition-transform ${sortAsc ? "" : "rotate-180"}`}
                          />
                        </button>
                      ) : (
                        <span>{header}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
                {visibleRows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-2 py-3 font-semibold text-slate-800 dark:text-slate-200 align-top">
                      #{row.id}
                    </td>
                    <td className="px-2 py-3 align-top break-words">
                      <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                        {row.projectType}
                      </span>
                    </td>
                    <td className="px-2 py-3 align-top font-medium text-slate-800 dark:text-slate-200 break-words">
                      {row.project}
                    </td>
                    <td className="px-2 py-3 align-top break-words">
                      {row.titleOfWork || "—"}
                    </td>
                    <td className="px-2 py-3 align-top break-words">
                      {row.supplierName}
                    </td>
                    <td className="px-2 py-3 align-top font-mono text-[11px] text-slate-500 dark:text-slate-400 break-words">
                      {row.code}
                    </td>
                    <td className="px-2 py-3 align-top break-words text-slate-500">
                      {row.reference || "—"}
                    </td>
                    <td className="px-2 py-3 align-top whitespace-nowrap text-slate-500">
                      {row.date}
                    </td>
                    <td className="px-2 py-3 align-top font-medium">
                      ৳{row.subTotal.toLocaleString()}
                    </td>
                    <td className="px-2 py-3 align-top font-bold text-slate-800 dark:text-slate-100">
                      ৳{row.grandTotal.toLocaleString()}
                    </td>
                    <td className="px-2 py-3 align-top break-words text-slate-500">
                      {row.addedBy}
                    </td>
                    <td className="px-2 py-3 align-top text-center">
                      {row.hasAttachment ? (
                        <button
                          title="View Attachment"
                          className="p-1 rounded text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-2 py-3 align-top">
                      <div className="flex flex-col gap-1">
                        {row.approvalSteps.map((step) => (
                          <span
                            key={step}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            {step}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-2 py-3 align-top">
                      <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm">
                        Action
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Visual Empty State */}
                {visibleRows.length === 0 && (
                  <tr>
                    <td colSpan={tableHeaders.length} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 max-w-xs mx-auto">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                          <FileText className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          No Goods Receipt Notes Found
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Try adjusting your search filters or add a new record to get started.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing{" "}
              <strong className="font-semibold text-slate-700 dark:text-slate-200">
                {visibleRows.length === 0 ? 0 : startIdx + 1}
              </strong>{" "}
              to{" "}
              <strong className="font-semibold text-slate-700 dark:text-slate-200">
                {startIdx + visibleRows.length}
              </strong>{" "}
              of{" "}
              <strong className="font-semibold text-slate-700 dark:text-slate-200">
                {filteredRows.length}
              </strong>{" "}
              entries
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-slate-200 dark:hover:enabled:bg-slate-700 transition-colors"
              >
                Previous
              </button>
              <div className="px-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                {safePage} / {totalPages}
              </div>
              <button
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-slate-200 dark:hover:enabled:bg-slate-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-2 px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <span>2026 © Somikoron IT LTD</span>
        <span>Design &amp; Developed by Somikoron IT LTD</span>
      </footer>
    </div>
  );
};

export default AssetGoodsReceiptNoteList;