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

// Hardcoded for now — API wiring comes later
const initialRows: PurchaseBillRow[] = [
  {
    id: 1,
    projectType: "Office",
    project: "Rifat Eyecon City",
    supplierName: "Safety First Suppliers__",
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

// lg+ column widths (table-fixed), sums to 100%
const lgColumnWidths: Record<string, string> = {
  ID: "lg:w-[3%]",
  "PROJECT TYPE": "lg:w-[8%]",
  PROJECT: "lg:w-[11%]",
  "SUPPLIER NAME": "lg:w-[13%]",
  CODE: "lg:w-[9%]",
  DATE: "lg:w-[7%]",
  "SUB TOTAL": "lg:w-[7%]",
  "GRAND TOTAL": "lg:w-[7%]",
  PAID: "lg:w-[6%]",
  DUE: "lg:w-[6%]",
  "ADDED BY": "lg:w-[8%]",
  "APPROVAL LAYER": "lg:w-[9%]",
  ACTION: "lg:w-[6%]",
};

const PurchaseBillInvoiceList = () => {
  const [rows] = useState<PurchaseBillRow[]>(initialRows);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.project, r.projectType, r.supplierName, r.code, r.addedBy].some(
        (field) => field.toLowerCase().includes(q),
      ),
    );
  }, [search, rows]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / entriesPerPage),
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
        { subTotal: 0, grandTotal: 0, paid: 0, due: 0 },
      ),
    [filteredRows],
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-700">
      <div className="flex-1 px-6 py-6 space-y-5">
        {/* Page header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-200">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-slate-800 tracking-tight">
                Purchase Bill/Invoice List
              </h1>
              <nav className="flex items-center gap-1.5 text-[12.5px] text-slate-400">
                <Link
                  href="/"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Home
                </Link>
                <ChevronRight className="w-3 h-3" />
                <button className="flex items-center gap-0.5 hover:text-indigo-600 transition-colors">
                  Inventory
                  <ChevronDown className="w-3 h-3" />
                </button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-500">List</span>
              </nav>
            </div>
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm transition-colors">
            <Plus className="w-3.5 h-3.5" />
            New Purchase Bill/Invoice
          </button>
        </div>

        {/* Table card — no filter section for this list */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden">
          {/* Table controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="flex items-center gap-2 text-[13px] text-slate-500">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center gap-2 text-[13px] text-slate-500">
              <span>Search:</span>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-1.5 text-[13px] w-48 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px] lg:min-w-0 lg:table-fixed">
              <thead>
                <tr className="bg-indigo-50/70 text-indigo-700">
                  {tableHeaders.map((header) => (
                    <th
                      key={header}
                      className={`px-2.5 py-3 text-[11px] font-semibold tracking-wide whitespace-nowrap lg:whitespace-normal ${lgColumnWidths[header]}`}
                    >
                      {header === "ID" ? (
                        <div className="flex items-center gap-1">
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
              <tbody>
                {visibleRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-2.5 py-3 text-[13px] align-top">
                      {row.id}
                    </td>
                    <td className="px-2.5 py-3 text-[13px] align-top whitespace-nowrap lg:whitespace-normal lg:break-words">
                      {row.projectType}
                    </td>
                    <td className="px-2.5 py-3 text-[13px] align-top whitespace-normal break-words">
                      {row.project}
                    </td>
                    <td className="px-2.5 py-3 text-[13px] align-top whitespace-nowrap lg:whitespace-normal lg:break-words">
                      {row.supplierName}
                    </td>
                    <td className="px-2.5 py-3 text-[13px] align-top whitespace-nowrap lg:whitespace-normal lg:break-words">
                      {row.code}
                    </td>
                    <td className="px-2.5 py-3 text-[13px] align-top whitespace-nowrap lg:whitespace-normal">
                      {row.date}
                    </td>
                    <td className="px-2.5 py-3 text-[13px] align-top whitespace-nowrap lg:whitespace-normal">
                      {row.subTotal.toLocaleString()}
                    </td>
                    <td className="px-2.5 py-3 text-[13px] align-top whitespace-nowrap lg:whitespace-normal">
                      {row.grandTotal.toLocaleString()}
                    </td>
                    <td className="px-2.5 py-3 text-[13px] align-top whitespace-nowrap lg:whitespace-normal">
                      {row.paid.toLocaleString()}
                    </td>
                    <td className="px-2.5 py-3 text-[13px] align-top whitespace-nowrap lg:whitespace-normal">
                      {row.due.toLocaleString()}
                    </td>
                    <td className="px-2.5 py-3 text-[13px] align-top whitespace-nowrap lg:whitespace-normal">
                      {row.addedBy}
                    </td>
                    <td className="px-2.5 py-3 text-[13px] align-top">
                      <div className="flex flex-col gap-0.5">
                        {row.approvalSteps.map((step) => (
                          <span
                            key={step}
                            className="flex items-center gap-1 text-emerald-600"
                          >
                            ✓ {step}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-2.5 py-3 align-top">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          aria-label="View"
                          className="flex items-center justify-center w-8 h-8 rounded-md bg-cyan-500 hover:bg-cyan-600 text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          aria-label="Edit"
                          className="flex items-center justify-center w-8 h-8 rounded-md bg-cyan-500 hover:bg-cyan-600 text-white transition-colors"
                        >
                          <SquarePen className="w-3.5 h-3.5" />
                        </button>
                        <button
                          aria-label="Delete"
                          className="flex items-center justify-center w-8 h-8 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
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
                      className="px-3 py-6 text-center text-[13px] text-slate-400"
                    >
                      No data available in table
                    </td>
                  </tr>
                )}

                {visibleRows.length > 0 && (
                  <tr className="border-t-2 border-slate-200 font-semibold text-slate-700">
                    <td className="px-2.5 py-3 text-[13px]" colSpan={5}>
                      TOTAL
                    </td>
                    <td className="px-2.5 py-3 text-[13px]">
                      {totals.subTotal.toLocaleString()}
                    </td>
                    <td className="px-2.5 py-3 text-[13px]">
                      {totals.grandTotal.toLocaleString()}
                    </td>
                    <td className="px-2.5 py-3 text-[13px]">
                      {totals.paid.toLocaleString()}
                    </td>
                    <td className="px-2.5 py-3 text-[13px]">
                      {totals.due.toLocaleString()}
                    </td>
                    <td colSpan={3} />
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-slate-100">
            <span className="text-[12.5px] text-slate-400">
              Showing {filteredRows.length === 0 ? 0 : startIdx + 1} to{" "}
              {startIdx + visibleRows.length} of {filteredRows.length} entries
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 disabled:text-slate-300 disabled:hover:bg-slate-100 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-colors ${
                      page === safePage
                        ? "bg-indigo-600 text-white"
                        : "text-slate-500 bg-slate-100 hover:bg-slate-200"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                disabled={safePage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 disabled:text-slate-300 disabled:hover:bg-slate-100 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 bg-white border-t border-slate-100 text-[12px] text-slate-500">
        <span>2026 © Somikoron IT LTD</span>
        <span>Design &amp; Developed by Somikoron IT LTD</span>
      </footer>
    </div>
  );
};

export default PurchaseBillInvoiceList;
