/* eslint-disable prettier/prettier */
"use client";

import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const ALL_ROWS = [
  { id: 1, name: "Grade 1 D", basicSalary: "13000" },
  { id: 2, name: "Percent Grade", basicSalary: "0" },
  { id: 3, name: "Grade 1 C", basicSalary: "50000" },
  { id: 4, name: "Grade 1", basicSalary: "0" },
];

const typeOptions = ["Allowance", "Deduction"];

interface AllowanceRow {
  id: number;
  type: string;
  name: string;
  percent: string;
  amount: string;
}

export default function SalaryGradeListPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formBasicSalary, setFormBasicSalary] = useState("");
  const [rowType, setRowType] = useState("");
  const [rowName, setRowName] = useState("");
  const [rowPercent, setRowPercent] = useState("");
  const [rowAmount, setRowAmount] = useState("");
  const [allowanceRows, setAllowanceRows] = useState<AllowanceRow[]>([]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_ROWS;
    return ALL_ROWS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.basicSalary.includes(q) ||
        String(r.id).includes(q)
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

  const resetForm = () => {
    setFormName("");
    setFormBasicSalary("");
    setRowType("");
    setRowName("");
    setRowPercent("");
    setRowAmount("");
    setAllowanceRows([]);
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleAddRow = () => {
    if (!rowType && !rowName && !rowPercent && !rowAmount) return;
    setAllowanceRows((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: rowType,
        name: rowName,
        percent: rowPercent,
        amount: rowAmount,
      },
    ]);
    setRowType("");
    setRowName("");
    setRowPercent("");
    setRowAmount("");
  };

  const handleRemoveRow = (id: number) => {
    setAllowanceRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSubmit = () => {
    handleClose();
  };

  return (
    <div className="min-h-screen bg-canvas text-ink relative">
      {/* Breadcrumb + Add button */}
      <div className="bg-surface border-b border-border px-5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[13px]">
          <span className="text-ink-muted hover:text-ink cursor-pointer">Home</span>
          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink-muted">HRM</span>
          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink font-medium">Salary Grade List</span>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-black text-white text-[13px] font-medium hover:bg-slate-800 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Salary Grade Add
        </button>
      </div>

      <div className="p-4">
        {/* Show + Search */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
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
                  {["SL", "NAME", "BASIC SALARY", "ACTION"].map((h) => (
                    <th key={h} className="px-3 py-2.5 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-10 text-center text-ink-faint">
                      No records found
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-canvas/70">
                      <td className="px-3 py-2.5 text-ink-muted">{row.id}</td>
                      <td className="px-3 py-2.5 text-ink font-medium">{row.name}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{row.basicSalary}</td>
                      <td className="px-3 py-2.5">
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

      {/* ── Salary Grade Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

          <div className="relative bg-surface rounded-lg shadow-xl shadow-black/20 w-full max-w-2xl mx-4 border border-border max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border sticky top-0 bg-surface z-10">
              <h2 className="text-[15px] font-semibold text-ink">Allowance</h2>
              <button
                type="button"
                onClick={handleClose}
                className="w-7 h-7 rounded flex items-center justify-center text-ink-muted hover:bg-canvas hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-3.5">
              {/* Name */}
              <div>
                <label className="block text-[12px] text-ink-muted mb-1">
                  Name<span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Name"
                  className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Basic Salary */}
              <div>
                <label className="block text-[12px] text-ink-muted mb-1">
                  Basic Salary<span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formBasicSalary}
                  onChange={(e) => setFormBasicSalary(e.target.value)}
                  placeholder="Basic Salary"
                  className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Type / Name / Percent / Amount + Add */}
              <div className="flex flex-wrap items-end gap-2">
                <div className="flex-1 min-w-[100px]">
                  <label className="block text-[12px] text-ink-muted mb-1">Type</label>
                  <select
                    value={rowType}
                    onChange={(e) => setRowType(e.target.value)}
                    className="w-full border border-border rounded-md px-2 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="">Select ...</option>
                    {typeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[100px]">
                  <label className="block text-[12px] text-ink-muted mb-1">Name</label>
                  <input
                    type="text"
                    value={rowName}
                    onChange={(e) => setRowName(e.target.value)}
                    placeholder="Select Type"
                    className="w-full border border-border rounded-md px-2 py-2 text-[13px] bg-surface text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-[12px] text-ink-muted mb-1">
                    Percent(%)<span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={rowPercent}
                    onChange={(e) => setRowPercent(e.target.value)}
                    placeholder="Percent"
                    className="w-full border border-border rounded-md px-2 py-2 text-[13px] bg-surface text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-[12px] text-ink-muted mb-1">
                    Amount<span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={rowAmount}
                    onChange={(e) => setRowAmount(e.target.value)}
                    placeholder="Amount"
                    className="w-full border border-border rounded-md px-2 py-2 text-[13px] bg-surface text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="px-3 py-2 rounded-md bg-black text-white text-[13px] font-medium hover:bg-slate-800"
                >
                  Add
                </button>
              </div>

              {/* Mini table */}
              <div className="border border-border rounded-md overflow-hidden">
                <table className="w-full text-left text-[12px]">
                  <thead>
                    <tr className="bg-black text-white">
                      {["SL", "TYPE", "NAME", "PERCENT", "AMOUNT", "ACTION"].map((h) => (
                        <th key={h} className="px-2.5 py-2 font-semibold whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allowanceRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-2.5 py-4 text-center text-ink-faint">
                          No items added
                        </td>
                      </tr>
                    ) : (
                      allowanceRows.map((row) => (
                        <tr key={row.id} className="border-b border-border">
                          <td className="px-2.5 py-2 text-ink-muted">{row.id}</td>
                          <td className="px-2.5 py-2 text-ink">{row.type}</td>
                          <td className="px-2.5 py-2 text-ink">{row.name}</td>
                          <td className="px-2.5 py-2 text-ink tabular-nums">{row.percent}</td>
                          <td className="px-2.5 py-2 text-ink tabular-nums">{row.amount}</td>
                          <td className="px-2.5 py-2">
                            <button
                              type="button"
                              onClick={() => handleRemoveRow(row.id)}
                              className="w-6 h-6 rounded bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-border sticky bottom-0 bg-surface">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-1.5 rounded-md border border-border text-[13px] text-ink-muted hover:bg-canvas"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSubmit}
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