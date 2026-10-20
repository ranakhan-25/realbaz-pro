/* eslint-disable prettier/prettier */
"use client";

import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

const ALL_ROWS = [
  {
    id: 1,
    type: "Individual",
    name: "N/A",
    work1: "Call Task",
    target1: "7",
    work2: "Visit Task",
    target2: "7",
    work3: "Sales Task",
    target3: "7",
    fromDate: "01-07-2026",
    toDate: "31-07-2026",
    leftDays: "0",
    status: "Active",
  },
  {
    id: 2,
    type: "Individual",
    name: "N/A",
    work1: "Call Task",
    target1: "10",
    work2: "Visit Task",
    target2: "5",
    work3: "Sales Task",
    target3: "100000",
    fromDate: "13-07-2026",
    toDate: "18-07-2026",
    leftDays: "0",
    status: "Active",
  },
  {
    id: 3,
    type: "Team",
    name: "Go",
    work1: "Call Task",
    target1: "9",
    work2: "Visit Task",
    target2: "8",
    work3: "Sales Task",
    target3: "6",
    fromDate: "01-07-2026",
    toDate: "31-07-2026",
    leftDays: "0",
    status: "Active",
  },
  {
    id: 4,
    type: "Team",
    name: "Gladiators",
    work1: "Call Task",
    target1: "200",
    work2: "Visit Task",
    target2: "20",
    work3: "Sales Task",
    target3: "5",
    fromDate: "07-06-2026",
    toDate: "07-07-2026",
    leftDays: "0",
    status: "Active",
  },
  {
    id: 5,
    type: "Individual",
    name: "N/A",
    work1: "Call Task",
    target1: "200",
    work2: "Visit Task",
    target2: "50",
    work3: "Sales Task",
    target3: "-2",
    fromDate: "26-04-2026",
    toDate: "11-05-2026",
    leftDays: "0",
    status: "Active",
  },
];

export default function EmployeeKPIPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_ROWS;
    return ALL_ROWS.filter(
      (r) =>
        r.type.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.work1.toLowerCase().includes(q) ||
        r.work2.toLowerCase().includes(q) ||
        r.work3.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q) ||
        r.fromDate.includes(q) ||
        r.toDate.includes(q)
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
      {/* Breadcrumb + New KPI */}
      <div className="bg-surface border-b border-border px-5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[13px]">
          <span className="text-ink-muted hover:text-ink cursor-pointer">Home</span>
          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink-muted">Employee</span>
          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink font-medium">Employee KPI</span>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-black text-white text-[13px] font-medium hover:bg-slate-800 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          New KPI
        </button>
      </div>

      <div className="p-4 space-y-3">
        <h1 className="text-[18px] font-semibold text-ink">Employee KPI Reports</h1>

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
                    "TYPE",
                    "NAME",
                    "WORK TYPE",
                    "TARGET",
                    "WORK TYPE",
                    "TARGET",
                    "WORK TYPE",
                    "TARGET",
                    "FROM DATE",
                    "TO DATE",
                    "LEFT DAYS",
                    "STATUS",
                    "ACTION",
                  ].map((h, i) => (
                    <th key={`${h}-${i}`} className="px-2.5 py-2.5 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="px-3 py-10 text-center text-ink-faint">
                      No records found
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-canvas/70">
                      <td className="px-2.5 py-2.5 text-ink-muted">{row.id}</td>
                      <td className="px-2.5 py-2.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold text-white ${
                            row.type === "Individual"
                              ? "bg-violet-500"
                              : "bg-amber-500"
                          }`}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td className="px-2.5 py-2.5 text-ink font-medium whitespace-nowrap">
                        {row.name}
                      </td>
                      <td className="px-2.5 py-2.5 text-ink whitespace-nowrap">{row.work1}</td>
                      <td className="px-2.5 py-2.5 text-ink tabular-nums">{row.target1}</td>
                      <td className="px-2.5 py-2.5 text-ink whitespace-nowrap">{row.work2}</td>
                      <td className="px-2.5 py-2.5 text-ink tabular-nums">{row.target2}</td>
                      <td className="px-2.5 py-2.5 text-ink whitespace-nowrap">{row.work3}</td>
                      <td className="px-2.5 py-2.5 text-ink tabular-nums">{row.target3}</td>
                      <td className="px-2.5 py-2.5 text-ink whitespace-nowrap">{row.fromDate}</td>
                      <td className="px-2.5 py-2.5 text-ink whitespace-nowrap">{row.toDate}</td>
                      <td className="px-2.5 py-2.5 text-ink tabular-nums">{row.leftDays}</td>
                      <td className="px-2.5 py-2.5">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500 text-white">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-2.5 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            className="w-7 h-7 rounded bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            className="w-7 h-7 rounded bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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