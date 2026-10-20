'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, ChevronRight, Plus, Ruler, Calendar, User, Upload } from 'lucide-react';

interface MeasurementItem {
  id: string;
  package: string;
  item: string;
  measured_qty: number;
  measured_at: string;
  measured_by: string;
  certified_qty: number;
}

const initialMeasureList: MeasurementItem[] = [
  {
    id: 'msr-1',
    package: 'Foundation & Substructure RCC Work',
    item: 'EW-02 Excavation',
    measured_qty: 450,
    measured_at: '2026-10-12',
    measured_by: 'Shamim Khan',
    certified_qty: 450
  }
];

export default function MeasurePage() {
  const [list, setList] = useState<MeasurementItem[]>(initialMeasureList);
  const [showForm, setShowForm] = useState(false);

  // POST State
  const [pkg, setPkg] = useState('Foundation & Substructure RCC Work');
  const [item, setItem] = useState('EW-02 Excavation');
  const [qty, setQty] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // POST Handler
  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = parseFloat(qty) || 0;
    if (qtyNum <= 0) {
      alert('measured_qty strictly > 0');
      return;
    }

    const newItem: MeasurementItem = {
      id: `msr-${Date.now()}`,
      package: pkg,
      item: item,
      measured_qty: qtyNum,
      measured_at: date,
      measured_by: 'Shamim Khan', // Auto current user
      certified_qty: 0
    };

    setList([newItem, ...list]);
    setShowForm(false);
    setQty('');
  };

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <nav className="flex items-center text-xs text-slate-500 space-x-2 mb-1">
            <Link href="/construction" className="hover:text-blue-600">Construction</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-900">Measure</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900">Measurement Log</h1>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel Form' : 'POST New Measurement'}
        </button>
      </div>

      {/* POST Form */}
      {showForm && (
        <form onSubmit={handlePost} className="mb-6 p-5 border border-blue-200 bg-blue-50/40 rounded-2xl space-y-4">
          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">POST /construction/measure/create</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">package* S</label>
              <input
                type="text"
                required
                value={pkg}
                onChange={(e) => setPkg(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">item* S(BOQ items)</label>
              <input
                type="text"
                required
                value={item}
                onChange={(e) => setItem(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">measured_qty* N(0)</label>
              <input
                type="number"
                step="any"
                required
                placeholder="450"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="bg-white border text-xs font-mono font-bold rounded-xl p-2.5 w-full focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">measured_at* D</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">measured_by S(auto=current)</label>
              <input
                type="text"
                disabled
                value="Shamim Khan"
                className="bg-slate-100 border text-xs text-slate-500 rounded-xl p-2.5 w-full cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl">
              Save Measurement
            </button>
          </div>
        </form>
      )}

      {/* GET List Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b text-xs font-bold text-slate-700 uppercase">
          GET /construction/measure
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs font-bold uppercase text-slate-600 border-b">
            <tr>
              <th className="p-3.5">Package</th>
              <th className="p-3.5">Item</th>
              <th className="p-3.5">Measured Qty</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Measured By</th>
              <th className="p-3.5">Certified Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-slate-900">{item.package}</td>
                <td className="p-3.5 text-slate-700">{item.item}</td>
                <td className="p-3.5 font-mono font-bold text-blue-600">{item.measured_qty}</td>
                <td className="p-3.5 text-xs text-slate-600 font-mono">{item.measured_at}</td>
                <td className="p-3.5 text-xs text-slate-600">{item.measured_by}</td>
                <td className="p-3.5 font-mono font-bold text-emerald-600">{item.certified_qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}