"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Plus, Trash2, X, ArrowUpDown, FileText, Copy } from "lucide-react";

export interface ChequeRangeItem {
  id: number;
  cashBank: string;
  name: string;
  fromNumber: number;
  toNumber: number;
  numberOfCheque: number;
  addedBy: string;
}

export default function ChequeRangePage() {
  // Main Data State (API ready)
  const [items, setItems] = useState<ChequeRangeItem[]>([
    { id: 1, cashBank: "-", name: "Mohin", fromNumber: 4, toNumber: 6, numberOfCheque: 3, addedBy: "Admin" },
    { id: 2, cashBank: "-", name: "Mohin", fromNumber: 2, toNumber: 5, numberOfCheque: 4, addedBy: "Admin" },
    { id: 3, cashBank: "-", name: "11201", fromNumber: 11201, toNumber: 11300, numberOfCheque: 100, addedBy: "Admin" },
    { id: 4, cashBank: "-", name: "101-110", fromNumber: 101, toNumber: 110, numberOfCheque: 10, addedBy: "Admin" },
    { id: 5, cashBank: "-", name: "200-220", fromNumber: 200, toNumber: 220, numberOfCheque: 21, addedBy: "Admin" },
    { id: 6, cashBank: "-", name: "Trust bank check book q", fromNumber: 911, toNumber: 920, numberOfCheque: 10, addedBy: "Admin" },
  ]);

  // Table Filter & Search States
  const [cashBankFilter, setCashBankFilter] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalChartOfAccount, setModalChartOfAccount] = useState("");
  const [modalName, setModalName] = useState("");
  const [modalFromNumber, setModalFromNumber] = useState("");
  const [modalToNumber, setModalToNumber] = useState("");

  // Add Item Submit Handler (Simulate API Call)
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fromNum = parseInt(modalFromNumber, 10) || 0;
    const toNum = parseInt(modalToNumber, 10) || 0;
    const chequeCount = Math.max(0, toNum - fromNum + 1);

    const payload = {
      cashBank: modalChartOfAccount || "-",
      name: modalName,
      fromNumber: fromNum,
      toNumber: toNum,
      numberOfCheque: chequeCount,
      addedBy: "Admin",
    };

    console.log("Create Cheque Range API Payload:", payload);

    // Update local state
    setItems((prev) => [...prev, { id: prev.length + 1, ...payload }]);

    // Reset Form & Close Modal
    setModalChartOfAccount("");
    setModalName("");
    setModalFromNumber("");
    setModalToNumber("");
    setIsModalOpen(false);
  };

  // Delete Item Handler (Simulate API Delete)
  const handleDeleteItem = (id: number) => {
    console.log("Delete API Request for ID:", id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Search Filtered Data
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.addedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cashBank.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 p-3 text-xs flex flex-col justify-between">
      <div>
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <nav className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Home
            </Link>
            <span>&gt;</span>
            <span className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer">
              Accounts Module <ChevronDown className="w-3 h-3" />
            </span>
            <span>&gt;</span>
            <span className="text-slate-400 font-normal truncate">List of Cheque Range</span>
          </nav>

          {/* Add Button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#635BFF] hover:bg-indigo-700 text-white font-medium rounded transition-colors shadow-xs cursor-pointer text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Cheque Range
          </button>
        </div>

        {/* Cash/Bank Filter */}
        <div className="mb-4 max-w-xs">
          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
            Cash/Bank
          </label>
          <select
            value={cashBankFilter}
            onChange={(e) => setCashBankFilter(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
          >
            <option value="">Select value</option>
            <option value="Cash">Cash Account</option>
            <option value="Bank">Bank Account</option>
          </select>
        </div>

        {/* Export & Table Controls */}
        <div className="bg-white dark:bg-slate-900 rounded-t border border-b-0 border-slate-200 dark:border-slate-800 p-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <button
              type="button"
              className="flex items-center gap-1 px-2.5 py-1 bg-[#00A3C4] hover:bg-cyan-700 text-white rounded font-medium text-xs transition-colors cursor-pointer"
            >
              <Copy className="w-3 h-3" /> Copy
            </button>

            {/* CSV Button */}
            <button
              type="button"
              className="flex items-center gap-1 px-2.5 py-1 bg-[#E65100] hover:bg-orange-700 text-white rounded font-medium text-xs transition-colors cursor-pointer"
            >
              <FileText className="w-3 h-3" /> CSV
            </button>

            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 ml-2">
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
                <th className="w-[6%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    ID <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[14%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    CASH/BANK <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[20%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    NAME <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[14%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    FROM NUMBER <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[14%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    TO NUMBER <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[14%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    NUMBER OF CHEQUE <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[10%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    ADDED BY <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[8%] px-2 py-2 text-center">
                  <div className="flex items-center justify-center">ACTION</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-2 py-2 text-slate-800 dark:text-slate-100">{item.id}</td>
                    <td className="px-2 py-2 text-indigo-600 dark:text-indigo-400 font-medium truncate">
                      {item.cashBank}
                    </td>
                    <td className="px-2 py-2 text-slate-700 dark:text-slate-300 truncate">{item.name}</td>
                    <td className="px-2 py-2 text-slate-700 dark:text-slate-300 truncate">{item.fromNumber}</td>
                    <td className="px-2 py-2 text-slate-700 dark:text-slate-300 truncate">{item.toNumber}</td>
                    <td className="px-2 py-2 text-slate-700 dark:text-slate-300 truncate">{item.numberOfCheque}</td>
                    <td className="px-2 py-2 text-slate-700 dark:text-slate-300 truncate">{item.addedBy}</td>
                    <td className="px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 rounded bg-[#EF5350] hover:bg-red-600 text-white transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-3 py-4 text-center text-slate-400 italic">
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
            Showing 1 to {filteredItems.length} of {filteredItems.length} entries
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            >
              Previous
            </button>
            <button type="button" className="px-3 py-1 rounded bg-[#635BFF] text-white font-medium">
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

      {/* CHEQUE OF RANGE ADD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-md shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                Cheque Of Range Add
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 bg-[#EF5350] hover:bg-red-600 rounded text-white cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleModalSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Chart of Account
                  </label>
                  <select
                    value={modalChartOfAccount}
                    onChange={(e) => setModalChartOfAccount(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="">Select value</option>
                    <option value="Cash">Cash Account</option>
                    <option value="Bank">Bank Account</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    From Number
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Number"
                    value={modalFromNumber}
                    onChange={(e) => setModalFromNumber(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    To Number
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Number"
                    value={modalToNumber}
                    onChange={(e) => setModalToNumber(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
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