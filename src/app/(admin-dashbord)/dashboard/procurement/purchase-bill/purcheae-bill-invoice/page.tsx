"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Plus,
  Eye,
  SquarePen,
  Trash2,
  Receipt,
  Search,
  CheckCircle2,
} from "lucide-react";

interface PurchaseBillRow {
  id: number;
  projectType: string;
  project: string;
  supplierName: string;
  code: string;
  date: string;
  subTotal: number;
  grandTotal: number;
  paid: number;
  due: number;
  addedBy: string;
  approvalSteps: string[];
}

// Dummy initial data
const initialRows: PurchaseBillRow[] = [
  {
    id: 1,
    projectType: "Office",
    project: "Rifat Eyecon City",
    supplierName: "Safety First Suppliers",
    code: "PUR5557783",
    date: "10 Sept 2026",
    subTotal: 480000,
    grandTotal: 480000,
    paid: 0,
    due: 480000,
    addedBy: "Admin",
    approvalSteps: ["All Approvals Completed", "Admin"],
  },
];

const tableHeaders = [
  "ID",
  "PROJECT TYPE",
  "PROJECT",
  "SUPPLIER NAME",
  "CODE",
  "DATE",
  "SUB TOTAL",
  "GRAND TOTAL",
  "PAID",
  "DUE",
  "ADDED BY",
  "APPROVAL LAYER",
  "ACTION",
];

// Desktop (lg+) Column Width Distribution (Sums precisely to 100%)
const lgColumnWidths: Record<string, string> = {
  ID: "lg:w-[3%]",
  "PROJECT TYPE": "lg:w-[8%]",
  PROJECT: "lg:w-[12%]",
  "SUPPLIER NAME": "lg:w-[12%]",
  CODE: "lg:w-[9%]",
  DATE: "lg:w-[7%]",
  "SUB TOTAL": "lg:w-[8%]",
  "GRAND TOTAL": "lg:w-[8%]",
  PAID: "lg:w-[6%]",
  DUE: "lg:w-[6%]",
  "ADDED BY": "lg:w-[7%]",
  "APPROVAL LAYER": "lg:w-[8%]",
  ACTION: "lg:w-[6%]",
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US").format(amount);

export default function PurchaseBillInvoiceList() {
  const [rows] = useState<PurchaseBillRow[]>(initialRows);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.project, r.projectType, r.supplierName, r.code, r.addedBy].some(
        (field) => field.toLowerCase().includes(q)
      )
    );
  }, [search, rows]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / entriesPerPage)
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * entriesPerPage;
  const visibleRows = filteredRows.slice(startIdx, startIdx + entriesPerPage);

  const totals = useMemo(
    () =>
      filteredRows.reduce(
        (acc, r) => ({
          subTotal: acc.subTotal + r.subTotal,
          grandTotal: acc.grandTotal + r.grandTotal,
          paid: acc.paid + r.paid,
          due: acc.due + r.due,
        }),
        { subTotal: 0, grandTotal: 0, paid: 0, due: 0 }
      ),
    [filteredRows]
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <div className="flex-1 px-4 lg:px-6 py-6 space-y-5 max-w-[1920px] w-full mx-auto">
        
        {/* Page Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20 dark:shadow-indigo-900/40">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                Purchase Bill/Invoice List
              </h1>
              <nav className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                <Link
                  href="/"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Home
                </Link>
                <ChevronRight className="w-3 h-3" />
                <button className="flex items-center gap-0.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Inventory
                  <ChevronDown className="w-3 h-3" />
                </button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  List
                </span>
              </nav>
            </div>
          </div>

          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm shadow-emerald-600/20 transition-all duration-150">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New Purchase Bill/Invoice
          </button>
        </header>

        {/* Table Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none overflow-hidden">
          
          {/* Table Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>

            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 w-52 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
              />
            </div>
          </div>

          {/* Main Table: Fit perfectly on lg+ without scrollbar */}
          <div className="overflow-x-auto lg:overflow-x-visible">
            <table className="w-full text-left border-collapse min-w-[950px] lg:min-w-0 lg:table-fixed">
              <thead>
                <tr className="bg-indigo-50/60 dark:bg-slate-800/80 text-indigo-900 dark:text-indigo-300 border-b border-slate-200/80 dark:border-slate-800">
                  {tableHeaders.map((header) => {
                    const isNumeric = [
                      "SUB TOTAL",
                      "GRAND TOTAL",
                      "PAID",
                      "DUE",
                    ].includes(header);
                    return (
                      <th
                        key={header}
                        className={`px-2 py-3 text-[10px] xl:text-[11px] font-bold tracking-wider uppercase ${
                          lgColumnWidths[header]
                        } ${isNumeric ? "text-right" : "text-left"}`}
                      >
                        {header === "ID" ? (
                          <div className="flex items-center gap-1">
                            {header}
                            <ChevronUp className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                          </div>
                        ) : (
                          header
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {visibleRows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-2 py-3 font-medium text-slate-600 dark:text-slate-400 align-middle">
                      #{row.id}
                    </td>
                    <td className="px-2 py-3 font-medium text-slate-800 dark:text-slate-200 align-middle break-words">
                      {row.projectType}
                    </td>
                    <td className="px-2 py-3 font-medium text-slate-800 dark:text-slate-200 align-middle break-words">
                      {row.project}
                    </td>
                    <td className="px-2 py-3 text-slate-600 dark:text-slate-300 align-middle break-words">
                      {row.supplierName}
                    </td>
                    <td className="px-2 py-3 font-mono text-[11px] font-medium text-slate-600 dark:text-slate-400 align-middle break-all">
                      {row.code}
                    </td>
                    <td className="px-2 py-3 text-slate-500 dark:text-slate-400 align-middle whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="px-2 py-3 font-mono text-right text-slate-700 dark:text-slate-300 align-middle">
                      {formatCurrency(row.subTotal)}
                    </td>
                    <td className="px-2 py-3 font-mono font-semibold text-right text-slate-800 dark:text-slate-100 align-middle">
                      {formatCurrency(row.grandTotal)}
                    </td>
                    <td className="px-2 py-3 font-mono text-right text-emerald-600 dark:text-emerald-400 font-medium align-middle">
                      {formatCurrency(row.paid)}
                    </td>
                    <td className="px-2 py-3 font-mono text-right text-rose-600 dark:text-rose-400 font-medium align-middle">
                      {formatCurrency(row.due)}
                    </td>
                    <td className="px-2 py-3 text-slate-600 dark:text-slate-400 align-middle break-words">
                      {row.addedBy}
                    </td>
                    <td className="px-2 py-3 align-middle">
                      <div className="flex flex-col gap-1">
                        {row.approvalSteps.map((step) => (
                          <span
                            key={step}
                            className="inline-flex items-center gap-1 text-[10px] xl:text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/50 px-1.5 py-0.5 rounded-md leading-tight"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{step}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-2 py-3 align-middle">
                      <div className="flex items-center gap-1">
                        <button
                          title="View Details"
                          aria-label="View"
                          className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 text-sky-600 dark:text-sky-400 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Edit Invoice"
                          aria-label="Edit"
                          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-indigo-600 dark:text-indigo-400 transition-all"
                        >
                          <SquarePen className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Delete Invoice"
                          aria-label="Delete"
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 text-rose-600 dark:text-rose-400 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {visibleRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={tableHeaders.length}
                      className="px-4 py-12 text-center text-slate-400 dark:text-slate-500"
                    >
                      No purchase bills or invoices available.
                    </td>
                  </tr>
                )}

                {/* Table Footer Totals Row */}
                {visibleRows.length > 0 && (
                  <tr className="bg-slate-50/80 dark:bg-slate-800/40 border-t-2 border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100">
                    <td className="px-2 py-3 text-right uppercase tracking-wider text-[11px]" colSpan={6}>
                      TOTAL
                    </td>
                    <td className="px-2 py-3 font-mono text-right text-slate-700 dark:text-slate-200">
                      {formatCurrency(totals.subTotal)}
                    </td>
                    <td className="px-2 py-3 font-mono text-right text-slate-900 dark:text-white">
                      {formatCurrency(totals.grandTotal)}
                    </td>
                    <td className="px-2 py-3 font-mono text-right text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(totals.paid)}
                    </td>
                    <td className="px-2 py-3 font-mono text-right text-rose-600 dark:text-rose-400">
                      {formatCurrency(totals.due)}
                    </td>
                    <td colSpan={3} />
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredRows.length === 0 ? 0 : startIdx + 1} to{" "}
              {startIdx + visibleRows.length} of {filteredRows.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                      page === safePage
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                        : "text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                disabled={safePage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <footer className="flex flex-wrap items-center justify-between gap-2 px-6 py-3.5 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <span>2026 © Somikoron IT LTD</span>
        <span>Design &amp; Developed by Somikoron IT LTD</span>
      </footer>
    </div>
  );
}