/* eslint-disable prettier/prettier */
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, Search, FileSpreadsheet, FileText } from "lucide-react";

const months = [
  "All", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const years = [
  "2021", "2022", "2023", "2024", "2025", "2026",
  "2027", "2028", "2029", "2030", "2031",
];

const departmentOptions = [
  "All",
  "Executive Management",
  "Engineering",
  "Purchase & Procurement",
  "Sales and Marketing",
  "Account & Finance",
  "Admin & HRM",
  "HR & Admin & Procurement",
  "Architecture",
  "IT",
  "Test",
  "Factory",
  "Electrical",
  "Mechanical",
  "Chemical",
  "Dop",
  "Accounts",
  "Customs",
  "Store",
  "Sales & Marketing",
];

const deductionTypeOptions = [
  "late Deduction",
  "TDS",
  "Somikoron",
  "Admin",
  "Provident Fund",
];

const employeeOptions = [
  { label: "Tazmul Reza (ST7206257)", value: "ST7206257" },
  { label: "Rifat Hosain (ST0923878)", value: "ST0923878" },
  { label: "Mohin Uddin (ST1121188)", value: "ST1121188" },
];

interface DeductionRow {
  id: number;
  employee: string;
  department: string;
  designation: string;
  month: string;
  lateDeduction: number;
  tds: number;
  somikoron: number;
  admin: number;
  providentFund: number;
  loan: number;
  absent: number;
  late: number;
  early: number;
  totalDeduction: number;
}

const ALL_ROWS: DeductionRow[] = [];

function SimpleSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
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
            {value || placeholder || "Select"}
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
      <label className="block text-[12px] text-ink-muted mb-1">Select Employee/Staff</label>
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

export default function DeductionReportPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState("All");
  const [year, setYear] = useState("2021");
  const [department, setDepartment] = useState("All");
  const [deductionType, setDeductionType] = useState("");
  const [employee, setEmployee] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_ROWS;
    return ALL_ROWS.filter(
      (r) =>
        r.employee.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.designation.toLowerCase().includes(q)
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
        lateDeduction: acc.lateDeduction + r.lateDeduction,
        tds: acc.tds + r.tds,
        somikoron: acc.somikoron + r.somikoron,
        admin: acc.admin + r.admin,
        providentFund: acc.providentFund + r.providentFund,
        loan: acc.loan + r.loan,
        absent: acc.absent + r.absent,
        late: acc.late + r.late,
        early: acc.early + r.early,
        totalDeduction: acc.totalDeduction + r.totalDeduction,
      }),
      {
        lateDeduction: 0,
        tds: 0,
        somikoron: 0,
        admin: 0,
        providentFund: 0,
        loan: 0,
        absent: 0,
        late: 0,
        early: 0,
        totalDeduction: 0,
      }
    );
  }, [filtered]);

  const goPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));
  const fmt = (n: number) => n.toFixed(2);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Header */}
      <div className="bg-surface border-b border-border px-5 py-2.5 flex items-center justify-between">
        <h1 className="text-[15px] font-semibold text-ink">Deduction Report</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-rose-500 text-white text-[12px] font-medium hover:bg-rose-600"
          >
            <FileText className="w-3.5 h-3.5" />
            Pdf
          </button>
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-emerald-500 text-white text-[12px] font-medium hover:bg-emerald-600"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Excel
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
          <SimpleSelect
            label="Department"
            value={department}
            onChange={setDepartment}
            options={departmentOptions}
          />
          <SimpleSelect
            label="Deduction Type"
            value={deductionType}
            onChange={setDeductionType}
            options={deductionTypeOptions}
            placeholder="Select"
          />
          <EmployeeSelect value={employee} onChange={setEmployee} />
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
            <table className="w-full text-left text-[11.5px]">
              <thead>
                <tr className="bg-black text-white">
                  {[
                    "SL",
                    "EMPLOYEE",
                    "DEPARTMENT",
                    "DESIGNATION",
                    "MONTH",
                    "LATE DEDUCTION",
                    "TDS",
                    "SOMIKORON",
                    "ADMIN",
                    "PROVIDENT FUND",
                    "LOAN",
                    "ABSENT",
                    "LATE",
                    "EARLY",
                    "TOTAL DEDUCTION",
                  ].map((h) => (
                    <th key={h} className="px-2 py-2.5 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="px-3 py-8 text-center text-ink-faint">
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-canvas/70">
                      <td className="px-2 py-2 text-ink-muted">{row.id}</td>
                      <td className="px-2 py-2 text-ink font-medium whitespace-nowrap">
                        {row.employee}
                      </td>
                      <td className="px-2 py-2 text-ink whitespace-nowrap">{row.department}</td>
                      <td className="px-2 py-2 text-ink whitespace-nowrap">{row.designation}</td>
                      <td className="px-2 py-2 text-ink">{row.month}</td>
                      <td className="px-2 py-2 text-ink tabular-nums">{fmt(row.lateDeduction)}</td>
                      <td className="px-2 py-2 text-ink tabular-nums">{fmt(row.tds)}</td>
                      <td className="px-2 py-2 text-ink tabular-nums">{fmt(row.somikoron)}</td>
                      <td className="px-2 py-2 text-ink tabular-nums">{fmt(row.admin)}</td>
                      <td className="px-2 py-2 text-ink tabular-nums">{fmt(row.providentFund)}</td>
                      <td className="px-2 py-2 text-ink tabular-nums">{fmt(row.loan)}</td>
                      <td className="px-2 py-2 text-ink tabular-nums">{fmt(row.absent)}</td>
                      <td className="px-2 py-2 text-ink tabular-nums">{fmt(row.late)}</td>
                      <td className="px-2 py-2 text-ink tabular-nums">{fmt(row.early)}</td>
                      <td className="px-2 py-2 text-ink font-medium tabular-nums">
                        {fmt(row.totalDeduction)}
                      </td>
                    </tr>
                  ))
                )}
                {/* TOTAL */}
                <tr className="border-t border-border bg-canvas/50 font-semibold">
                  <td className="px-2 py-2.5 text-ink" colSpan={5}>
                    TOTAL
                  </td>
                  <td className="px-2 py-2.5 text-ink tabular-nums">{fmt(totals.lateDeduction)}</td>
                  <td className="px-2 py-2.5 text-ink tabular-nums">{fmt(totals.tds)}</td>
                  <td className="px-2 py-2.5 text-ink tabular-nums">{fmt(totals.somikoron)}</td>
                  <td className="px-2 py-2.5 text-ink tabular-nums">{fmt(totals.admin)}</td>
                  <td className="px-2 py-2.5 text-ink tabular-nums">{fmt(totals.providentFund)}</td>
                  <td className="px-2 py-2.5 text-ink tabular-nums">{fmt(totals.loan)}</td>
                  <td className="px-2 py-2.5 text-ink tabular-nums">{fmt(totals.absent)}</td>
                  <td className="px-2 py-2.5 text-ink tabular-nums">{fmt(totals.late)}</td>
                  <td className="px-2 py-2.5 text-ink tabular-nums">{fmt(totals.early)}</td>
                  <td className="px-2 py-2.5 text-ink tabular-nums">{fmt(totals.totalDeduction)}</td>
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