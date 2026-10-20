"use client";

import React, { useState } from "react";
import {
  Building2,
  FileSpreadsheet,
  FileText,
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowUpDown,
  X,
} from "lucide-react";

// API থেকে আসা ডেটার TypeScript Interface
interface Department {
  id: number;
  sl: number;
  departmentHead: string;
  departmentName: string;
}

// API যুক্ত করার আগ পর্যন্ত মক ডাটা (Mock Data)
const initialDepartmentData: Department[] = [
  { id: 1, sl: 1, departmentHead: "-", departmentName: "Business Development" },
  { id: 2, sl: 2, departmentHead: "-", departmentName: "Sales & Marketing" },
  { id: 3, sl: 3, departmentHead: "-", departmentName: "Store" },
  { id: 4, sl: 4, departmentHead: "-", departmentName: "Customs" },
  { id: 5, sl: 5, departmentHead: "-", departmentName: "Accounts" },
  { id: 6, sl: 6, departmentHead: "-", departmentName: "Dop" },
  { id: 7, sl: 7, departmentHead: "-", departmentName: "Chemical" },
  { id: 8, sl: 8, departmentHead: "-", departmentName: "Mechanical" },
  { id: 9, sl: 9, departmentHead: "-", departmentName: "Electrical" },
  { id: 10, sl: 10, departmentHead: "-", departmentName: "Factory" },
];

export default function DepartmentListPage() {
  // API Integrated States
  const [departments, setDepartments] = useState<Department[]>(initialDepartmentData);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State & Form Input States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [departmentHead, setDepartmentHead] = useState("");

  // New Department Submit Handler
  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentName.trim()) return;

    const newId = departments.length + 1;
    const newDepartment: Department = {
      id: newId,
      sl: newId,
      departmentName: departmentName.trim(),
      departmentHead: departmentHead.trim() ? departmentHead.trim() : "-",
    };

    setDepartments([...departments, newDepartment]);
    setDepartmentName("");
    setDepartmentHead("");
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-100 p-4 md:p-6 transition-colors duration-200">
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Department List</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage company departments and department heads</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-colors">
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-rose-500/30 text-rose-600 dark:text-rose-400 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-900/40 transition-colors">
              <FileText className="w-4 h-4" />
              PDF
            </button>
            
            {/* Modal Open Trigger Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Department Add
            </button>
          </div>
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

        {/* Responsive Table */}
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
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50 dark:hover:bg-[#0e1628] transition-colors">
                  <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">{dept.sl}</td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">{dept.departmentHead}</td>
                  <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{dept.departmentName}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        className="p-1.5 rounded bg-cyan-500 hover:bg-cyan-600 text-white transition-colors shadow-sm" 
                        title="Edit Department"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        className="p-1.5 rounded bg-rose-500 hover:bg-rose-600 text-white transition-colors shadow-sm" 
                        title="Delete Department"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
          <div>Showing 1 to {departments.length} of {departments.length} entries</div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 rounded border border-slate-200 dark:border-[#1e293b] text-slate-400 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-40" disabled>
              Previous
            </button>
            <button className="px-3 py-1.5 rounded bg-indigo-600 text-white font-medium">1</button>
            <button className="px-3 py-1.5 rounded border border-slate-200 dark:border-[#1e293b] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* --- Department Add Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#080d1a] border border-slate-200 dark:border-[#131c31] rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#131c31] bg-slate-50/50 dark:bg-[#030712]/50">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add New Department</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddDepartment} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Department Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Human Resources"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Department Head (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={departmentHead}
                  onChange={(e) => setDepartmentHead(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-[#1e293b] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200/60 dark:border-[#131c31] pt-4">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>
    </div>
  );
}