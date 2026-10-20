"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, X, ArrowUpDown } from "lucide-react";

export interface ReconciliationItem {
  id: string;
  sl: number;
  voucherNo: string;
  description: string;
  bank: string;
  date: string;
  chequeDate: string;
  amount: number;
  note: string;
  status: string;
}

export default function BankReconciliationPage() {
  // Filter States
  const [selectDate, setSelectDate] = useState(
    "1 September, 2026 - 30 September, 2026",
  );
  const [chartOfAccount, setChartOfAccount] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample Data (API Ready)
  const [items, setItems] = useState<ReconciliationItem[]>([
    {
      id: "1",
      sl: 1,
      voucherNo: "R00013",
      description: "Sagor kumar",
      bank: "Cash",
      date: "03 Sept 2026",
      chequeDate: "03 Sept 2026",
      amount: 122320.0,
      note: "Booking Money-Booking-693614",
      status: "Pending",
    },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReconciliationItem | null>(
    null,
  );
  const [modalBankName, setModalBankName] = useState("");
  const [modalStatus, setModalStatus] = useState("Hold");
  const [modalDate, setModalDate] = useState("2026-03-09");

  // Open Modal Handler for Honour / Dishonour
  const handleOpenModal = (item: ReconciliationItem, defaultStatus: string) => {
    setSelectedItem(item);
    setModalBankName(item.bank);
    setModalStatus(defaultStatus);
    setIsModalOpen(true);
  };

  // Submit Modal Data (Simulate API Update)
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    // API Payload structure ready
    const updatePayload = {
      voucherNo: selectedItem.voucherNo,
      bankName: modalBankName,
      status: modalStatus,
      date: modalDate,
    };

    console.log("Status Update API Payload:", updatePayload);

    // Update Local State
    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedItem.id
          ? { ...i, bank: modalBankName, status: modalStatus }
          : i,
      ),
    );

    setIsModalOpen(false);
  };

  // Filter items based on search query
  const filteredItems = items.filter(
    (item) =>
      item.voucherNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bank.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 p-3 text-xs flex flex-col justify-between">
      <div>
        {/* Navigation Breadcrumb */}
        <nav className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium mb-3">
          <Link
            href="/"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer">
            Accounts Module <ChevronDown className="w-3 h-3" />
          </span>
          <span>&gt;</span>
          <span className="text-slate-400 font-normal truncate">
            Bank Reconciliation
          </span>
        </nav>

        {/* Top Filter Bar */}
        <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-3 mb-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Select Date
              </label>
              <input
                type="text"
                value={selectDate}
                onChange={(e) => setSelectDate(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Chart Of Account
              </label>
              <select
                value={chartOfAccount}
                onChange={(e) => setChartOfAccount(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
              >
                <option value="">Select value</option>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank Account</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
              >
                <option value="">Select One Option</option>
                <option value="Deposit">Deposit</option>
                <option value="Withdrawal">Withdrawal</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                className="w-full sm:w-auto px-5 py-1.5 bg-[#EF5350] hover:bg-red-600 text-white font-semibold rounded transition-colors shadow-xs cursor-pointer"
              >
                Report
              </button>
            </div>
          </div>
        </div>

        {/* Table Controls */}
        <div className="bg-white dark:bg-slate-900 rounded-t border border-b-0 border-slate-200 dark:border-slate-800 p-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-0.5 outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 dark:text-slate-400">Search:</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-0.5 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <table className="w-full table-fixed text-left border-collapse text-xs">
            <thead className="bg-[#635BFF] text-white font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="w-[5%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    SL <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[12%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    VOUCHER NO{" "}
                    <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[15%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    DESCRIPTION{" "}
                    <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[10%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    BANK <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[12%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    DATE <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[12%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    CHEQUE DATE{" "}
                    <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[12%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    AMOUNT <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[20%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    NOTE <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[16%] px-2 py-2 text-center">
                  <div className="flex items-center justify-center">STATUS</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-2 py-2.5 text-slate-800 dark:text-slate-100">
                      {item.sl}
                    </td>
                    <td className="px-2 py-2.5 text-indigo-600 dark:text-indigo-400 font-medium truncate">
                      {item.voucherNo}
                    </td>
                    <td className="px-2 py-2.5 text-indigo-500 dark:text-indigo-400 truncate">
                      {item.description}
                    </td>
                    <td className="px-2 py-2.5 text-indigo-500 dark:text-indigo-400 truncate">
                      {item.bank}
                    </td>
                    <td className="px-2 py-2.5 text-slate-700 dark:text-slate-300 truncate">
                      {item.date}
                    </td>
                    <td className="px-2 py-2.5 text-slate-700 dark:text-slate-300 truncate">
                      {item.chequeDate}
                    </td>
                    <td className="px-2 py-2.5 text-slate-800 dark:text-slate-100 font-medium truncate">
                      {item.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-2 py-2.5 text-slate-600 dark:text-slate-400 truncate">
                      {item.note}
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Honour Button (Opens Modal) */}
                        <button
                          type="button"
                          onClick={() => handleOpenModal(item, "Honour")}
                          className="px-2.5 py-1 rounded bg-[#635BFF] hover:bg-indigo-700 text-white font-bold italic text-[11px] transition-colors cursor-pointer shadow-xs"
                        >
                          Honour
                        </button>

                        {/* DisHonour Button (Opens Modal) */}
                        <button
                          type="button"
                          onClick={() => handleOpenModal(item, "DisHonour")}
                          className="px-2.5 py-1 rounded bg-[#EF5350] hover:bg-red-600 text-white font-bold italic text-[11px] transition-colors cursor-pointer shadow-xs"
                        >
                          DisHonour
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-3 py-4 text-center text-slate-400 italic"
                  >
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="bg-white dark:bg-slate-900 rounded-b border border-t-0 border-slate-200 dark:border-slate-800 p-2.5 flex items-center justify-between text-slate-500 dark:text-slate-400 mb-4">
          <div>
            Showing 1 to {filteredItems.length} of {filteredItems.length}{" "}
            entries
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-[#635BFF] text-white font-medium"
            >
              1
            </button>
            <button
              type="button"
              disabled
              className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* STATUS UPDATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-md shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-medium text-slate-800 dark:text-slate-100 text-xs">
                Status Update
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-0.5 border border-slate-400 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleModalSubmit}
              className="p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/30"
            >
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={modalBankName}
                  onChange={(e) => setModalBankName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Status
                </label>
                <input
                  type="text"
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={modalDate}
                  onChange={(e) => setModalDate(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-1.5 rounded bg-slate-400 hover:bg-slate-500 text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-[#635BFF] hover:bg-indigo-700 text-white font-medium text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Footer */}
      <footer className="flex items-center justify-between text-[9px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>
    </div>
  );
}
