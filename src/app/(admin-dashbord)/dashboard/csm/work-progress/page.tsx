'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, ChevronRight, Plus, Calendar, Percent, Briefcase, FileText, CheckCircle2 } from 'lucide-react';

interface ProgressItem {
  id: string;
  package: string;
  as_of: string;
  pct: number;
  cumulative_qty: number;
  remarks?: string;
}

const initialList: ProgressItem[] = [
  {
    id: 'prg-1',
    package: 'Foundation & Substructure RCC Work',
    as_of: '2026-10-15',
    pct: 100,
    cumulative_qty: 450,
    remarks: '100% completed'
  },
  {
    id: 'prg-2',
    package: 'Superstructure Concrete Frame (Floors 1-15)',
    as_of: '2026-10-18',
    pct: 68,
    cumulative_qty: 1020,
    remarks: 'Ongoing floor slab casting'
  }
];

export default function ProgressPage() {
  const [list, setList] = useState<ProgressItem[]>(initialList);
  const [showForm, setShowForm] = useState(false);

  // POST Form State
  const [pkg, setPkg] = useState('Foundation & Substructure RCC Work');
  const [asOf, setAsOf] = useState(new Date().toISOString().split('T')[0]);
  const [pct, setPct] = useState('');
  const [remarks, setRemarks] = useState('');

  // POST Handler
  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    const pctNum = parseFloat(pct) || 0;
    if (pctNum < 0 || pctNum > 100) {
      alert('pct value must be between 0 and 100');
      return;
    }

    const newItem: ProgressItem = {
      id: `prg-${Date.now()}`,
      package: pkg,
      as_of: asOf,
      pct: pctNum,
      cumulative_qty: 0,
      remarks: remarks || undefined
    };

    setList([newItem, ...list]);
    setShowForm(false);
    setPct('');
    setRemarks('');
  };

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <nav className="flex items-center text-xs text-slate-500 space-x-2 mb-1">
            <Link href="/construction" className="hover:text-blue-600">Construction</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-900">Progress</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900">Progress Measurement</h1>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel Form' : 'POST New Progress'}
        </button>
      </div>

      {/* POST Form */}
      {showForm && (
        <form onSubmit={handlePost} className="mb-6 p-5 border border-blue-200 bg-blue-50/40 rounded-2xl space-y-4">
          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">POST /construction/progress/create</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">package* S</label>
              <select
                value={pkg}
                onChange={(e) => setPkg(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none"
              >
                <option value="Foundation & Substructure RCC Work">Foundation & Substructure RCC Work</option>
                <option value="Superstructure Concrete Frame (Floors 1-15)">Superstructure Concrete Frame (Floors 1-15)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">as_of* D</label>
              <input
                type="date"
                required
                value={asOf}
                onChange={(e) => setAsOf(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">pct* N(0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                required
                placeholder="75"
                value={pct}
                onChange={(e) => setPct(e.target.value)}
                className="bg-white border text-xs font-mono font-bold rounded-xl p-2.5 w-full focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">remarks TA</label>
            <input
              type="text"
              placeholder="Enter remarks..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl">
              Save Entry
            </button>
          </div>
        </form>
      )}

      {/* GET List Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b text-xs font-bold text-slate-700 uppercase">
          GET /construction/progress
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs font-bold uppercase text-slate-600 border-b">
            <tr>
              <th className="p-3.5">Package</th>
              <th className="p-3.5">As Of</th>
              <th className="p-3.5">Progress (%)</th>
              <th className="p-3.5">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-slate-900">{item.package}</td>
                <td className="p-3.5 text-xs text-slate-600 font-mono">{item.as_of}</td>
                <td className="p-3.5 font-mono font-bold text-blue-600">{item.pct}%</td>
                <td className="p-3.5 text-xs text-slate-500">{item.remarks || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}