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
  CheckCircle2, 
  Clock, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface BOQItem {
  id: string;
  code: string;
  title: string;
  project: string;
  version: string;
  total_amount: number;
  status: 'draft' | 'approved' | 'in_review' | 'revised';
}

const initialBOQs: BOQItem[] = [
  {
    id: 'boq-uuid-001',
    code: 'BOQ-SCT-01',
    title: 'Skyline City Tower - Phase 1 Structural & Civil BOQ',
    project: 'Skyline City Tower Phase 1',
    version: 'v1.2',
    total_amount: 13000000.00,
    status: 'approved'
  },
  {
    id: 'boq-uuid-002',
    code: 'BOQ-LCP-02',
    title: 'Lakeside Commercial Park Electrical & Substation',
    project: 'Lakeside Commercial Park',
    version: 'v1.0',
    total_amount: 6000000.00,
    status: 'in_review'
  },
  {
    id: 'boq-uuid-003',
    code: 'BOQ-CLH-03',
    title: 'Coastal Logistics Hub Foundation Work',
    project: 'Coastal Logistics Hub',
    version: 'v2.0',
    total_amount: 4500000.00,
    status: 'draft'
  }
];

export default function BOQListPage() {
  const [boqs, setBoqs] = useState<BOQItem[]>(initialBOQs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredBOQs = useMemo(() => {
    return boqs.filter(item => {
      const matchesSearch = 
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.project.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [boqs, searchQuery, selectedStatus]);

  const stats = useMemo(() => {
    const totalCount = boqs.length;
    const totalVal = boqs.reduce((acc, curr) => acc + curr.total_amount, 0);
    const approved = boqs.filter(b => b.status === 'approved').length;
    return { totalCount, totalVal, approved };
  }, [boqs]);

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8 font-sans text-slate-800">
      
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <nav className="flex items-center text-sm text-slate-500 space-x-2 mb-1">
            <Link href="/construction" className="flex items-center hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4 mr-1" /> Construction
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900">Bill of Quantities (BOQ)</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">BOQ Management List</h1>
        </div>

        <Link
          href="/construction/boq/create"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Create BOQ
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total BOQs</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total BOQ Value</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              ${(stats.totalVal / 1000000).toFixed(2)}M
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved BOQs</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.approved}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        
        {/* Search & Filter Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-xs font-semibold text-slate-500 uppercase">Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm capitalize"
            >
              <option value="All">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="in_review">In Review</option>
              <option value="approved">Approved</option>
              <option value="revised">Revised</option>
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search code, title, project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-600 shadow-sm"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Version</th>
                <th className="py-3.5 px-4">Total Amount ($)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredBOQs.length > 0 ? (
                filteredBOQs.map((boq) => (
                  <tr key={boq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{boq.code}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{boq.title}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{boq.project}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">{boq.version}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ${boq.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        boq.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        boq.status === 'in_review' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {boq.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/construction/boq/${boq.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Editor <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No BOQ records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}