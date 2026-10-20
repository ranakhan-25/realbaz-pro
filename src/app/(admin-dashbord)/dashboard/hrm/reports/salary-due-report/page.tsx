/* eslint-disable prettier/prettier */
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, Search, Copy, FileSpreadsheet, FileText } from "lucide-react";

const employeeOptions = [
  { label: "Mohin Uddin (ST1121188)", value: "ST1121188", name: "Mohin Uddin" },
  { label: "Rifat Hosain (ST0923878)", value: "ST0923878", name: "Rifat Hosain" },
  { label: "Tazmul Reza (ST7206257)", value: "ST7206257", name: "Tazmul Reza" },
];

const ALL_ROWS = [
  {
    id: 1,
    customerCode: "ST7206257",
    name: "Tazmul Reza",
    mobile: "01323202709",
    totalSalary: 20680.0,
    paidAmount: 0.0,
    dueAmount: 20680.0,
    advancedAmount: 0.0,
  },
  {
    id: 2,
    customerCode: "ST1121188",
    name: "Mohin Uddin",
    mobile: "01976601667",
    totalSalary: 0.0,
    paidAmount: 0.0,
    dueAmount: 0.0,
    advancedAmount: 0.0,
  },
  {
    id: 3,
    customerCode: "ST0923878",
    name: "Rifat Hosain",
    mobile: "01517833487",
    totalSalary: -1200.0,
    paidAmount: 0.0,
    dueAmount: 0.0,
    advancedAmount: 1200.0,
  },
];

function EmployeeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = employeeOptions.find((e) => e.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employeeOptions;
    return employeeOptions.filter((e) => e.label.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="max-w-md">
      <label className="block text-[12px] text-ink-muted mb-1">Select Employee</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setOpen(!open);
            setQuery("");
          }}
          className="w-full flex items-center justify-between border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
        >
          <span className={value ? "text-ink" : "text-ink-faint"}>
            {selected ? selected.label : "Select value"}
          </span>
          <ChevronDown className="w-4 h-4 text-ink-faint shrink-0" />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-md shadow-lg shadow-black/6 z-50 overflow-hidden">
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-faint" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  autoFocus
                  className="w-full pl-8 pr-2.5 py-1.5 border border-border rounded-md text-[13px] bg-canvas text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-2 text-[13px] text-ink-faint">No results</p>
              ) : (
                filtered.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`w-full text-left px-3 py-2 text-[13px] hover:bg-canvas ${
                      value === opt.value
                        ? "bg-black text-white font-medium"
                        : "text-ink-muted"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SalaryDueReportPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [employee, setEmployee] = useState("");

  const filtered = useMemo(() => {
    let rows = ALL_ROWS;
    if (employee) {
      rows = rows.filter((r) => r.customerCode === employee);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.customerCode.toLowerCase().includes(q) ||
          r.mobile.includes(q)
      );
    }
    return rows;
  }, [search, employee]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / entries));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * entries;
  const pageRows = filtered.slice(start, start + entries);
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(start + entries, total);

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, r) => ({
        totalSalary: acc.totalSalary + r.totalSalary,
        paidAmount: acc.paidAmount + r.paidAmount,
        dueAmount: acc.dueAmount + r.dueAmount,
        advancedAmount: acc.advancedAmount + r.advancedAmount,
      }),
      { totalSalary: 0, paidAmount: 0, dueAmount: 0, advancedAmount: 0 }
    );
  }, [filtered]);

  const goPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border px-5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[13px]">
          <span className="text-ink-muted hover:text-ink cursor-pointer">Home</span>
          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink-muted">HRM</span>
          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink font-medium">Salary Due Report</span>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-border text-[13px] text-ink-muted hover:bg-canvas"
        >
          HRM Reports
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Employee filter */}
        <EmployeeSelect
          value={employee}
          onChange={(v) => {
            setEmployee(v);
            setPage(1);
          }}
        />

        {/* Export + Show + Search */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-sky-500 text-white text-[12px] font-medium hover:bg-sky-600"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy
            </button>
            <button
              type="button"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-amber-500 text-white text-[12px] font-medium hover:bg-amber-600"
            >
              CSV
            </button>
            <button
              type="button"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-emerald-500 text-white text-[12px] font-medium hover:bg-emerald-600"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Excel
            </button>
            <button
              type="button"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-rose-500 text-white text-[12px] font-medium hover:bg-rose-600"
            >
              <FileText className="w-3.5 h-3.5" />
              PDF
            </button>
            <div className="flex items-center gap-2 text-[13px] text-ink-muted ml-2">
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
                    "CUSTOMER CODE",
                    "NAME",
                    "MOBILE",
                    "TOTAL SALARY",
                    "PAID AMOUNT",
                    "DUE AMOUNT",
                    "ADVANCED AMOUNT",
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
                    <td colSpan={8} className="px-3 py-10 text-center text-ink-faint">
                      No records found
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-canvas/70">
                      <td className="px-3 py-2.5 text-ink-muted">{row.id}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{row.customerCode}</td>
                      <td className="px-3 py-2.5 text-ink font-medium whitespace-nowrap">
                        {row.name}
                      </td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{row.mobile}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{fmt(row.totalSalary)}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{fmt(row.paidAmount)}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{fmt(row.dueAmount)}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">
                        {fmt(row.advancedAmount)}
                      </td>
                    </tr>
                  ))
                )}
                {/* TOTAL */}
                <tr className="border-t border-border bg-canvas/50 font-semibold">
                  <td className="px-3 py-2.5 text-ink" colSpan={4}>
                    TOTAL
                  </td>
                  <td className="px-3 py-2.5 text-ink tabular-nums">
                    {totals.totalSalary.toLocaleString("en-US")}
                  </td>
                  <td className="px-3 py-2.5 text-ink tabular-nums">
                    {totals.paidAmount.toLocaleString("en-US")}
                  </td>
                  <td className="px-3 py-2.5 text-ink tabular-nums">
                    {totals.dueAmount.toLocaleString("en-US")}
                  </td>
                  <td className="px-3 py-2.5 text-ink tabular-nums">
                    {totals.advancedAmount.toLocaleString("en-US")}
                  </td>
                </tr>
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