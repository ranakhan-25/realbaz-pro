'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Search, 
  Calendar, 
  FileSpreadsheet, 
  FileText,
  X
} from 'lucide-react';

interface ReportRow {
  id: number;
  customerName: string;
  project: string;
  flatLandNo: string;
  totalValue: number;
  totalReceive: number;
  due: number;
  dueForRecovery: number;
  recovered: number;
  salesBy: string;
}

export default function SaleCollectionReport() {
  // Filter States
  const [selectDate, setSelectDate] = useState('1 September, 2026 - 30 September, 2026');
  const [salesByFilter, setSalesByFilter] = useState('Select value');
  const [teamFilter, setTeamFilter] = useState('Select value');
  const [projectFilter, setProjectFilter] = useState('Select value');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination State
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock Report Data (21 entries to match the image pagination count)
  const [reportData] = useState<ReportRow[]>([
    { id: 1, customerName: 'Sagor kumar', project: 'Sheba Eyecon Tower', flatLandNo: 'F 2', totalValue: 10955000, totalReceive: 500000, due: 10455000, dueForRecovery: 0, recovered: 0, salesBy: 'Tazmul Reza' },
    { id: 2, customerName: 'Sagor kumar', project: 'Sheba Eyecon Tower', flatLandNo: 'F 2', totalValue: 11570000, totalReceive: 0, due: 11570000, dueForRecovery: 0, recovered: 0, salesBy: 'Tazmul Reza' },
    { id: 3, customerName: 'Sagor kumar', project: 'Sheba Eyecon Tower', flatLandNo: 'F 2', totalValue: 11570000, totalReceive: 0, due: 11570000, dueForRecovery: 0, recovered: 0, salesBy: 'Tazmul Reza' },
    { id: 4, customerName: 'Sagor kumar', project: 'Sheba Eyecon Tower', flatLandNo: 'F 4', totalValue: 11770000, totalReceive: 200000, due: 11570000, dueForRecovery: 0, recovered: 0, salesBy: 'Tazmul Reza' },
    { id: 5, customerName: 'Mr. Raju raz', project: 'Sheba Eyecon Tower', flatLandNo: 'F 2', totalValue: 0, totalReceive: 0, due: 0, dueForRecovery: 0, recovered: 0, salesBy: 'Mohin Uddin' },
    { id: 6, customerName: 'Sagor kumar', project: 'Lake Garden', flatLandNo: 'C-9', totalValue: 0, totalReceive: 0, due: 0, dueForRecovery: 0, recovered: 0, salesBy: 'Tazmul Reza' },
    { id: 7, customerName: 'Sagor kumar', project: 'Sheba Eyecon Tower', flatLandNo: 'F 4', totalValue: 73800, totalReceive: 0, due: 73800, dueForRecovery: 0, recovered: 0, salesBy: 'Tazmul Reza' },
    { id: 8, customerName: 'Mr. Raju raz', project: 'Sheba Eyecon Tower', flatLandNo: 'F 4', totalValue: 73800, totalReceive: 0, due: 73800, dueForRecovery: 0, recovered: 0, salesBy: 'Mohin Uddin' },
    { id: 9, customerName: 'Mr. Raju raz', project: 'Lake Garden', flatLandNo: 'C-9', totalValue: 0, totalReceive: 0, due: 0, dueForRecovery: 0, recovered: 0, salesBy: 'Rifat Hosain' },
    { id: 10, customerName: 'Sagor kumar', project: 'Estern 19', flatLandNo: '2', totalValue: 0, totalReceive: 0, due: 0, dueForRecovery: 0, recovered: 0, salesBy: 'Tazmul Reza' },
    { id: 11, customerName: 'Tanvir Ahmed', project: 'Sheba Eyecon Tower', flatLandNo: 'F 5', totalValue: 5000000, totalReceive: 1000000, due: 4000000, dueForRecovery: 0, recovered: 0, salesBy: 'Tazmul Reza' },
    { id: 12, customerName: 'Rahim Mia', project: 'Lake Garden', flatLandNo: 'A-1', totalValue: 3500000, totalReceive: 500000, due: 3000000, dueForRecovery: 0, recovered: 0, salesBy: 'Mohin Uddin' },
  ]);

  // Filter Logic
  const filteredData = reportData.filter(row => {
    const matchesSearch = 
      row.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.salesBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.flatLandNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSalesBy = salesByFilter === 'Select value' || row.salesBy === salesByFilter;
    const matchesProject = projectFilter === 'Select value' || row.project === projectFilter;

    return matchesSearch && matchesSalesBy && matchesProject;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage) || 1;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentTableData = filteredData.slice(startIndex, startIndex + entriesPerPage);

  // Totals Calculation for Footer
  const totalValueSum = filteredData.reduce((acc, curr) => acc + curr.totalValue, 0);
  const totalReceiveSum = filteredData.reduce((acc, curr) => acc + curr.totalReceive, 0);
  const totalDueSum = filteredData.reduce((acc, curr) => acc + curr.due, 0);

  // Handlers
  const handleExportExcel = () => {
    alert('Exporting report as Excel spreadsheet...');
  };

  const handleExportPDF = () => {
    alert('Generating PDF report download...');
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
          <span className="font-semibold text-slate-900">Sale Collection Report</span>
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
                <option value="Rifat Hosain">Rifat Hosain</option>
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
                <option value="Beta Team">Beta Team</option>
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
                <option value="Estern 19">Estern 19</option>
              </select>
            </div>

          </div>

          {/* Action Export Buttons & Table Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleExportExcel}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5 shadow transition"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel</span>
              </button>
              <button 
                onClick={handleExportPDF}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5 shadow transition"
              >
                <FileText className="w-4 h-4" />
                <span>PDF</span>
              </button>
              
              <div className="flex items-center text-sm text-slate-600 space-x-2 pl-4">
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
            </div>

            {/* Search Input Bar */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600 font-medium">Search:</span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search records..."
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
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">CUSTOMER NAME</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">PROJECT</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">FLAT/LAND NO</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">TOTAL VALUE</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">TOTAL RECEIVE</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">DUE</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">DUE FOR RECOVERY</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">RECOVERED</th>
                  <th className="p-3.5 whitespace-nowrap">SALES BY</th>
                </tr>
              </thead>
              <tbody className="bg-white text-slate-700">
                {currentTableData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-12 text-slate-400 italic bg-slate-50 text-base">
                      No matching sale collection records found.
                    </td>
                  </tr>
                ) : (
                  currentTableData.map((row, idx) => (
                    <tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 border-r font-medium">{startIndex + idx + 1}</td>
                      <td className="p-3.5 border-r font-semibold text-slate-900">{row.customerName}</td>
                      <td className="p-3.5 border-r">{row.project}</td>
                      <td className="p-3.5 border-r text-blue-600 font-medium underline cursor-pointer">{row.flatLandNo}</td>
                      <td className="p-3.5 border-r">{row.totalValue.toFixed(2)}</td>
                      <td className="p-3.5 border-r">{row.totalReceive.toFixed(2)}</td>
                      <td className="p-3.5 border-r">{row.due.toFixed(2)}</td>
                      <td className="p-3.5 border-r">{row.dueForRecovery}</td>
                      <td className="p-3.5 border-r">{row.recovered}</td>
                      <td className="p-3.5">{row.salesBy}</td>
                    </tr>
                  ))
                )}
              </tbody>
              
              {/* Table Footer Totals Row */}
              <tfoot>
                <tr className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-300">
                  <td colSpan={4} className="p-3.5 text-right uppercase tracking-wider">TOTAL:</td>
                  <td className="p-3.5 border-r">{totalValueSum.toFixed(2)}</td>
                  <td className="p-3.5 border-r">{totalReceiveSum.toFixed(2)}</td>
                  <td className="p-3.5 border-r">{totalDueSum.toFixed(2)}</td>
                  <td colSpan={3} className="p-3.5"></td>
                </tr>
              </tfoot>
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