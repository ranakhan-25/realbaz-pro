'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Briefcase, 
  FileText 
} from 'lucide-react';

interface DelayItem {
  id: string;
  package: string; // package* S
  reason: 'weather' | 'material' | 'labour' | 'design' | 'other'; // reason* S
  days: number; // days* N(>0)
  impact: string; // impact* TA
  mitigation?: string; // mitigation TA
  status: 'pending_approval' | 'approved' | 'rejected' | 'mitigated'; // status S
}

const initialDelays: DelayItem[] = [
  {
    id: 'del-01',
    package: 'Foundation & Substructure RCC Work',
    reason: 'weather',
    days: 12,
    impact: 'Continuous heavy rainfall and tidal flooding in basement excavation pit halted concrete casting.',
    mitigation: 'Deployed high-capacity dewatering pumps and worked extended night shifts.',
    status: 'approved'
  },
  {
    id: 'del-02',
    package: 'Exterior Glass Curtain Wall Façade',
    reason: 'material',
    days: 25,
    impact: 'Imported double-glazed glass shipment delayed at port customs due to clearance clearance holding.',
    mitigation: 'Re-routed internal dry-wall fitting work packages forward in schedule.',
    status: 'mitigated'
  },
  {
    id: 'del-03',
    package: 'High Voltage Electrical Substation & Wiring',
    reason: 'design',
    days: 7,
    impact: 'Revised transformer room ventilation dimensions received late from MEP consultant.',
    mitigation: 'Adjusted masonry wall opening sizes on site.',
    status: 'pending_approval'
  }
];

export default function DelaysPage() {
  const [list, setList] = useState<DelayItem[]>(initialDelays);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // POST Form State (/construction/delays/create)
  const [packageName, setPackageName] = useState('Superstructure Concrete Frame (Floors 1-15)');
  const [reason, setReason] = useState<DelayItem['reason']>('material');
  const [days, setDays] = useState('');
  const [impact, setImpact] = useState('');
  const [mitigation, setMitigation] = useState('');
  const [status, setStatus] = useState<DelayItem['status']>('pending_approval');

  // POST Handler (/construction/delays/create)
  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    const daysNum = parseInt(days) || 0;

    if (daysNum <= 0) {
      alert('days must be strictly greater than 0 (>0)!');
      return;
    }

    if (!impact) {
      alert('Impact description is required!');
      return;
    }

    const newItem: DelayItem = {
      id: `del-${Date.now()}`,
      package: packageName,
      reason,
      days: daysNum,
      impact,
      mitigation: mitigation || undefined,
      status
    };

    setList([newItem, ...list]);
    setShowForm(false);

    // Reset
    setDays('');
    setImpact('');
    setMitigation('');
  };

  const filteredList = list.filter((item) =>
    item.package.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.impact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <nav className="flex items-center text-xs text-slate-500 space-x-2 mb-1">
            <Link href="/construction" className="hover:text-blue-600">Construction</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">Project Delays</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900">Schedule Delays Log & Mitigation</h1>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel Form' : 'POST Delay (/create)'}
        </button>
      </div>

      {/* POST Form (/construction/delays/create) */}
      {showForm && (
        <form onSubmit={handlePost} className="mb-6 p-5 border border-blue-200 bg-blue-50/40 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-blue-100 pb-2">
            <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              POST /construction/delays/create
            </h2>
            <span className="text-xs text-blue-600 font-mono font-medium">Feature 04.10</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Package S */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">package* S *</label>
              <select
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              >
                <option value="Foundation & Substructure RCC Work">Foundation & Substructure RCC Work</option>
                <option value="Superstructure Concrete Frame (Floors 1-15)">Superstructure Concrete Frame (Floors 1-15)</option>
                <option value="Plumbing & Drainage Piping System">Plumbing & Drainage Piping System</option>
                <option value="High Voltage Electrical Substation & Wiring">High Voltage Electrical Substation & Wiring</option>
                <option value="Exterior Glass Curtain Wall Façade">Exterior Glass Curtain Wall Façade</option>
              </select>
            </div>

            {/* Reason S */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">reason* S *</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="bg-white border text-xs font-semibold rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600 capitalize"
              >
                <option value="weather">Weather</option>
                <option value="material">Material</option>
                <option value="labour">Labour</option>
                <option value="design">Design</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Days N(>0) */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">days* N(0) *</label>
              <input
                type="number"
                min="1"
                required
                placeholder="Number of delay days (e.g. 10)"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="bg-white border text-xs font-mono font-bold rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Impact TA */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">impact* TA *</label>
            <textarea
              rows={2}
              required
              placeholder="Describe the critical path schedule delay impact..."
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mitigation TA */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">mitigation TA</label>
              <textarea
                rows={2}
                placeholder="Action plan to recover lost time..."
                value={mitigation}
                onChange={(e) => setMitigation(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Status S */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">status S</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600 capitalize"
              >
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="mitigated">Mitigated</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-blue-100">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              Save Delay Log
            </button>
          </div>
        </form>
      )}

      {/* GET List Table (/construction/delays) */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        
        {/* Search Header */}
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            GET /construction/delays
          </span>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search package, reason, impact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border text-xs rounded-xl pl-8 pr-3 py-1.5 w-full focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-xs font-bold uppercase text-slate-600 border-b border-slate-200">
                <th className="p-3.5">Work Package</th>
                <th className="p-3.5">Reason Category</th>
                <th className="p-3.5">Delay Duration</th>
                <th className="p-3.5">Impact Description</th>
                <th className="p-3.5">Mitigation Plan</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredList.length > 0 ? (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{item.package}</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 uppercase">
                        {item.reason}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-rose-600 whitespace-nowrap">
                      {item.days} Days
                    </td>
                    <td className="p-3.5 text-xs text-slate-700 max-w-xs">{item.impact}</td>
                    <td className="p-3.5 text-xs text-slate-600 max-w-xs">
                      {item.mitigation || <span className="text-slate-400">None specified</span>}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        item.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.status === 'mitigated' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    No delay logs recorded.
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