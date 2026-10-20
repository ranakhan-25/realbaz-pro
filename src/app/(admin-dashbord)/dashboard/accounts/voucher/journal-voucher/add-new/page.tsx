"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  X,
  ChevronDown,
  Trash2,
  CheckCircle2,
} from "lucide-react";

// Types
export interface TableRowItem {
  id: string;
  accountName: string;
  debit: number;
  credit: number;
  chqReceipt: string;
  note: string;
}

export interface ChartOfAccountOption {
  id: string;
  code: string;
  name: string;
  group: string;
}

export default function JournalVoucherCreatePage() {
  // --- Form Header State ---
  const [headerState, setHeaderState] = useState({
    voucherNo: "P00005",
    date: "2026-09-13",
    projectType: "",
    titleOfWork: "",
    project: "",
    site: "",
    task: "",
  });

  // --- Chart of Accounts Options (Dynamic State) ---
  const [accountOptions, setAccountOptions] = useState<ChartOfAccountOption[]>([
    { id: "1", code: "1001", name: "Cash in Hand", group: "Assets" },
    { id: "2", code: "1002", name: "Bank Account", group: "Assets" },
    { id: "3", code: "2001", name: "Others Inventory", group: "Expenses" },
    { id: "4", code: "2002", name: "Sanitary Work Inventory", group: "Expenses" },
    { id: "5", code: "3001", name: "Riva Steel Mils", group: "Liabilities" },
  ]);

  // --- Item Entry Input State ---
  const [entryType, setEntryType] = useState<"DEBIT" | "CREDIT">("DEBIT");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [amountInput, setAmountInput] = useState<string>("");
  const [chqReceiptInput, setChqReceiptInput] = useState<string>("");
  const [noteInput, setNoteInput] = useState<string>("");

  // --- Dynamic Table Rows State ---
  const [rows, setRows] = useState<TableRowItem[]>([]);

  // --- Bottom Section State ---
  const [comment, setComment] = useState<string>("");
  const [attachment, setAttachment] = useState<File | null>(null);

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState({
    group: "",
    code: "",
    name: "",
    status: "",
  });

  // Dynamic Calculated Totals
  const totalDebit = rows.reduce((sum, r) => sum + r.debit, 0);
  const totalCredit = rows.reduce((sum, r) => sum + r.credit, 0);

  // Add Item to Table Handler
  const handleAddRow = () => {
    if (!selectedAccountId) {
      alert("Please select a Chart of Account!");
      return;
    }
    const numericAmount = parseFloat(amountInput);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    const selectedAcc = accountOptions.find((a) => a.id === selectedAccountId);
    const newRow: TableRowItem = {
      id: Date.now().toString(),
      accountName: selectedAcc ? `${selectedAcc.name} (${selectedAcc.code})` : "Account",
      debit: entryType === "DEBIT" ? numericAmount : 0,
      credit: entryType === "CREDIT" ? numericAmount : 0,
      chqReceipt: chqReceiptInput || "—",
      note: noteInput || "—",
    };

    setRows((prev) => [...prev, newRow]);

    // Reset Entry Fields
    setSelectedAccountId("");
    setAmountInput("");
    setChqReceiptInput("");
    setNoteInput("");
  };

  // Delete Row Handler
  const handleDeleteRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Modal Submit (Add New Chart of Account)
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalData.name || !modalData.code) {
      alert("Please fill in the account code and name.");
      return;
    }

    const newOption: ChartOfAccountOption = {
      id: Date.now().toString(),
      code: modalData.code,
      name: modalData.name,
      group: modalData.group || "General",
    };

    setAccountOptions((prev) => [...prev, newOption]);
    setSelectedAccountId(newOption.id); // Auto-select created account
    setIsModalOpen(false);
    setModalData({ group: "", code: "", name: "", status: "" });
  };

  // Main Voucher Submit Handler (API Payload Ready)
  const handleMainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rows.length === 0) {
      alert("Please add at least one account entry to the table!");
      return;
    }

    const payload = {
      header: headerState,
      items: rows,
      totalDebit,
      totalCredit,
      comment,
      attachmentName: attachment ? attachment.name : null,
    };

    console.log("Submit Voucher Payload (Ready for API):", payload);
    alert(`Journal Voucher ${headerState.voucherNo} created successfully! Check console log for API payload.`);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 p-2.5 text-xs flex flex-col justify-between">
      {/* Top Header Navigation */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2 w-full">
          <nav className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium truncate">
            <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Home
            </Link>
            <span>&gt;</span>
            <span className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer">
              Accounts Module <ChevronDown className="w-3 h-3" />
            </span>
            <span>&gt;</span>
            <span className="text-slate-400 font-normal truncate">Journal Voucher</span>
          </nav>

          <Link
            href="/accounts/journal-voucher"
            className="flex items-center gap-1 px-3 py-1 text-[11px] font-semibold rounded bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to previous
          </Link>
        </div>

        {/* Header Inputs Section */}
        <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-3 mb-2 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            {/* Left Column */}
            <div className="space-y-2">
              <div className="flex items-center">
                <label className="w-32 text-right pr-3 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  Voucher No
                </label>
                <input
                  type="text"
                  readOnly
                  value={headerState.voucherNo}
                  className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1 text-slate-700 dark:text-slate-200 outline-none"
                />
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right pr-3 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  Date
                </label>
                <input
                  type="text"
                  value={headerState.date}
                  onChange={(e) => setHeaderState({ ...headerState, date: e.target.value })}
                  className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right pr-3 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  Project Type
                </label>
                <select
                  value={headerState.projectType}
                  onChange={(e) => setHeaderState({ ...headerState, projectType: e.target.value })}
                  className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="">Select Project Type</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Residential">Residential</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right pr-3 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  Title/Name of Work
                </label>
                <select
                  value={headerState.titleOfWork}
                  onChange={(e) => setHeaderState({ ...headerState, titleOfWork: e.target.value })}
                  className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="">Select Title/Name of Work</option>
                  <option value="Civil Work">Civil Work</option>
                  <option value="Electrical Work">Electrical Work</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2">
              <div className="flex items-center">
                <label className="w-24 text-right pr-3 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  Project
                </label>
                <select
                  value={headerState.project}
                  onChange={(e) => setHeaderState({ ...headerState, project: e.target.value })}
                  className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="">Select Project</option>
                  <option value="Tower A">Tower A</option>
                  <option value="Plaza B">Plaza B</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="w-24 text-right pr-3 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  Site
                </label>
                <select
                  value={headerState.site}
                  onChange={(e) => setHeaderState({ ...headerState, site: e.target.value })}
                  className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="">Select Site</option>
                  <option value="Dhaka Site">Dhaka Site</option>
                  <option value="Chittagong Site">Chittagong Site</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="w-24 text-right pr-3 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  If Task
                </label>
                <select
                  value={headerState.task}
                  onChange={(e) => setHeaderState({ ...headerState, task: e.target.value })}
                  className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="">Select Task</option>
                  <option value="Foundation">Foundation</option>
                  <option value="Finishing">Finishing</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Entry Creator Bar */}
        <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-2.5 mb-3 shadow-xs">
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
            <select
              value={entryType}
              onChange={(e) => setEntryType(e.target.value as "DEBIT" | "CREDIT")}
              className="w-full md:w-44 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 font-medium"
            >
              <option value="DEBIT">Debit</option>
              <option value="CREDIT">Credit</option>
            </select>

            {/* Account Selector + Modal Trigger Plus Button */}
            <div className="flex-1 flex items-center gap-1 min-w-[220px]">
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
              >
                <option value="">Select Chart Of Account</option>
                {accountOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name} ({opt.code})
                  </option>
                ))}
              </select>

              {/* PLUS BUTTON TRIGGER FOR MODAL */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="p-1.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white shrink-0 transition-colors cursor-pointer"
                title="Add New Chart of Account"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <input
              type="number"
              placeholder="Amount"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="w-full md:w-36 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
            />

            <input
              type="text"
              placeholder="Chq/Receipt No"
              value={chqReceiptInput}
              onChange={(e) => setChqReceiptInput(e.target.value)}
              className="w-full md:w-36 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
            />

            <input
              type="text"
              placeholder="Note"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full md:w-44 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
            />

            <button
              type="button"
              onClick={handleAddRow}
              className="w-full md:w-auto px-5 py-1.5 bg-[#635BFF] hover:bg-indigo-700 text-white font-semibold rounded transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              Add
            </button>
          </div>
        </div>

        {/* Dynamic Entry Table */}
        <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 overflow-hidden mb-3 shadow-xs">
          <table className="w-full table-fixed text-left border-collapse text-xs">
            <thead className="bg-[#635BFF] text-white font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="w-[30%] px-3 py-2">ACCOUNTS</th>
                <th className="w-[14%] px-3 py-2">DEBIT</th>
                <th className="w-[14%] px-3 py-2">CREDIT</th>
                <th className="w-[18%] px-3 py-2">CHQ/RECEIPT</th>
                <th className="w-[18%] px-3 py-2">NOTE</th>
                <th className="w-[6%] px-2 py-2 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {rows.length > 0 ? (
                rows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-100 truncate">
                      {r.accountName}
                    </td>
                    <td className="px-3 py-2 font-medium text-emerald-600 dark:text-emerald-400 truncate">
                      {r.debit > 0 ? r.debit.toFixed(2) : "0.00"}
                    </td>
                    <td className="px-3 py-2 font-medium text-indigo-600 dark:text-indigo-400 truncate">
                      {r.credit > 0 ? r.credit.toFixed(2) : "0.00"}
                    </td>
                    <td className="px-3 py-2 text-slate-500 dark:text-slate-400 truncate">
                      {r.chqReceipt}
                    </td>
                    <td className="px-3 py-2 text-slate-500 dark:text-slate-400 truncate">
                      {r.note}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(r.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                        title="Delete Row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center text-slate-400 italic">
                    No account entries added yet. Use the inputs above to add entries.
                  </td>
                </tr>
              )}
            </tbody>
            {/* Table Summary Footer */}
            <tfoot className="bg-slate-50 dark:bg-slate-950 font-bold border-t border-slate-200 dark:border-slate-800 text-xs">
              <tr>
                <td className="px-3 py-2 text-right">TOTAL:</td>
                <td className="px-3 py-2 text-emerald-600 dark:text-emerald-400">
                  {totalDebit.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-indigo-600 dark:text-indigo-400">
                  {totalCredit.toFixed(2)}
                </td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Comment & Attachment Section */}
        <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-3 mb-3 shadow-xs">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            {/* Comment */}
            <div className="flex items-start gap-3 w-full md:w-1/2">
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 pt-1 shrink-0">
                Comment
              </label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter comments..."
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded p-2 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 resize-none text-xs"
              />
            </div>

            {/* Attachment */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 shrink-0">
                Attachment
              </label>
              <input
                type="file"
                onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
                className="block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 dark:file:bg-slate-800 dark:file:text-slate-300 hover:file:bg-slate-300 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Center Submit Button */}
        <div className="flex justify-center mb-4">
          <button
            type="button"
            onClick={handleMainSubmit}
            className="px-8 py-2 bg-[#635BFF] hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition-colors cursor-pointer text-sm"
          >
            Submit
          </button>
        </div>
      </div>

      {/* CHART OF ACCOUNT ADD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-medium text-slate-800 dark:text-slate-100 text-xs">
                Chart Of Account Add
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleModalSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Chart of Group
                </label>
                <select
                  value={modalData.group}
                  onChange={(e) => setModalData({ ...modalData, group: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="">Select value</option>
                  <option value="Assets">Assets</option>
                  <option value="Liabilities">Liabilities</option>
                  <option value="Expenses">Expenses</option>
                  <option value="Income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Chart of Accounts Code
                </label>
                <input
                  type="text"
                  placeholder="Chart of Accounts Code"
                  value={modalData.code}
                  onChange={(e) => setModalData({ ...modalData, code: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Chart of Accounts Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Chart of Accounts Name"
                  value={modalData.name}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Set Accounts Default Module
                </label>
                <select
                  value={modalData.status}
                  onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 rounded bg-slate-400 hover:bg-slate-500 text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="flex items-center justify-between text-[9px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800 mt-auto">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>
    </div>
  );
}