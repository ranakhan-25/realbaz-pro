/* eslint-disable prettier/prettier */
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, FileSpreadsheet, FileText, Copy } from "lucide-react";

const years = [
  "2021", "2022", "2023", "2024", "2025", "2026",
  "2027", "2028", "2029", "2030", "2031",
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const ALL_ROWS = [
  { id: 1, name: "Tazmul Reza", leaveType: "Casual", leaveDay: 3, allocationDay: 2, balance: -1 },
];

const datePresets = [
  "Today",
  "Yesterday",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Last Month",
];

function formatDate(d: Date) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function getPresetRange(preset: string): { from: Date; to: Date } | null {
  const now = new Date(2026, 8, 13);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case "Today":
      return { from: today, to: today };
    case "Yesterday": {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      return { from: y, to: y };
    }
    case "Last 7 Days": {
      const from = new Date(today);
      from.setDate(from.getDate() - 6);
      return { from, to: today };
    }
    case "Last 30 Days": {
      const from = new Date(today);
      from.setDate(from.getDate() - 29);
      return { from, to: today };
    }
    case "This Month": {
      const from = new Date(today.getFullYear(), today.getMonth(), 1);
      const to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { from, to };
    }
    case "Last Month": {
      const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const to = new Date(today.getFullYear(), today.getMonth(), 0);
      return { from, to };
    }
    default:
      return null;
  }
}

function SimpleSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select One Option",
  showAll,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  showAll?: boolean;
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
            <div className="px-3 py-1.5 bg-ink-muted/15 border-b border-border text-[12px] font-medium text-ink-muted">
              {showAll ? "All" : placeholder}
            </div>
            <div className="max-h-52 overflow-y-auto py-1">
              {showAll && (
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-[13px] hover:bg-canvas text-ink-muted"
                >
                  All
                </button>
              )}
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[13px] hover:bg-canvas ${
                    value === opt ? "bg-ink-muted/20 text-ink font-medium" : "text-ink-muted"
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

export default function LeaveReportPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(100);
  const [page, setPage] = useState(1);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("September");
  const [dateLabel, setDateLabel] = useState("September 1, 2026 - September 30, 2026");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activePreset, setActivePreset] = useState("This Month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const applyPreset = (preset: string) => {
    if (preset === "Custom Range") {
      setActivePreset(preset);
      return;
    }
    const range = getPresetRange(preset);
    if (!range) return;
    setActivePreset(preset);
    setDateLabel(`${formatDate(range.from)} - ${formatDate(range.to)}`);
    setShowDatePicker(false);
  };

  const applyCustom = () => {
    if (customFrom && customTo) {
      const from = new Date(customFrom);
      const to = new Date(customTo);
      setDateLabel(`${formatDate(from)} - ${formatDate(to)}`);
      setActivePreset("Custom Range");
      setShowDatePicker(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_ROWS;
    return ALL_ROWS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.leaveType.toLowerCase().includes(q) ||
        String(r.leaveDay).includes(q) ||
        String(r.allocationDay).includes(q) ||
        String(r.balance).includes(q)
    );
  }, [search]);

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
        leaveDay: acc.leaveDay + r.leaveDay,
        allocationDay: acc.allocationDay + r.allocationDay,
        balance: acc.balance + r.balance,
      }),
      { leaveDay: 0, allocationDay: 0, balance: 0 }
    );
  }, [filtered]);

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
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SimpleSelect
            label="Year"
            value={year}
            onChange={setYear}
            options={years}
          />
          <SimpleSelect
            label="Month"
            value={month}
            onChange={setMonth}
            options={months}
            placeholder="All"
            showAll
          />
          <div ref={dateRef} className="relative">
            <label className="block text-[12px] text-ink-muted mb-1">Select Date</label>
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full text-left border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
            >
              {dateLabel || "Select date range"}
            </button>

            {showDatePicker && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-surface border border-border rounded-lg shadow-xl shadow-black/10 flex overflow-hidden min-w-[420px]">
                <div className="w-36 border-r border-border py-2 shrink-0">
                  {datePresets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-canvas ${
                        activePreset === p
                          ? "bg-black text-white font-medium"
                          : "text-ink-muted"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setActivePreset("Custom Range")}
                    className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-canvas ${
                      activePreset === "Custom Range"
                        ? "bg-black text-white font-medium"
                        : "text-ink-muted"
                    }`}
                  >
                    Custom Range
                  </button>
                </div>
                <div className="p-3 flex-1">
                  <div className="flex gap-3 mb-3">
                    <div className="flex-1">
                      <label className="block text-[11px] text-ink-muted mb-1">FROM</label>
                      <input
                        type="date"
                        value={customFrom}
                        onChange={(e) => setCustomFrom(e.target.value)}
                        className="w-full border border-border rounded px-2 py-1.5 text-[12px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[11px] text-ink-muted mb-1">TO</label>
                      <input
                        type="date"
                        value={customTo}
                        onChange={(e) => setCustomTo(e.target.value)}
                        className="w-full border border-border rounded px-2 py-1.5 text-[12px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={applyCustom}
                      className="px-3 py-1.5 rounded bg-emerald-500 text-white text-[12px] font-medium hover:bg-emerald-600"
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDatePicker(false)}
                      className="px-3 py-1.5 rounded border border-border text-[12px] text-ink-muted hover:bg-canvas"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

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
                {[10, 25, 50, 100].map((n) => (
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
                  {["SL", "NAME", "LEAVE TYPE", "LEAVE DAY", "ALLOCATION DAY", "BALANCE"].map(
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
                    <td colSpan={6} className="px-3 py-10 text-center text-ink-faint">
                      No records found
                    </td>
                  </tr>
                ) : (
                  <>
                    {pageRows.map((row) => (
                      <tr key={row.id} className="border-b border-border hover:bg-canvas/70">
                        <td className="px-3 py-2.5 text-ink-muted">{row.id}</td>
                        <td className="px-3 py-2.5 text-ink font-medium">{row.name}</td>
                        <td className="px-3 py-2.5 text-ink">{row.leaveType}</td>
                        <td className="px-3 py-2.5 text-ink tabular-nums">{row.leaveDay}</td>
                        <td className="px-3 py-2.5 text-ink tabular-nums">{row.allocationDay}</td>
                        <td className="px-3 py-2.5 text-ink tabular-nums">{row.balance}</td>
                      </tr>
                    ))}
                    {/* TOTAL row */}
                    <tr className="border-t border-border bg-canvas/50 font-semibold">
                      <td className="px-3 py-2.5 text-ink" colSpan={3}>
                        TOTAL
                      </td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{totals.leaveDay}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{totals.allocationDay}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{totals.balance}</td>
                    </tr>
                  </>
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