'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  History, 
  X, 
  CheckCircle2, 
  User, 
  Calendar 
} from 'lucide-react';

interface BOQRevision {
  id: string;
  rev_no: number;
  reason: string;
  total: number;
  changed_by: string;
  created_at: string;
  notes?: string;
}

const initialRevisions: BOQRevision[] = [
  {
    id: 'rev-01',
    rev_no: 1,
    reason: 'Initial BOQ draft estimation and review with contractor.',
    total: 12500000.00,
    changed_by: 'Engineer Shamim Khan',
    created_at: '2026-02-10',
    notes: 'Approved standard baseline rates.'
  },
  {
    id: 'rev-02',
    rev_no: 2,
    reason: 'Price adjustment for steel reinforcement and concrete grade upgrades.',
    total: 13000000.00,
    changed_by: 'Project Manager Rahim Ahmed',
    created_at: '2026-03-05',
    notes: 'Updated as per structural consultant request.'
  }
];

export default function BOQRevisionsPage() {
  const [revisions, setRevisions] = useState<BOQRevision[]>(initialRevisions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State for Revision Creation
  const [formData, setFormData] = useState({
    reason: '',
    notes: '',
    total: ''
  });

  const handleCreateRevision = (e: React.FormEvent) => {
    e.preventDefault();
    const newRev: BOQRevision = {
      id: `rev-0${revisions.length + 1}`,
      rev_no: revisions.length + 1,
      reason: formData.reason || 'General revision update',
      total: parseFloat(formData.total) || 13000000.00,
      changed_by: 'Shamim Khan',
      created_at: new Date().toISOString().split('T')[0],
      notes: formData.notes
    };

    setRevisions([newRev, ...revisions]);
    setIsModalOpen(false);
    setFormData({ reason: '', notes: '', total: '' });
  };

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8 font-sans text-slate-800">
      
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <nav className="flex items-center text-sm text-slate-500 space-x-2 mb-1">
            <Link href="/construction/boq" className="hover:text-blue-600">BOQ List</Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900">Revisions History</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">BOQ Revisions & Versioning</h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Create Revision
        </button>
      </div>

      {/* Revisions List Table */}
      <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" /> Revision History Log
          </h3>
          <span className="text-xs font-semibold text-slate-500">{revisions.length} Total Revisions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Rev No</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Total Amount ($)</th>
                <th className="py-3.5 px-4">Changed By</th>
                <th className="py-3.5 px-4">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {revisions.map((rev) => (
                <tr key={rev.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">Rev {rev.rev_no}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{rev.reason}</div>
                    {rev.notes && <div className="text-xs text-slate-500 mt-0.5">{rev.notes}</div>}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ${rev.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    <span className="inline-flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded-md">
                      <User className="w-3.5 h-3.5 text-slate-500" /> {rev.changed_by}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {rev.created_at}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revision Create Modal Form (/construction/boq/:uuid/revisions/create) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Create BOQ Revision</h2>
                <p className="text-xs text-slate-500 font-mono">Route: /construction/boq/:uuid/revisions/create</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRevision} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Revision Number [rev_no N(auto)]</label>
                <input
                  type="text"
                  disabled
                  value={`Rev ${revisions.length + 1} (Auto Generated)`}
                  className="bg-slate-100 border border-slate-200 text-slate-500 text-sm rounded-xl px-3.5 py-2.5 w-full font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Reason for Revision [reason* TA] *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain why this revision is being created..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Updated Total Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="13000000.00"
                  value={formData.total}
                  onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Additional Notes / Sections Changed</label>
                <input
                  type="text"
                  placeholder="e.g. Updated concrete grade & steel quantities"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm"
                >
                  Submit Revision
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}