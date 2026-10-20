"use client";

import React, { useState } from "react";
import {
  HardHat,
  Plus,
  Search,
  Pencil,
  ChevronLeft,
  ChevronRight,
  User,
  ArrowUpDown,
  FileSpreadsheet,
  FileText,
  X,
} from "lucide-react";

interface WorkerItem {
  id: number;
  code: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  under: string;
}

const initialWorkerData: WorkerItem[] = [
  { id: 1, code: "CO3203909", name: "Southern Park", company: "-", phone: "0", email: "-", address: "-", under: "Contractor" },
  { id: 2, code: "WO9349977", name: "Mizan", company: "-", phone: "-", email: "-", address: "-", under: "Worker" },
  { id: 3, code: "WO9349977", name: "Mizan", company: "-", phone: "-", email: "-", address: "-", under: "Worker" },
  { id: 4, code: "WO9349977", name: "Mizan", company: "-", phone: "-", email: "-", address: "-", under: "Worker" },
];

// --- LABOUR / WORKER ADD MODAL COMPONENT ---
interface LabourWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function LabourWorkerModal({ isOpen, onClose }: LabourWorkerModalProps) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    code: "WO1222447",
    name: "",
    businessOrganization: "",
    email: "",
    phoneMobile: "",
    address: "",
    creditLimit: "",
    dueDate: "",
    under: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Labour/Worker Data:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 transition-all duration-200 overflow-y-auto">
      {/* Modal Container */}
      <div className="w-full max-w-2xl bg-slate-50 dark:bg-[#080d1a] rounded-xl shadow-2xl border border-slate-200 dark:border-[#1e293b] overflow-hidden flex flex-col transition-all my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#030712]">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Labour/Worker/Contractor
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* Row 1 */}
            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                Code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded px-3 py-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            {/* Row 2 */}
            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                Business/Organization
              </label>
              <input
                type="text"
                name="businessOrganization"
                placeholder="Enter Business Name"
                value={formData.businessOrganization}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded px-3 py-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter E-mail"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded px-3 py-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            {/* Row 3 */}
            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                Phone/Mobile
              </label>
              <input
                type="text"
                name="phoneMobile"
                placeholder="Enter Phone/Mobile"
                value={formData.phoneMobile}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded px-3 py-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="Enter Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded px-3 py-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            {/* Row 4 */}
            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                Credit Limit
              </label>
              <input
                type="text"
                name="creditLimit"
                placeholder="Enter Credit Limit"
                value={formData.creditLimit}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded px-3 py-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            {/* Row 5 */}
            <div className="md:col-span-1">
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">
                Under
              </label>
              <select
                name="under"
                value={formData.under}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#030712] border border-slate-300 dark:border-[#1e293b] rounded px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                <option value="">Select One Option</option>
                <option value="Contractor">Contractor</option>
                <option value="Worker">Worker</option>
              </select>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-[#1e293b]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-xs font-semibold rounded bg-slate-400 hover:bg-slate-500 dark:bg-slate-700 dark:hover:bg-slate-600 text-white transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- MAIN LIST PAGE ---
export default function LabourWorkerListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-100 p-4 md:p-6 transition-colors duration-200">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2 font-medium">
        <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Home</span>
        <span>&gt;</span>
        <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Labour/Worker</span>
        <span>&gt;</span>
        <span className="text-slate-400 dark:text-slate-500">Labour/Worker/Contractor List</span>
      </nav>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-[#080d1a] rounded-xl shadow-lg border border-slate-200 dark:border-[#131c31] p-5 mb-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Labour / Worker / Contractor List</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage workers, contractors, and labour records</p>
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
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Labour/Worker Add
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
                <th className="p-3">
                  <div className="flex items-center gap-1">
                    ID
                    <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                  </div>
                </th>
                <th className="p-3">
                  <div className="flex items-center gap-1">
                    CODE
                    <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                  </div>
                </th>
                <th className="p-3">
                  <div className="flex items-center gap-1">
                    NAME
                    <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                  </div>
                </th>
                <th className="p-3">
                  <div className="flex items-center gap-1">
                    COMPANY
                    <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                  </div>
                </th>
                <th className="p-3">
                  <div className="flex items-center gap-1">
                    PHONE
                    <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                  </div>
                </th>
                <th className="p-3">
                  <div className="flex items-center gap-1">
                    EMAIL
                    <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                  </div>
                </th>
                <th className="p-3">
                  <div className="flex items-center gap-1">
                    ADDRESS
                    <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                  </div>
                </th>
                <th className="p-3">
                  <div className="flex items-center gap-1">
                    UNDER
                    <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                  </div>
                </th>
                <th className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    ACTION
                    <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#131c31]/80 bg-white dark:bg-[#080d1a]">
              {initialWorkerData.map((worker) => (
                <tr key={worker.id} className="hover:bg-slate-50 dark:hover:bg-[#0e1628] transition-colors">
                  <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">{worker.id}</td>
                  <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{worker.code}</td>
                  <td className="p-3 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium">
                    {worker.name}
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">{worker.company}</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{worker.phone}</td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">{worker.email}</td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">{worker.address}</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      worker.under === 'Contractor' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    }`}>
                      {worker.under}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded bg-cyan-500 hover:bg-cyan-600 text-white transition-colors shadow-sm" title="Edit">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button className="p-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm" title="View Profile">
                        <User className="w-3 h-3" />
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
          <div>Showing 1 to {initialWorkerData.length} of {initialWorkerData.length} entries</div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 rounded border border-slate-200 dark:border-[#1e293b] text-slate-400 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-40" disabled>
              Previous
            </button>
            <button className="px-3 py-1 rounded bg-indigo-600 text-white font-medium">1</button>
            <button className="px-3 py-1 rounded border border-slate-200 dark:border-[#1e293b] text-slate-400 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-40" disabled>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200/60 dark:border-[#131c31] pt-4">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>

      {/* Labour/Worker Add Modal */}
      <LabourWorkerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}