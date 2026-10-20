"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronsUpDown,
  Network,
  X,
} from "lucide-react";

// API Integration এর জন্য টাইপ ডিফাইন করা হয়েছে
export interface ChartOfGroupItem {
  id: number;
  sl: number;
  code: string;
  name: string;
  reportSection: string;
  under: string;
  chartOfSection: string;
  hasDelete?: boolean;
}

// Add Form Data Type
export interface AddGroupFormData {
  code: string;
  name: string;
  reportSection: string;
  under: string;
  chartOfSection: string;
}

// ইমেজের ডেটা অনুযায়ী প্রাথমিক স্টেট
const initialChartData: ChartOfGroupItem[] = [
  {
    id: 1,
    sl: 1,
    code: "200-001-010",
    name: "Security Deposit Liabilities",
    reportSection: "",
    under: "Current Liabilities",
    chartOfSection: "Liabilites",
  },
  {
    id: 2,
    sl: 2,
    code: "500-001-002",
    name: "Contractor Bill Expense",
    reportSection: "operating_expense",
    under: "Direct Expense",
    chartOfSection: "Expense",
  },
  {
    id: 3,
    sl: 3,
    code: "500-001-003",
    name: "Worker Bill Expanse",
    reportSection: "operating_expense",
    under: "Direct Expense",
    chartOfSection: "Expense",
  },
  {
    id: 4,
    sl: 4,
    code: "200-001-007",
    name: "GRN Bill Liabilities",
    reportSection: "",
    under: "Current Liabilities",
    chartOfSection: "Liabilites",
  },
  {
    id: 5,
    sl: 5,
    code: "500-001-001",
    name: "Admistrative Expences",
    reportSection: "operating_expense",
    under: "Direct Expense",
    chartOfSection: "Expense",
  },
  {
    id: 6,
    sl: 6,
    code: "200-001-005",
    name: "Worker",
    reportSection: "",
    under: "Current Liabilities",
    chartOfSection: "Liabilites",
  },
  {
    id: 7,
    sl: 7,
    code: "200-001-006",
    name: "Received From Other Source",
    reportSection: "",
    under: "Current Liabilities",
    chartOfSection: "Liabilites",
    hasDelete: true,
  },
  {
    id: 8,
    sl: 8,
    code: "100-011",
    name: "Payment To other Side",
    reportSection: "",
    under: "Primary",
    chartOfSection: "Assets",
    hasDelete: true,
  },
  {
    id: 9,
    sl: 9,
    code: "500-022",
    name: "Cost of Goods Sold (COGS)",
    reportSection: "cogs",
    under: "Primary",
    chartOfSection: "Expense",
  },
  {
    id: 10,
    sl: 10,
    code: "100-001-004",
    name: "Closing Stock",
    reportSection: "",
    under: "Current Assets",
    chartOfSection: "Assets",
  },
];

export default function ChartOfGroupPage() {
  const [chartData, setChartData] = useState<ChartOfGroupItem[]>(initialChartData);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<AddGroupFormData>({
    code: "",
    name: "",
    reportSection: "",
    under: "",
    chartOfSection: "",
  });

  // Handle Form Change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add Submit Handler (পরবর্তীতে API Call যুক্ত করা যাবে)
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Add Group Data:", formData);
    
    // API response এর জায়গায় নতুন ডাটা আপডেট লজিক
    const newItem: ChartOfGroupItem = {
      id: chartData.length + 1,
      sl: chartData.length + 1,
      code: formData.code,
      name: formData.name,
      reportSection: formData.reportSection,
      under: formData.under,
      chartOfSection: formData.chartOfSection,
    };
    
    setChartData((prev) => [...prev, newItem]);
    setIsAddModalOpen(false);
    setFormData({ code: "", name: "", reportSection: "", under: "", chartOfSection: "" });
  };

  const handleEdit = (item: ChartOfGroupItem) => {
    console.log("Edit item:", item);
  };

  const handleDelete = (id: number) => {
    console.log("Delete id:", id);
    setChartData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    // ডার্ক মোডের জন্য আরও ডিপ ব্ল্যাক ব্যাকগ্রাউন্ড (dark:bg-[#030712])
    <div className="h-full w-full bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-slate-100 p-3 flex flex-col overflow-hidden font-sans select-none">
      
      {/* Navigation Breadcrumb & Action Header */}
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
            Chart Of Group
          </span>
        </nav>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Group Hierarchy Button -> Link Component */}
          <Link
            href="/dashboard/accounts/group-hierarchy" // আপনার পছন্দের Route দেওয়া যাবে
            className="flex items-center gap-1 px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Network className="w-4 h-4" />
            Group Hierarchy
          </Link>

          {/* Chart of Group Add Button -> Opens Modal */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Chart of Group Add
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 min-h-0 bg-white dark:bg-[#0b0f19] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800/80 p-3 flex flex-col overflow-hidden">
        
        {/* Show Entries & Search Controls */}
        <div className="flex items-center justify-between gap-2 mb-2.5 shrink-0">
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 dark:text-slate-400">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-slate-800 rounded-md px-2 py-1 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">
            <span>Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-44 sm:w-56 px-2.5 py-1 text-xs md:text-sm bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Scrollable Table View */}
        <div className="flex-1 min-h-0 overflow-auto border border-slate-200 dark:border-slate-800/80 rounded-lg">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead className="sticky top-0 z-10 bg-indigo-600 dark:bg-indigo-700 text-white font-semibold uppercase tracking-wider text-[11px] md:text-xs">
              <tr>
                <th className="px-3 py-2.5 border-r border-indigo-400/30 w-12">
                  <div className="flex items-center justify-between">
                    <span>SL</span>
                    <ChevronsUpDown className="w-3 h-3 opacity-70" />
                  </div>
                </th>
                <th className="px-3 py-2.5 border-r border-indigo-400/30">
                  <div className="flex items-center justify-between">
                    <span>CODE</span>
                    <ChevronsUpDown className="w-3 h-3 opacity-70" />
                  </div>
                </th>
                <th className="px-3 py-2.5 border-r border-indigo-400/30">
                  <div className="flex items-center justify-between">
                    <span>NAME</span>
                    <ChevronsUpDown className="w-3 h-3 opacity-70" />
                  </div>
                </th>
                <th className="px-3 py-2.5 border-r border-indigo-400/30">
                  <div className="flex items-center justify-between">
                    <span>REPORT SECTION</span>
                    <ChevronsUpDown className="w-3 h-3 opacity-70" />
                  </div>
                </th>
                <th className="px-3 py-2.5 border-r border-indigo-400/30">
                  <div className="flex items-center justify-between">
                    <span>UNDER</span>
                    <ChevronsUpDown className="w-3 h-3 opacity-70" />
                  </div>
                </th>
                <th className="px-3 py-2.5 border-r border-indigo-400/30">
                  <div className="flex items-center justify-between">
                    <span>CHART OF SECTION</span>
                    <ChevronsUpDown className="w-3 h-3 opacity-70" />
                  </div>
                </th>
                <th className="px-3 py-2.5 w-24">
                  <div className="flex items-center justify-between">
                    <span>ACTION</span>
                    <ChevronsUpDown className="w-3 h-3 opacity-70" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 bg-white dark:bg-[#0b0f19]">
              {chartData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors odd:bg-slate-50/30 dark:odd:bg-[#060911]"
                >
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400 font-medium border-r border-slate-100 dark:border-slate-800/60">
                    {item.sl}
                  </td>
                  <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap border-r border-slate-100 dark:border-slate-800/60">
                    {item.code}
                  </td>
                  <td className="px-3 py-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer border-r border-slate-100 dark:border-slate-800/60">
                    {item.name}
                  </td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/60">
                    {item.reportSection}
                  </td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/60">
                    {item.under}
                  </td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/60">
                    {item.chartOfSection}
                  </td>
                  
                  {/* Action Icons Column */}
                  <td className="px-3 py-2">
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

        {/* Pagination Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 shrink-0">
          <div>
            Showing <span className="font-semibold text-slate-700 dark:text-slate-200">1</span> to{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">10</span> of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">30</span> entries
          </div>
          
          <div className="flex items-center gap-1">
            <button
              className="px-3 py-1 rounded-md bg-slate-100 dark:bg-[#030712] text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800 disabled:opacity-50 transition-colors"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button className="px-3 py-1 rounded-md bg-indigo-600 text-white font-medium">
              1
            </button>
            <button className="px-3 py-1 rounded-md bg-slate-100 dark:bg-[#030712] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800 transition-colors">
              2
            </button>
            <button className="px-3 py-1 rounded-md bg-slate-100 dark:bg-[#030712] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800 transition-colors">
              3
            </button>
            <button className="px-3 py-1 rounded-md bg-slate-100 dark:bg-[#030712] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-1 mt-1 shrink-0">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>

      {/* Modal: Chart of Group Add */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-hidden">
          <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Add Chart of Group
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-[#030712] hover:bg-rose-500 hover:text-white text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSubmit} className="p-5 space-y-3.5 text-xs md:text-sm">
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
                  Report Section
                </label>
                <input
                  type="text"
                  name="reportSection"
                  placeholder="e.g. operating_expense"
                  value={formData.reportSection}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Under <span className="text-rose-500">*</span>
                </label>
                <select
                  name="under"
                  required
                  value={formData.under}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                >
                  <option value="">Select Option</option>
                  <option value="Current Liabilities">Current Liabilities</option>
                  <option value="Direct Expense">Direct Expense</option>
                  <option value="Primary">Primary</option>
                  <option value="Current Assets">Current Assets</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Chart Of Section <span className="text-rose-500">*</span>
                </label>
                <select
                  name="chartOfSection"
                  required
                  value={formData.chartOfSection}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                >
                  <option value="">Select Option</option>
                  <option value="Liabilites">Liabilites</option>
                  <option value="Expense">Expense</option>
                  <option value="Assets">Assets</option>
                </select>
              </div>

              {/* Modal Buttons */}
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
                  Save Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}