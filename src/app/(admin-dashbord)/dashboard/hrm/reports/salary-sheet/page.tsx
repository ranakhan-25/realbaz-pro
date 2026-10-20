/* eslint-disable prettier/prettier */
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, Search, X, Copy, FileSpreadsheet, FileText } from "lucide-react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const years = [
  "2021", "2022", "2023", "2024", "2025", "2026",
  "2027", "2028", "2029", "2030", "2031",
];

const employeeOptions = [
  { label: "Tazmul Reza (ST7206257)", value: "ST7206257", name: "Tazmul Reza" },
  { label: "Rifat Hosain (ST0923878)", value: "ST0923878", name: "Rifat Hosain" },
  { label: "Mohin Uddin (ST1121188)", value: "ST1121188", name: "Mohin Uddin" },
];

interface SalaryRow {
  id: number;
  customerCode: string;
  name: string;
  basicSalary: number;
  absentAmount: number;
  totalSalary: number;
}

const ALL_ROWS: SalaryRow[] = [];

function SimpleSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select One Option",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref}>
      <label className="block text-[12px] text-ink-muted mb-1">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
        >
          <span className={value ? "text-ink" : "text-ink-faint"}>
            {value || placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-ink-faint shrink-0" />
        </button>
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-md shadow-lg shadow-black/6 z-50 overflow-hidden">
            <div className="max-h-52 overflow-y-auto py-1">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[13px] hover:bg-canvas ${
                    value === opt
                      ? "bg-ink-muted/20 text-ink font-medium"
                      : "text-ink-muted"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
    <div ref={ref}>
      <label className="block text-[12px] text-ink-muted mb-1">Select Staff/Employee</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setOpen(!open);
            setQuery("");
          }}
          className="w-full flex items-center justify-between border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black gap-2"
        >
          <span className={`truncate ${value ? "text-ink" : "text-ink-faint"}`}>
            {selected ? selected.label : "Select employee"}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {value && (
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                className="text-ink-faint hover:text-ink"
              >
                <X className="w-3.5 h-3.5" />
              </span>
            )}
            <ChevronDown className="w-4 h-4 text-ink-faint" />
          </div>
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

export default function SalaryReportsPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState("March");
  const [year, setYear] = useState("2023");
  const [employee, setEmployee] = useState("ST1121188");
  const [showOvertime, setShowOvertime] = useState(true);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_ROWS;
    return ALL_ROWS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.customerCode.toLowerCase().includes(q)
    );
  }, [search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / entries) || 1);
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * entries;
  const pageRows = filtered.slice(start, start + entries);
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(start + entries, total);

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, r) => ({
        basicSalary: acc.basicSalary + r.basicSalary,
        absentAmount: acc.absentAmount + r.absentAmount,
        totalSalary: acc.totalSalary + r.totalSalary,
      }),
      { basicSalary: 0, absentAmount: 0, totalSalary: 0 }
    );
  }, [filtered]);

  const goPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  const fmt = (n: number) => n.toFixed(2);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border px-5 py-2.5">
        <div className="flex items-center gap-1 text-[13px]">
          <span className="text-ink-muted hover:text-ink cursor-pointer">Home</span>
          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink-muted">HRM</span>
          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink font-medium">Salary Reports</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SimpleSelect
            label="Month"
            value={month}
            onChange={setMonth}
            options={months}
          />
          <SimpleSelect
            label="Year"
            value={year}
            onChange={setYear}
            options={years}
          />
          <EmployeeSelect value={employee} onChange={setEmployee} />
        </div>

        {/* Show Overtime */}
        <label className="flex items-center gap-2 text-[13px] text-ink cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={showOvertime}
            onChange={(e) => setShowOvertime(e.target.checked)}
            className="w-4 h-4 accent-black"
          />
          Show Overtime
        </label>

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
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-violet-600 text-white text-[12px] font-medium hover:bg-violet-700"
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
                  {["SL", "CUSTOMER CODE", "NAME", "BASIC SALARY", "ABSENT AMOUNT", "TOTAL SALARY"].map(
                    (h) => (
                      <th key={h} className="px-3 py-2.5 font-semibold whitespace-nowrap">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-ink-faint">
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-canvas/70">
                      <td className="px-3 py-2.5 text-ink-muted">{row.id}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{row.customerCode}</td>
                      <td className="px-3 py-2.5 text-ink font-medium">{row.name}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{fmt(row.basicSalary)}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{fmt(row.absentAmount)}</td>
                      <td className="px-3 py-2.5 text-ink font-medium tabular-nums">
                        {fmt(row.totalSalary)}
                      </td>
                    </tr>
                  ))
                )}
                {/* TOTAL */}
                <tr className="border-t border-border bg-canvas/50 font-semibold">
                  <td className="px-3 py-2.5 text-ink" colSpan={3}>
                    TOTAL
                  </td>
                  <td className="px-3 py-2.5 text-ink tabular-nums">{fmt(totals.basicSalary)}</td>
                  <td className="px-3 py-2.5 text-ink tabular-nums">{fmt(totals.absentAmount)}</td>
                  <td className="px-3 py-2.5 text-ink tabular-nums">{fmt(totals.totalSalary)}</td>
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
                disabled={currentPage >= totalPages || total === 0}
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