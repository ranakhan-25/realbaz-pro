'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Plus, 
  Search, 
  X, 
  Trash2, 
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
  Smile 
} from 'lucide-react';

interface ContractorWorkOrderItem {
  id: string;
  itemName: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function ContractorWorkOrderPage() {
  // Main Modal State for Contractor Work Order Add
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);

  // Sub-Modals States
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isContractorModalOpen, setIsContractorModalOpen] = useState(false);

  // Form Field States
  const [date, setDate] = useState('09/16/2026');
  const [supplier, setSupplier] = useState('');
  const [code, setCode] = useState('CW00001');
  const [projectType, setProjectType] = useState('');
  const [project, setProject] = useState('');
  const [site, setSite] = useState('');
  const [category, setCategory] = useState('');
  const [selectItem, setSelectItem] = useState('');

  // Rich Text Editors Content State
  const [contentBody, setContentBody] = useState('');
  const [contentFooter, setContentFooter] = useState('');

  // Sub-modal temporary inputs for Item Add
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [newItemRate, setNewItemRate] = useState<number>(0);

  // Items List in Table
  const [itemsList, setItemsList] = useState<ContractorWorkOrderItem[]>([
    { id: '1', itemName: 'Labor Service (Subcontract)', description: 'Foundation casting support', unit: 'Days', quantity: 10, rate: 1200, amount: 12000 }
  ]);

  // Financial configuration
  const [vatPercent, setVatPercent] = useState<number>(5);
  const [vatInclude, setVatInclude] = useState<boolean>(false);
  const [aitPercent, setAitPercent] = useState<number>(2);
  const [aitInclude, setAitInclude] = useState<boolean>(false);

  // Calculations
  const subtotal = itemsList.reduce((acc, curr) => acc + curr.amount, 0);
  const vatAmount = (subtotal * vatPercent) / 100;
  const aitAmount = (subtotal * aitPercent) / 100;
  const grandTotal = subtotal + (vatInclude ? vatAmount : 0) + (aitInclude ? aitAmount : 0);

  // Handle Add Item from Sub-Modal
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = 3;
    const rate = newItemRate || 1000;
    const newItem: ContractorWorkOrderItem = {
      id: Date.now().toString(),
      itemName: newItemName || 'Contractor Task Item',
      description: newItemDesc || 'Contractor specialized task',
      unit: newItemUnit || 'Jobs',
      quantity: qty,
      rate: rate,
      amount: qty * rate
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
        <span className="hover:text-blue-600 cursor-pointer">Billing</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="font-semibold text-slate-800">Contractor Work Order List</span>
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
            <Plus className="w-4 h-4 mr-1.5" /> +Contractor Work Order
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
                <th className="p-2.5 border-r border-purple-400">Contractor Name</th>
                <th className="p-2.5 border-r border-purple-400">W/O No</th>
                <th className="p-2.5 border-r border-purple-400">Ref Invoice No</th>
                <th className="p-2.5 border-r border-purple-400">Date</th>
                <th className="p-2.5 border-r border-purple-400">Sub Total</th>
                <th className="p-2.5 border-r border-purple-400">Vat</th>
                <th className="p-2.5 border-r border-purple-400">Discount</th>
                <th className="p-2.5 border-r border-purple-400">Grand Total</th>
                <th className="p-2.5 border-r border-purple-400">Added By</th>
                <th className="p-2.5 border-r border-purple-400">Approve</th>
                <th className="p-2.5 border-r border-purple-400">Attachment</th>
                <th className="p-2.5">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs bg-white text-slate-700">
              <tr>
                <td colSpan={13} className="text-center py-8 text-slate-400 italic bg-slate-50">
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

      {/* ================= MAIN MODAL: CONTRACTOR WORKORDER ADD ================= */}
      {isMainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 overflow-y-auto">
          <div className="bg-slate-50 w-full max-w-7xl rounded-lg shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[95vh]">
            
            {/* Modal Header */}
            <div className="bg-[#6b58e8] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs sm:text-sm">
                <span>Home</span><span>›</span>
                <span>Billing</span><span>›</span>
                <span className="font-semibold">Contractor Workorder</span>
              </div>
              <button onClick={() => setIsMainModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              
              {/* Top Action Navigation Buttons */}
              <div className="flex justify-end space-x-2">
                <button onClick={() => setIsItemModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded shadow-sm">
                  Add Item
                </button>
                <button onClick={() => setIsContractorModalOpen(true)} className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs px-3 py-1.5 rounded shadow-sm">
                  +Contractor/Worker Add
                </button>
                <button onClick={() => setIsMainModalOpen(false)} className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1.5 rounded shadow-sm">
                  Work Order List
                </button>
              </div>

              {/* Form Inputs Grid */}
              <div className="bg-white p-3 rounded border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Date</label>
                  <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Supplier</label>
                  <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                    <option value="">Select One Option</option>
                    <option value="Supplier A">Supplier A</option>
                  </select>
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
                  <label className="block text-slate-600 font-medium mb-1">Site</label>
                  <input type="text" placeholder="Select Site" value={site} onChange={(e) => setSite(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-slate-600 font-medium mb-1">Attachment</label>
                  <input type="file" className="text-[11px] w-full border rounded px-2 py-1 bg-white" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                    <option value="">Select Category</option>
                    <option value="Cat 1">Cat 1</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-slate-600 font-medium mb-1">Select Item</label>
                  <div className="flex space-x-1">
                    <select value={selectItem} onChange={(e) => setSelectItem(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                      <option value="">Select Item</option>
                      <option value="Item 1">Item 1</option>
                    </select>
                    <button type="button" onClick={() => setIsItemModalOpen(true)} className="bg-purple-600 text-white px-3 rounded hover:bg-purple-700">+</button>
                  </div>
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
                  rows={4} 
                  value={contentBody} 
                  onChange={(e) => setContentBody(e.target.value)}
                  placeholder="Type content body here..." 
                  className="w-full p-3 text-xs focus:outline-none bg-white"
                ></textarea>
                <div className="bg-slate-50 px-3 py-1 border-t text-[10px] text-slate-400 text-right">0 WORDS POWERED BY TINY</div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto border border-purple-300 rounded">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#6b58e8] text-white uppercase">
                      <th className="p-2 border-r border-purple-400">Item Name</th>
                      <th className="p-2 border-r border-purple-400">Description</th>
                      <th className="p-2 border-r border-purple-400">Unit</th>
                      <th className="p-2 border-r border-purple-400">Quantity</th>
                      <th className="p-2 border-r border-purple-400">Rate</th>
                      <th className="p-2 border-r border-purple-400">Image</th>
                      <th className="p-2 border-r border-purple-400">Amount</th>
                      <th className="p-2 text-center">Action <Plus className="w-3 h-3 inline ml-1 bg-emerald-500 rounded text-white" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsList.map((it, idx) => (
                      <tr key={it.id} className="bg-white border-b border-slate-200">
                        <td className="p-2"><input type="text" value={it.itemName} onChange={(e) => {
                          const updated = [...itemsList];
                          updated[idx].itemName = e.target.value;
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
                        <td className="p-2"><input type="number" value={it.quantity} onChange={(e) => {
                          const q = Number(e.target.value);
                          const updated = [...itemsList];
                          updated[idx].quantity = q;
                          updated[idx].amount = q * updated[idx].rate;
                          setItemsList(updated);
                        }} className="border rounded px-1.5 py-1 w-full" /></td>
                        <td className="p-2"><input type="number" value={it.rate} onChange={(e) => {
                          const r = Number(e.target.value);
                          const updated = [...itemsList];
                          updated[idx].rate = r;
                          updated[idx].amount = updated[idx].quantity * r;
                          setItemsList(updated);
                        }} className="border rounded px-1.5 py-1 w-full" /></td>
                        <td className="p-2 text-slate-400">No image</td>
                        <td className="p-2 font-semibold">{it.amount}</td>
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

              {/* ================= CONTENT FOOTER (TinyMCE Simulator) ================= */}
              <div className="bg-white border border-slate-300 rounded overflow-hidden">
                <div className="bg-slate-100 px-3 py-1.5 border-b text-xs font-semibold text-slate-700">Content Footer</div>
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
                </div>
                <textarea 
                  rows={3} 
                  value={contentFooter} 
                  onChange={(e) => setContentFooter(e.target.value)}
                  placeholder="Type content footer here..." 
                  className="w-full p-3 text-xs focus:outline-none bg-white"
                ></textarea>
                <div className="bg-slate-50 px-3 py-1 border-t text-[10px] text-slate-400 text-right">0 WORDS POWERED BY TINY</div>
              </div>

              {/* Financial Calculation Panel */}
              <div className="bg-white p-4 rounded border border-purple-300 max-w-xl ml-auto space-y-2 text-xs">
                <div className="grid grid-cols-2 items-center border-b pb-2">
                  <span className="font-semibold text-slate-700">Subtotal :</span>
                  <div className="bg-slate-100 p-1.5 rounded font-bold text-slate-800">{subtotal}</div>
                </div>

                <div className="grid grid-cols-2 items-center border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-700">VAT(%) :</span>
                    <span className="text-blue-600 cursor-pointer">If Include:</span>
                    <input type="checkbox" checked={vatInclude} onChange={(e) => setVatInclude(e.target.checked)} />
                  </div>
                  <input type="number" value={vatPercent} onChange={(e) => setVatPercent(Number(e.target.value))} className="border rounded px-2 py-1 w-full" />
                </div>

                <div className="grid grid-cols-2 items-center border-b pb-2">
                  <span className="font-semibold text-slate-700">VAT(Amount) :</span>
                  <div className="bg-orange-50 p-1.5 rounded text-slate-800">{vatInclude ? vatAmount : 0.00}</div>
                </div>

                <div className="grid grid-cols-2 items-center border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-700">AIT(%) :</span>
                    <span className="text-emerald-600 cursor-pointer">If Include:</span>
                    <input type="checkbox" checked={aitInclude} onChange={(e) => setAitInclude(e.target.checked)} />
                  </div>
                  <input type="number" value={aitPercent} onChange={(e) => setAitPercent(Number(e.target.value))} className="border rounded px-2 py-1 w-full" />
                </div>

                <div className="grid grid-cols-2 items-center border-b pb-2">
                  <span className="font-semibold text-slate-700">AIT(Amount) :</span>
                  <div className="bg-orange-50 p-1.5 rounded text-slate-800">{aitInclude ? aitAmount : 0.00}</div>
                </div>

                <div className="grid grid-cols-2 items-center pt-1">
                  <span className="font-bold text-slate-800">Grand Total :</span>
                  <div className="bg-emerald-500 text-white p-1.5 rounded font-bold">{grandTotal}</div>
                </div>
              </div>

            </div>

            {/* Modal Submit Footer */}
            <div className="bg-slate-100 px-4 py-3 border-t border-slate-200 flex justify-end">
              <button 
                onClick={() => setIsMainModalOpen(false)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded shadow text-sm transition"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= SUB-MODAL 1: ADD ITEM ================= */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl border border-purple-300 overflow-hidden">
            <div className="bg-[#6b58e8] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Add New Item</h3>
              <button onClick={() => setIsItemModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveItem} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Item Name*</label>
                <input type="text" required placeholder="Enter item name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Description</label>
                <input type="text" placeholder="Enter description" value={newItemDesc} onChange={(e) => setNewItemDesc(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Unit</label>
                  <input type="text" placeholder="Jobs / Days" value={newItemUnit} onChange={(e) => setNewItemUnit(e.target.value)} className="w-full border rounded px-3 py-2" />
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

      {/* ================= SUB-MODAL 2: CONTRACTOR/WORKER ADD ================= */}
      {isContractorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl border border-purple-300 overflow-hidden">
            <div className="bg-cyan-600 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">+Contractor/Worker Add</h3>
              <button onClick={() => setIsContractorModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Contractor Name*</label>
                <input type="text" placeholder="Enter contractor name" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Phone Number</label>
                <input type="text" placeholder="01XXXXXXXXX" className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button type="button" onClick={() => setIsContractorModalOpen(false)} className="px-4 py-1.5 border rounded bg-slate-100 text-slate-600">Cancel</button>
                <button type="button" onClick={() => { alert('Contractor Saved Successfully!'); setIsContractorModalOpen(false); }} className="px-4 py-1.5 bg-cyan-600 text-white rounded font-medium hover:bg-cyan-700">Save Contractor</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}