"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  ArrowLeft,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  Copy,
  Mail,
  Printer,
  FileSpreadsheet,
  Check,
} from "lucide-react";

// Types & Data Structures for API integration
export interface JournalVoucherRow {
  id: number;
  sl: number;
  date: string;
  titleOfWork: string;
  type: string;
  code: string;
  debit: string;
  credit: string;
  total: number;
  comment: string;
  addedBy: string;
  editedBy: string;
  approval: string[];
  attachment: number;
  status: string;
}

const initialJournalVouchers: JournalVoucherRow[] = [
  {
    id: 1,
    sl: 1,
    date: "08 Sept 2026",
    titleOfWork: "—",
    type: "Journal",
    code: "P00003",
    debit: "Others Inventory",
    credit: "Riva Steel Mils",
    total: 30000.0,
    comment: "—",
    addedBy: "Admin",
    editedBy: "—",
    approval: ["All Approvals Completed", "Admin"],
    attachment: 0,
    status: "Approved",
  },
  {
    id: 2,
    sl: 2,
    date: "08 Sept 2026",
    titleOfWork: "—",
    type: "Journal",
    code: "P00004",
    debit: "Sanitary Work Inventory",
    credit: "Rifat Thai House",
    total: 9999.0,
    comment: "—",
    addedBy: "Admin",
    editedBy: "—",
    approval: ["All Approvals Completed", "Admin"],
    attachment: 0,
    status: "Approved",
  },
];

type ActionKey = "view" | "print" | "mail" | "edit" | "delete" | "duplicate";

const actionMenuItems: { key: ActionKey; label: string; icon: React.ElementType; color: string }[] = [
  { key: "view", label: "View Voucher", icon: Eye, color: "bg-indigo-500 hover:bg-indigo-600" },
  { key: "print", label: "Print Voucher", icon: Printer, color: "bg-violet-500 hover:bg-violet-600" },
  { key: "mail", label: "Send Mail", icon: Mail, color: "bg-cyan-500 hover:bg-cyan-600" },
  { key: "edit", label: "Edit Voucher", icon: Pencil, color: "bg-amber-500 hover:bg-amber-600" },
  { key: "delete", label: "Delete", icon: Trash2, color: "bg-red-500 hover:bg-red-600" },
  { key: "duplicate", label: "Duplicate", icon: Copy, color: "bg-teal-500 hover:bg-teal-600" },
];

export default function JournalVoucherListPage() {
  // Filter States (API ready)
  const [filters, setFilters] = useState({
    dateRange: "1 September, 2026 - 30 September, 2026",
    debitAccount: "",
    creditAccount: "",
    project: "",
    titleOfWork: "",
    site: "",
    task: "",
  });

  // Table Data & Search States
  const [vouchers, setVouchers] = useState<JournalVoucherRow[]>(initialJournalVouchers);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Action Dropdown State
  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const handleClose = () => setOpenActionId(null);
    window.addEventListener("resize", handleClose);
    window.addEventListener("scroll", handleClose, true);
    return () => {
      window.removeEventListener("resize", handleClose);
      window.removeEventListener("scroll", handleClose, true);
    };
  }, []);

  const toggleActionMenu = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.stopPropagation();
    if (openActionId === id) {
      setOpenActionId(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const menuWidth = 130;
      setDropdownPos({
        top: rect.bottom + window.scrollY + 2,
        left: Math.max(10, rect.right - menuWidth),
      });
      setOpenActionId(id);
    }
  };

  const handleAction = (key: ActionKey, row: JournalVoucherRow) => {
    setOpenActionId(null);
    if (key === "delete") {
      if (confirm(`Are you sure you want to delete voucher ${row.code}?`)) {
        setVouchers((prev) => prev.filter((v) => v.id !== row.id));
      }
    } else {
      alert(`Action "${key.toUpperCase()}" triggered for voucher ${row.code}`);
    }
  };

  // Filter Logic
  const filteredRows = vouchers.filter((r) =>
    search.trim()
      ? [r.code, r.debit, r.credit, r.type, r.addedBy, r.date].some((field) =>
          field.toLowerCase().includes(search.trim().toLowerCase())
        )
      : true
  );

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / entriesPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * entriesPerPage;
  const visibleRows = filteredRows.slice(startIdx, startIdx + entriesPerPage);

  return (
    <div className="w-full max-w-full overflow-x-hidden flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 p-2 text-xs min-h-screen">
      {/* Top Header & Navigation Bar */}
      <div className="flex items-center justify-between gap-2 mb-2 w-full">
        <nav className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium truncate">
          <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer">
            Accounts Module <ChevronDown className="w-3 h-3" />
          </span>
          <span>&gt;</span>
          <span className="text-slate-400 font-normal truncate">Journal Voucher List</span>
        </nav>

        {/* Buttons (Add New with Link + Back/Icon button) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href="/dashboard/accounts/voucher/journal-voucher/add-new" // Dynamic Route Link
            className="flex items-center gap-1 px-3 py-1 text-[11px] font-semibold rounded bg-[#635BFF] hover:bg-indigo-700 text-white transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New
          </Link>
          <button
            onClick={() => alert("Back / Quick Action")}
            className="p-1.5 rounded bg-[#00D2D3] hover:bg-cyan-600 text-white transition-colors cursor-pointer"
            title="Action"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full flex flex-col gap-2">
        {/* Filters Box */}
        <div className="bg-white dark:bg-slate-900 rounded shadow-xs border border-slate-200 dark:border-slate-800 p-2.5 space-y-2 w-full">
          {/* Filter Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full">
            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                Select Date
              </label>
              <input
                type="text"
                readOnly
                value={filters.dateRange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] text-slate-700 dark:text-slate-200 truncate focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                Debit Accounts
              </label>
              <select
                value={filters.debitAccount}
                onChange={(e) => setFilters({ ...filters, debitAccount: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Chart Of Account</option>
                <option value="Others Inventory">Others Inventory</option>
                <option value="Sanitary Work Inventory">Sanitary Work Inventory</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                Credit Accounts
              </label>
              <select
                value={filters.creditAccount}
                onChange={(e) => setFilters({ ...filters, creditAccount: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Chart Of Account</option>
                <option value="Riva Steel Mils">Riva Steel Mils</option>
                <option value="Rifat Thai House">Rifat Thai House</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                Select Project
              </label>
              <select
                value={filters.project}
                onChange={(e) => setFilters({ ...filters, project: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Project</option>
                <option value="Project A">Project A</option>
                <option value="Project B">Project B</option>
              </select>
            </div>
          </div>

          {/* Filter Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                Title/Name of Work
              </label>
              <select
                value={filters.titleOfWork}
                onChange={(e) => setFilters({ ...filters, titleOfWork: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Title/Name of Work</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                Site
              </label>
              <select
                value={filters.site}
                onChange={(e) => setFilters({ ...filters, site: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Site</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                Task
              </label>
              <select
                value={filters.task}
                onChange={(e) => setFilters({ ...filters, task: e.target.value })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Task</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table & Action Bar */}
        <div className="bg-white dark:bg-slate-900 rounded shadow-xs border border-slate-200 dark:border-slate-800 p-2.5 flex flex-col w-full overflow-x-hidden">
          {/* Export & Search Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-[11px] w-full">
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert("Copied to clipboard")}
                className="px-2.5 py-1 bg-[#00D2D3] hover:bg-cyan-600 text-white rounded font-medium text-[10px] transition-colors cursor-pointer"
              >
                Copy
              </button>
              <button
                onClick={() => alert("Exported CSV")}
                className="px-2.5 py-1 bg-[#FF9F43] hover:bg-amber-600 text-white rounded font-medium text-[10px] transition-colors cursor-pointer"
              >
                CSV
              </button>

              <div className="flex items-center gap-1 ml-2 text-slate-600 dark:text-slate-400">
                <span>Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-1.5 py-0.5"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-slate-600 dark:text-slate-400">Search:</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Table Container - Fits fully on screen without horizontal scroll */}
          <div className="w-full border border-slate-200 dark:border-slate-800 rounded overflow-hidden">
            <table className="w-full table-fixed text-left border-collapse text-[9px] lg:text-[10px]">
              <thead className="bg-[#635BFF] text-white font-semibold uppercase tracking-wider text-[9px]">
                <tr>
                  <th className="w-[3%] px-1 py-1.5">SL</th>
                  <th className="w-[8%] px-1 py-1.5">DATE</th>
                  <th className="w-[9%] px-1 py-1.5">TITLE/NAME OF WORK</th>
                  <th className="w-[6%] px-1 py-1.5">TYPE</th>
                  <th className="w-[6%] px-1 py-1.5">CODE</th>
                  <th className="w-[11%] px-1 py-1.5">DEBIT</th>
                  <th className="w-[11%] px-1 py-1.5">CREDIT</th>
                  <th className="w-[7%] px-1 py-1.5">TOTAL</th>
                  <th className="w-[7%] px-1 py-1.5">COMMENT</th>
                  <th className="w-[6%] px-1 py-1.5">ADDED BY</th>
                  <th className="w-[5%] px-1 py-1.5">EDITED BY</th>
                  <th className="w-[10%] px-1 py-1.5">APPROVE</th>
                  <th className="w-[4%] px-1 py-1.5 text-center">ATTACHMENT</th>
                  <th className="w-[4%] px-1 py-1.5">STATUS</th>
                  <th className="w-[6%] px-1 py-1.5 text-right pr-2">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {visibleRows.length > 0 ? (
                  visibleRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-1 py-1.5 truncate">{row.sl}</td>
                      <td className="px-1 py-1.5 truncate">{row.date}</td>
                      <td className="px-1 py-1.5 truncate text-slate-400">{row.titleOfWork}</td>
                      <td className="px-1 py-1.5 truncate">{row.type}</td>
                      <td className="px-1 py-1.5 font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {row.code}
                      </td>
                      <td className="px-1 py-1.5 text-indigo-600 dark:text-indigo-400 font-medium truncate">
                        {row.debit}
                      </td>
                      <td className="px-1 py-1.5 text-indigo-600 dark:text-indigo-400 font-medium truncate">
                        {row.credit}
                      </td>
                      <td className="px-1 py-1.5 font-semibold truncate">
                        {row.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-1 py-1.5 text-slate-400 truncate">{row.comment}</td>
                      <td className="px-1 py-1.5 truncate">{row.addedBy}</td>
                      <td className="px-1 py-1.5 text-slate-400 truncate">{row.editedBy}</td>
                      <td className="px-1 py-1.5 truncate">
                        <div className="space-y-0.5">
                          {row.approval.map((app) => (
                            <span
                              key={app}
                              className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5 text-[9px] truncate"
                            >
                              <Check className="w-2.5 h-2.5 inline shrink-0" /> {app}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-1 py-1.5 text-center truncate">{row.attachment}</td>
                      <td className="px-1 py-1.5 truncate">
                        <span className="px-1 py-0.5 text-[9px] rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-1 py-1.5 text-right pr-2">
                        <button
                          type="button"
                          onClick={(e) => toggleActionMenu(e, row.id)}
                          className="px-2 py-0.5 rounded bg-[#635BFF] hover:bg-indigo-700 text-white font-medium text-[9px] inline-flex items-center gap-0.5 transition-colors cursor-pointer"
                        >
                          Action
                          <ChevronDown className="w-2.5 h-2.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={15} className="px-2 py-3 text-center text-slate-400">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between gap-2 mt-2 text-[10px] text-slate-500 dark:text-slate-400 w-full">
            <div>
              Showing {filteredRows.length === 0 ? 0 : startIdx + 1} to{" "}
              {startIdx + visibleRows.length} of {filteredRows.length} entries
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-0.5 rounded border border-slate-300 dark:border-slate-800 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-2 py-0.5 rounded ${
                    p === safePage
                      ? "bg-[#635BFF] text-white font-medium"
                      : "border border-slate-300 dark:border-slate-800"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-0.5 rounded border border-slate-300 dark:border-slate-800 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Dropdown Menu */}
      {openActionId !== null && dropdownPos && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpenActionId(null)} />
          <div
            style={{ top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px` }}
            className="fixed z-50 w-32 bg-white dark:bg-slate-800 rounded shadow-lg border border-slate-200 dark:border-slate-700 p-1 space-y-0.5"
          >
            {actionMenuItems.map(({ key, label, icon: Icon, color }) => {
              const targetRow = vouchers.find((r) => r.id === openActionId);
              return (
                <button
                  key={key}
                  onClick={() => targetRow && handleAction(key, targetRow)}
                  className={`w-full flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-medium text-white transition-colors cursor-pointer ${color}`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="flex items-center justify-between text-[9px] text-slate-400 mt-auto pt-2 border-t border-slate-200 dark:border-slate-800">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>
    </div>
  );
}