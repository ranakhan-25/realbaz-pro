'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  User, 
  DollarSign, 
  Phone, 
  CreditCard, 
  Upload, 
  X, 
  Building2 
} from 'lucide-react';

interface LabourItem {
  id: string;
  name: string; // name* T
  nid?: string; // nid T(unique)
  contractor?: string; // contractor S
  trade: 'mason' | 'carpenter' | 'steel_fixer' | 'helper' | 'electrician' | 'plumber' | 'painter'; // trade* S
  daily_rate: number; // daily_rate* MONEY(>0)
  phone?: string; // phone T
  photo?: string; // photo F
  status: 'active' | 'inactive' | 'on_leave'; // status S
}

const initialLabourList: LabourItem[] = [
  {
    id: 'lab-1',
    name: 'Abdul Jalil',
    nid: '19922691234567891',
    contractor: 'National Builders & Civil Infra',
    trade: 'mason',
    daily_rate: 850.00,
    phone: '+880 1711-223344',
    status: 'active'
  },
  {
    id: 'lab-2',
    name: 'Rafiqul Islam',
    nid: '19882699876543210',
    contractor: 'National Builders & Civil Infra',
    trade: 'steel_fixer',
    daily_rate: 900.00,
    phone: '+880 1819-556677',
    status: 'active'
  },
  {
    id: 'lab-3',
    name: 'Sumon Mia',
    nid: '19952691122334455',
    contractor: 'Apex MEP Engineering Ltd.',
    trade: 'plumber',
    daily_rate: 800.00,
    phone: '+880 1912-889900',
    status: 'active'
  }
];

export default function LabourPage() {
  const [list, setList] = useState<LabourItem[]>(initialLabourList);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // POST Form State (/construction/labour/create)
  const [name, setName] = useState('');
  const [nid, setNid] = useState('');
  const [contractor, setContractor] = useState('National Builders & Civil Infra');
  const [trade, setTrade] = useState<LabourItem['trade']>('mason');
  const [dailyRate, setDailyRate] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<LabourItem['status']>('active');
  const [photoFileName, setPhotoFileName] = useState('');

  // File Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFileName(e.target.files[0].name);
    }
  };

  // POST Handler (/construction/labour/create)
  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseFloat(dailyRate) || 0;

    if (rateNum <= 0) {
      alert('daily_rate must be greater than 0 (>0)');
      return;
    }

    const newItem: LabourItem = {
      id: `lab-${Date.now()}`,
      name,
      nid: nid || undefined,
      contractor: contractor || undefined,
      trade,
      daily_rate: rateNum,
      phone: phone || undefined,
      photo: photoFileName || undefined,
      status
    };

    setList([newItem, ...list]);
    setShowForm(false);

    // Reset Form
    setName('');
    setNid('');
    setDailyRate('');
    setPhone('');
    setPhotoFileName('');
  };

  const filteredList = list.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.nid && item.nid.includes(searchQuery)) ||
    (item.contractor && item.contractor.toLowerCase().includes(searchQuery.toLowerCase())) ||
    item.trade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-slate-800">
      
      {/* Header & Breadcrumbs */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <nav className="flex items-center text-xs text-slate-500 space-x-2 mb-1">
            <Link href="/construction" className="hover:text-blue-600">Construction</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">Labour Management</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900">Labour Directory</h1>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel Form' : 'POST Labour (/create)'}
        </button>
      </div>

      {/* POST Form (/construction/labour/create) */}
      {showForm && (
        <form onSubmit={handlePost} className="mb-6 p-5 border border-blue-200 bg-blue-50/40 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-blue-100 pb-2">
            <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              POST /construction/labour/create
            </h2>
            <span className="text-xs text-blue-600 font-mono font-medium">Feature 04.07</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Labour Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">name* T *</label>
              <input
                type="text"
                required
                placeholder="Full Name (e.g. Abdul Jalil)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* NID (Unique) */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">nid T(unique)</label>
              <input
                type="text"
                placeholder="National ID Number"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                className="bg-white border text-xs font-mono rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Contractor */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">contractor S</label>
              <select
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              >
                <option value="National Builders & Civil Infra">National Builders & Civil Infra</option>
                <option value="Apex MEP Engineering Ltd.">Apex MEP Engineering Ltd.</option>
                <option value="PowerGrid Solutions Bangladesh">PowerGrid Solutions Bangladesh</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Trade Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">trade* S *</label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value as any)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600 capitalize"
              >
                <option value="mason">Mason</option>
                <option value="carpenter">Carpenter</option>
                <option value="steel_fixer">Steel Fixer</option>
                <option value="helper">Helper</option>
                <option value="electrician">Electrician</option>
                <option value="plumber">Plumber</option>
                <option value="painter">Painter</option>
              </select>
            </div>

            {/* Daily Rate MONEY(>0) */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">daily_rate* MONEY(0) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="850.00"
                value={dailyRate}
                onChange={(e) => setDailyRate(e.target.value)}
                className="bg-white border text-xs font-mono font-bold rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">phone T</label>
              <input
                type="text"
                placeholder="+880 1700-000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">status S</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600 capitalize"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>

          {/* Photo File Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">photo F (Labour Photo)</label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                Browse Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              {photoFileName && (
                <span className="text-xs text-slate-600 font-mono inline-flex items-center gap-1">
                  {photoFileName}
                  <button type="button" onClick={() => setPhotoFileName('')}>
                    <X className="w-3.5 h-3.5 text-rose-500 hover:text-rose-700" />
                  </button>
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-blue-100">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              Save Labour Record
            </button>
          </div>
        </form>
      )}

      {/* GET List Table (/construction/labour) */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        
        {/* Search Header */}
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            GET /construction/labour
          </span>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search labour name, NID, trade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 text-xs rounded-xl pl-8 pr-3 py-1.5 w-full focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-xs font-bold uppercase text-slate-600 border-b border-slate-200">
                <th className="p-3.5">Name</th>
                <th className="p-3.5">NID Number</th>
                <th className="p-3.5">Contractor</th>
                <th className="p-3.5">Trade</th>
                <th className="p-3.5">Daily Rate (৳)</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredList.length > 0 ? (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      {item.phone && (
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{item.phone}</div>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-xs text-slate-600">
                      {item.nid || <span className="text-slate-300">N/A</span>}
                    </td>
                    <td className="p-3.5 text-slate-700 font-medium text-xs">
                      {item.contractor || <span className="text-slate-300">Direct / Independent</span>}
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                        {item.trade.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      ৳{item.daily_rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        item.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.status === 'on_leave' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    No labour entries found.
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