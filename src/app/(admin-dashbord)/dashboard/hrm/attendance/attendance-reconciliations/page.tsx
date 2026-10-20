/* eslint-disable prettier/prettier */
"use client";

import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const ALL_ROWS = [
  { id: 1, employee: "", date: "16 Aug 2026", lateMinutes: "0", requestType: "Ignore_Late", reason: "ghdfgh", status: "Pending", approve: "pending" },
  { id: 2, employee: "", date: "14 Aug 2026", lateMinutes: "77", requestType: "Manual_Attendance_Request", reason: "dyh drhf", status: "Pending", approve: "pending" },
  { id: 3, employee: "", date: "12 Aug 2026", lateMinutes: "45", requestType: "Ignore_Late", reason: "sdgjkn dsg", status: "Pending", approve: "pending" },
  { id: 4, employee: "", date: "21 Jul 2026", lateMinutes: "10", requestType: "Ignore_Late", reason: "-", status: "Pending", approve: "pending" },
  { id: 5, employee: "", date: "21 Jul 2026", lateMinutes: "30", requestType: "Ignore_Late", reason: "-", status: "Pending", approve: "pending" },
  { id: 6, employee: "", date: "19 May 2026", lateMinutes: "0", requestType: "Other", reason: "test", status: "Approved", approve: "completed" },
  { id: 7, employee: "", date: "18 May 2026", lateMinutes: "0", requestType: "Other", reason: "test", status: "Approved", approve: "completed" },
  { id: 8, employee: "", date: "22 Apr 2026", lateMinutes: "10", requestType: "Manual_Attendance_Request", reason: "-", status: "Pending", approve: "pending" },
  { id: 9, employee: "", date: "05 Mar 2026", lateMinutes: "99", requestType: "Manual_Attendance_Request", reason: "aaaa", status: "Approved", approve: "completed" },
  { id: 10, employee: "", date: "07 Mar 2026", lateMinutes: "88", requestType: "Other", reason: "cdzvd", status: "Approved", approve: "completed" },
];

const employeeOptions = ["Admin", "Tazmul Reza", "Rifat Hosain", "Mohin Uddin", "Sarna", "Rowza"];
const requestTypeOptions = ["Ignore_Late", "Manual_Attendance_Request", "Other", "Early_Leave", "Half_Day"];

export default function AttendanceReconciliationsListPage() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formEmployee, setFormEmployee] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formLateMinutes, setFormLateMinutes] = useState("0");
  const [formRequestType, setFormRequestType] = useState("");
  const [formReason, setFormReason] = useState("");
  const [formFile, setFormFile] = useState<File | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_ROWS;
    return ALL_ROWS.filter(
      (r) =>
        r.date.toLowerCase().includes(q) ||
        r.requestType.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q) ||
        r.lateMinutes.includes(q) ||
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

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }, [totalPages]);

  const resetForm = () => {
    setFormEmployee("");
    setFormDate("");
    setFormLateMinutes("0");
    setFormRequestType("");
    setFormReason("");
    setFormFile(null);
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
          <span className="text-ink font-medium">Attendance Reconciliations List</span>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-black text-white text-[13px] font-medium hover:bg-slate-800 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Attendance Reconciliations Add
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
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="bg-black text-white">
                  {["SL", "EMPLOYEE", "DATE", "LATE MINUTES", "REQUEST TYPE", "REASON", "STATUS", "APPROVE", "ACTION"].map(
                    (h) => (
                      <th key={h} className="px-2.5 py-2.5 font-semibold whitespace-nowrap">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-2.5 py-10 text-center text-ink-faint">
                      No records found
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-canvas/70">
                      <td className="px-2.5 py-2.5 text-ink-muted">{row.id}</td>
                      <td className="px-2.5 py-2.5 text-ink">{row.employee}</td>
                      <td className="px-2.5 py-2.5 text-ink whitespace-nowrap">{row.date}</td>
                      <td className="px-2.5 py-2.5 text-ink tabular-nums">{row.lateMinutes}</td>
                      <td className="px-2.5 py-2.5 text-ink whitespace-nowrap">{row.requestType}</td>
                      <td className="px-2.5 py-2.5 text-ink max-w-[140px] truncate">{row.reason}</td>
                      <td className="px-2.5 py-2.5">
                        <span
                          className={
                            row.status === "Approved"
                              ? "text-emerald-600 font-medium"
                              : "text-amber-600 font-medium"
                          }
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-2.5 py-2.5 text-[11px] leading-relaxed">
                        {row.approve === "completed" ? (
                          <span className="text-emerald-600">
                            ✓ All Approvals Completed.
                          </span>
                        ) : (
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="text-ink">Admin</span>
                              <input type="checkbox" className="w-3.5 h-3.5 accent-black" />
                            </div>
                            <div className="text-rose-500">✗ Rifat Hosain</div>
                          </div>
                        )}
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
              {pageNumbers.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => goPage(p)}
                  className={`min-w-[32px] px-2 py-1 rounded font-medium ${
                    currentPage === p
                      ? "bg-black text-white"
                      : "border border-border hover:bg-canvas text-ink"
                  }`}
                >
                  {p}
                </button>
              ))}
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

      {/* ── Attendance Reconciliation Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

          <div className="relative bg-surface rounded-lg shadow-xl shadow-black/20 w-full max-w-lg mx-4 border border-border">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <h2 className="text-[15px] font-semibold text-ink">Attendance Reconciliation</h2>
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
              {/* Employee + Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] text-ink-muted mb-1">
                    Employee <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formEmployee}
                    onChange={(e) => setFormEmployee(e.target.value)}
                    className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="">Select One Option</option>
                    {employeeOptions.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] text-ink-muted mb-1">
                    Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* Late Minutes */}
              <div>
                <label className="block text-[12px] text-ink-muted mb-1">Late Minutes</label>
                <input
                  type="text"
                  value={formLateMinutes}
                  onChange={(e) => setFormLateMinutes(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black max-w-[200px]"
                />
              </div>

              {/* Request Type */}
              <div>
                <label className="block text-[12px] text-ink-muted mb-1">
                  Request Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formRequestType}
                  onChange={(e) => setFormRequestType(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="">Select value</option>
                  {requestTypeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-[12px] text-ink-muted mb-1">Reason</label>
                <textarea
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="Write valid reason..."
                  rows={3}
                  className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-black resize-none"
                />
              </div>

              {/* Attachment */}
              <div>
                <label className="block text-[12px] text-ink-muted mb-1">
                  Attachment (Optional)
                </label>
                <label className="flex items-center gap-2 border border-border rounded-md px-3 py-2 text-[13px] bg-surface cursor-pointer hover:bg-canvas">
                  <span className="px-2 py-0.5 rounded border border-border text-[12px] text-ink-muted bg-canvas">
                    Choose File
                  </span>
                  <span className="text-ink-faint text-[12px] truncate">
                    {formFile ? formFile.name : "No file chosen"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) => setFormFile(e.target.files?.[0] || null)}
                  />
                </label>
                <p className="text-[11px] text-ink-faint mt-1">Upload PDF / Image</p>
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
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}