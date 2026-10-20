'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  FileText, 
  DollarSign, 
  Calendar, 
  User, 
  X, 
  Upload, 
  Paperclip, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Briefcase
} from 'lucide-react';

// TypeScript Interface matching Feature 03.04: Agreements
interface ProjectAgreement {
  id: string;
  projectUuid: string;
  party: string;
  type: 'service' | 'consultancy' | 'joint_venture' | 'land';
  signed_at: string; // Date
  start_at: string;  // Date
  end_at?: string;   // Date
  value: number;     // MONEY
  status: 'active' | 'pending' | 'expired' | 'terminated';
  file_name?: string;
  notes?: string;
}

// Initial Mock Data
const initialAgreements: ProjectAgreement[] = [
  {
    id: 'AGR-101',
    projectUuid: 'proj-skyline-001',
    party: 'Apex Holdings Ltd.',
    type: 'joint_venture',
    signed_at: '2026-08-01',
    start_at: '2026-08-01',
    end_at: '2029-08-01',
    value: 12000000.00,
    status: 'active',
    file_name: 'JV_Agreement_Apex_2026.pdf',
    notes: 'Primary joint venture agreement for skyline tower construction.'
  },
  {
    id: 'AGR-102',
    projectUuid: 'proj-skyline-001',
    party: 'Urban Arch Engineering Consultants',
    type: 'consultancy',
    signed_at: '2026-08-10',
    start_at: '2026-08-15',
    end_at: '2027-08-15',
    value: 450000.00,
    status: 'active',
    file_name: 'Consultancy_Arch_Urban.pdf',
    notes: 'Architectural structural design review and supervision.'
  },
  {
    id: 'AGR-103',
    projectUuid: 'proj-skyline-001',
    party: 'National Builders & Civil Infra',
    type: 'service',
    signed_at: '2026-08-15',
    start_at: '2026-09-01',
    end_at: '2028-03-01',
    value: 8500000.00,
    status: 'active',
    file_name: 'Civil_Contract_NBCI.pdf',
    notes: 'General contractor service contract for foundation & superstructure.'
  },
  {
    id: 'AGR-104',
    projectUuid: 'proj-skyline-001',
    party: 'Dhaka Land Ownership Group',
    type: 'land',
    signed_at: '2026-07-20',
    start_at: '2026-07-20',
    value: 5000000.00,
    status: 'active',
    file_name: 'Land_Deed_Registry.pdf',
    notes: 'Land acquisition agreement for 32 katha plot.'
  }
];

export default function ProjectAgreementsPage() {
  // GET State
  const [agreements, setAgreements] = useState<ProjectAgreement[]>(initialAgreements);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // POST State (Modal Form - /projects/:uuid/agreements/create)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    party: 'Apex Holdings Ltd.',
    type: 'service' as ProjectAgreement['type'],
    signed_at: new Date().toISOString().split('T')[0],
    start_at: new Date().toISOString().split('T')[0],
    end_at: '',
    value: '',
    fileName: '',
    notes: ''
  });

  // POST Handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valNum = parseFloat(formData.value) || 0;

    const newAgreement: ProjectAgreement = {
      id: `AGR-${100 + agreements.length + 1}`,
      projectUuid: 'proj-skyline-001',
      party: formData.party || 'Unspecified Party',
      type: formData.type,
      signed_at: formData.signed_at,
      start_at: formData.start_at,
      end_at: formData.end_at || undefined,
      value: valNum,
      status: 'active',
      file_name: formData.fileName || undefined,
      notes: formData.notes || 'No notes provided.'
    };

    setAgreements([newAgreement, ...agreements]);
    setIsModalOpen(false);

    // Reset Form
    setFormData({
      party: 'Apex Holdings Ltd.',
      type: 'service',
      signed_at: new Date().toISOString().split('T')[0],
      start_at: new Date().toISOString().split('T')[0],
      end_at: '',
      value: '',
      fileName: '',
      notes: ''
    });
  };

  // GET Filter Logic
  const filteredAgreements = useMemo(() => {
    return agreements.filter((item) => {
      const matchesSearch = 
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === 'All' || item.type === selectedType;
      const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [agreements, searchQuery, selectedType, selectedStatus]);

  // Total Portfolio Value
  const totalValue = useMemo(() => {
    return filteredAgreements.reduce((acc, curr) => acc + curr.value, 0);
  }, [filteredAgreements]);

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
            <span className="font-semibold text-slate-900">Agreements</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Agreements & Contracts</h1>
        </div>

        {/* Action Button (POST Trigger - /projects/:uuid/agreements/create) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Create Agreement
          </button>
        </div>
      </div>

      {/* KPI Overview Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Contract Portfolio Value</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Contracts</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {agreements.filter(a => a.status === 'active').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Agreements</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{agreements.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        
        {/* Filters & Search Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            
            {/* Filter by Type */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer capitalize"
              >
                <option value="All">All Types</option>
                <option value="service">Service</option>
                <option value="consultancy">Consultancy</option>
                <option value="joint_venture">Joint Venture</option>
                <option value="land">Land</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer capitalize"
              >
                <option value="All">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>

          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search party or agreement code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-600 shadow-sm"
            />
          </div>
        </div>

        {/* Agreements Table (GET List View) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Party Name</th>
                <th className="py-3.5 px-4">Agreement Type</th>
                <th className="py-3.5 px-4">Signed Date</th>
                <th className="py-3.5 px-4">Start Date</th>
                <th className="py-3.5 px-4">End Date</th>
                <th className="py-3.5 px-4">Contract Value ($)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredAgreements.length > 0 ? (
                filteredAgreements.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">{item.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.party}</td>
                    <td className="py-3.5 px-4 font-semibold capitalize">
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200 text-xs font-semibold">
                        {item.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">{item.signed_at}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">{item.start_at}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">
                      {item.end_at || <span className="text-slate-400">N/A</span>}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.status === 'active' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      )}
                      {item.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.file_name ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100" title={item.file_name}>
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
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No agreement records found.
                  </td>
                </tr>
              )}
            </tbody>
            {/* Table Footer Totals */}
            <tfoot>
              <tr className="bg-slate-100 border-t border-slate-200 font-bold text-slate-900 text-sm">
                <td colSpan={6} className="py-3.5 px-4 uppercase text-xs text-slate-600 text-right">TOTAL CONTRACT VALUE:</td>
                <td className="py-3.5 px-4 text-blue-600">
                  ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredAgreements.length} of {agreements.length} agreement records</span>
          <span>Feature 03.04 · Agreements Engine</span>
        </div>

      </div>

      {/* POST Form Modal (/projects/:uuid/agreements/create) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Create Agreement (/projects/:uuid/agreements/create)</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* Party Name */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Party (party* S) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Holdings Ltd."
                  value={formData.party}
                  onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Agreement Type */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Agreement Type [type* S] *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm capitalize"
                >
                  <option value="service">Service</option>
                  <option value="consultancy">Consultancy</option>
                  <option value="joint_venture">Joint Venture</option>
                  <option value="land">Land</option>
                </select>
              </div>

              {/* Signed At & Start At */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Signed Date (signed_at* D) *</label>
                  <input
                    type="date"
                    required
                    value={formData.signed_at}
                    onChange={(e) => setFormData({ ...formData, signed_at: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Start Date (start_at* D) *</label>
                  <input
                    type="date"
                    required
                    value={formData.start_at}
                    onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  />
                </div>
              </div>

              {/* End At */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">End Date (end_at D)</label>
                <input
                  type="date"
                  value={formData.end_at}
                  onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Value MONEY */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Contract Value ($) (value* MONEY) *</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-9 pr-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  />
                </div>
              </div>

              {/* File Attachment F(pdf) */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Agreement File [file* F(pdf)]</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFormData({ ...formData, fileName: e.target.files?.[0]?.name || '' })}
                  className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-xl px-3.5 py-2 w-full focus:outline-none shadow-sm cursor-pointer"
                />
              </div>

              {/* Notes TA */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Notes (notes TA)</label>
                <textarea
                  rows={2}
                  placeholder="Terms, conditions, and contract notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
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
                  Save Agreement
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}