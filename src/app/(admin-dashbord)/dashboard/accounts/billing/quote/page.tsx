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

interface QuoteItem {
  id: string;
  itemName: string;
  unit: string;
  quantity: number;
  rate: number;
  details: string;
  amount: number;
}

export default function QuotePage() {
  // Main Modal State for New Quote Add/Offer
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);

  // Sub-Modals States
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Filter States for Quote List View
  const [selectDateFilter, setSelectDateFilter] = useState('1 September, 2026 - 30 September, 2026');
  const [projectFilter, setProjectFilter] = useState('All Projects');
  const [projectTypeFilter, setProjectTypeFilter] = useState('All Project Types');

  // Form Field States
  const [date, setDate] = useState('09/16/2026');
  const [customer, setCustomer] = useState('');
  const [code, setCode] = useState('QU000003');
  const [projectType, setProjectType] = useState('');
  const [project, setProject] = useState('');
  const [site, setSite] = useState('');

  // Item Selectors inside Form
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [selectedItemSearch, setSelectedItemSearch] = useState('');

  // Rich Text Editors Content States
  const [contentBody, setContentBody] = useState('');
  const [contentFooter, setContentFooter] = useState('');

  // Table Items State
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([
    { id: '1', itemName: 'Sample Product/Material', unit: 'Pcs', quantity: 1, rate: 500, details: 'Standard description', amount: 500 }
  ]);

  // Financial calculations
  const [vatPercent, setVatPercent] = useState<number>(0);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const subtotal = quoteItems.reduce((acc, curr) => acc + curr.amount, 0);
  const vatAmount = (subtotal * vatPercent) / 100;
  const discountAmount = (subtotal * discountPercent) / 100;
  const grandTotal = subtotal + vatAmount + deliveryCharge - discountAmount;

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800">
      
      {/* ================= BREADCRUMB HEADER ================= */}
      <div className="flex items-center text-sm text-slate-600 mb-4 space-x-2">
        <span className="hover:text-blue-600 cursor-pointer">Home</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="hover:text-blue-600 cursor-pointer">Billing</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="font-semibold text-slate-800">Quote List</span>
      </div>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="bg-white rounded-md shadow-sm border border-slate-200 p-5 space-y-4">
        
        {/* Top Filters Bar matching Image 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-slate-100 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Select Date</label>
            <input 
              type="text" 
              value={selectDateFilter} 
              onChange={(e) => setSelectDateFilter(e.target.value)} 
              className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white" 
            />
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Project</label>
            <select 
              value={projectFilter} 
              onChange={(e) => setProjectFilter(e.target.value)} 
              className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white"
            >
              <option value="All Projects">All Projects</option>
              <option value="Project Alpha">Project Alpha</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Project Type</label>
            <select 
              value={projectTypeFilter} 
              onChange={(e) => setProjectTypeFilter(e.target.value)} 
              className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white"
            >
              <option value="All Project Types">All Project Types</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
        </div>

        {/* Action & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
          <div className="flex items-center space-x-2">
            <button className="bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-medium">Excel</button>
            <button className="bg-rose-600 text-white px-3 py-1.5 rounded text-xs font-medium">PDF</button>
            <div className="flex items-center text-xs text-slate-600 space-x-1 ml-2">
              <span>Show</span>
              <select className="border border-slate-300 rounded px-2 py-1 bg-white"><option>10</option></select>
              <span>entries</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-600">Search:</span>
            <input type="text" className="border border-slate-300 rounded px-3 py-1 text-sm w-full sm:w-48" />
          </div>

          <button 
            onClick={() => setIsMainModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm px-4 py-2 rounded flex items-center shadow transition shrink-0"
          >
            +New Quote
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-purple-300 rounded">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#6b58e8] text-white text-[11px] uppercase tracking-wider">
                <th className="p-2.5 border-r border-purple-400">ID</th>
                <th className="p-2.5 border-r border-purple-400">Order Code</th>
                <th className="p-2.5 border-r border-purple-400">Date</th>
                <th className="p-2.5 border-r border-purple-400">Project Type</th>
                <th className="p-2.5 border-r border-purple-400">Project</th>
                <th className="p-2.5 border-r border-purple-400">Customer Name</th>
                <th className="p-2.5 border-r border-purple-400">Grand Total</th>
                <th className="p-2.5 border-r border-purple-400">Added By</th>
                <th className="p-2.5 border-r border-purple-400">Approve</th>
                <th className="p-2.5 border-r border-purple-400">Attachment</th>
                <th className="p-2.5">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs bg-white text-slate-700">
              <tr>
                <td colSpan={11} className="text-center py-8 text-slate-400 italic bg-slate-50">
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

      {/* ================= MAIN MODAL: QUOTE ADD/OFFER ================= */}
      {isMainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 overflow-y-auto">
          <div className="bg-slate-50 w-full max-w-7xl rounded-lg shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[95vh]">
            
            {/* Modal Header */}
            <div className="bg-[#6b58e8] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs sm:text-sm">
                <span>Home</span><span>›</span>
                <span>Billing</span><span>›</span>
                <span className="font-semibold">Quote Add/Offer</span>
              </div>
              <button onClick={() => setIsMainModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              
              {/* Top Action Navigation Buttons */}
              <div className="flex justify-end space-x-2">
                <button onClick={() => setIsItemModalOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-1.5 rounded shadow-sm font-medium">
                  Item Add
                </button>
                <button onClick={() => setIsContactModalOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-1.5 rounded shadow-sm font-medium">
                  Contacts Add
                </button>
                <button onClick={() => setIsMainModalOpen(false)} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-1.5 rounded shadow-sm font-medium">
                  Quote List
                </button>
              </div>

              {/* Form Fields Grid */}
              <div className="bg-white p-3 rounded border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
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
                <div className="sm:col-span-2">
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
                  rows={4} 
                  value={contentBody} 
                  onChange={(e) => setContentBody(e.target.value)}
                  placeholder="Type content body here..." 
                  className="w-full p-3 text-xs focus:outline-none bg-white"
                ></textarea>
                <div className="bg-slate-50 px-3 py-1 border-t text-[10px] text-slate-400 text-right">0 WORDS POWERED BY TINY</div>
              </div>

              {/* ================= ITEM SELECTORS BAR ================= */}
              <div className="bg-white p-3 rounded border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                    <option value="">Select Category</option>
                    <option value="Cat 1">Category 1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Sub Category</label>
                  <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                    <option value="">Select Sub Category</option>
                    <option value="SubCat 1">Sub Category 1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Select Item (Product / Material) *</label>
                  <input 
                    type="text" 
                    placeholder="Search Item / Product / Material..." 
                    value={selectedItemSearch} 
                    onChange={(e) => setSelectedItemSearch(e.target.value)} 
                    className="w-full border rounded px-2.5 py-1.5 bg-white" 
                  />
                </div>
              </div>

              {/* ================= ITEMS TABLE ================= */}
              <div className="overflow-x-auto border border-purple-300 rounded">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#6b58e8] text-white uppercase">
                      <th className="p-2 border-r border-purple-400">Item Name</th>
                      <th className="p-2 border-r border-purple-400">Unit</th>
                      <th className="p-2 border-r border-purple-400">Quantity</th>
                      <th className="p-2 border-r border-purple-400">Rate</th>
                      <th className="p-2 border-r border-purple-400">Details</th>
                      <th className="p-2 border-r border-purple-400">Image</th>
                      <th className="p-2 border-r border-purple-400">Amount</th>
                      <th className="p-2 text-center">Action <Plus className="w-3 h-3 inline ml-1 bg-emerald-500 rounded text-white" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteItems.map((it, idx) => (
                      <tr key={it.id} className="bg-white border-b border-slate-200">
                        <td className="p-2">
                          <input type="text" value={it.itemName} onChange={(e) => {
                            const updated = [...quoteItems];
                            updated[idx].itemName = e.target.value;
                            setQuoteItems(updated);
                          }} className="border rounded px-1.5 py-1 w-full" />
                        </td>
                        <td className="p-2">
                          <input type="text" value={it.unit} onChange={(e) => {
                            const updated = [...quoteItems];
                            updated[idx].unit = e.target.value;
                            setQuoteItems(updated);
                          }} className="border rounded px-1.5 py-1 w-full" />
                        </td>
                        <td className="p-2">
                          <input type="number" value={it.quantity} onChange={(e) => {
                            const q = Number(e.target.value);
                            const updated = [...quoteItems];
                            updated[idx].quantity = q;
                            updated[idx].amount = q * updated[idx].rate;
                            setQuoteItems(updated);
                          }} className="border rounded px-1.5 py-1 w-full" />
                        </td>
                        <td className="p-2">
                          <input type="number" value={it.rate} onChange={(e) => {
                            const r = Number(e.target.value);
                            const updated = [...quoteItems];
                            updated[idx].rate = r;
                            updated[idx].amount = updated[idx].quantity * r;
                            setQuoteItems(updated);
                          }} className="border rounded px-1.5 py-1 w-full" />
                        </td>
                        <td className="p-2">
                          <input type="text" value={it.details} onChange={(e) => {
                            const updated = [...quoteItems];
                            updated[idx].details = e.target.value;
                            setQuoteItems(updated);
                          }} className="border rounded px-1.5 py-1 w-full" />
                        </td>
                        <td className="p-2 text-slate-400">No image</td>
                        <td className="p-2 font-semibold">{it.amount}</td>
                        <td className="p-2 text-center">
                          <button onClick={() => setQuoteItems(quoteItems.filter(i => i.id !== it.id))} className="text-rose-500">
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ================= BOTTOM SPLIT: CONTENT FOOTER & FINANCIAL CALCULATIONS ================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                
                {/* Content Footer Editor */}
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
                    <div className="h-4 w-[1px] bg-slate-300 mx-1"></div>
                    <button className="p-1 hover:bg-slate-200 rounded"><ImageIcon className="w-3.5 h-3.5" /></button>
                    <button className="p-1 hover:bg-slate-200 rounded"><Printer className="w-3.5 h-3.5" /></button>
                    <button className="p-1 hover:bg-slate-200 rounded"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-1 hover:bg-slate-200 rounded"><Smile className="w-3.5 h-3.5" /></button>
                  </div>
                  <textarea 
                    rows={4} 
                    value={contentFooter} 
                    onChange={(e) => setContentFooter(e.target.value)}
                    placeholder="Type content footer here..." 
                    className="w-full p-3 text-xs focus:outline-none bg-white"
                  ></textarea>
                  <div className="bg-slate-50 px-3 py-1 border-t text-[10px] text-slate-400 text-right">0 WORDS POWERED BY TINY</div>
                </div>

                {/* Financial Totals & Summary */}
                <div className="bg-white border border-slate-300 rounded p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b">
                    <span className="font-medium text-slate-600">Subtotal :</span>
                    <span className="font-semibold">{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b">
                    <span className="font-medium text-slate-600">Vat(%) :</span>
                    <input type="number" value={vatPercent} onChange={(e) => setVatPercent(Number(e.target.value))} placeholder="Vat(%)" className="border rounded px-2 py-1 w-32 text-right" />
                  </div>
                  <div className="flex items-center justify-between py-1 border-b">
                    <span className="font-medium text-slate-600">Vat(Amount) :</span>
                    <span className="font-semibold">{vatAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b">
                    <span className="font-medium text-slate-600">Delivery/Shipping Charge :</span>
                    <input type="number" value={deliveryCharge} onChange={(e) => setDeliveryCharge(Number(e.target.value))} placeholder="Delivery/Ship" className="border rounded px-2 py-1 w-32 text-right" />
                  </div>
                  <div className="flex items-center justify-between py-1 border-b">
                    <span className="font-medium text-slate-600">Discount(%) :</span>
                    <input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} placeholder="Discount(%)" className="border rounded px-2 py-1 w-32 text-right" />
                  </div>
                  <div className="flex items-center justify-between py-1 border-b">
                    <span className="font-medium text-slate-600">Discount(Amount) :</span>
                    <span className="font-semibold text-rose-600">{discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 font-bold text-sm">
                    <span className="text-slate-700">Grand Total :</span>
                    <span className="text-emerald-600">{grandTotal.toFixed(2)}</span>
                  </div>
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
            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Item Name*</label>
                <input type="text" placeholder="Enter item name" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Details</label>
                <input type="text" placeholder="Enter details" className="w-full border rounded px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Unit</label>
                  <input type="text" placeholder="Pcs" className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Rate*</label>
                  <input type="number" placeholder="0.00" className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button type="button" onClick={() => setIsItemModalOpen(false)} className="px-4 py-1.5 border rounded bg-slate-100 text-slate-600">Cancel</button>
                <button type="button" onClick={() => { alert('Item Saved Successfully!'); setIsItemModalOpen(false); }} className="px-4 py-1.5 bg-purple-600 text-white rounded font-medium hover:bg-purple-700">Save Item</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-MODAL 2: CONTACTS ADD ================= */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl border border-purple-300 overflow-hidden">
            <div className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Add New Contact</h3>
              <button onClick={() => setIsContactModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Contact Name*</label>
                <input type="text" placeholder="Enter contact name" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Phone Number</label>
                <input type="text" placeholder="01XXXXXXXXX" className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button type="button" onClick={() => setIsContactModalOpen(false)} className="px-4 py-1.5 border rounded bg-slate-100 text-slate-600">Cancel</button>
                <button type="button" onClick={() => { alert('Contact Saved Successfully!'); setIsContactModalOpen(false); }} className="px-4 py-1.5 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700">Save Contact</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}