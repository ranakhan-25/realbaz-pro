"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  ArrowLeftRight,
  Plus,
  ChevronUp,
  FileSearch,
  Search,
  X,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  Building2,
  Briefcase,
  FolderKanban,
  FileText,
  User,
} from "lucide-react";

interface RfqRow {
  id: number;
  projectType: string;
  project: string;
  supplierName: string;
  code: string;
  reference: string;
  date: string;
  subTotal: number | null;
  grandTotal: number;
  addedBy: string;
  attachmentCount?: number;
}

const initialRows: RfqRow[] = [
  {
    id: 1,
    projectType: "Real Estate",
    project: "Hena Heights",
    supplierName: "Bengal Cement Supply__",
    code: "R-005",
    reference: "taz00011",
    date: "05 Sept 2026",
    subTotal: null,
    grandTotal: 10000,
    addedBy: "Admin",
    attachmentCount: 2,
  },
  {
    id: 2,
    projectType: "Real Estate",
    project: "Hena Heights",
    supplierName: "Bengal Cement Supply__",
    code: "taz09877",
    reference: "taz00011",
    date: "05 Sept 2026",
    subTotal: 0,
    grandTotal: 0,
    addedBy: "Admin",
    attachmentCount: 0,
  },
];

const tableHeaders = [
  "ID",
  "SELECT",
  "PROJECT TYPE",
  "PROJECT",
  "SUPPLIER NAME",
  "CODE",
  "REFERENCE",
  "DATE",
  "SUB TOTAL",
  "GRAND TOTAL",
  "ADDED BY",
  "ATTACHMENT",
  "ACTION",
];

const lgColumnWidths: Record<string, string> = {
  ID: "lg:w-[4%]",
  SELECT: "lg:w-[4%]",
  "PROJECT TYPE": "lg:w-[8%]",
  PROJECT: "lg:w-[10%]",
  "SUPPLIER NAME": "lg:w-[13%]",
  CODE: "lg:w-[7%]",
  REFERENCE: "lg:w-[8%]",
  DATE: "lg:w-[8%]",
  "SUB TOTAL": "lg:w-[8%]",
  "GRAND TOTAL": "lg:w-[8%]",
  "ADDED BY": "lg:w-[8%]",
  ATTACHMENT: "lg:w-[7%]",
  ACTION: "lg:w-[7%]",
};

const RequestForQuotationList = () => {
  const [rows] = useState<RfqRow[]>(initialRows);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);

  // Filter States
  const [selectedCompany, setSelectedCompany] = useState("Somikoron IT Ltd");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesSearch =
        !q ||
        [r.project, r.projectType, r.supplierName, r.code, r.addedBy, r.reference]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(q));

      const matchesProject = !selectedProject || r.project === selectedProject;

      return matchesSearch && matchesProject;
    });
  }, [search, rows, selectedProject]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / entriesPerPage)
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * entriesPerPage;
  const visibleRows = filteredRows.slice(startIdx, startIdx + entriesPerPage);

  const allVisibleSelected =
    visibleRows.length > 0 &&
    visibleRows.every((r) => selectedRows.includes(r.id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedRows((prev) =>
        prev.filter((id) => !visibleRows.some((r) => r.id === id))
      );
    } else {
      setSelectedRows((prev) => [
        ...prev,
        ...visibleRows.map((r) => r.id).filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const toggleSelectRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17] text-slate-700 dark:text-slate-200 transition-colors duration-200">
      <div className="flex-1 px-4 sm:px-6 py-6 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 dark:from-indigo-600 dark:to-violet-800 shadow-md shadow-indigo-200 dark:shadow-none">
              <FileSearch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                Request for Quotation(RFQ) List
              </h1>
              <nav className="flex items-center gap-1.5 text-[12.5px] text-slate-400 dark:text-slate-500">
                <Link
                  href="/"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Home
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="flex items-center gap-0.5 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                  Inventory
                  <ChevronDown className="w-3 h-3" />
                </span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  List
                </span>
              </nav>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 shadow-sm transition-all active:scale-[0.98]">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              RFQ Compare
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm transition-all active:scale-[0.98]">
              <Plus className="w-3.5 h-3.5" />
              New Request for Quotation(RFQ)
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm p-5 space-y-4 transition-colors">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[12.5px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Select Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value="1 Sep, 2026 - 30 Sep, 2026"
                  className="w-full pl-9 pr-3.5 py-2.5 text-[13px] bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 cursor-pointer"
                />
                <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Company
              </label>
              <div className="relative">
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] text-slate-700 dark:text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 cursor-pointer"
                >
                  <option value="Somikoron IT Ltd">Somikoron IT Ltd</option>
                  <option value="Somikoron Software Ltd">
                    Somikoron Software Ltd
                  </option>
                </select>
                <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Supplier
              </label>
              <div className="relative">
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] text-slate-700 dark:text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 cursor-pointer"
                >
                  <option value="">Select Supplier</option>
                  <option value="Bengal Cement Supply__">
                    Bengal Cement Supply__
                  </option>
                </select>
                <Briefcase className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Project
              </label>
              <div className="relative">
                <select
                  value={selectedProject}
                  onChange={(e) => {
                    setSelectedProject(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] text-slate-700 dark:text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 cursor-pointer"
                >
                  <option value="">All Projects</option>
                  <option value="Hena Heights">Hena Heights</option>
                </select>
                <FolderKanban className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-[12.5px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Title/Name of Work
              </label>
              <div className="relative">
                <select className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] text-slate-700 dark:text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 cursor-pointer">
                  <option value="">Select Title/Name of Work</option>
                </select>
                <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Requisition
              </label>
              <div className="relative">
                <select className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] text-slate-700 dark:text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 cursor-pointer">
                  <option value="">Select Requisition</option>
                </select>
                <FileSearch className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Added By
              </label>
              <div className="relative">
                <select className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] text-slate-700 dark:text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 cursor-pointer">
                  <option value="">Select User</option>
                  <option value="Admin">Admin</option>
                </select>
                <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm overflow-hidden transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-[13px] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 cursor-pointer"
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
              <span className="font-medium">Search:</span>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search supplier, code..."
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-8 py-1.5 text-[13px] text-slate-700 dark:text-slate-200 w-56 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-2.5" />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1050px] lg:min-w-0 lg:table-fixed">
              <thead>
                <tr className="bg-indigo-50/60 dark:bg-slate-950/80 text-indigo-900 dark:text-indigo-300 border-b border-indigo-100/50 dark:border-slate-800">
                  {tableHeaders.map((header) => (
                    <th
                      key={header}
                      className={`px-3 py-3.5 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap lg:whitespace-normal ${lgColumnWidths[header]}`}
                    >
                      {header === "SELECT" ? (
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={allVisibleSelected}
                            onChange={toggleSelectAll}
                            className="w-3.5 h-3.5 accent-indigo-600 rounded cursor-pointer"
                          />
                        </div>
                      ) : header === "ID" ? (
                        <div className="flex items-center gap-1 cursor-pointer">
                          {header}
                          <ChevronUp className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                        </div>
                      ) : (
                        header
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {visibleRows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-3 py-3.5 text-[13px] font-medium text-slate-800 dark:text-slate-200 align-middle">
                      #{row.id}
                    </td>
                    <td className="px-3 py-3.5 align-middle text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => toggleSelectRow(row.id)}
                        className="w-3.5 h-3.5 accent-indigo-600 rounded cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-3.5 text-[13px] align-middle whitespace-nowrap lg:whitespace-normal">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {row.projectType}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-[13px] font-medium text-slate-800 dark:text-slate-100 align-middle whitespace-nowrap lg:whitespace-normal lg:break-words">
                      {row.project}
                    </td>
                    <td className="px-3 py-3.5 text-[13px] text-slate-700 dark:text-slate-300 align-middle whitespace-nowrap lg:whitespace-normal lg:break-words">
                      {row.supplierName}
                    </td>
                    <td className="px-3 py-3.5 text-[12.5px] font-mono text-indigo-600 dark:text-indigo-400 align-middle whitespace-nowrap">
                      {row.code}
                    </td>
                    <td className="px-3 py-3.5 text-[12.5px] font-mono text-slate-500 dark:text-slate-400 align-middle whitespace-nowrap">
                      {row.reference || "—"}
                    </td>
                    <td className="px-3 py-3.5 text-[12.5px] text-slate-500 dark:text-slate-400 align-middle whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="px-3 py-3.5 text-[13px] text-slate-600 dark:text-slate-300 align-middle whitespace-nowrap font-mono">
                      {row.subTotal === null ? "—" : row.subTotal}
                    </td>
                    <td className="px-3 py-3.5 text-[13px] font-semibold text-slate-800 dark:text-slate-100 align-middle whitespace-nowrap font-mono">
                      {row.grandTotal}
                    </td>
                    <td className="px-3 py-3.5 text-[13px] text-slate-700 dark:text-slate-300 align-middle whitespace-nowrap">
                      {row.addedBy}
                    </td>
                    <td className="px-3 py-3.5 text-[12.5px] text-slate-500 dark:text-slate-400 align-middle text-center">
                      {row.attachmentCount ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60">
                          {row.attachmentCount} files
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3.5 align-middle relative">
                      <button
                        onClick={() =>
                          setActiveActionMenu(
                            activeActionMenu === row.id ? null : row.id
                          )
                        }
                        className="flex items-center justify-center p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeActionMenu === row.id && (
                        <div className="absolute right-4 top-10 w-36 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none py-1.5 z-20 text-[12.5px]">
                          <button className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            View
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                            Edit
                          </button>
                          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                          <button className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400">
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            Delete
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
                      className="px-3 py-12 text-center text-[13px] text-slate-400 dark:text-slate-500"
                    >
                      <FileSearch className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                      No RFQ records match your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[12.5px] text-slate-500 dark:text-slate-400">
              Showing {filteredRows.length === 0 ? 0 : startIdx + 1} to{" "}
              {startIdx + visibleRows.length} of {filteredRows.length} entries
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg text-[12px] font-medium transition-colors ${
                        page === safePage
                          ? "bg-indigo-600 text-white dark:bg-indigo-600"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                disabled={safePage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 text-[12px] text-slate-500 dark:text-slate-400 transition-colors">
        <span>2026 © Somikoron IT LTD</span>
        <span>Design &amp; Developed by Somikoron IT LTD</span>
      </footer>
    </div>
  );
};

export default RequestForQuotationList;