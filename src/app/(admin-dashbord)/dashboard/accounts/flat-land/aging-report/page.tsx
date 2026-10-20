'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Calendar, 
  FileSpreadsheet, 
  FileText 
} from 'lucide-react';

interface AgingRow {
  id: number;
  customer: string;
  invoiceNo: string;
  invoiceDate: string;
  amount: number;
  days0_30: number;
  days31_60: number;
  days61_90: number;
  days91_120: number;
  days120Plus: number;
  note: string;
}

export default function AgingReport() {
  // Filter States
  const [selectDate, setSelectDate] = useState('17/09/2026');
  const [companyFilter, setCompanyFilter] = useState('Select value');
  const [projectFilter, setProjectFilter] = useState('Select value');
  const [siteFilter, setSiteFilter] = useState('Select Site');
  const [salesByFilter, setSalesByFilter] = useState('Select value');
  const [teamFilter, setTeamFilter] = useState('Select value');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination State
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock Aging Report Data
  const [reportData] = useState<AgingRow[]>([
    { id: 1, customer: '', invoiceNo: '', invoiceDate: '', amount: 0, days0_30: 3278166.66, days31_60: 3278166.66, days61_90: 3278166.66, days91_120: 3278166.66, days120Plus: 10027333.36, note: '' },
    { id: 2, customer: 'Abul', invoiceNo: 'Booking-1015817', invoiceDate: '2026-08-24', amount: 9680000, days0_30: 0, days31_60: 1066666.66, days61_90: 1066666.66, days91_120: 1066666.66, days120Plus: 6400000.02, note: '' },
    { id: 3, customer: 'Abc', invoiceNo: 'Sale1750755', invoiceDate: '2026-08-24', amount: 15340000, days0_30: 277916.67, days31_60: 277916.67, days61_90: 277916.67, days91_120: 277916.67, days120Plus: 12228333.479999999, note: '' },
    { id: 4, customer: 'Mr. Raju raz', invoiceNo: 'Booking-1468040', invoiceDate: '2026-08-30', amount: 84200000, days0_30: 28066666.66, days31_60: 28066666.66, days61_90: 28066666.68, days91_120: 0, days120Plus: 0, note: '' },
    { id: 5, customer: 'Sagor kumar', invoiceNo: 'Booking-2902887', invoiceDate: '2026-09-07', amount: 11770000, days0_30: 964166.66, days31_60: 964166.66, days61_90: 964166.66, days91_120: 964166.66, days120Plus: 771333.36, note: '' },
    { id: 6, customer: 'Sagor kumar', invoiceNo: 'Booking-8181711', invoiceDate: '2026-09-13', amount: 10955000, days0_30: 290416.66, days31_60: 290416.66, days61_90: 290416.66, days91_120: 290416.66, days120Plus: 9293333.360000003, note: '' }
  ]);

  // Filter Logic
  const filteredData = reportData.filter(row => {
    const matchesSearch = 
      row.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage) || 1;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentTableData = filteredData.slice(startIndex, startIndex + entriesPerPage);

  // Grand Total Summaries Calculation
  const totalAmountSum = filteredData.reduce((acc, curr) => acc + curr.amount, 0);
  const total0_30Sum = filteredData.reduce((acc, curr) => acc + curr.days0_30, 0);
  const total31_60Sum = filteredData.reduce((acc, curr) => acc + curr.days31_60, 0);
  const total61_90Sum = filteredData.reduce((acc, curr) => acc + curr.days61_90, 0);
  const total91_120Sum = filteredData.reduce((acc, curr) => acc + curr.days91_120, 0);
  const total120PlusSum = filteredData.reduce((acc, curr) => acc + curr.days120Plus, 0);

  // Handlers
  const handleExportExcel = () => {
    alert('Exporting Aging Report as Excel spreadsheet...');
  };

  const handleExportPDF = () => {
    alert('Generating Aging Report PDF download...');
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
          <span className="font-semibold text-slate-900">Aging Report</span>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
          
          {/* Top Filters Grid */}
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
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

              {/* Company Filter */}
              <div>
                <label className="block text-slate-600 font-medium mb-1.5">Company</label>
                <select 
                  value={companyFilter} 
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 bg-white text-slate-700 focus:outline-none focus:border-purple-500"
                >
                  <option value="Select value">Select value</option>
                  <option value="Company A">Company A</option>
                  <option value="Company B">Company B</option>
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

              {/* Site Filter */}
              <div>
                <label className="block text-slate-600 font-medium mb-1.5">Site</label>
                <select 
                  value={siteFilter} 
                  onChange={(e) => setSiteFilter(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 bg-white text-slate-700 focus:outline-none focus:border-purple-500"
                >
                  <option value="Select Site">Select Site</option>
                  <option value="Site 1">Site 1</option>
                  <option value="Site 2">Site 2</option>
                </select>
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

            </div>

            {/* Second Row Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                placeholder="Search customer/invoice..."
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
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">CUSTOMER</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">INVOICE NO</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">INVOICE DATE</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">AMOUNT</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">0-30 DAYS</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">31-60 DAYS</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">61-90 DAYS</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">91-120 DAYS</th>
                  <th className="p-3.5 border-r border-purple-400 whitespace-nowrap">120+ DAYS</th>
                  <th className="p-3.5 whitespace-nowrap">NOTE</th>
                </tr>
              </thead>
              <tbody className="bg-white text-slate-700">
                {currentTableData.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-12 text-slate-400 italic bg-slate-50 text-base">
                      No matching aging report entries found.
                    </td>
                  </tr>
                ) : (
                  currentTableData.map((row, idx) => (
                    <tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 border-r font-medium">{startIndex + idx + 1}</td>
                      <td className="p-3.5 border-r font-semibold text-slate-900">{row.customer}</td>
                      <td className="p-3.5 border-r text-blue-600 font-medium">{row.invoiceNo}</td>
                      <td className="p-3.5 border-r">{row.invoiceDate}</td>
                      <td className="p-3.5 border-r">{row.amount !== 0 ? row.amount.toFixed(2) : ''}</td>
                      <td className="p-3.5 border-r">{row.days0_30.toFixed(2)}</td>
                      <td className="p-3.5 border-r">{row.days31_60.toFixed(2)}</td>
                      <td className="p-3.5 border-r">{row.days61_90.toFixed(2)}</td>
                      <td className="p-3.5 border-r">{row.days91_120.toFixed(2)}</td>
                      <td className="p-3.5 border-r">{row.days120Plus !== 0 ? row.days120Plus.toFixed(2) : ''}</td>
                      <td className="p-3.5">{row.note}</td>
                    </tr>
                  ))
                )}
              </tbody>
              
              {/* Table Footer Grand Totals Row */}
              <tfoot>
                <tr className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-300">
                  <td colSpan={4} className="p-3.5 text-right uppercase tracking-wider">GRAND TOTAL:</td>
                  <td className="p-3.5 border-r">{totalAmountSum.toFixed(2)}</td>
                  <td className="p-3.5 border-r">{total0_30Sum.toFixed(2)}</td>
                  <td className="p-3.5 border-r">{total31_60Sum.toFixed(2)}</td>
                  <td className="p-3.5 border-r">{total61_90Sum.toFixed(2)}</td>
                  <td className="p-3.5 border-r">{total91_120Sum.toFixed(2)}</td>
                  <td className="p-3.5 border-r">{total120PlusSum.toFixed(2)}</td>
                  <td className="p-3.5"></td>
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