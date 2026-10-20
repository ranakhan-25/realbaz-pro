'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Search, 
  FileSpreadsheet, 
  FileText 
} from 'lucide-react';

interface SaleReportItem {
  id: number;
  agreementDate: string;
  handoverDate: string;
  code: string;
  project: string;
  flatLandNo: string;
  customerName: string;
  rate: number;
  otherCost: number;
  parking: number;
  utilityCharge: number;
  discount: number;
  subtotal: number;
  grandTotal: number;
  collection: number;
  remaining: number;
  salesBy: string;
}

export default function FlatLandSaleReportPage() {
  // Filter & Search States
  const [selectedDate, setSelectedDate] = useState('1 September, 2026 - 30 September, 2026');
  const [salesByFilter, setSalesByFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);

  // Report Data State with initial sample items
  const [reports, setReports] = useState<SaleReportItem[]>([
    {
      id: 1,
      agreementDate: '2026-09-05',
      handoverDate: '2027-12-31',
      code: 'SaleOffer-1074184',
      project: 'Sheba Eyecon Tower',
      flatLandNo: 'F 2',
      customerName: 'Sagor kumar',
      rate: 9000,
      otherCost: 50000,
      parking: 300000,
      utilityCharge: 200000,
      discount: 0,
      subtotal: 11070000,
      grandTotal: 11570000,
      collection: 2000000,
      remaining: 9570000,
      salesBy: 'Tazmul Reza'
    },
    {
      id: 2,
      agreementDate: '2026-09-08',
      handoverDate: '2028-06-30',
      code: 'SaleOffer-7981177',
      project: 'Sheba Eyecon Tower',
      flatLandNo: 'F 4',
      customerName: 'Mr. Raju raz',
      rate: 6000,
      otherCost: 20000,
      parking: 300000,
      utilityCharge: 200000,
      discount: 10000,
      subtotal: 7380000,
      grandTotal: 7890000,
      collection: 1500000,
      remaining: 6390000,
      salesBy: 'Mohin Uddin'
    }
  ]);

  // Filtering Logic
  const filteredReports = reports.filter(r => {
    const matchesSalesBy = salesByFilter ? r.salesBy.toLowerCase().includes(salesByFilter.toLowerCase()) : true;
    const matchesProject = projectFilter ? r.project.toLowerCase().includes(projectFilter.toLowerCase()) : true;
    const matchesSearch = searchQuery 
      ? r.code.toLowerCase().includes(searchQuery.toLowerCase()) || r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || r.flatLandNo.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSalesBy && matchesProject && matchesSearch;
  });

  // Calculate Totals dynamically based on filtered items
  const totalRate = filteredReports.reduce((acc, item) => acc + item.rate, 0);
  const totalOtherCost = filteredReports.reduce((acc, item) => acc + item.otherCost, 0);
  const totalParking = filteredReports.reduce((acc, item) => acc + item.parking, 0);
  const totalUtility = filteredReports.reduce((acc, item) => acc + item.utilityCharge, 0);
  const totalDiscount = filteredReports.reduce((acc, item) => acc + item.discount, 0);
  const totalSubtotal = filteredReports.reduce((acc, item) => acc + item.subtotal, 0);
  const totalGrandTotal = filteredReports.reduce((acc, item) => acc + item.grandTotal, 0);
  const totalCollection = filteredReports.reduce((acc, item) => acc + item.collection, 0);
  const totalRemaining = filteredReports.reduce((acc, item) => acc + item.remaining, 0);

  // Pagination Logic
  const itemsPerPage = parseInt(entries);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage) || 1;

  return (
    <div className="min-h-screen bg-slate-100 p-6 font-sans text-slate-800">
      
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center text-sm sm:text-base text-slate-600 space-x-2">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight className="w-5 h-5 text-slate-400" />
          <span className="hover:text-blue-600 cursor-pointer">Flat/Land</span>
          <ChevronRight className="w-5 h-5 text-slate-400" />
          <span className="font-semibold text-slate-900">Flat/Land Sale Report</span>
        </div>
      </div>

      {/* Main Card Container with increased padding and width feel */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 space-y-6">
        
        {/* Filter Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 border-b border-slate-100 text-sm">
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Select Date</label>
            <input 
              type="text" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white text-sm focus:outline-none focus:border-purple-500" 
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Sales By</label>
            <select 
              value={salesByFilter} 
              onChange={(e) => setSalesByFilter(e.target.value)} 
              className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="">Select value</option>
              <option value="Tazmul Reza">Tazmul Reza</option>
              <option value="Mohin Uddin">Mohin Uddin</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Team</label>
            <select 
              value={teamFilter} 
              onChange={(e) => setTeamFilter(e.target.value)} 
              className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="">Select value</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Project</label>
            <select 
              value={projectFilter} 
              onChange={(e) => setProjectFilter(e.target.value)} 
              className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="">Select value</option>
              <option value="Sheba Eyecon Tower">Sheba Eyecon Tower</option>
            </select>
          </div>
        </div>

        {/* Action Buttons (Excel, PDF), Entries & Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => alert('Exporting to Excel...')} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2 shadow transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Excel</span>
            </button>
            <button 
              onClick={() => alert('Exporting to PDF...')} 
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2 shadow transition"
            >
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <div className="flex items-center text-sm text-slate-600 space-x-2 pl-4">
              <span>Show</span>
              <select 
                value={entries} 
                onChange={(e) => { setEntries(e.target.value); setCurrentPage(1); }}
                className="border border-slate-300 rounded-lg px-3.5 py-2 bg-white text-sm"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600 font-medium">Search:</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="border border-slate-300 rounded-lg px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:border-purple-500" 
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-purple-300 rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#6b58e8] text-white font-bold uppercase tracking-wider">
                <th className="p-4 border-r border-purple-400 whitespace-nowrap">ID</th>
                <th className="p-4 border-r border-purple-400 whitespace-nowrap">AGREEMENT DATE</th>
                <th className="p-4 border-r border-purple-400 whitespace-nowrap">HANDOVER DATE</th>
                <th className="p-4 border-r border-purple-400 whitespace-nowrap">CODE</th>
                <th className="p-4 border-r border-purple-400 whitespace-nowrap">PROJECT</th>
                <th className="p-4 border-r border-purple-400 whitespace-nowrap">FLAT/LAND NO</th>
                <th className="p-4 border-r border-purple-400 whitespace-nowrap">CUSTOMER NAME</th>
                <th className="p-4 border-r border-purple-400 whitespace-nowrap">RATE</th>
                <th className="p-4 border-r border-purple-400 whitespace-nowrap">OTHER COST</th>
                <th className="p-4 border-r border-purple-400 whitespace-nowrap">PARKING</th>
                <th className="p-4 border-r border-purple-400 whitespace-nowrap">UTILITY CHARGE</th>
                <th className="p-4 border-r border-purple-400 whitespace-nowrap">DISCOUNT</th>
                <th className="p-4 border-r border-purple-400 whitespace-nowrap">SUBTOTAL</th>
                <th className="p-4 border-r border-purple-400 whitespace-nowrap">GRAND TOTAL</th>
                <th className="p-4 border-r border-purple-400 whitespace-nowrap">COLLECTION</th>
                <th className="p-4 border-r border-purple-400 whitespace-nowrap">REMAINING</th>
                <th className="p-4 whitespace-nowrap">SALES BY</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-700 text-sm">
              {currentReports.length === 0 ? (
                <tr>
                  <td colSpan={17} className="text-center py-12 text-slate-400 italic bg-slate-50 text-base">
                    No data available in table
                  </td>
                </tr>
              ) : (
                currentReports.map((report) => (
                  <tr key={report.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="p-4 border-r">{report.id}</td>
                    <td className="p-4 border-r">{report.agreementDate}</td>
                    <td className="p-4 border-r">{report.handoverDate}</td>
                    <td className="p-4 border-r font-semibold text-slate-900">{report.code}</td>
                    <td className="p-4 border-r">{report.project}</td>
                    <td className="p-4 border-r text-blue-600 font-semibold">{report.flatLandNo}</td>
                    <td className="p-4 border-r">{report.customerName}</td>
                    <td className="p-4 border-r">{report.rate.toLocaleString()}</td>
                    <td className="p-4 border-r">{report.otherCost.toLocaleString()}</td>
                    <td className="p-4 border-r">{report.parking.toLocaleString()}</td>
                    <td className="p-4 border-r">{report.utilityCharge.toLocaleString()}</td>
                    <td className="p-4 border-r">{report.discount.toLocaleString()}</td>
                    <td className="p-4 border-r">{report.subtotal.toLocaleString()}</td>
                    <td className="p-4 border-r">{report.grandTotal.toLocaleString()}</td>
                    <td className="p-4 border-r">{report.collection.toLocaleString()}</td>
                    <td className="p-4 border-r">{report.remaining.toLocaleString()}</td>
                    <td className="p-4">{report.salesBy}</td>
                  </tr>
                ))
              )}

              {/* TOTAL ROW */}
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300 text-sm">
                <td colSpan={7} className="p-4 border-r text-right">TOTAL:</td>
                <td className="p-4 border-r">{totalRate.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td className="p-4 border-r">{totalOtherCost.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td className="p-4 border-r">{totalParking.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td className="p-4 border-r">{totalUtility.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td className="p-4 border-r">{totalDiscount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td className="p-4 border-r">{totalSubtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td className="p-4 border-r">{totalGrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td className="p-4 border-r">{totalCollection.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td className="p-4 border-r">{totalRemaining.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td className="p-4"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex flex-wrap items-center justify-between text-sm text-slate-600 pt-4 gap-2">
          <span>Showing {filteredReports.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredReports.length)} of {filteredReports.length} entries</span>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
              className={`px-4 py-2 rounded-lg font-medium ${currentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button 
                key={page} 
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg font-semibold ${currentPage === page ? 'bg-purple-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
              className={`px-4 py-2 rounded-lg font-medium ${currentPage === totalPages || totalPages === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}