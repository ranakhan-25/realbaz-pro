/* eslint-disable prettier/prettier */
"use client";

import { useState, useMemo } from "react";
import { Eye, Download, Printer, FileText } from "lucide-react";

const ALL_ROWS = [
  {
    id: 1,
    employeeId: "02",
    employeeName: "Tazmul Reza",
    month: "August",
    year: "2026",
    grossSalary: "22000",
    absentAmount: "0",
    deduction: "500",
    netSalary: "21500",
    status: "Generated",
  },
  {
    id: 2,
    employeeId: "03",
    employeeName: "Rifat Hosain",
    month: "August",
    year: "2026",
    grossSalary: "22000",
    absentAmount: "1000",
    deduction: "800",
    netSalary: "20200",
    status: "Generated",
  },
  {
    id: 3,
    employeeId: "12",
    employeeName: "Mohin Uddin",
    month: "August",
    year: "2026",
    grossSalary: "0",
    absentAmount: "0",
    deduction: "0",
    netSalary: "0",
    status: "Generated",
  },
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const years = ["2024", "2025", "2026", "2027", "2028"];

export default function PaySlipDetailsPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_ROWS.filter((r) => {
      const matchSearch =
        !q ||
        r.employeeName.toLowerCase().includes(q) ||
        r.employeeId.includes(q) ||
        r.month.toLowerCase().includes(q) ||
        r.netSalary.includes(q);
      const matchMonth = !filterMonth || r.month === filterMonth;
      const matchYear = !filterYear || r.year === filterYear;
      return matchSearch && matchMonth && matchYear;
    });
  }, [search, filterMonth, filterYear]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / entries));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * entries;
  const pageRows = filtered.slice(start, start + entries);
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(start + entries, total);

  const goPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border px-5 py-2.5">
        <div className="flex items-center gap-1 text-[13px]">
          <span className="text-ink-muted hover:text-ink cursor-pointer">Home</span>
          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink-muted">HRM</span>
          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink-muted">Pay Slip</span>
          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink font-medium">Pay Slip Details</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[12px] text-ink-muted mb-1">Month</label>
            <select
              value={filterMonth}
              onChange={(e) => {
                setFilterMonth(e.target.value);
                setPage(1);
              }}
              className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">All Months</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12px] text-ink-muted mb-1">Year</label>
            <select
              value={filterYear}
              onChange={(e) => {
                setFilterYear(e.target.value);
                setPage(1);
              }}
              className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Show + Search */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[13px] text-ink-muted">
            <span>Show</span>
            <select
              value={entries}
              onChange={(e) => {
                setEntries(Number(e.target.value));
                setPage(1);
              }}
              className="border border-border rounded px-2 py-1 text-[13px] bg-surface text-ink"
            >
              {[5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px]">
            <span className="text-ink-muted">Search:</span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-border rounded px-2 py-1 text-[13px] w-40 bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface rounded-lg border border-border shadow-sm shadow-black/6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="bg-black text-white">
                  {[
                    "SL",
                    "EMPLOYEE ID",
                    "EMPLOYEE NAME",
                    "MONTH",
                    "YEAR",
                    "GROSS SALARY",
                    "ABSENT AMOUNT",
                    "DEDUCTION",
                    "NET SALARY",
                    "STATUS",
                    "ACTION",
                  ].map((h) => (
                    <th key={h} className="px-3 py-2.5 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-3 py-10 text-center text-ink-faint">
                      No payslip details found
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-canvas/70">
                      <td className="px-3 py-2.5 text-ink-muted">{row.id}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{row.employeeId}</td>
                      <td className="px-3 py-2.5 text-ink font-medium whitespace-nowrap">
                        {row.employeeName}
                      </td>
                      <td className="px-3 py-2.5 text-ink">{row.month}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{row.year}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{row.grossSalary}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{row.absentAmount}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{row.deduction}</td>
                      <td className="px-3 py-2.5 text-ink font-semibold tabular-nums">
                        {row.netSalary}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-emerald-600 font-medium">{row.status}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            className="w-7 h-7 rounded bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600"
                            title="View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            className="w-7 h-7 rounded bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600"
                            title="Download"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            className="w-7 h-7 rounded bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600"
                            title="Print"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            className="w-7 h-7 rounded bg-violet-500 text-white flex items-center justify-center hover:bg-violet-600"
                            title="PDF"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 border-t border-border text-[13px] text-ink-muted">
            <span>
              Showing {from} to {to} of {total} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => goPage(currentPage - 1)}
                className="px-2.5 py-1 rounded border border-border hover:bg-canvas disabled:opacity-40 disabled:cursor-not-allowed text-ink"
              >
                Previous
              </button>
              <button
                type="button"
                className="min-w-[32px] px-2 py-1 rounded font-medium bg-black text-white"
              >
                {currentPage}
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => goPage(currentPage + 1)}
                className="px-2.5 py-1 rounded border border-border hover:bg-canvas disabled:opacity-40 disabled:cursor-not-allowed text-ink"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}