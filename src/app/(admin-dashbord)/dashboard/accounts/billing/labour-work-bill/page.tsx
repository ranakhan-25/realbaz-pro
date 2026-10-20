'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Plus, 
  Search, 
  FileSpreadsheet, 
  FileText, 
  X, 
  Calendar, 
  Trash2 
} from 'lucide-react';

interface LabourBillItem {
  id: string;
  labourWorker: string;
  description: string;
  unit: string;
  qtyDays: number;
  rate: number;
  gross: number;
  security: number;
  netPayable: number;
}

export default function LabourWorkerBillPage() {
  // Main Bill Add Modal State
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);

  // Sub-Modals States inside the main modal
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isSelectItemModalOpen, setIsSelectItemModalOpen] = useState(false);

  // Form Field States for the Main Modal
  const [date, setDate] = useState('09/16/2026');
  const [contractor, setContractor] = useState('');
  const [ledger, setLedger] = useState('500-001-003-001-Worker Bill Expanse');
  const [code, setCode] = useState('L/WB00001');
  const [projectType, setProjectType] = useState('');
  const [project, setProject] = useState('');
  const [titleOfWork, setTitleOfWork] = useState('');
  const [site, setSite] = useState('');
  const [refNo, setRefNo] = useState('');
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('');
  const [item, setItem] = useState('');

  // Sub-modal temporary form inputs for adding items
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [newItemRate, setNewItemRate] = useState<number>(0);

  // Table items inside modal
  const [itemsList, setItemsList] = useState<LabourBillItem[]>([
    { id: '1', labourWorker: 'John Doe (Mason)', description: 'Wall casting', unit: 'Days', qtyDays: 5, rate: 1000, gross: 5000, security: 200, netPayable: 4800 }
  ]);

  // Financial fields
  const [vatPercent, setVatPercent] = useState<number>(5);
  const [vatInclude, setVatInclude] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash');

  // Calculations
  const subtotal = itemsList.reduce((acc, curr) => acc + curr.gross, 0);
  const vatAmount = (subtotal * vatPercent) / 100;
  const totalQuantity = itemsList.reduce((acc, curr) => acc + curr.qtyDays, 0);
  const grandTotal = subtotal + (vatInclude ? vatAmount : 0);
  const totalSecurity = itemsList.reduce((acc, curr) => acc + curr.security, 0);
  const totalPayable = itemsList.reduce((acc, curr) => acc + curr.netPayable, 0);

  // Add Item from Sub-Modal
  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    const grossVal = (newItemRate || 1000) * 2;
    const secVal = 100;
    const newItem: LabourBillItem = {
      id: Date.now().toString(),
      labourWorker: newItemName || 'Worker Custom',
      description: newItemDesc || 'General labour work',
      unit: newItemUnit || 'Days',
      qtyDays: 2,
      rate: newItemRate || 1000,
      gross: grossVal,
      security: secVal,
      netPayable: grossVal - secVal
    };
    setItemsList([...itemsList, newItem]);
    setNewItemName('');
    setNewItemDesc('');
    setNewItemUnit('');
    setNewItemRate(0);
    setIsItemModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800">
      
      {/* ================= BREADCRUMB HEADER ================= */}
      <div className="flex items-center text-sm text-slate-600 mb-4 space-x-2">
        <span className="hover:text-blue-600 cursor-pointer">Home</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="hover:text-blue-600 cursor-pointer">Labour/Worker</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="font-semibold text-slate-800">Labour/Worker Bill List</span>
      </div>

      {/* ================= MAIN CONTAINER CARD ================= */}
      <div className="bg-white rounded-md shadow-sm border border-slate-200 p-5 space-y-4">
        
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full xl:w-auto flex-1">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Select Date</label>
              <div className="flex items-center border border-slate-300 rounded px-3 py-1.5 bg-white text-sm">
                <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                <span className="text-slate-700">1 September, 2026 - 30 September, 2026</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Project</label>
              <select className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-sm focus:outline-none">
                <option>Select value</option>
                <option>Commercial Tower Alpha</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Title/Name of Work</label>
              <select className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-sm focus:outline-none">
                <option>Select Title/Name of Work</option>
                <option>Foundation Casting</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Contractor/Supplier/Worker</label>
              <select className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-sm focus:outline-none">
                <option>Select One Option</option>
                <option>Worker Group A</option>
              </select>
            </div>
          </div>

          {/* New Bill Button */}
          <button 
            onClick={() => setIsMainModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm px-4 py-2 rounded flex items-center shadow transition shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" /> +New Labour/Worker Bill
          </button>
        </div>

        <div className="w-full md:w-1/4">
          <label className="block text-xs font-medium text-slate-600 mb-1">Ledger</label>
          <select className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-sm focus:outline-none">
            <option>Select Chart Of Account</option>
            <option>500-001-Worker Bill Expanse</option>
          </select>
        </div>

        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center space-x-2">
            <button className="bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-medium">Excel</button>
            <button className="bg-rose-600 text-white px-3 py-1.5 rounded text-xs font-medium">PDF</button>
            <div className="flex items-center text-xs text-slate-600 space-x-1 ml-2">
              <span>Show</span>
              <select className="border border-slate-300 rounded px-2 py-1 bg-white"><option>10</option></select>
              <span>entries</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-600">Search:</span>
            <input type="text" className="border border-slate-300 rounded px-3 py-1 text-sm w-full sm:w-48" />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-purple-300 rounded">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#6b58e8] text-white text-[11px] uppercase tracking-wider">
                <th className="p-2.5 border-r border-purple-400">ID</th>
                <th className="p-2.5 border-r border-purple-400">Project Type</th>
                <th className="p-2.5 border-r border-purple-400">Project</th>
                <th className="p-2.5 border-r border-purple-400">Title/Name of Work</th>
                <th className="p-2.5 border-r border-purple-400">Worker/Contractor/Supplier</th>
                <th className="p-2.5 border-r border-purple-400">Dr Ledger</th>
                <th className="p-2.5 border-r border-purple-400">Credit Ledger</th>
                <th className="p-2.5 border-r border-purple-400">Code</th>
                <th className="p-2.5 border-r border-purple-400">Date</th>
                <th className="p-2.5 border-r border-purple-400">Grand Total</th>
                <th className="p-2.5 border-r border-purple-400">Paid</th>
                <th className="p-2.5 border-r border-purple-400">Due</th>
                <th className="p-2.5 border-r border-purple-400">Added By</th>
                <th className="p-2.5 border-r border-purple-400">Approve</th>
                <th className="p-2.5 border-r border-purple-400">Attachment</th>
                <th className="p-2.5">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs bg-white text-slate-700">
              <tr>
                <td colSpan={16} className="text-center py-8 text-slate-400 italic bg-slate-50">
                  No data available in table
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t border-slate-200 font-semibold text-xs">
                <td colSpan={9} className="p-3 text-right">TOTAL:</td>
                <td className="p-3">0</td>
                <td className="p-3">0</td>
                <td className="p-3">0</td>
                <td colSpan={4}></td>
              </tr>
            </tfoot>
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

      {/* ================= MAIN MODAL: LABOUR/WORKER BILL ADD ================= */}
      {isMainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 overflow-y-auto">
          <div className="bg-slate-50 w-full max-w-7xl rounded-lg shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[95vh]">
            
            {/* Header */}
            <div className="bg-[#6b58e8] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs sm:text-sm">
                <span>Home</span><span>›</span>
                <span>Labour/Worker Bill</span><span>›</span>
                <span className="font-semibold">Labour/Worker Bill Add</span>
              </div>
              <button onClick={() => setIsMainModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              
              {/* Top Action Pills with individual sub-modal triggers */}
              <div className="flex justify-end space-x-2">
                <button onClick={() => setIsItemModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded flex items-center shadow-sm">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Item Add
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded flex items-center shadow-sm">
                  Labour/Worker Bill List
                </button>
              </div>

              {/* Form Input Rows */}
              <div className="bg-white p-3 rounded border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Date</label>
                  <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Contractor</label>
                  <select value={contractor} onChange={(e) => setContractor(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                    <option value="">Select One Option</option>
                    <option value="ABC Contractor">ABC Contractor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Ledger</label>
                  <div className="flex items-center border rounded bg-white">
                    <input type="text" value={ledger} onChange={(e) => setLedger(e.target.value)} className="w-full px-2.5 py-1.5 bg-transparent border-none outline-none text-xs" />
                    <button className="text-slate-400 hover:text-slate-600 px-1.5">×</button>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Code</label>
                  <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Project Type</label>
                  <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                    <option value="">Select value</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Project</label>
                  <select value={project} onChange={(e) => setProject(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                    <option value="">Select Project</option>
                    <option value="Project Alpha">Project Alpha</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Title/Name of Work</label>
                  <select value={titleOfWork} onChange={(e) => setTitleOfWork(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                    <option value="">Select Title/Name of Work</option>
                    <option value="Casting Work">Casting Work</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Site</label>
                  <select value={site} onChange={(e) => setSite(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                    <option value="">Select Site</option>
                    <option value="Site A">Site A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Ref W/O No.</label>
                  <input type="text" placeholder="PO No." value={refNo} onChange={(e) => setRefNo(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">If Task</label>
                  <select value={task} onChange={(e) => setTask(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                    <option value="">Select Task</option>
                    <option value="Task 1">Task 1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                    <option value="">Select Category</option>
                    <option value="Category 1">Category 1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Select Item</label>
                  <div className="flex space-x-1">
                    <select value={item} onChange={(e) => setItem(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                      <option value="">Select Item</option>
                      <option value="Item 1">Item 1</option>
                    </select>
                    {/* Select Item Plus Button triggers Sub-Modal */}
                    <button 
                      type="button" 
                      onClick={() => setIsSelectItemModalOpen(true)}
                      className="bg-purple-600 text-white px-2.5 rounded hover:bg-purple-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto border border-purple-300 rounded">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#6b58e8] text-white uppercase">
                      <th className="p-2 border-r border-purple-400">Labour/Worker</th>
                      <th className="p-2 border-r border-purple-400">Description</th>
                      <th className="p-2 border-r border-purple-400">Unit</th>
                      <th className="p-2 border-r border-purple-400">Qty/Days</th>
                      <th className="p-2 border-r border-purple-400">Rate</th>
                      <th className="p-2 border-r border-purple-400">Gross</th>
                      <th className="p-2 border-r border-purple-400">Security</th>
                      <th className="p-2 border-r border-purple-400">Net Payable</th>
                      <th className="p-2 text-center">Action <Plus className="w-3 h-3 inline ml-1 bg-emerald-500 rounded text-white" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsList.map((it, idx) => (
                      <tr key={it.id} className="bg-white border-b border-slate-200">
                        <td className="p-2"><input type="text" value={it.labourWorker} onChange={(e) => {
                          const updated = [...itemsList];
                          updated[idx].labourWorker = e.target.value;
                          setItemsList(updated);
                        }} className="border rounded px-1.5 py-1 w-full" /></td>
                        <td className="p-2"><input type="text" value={it.description} onChange={(e) => {
                          const updated = [...itemsList];
                          updated[idx].description = e.target.value;
                          setItemsList(updated);
                        }} className="border rounded px-1.5 py-1 w-full" /></td>
                        <td className="p-2"><input type="text" value={it.unit} onChange={(e) => {
                          const updated = [...itemsList];
                          updated[idx].unit = e.target.value;
                          setItemsList(updated);
                        }} className="border rounded px-1.5 py-1 w-full" /></td>
                        <td className="p-2"><input type="number" value={it.qtyDays} onChange={(e) => {
                          const val = Number(e.target.value);
                          const updated = [...itemsList];
                          updated[idx].qtyDays = val;
                          updated[idx].gross = val * updated[idx].rate;
                          updated[idx].netPayable = updated[idx].gross - updated[idx].security;
                          setItemsList(updated);
                        }} className="border rounded px-1.5 py-1 w-full" /></td>
                        <td className="p-2"><input type="number" value={it.rate} onChange={(e) => {
                          const val = Number(e.target.value);
                          const updated = [...itemsList];
                          updated[idx].rate = val;
                          updated[idx].gross = updated[idx].qtyDays * val;
                          updated[idx].netPayable = updated[idx].gross - updated[idx].security;
                          setItemsList(updated);
                        }} className="border rounded px-1.5 py-1 w-full" /></td>
                        <td className="p-2 font-semibold">{it.gross}</td>
                        <td className="p-2"><input type="number" value={it.security} onChange={(e) => {
                          const val = Number(e.target.value);
                          const updated = [...itemsList];
                          updated[idx].security = val;
                          updated[idx].netPayable = updated[idx].gross - val;
                          setItemsList(updated);
                        }} className="border rounded px-1.5 py-1 w-16" /></td>
                        <td className="p-2 font-bold text-emerald-600">{it.netPayable}</td>
                        <td className="p-2 text-center">
                          <button onClick={() => setItemsList(itemsList.filter(i => i.id !== it.id))} className="text-rose-500">
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculation Table */}
              <div className="overflow-x-auto border border-purple-300 rounded">
                <table className="w-full text-left border-collapse text-xs bg-white">
                  <thead>
                    <tr className="bg-[#6b58e8] text-white uppercase text-[11px]">
                      <th className="p-2 border-r border-purple-400">Subtotal</th>
                      <th className="p-2 border-r border-purple-400">VAT(%) If Include:</th>
                      <th className="p-2 border-r border-purple-400">VAT Amount</th>
                      <th className="p-2 border-r border-purple-400">Total Quantity</th>
                      <th className="p-2 border-r border-purple-400">Grand Total</th>
                      <th className="p-2 border-r border-purple-400">Total Security</th>
                      <th className="p-2 border-r border-purple-400">Total Payable</th>
                      <th className="p-2 border-r border-purple-400">Payment Method</th>
                      <th className="p-2">Attachment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-slate-700">
                      <td className="p-2 font-medium">{subtotal}</td>
                      <td className="p-2 flex items-center space-x-2">
                        <input type="checkbox" checked={vatInclude} onChange={(e) => setVatInclude(e.target.checked)} />
                        <input type="number" value={vatPercent} onChange={(e) => setVatPercent(Number(e.target.value))} className="border rounded px-1 py-0.5 w-16" />
                      </td>
                      <td className="p-2">{vatInclude ? vatAmount : 0}</td>
                      <td className="p-2">{totalQuantity}</td>
                      <td className="p-2 font-bold text-slate-900">{grandTotal}</td>
                      <td className="p-2 font-medium text-amber-600">{totalSecurity}</td>
                      <td className="p-2 font-bold text-emerald-600">{totalPayable}</td>
                      <td className="p-2">
                        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="border rounded px-2 py-1 bg-white">
                          <option value="Cash">Cash</option>
                          <option value="Cheque">Cheque</option>
                          <option value="Bank">Bank</option>
                        </select>
                      </td>
                      <td className="p-2"><input type="file" className="text-[10px] w-40" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>

            {/* Modal Footer Submit Button */}
            <div className="bg-slate-100 px-4 py-3 border-t border-slate-200 flex justify-center">
              <button 
                onClick={() => setIsMainModalOpen(false)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-8 py-2 rounded shadow text-sm transition"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      )}


      {/* ================= SUB-MODAL 1: ITEM ADD FORM ================= */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl border border-purple-300 overflow-hidden">
            <div className="bg-[#6b58e8] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Add Labour Bill Item</h3>
              <button onClick={() => setIsItemModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveNewItem} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Labour/Worker Name*</label>
                <input type="text" required placeholder="Enter worker name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Description</label>
                <input type="text" placeholder="Enter work description" value={newItemDesc} onChange={(e) => setNewItemDesc(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Unit</label>
                  <input type="text" placeholder="Days / Pcs" value={newItemUnit} onChange={(e) => setNewItemUnit(e.target.value)} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Rate*</label>
                  <input type="number" required placeholder="0.00" value={newItemRate} onChange={(e) => setNewItemRate(Number(e.target.value))} className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button type="button" onClick={() => setIsItemModalOpen(false)} className="px-4 py-1.5 border rounded bg-slate-100 text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-purple-600 text-white rounded font-medium hover:bg-purple-700">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ================= SUB-MODAL 2: SELECT ITEM QUICK ADD ================= */}
      {isSelectItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl border border-purple-300 overflow-hidden">
            <div className="bg-[#6b58e8] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Quick Add Item Catalog</h3>
              <button onClick={() => setIsSelectItemModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Item Title</label>
                <input type="text" placeholder="Enter catalog item title" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Category Code</label>
                <input type="text" placeholder="CAT-W01" className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button type="button" onClick={() => setIsSelectItemModalOpen(false)} className="px-4 py-1.5 border rounded bg-slate-100 text-slate-600">Cancel</button>
                <button type="button" onClick={() => { alert('Catalog Item Created!'); setIsSelectItemModalOpen(false); }} className="px-4 py-1.5 bg-purple-600 text-white rounded font-medium hover:bg-purple-700">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}