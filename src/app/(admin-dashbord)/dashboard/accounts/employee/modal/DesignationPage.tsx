"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Search,
  Plus,
  Pencil,
  Trash2,
  ArrowUpDown,
  X,
} from "lucide-react";

// --- TypeScript Interfaces (API Ready) ---
export interface DesignationItem {
  id: number;
  sl: number;
  department: string;
  designation: string;
}

interface DesignationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { department: string; designation: string }) => void;
}

// --- Decoupled Designation Modal Component ---
export function DesignationModal({ isOpen, onClose, onSubmit }: DesignationModalProps) {
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!department || !designation.trim()) return;

    onSubmit({ department, designation: designation.trim() });
    setDepartment("");
    setDesignation("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#080d1a] border border-slate-200 dark:border-[#131c31] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#131c31]">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Designation
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md bg-rose-500 hover:bg-rose-600 text-white transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Department Select Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Department<span className="text-rose-500 ml-0.5">*</span>
            </label>
            <select
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
            >
              <option value="" disabled>Select value</option>
              <option value="Business Development">Business Development</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
              <option value="Accounts">Accounts</option>
              <option value="Store">Store</option>
              <option value="Test">Test</option>
            </select>
          </div>

          {/* Designation Input Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Designation<span className="text-rose-500 ml-0.5">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-slate-400 dark:bg-slate-700 hover:bg-slate-500 dark:hover:bg-slate-600 text-white transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Initial Table Mock Data ---
const initialDesignations: DesignationItem[] = [
  { id: 1, sl: 1, department: "Business Development", designation: "TL" },
  { id: 2, sl: 2, department: "Business Development", designation: "GL" },
  { id: 3, sl: 3, department: "Business Development", designation: "Co-Ordinator" },
  { id: 4, sl: 4, department: "Accounts", designation: "Manager" },
  { id: 5, sl: 5, department: "Sales and Marketing", designation: "Team Leader" },
  { id: 6, sl: 6, department: "Test", designation: "Messanger" },
  { id: 7, sl: 7, department: "Store", designation: "Coveredvan Helper" },
];

// --- Main Page Component ---
export default function DesignationListPage() {
  const [designations, setDesignations] = useState<DesignationItem[]>(initialDesignations);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddSubmit = (data: { department: string; designation: string }) => {
    const newId = designations.length + 1;
    setDesignations((prev) => [
      ...prev,
      { id: newId, sl: newId, department: data.department, designation: data.designation },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-100 p-4 md:p-6 transition-colors duration-200">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2 font-medium">
        <span className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">Home</span>
        <span>&gt;</span>
        <span className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">Employee</span>
        <span>&gt;</span>
        <span className="text-slate-400 dark:text-slate-500">Designation List</span>
      </nav>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-[#080d1a] rounded-xl shadow-lg border border-slate-200 dark:border-[#131c31] p-5 mb-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Designation List
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage company employee designations and roles
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Designation Add
          </button>
        </div>

        {/* Search & Filter Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded px-2.5 py-1 text-xs focus:outline-none text-slate-700 dark:text-slate-200"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Data Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-[#131c31] rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-indigo-600 dark:bg-[#030712] text-white dark:text-slate-300 font-semibold border-b border-indigo-700 dark:border-[#131c31] tracking-wider">
                <th className="p-3 w-16">
                  <div className="flex items-center gap-1">
                    SL <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                  </div>
                </th>
                <th className="p-3">
                  <div className="flex items-center gap-1">
                    DEPARTMENT <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                  </div>
                </th>
                <th className="p-3">
                  <div className="flex items-center gap-1">
                    DESIGNATION <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                  </div>
                </th>
                <th className="p-3 text-center w-28">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#131c31]/80 bg-white dark:bg-[#080d1a]">
              {designations.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-[#0e1628] transition-colors">
                  <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">{row.sl}</td>
                  <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{row.department}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{row.designation}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button className="p-1.5 rounded bg-cyan-500 hover:bg-cyan-600 text-white transition-colors shadow-sm" title="Edit">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded bg-rose-500 hover:bg-rose-600 text-white transition-colors shadow-sm" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
          <div>Showing 1 to {designations.length} of {designations.length} entries</div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 rounded border border-slate-200 dark:border-[#1e293b] text-slate-400 dark:text-slate-600 disabled:opacity-40" disabled>
              Previous
            </button>
            <button className="px-3 py-1.5 rounded bg-indigo-600 text-white font-medium">1</button>
            <button className="px-3 py-1.5 rounded border border-slate-200 dark:border-[#1e293b] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Designation Modal */}
      <DesignationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSubmit}
      />

      {/* Page Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200/60 dark:border-[#131c31] pt-4">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>
    </div>
  );
}