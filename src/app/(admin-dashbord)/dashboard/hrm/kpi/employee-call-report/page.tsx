/* eslint-disable prettier/prettier */
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

const staffOptions = [
  "Admin",
  "Tazmul Reza",
  "Rifat Hosain",
  "User",
  "Sarna",
  "Rowza",
];

const ALL_ROWS = [
  {
    id: 1,
    name: "",
    from: "01-Jul-2026",
    to: "31-Jul-2026",
    leftDays: 0,
    targetCall: 7,
    achieveCall: 0,
    callPercent: 0,
    targetTask: 7,
    achieveTask: 0,
    taskPercent: 0,
  },
  {
    id: 2,
    name: "",
    from: "13-Jul-2026",
    to: "18-Jul-2026",
    leftDays: 0,
    targetCall: 10,
    achieveCall: 0,
    callPercent: 0,
    targetTask: 100000,
    achieveTask: 0,
    taskPercent: 0,
  },
  {
    id: 3,
    name: "",
    from: "26-Apr-2026",
    to: "11-May-2026",
    leftDays: 0,
    targetCall: 200,
    achieveCall: 0,
    callPercent: 0,
    targetTask: -2,
    achieveTask: 0,
    taskPercent: 0,
  },
];

function StaffSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return staffOptions;
    return staffOptions.filter((s) => s.toLowerCase().includes(q));
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
          className="w-full flex items-center justify-between border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
        >
          <span className={value ? "text-ink" : "text-ink-faint"}>
            {value || "Select Staff/Employee"}
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
                  placeholder="Searching..."
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
                    key={opt}
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`w-full text-left px-3 py-2 text-[13px] hover:bg-canvas ${
                      value === opt
                        ? "bg-black text-white font-medium"
                        : "text-ink-muted"
                    }`}
                  >
                    {opt}
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

function PercentBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-4 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
        <div
          className="h-full rounded bg-rose-500 transition-all"
          style={{ width: `${pct}%` }}
        />
        {pct === 0 && (
          <span className="absolute left-0 top-0 h-full w-1 bg-rose-500 rounded-l" />
        )}
      </div>
      <span className="text-[11px] text-ink-muted tabular-nums w-8">{pct}%</span>
    </div>
  );
}

export default function EmployeeKPICallReportPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [staff, setStaff] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_ROWS;
    return ALL_ROWS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.from.toLowerCase().includes(q) ||
        r.to.toLowerCase().includes(q) ||
        String(r.targetCall).includes(q)
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
          <span className="text-ink-muted">Employee</span>
          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink font-medium">Employee KPI Call Report</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <h1 className="text-[18px] font-semibold text-ink">Employee KPI Call Report</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[12px] text-ink-muted mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-[12px] text-ink-muted mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <StaffSelect value={staff} onChange={setStaff} />
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
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="bg-black text-white">
                  {[
                    "SL",
                    "NAME",
                    "FROM",
                    "TO",
                    "LEFT DAYS",
                    "TARGET CALL",
                    "ACHIEVE CALL",
                    "PERCENTAGE",
                    "TARGET TASK",
                    "ACHIEVE TASK",
                    "PERCENTAGE",
                  ].map((h) => (
                    <th key={h} className="px-2.5 py-2.5 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-3 py-10 text-center text-ink-faint">
                      No records found
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-canvas/70">
                      <td className="px-2.5 py-2.5 text-ink-muted">{row.id}</td>
                      <td className="px-2.5 py-2.5 text-ink font-medium whitespace-nowrap">
                        {row.name}
                      </td>
                      <td className="px-2.5 py-2.5 text-ink whitespace-nowrap">{row.from}</td>
                      <td className="px-2.5 py-2.5 text-ink whitespace-nowrap">{row.to}</td>
                      <td className="px-2.5 py-2.5 text-ink tabular-nums">{row.leftDays}</td>
                      <td className="px-2.5 py-2.5 text-ink tabular-nums">{row.targetCall}</td>
                      <td className="px-2.5 py-2.5 text-ink tabular-nums">{row.achieveCall}</td>
                      <td className="px-2.5 py-2.5">
                        <PercentBar value={row.callPercent} />
                      </td>
                      <td className="px-2.5 py-2.5 text-ink tabular-nums">{row.targetTask}</td>
                      <td className="px-2.5 py-2.5 text-ink tabular-nums">{row.achieveTask}</td>
                      <td className="px-2.5 py-2.5">
                        <PercentBar value={row.taskPercent} />
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