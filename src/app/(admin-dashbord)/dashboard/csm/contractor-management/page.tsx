'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, ChevronRight, Plus, Star, Phone, Building2, CheckCircle2 } from 'lucide-react';

interface ContractorItem {
  id: string;
  code: string; // code* T(uniq)
  name: string; // name* T
  contact: string; // contact* T
  address?: string; // address TA
  trade: 'civil' | 'electrical' | 'plumbing' | 'finishing' | 'hvac' | 'other'; // trade* S
  rating: number; // rating N(1-5)
  projects_count: number; // projects#
  status: 'active' | 'inactive' | 'pending'; // status S
}

const initialContractors: ContractorItem[] = [
  {
    id: 'cnt-1',
    code: 'CON-CIV-01',
    name: 'National Builders & Civil Infra',
    contact: '+880 1711-000111',
    address: 'Plot 45, Gulshan Avenue, Dhaka',
    trade: 'civil',
    rating: 5,
    projects_count: 4,
    status: 'active'
  },
  {
    id: 'cnt-2',
    code: 'CON-MEP-02',
    name: 'Apex MEP Engineering Ltd.',
    contact: '+880 1819-222333',
    address: 'Agrabad C/A, Chittagong',
    trade: 'plumbing',
    rating: 4,
    projects_count: 2,
    status: 'active'
  }
];

export default function ContractorPage() {
  const [list, setList] = useState<ContractorItem[]>(initialContractors);
  const [showForm, setShowForm] = useState(false);

  // POST Form State (/construction/contractors/create)
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [trade, setTrade] = useState<'civil' | 'electrical' | 'plumbing' | 'finishing' | 'hvac' | 'other'>('civil');
  const [rating, setRating] = useState<number>(5);
  const [status, setStatus] = useState<'active' | 'inactive' | 'pending'>('active');

  // POST Handler
  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !contact) {
      alert('Required fields fulfill korn!');
      return;
    }

    const newItem: ContractorItem = {
      id: `cnt-${Date.now()}`,
      code: code.toUpperCase(),
      name,
      contact,
      address: address || undefined,
      trade,
      rating,
      projects_count: 0,
      status
    };

    setList([newItem, ...list]);
    setShowForm(false);
    
    // Reset
    setCode('');
    setName('');
    setContact('');
    setAddress('');
    setRating(5);
  };

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <nav className="flex items-center text-xs text-slate-500 space-x-2 mb-1">
            <Link href="/construction" className="hover:text-blue-600">Construction</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-900">Contractors</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900">Contractor Management</h1>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel Form' : 'POST Contractor (/create)'}
        </button>
      </div>

      {/* POST Form (/construction/contractors/create) */}
      {showForm && (
        <form onSubmit={handlePost} className="mb-6 p-5 border border-blue-200 bg-blue-50/40 rounded-2xl space-y-4">
          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">POST /construction/contractors/create</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">code* T(uniq) *</label>
              <input
                type="text"
                required
                placeholder="CON-CIV-03"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="bg-white border text-xs font-mono font-bold rounded-xl p-2.5 w-full focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">name* T *</label>
              <input
                type="text"
                required
                placeholder="Company Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">contact* T (Phone/Email) *</label>
              <input
                type="text"
                required
                placeholder="+880 1700-000000"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">trade* S *</label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value as any)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none capitalize"
              >
                <option value="civil">Civil</option>
                <option value="electrical">Electrical</option>
                <option value="plumbing">Plumbing</option>
                <option value="finishing">Finishing</option>
                <option value="hvac">HVAC</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">rating N(1-5) *</label>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none"
              >
                <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                <option value={3}>3 Stars ⭐⭐⭐</option>
                <option value={2}>2 Stars ⭐⭐</option>
                <option value={1}>1 Star ⭐</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">status S *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none capitalize"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">address TA</label>
            <textarea
              rows={2}
              placeholder="Full office address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl">
              Save Contractor
            </button>
          </div>
        </form>
      )}

      {/* GET List Table (/construction/contractors) */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b text-xs font-bold text-slate-700 uppercase">
          GET /construction/contractors
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs font-bold uppercase text-slate-600 border-b">
            <tr>
              <th className="p-3.5">Code</th>
              <th className="p-3.5">Name</th>
              <th className="p-3.5">Trade</th>
              <th className="p-3.5">Phone / Contact</th>
              <th className="p-3.5">Rating</th>
              <th className="p-3.5">Projects#</th>
              <th className="p-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="p-3.5 font-mono font-bold text-blue-600">{item.code}</td>
                <td className="p-3.5 font-bold text-slate-900">{item.name}</td>
                <td className="p-3.5 text-xs capitalize font-semibold text-slate-700">{item.trade}</td>
                <td className="p-3.5 text-xs text-slate-600 font-mono">{item.contact}</td>
                <td className="p-3.5 text-xs text-amber-500 font-bold">
                  {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                </td>
                <td className="p-3.5 font-mono font-bold text-slate-800">{item.projects_count}</td>
                <td className="p-3.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                    item.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.status}
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