"use client";

import React, { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowUpDown,
  X,
} from "lucide-react";

// --- Department Interface (API Ready) ---
export interface DepartmentItem {
  id: number;
  sl: number;
  departmentHead: string;
  departmentName: string;
}

// Mock Data (Matching Image)
const initialDepartmentData: DepartmentItem[] = [
  { id: 1, sl: 1, departmentHead: "Tazmul Reza", departmentName: "Management" },
  { id: 2, sl: 2, departmentHead: "Rifat Hosain", departmentName: "Software" },
  { id: 3, sl: 3, departmentHead: "N/A", departmentName: "HR & Admin" },
  { id: 4, sl: 4, departmentHead: "N/A", departmentName: "Customs" },
  { id: 5, sl: 5, departmentHead: "Mohin Uddin", departmentName: "Accounts" },
  { id: 6, sl: 6, departmentHead: "N/A", departmentName: "Dop" },
  { id: 7, sl: 7, departmentHead: "N/A", departmentName: "Chemical" },
  { id: 8, sl: 8, departmentHead: "N/A", departmentName: "Mechanical" },
  { id: 9, sl: 9, departmentHead: "N/A", departmentName: "Electrical" },
  { id: 10, sl: 10, departmentHead: "N/A", departmentName: "Factory" },
];

// --- DEPARTMENT ADD / EDIT MODAL COMPONENT ---
interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function DepartmentModal({ isOpen, onClose }: DepartmentModalProps) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    departmentHead: "",
    departmentName: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Department Data:", formData);
    // API Call goes here
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-200">
      {/* Modal Box */}
      <div className="w-full max-w-lg bg-white dark:bg-[#080d1a] rounded-xl shadow-2xl border border-slate-200 dark:border-[#1e293b] overflow-hidden flex flex-col transition-all my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#030712]">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Department
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-white bg-rose-500 hover:bg-rose-600 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4 text-xs">
            
            {/* Department Head */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                Department Head
              </label>
              <select
                name="departmentHead"
                value={formData.departmentHead}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                <option value="">Select value</option>
                <option value="1">Tazmul Reza</option>
                <option value="2">Rifat Hosain</option>
                <option value="3">Mohin Uddin</option>
              </select>
            </div>

            {/* Department Name */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                Department<span className="text-rose-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                name="departmentName"
                placeholder="Department"
                required
                value={formData.departmentName}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-slate-400 hover:bg-slate-500 dark:bg-slate-700 dark:hover:bg-slate-600 text-white transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function DepartmentListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-100 p-4 md:p-6 transition-colors duration-200 flex flex-col justify-between">
      <div>
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2 font-medium">
          <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Home</span>
          <span>&gt;</span>
          <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Employee</span>
          <span>&gt;</span>
          <span className="text-slate-400 dark:text-slate-500">Department List</span>
        </nav>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-[#080d1a] rounded-xl shadow-lg border border-slate-200 dark:border-[#131c31] p-5 mb-6">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Department List
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage company departments and department heads
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Department Add
            </button>
          </div>

          {/* Filter & Search Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>

            <div className="relative flex items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Search:</span>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 dark:border-[#131c31] rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-indigo-600 dark:bg-[#030712] text-white dark:text-slate-300 font-semibold border-b border-indigo-700 dark:border-[#131c31] tracking-wider">
                  <th className="p-3 w-16">
                    <div className="flex items-center gap-1">
                      SL
                      <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                    </div>
                  </th>
                  <th className="p-3">
                    <div className="flex items-center gap-1">
                      DEPARTMENT HEAD
                      <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                    </div>
                  </th>
                  <th className="p-3">
                    <div className="flex items-center gap-1">
                      DEPARTMENT
                      <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                    </div>
                  </th>
                  <th className="p-3 text-center w-28">
                    <div className="flex items-center justify-center gap-1">
                      ACTION
                      <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#131c31]/80 bg-white dark:bg-[#080d1a]">
                {initialDepartmentData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-[#0e1628] transition-colors">
                    <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">{item.sl}</td>
                    <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{item.departmentHead}</td>
                    <td className="p-3 font-medium text-slate-900 dark:text-slate-100">{item.departmentName}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          className="p-1.5 rounded bg-cyan-500 hover:bg-cyan-600 text-white transition-colors shadow-sm"
                          title="Edit"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          className="p-1.5 rounded bg-rose-500 hover:bg-rose-600 text-white transition-colors shadow-sm"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
            <div>Showing 1 to 10 of 20 entries</div>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1 rounded border border-slate-200 dark:border-[#1e293b] text-slate-400 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-40" disabled>
                Previous
              </button>
              <button className="px-3 py-1 rounded bg-indigo-600 text-white font-medium">1</button>
              <button className="px-3 py-1 rounded border border-slate-200 dark:border-[#1e293b] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900">
                2
              </button>
              <button className="px-3 py-1 rounded border border-slate-200 dark:border-[#1e293b] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200/60 dark:border-[#131c31] pt-4 mt-auto">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>

      {/* Modal */}
      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}