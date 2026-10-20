/* eslint-disable prettier/prettier */
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { RefreshCw, Play, Upload, X, Download } from "lucide-react";

interface AttendanceRow {
  id: number;
  employeeCode: string;
  name: string;
  time: string;
  date: string;
}

const ALL_ROWS: AttendanceRow[] = [];

const datePresets = [
  "Today",
  "Yesterday",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Last Month",
  "Tomorrow",
  "Till Now",
  "Clear",
];

function formatDate(d: Date) {
  const day = d.getDate();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${day} ${months[d.getMonth()]}, ${d.getFullYear()}`;
}

function getPresetRange(preset: string): { from: Date; to: Date } | null {
  const now = new Date(2026, 8, 12); // Sep 12, 2026
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
    case "Tomorrow": {
      const t = new Date(today);
      t.setDate(t.getDate() + 1);
      return { from: t, to: t };
    }
    case "Till Now": {
      const from = new Date(today.getFullYear(), 0, 1);
      return { from, to: today };
    }
    case "Clear":
      return null;
    default:
      return null;
  }
}

export default function AttendancePage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activePreset, setActivePreset] = useState("This Month");
  const [dateLabel, setDateLabel] = useState("1 September, 2026 - 30 September, 2026");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);

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
    if (!range) {
      setDateLabel("");
      setActivePreset("");
      setShowDatePicker(false);
      return;
    }
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
        r.employeeCode.includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.time.includes(q) ||
        r.date.includes(q)
    );
  }, [search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / entries) || 1);
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * entries;
  const pageRows = filtered.slice(start, start + entries);
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(start + entries, total);

  const goPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  return (
    <div className="min-h-screen bg-canvas text-ink relative">
      {/* Breadcrumb + Log Import */}
      <div className="bg-surface border-b border-border px-5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[13px]">
          <span className="text-ink-muted hover:text-ink cursor-pointer">Home</span>
          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink-muted">HRM</span>
          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink font-medium">Attendance</span>
        </div>

        <button
          type="button"
          onClick={() => setShowImportModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-black text-white text-[13px] font-medium hover:bg-slate-800 shadow-sm"
        >
          <Upload className="w-3.5 h-3.5" />
          Log Import
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Select Date */}
        <div ref={dateRef} className="relative max-w-sm">
          <label className="block text-[12px] text-ink-muted mb-1">Select Date</label>
          <button
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="w-full text-left border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
          >
            {dateLabel || "Select date range"}
          </button>

          {showDatePicker && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-surface border border-border rounded-lg shadow-xl shadow-black/10 flex overflow-hidden min-w-[480px]">
              {/* Presets */}
              <div className="w-40 border-r border-border py-2 shrink-0">
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

              {/* Custom range inputs */}
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

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-black text-white text-[13px] font-medium hover:bg-slate-800"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Log Sync
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-black text-white text-[13px] font-medium hover:bg-slate-800"
          >
            <Play className="w-3.5 h-3.5" />
            Process Data
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

        {/* Table */}
        <div className="bg-surface rounded-lg border border-border shadow-sm shadow-black/6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="bg-black text-white">
                  {["SL", "EMPLOYEE CODE", "NAME", "TIME", "DATE"].map((h) => (
                    <th key={h} className="px-3 py-2.5 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-10 text-center text-ink-faint">
                      No attendance found for selected date
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-canvas/70">
                      <td className="px-3 py-2.5 text-ink-muted">{row.id}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{row.employeeCode}</td>
                      <td className="px-3 py-2.5 text-ink font-medium">{row.name}</td>
                      <td className="px-3 py-2.5 text-ink">{row.time}</td>
                      <td className="px-3 py-2.5 text-ink whitespace-nowrap">{row.date}</td>
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

      {/* ── Log Import Modal ── */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowImportModal(false)} />

          <div className="relative bg-surface rounded-lg shadow-xl shadow-black/20 w-full max-w-md mx-4 border border-border">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <h2 className="text-[15px] font-semibold text-ink">Log Import</h2>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="w-7 h-7 rounded flex items-center justify-center text-ink-muted hover:bg-canvas hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="block text-[12px] text-ink-muted mb-1">Log</label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 border border-border rounded-md px-3 py-2 text-[13px] bg-surface cursor-pointer hover:bg-canvas flex-1">
                    <span className="px-2 py-0.5 rounded border border-border text-[12px] text-ink-muted bg-canvas">
                      Choose File
                    </span>
                    <span className="text-ink-faint text-[12px] truncate">
                      {importFile ? importFile.name : "No file chosen"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-sky-500 text-sky-600 text-[12px] font-medium hover:bg-sky-50 dark:hover:bg-sky-500/10"
              >
                <Download className="w-3.5 h-3.5" />
                Sample File Download
              </button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-border">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-1.5 rounded-md border border-border text-[13px] text-ink-muted hover:bg-canvas"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-1.5 rounded-md bg-black text-white text-[13px] font-medium hover:bg-slate-800"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}