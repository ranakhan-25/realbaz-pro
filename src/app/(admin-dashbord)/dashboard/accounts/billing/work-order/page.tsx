'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Plus, 
  Search, 
  Calendar, 
  X, 
  Trash2 
} from 'lucide-react';

interface WorkOrderItem {
  id: string;
  itemName: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function WorkOrderPage() {
  // Main Modal State for Work Order Add
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);

  // Sub-Modals States
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Form Field States
  const [date, setDate] = useState('09/16/2026');
  const [customer, setCustomer] = useState('');
  const [code, setCode] = useState('CW00003');
  const [projectType, setProjectType] = useState('');
  const [project, setProject] = useState('');
  const [site, setSite] = useState('');
  const [clientOrderNo, setClientOrderNo] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [searchItem, setSearchItem] = useState('');

  // Sub-modal temporary inputs for Item Add
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [newItemRate, setNewItemRate] = useState<number>(0);

  // Items List in Table
  const [itemsList, setItemsList] = useState<WorkOrderItem[]>([
    { id: '1', itemName: 'Steel Rod 16mm', description: 'High strength reinforcement', unit: 'Pcs', quantity: 10, rate: 500, amount: 5000 }
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
    const qty = 5;
    const rate = newItemRate || 500;
    const newItem: WorkOrderItem = {
      id: Date.now().toString(),
      itemName: newItemName || 'Generic Material',
      description: newItemDesc || 'Standard quality',
      unit: newItemUnit || 'Pcs',
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
        <span className="font-semibold text-slate-800">Work Order List</span>
      </div>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="bg-white rounded-md shadow-sm border border-slate-200 p-5 space-y-4">
        
        {/* Top Filters & Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-2/3">
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
                <option>Commercial Tower</option>
              </select>
            </div>
          </div>

          <button 
            onClick={() => setIsMainModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm px-4 py-2 rounded flex items-center shadow transition shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" /> +New Work Order
          </button>
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
                <th className="p-2.5 border-r border-purple-400">Customer Name</th>
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

      {/* ================= MAIN MODAL: WORK ORDER ADD ================= */}
      {isMainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 overflow-y-auto">
          <div className="bg-slate-50 w-full max-w-7xl rounded-lg shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[95vh]">
            
            {/* Modal Header */}
            <div className="bg-[#6b58e8] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs sm:text-sm">
                <span>Home</span><span>›</span>
                <span>Billing</span><span>›</span>
                <span className="font-semibold">Workorder</span>
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
                <button onClick={() => setIsContactModalOpen(true)} className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs px-3 py-1.5 rounded shadow-sm">
                  Add Contact
                </button>
                <button onClick={() => setIsMainModalOpen(false)} className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded shadow-sm">
                  Work Order List
                </button>
              </div>

              {/* Form Inputs Grid */}
              <div className="bg-white p-3 rounded border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Date</label>
                  <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Customer</label>
                  <select value={customer} onChange={(e) => setCustomer(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                    <option value="">Select One Option</option>
                    <option value="Customer A">Customer A</option>
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
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Client Order No.</label>
                  <input type="text" placeholder="PO No." value={clientOrderNo} onChange={(e) => setClientOrderNo(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-slate-600 font-medium mb-1">Attachment</label>
                  <input type="file" className="text-[11px] w-full border rounded px-2 py-1 bg-white" />
                </div>
              </div>

              {/* Secondary Select Filters */}
              <div className="bg-white p-3 rounded border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                    <option value="">Select Category</option>
                    <option value="Cat 1">Cat 1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Sub Category</label>
                  <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                    <option value="">Select Sub Category</option>
                    <option value="SubCat 1">SubCat 1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Select Item (Product / Material)*</label>
                  <input type="text" placeholder="Search Item / Product / Material..." value={searchItem} onChange={(e) => setSearchItem(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white" />
                </div>
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

              {/* Financial Calculation Panel matching Image 2 */}
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
                  <input type="text" placeholder="Pcs / Kg" value={newItemUnit} onChange={(e) => setNewItemUnit(e.target.value)} className="w-full border rounded px-3 py-2" />
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

      {/* ================= SUB-MODAL 2: ADD CONTACT ================= */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl border border-purple-300 overflow-hidden">
            <div className="bg-cyan-600 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Add New Contact</h3>
              <button onClick={() => setIsContactModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Contact Name*</label>
                <input type="text" placeholder="Enter customer/contact name" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Phone Number</label>
                <input type="text" placeholder="01XXXXXXXXX" className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button type="button" onClick={() => setIsContactModalOpen(false)} className="px-4 py-1.5 border rounded bg-slate-100 text-slate-600">Cancel</button>
                <button type="button" onClick={() => { alert('Contact Saved Successfully!'); setIsContactModalOpen(false); }} className="px-4 py-1.5 bg-cyan-600 text-white rounded font-medium hover:bg-cyan-700">Save Contact</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}