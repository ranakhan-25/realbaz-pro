"use client";

import React, { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronsUpDown,
  X,
  Copy,
  FileSpreadsheet,
  FileText,
  FileCode,
  ArrowRightToLine,
} from "lucide-react";

// API Integration এর জন্য টাইপ ডিফাইন করা হয়েছে
export interface ChartOfAccountItem {
  id: number;
  code: string;
  name: string;
  openingBalance: number;
  under: string;
  hasDelete?: boolean;
}

// Add Form Data Type
export interface AddAccountFormData {
  code: string;
  name: string;
  openingBalance: string;
  under: string;
}

// ইমেজের ডাটা অনুযায়ী প্রাথমিক স্টেট
const initialAccountsData: ChartOfAccountItem[] = [
  {
    id: 1,
    code: "SUP2733131",
    name: "Riva Steel Mils",
    openingBalance: 0,
    under: "Sundry Creditors",
  },
  {
    id: 2,
    code: "SUP8286898",
    name: "Rifat Thai House",
    openingBalance: 0,
    under: "Sundry Creditors",
  },
  {
    id: 3,
    code: "500-022-015",
    name: "Others Consumption",
    openingBalance: 0,
    under: "Cost of Goods Sold (COGS)",
    hasDelete: true,
  },
  {
    id: 4,
    code: "100-001-004-015",
    name: "Others Inventory",
    openingBalance: 0,
    under: "Closing Stock",
  },
  {
    id: 5,
    code: "500-022-014",
    name: "Sanitary Work Consumption",
    openingBalance: 0,
    under: "Cost of Goods Sold (COGS)",
    hasDelete: true,
  },
  {
    id: 6,
    code: "100-001-004-014",
    name: "Sanitary Work Inventory",
    openingBalance: 0,
    under: "Closing Stock",
  },
  {
    id: 7,
    code: "500-022-013",
    name: "Thai Consumption",
    openingBalance: 0,
    under: "Cost of Goods Sold (COGS)",
    hasDelete: true,
  },
  {
    id: 8,
    code: "100-001-004-013",
    name: "Thai Inventory",
    openingBalance: 0,
    under: "Closing Stock",
  },
  {
    id: 9,
    code: "500-022-012",
    name: "Marble Consumption",
    openingBalance: 0,
    under: "Cost of Goods Sold (COGS)",
    hasDelete: true,
  },
  {
    id: 10,
    code: "100-001-004-012",
    name: "Marble Inventory",
    openingBalance: 0,
    under: "Closing Stock",
    hasDelete: true,
  },
  {
    id: 11,
    code: "500-022-011",
    name: "Tiles Consumption",
    openingBalance: 0,
    under: "Cost of Goods Sold (COGS)",
    hasDelete: true,
  },
  {
    id: 12,
    code: "100-001-004-011",
    name: "Tiles Inventory",
    openingBalance: 0,
    under: "Closing Stock",
    hasDelete: true,
  },
];

export default function ChartOfAccountsPage() {
  const [accountsData, setAccountsData] =
    useState<ChartOfAccountItem[]>(initialAccountsData);
  const [groupFilter, setGroupFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(20);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<AddAccountFormData>({
    code: "",
    name: "",
    openingBalance: "0",
    under: "",
  });

  // Handle Input Change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Handler for Modal
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting New Chart of Account:", formData);

    const newItem: ChartOfAccountItem = {
      id: accountsData.length + 1,
      code: formData.code,
      name: formData.name,
      openingBalance: Number(formData.openingBalance) || 0,
      under: formData.under,
      hasDelete: true,
    };

    setAccountsData((prev) => [...prev, newItem]);
    setIsAddModalOpen(false);
    setFormData({ code: "", name: "", openingBalance: "0", under: "" });
  };

  const handleEdit = (item: ChartOfAccountItem) => {
    console.log("Edit account:", item);
  };

  const handleDelete = (id: number) => {
    console.log("Delete account id:", id);
    setAccountsData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="h-full w-full bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-slate-100 p-3 flex flex-col overflow-hidden font-sans select-none">
      {/* Breadcrumb & Top Right Action Buttons */}
      <div className="flex flex-row items-center justify-between gap-2 mb-2 shrink-0">
        <nav className="text-xs md:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
          <span className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
            Home
          </span>
          <span>&gt;</span>
          <span className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-0.5">
            Accounts Module <ChevronDown className="w-3.5 h-3.5" />
          </span>
          <span>&gt;</span>
          <span className="text-slate-400 dark:text-slate-500 font-normal">
            Chart of Accounts
          </span>
        </nav>

        {/* Top Right Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Chart of Account
          </button>

          <button
            className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Export / Action"
          >
            <ArrowRightToLine className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart Of Group (Under) Select Dropdown Filter */}
      <div className="mb-2 shrink-0">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Chart Of Group(Under)
        </label>
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="w-full sm:w-64 px-3 py-1.5 text-xs md:text-sm bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
        >
          <option value="">Select value</option>
          <option value="Sundry Creditors">Sundry Creditors</option>
          <option value="Cost of Goods Sold (COGS)">
            Cost of Goods Sold (COGS)
          </option>
          <option value="Closing Stock">Closing Stock</option>
        </select>
      </div>

      {/* Main Table Container */}
      <div className="flex-1 min-h-0 bg-white dark:bg-[#0b0f19] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800/80 p-3 flex flex-col overflow-hidden">
        {/* Controls Bar: Export Buttons, Show Entries, Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-2.5 shrink-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Copy Button */}
            <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded bg-cyan-500 hover:bg-cyan-600 text-white transition-colors cursor-pointer">
              <Copy className="w-3 h-3" />
              Copy
            </button>

            {/* CSV Button */}
            <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded bg-orange-500 hover:bg-orange-600 text-white transition-colors cursor-pointer">
              <FileCode className="w-3 h-3" />
              CSV
            </button>

            {/* Excel Button */}
            <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer">
              <FileSpreadsheet className="w-3 h-3" />
              Excel
            </button>

            {/* PDF Button */}
            <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer">
              <FileText className="w-3 h-3" />
              PDF
            </button>

            {/* Entries Dropdown */}
            <div className="flex items-center gap-1 text-xs md:text-sm text-slate-600 dark:text-slate-400 ml-2">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">
            <span>Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-48 px-2.5 py-1 text-xs md:text-sm bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Scrollable Table View */}
        <div className="flex-1 min-h-0 overflow-auto border border-slate-200 dark:border-slate-800/80 rounded-lg">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead className="sticky top-0 z-10 bg-indigo-600 dark:bg-indigo-700 text-white font-semibold uppercase tracking-wider text-[11px] md:text-xs">
              <tr>
                <th className="px-3 py-2 border-r border-indigo-400/30 w-12">
                  <div className="flex items-center justify-between">
                    <span>ID</span>
                    <ChevronsUpDown className="w-3 h-3 opacity-70" />
                  </div>
                </th>
                <th className="px-3 py-2 border-r border-indigo-400/30">
                  <div className="flex items-center justify-between">
                    <span>CODE</span>
                    <ChevronsUpDown className="w-3 h-3 opacity-70" />
                  </div>
                </th>
                <th className="px-3 py-2 border-r border-indigo-400/30">
                  <div className="flex items-center justify-between">
                    <span>NAME</span>
                    <ChevronsUpDown className="w-3 h-3 opacity-70" />
                  </div>
                </th>
                <th className="px-3 py-2 border-r border-indigo-400/30">
                  <div className="flex items-center justify-between">
                    <span>OPENING BALANCE</span>
                    <ChevronsUpDown className="w-3 h-3 opacity-70" />
                  </div>
                </th>
                <th className="px-3 py-2 border-r border-indigo-400/30">
                  <div className="flex items-center justify-between">
                    <span>UNDER</span>
                    <ChevronsUpDown className="w-3 h-3 opacity-70" />
                  </div>
                </th>
                <th className="px-3 py-2 w-24">
                  <div className="flex items-center justify-between">
                    <span>ACTION</span>
                    <ChevronsUpDown className="w-3 h-3 opacity-70" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 bg-white dark:bg-[#0b0f19]">
              {accountsData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors odd:bg-slate-50/30 dark:odd:bg-[#060911]"
                >
                  <td className="px-3 py-1.5 text-slate-600 dark:text-slate-400 font-medium border-r border-slate-100 dark:border-slate-800/60">
                    {item.id}
                  </td>
                  <td className="px-3 py-1.5 font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap border-r border-slate-100 dark:border-slate-800/60">
                    {item.code}
                  </td>
                  <td className="px-3 py-1.5 text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer border-r border-slate-100 dark:border-slate-800/60">
                    {item.name}
                  </td>
                  <td className="px-3 py-1.5 text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/60">
                    {item.openingBalance}
                  </td>
                  <td className="px-3 py-1.5 text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer border-r border-slate-100 dark:border-slate-800/60">
                    {item.under}
                  </td>

                  {/* Action Icons Column */}
                  <td className="px-3 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1 rounded bg-cyan-500 hover:bg-cyan-600 text-white transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {item.hasDelete && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 rounded bg-rose-500 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-1 mt-1 shrink-0">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>

      {/* Modal: Add New Chart of Account */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-hidden">
          <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Add New Chart of Account
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-[#030712] hover:bg-rose-500 hover:text-white text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleAddSubmit}
              className="p-5 space-y-3.5 text-xs md:text-sm"
            >
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  required
                  placeholder="Enter Code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Opening Balance
                </label>
                <input
                  type="number"
                  name="openingBalance"
                  placeholder="0"
                  value={formData.openingBalance}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Chart Of Group (Under){" "}
                  <span className="text-rose-500">*</span>
                </label>
                <select
                  name="under"
                  required
                  value={formData.under}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                >
                  <option value="">Select Group</option>
                  <option value="Sundry Creditors">Sundry Creditors</option>
                  <option value="Cost of Goods Sold (COGS)">
                    Cost of Goods Sold (COGS)
                  </option>
                  <option value="Closing Stock">Closing Stock</option>
                  <option value="Direct Expense">Direct Expense</option>
                  <option value="Current Liabilities">
                    Current Liabilities
                  </option>
                </select>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs md:text-sm font-medium rounded-md bg-slate-200 dark:bg-[#030712] hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent dark:border-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs md:text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
