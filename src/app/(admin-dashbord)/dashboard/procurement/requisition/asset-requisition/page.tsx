"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  ChevronUp,
  Package,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  Search,
  Calendar,
  Building2,
  FolderKanban,
  Briefcase,
  RefreshCw,
} from "lucide-react";

interface ApprovalStep {
  id: string;
  label: string;
  status?: "approved" | "pending" | "rejected";
}

interface AssetRequisitionRow {
  id: number;
  projectType: string;
  project: string;
  titleOfWork: string;
  code: string;
  ref: string;
  date: string;
  demandDate: string;
  addedBy: string;
  approvalSteps: ApprovalStep[];
  attachmentCount?: number;
}

// Table Header Configuration
const tableHeaders = [
  "ID",
  "SELECT",
  "PROJECT TYPE",
  "PROJECT",
  "TITLE/NAME OF WORK",
  "CODE",
  "REF",
  "DATE",
  "DEMAND DATE",
  "ADDED BY",
  "APPROVAL LAYER",
  "ATTACHMENT",
  "ACTION",
];

const lgColumnWidths: Record<string, string> = {
  ID: "lg:w-[4%]",
  SELECT: "lg:w-[4%]",
  "PROJECT TYPE": "lg:w-[8%]",
  PROJECT: "lg:w-[10%]",
  "TITLE/NAME OF WORK": "lg:w-[12%]",
  CODE: "lg:w-[8%]",
  REF: "lg:w-[6%]",
  DATE: "lg:w-[7%]",
  "DEMAND DATE": "lg:w-[8%]",
  "ADDED BY": "lg:w-[8%]",
  "APPROVAL LAYER": "lg:w-[12%]",
  ATTACHMENT: "lg:w-[6%]",
  ACTION: "lg:w-[7%]",
};

// Mock Initial Data (API Connect করলে রেসপন্স দিয়ে রিপ্লেস করবেন)
const mockInitialRows: AssetRequisitionRow[] = [
  {
    id: 101,
    projectType: "Internal",
    project: "ERP Upgrade",
    titleOfWork: "High-Performance Laptops",
    code: "REQ-2026-001",
    ref: "PO-9941",
    date: "2026-09-01",
    demandDate: "2026-09-15",
    addedBy: "Tanvir Ahmed",
    approvalSteps: [
      { id: "s1", label: "Dept Head", status: "approved" },
      { id: "s2", label: "Finance", status: "approved" },
    ],
    attachmentCount: 2,
  },
  {
    id: 102,
    projectType: "Client",
    project: "Somikoron Portal",
    titleOfWork: "Cloud Server Expansion",
    code: "REQ-2026-002",
    ref: "PO-9942",
    date: "2026-09-03",
    demandDate: "2026-09-18",
    addedBy: "Sultana Razia",
    approvalSteps: [
      { id: "s1", label: "Dept Head", status: "approved" },
      { id: "s2", label: "Management", status: "pending" },
    ],
    attachmentCount: 1,
  },
  {
    id: 103,
    projectType: "Internal",
    project: "Office Infrastructure",
    titleOfWork: "Ergonomic Chairs",
    code: "REQ-2026-003",
    ref: "PO-9945",
    date: "2026-09-06",
    demandDate: "2026-09-25",
    addedBy: "Rahim Chowdhury",
    approvalSteps: [{ id: "s1", label: "HR Admin", status: "approved" }],
    attachmentCount: 0,
  },
  {
    id: 104,
    projectType: "Client",
    project: "Fintech App",
    titleOfWork: "Security Audit Tools",
    code: "REQ-2026-004",
    ref: "PO-9950",
    date: "2026-09-08",
    demandDate: "2026-09-28",
    addedBy: "Kazi Noman",
    approvalSteps: [
      { id: "s1", label: "Tech Lead", status: "approved" },
      { id: "s2", label: "Procurement", status: "pending" },
    ],
    attachmentCount: 3,
  },
];

const AssetRequisitionList = () => {
  // Data & API States
  const [rows, setRows] = useState<AssetRequisitionRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Table Control States
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);

  // Dynamic Filter States
  const [selectedCompany, setSelectedCompany] = useState("Somikoron IT Ltd");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  // API Call Handler (এখানে আপনার API EndPoint কানেক্ট করবেন)
  const fetchRequisitions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // API call placeholder:
      // const res = await fetch(`/api/requisitions?search=${search}&company=${selectedCompany}`);
      // const data = await res.json();
      // setRows(data);

      await new Promise((resolve) => setTimeout(resolve, 500));
      setRows(mockInitialRows);
    } catch (err) {
      setError("Failed to load requisition data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequisitions();
  }, [selectedCompany, selectedSupplier]);

  // Filtered rows memo
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rows.filter((r) => {
      const matchesSearch =
        !q ||
        [r.project, r.projectType, r.code, r.addedBy, r.titleOfWork, r.ref]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(q));

      const matchesProject = !selectedProject || r.project === selectedProject;

      return matchesSearch && matchesProject;
    });
  }, [search, rows, selectedProject]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRows.length / entriesPerPage) || 1;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const visibleRows = filteredRows.slice(startIndex, startIndex + entriesPerPage);

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17] text-slate-700 dark:text-slate-200 transition-colors duration-200">
      <div className="flex-1 px-4 sm:px-6 py-6 space-y-5">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 dark:from-indigo-600 dark:to-violet-800 shadow-md shadow-indigo-200 dark:shadow-none">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                Asset Requisition List
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
                  Requisition
                  <ChevronDown className="w-3 h-3" />
                </span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  List
                </span>
              </nav>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Reload Data Button */}
            <button
              onClick={fetchRequisitions}
              disabled={isLoading}
              title="Reload Data"
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-500" : ""}`}
              />
            </button>

            {/* New Asset Requisition Action Button */}
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-sm shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98]">
              <Plus className="w-4 h-4" />
              New Asset Requisition
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm p-5 space-y-4 transition-colors">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Filter */}
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

            {/* Company Filter */}
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

            {/* Supplier Filter */}
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
                  <option value="TechSource Inc">TechSource Inc</option>
                  <option value="Global Logistics">Global Logistics</option>
                </select>
                <Briefcase className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Project Filter */}
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
                  <option value="ERP Upgrade">ERP Upgrade</option>
                  <option value="Somikoron Portal">Somikoron Portal</option>
                  <option value="Office Infrastructure">
                    Office Infrastructure
                  </option>
                  <option value="Fintech App">Fintech App</option>
                </select>
                <FolderKanban className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Table Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm overflow-hidden transition-colors">
          {/* Table Search & Entries Controls */}
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
                  placeholder="Filter by code, title..."
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

          {/* Table Container */}
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
                {/* Skeleton Loading State */}
                {isLoading &&
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td colSpan={tableHeaders.length} className="px-3 py-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                      </td>
                    </tr>
                  ))}

                {/* Error State */}
                {!isLoading && error && (
                  <tr>
                    <td
                      colSpan={tableHeaders.length}
                      className="px-3 py-8 text-center text-[13px] text-red-500 dark:text-red-400"
                    >
                      {error}
                    </td>
                  </tr>
                )}

                {/* Data Rows */}
                {!isLoading &&
                  !error &&
                  visibleRows.map((row) => (
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
                      <td className="px-3 py-3.5 text-[13px] text-slate-600 dark:text-slate-300 align-middle whitespace-nowrap lg:whitespace-normal lg:break-words">
                        {row.titleOfWork || "—"}
                      </td>
                      <td className="px-3 py-3.5 text-[12.5px] font-mono text-indigo-600 dark:text-indigo-400 align-middle whitespace-nowrap">
                        {row.code}
                      </td>
                      <td className="px-3 py-3.5 text-[12.5px] font-mono text-slate-500 dark:text-slate-400 align-middle whitespace-nowrap">
                        {row.ref || "—"}
                      </td>
                      <td className="px-3 py-3.5 text-[12.5px] text-slate-500 dark:text-slate-400 align-middle whitespace-nowrap">
                        {row.date}
                      </td>
                      <td className="px-3 py-3.5 text-[12.5px] text-slate-500 dark:text-slate-400 align-middle whitespace-nowrap">
                        {row.demandDate}
                      </td>
                      <td className="px-3 py-3.5 text-[13px] text-slate-700 dark:text-slate-300 align-middle whitespace-nowrap">
                        {row.addedBy}
                      </td>
                      <td className="px-3 py-3.5 text-[12px] align-middle">
                        <div className="flex flex-col gap-1">
                          {row.approvalSteps.map((step) => (
                            <span
                              key={step.id}
                              className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400 shrink-0" />
                              {step.label}
                            </span>
                          ))}
                        </div>
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

                        {/* Action Menu Dropdown */}
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

                {/* Empty State */}
                {!isLoading && !error && visibleRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={tableHeaders.length}
                      className="px-3 py-12 text-center text-[13px] text-slate-400 dark:text-slate-500"
                    >
                      <Package className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                      No asset requisitions match your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[12.5px] text-slate-500 dark:text-slate-400">
              Showing {filteredRows.length === 0 ? 0 : startIndex + 1} to{" "}
              {Math.min(startIndex + entriesPerPage, filteredRows.length)} of{" "}
              {filteredRows.length} entries
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="px-3 py-1.5 rounded-lg text-[12.5px] font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-7 h-7 rounded-lg text-[12px] font-medium transition-colors ${
                        currentPage === page
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage === totalPages || totalPages === 0 || isLoading
                }
                className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        <span>Design &amp; Developed by Somikoron IT LTD</span>
      </footer>
    </div>
  );
};

export default AssetRequisitionList;