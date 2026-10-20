'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  DollarSign, 
  Receipt, 
  FileText, 
  UserCheck, 
  Calendar, 
  X, 
  FileSpreadsheet, 
  Upload, 
  Paperclip,
  Building2,
  Wallet,
  Tag
} from 'lucide-react';

// TypeScript Interface matching Feature Project Cost List & Form Properties
interface ProjectCost {
  id: string;
  projectUuid: string;
  cost_head: 'material' | 'labour' | 'equipment' | 'overhead' | 'land' | 'consultant' | 'subcontractor' | 'other';
  amount: number;
  incurred_at: string;
  ref_type: 'bill' | 'po' | 'journal' | 'manual';
  ref_no: string;
  ref_uuid?: string;
  approved_by: string;
  description?: string;
  hasAttachment?: boolean;
}

// Initial Static Data
const initialCosts: ProjectCost[] = [
  {
    id: 'CST-101',
    projectUuid: 'proj-skyline-001',
    cost_head: 'material',
    amount: 145000.00,
    incurred_at: '2026-09-02',
    ref_type: 'bill',
    ref_no: 'BILL-8810',
    ref_uuid: 'ref-bill-001',
    approved_by: 'Shamim Khan',
    description: 'Bulk cement and steel reinforcement rods delivery for foundation.',
    hasAttachment: true
  },
  {
    id: 'CST-102',
    projectUuid: 'proj-skyline-001',
    cost_head: 'labour',
    amount: 42000.00,
    incurred_at: '2026-09-05',
    ref_type: 'journal',
    ref_no: 'JRN-4021',
    ref_uuid: 'ref-jrn-002',
    approved_by: 'Tanvir Ahmed',
    description: 'Weekly mason & rod binder wage payout for Block A.',
    hasAttachment: true
  },
  {
    id: 'CST-103',
    projectUuid: 'proj-skyline-001',
    cost_head: 'equipment',
    amount: 28500.00,
    incurred_at: '2026-09-09',
    ref_type: 'po',
    ref_no: 'PO-9923',
    ref_uuid: 'ref-po-003',
    approved_by: 'Rahim Uddin',
    description: 'Excavator and heavy crane rental invoice for pile driving.',
    hasAttachment: true
  },
  {
    id: 'CST-104',
    projectUuid: 'proj-skyline-001',
    cost_head: 'consultant',
    amount: 15000.00,
    incurred_at: '2026-09-12',
    ref_type: 'bill',
    ref_no: 'BILL-8845',
    ref_uuid: 'ref-bill-004',
    approved_by: 'Shamim Khan',
    description: 'Structural safety compliance fee for soil testing firm.',
    hasAttachment: false
  },
  {
    id: 'CST-105',
    projectUuid: 'proj-skyline-001',
    cost_head: 'overhead',
    amount: 8500.00,
    incurred_at: '2026-09-15',
    ref_type: 'manual',
    ref_no: 'MNL-1055',
    approved_by: 'Tanvir Ahmed',
    description: 'Site office utility bills and temporary generator fuel expenses.',
    hasAttachment: true
  }
];

export default function ProjectCostPage() {
  // GET State
  const [costs, setCosts] = useState<ProjectCost[]>(initialCosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCostHead, setSelectedCostHead] = useState<string>('All');
  const [selectedRefType, setSelectedRefType] = useState<string>('All');

  // POST State (Modal + Form)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    cost_head: 'material' as ProjectCost['cost_head'],
    amount: '',
    incurred_at: new Date().toISOString().split('T')[0],
    ref_type: 'bill' as ProjectCost['ref_type'],
    ref_no: '',
    ref_uuid: '',
    description: '',
    hasAttachment: false
  });

  // Dynamic Ref ID Options Based on Ref Type
  const refOptions = useMemo(() => {
    switch (formData.ref_type) {
      case 'bill':
        return [
          { label: 'Select Bill Ref', value: '' },
          { label: 'BILL-8810 (Cement Supplier)', value: 'ref-bill-001' },
          { label: 'BILL-8822 (Steel Mills Corp)', value: 'ref-bill-002' },
          { label: 'BILL-8845 (Geotech Safety)', value: 'ref-bill-004' }
        ];
      case 'po':
        return [
          { label: 'Select PO Ref', value: '' },
          { label: 'PO-9923 (Equipment Rental)', value: 'ref-po-003' },
          { label: 'PO-9940 (Pipe Fittings)', value: 'ref-po-005' }
        ];
      case 'journal':
        return [
          { label: 'Select Journal Ref', value: '' },
          { label: 'JRN-4021 (Labour Wages)', value: 'ref-jrn-002' },
          { label: 'JRN-4050 (Subcontractor Clearing)', value: 'ref-jrn-006' }
        ];
      default:
        return [{ label: 'N/A (Manual Entry)', value: '' }];
    }
  }, [formData.ref_type]);

  // POST Handler (Create New Cost Entry)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(formData.amount) || 0;

    const generatedRefNo = formData.ref_no || `${formData.ref_type.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCost: ProjectCost = {
      id: `CST-${100 + costs.length + 1}`,
      projectUuid: 'proj-skyline-001',
      cost_head: formData.cost_head,
      amount: amountNum,
      incurred_at: formData.incurred_at,
      ref_type: formData.ref_type,
      ref_no: generatedRefNo,
      ref_uuid: formData.ref_uuid || undefined,
      approved_by: 'Shamim Khan',
      description: formData.description || 'No notes provided.',
      hasAttachment: formData.hasAttachment
    };

    setCosts([newCost, ...costs]);
    setIsModalOpen(false);

    // Reset Form
    setFormData({
      cost_head: 'material',
      amount: '',
      incurred_at: new Date().toISOString().split('T')[0],
      ref_type: 'bill',
      ref_no: '',
      ref_uuid: '',
      description: '',
      hasAttachment: false
    });
  };

  // GET Filter Logic
  const filteredCosts = useMemo(() => {
    return costs.filter((cost) => {
      const matchesSearch = 
        cost.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cost.ref_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cost.approved_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cost.cost_head.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cost.description && cost.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesHead = selectedCostHead === 'All' || cost.cost_head === selectedCostHead;
      const matchesRef = selectedRefType === 'All' || cost.ref_type === selectedRefType;

      return matchesSearch && matchesHead && matchesRef;
    });
  }, [costs, searchQuery, selectedCostHead, selectedRefType]);

  // Totals Calculation
  const totalAmount = useMemo(() => {
    return filteredCosts.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredCosts]);

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8 font-sans text-slate-800">
      
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <nav className="flex items-center text-sm text-slate-500 space-x-2 mb-1">
            <Link href="/projects" className="flex items-center hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4 mr-1 text-slate-600" /> Projects
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="hover:text-blue-600 cursor-pointer">proj-skyline-001</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900">Cost</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Cost Management</h1>
        </div>

        {/* Action Button (POST Trigger) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> New Cost Entry
          </button>
        </div>
      </div>

      {/* KPI Overview Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Incurred Cost</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cost Voucher Count</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{filteredCosts.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attachments Included</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {filteredCosts.filter(c => c.hasAttachment).length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Paperclip className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        
        {/* Filters & Controls Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            
            {/* Filter by Cost Head */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Cost Head:</label>
              <select
                value={selectedCostHead}
                onChange={(e) => setSelectedCostHead(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer capitalize"
              >
                <option value="All">All Cost Heads</option>
                <option value="material">Material</option>
                <option value="labour">Labour</option>
                <option value="equipment">Equipment</option>
                <option value="overhead">Overhead</option>
                <option value="land">Land</option>
                <option value="consultant">Consultant</option>
                <option value="subcontractor">Subcontractor</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Filter by Ref Type */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Ref Type:</label>
              <select
                value={selectedRefType}
                onChange={(e) => setSelectedRefType(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer uppercase"
              >
                <option value="All">All Ref Types</option>
                <option value="bill">Bill</option>
                <option value="po">PO</option>
                <option value="journal">Journal</option>
                <option value="manual">Manual</option>
              </select>
            </div>

          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search cost, ref no, user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-600 shadow-sm"
            />
          </div>
        </div>

        {/* Cost Table (GET List View matching exact columns) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Cost Head</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Incurred At</th>
                <th className="py-3.5 px-4">Ref Type</th>
                <th className="py-3.5 px-4">Ref No</th>
                <th className="py-3.5 px-4">Approved By</th>
                <th className="py-3.5 px-4 text-center">Attachment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredCosts.length > 0 ? (
                filteredCosts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">{item.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 capitalize">
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                        <Tag className="w-3 h-3 text-blue-600" /> {item.cost_head}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">{item.incurred_at}</td>
                    <td className="py-3.5 px-4">
                      <span className="uppercase text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                        {item.ref_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-800">{item.ref_no}</td>
                    <td className="py-3.5 px-4 text-slate-700">{item.approved_by}</td>
                    <td className="py-3.5 px-4 text-center">
                      {item.hasAttachment ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-50 text-blue-600 rounded-lg" title="View Attachment">
                          <Paperclip className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No cost entries found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
            {/* Table Footer Totals */}
            <tfoot>
              <tr className="bg-slate-100 border-t border-slate-200 font-bold text-slate-900 text-sm">
                <td colSpan={2} className="py-3.5 px-4 uppercase text-xs text-slate-600 text-right">TOTAL INCURRED COST:</td>
                <td className="py-3.5 px-4 text-blue-600">${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td colSpan={5}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredCosts.length} of {costs.length} cost vouchers</span>
          <span>Project Cost Management v03.06</span>
        </div>

      </div>

      {/* POST Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Add Project Cost Entry</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              
              {/* Cost Head (from Budget Categories) */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Cost Head *</label>
                <select
                  value={formData.cost_head}
                  onChange={(e) => setFormData({ ...formData, cost_head: e.target.value as any })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm capitalize"
                >
                  <option value="material">Material</option>
                  <option value="labour">Labour</option>
                  <option value="equipment">Equipment</option>
                  <option value="overhead">Overhead</option>
                  <option value="land">Land</option>
                  <option value="consultant">Consultant</option>
                  <option value="subcontractor">Subcontractor</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Amount ($) *</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-9 pr-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  />
                </div>
              </div>

              {/* Incurred At Date */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Incurred At Date *</label>
                <input
                  type="date"
                  required
                  value={formData.incurred_at}
                  onChange={(e) => setFormData({ ...formData, incurred_at: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Ref Type */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Reference Type *</label>
                <select
                  value={formData.ref_type}
                  onChange={(e) => setFormData({ ...formData, ref_type: e.target.value as any, ref_uuid: '' })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm uppercase"
                >
                  <option value="bill">Bill</option>
                  <option value="po">PO (Purchase Order)</option>
                  <option value="journal">Journal</option>
                  <option value="manual">Manual Entry</option>
                </select>
              </div>

              {/* Ref UUID (Conditional Dropdown) */}
              {formData.ref_type !== 'manual' && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Conditional Reference Item (ref_uuid)</label>
                  <select
                    value={formData.ref_uuid}
                    onChange={(e) => setFormData({ ...formData, ref_uuid: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  >
                    {refOptions.map((opt, i) => (
                      <option key={i} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Ref No */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Ref No / Voucher No</label>
                <input
                  type="text"
                  placeholder="Auto-generated if left blank"
                  value={formData.ref_no}
                  onChange={(e) => setFormData({ ...formData, ref_no: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm font-mono"
                />
              </div>

              {/* Description TA */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Write cost details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Attachment Toggle */}
              <div className="flex items-center pt-2">
                <label className="relative flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasAttachment}
                    onChange={(e) => setFormData({ ...formData, hasAttachment: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-slate-400" /> Include Voucher Attachment
                  </span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                >
                  Save Cost Entry
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}