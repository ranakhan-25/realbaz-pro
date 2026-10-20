'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Calendar, 
  Check 
} from 'lucide-react';

interface InstallmentRow {
  id: number;
  project: string;
  flatLand: string;
  customerName: string;
  totalValue: number;
  paid: number;
  due: number;
  installmentDate: string;
  installmentAmount: number;
  recovered: number;
  installmentDue: number;
  salesBy: string;
}

export default function InstallmentReport() {
  // Filter States
  const [selectDate, setSelectDate] = useState('1 September, 2026 - 30 September, 2026');
  const [salesByFilter, setSalesByFilter] = useState('Select value');
  const [teamFilter, setTeamFilter] = useState('Select value');
  const [projectFilter, setProjectFilter] = useState('Select value');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination State
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock Installment Report Data
  const [reportData] = useState<InstallmentRow[]>([
    { id: 1, project: 'Sheba Eyecon Tower', flatLand: 'F 3', customerName: 'Sagor kumar', totalValue: 10925000, paid: 122320, due: 10802680, installmentDate: '2026-09-03', installmentAmount: 10802680, recovered: 0, installmentDue: 10802680, salesBy: '' },
    { id: 2, project: 'Lake Garden', flatLand: 'A!', customerName: 'Mr. Raju raz', totalValue: 84200000, paid: 28066666.66, due: 56133333.34, installmentDate: '2026-09-30', installmentAmount: 28066666.66, recovered: 28066666.66, installmentDue: 0, salesBy: '' },
    { id: 3, project: 'Lake Garden', flatLand: 'C-10', customerName: 'Abc', totalValue: 15340000, paid: 2000000, due: 13340000, installmentDate: '2026-09-24', installmentAmount: 277916.67, recovered: 0, installmentDue: 277916.67, salesBy: '' }
  ]);

  // Filter Logic
  const filteredData = reportData.filter(row => {
    const matchesSearch = 
      row.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.flatLand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSalesBy = salesByFilter === 'Select value' || row.salesBy === salesByFilter;
    const matchesProject = projectFilter === 'Select value' || row.project === projectFilter;

    return matchesSearch && matchesSalesBy && matchesProject;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage) || 1;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentTableData = filteredData.slice(startIndex, startIndex + entriesPerPage);

  // Action Handler
  const handleActionClick = (id: number) => {
    alert(`Action clicked for installment row ID: ${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 font-sans text-slate-800">
      <div className="space-y-6">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center text-sm text-slate-600 space-x-2">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="hover:text-blue-600 cursor-pointer">Flat/Land</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-900">Installment Report</span>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
          
          {/* Top Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            
            {/* Select Date */}
            <div>
              <label className="block text-slate-600 font-medium mb-1.5">Select Date</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={selectDate} 
                  onChange={(e) => setSelectDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 bg-white text-slate-700 focus:outline-none focus:border-purple-500"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Sales By Filter */}
            <div>
              <label className="block text-slate-600 font-medium mb-1.5">Sales By</label>
              <select 
                value={salesByFilter} 
                onChange={(e) => setSalesByFilter(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 bg-white text-slate-700 focus:outline-none focus:border-purple-500"
              >
                <option value="Select value">Select value</option>
                <option value="Tazmul Reza">Tazmul Reza</option>
                <option value="Mohin Uddin">Mohin Uddin</option>
              </select>
            </div>

            {/* Team Filter */}
            <div>
              <label className="block text-slate-600 font-medium mb-1.5">Team</label>
              <select 
                value={teamFilter} 
                onChange={(e) => setTeamFilter(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 bg-white text-slate-700 focus:outline-none focus:border-purple-500"
              >
                <option value="Select value">Select value</option>
                <option value="Alpha Team">Alpha Team</option>
              </select>
            </div>

            {/* Project Filter */}
            <div>
              <label className="block text-slate-600 font-medium mb-1.5">Project</label>
              <select 
                value={projectFilter} 
                onChange={(e) => setProjectFilter(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 bg-white text-slate-700 focus:outline-none focus:border-purple-500"
              >
                <option value="Select value">Select value</option>
                <option value="Sheba Eyecon Tower">Sheba Eyecon Tower</option>
                <option value="Lake Garden">Lake Garden</option>
              </select>
            </div>

          </div>

          {/* Table Controls Bar (Show entries & Search) */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            
            <div className="flex items-center text-sm text-slate-600 space-x-2">
              <span>Show</span>
              <select 
                value={entriesPerPage} 
                onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>

            {/* Search Input Bar */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600 font-medium">Search:</span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search installments..."
                className="border border-slate-300 rounded-lg px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:border-purple-500" 
              />
            </div>

          </div>

          {/* Data Table */}
          <div className="overflow-x-auto border border-[#7b68ee]/40 rounded-xl shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#6b58e8] text-white font-bold tracking-wide">
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">ID</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">PROJECT</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">FLAT/LAND</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">CUSTOMER NAME</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">TOTAL VALUE</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">PAID</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">DUE</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">INSTALLMENT DATE</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">INSTALLMENT AMOUNT</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">RECOVERED</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">INSTALLMENT DUE</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">SALES BY</th>
                  <th className="p-3.5 whitespace-nowrap">ACTION</th>
                </tr>
              </thead>
              <tbody className="bg-white text-slate-700">
                {currentTableData.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="text-center py-12 text-slate-400 italic bg-slate-50 text-base">
                      No matching installment report entries found.
                    </td>
                  </tr>
                ) : (
                  currentTableData.map((row, idx) => (
                    <tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 border-r font-medium">{startIndex + idx + 1}</td>
                      <td className="p-3.5 border-r font-semibold text-slate-900">{row.project}</td>
                      <td className="p-3.5 border-r text-blue-600 font-medium">{row.flatLand}</td>
                      <td className="p-3.5 border-r">{row.customerName}</td>
                      <td className="p-3.5 border-r">{row.totalValue}</td>
                      <td className="p-3.5 border-r">{row.paid}</td>
                      <td className="p-3.5 border-r">{row.due}</td>
                      <td className="p-3.5 border-r">{row.installmentDate}</td>
                      <td className="p-3.5 border-r">{row.installmentAmount}</td>
                      <td className="p-3.5 border-r">{row.recovered}</td>
                      <td className="p-3.5 border-r">{row.installmentDue}</td>
                      <td className="p-3.5 border-r">{row.salesBy}</td>
                      <td className="p-3.5">
                        <button 
                          onClick={() => handleActionClick(row.id)}
                          className="bg-[#6b58e8] hover:bg-purple-700 text-white p-1.5 rounded-md shadow transition flex items-center justify-center"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination Bar */}
          <div className="flex flex-wrap items-center justify-between text-sm text-slate-600 pt-2">
            <span>
              Showing {filteredData.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + entriesPerPage, filteredData.length)} of {filteredData.length} entries
            </span>
            
            <div className="flex space-x-1.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg font-medium ${currentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${currentPage === pageNum ? 'bg-[#6b58e8] text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {pageNum}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-3 py-1.5 rounded-lg font-medium ${currentPage === totalPages || totalPages === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
              >
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}