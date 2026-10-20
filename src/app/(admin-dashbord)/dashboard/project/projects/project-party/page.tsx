'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  Users, 
  Phone, 
  Mail, 
  PieChart, 
  FileText, 
  X, 
  Building2, 
  ShieldCheck, 
  Briefcase 
} from 'lucide-react';

// TypeScript Interface matching Feature 03.03: Parties
interface ProjectParty {
  id: string;
  projectUuid: string;
  party_type: 'owner' | 'investor' | 'consultant' | 'contractor' | 'buyer' | 'supplier';
  name: string;
  phone: string;
  email: string;
  share_pct: number; // N(0-100)
  agreement_ref?: string;
  createdAt: string;
}

// Initial Mock Data
const initialParties: ProjectParty[] = [
  {
    id: 'PRT-001',
    projectUuid: 'proj-skyline-001',
    party_type: 'owner',
    name: 'Apex Holdings Ltd.',
    phone: '+880 1711-000001',
    email: 'contact@apexholdings.com',
    share_pct: 60.00,
    agreement_ref: 'AGR-2026-01',
    createdAt: '2026-08-01'
  },
  {
    id: 'PRT-002',
    projectUuid: 'proj-skyline-001',
    party_type: 'investor',
    name: 'Horizon Equity Capital',
    phone: '+880 1819-223344',
    email: 'invest@horizonequity.com',
    share_pct: 40.00,
    agreement_ref: 'AGR-2026-02',
    createdAt: '2026-08-05'
  },
  {
    id: 'PRT-003',
    projectUuid: 'proj-skyline-001',
    party_type: 'consultant',
    name: 'Urban Arch Engineering Consultants',
    phone: '+880 1912-556677',
    email: 'info@urbanarch.com',
    share_pct: 0,
    agreement_ref: 'AGR-2026-03',
    createdAt: '2026-08-10'
  },
  {
    id: 'PRT-004',
    projectUuid: 'proj-skyline-001',
    party_type: 'contractor',
    name: 'National Builders & Civil Infra',
    phone: '+880 1733-889900',
    email: 'projects@nbci-bd.com',
    share_pct: 0,
    agreement_ref: 'AGR-2026-04',
    createdAt: '2026-08-15'
  },
  {
    id: 'PRT-005',
    projectUuid: 'proj-skyline-001',
    party_type: 'supplier',
    name: 'BSRM Steel & Building Materials',
    phone: '+880 1610-112233',
    email: 'sales@bsrm.com',
    share_pct: 0,
    agreement_ref: 'AGR-2026-05',
    createdAt: '2026-08-20'
  }
];

export default function ProjectPartiesPage() {
  // GET State
  const [parties, setParties] = useState<ProjectParty[]>(initialParties);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');

  // POST State (Modal Form - /projects/:uuid/parties/create)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    party_type: 'owner' as ProjectParty['party_type'],
    name: '',
    phone: '',
    email: '',
    share_pct: '0',
    agreement_ref: ''
  });

  // POST Handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shareNum = Math.min(100, Math.max(0, parseFloat(formData.share_pct) || 0));

    const newParty: ProjectParty = {
      id: `PRT-${100 + parties.length + 1}`,
      projectUuid: 'proj-skyline-001',
      party_type: formData.party_type,
      name: formData.name || 'Untitled Party',
      phone: formData.phone,
      email: formData.email,
      share_pct: shareNum,
      agreement_ref: formData.agreement_ref || undefined,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setParties([newParty, ...parties]);
    setIsModalOpen(false);

    // Reset Form
    setFormData({
      party_type: 'owner',
      name: '',
      phone: '',
      email: '',
      share_pct: '0',
      agreement_ref: ''
    });
  };

  // GET Filter Logic
  const filteredParties = useMemo(() => {
    return parties.filter((item) => {
      const matchesSearch = 
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.includes(searchQuery);

      const matchesType = selectedType === 'All' || item.party_type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [parties, searchQuery, selectedType]);

  // Total Equity Share % calculation
  const totalSharePct = useMemo(() => {
    return parties.reduce((sum, p) => sum + p.share_pct, 0);
  }, [parties]);

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
            <span className="font-semibold text-slate-900">Parties</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Parties & Stakeholders</h1>
        </div>

        {/* Action Button (POST Trigger - /projects/:uuid/parties/create) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Party
          </button>
        </div>
      </div>

      {/* KPI Overview Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Project Parties</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{parties.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Equity Share Allocated</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalSharePct.toFixed(2)}%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <PieChart className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Owners & Investors</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {parties.filter(p => p.party_type === 'owner' || p.party_type === 'investor').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        
        {/* Filters & Search Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            
            {/* Filter by Party Type */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Party Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer capitalize"
              >
                <option value="All">All Types</option>
                <option value="owner">Owner</option>
                <option value="investor">Investor</option>
                <option value="consultant">Consultant</option>
                <option value="contractor">Contractor</option>
                <option value="buyer">Buyer</option>
                <option value="supplier">Supplier</option>
              </select>
            </div>

          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search party name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-600 shadow-sm"
            />
          </div>
        </div>

        {/* Parties Table (GET List View) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Party Code</th>
                <th className="py-3.5 px-4">Party Type</th>
                <th className="py-3.5 px-4">Party / Business Name</th>
                <th className="py-3.5 px-4">Phone Number</th>
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4">Equity Share (%)</th>
                <th className="py-3.5 px-4">Agreement Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredParties.length > 0 ? (
                filteredParties.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">{item.id}</td>
                    <td className="py-3.5 px-4 font-semibold capitalize">
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 text-xs font-semibold">
                        {item.party_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.name}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {item.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {item.email || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {item.share_pct > 0 ? `${item.share_pct.toFixed(2)}%` : <span className="text-slate-300 font-normal">0%</span>}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-blue-600">
                      {item.agreement_ref || <span className="text-slate-300">—</span>}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No party records found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredParties.length} of {parties.length} party records</span>
          <span>Feature 03.03 · Parties Engine</span>
        </div>

      </div>

      {/* POST Form Modal (/projects/:uuid/parties/create) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Create Party (/projects/:uuid/parties/create)</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              
              {/* Party Type */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Party Type (party_type*) *</label>
                <select
                  required
                  value={formData.party_type}
                  onChange={(e) => setFormData({ ...formData, party_type: e.target.value as any })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm capitalize"
                >
                  <option value="owner">Owner</option>
                  <option value="investor">Investor</option>
                  <option value="consultant">Consultant</option>
                  <option value="contractor">Contractor</option>
                  <option value="buyer">Buyer</option>
                  <option value="supplier">Supplier</option>
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Party / Business Name (name*) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Holdings Ltd."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Phone (phone*) *</label>
                  <input
                    type="text"
                    required
                    placeholder="+880 1700-000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Email (email)</label>
                  <input
                    type="email"
                    placeholder="info@party.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm font-mono"
                  />
                </div>
              </div>

              {/* Share % N(0-100) */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Equity Share % [share% N(0-100)]</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0.00"
                  value={formData.share_pct}
                  onChange={(e) => setFormData({ ...formData, share_pct: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Agreement Ref */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Agreement Ref Code (agreement_ref S)</label>
                <input
                  type="text"
                  placeholder="e.g. AGR-2026-01"
                  value={formData.agreement_ref}
                  onChange={(e) => setFormData({ ...formData, agreement_ref: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm font-mono"
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
                  Save Party
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}