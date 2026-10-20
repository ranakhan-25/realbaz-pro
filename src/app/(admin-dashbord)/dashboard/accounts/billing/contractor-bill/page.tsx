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
  Upload, 
  Trash2, 
  Check 
} from 'lucide-react';

interface BillItem {
  id: string;
  itemName: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface PaymentRow {
  id: string;
  transactionId: string;
  paymentMethod: string;
  chequeNo: string;
  amount: number;
  date: string;
}

export default function ContractorBillListPage() {
  // Main Bill Add Modal State
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);

  // Sub-Modals States for specific "+" buttons inside the main modal
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isLabourModalOpen, setIsLabourModalOpen] = useState(false);
  const [isSelectItemModalOpen, setIsSelectItemModalOpen] = useState(false);

  // Form Field States for the Main Modal
  const [date, setDate] = useState('09/16/2026');
  const [contractor, setContractor] = useState('');
  const [ledger, setLedger] = useState('500-001-002-D01-Contractor Bill Expense');
  const [code, setCode] = useState('VB00001');
  const [projectType, setProjectType] = useState('');
  const [project, setProject] = useState('');
  const [titleOfWork, setTitleOfWork] = useState('');
  const [site, setSite] = useState('');
  const [refNo, setRefNo] = useState('');
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('');
  const [item, setItem] = useState('');

  // Sub-modal temporary form inputs
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [newItemRate, setNewItemRate] = useState<number>(0);

  const [labourName, setLabourName] = useState('');
  const [labourRole, setLabourRole] = useState('');
  const [labourWages, setLabourWages] = useState<number>(0);

  // Table items inside modal
  const [itemsList, setItemsList] = useState<BillItem[]>([
    { id: '1', itemName: 'Foundation Piling', description: 'Deep piling work', unit: 'Pcs', quantity: 10, rate: 5000, amount: 50000 }
  ]);

  // Financial fields
  const [vatPercent, setVatPercent] = useState<number>(5);
  const [vatInclude, setVatInclude] = useState<boolean>(false);
  const [securityDeposit, setSecurityDeposit] = useState<number>(1000);
  const [paidAmount, setPaidAmount] = useState<number>(20000);

  // Payments inside modal
  const [payments, setPayments] = useState<PaymentRow[]>([
    { id: '1', transactionId: 'TXN-98421', paymentMethod: 'Cash', chequeNo: 'N/A', amount: 20000, date: '09/16/2026' }
  ]);

  // Calculations
  const subtotal = itemsList.reduce((acc, curr) => acc + curr.amount, 0);
  const vatAmount = (subtotal * vatPercent) / 100;
  const grandTotal = subtotal + (vatInclude ? vatAmount : 0);
  const dueAmount = grandTotal - paidAmount;

  // Add Item from Sub-Modal
  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: BillItem = {
      id: Date.now().toString(),
      itemName: newItemName || 'Custom Item',
      description: newItemDesc || 'Description text',
      unit: newItemUnit || 'Pcs',
      quantity: 1,
      rate: newItemRate || 1000,
      amount: (newItemRate || 1000) * 1
    };
    setItemsList([...itemsList, newItem]);
    setNewItemName('');
    setNewItemDesc('');
    setNewItemUnit('');
    setNewItemRate(0);
    setIsItemModalOpen(false);
  };

  // Add Labour from Sub-Modal
  const handleSaveLabour = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Labour/Worker Added Successfully: ${labourName || 'Default Worker'}`);
    setLabourName('');
    setLabourRole('');
    setLabourWages(0);
    setIsLabourModalOpen(false);
  };

  const handleAddPayment = () => {
    const newPayment: PaymentRow = {
      id: Date.now().toString(),
      transactionId: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      paymentMethod: 'Cash',
      chequeNo: 'CHK-0092',
      amount: 5000,
      date: '09/16/2026'
    };
    setPayments([...payments, newPayment]);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800">
      
      {/* ================= BREADCRUMB HEADER ================= */}
      <div className="flex items-center text-sm text-slate-600 mb-4 space-x-2">
        <span className="hover:text-blue-600 cursor-pointer">Home</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="hover:text-blue-600 cursor-pointer">Billing</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="font-semibold text-slate-800">Contractor/Supplier Bill List</span>
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
              <label className="block text-xs font-medium text-slate-600 mb-1">Contractor/Supplier</label>
              <select className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-sm focus:outline-none">
                <option>Select One Option</option>
                <option>ABC Builders Ltd.</option>
                <option>XYZ Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Ledger</label>
              <select className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-sm focus:outline-none">
                <option>Select Chart Of Account</option>
                <option>500-001-Contractor Bill Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Select Project</label>
              <select className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-sm focus:outline-none">
                <option>Select Project</option>
                <option>Commercial Tower Alpha</option>
              </select>
            </div>
          </div>

          {/* New Bill Button */}
          <button 
            onClick={() => setIsMainModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm px-4 py-2 rounded flex items-center shadow transition shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" /> +New Contractor/Supplier Bill
          </button>
        </div>

        <div className="w-full md:w-1/4">
          <label className="block text-xs font-medium text-slate-600 mb-1">Title/Name of Work</label>
          <select className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-sm focus:outline-none">
            <option>Select Title/Name of Work</option>
            <option>Earth Excavation & Piling</option>
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
                <th className="p-2.5 border-r border-purple-400">Contractor Name</th>
                <th className="p-2.5 border-r border-purple-400">Dr Ledger</th>
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
                <td colSpan={15} className="text-center py-8 text-slate-400 italic bg-slate-50">
                  No data available in table
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t border-slate-200 font-semibold text-xs">
                <td colSpan={8} className="p-3 text-right">TOTAL: 0</td>
                <td className="p-3">0</td>
                <td className="p-3">0</td>
                <td colSpan={5}></td>
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

      {/* ================= MAIN MODAL: ADD BILL FORM ================= */}
      {isMainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 overflow-y-auto">
          <div className="bg-slate-50 w-full max-w-7xl rounded-lg shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[95vh]">
            
            {/* Header */}
            <div className="bg-[#6b58e8] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs sm:text-sm">
                <span>Home</span><span>›</span>
                <span>Contractor/Supplier Bill</span><span>›</span>
                <span className="font-semibold">Contractor/Supplier Bill Add</span>
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
                <button onClick={() => setIsLabourModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded flex items-center shadow-sm">
                  <Plus className="w-3.5 h-3.5 mr-1" /> +Labour/Worker Add
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded flex items-center shadow-sm">
                  Contractor Bill List
                </button>
              </div>

              {/* Form Input Rows */}
              <div className="bg-white p-3 rounded border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Date</label>
                  <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white" />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Contractor/Supplier</label>
                  <select value={contractor} onChange={(e) => setContractor(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white">
                    <option value="">Select One Option</option>
                    <option value="ABC Contractor">ABC Contractor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Ledger</label>
                  <input type="text" value={ledger} onChange={(e) => setLedger(e.target.value)} className="w-full border rounded px-2.5 py-1.5 bg-white" />
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
                    <option value="Piling Work">Piling Work</option>
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
                      <option value="">Select Itam</option>
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
                      <th className="p-2 border-r border-purple-400">Item Name</th>
                      <th className="p-2 border-r border-purple-400">Description</th>
                      <th className="p-2 border-r border-purple-400">Unit</th>
                      <th className="p-2 border-r border-purple-400">Quantity</th>
                      <th className="p-2 border-r border-purple-400">Rate</th>
                      <th className="p-2 border-r border-purple-400">Amount</th>
                      <th className="p-2 text-center">Action</th>
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
                          const val = Number(e.target.value);
                          const updated = [...itemsList];
                          updated[idx].quantity = val;
                          updated[idx].amount = val * updated[idx].rate;
                          setItemsList(updated);
                        }} className="border rounded px-1.5 py-1 w-full" /></td>
                        <td className="p-2"><input type="number" value={it.rate} onChange={(e) => {
                          const val = Number(e.target.value);
                          const updated = [...itemsList];
                          updated[idx].rate = val;
                          updated[idx].amount = updated[idx].quantity * val;
                          setItemsList(updated);
                        }} className="border rounded px-1.5 py-1 w-full" /></td>
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

              {/* Calculation Table */}
              <div className="overflow-x-auto border border-purple-300 rounded">
                <table className="w-full text-left border-collapse text-xs bg-white">
                  <thead>
                    <tr className="bg-[#6b58e8] text-white uppercase text-[11px]">
                      <th className="p-2 border-r border-purple-400">Subtotal</th>
                      <th className="p-2 border-r border-purple-400">VAT(%) If Include:</th>
                      <th className="p-2 border-r border-purple-400">VAT Amount</th>
                      <th className="p-2 border-r border-purple-400">Security Deposit</th>
                      <th className="p-2 border-r border-purple-400">Total Quantity</th>
                      <th className="p-2 border-r border-purple-400">Grand Total</th>
                      <th className="p-2 border-r border-purple-400">Paid</th>
                      <th className="p-2 border-r border-purple-400">Due</th>
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
                      <td className="p-2"><input type="number" value={securityDeposit} onChange={(e) => setSecurityDeposit(Number(e.target.value))} className="border rounded px-1.5 py-1 w-24" /></td>
                      <td className="p-2">{itemsList.reduce((acc, c) => acc + c.quantity, 0)}</td>
                      <td className="p-2 font-bold text-slate-900">{grandTotal}</td>
                      <td className="p-2 font-semibold text-emerald-600">{paidAmount}</td>
                      <td className="p-2 font-semibold text-rose-600">{dueAmount}</td>
                      <td className="p-2"><input type="file" className="text-[10px] w-40" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Transactions & Payment Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="overflow-x-auto border border-purple-300 rounded bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#6b58e8] text-white uppercase text-[11px]">
                        <th className="p-2 border-r border-purple-400">Transaction ID</th>
                        <th className="p-2 border-r border-purple-400">Payment Method</th>
                        <th className="p-2 border-r border-purple-400">Cheque Receipt No</th>
                        <th className="p-2 border-r border-purple-400">Amount</th>
                        <th className="p-2 border-r border-purple-400">Date</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(p => (
                        <tr key={p.id} className="border-b border-slate-100">
                          <td className="p-2">{p.transactionId}</td>
                          <td className="p-2">{p.paymentMethod}</td>
                          <td className="p-2">{p.chequeNo}</td>
                          <td className="p-2">{p.amount}</td>
                          <td className="p-2">{p.date}</td>
                          <td className="p-2"><button onClick={() => setPayments(payments.filter(i => i.id !== p.id))} className="text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white border border-slate-200 rounded p-3 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Payment Method* If Cheque</label>
                      <select className="w-full border rounded px-2 py-1.5 bg-white"><option>Cash</option><option>Cheque</option></select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Payment Date</label>
                      <input type="text" defaultValue="09/16/2026" className="w-full border rounded px-2 py-1.5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Cheque Receipt No</label>
                      <input type="text" placeholder="Cheque Receipt No" className="w-full border rounded px-2 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Amount*</label>
                      <input type="number" defaultValue="0" className="w-full border rounded px-2 py-1.5" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button onClick={handleAddPayment} className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-1.5 rounded shadow">Add Payment</button>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 px-4 py-3 border-t border-slate-200 flex justify-end">
              <button onClick={() => setIsMainModalOpen(false)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 rounded shadow text-sm">Submit</button>
            </div>

          </div>
        </div>
      )}


      {/* ================= SUB-MODAL 1: ITEM ADD FORM ================= */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl border border-purple-300 overflow-hidden">
            <div className="bg-[#6b58e8] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Add New Bill Item</h3>
              <button onClick={() => setIsItemModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveNewItem} className="p-4 space-y-3 text-xs">
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
                  <input type="text" placeholder="e.g. Pcs, Kg" value={newItemUnit} onChange={(e) => setNewItemUnit(e.target.value)} className="w-full border rounded px-3 py-2" />
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


      {/* ================= SUB-MODAL 2: LABOUR / WORKER ADD FORM ================= */}
      {isLabourModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl border border-purple-300 overflow-hidden">
            <div className="bg-[#6b58e8] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Add Labour / Worker</h3>
              <button onClick={() => setIsLabourModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveLabour} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Worker Name*</label>
                <input type="text" required placeholder="Enter worker full name" value={labourName} onChange={(e) => setLabourName(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Role / Designation</label>
                <input type="text" placeholder="e.g. Mason, Helper" value={labourRole} onChange={(e) => setLabourRole(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Daily Wages / Amount*</label>
                <input type="number" required placeholder="0.00" value={labourWages} onChange={(e) => setLabourWages(Number(e.target.value))} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button type="button" onClick={() => setIsLabourModalOpen(false)} className="px-4 py-1.5 border rounded bg-slate-100 text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-purple-600 text-white rounded font-medium hover:bg-purple-700">Add Labour</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ================= SUB-MODAL 3: SELECT ITEM QUICK ADD ================= */}
      {isSelectItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl border border-purple-300 overflow-hidden">
            <div className="bg-[#6b58e8] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Quick Add Catalog Item</h3>
              <button onClick={() => setIsSelectItemModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Catalog Item Title</label>
                <input type="text" placeholder="Enter item catalog title" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Item Category Code</label>
                <input type="text" placeholder="CAT-00X" className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button type="button" onClick={() => setIsSelectItemModalOpen(false)} className="px-4 py-1.5 border rounded bg-slate-100 text-slate-600">Cancel</button>
                <button type="button" onClick={() => { alert('Catalog Item Created!'); setIsSelectItemModalOpen(false); }} className="px-4 py-1.5 bg-purple-600 text-white rounded font-medium hover:bg-purple-700">Create Catalog Item</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}