/* eslint-disable prettier/prettier */
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, FileSpreadsheet, FileText } from "lucide-react";

const years = [
  "2021", "2022", "2023", "2024", "2025", "2026",
  "2027", "2028", "2029", "2030", "2031",
];

const monthKeys = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

type MonthData = { s: number; c1: number; c2: number };

interface LeaveRow {
  id: number;
  code: string;
  name: string;
  designation: string;
  joinDate: string;
  months: Record<string, MonthData>;
  total: number;
}

const emptyMonths = (): Record<string, MonthData> =>
  Object.fromEntries(monthKeys.map((m) => [m, { s: 0, c1: 0, c2: 0 }]));

const ALL_ROWS: LeaveRow[] = [
  {
    id: 1,
    code: "02",
    name: "Tazmul Reza",
    designation: "Executive",
    joinDate: "01 Jul, 2024",
    months: {
      ...emptyMonths(),
      SEP: { s: 0, c1: 3, c2: 0 },
    },
    total: 3,
  },
  {
    id: 2,
    code: "03",
    name: "Rifat Hosain",
    designation: "Software Engineer",
    joinDate: "01 Feb, 2026",
    months: emptyMonths(),
    total: 0,
  },
  {
    id: 3,
    code: "12",
    name: "Mohin Uddin",
    designation: "Tea Boy",
    joinDate: "30 Jul, 2026",
    months: emptyMonths(),
    total: 0,
  },
];

function SimpleSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
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
    <div ref={ref} className="w-48">
      <label className="block text-[12px] text-ink-muted mb-1">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
        >
          <span className={value ? "text-ink" : "text-ink-faint"}>
            {value || "Select One Option"}
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

export default function LeaveReportMatrixPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [year, setYear] = useState("2026");

  const yearSuffix = year.slice(-2);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_ROWS;
    return ALL_ROWS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.code.includes(q) ||
        r.designation.toLowerCase().includes(q)
    );
  }, [search]);

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
          <span className="text-ink font-medium">Leave Report</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Year + Export */}
        <div className="flex flex-wrap items-end gap-3">
          <SimpleSelect label="Year" value={year} onChange={setYear} options={years} />
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-2 rounded bg-rose-500 text-white text-[12px] font-medium hover:bg-rose-600"
          >
            <FileText className="w-3.5 h-3.5" />
            PDF
          </button>
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-2 rounded bg-emerald-500 text-white text-[12px] font-medium hover:bg-emerald-600"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Excel
          </button>
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

        {/* Matrix Table */}
        <div className="bg-surface rounded-lg border border-border shadow-sm shadow-black/6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                {/* Month headers */}
                <tr className="bg-black text-white">
                  <th rowSpan={2} className="px-2 py-2 font-semibold whitespace-nowrap border-r border-white/10">
                    SL
                  </th>
                  <th rowSpan={2} className="px-2 py-2 font-semibold whitespace-nowrap border-r border-white/10">
                    CODE
                  </th>
                  <th rowSpan={2} className="px-2 py-2 font-semibold whitespace-nowrap border-r border-white/10">
                    NAME
                  </th>
                  <th rowSpan={2} className="px-2 py-2 font-semibold whitespace-nowrap border-r border-white/10">
                    DESIGNATION
                  </th>
                  <th rowSpan={2} className="px-2 py-2 font-semibold whitespace-nowrap border-r border-white/10">
                    JOIN DATE
                  </th>
                  {monthKeys.map((m) => (
                    <th
                      key={m}
                      colSpan={3}
                      className="px-1 py-1.5 font-semibold text-center border-r border-white/10"
                    >
                      {m} {yearSuffix}
                    </th>
                  ))}
                  <th rowSpan={2} className="px-2 py-2 font-semibold text-center">
                    TOTAL
                  </th>
                </tr>
                {/* S C C sub-headers */}
                <tr className="bg-black text-white">
                  {monthKeys.map((m) => (
                    <>
                      <th
                        key={`${m}-s`}
                        className="px-1 py-1 font-medium text-center border-r border-white/10 w-7"
                      >
                        S
                      </th>
                      <th
                        key={`${m}-c1`}
                        className="px-1 py-1 font-medium text-center border-r border-white/10 w-7"
                      >
                        C
                      </th>
                      <th
                        key={`${m}-c2`}
                        className="px-1 py-1 font-medium text-center border-r border-white/10 w-7"
                      >
                        C
                      </th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={5 + monthKeys.length * 3 + 1} className="px-3 py-10 text-center text-ink-faint">
                      No records found
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-canvas/70">
                      <td className="px-2 py-2 text-ink-muted border-r border-border">{row.id}</td>
                      <td className="px-2 py-2 text-ink tabular-nums border-r border-border">
                        {row.code}
                      </td>
                      <td className="px-2 py-2 text-ink font-medium whitespace-nowrap border-r border-border">
                        {row.name}
                      </td>
                      <td className="px-2 py-2 text-ink whitespace-nowrap border-r border-border">
                        {row.designation}
                      </td>
                      <td className="px-2 py-2 text-ink whitespace-nowrap border-r border-border">
                        {row.joinDate}
                      </td>
                      {monthKeys.map((m) => {
                        const d = row.months[m] || { s: 0, c1: 0, c2: 0 };
                        return (
                          <>
                            <td
                              key={`${row.id}-${m}-s`}
                              className="px-1 py-2 text-center text-ink tabular-nums border-r border-border"
                            >
                              {d.s}
                            </td>
                            <td
                              key={`${row.id}-${m}-c1`}
                              className="px-1 py-2 text-center text-ink tabular-nums border-r border-border"
                            >
                              {d.c1}
                            </td>
                            <td
                              key={`${row.id}-${m}-c2`}
                              className="px-1 py-2 text-center text-ink tabular-nums border-r border-border"
                            >
                              {d.c2}
                            </td>
                          </>
                        );
                      })}
                      <td className="px-2 py-2 text-center text-ink font-semibold tabular-nums">
                        {row.total}
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