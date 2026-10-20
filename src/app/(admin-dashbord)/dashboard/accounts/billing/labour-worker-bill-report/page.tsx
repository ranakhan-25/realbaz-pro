'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Search 
} from 'lucide-react';

interface ContractorReportItem {
  id: string;
  sl: number;
  invoiceNo: string;
  contractor: string;
  labourWorker: string;
  particulars: string;
  qtyDays: number;
  rate: number;
  gross: number;
  securityDeposit: number;
  paid: number;
  due: number;
}

export default function ContractorBillReportPage() {
  // Filter States
  const [selectDate, setSelectDate] = useState('1 September, 2026 - 30 September, 2026');
  const [project, setProject] = useState('');
  const [contractor, setContractor] = useState('');

  // Table Control States
  const [entries, setEntries] = useState('10');
  const [searchQuery, setSearchQuery] = useState('');

  // Report Data State (Currently empty as per screenshot)
  const [reportData, setReportData] = useState<ContractorReportItem[]>([]);

  // Calculation for Totals
  const totalGross = reportData.reduce((acc, curr) => acc + curr.gross, 0);
  const totalSecurityDeposit = reportData.reduce((acc, curr) => acc + curr.securityDeposit, 0);
  const totalPaid = reportData.reduce((acc, curr) => acc + curr.paid, 0);
  const totalDue = reportData.reduce((acc, curr) => acc + curr.due, 0);

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800">
      
      {/* ================= BREADCRUMB HEADER ================= */}
      <div className="flex items-center text-sm text-slate-600 mb-4 space-x-2">
        <span className="hover:text-blue-600 cursor-pointer">Home</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="hover:text-blue-600 cursor-pointer">Billing</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="font-semibold text-slate-800">Contractor Bill Report</span>
      </div>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="bg-white rounded-md shadow-sm border border-slate-200 p-5 space-y-4">
        
        {/* Top Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-slate-100 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Select Date</label>
            <input 
              type="text" 
              value={selectDate} 
              onChange={(e) => setSelectDate(e.target.value)} 
              className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-xs focus:outline-none focus:border-purple-500" 
            />
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Project</label>
            <select 
              value={project} 
              onChange={(e) => setProject(e.target.value)} 
              className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="">Select value</option>
              <option value="Project Alpha">Project Alpha</option>
              <option value="Project Beta">Project Beta</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Contractor</label>
            <select 
              value={contractor} 
              onChange={(e) => setContractor(e.target.value)} 
              className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="">Select One Option</option>
              <option value="Contractor X">Contractor X</option>
              <option value="Contractor Y">Contractor Y</option>
            </select>
          </div>
        </div>

        {/* Action Buttons & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <div className="flex items-center space-x-2">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-medium transition shadow-sm">
              Excel
            </button>
            <button className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded text-xs font-medium transition shadow-sm">
              PDF
            </button>
            <div className="flex items-center text-xs text-slate-600 space-x-1 ml-2">
              <span>Show</span>
              <select 
                value={entries}
                onChange={(e) => setEntries(e.target.value)}
                className="border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-600">Search:</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-slate-300 rounded px-3 py-1 text-xs w-full sm:w-48 focus:outline-none focus:border-purple-500" 
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-purple-300 rounded">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#6b58e8] text-white text-[11px] font-semibold uppercase tracking-wider">
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">SL</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">INVOICE NO.</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">CONTRACTOR</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">LABOUR/WORKER</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">PARTICULARS</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">QTY/DAYS</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">RATE</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">GROSS</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">SECURITY DEPOSIT</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">PAID</th>
                <th className="p-2.5 whitespace-nowrap">DUE</th>
              </tr>
            </thead>
            <tbody className="text-xs bg-white text-slate-700">
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-8 text-slate-400 italic bg-slate-50">
                    No data available in table
                  </td>
                </tr>
              ) : (
                reportData.map((row) => (
                  <tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-2.5 border-r">{row.sl}</td>
                    <td className="p-2.5 border-r">{row.invoiceNo}</td>
                    <td className="p-2.5 border-r">{row.contractor}</td>
                    <td className="p-2.5 border-r">{row.labourWorker}</td>
                    <td className="p-2.5 border-r">{row.particulars}</td>
                    <td className="p-2.5 border-r">{row.qtyDays}</td>
                    <td className="p-2.5 border-r">{row.rate.toFixed(2)}</td>
                    <td className="p-2.5 border-r font-medium">{row.gross.toFixed(2)}</td>
                    <td className="p-2.5 border-r">{row.securityDeposit.toFixed(2)}</td>
                    <td className="p-2.5 border-r text-emerald-600 font-medium">{row.paid.toFixed(2)}</td>
                    <td className="p-2.5 text-rose-600 font-medium">{row.due.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Grand Total Footer Summary Row */}
            <tfoot>
              <tr className="bg-slate-50 text-xs font-bold text-slate-700 border-t border-slate-300">
                <td colSpan={7} className="p-2.5 text-right uppercase tracking-wider">
                  GRAND TOTAL
                </td>
                <td className="p-2.5">{totalGross.toFixed(2)}</td>
                <td className="p-2.5">{totalSecurityDeposit.toFixed(2)}</td>
                <td className="p-2.5">{totalPaid.toFixed(2)}</td>
                <td className="p-2.5">{totalDue.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>Showing 0 to 0 of 0 entries</span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-slate-100 rounded text-slate-400 cursor-not-allowed" disabled>
              Previous
            </button>
            <button className="px-3 py-1 bg-slate-100 rounded text-slate-400 cursor-not-allowed" disabled>
              Next
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}