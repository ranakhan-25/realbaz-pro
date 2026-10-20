'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Plus, 
  Search, 
  X, 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Image as ImageIcon, 
  Printer, 
  Eye, 
  Smile,
  Calendar
} from 'lucide-react';

export default function PeriodBillPage() {
  // Main Modal State for New Period Billing Add
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);

  // Form Field States
  const [date, setDate] = useState('09/16/2026');
  const [customer, setCustomer] = useState('');
  const [ledger, setLedger] = useState('');
  const [code, setCode] = useState('PB00001');
  const [site, setSite] = useState('');
  const [refWNo, setRefWNo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [project, setProject] = useState('');
  const [projectCost, setProjectCost] = useState<number | ''>('');
  const [percentage, setPercentage] = useState<number | ''>('');
  
  // Calculated Grand Total
  const grandTotal = (typeof projectCost === 'number' && typeof percentage === 'number') 
    ? (projectCost * percentage) / 100 
    : '';

  // Rich Text Editor Content State
  const [contentBody, setContentBody] = useState('');

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800">
      
      {/* ================= BREADCRUMB HEADER ================= */}
      <div className="flex items-center text-sm text-slate-600 mb-4 space-x-2">
        <span className="hover:text-blue-600 cursor-pointer">Home</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="hover:text-blue-600 cursor-pointer">Billing</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="font-semibold text-slate-800">Period Bill List</span>
      </div>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="bg-white rounded-md shadow-sm border border-slate-200 p-5 space-y-4">
        
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <button className="bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-medium">Excel</button>
            <button className="bg-rose-600 text-white px-3 py-1.5 rounded text-xs font-medium">PDF</button>
            <div className="flex items-center text-xs text-slate-600 space-x-1 ml-2">
              <span>Show</span>
              <select className="border border-slate-300 rounded px-2 py-1 bg-white"><option>10</option></select>
              <span>entries</span>
            </div>
          </div>

          <button 
            onClick={() => setIsMainModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm px-4 py-2 rounded flex items-center shadow transition shrink-0"
          >
            New Period Billing
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-end space-x-2 pt-2">
          <span className="text-xs text-slate-600">Search:</span>
          <input type="text" className="border border-slate-300 rounded px-3 py-1 text-sm w-full sm:w-48" />
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-purple-300 rounded">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#6b58e8] text-white text-[11px] uppercase tracking-wider">
                <th className="p-2.5 border-r border-purple-400">ID</th>
                <th className="p-2.5 border-r border-purple-400">Project Type</th>
                <th className="p-2.5 border-r border-purple-400">Project</th>
                <th className="p-2.5 border-r border-purple-400">Customer Name</th>
                <th className="p-2.5 border-r border-purple-400">Code</th>
                <th className="p-2.5 border-r border-purple-400">Ref</th>
                <th className="p-2.5 border-r border-purple-400">Date</th>
                <th className="p-2.5 border-r border-purple-400">Start Date</th>
                <th className="p-2.5 border-r border-purple-400">End Date</th>
                <th className="p-2.5 border-r border-purple-400">Construction Cost</th>
                <th className="p-2.5 border-r border-purple-400">Service Charge</th>
                <th className="p-2.5 border-r border-purple-400">Added By</th>
                <th className="p-2.5 border-r border-purple-400">Attachment</th>
                <th className="p-2.5">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs bg-white text-slate-700">
              <tr>
                <td colSpan={14} className="text-center py-8 text-slate-400 italic bg-slate-50">
                  No data available in table
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>Showing 0 to 0 of 0 entries</span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-slate-100 rounded text-slate-400 cursor-not-allowed" disabled>Previous</button>
            <button className="px-3 py-1 bg-slate-100 rounded text-slate-400 cursor-not-allowed" disabled>Next</button>
          </div>
        </div>

      </div>

      {/* ================= MAIN MODAL: NEW PERIOD BILLING ================= */}
      {isMainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 overflow-y-auto">
          <div className="bg-slate-50 w-full max-w-7xl rounded-lg shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[95vh]">
            
            {/* Modal Header */}
            <div className="bg-[#6b58e8] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs sm:text-sm">
                <span>Home</span><span>›</span>
                <span>Billing</span><span>›</span>
                <span className="font-semibold">Period Bill List</span>
              </div>
              <button onClick={() => setIsMainModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              
              {/* Top Action Navigation Button */}
              <div className="flex justify-end space-x-2">
                <button onClick={() => setIsMainModalOpen(false)} className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 py-1.5 rounded shadow-sm font-medium">
                  Period Billing List
                </button>
              </div>

              {/* Form Inputs Grid matching Image 2 */}
              <div className="bg-white p-3 rounded border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 text-xs">
                
                {/* Row 1 */}
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Date</label>
                  <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Customer</label>
                  <select value={customer} onChange={(e) => setCustomer(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                    <option value="">Select value</option>
                    <option value="Customer A">Customer A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Ledger</label>
                  <select value={ledger} onChange={(e) => setLedger(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                    <option value="">Select Ledger</option>
                    <option value="Ledger 1">Ledger 1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Code</label>
                  <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Site</label>
                  <input type="text" placeholder="Select Site" value={site} onChange={(e) => setSite(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Ref W/O No.</label>
                  <input type="text" placeholder="PO No." value={refWNo} onChange={(e) => setRefWNo(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white" />
                </div>

                {/* Row 2 */}
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Start Date</label>
                  <input type="text" placeholder="mm/dd/yyyy" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">End Date</label>
                  <input type="text" placeholder="mm/dd/yyyy" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Project</label>
                  <select value={project} onChange={(e) => setProject(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                    <option value="">Select value</option>
                    <option value="Project Alpha">Project Alpha</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Project Cost</label>
                  <input type="number" placeholder="" value={projectCost} onChange={(e) => setProjectCost(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border rounded px-2.5 py-1.5 bg-white" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Percentage</label>
                  <input type="number" placeholder="%" value={percentage} onChange={(e) => setPercentage(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border rounded px-2.5 py-1.5 bg-white" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Grand Total</label>
                  <input type="text" readOnly value={grandTotal} className="w-full border rounded px-2.5 py-1.5 bg-slate-100 font-semibold" />
                </div>

                {/* Row 3 - Attachment */}
                <div className="md:col-span-3">
                  <label className="block text-slate-600 font-medium mb-1">Attachment</label>
                  <input type="file" className="text-[11px] w-full border rounded px-2 py-1 bg-white" />
                </div>

              </div>

              {/* ================= CONTENT BODY (TinyMCE Simulator) ================= */}
              <div className="bg-white border border-slate-300 rounded overflow-hidden">
                <div className="bg-slate-100 px-3 py-1.5 border-b text-xs font-semibold text-slate-700">Content Body</div>
                <div className="bg-slate-50 border-b px-2 py-1 flex flex-wrap items-center gap-1 text-xs text-slate-600">
                  <span className="hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer">File</span>
                  <span className="hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer">Edit</span>
                  <span className="hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer">View</span>
                  <span className="hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer">Insert</span>
                  <span className="hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer">Format</span>
                  <span className="hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer">Tools</span>
                  <span className="hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer">Table</span>
                </div>
                <div className="bg-slate-100/70 border-b px-2 py-1.5 flex flex-wrap items-center gap-2 text-slate-700">
                  <button className="p-1 hover:bg-slate-200 rounded"><Bold className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-slate-200 rounded"><Italic className="w-3.5 h-3.5" /></button>
                  <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>
                  <button className="p-1 hover:bg-slate-200 rounded"><AlignLeft className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-slate-200 rounded"><AlignCenter className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-slate-200 rounded"><AlignRight className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-slate-200 rounded"><AlignJustify className="w-3.5 h-3.5" /></button>
                  <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>
                  <button className="p-1 hover:bg-slate-200 rounded"><List className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-slate-200 rounded"><ListOrdered className="w-3.5 h-3.5" /></button>
                  <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>
                  <button className="p-1 hover:bg-slate-200 rounded"><ImageIcon className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-slate-200 rounded"><Printer className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-slate-200 rounded"><Eye className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-slate-200 rounded"><Smile className="w-3.5 h-3.5" /></button>
                </div>
                <textarea 
                  rows={5} 
                  value={contentBody} 
                  onChange={(e) => setContentBody(e.target.value)}
                  placeholder="Type content body here..." 
                  className="w-full p-3 text-xs focus:outline-none bg-white"
                ></textarea>
                <div className="bg-slate-50 px-3 py-1 border-t text-[10px] text-slate-400 text-right">0 WORDS POWERED BY TINY</div>
              </div>

            </div>

            {/* Modal Submit Footer */}
            <div className="bg-slate-100 px-4 py-3 border-t border-slate-200 flex justify-center">
              <button 
                onClick={() => setIsMainModalOpen(false)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-8 py-2 rounded shadow text-sm transition"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}