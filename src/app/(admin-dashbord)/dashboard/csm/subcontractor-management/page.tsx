'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, ChevronRight, Plus, Users, Phone, Building } from 'lucide-react';

interface SubcontractorItem {
  id: string;
  contractor: string; // contractor* S
  code: string; // code* T
  name: string; // name* T
  trade: string; // trade* S
  contact: string; // contact* T
}

const initialSubcontractors: SubcontractorItem[] = [
  {
    id: 'sub-1',
    contractor: 'National Builders & Civil Infra',
    code: 'SUB-REBAR-01',
    name: 'Bengal Rebar Works Sub-agency',
    trade: 'Civil / Steel Fixing',
    contact: '+880 1912-333444'
  },
  {
    id: 'sub-2',
    contractor: 'Apex MEP Engineering Ltd.',
    code: 'SUB-PIPE-02',
    name: 'Dhaka Pipefitters & Plumbing Co.',
    trade: 'Plumbing',
    contact: '+880 1611-555666'
  }
];

export default function SubcontractorPage() {
  const [list, setList] = useState<SubcontractorItem[]>(initialSubcontractors);
  const [showInlineForm, setShowInlineForm] = useState(false);

  // Inline POST Form State
  const [contractor, setContractor] = useState('National Builders & Civil Infra');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [trade, setTrade] = useState('Civil / Formwork');
  const [contact, setContact] = useState('');

  // Inline POST Handler
  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !contact) {
      alert('Required fields fulfill korn!');
      return;
    }

    const newItem: SubcontractorItem = {
      id: `sub-${Date.now()}`,
      contractor,
      code: code.toUpperCase(),
      name,
      trade,
      contact
    };

    setList([newItem, ...list]);
    setShowInlineForm(false);

    // Reset
    setCode('');
    setName('');
    setContact('');
  };

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <nav className="flex items-center text-xs text-slate-500 space-x-2 mb-1">
            <Link href="/construction" className="hover:text-blue-600">Construction</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-900">Subcontractors</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900">Subcontractor List</h1>
        </div>

        <button
          onClick={() => setShowInlineForm(!showInlineForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> {showInlineForm ? 'Cancel Form' : 'POST Subcontractor (Inline)'}
        </button>
      </div>

      {/* Inline POST Form */}
      {showInlineForm && (
        <form onSubmit={handlePost} className="mb-6 p-5 border border-blue-200 bg-blue-50/40 rounded-2xl space-y-4">
          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">POST Subcontractor (Inline Form)</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">contractor* S *</label>
              <select
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none"
              >
                <option value="National Builders & Civil Infra">National Builders & Civil Infra</option>
                <option value="Apex MEP Engineering Ltd.">Apex MEP Engineering Ltd.</option>
                <option value="PowerGrid Solutions Bangladesh">PowerGrid Solutions Bangladesh</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">code* T *</label>
              <input
                type="text"
                required
                placeholder="SUB-REBAR-02"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="bg-white border text-xs font-mono font-bold rounded-xl p-2.5 w-full focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">name* T *</label>
              <input
                type="text"
                required
                placeholder="Subcontractor Agency Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">trade* S *</label>
              <input
                type="text"
                required
                placeholder="Trade (e.g. Plumbing, Rebar)"
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">contact* T *</label>
              <input
                type="text"
                required
                placeholder="Phone Number / Email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl">
              Save Subcontractor
            </button>
          </div>
        </form>
      )}

      {/* GET List Table (/construction/subcontractors) */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b text-xs font-bold text-slate-700 uppercase">
          GET /construction/subcontractors
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs font-bold uppercase text-slate-600 border-b">
            <tr>
              <th className="p-3.5">Contractor</th>
              <th className="p-3.5">Subcontractor Code</th>
              <th className="p-3.5">Subcontractor Name</th>
              <th className="p-3.5">Trade</th>
              <th className="p-3.5">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-slate-900">{item.contractor}</td>
                <td className="p-3.5 font-mono font-bold text-blue-600">{item.code}</td>
                <td className="p-3.5 text-slate-800 font-semibold">{item.name}</td>
                <td className="p-3.5 text-xs text-slate-600">{item.trade}</td>
                <td className="p-3.5 text-xs text-slate-600 font-mono">{item.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}