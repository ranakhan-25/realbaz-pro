/* eslint-disable prettier/prettier */
"use client";

import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const ALL_ROWS = [
  { id: 1, type: "Deduction", name: "Provident Fund", paymentType: "Monthly" },
  { id: 2, type: "Deduction", name: "Admin", paymentType: "Monthly" },
  { id: 3, type: "Deduction", name: "Somikoron", paymentType: "Monthly" },
  { id: 4, type: "Deduction", name: "TDS", paymentType: "Monthly" },
  { id: 5, type: "Allowance", name: "ot", paymentType: "Daily" },
  { id: 6, type: "Deduction", name: "late Deduction", paymentType: "Monthly" },
  { id: 7, type: "Allowance", name: "House Rent", paymentType: "Monthly" },
  { id: 8, type: "Allowance", name: "Medical Allowance", paymentType: "Monthly" },
  { id: 9, type: "Allowance", name: "convyence Allowance", paymentType: "Monthly" },
];

const typeOptions = ["Allowance", "Deduction"];
const paymentTypeOptions = ["Monthly", "Daily", "Weekly", "Yearly"];

export default function AllowanceDeductionListPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formType, setFormType] = useState("");
  const [formPaymentType, setFormPaymentType] = useState("");
  const [formName, setFormName] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_ROWS;
    return ALL_ROWS.filter(
      (r) =>
        r.type.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.paymentType.toLowerCase().includes(q) ||
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
    setFormType("");
    setFormPaymentType("");
    setFormName("");
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
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
          <span className="text-ink font-medium">Allowance Deduction List</span>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-black text-white text-[13px] font-medium hover:bg-slate-800 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Allowance Deduction Add
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
                  {["SL", "TYPE", "NAME", "PAYMENT TYPE", "ACTION"].map((h) => (
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
                      No records found
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-canvas/70">
                      <td className="px-3 py-2.5 text-ink-muted">{row.id}</td>
                      <td className="px-3 py-2.5 text-ink">{row.type}</td>
                      <td className="px-3 py-2.5 text-ink font-medium">{row.name}</td>
                      <td className="px-3 py-2.5 text-ink">{row.paymentType}</td>
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

      {/* ── Allowance Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

          <div className="relative bg-surface rounded-lg shadow-xl shadow-black/20 w-full max-w-md mx-4 border border-border">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
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
              {/* Type + Payment Type side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] text-ink-muted mb-1">Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="">Select value</option>
                    {typeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] text-ink-muted mb-1">Payment Type</label>
                  <select
                    value={formPaymentType}
                    onChange={(e) => setFormPaymentType(e.target.value)}
                    className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="">Select value</option>
                    {paymentTypeOptions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-border">
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