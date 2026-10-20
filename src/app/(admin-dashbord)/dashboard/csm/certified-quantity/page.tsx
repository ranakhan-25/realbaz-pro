'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, ChevronRight, Plus, CheckCircle2 } from 'lucide-react';

interface CertifiedItem {
  id: string;
  package: string;
  item: string;
  certified_qty: number;
  period: string; // T(YYYY-MM)
  bill_ref: string;
  status: string;
}

const initialCertList: CertifiedItem[] = [
  {
    id: 'cert-1',
    package: 'Foundation & Substructure RCC Work',
    item: 'EW-02 Excavation',
    certified_qty: 450,
    period: '2026-10',
    bill_ref: 'BILL-OCT-01',
    status: 'certified'
  }
];

export default function CertifiedPage() {
  const [list, setList] = useState<CertifiedItem[]>(initialCertList);
  const [showForm, setShowForm] = useState(false);

  // POST State
  const [pkg, setPkg] = useState('Foundation & Substructure RCC Work');
  const [item, setItem] = useState('EW-02 Excavation');
  const [certQty, setCertQty] = useState('');
  const [period, setPeriod] = useState('2026-10');
  const [billRef, setBillRef] = useState('BILL-OCT-02');

  // POST Handler
  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    const certNum = parseFloat(certQty) || 0;

    const newItem: CertifiedItem = {
      id: `cert-${Date.now()}`,
      package: pkg,
      item: item,
      certified_qty: certNum,
      period: period,
      bill_ref: billRef,
      status: 'certified'
    };

    setList([newItem, ...list]);
    setShowForm(false);
    setCertQty('');
  };

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <nav className="flex items-center text-xs text-slate-500 space-x-2 mb-1">
            <Link href="/construction" className="hover:text-blue-600">Construction</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-900">Certified</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900">Certified Quantities</h1>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel Form' : 'POST Certification (Inline Form)'}
        </button>
      </div>

      {/* POST Form */}
      {showForm && (
        <form onSubmit={handlePost} className="mb-6 p-5 border border-blue-200 bg-blue-50/40 rounded-2xl space-y-4">
          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">POST /construction/certified (inline)</h2>

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
              <label className="block text-xs font-semibold text-slate-500 mb-1">item* S</label>
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
              <label className="block text-xs font-semibold text-slate-500 mb-1">certified_qty* N(≤measured)</label>
              <input
                type="number"
                step="any"
                required
                placeholder="450"
                value={certQty}
                onChange={(e) => setCertQty(e.target.value)}
                className="bg-white border text-xs font-mono font-bold rounded-xl p-2.5 w-full focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">period* T(YYYY-MM)</label>
              <input
                type="text"
                required
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-white border text-xs font-mono rounded-xl p-2.5 w-full focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">bill_ref S</label>
              <input
                type="text"
                required
                value={billRef}
                onChange={(e) => setBillRef(e.target.value)}
                className="bg-white border text-xs font-mono rounded-xl p-2.5 w-full focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl">
              Save Certification
            </button>
          </div>
        </form>
      )}

      {/* GET List Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b text-xs font-bold text-slate-700 uppercase">
          GET /construction/certified
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs font-bold uppercase text-slate-600 border-b">
            <tr>
              <th className="p-3.5">Package</th>
              <th className="p-3.5">Item</th>
              <th className="p-3.5">Certified Qty</th>
              <th className="p-3.5">Period</th>
              <th className="p-3.5">Bill Ref</th>
              <th className="p-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-slate-900">{item.package}</td>
                <td className="p-3.5 text-slate-700">{item.item}</td>
                <td className="p-3.5 font-mono font-bold text-emerald-600">{item.certified_qty}</td>
                <td className="p-3.5 font-mono text-xs text-slate-600">{item.period}</td>
                <td className="p-3.5 font-mono font-bold text-blue-600">{item.bill_ref}</td>
                <td className="p-3.5">
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}