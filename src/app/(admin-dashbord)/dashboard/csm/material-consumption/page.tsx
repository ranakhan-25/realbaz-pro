'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  Package, 
  Calendar, 
  FileText, 
  Upload, 
  X, 
  Building2 
} from 'lucide-react';

interface ConsumptionItem {
  id: string;
  project: string; // project* S
  item: string; // item* S
  qty: number; // qty* N(>0)
  uom: string; // uom(auto)
  date: string; // date* D
  ref_type: 'daily_report' | 'work_package' | 'manual'; // ref_type S
  ref_no: string; // ref_uuid S / ref_no
  photo?: string; // photo F
}

const initialConsumptionList: ConsumptionItem[] = [
  {
    id: 'cons-1',
    project: 'Skyline City Tower Phase 1',
    item: 'Portland Cement Bags (50kg)',
    qty: 150,
    uom: 'Bags',
    date: '2026-10-18',
    ref_type: 'daily_report',
    ref_no: 'DSR-SCT-01'
  },
  {
    id: 'cons-2',
    project: 'Lakeside Commercial Park',
    item: '16mm Deformed Steel Rebar',
    qty: 3.5,
    uom: 'Tons',
    date: '2026-10-19',
    ref_type: 'work_package',
    ref_no: 'WP-STR-02'
  },
  {
    id: 'cons-3',
    project: 'Coastal Logistics Hub',
    item: 'Ready-Mix Concrete (M30)',
    qty: 45,
    uom: 'Cubic Meters',
    date: '2026-10-20',
    ref_type: 'manual',
    ref_no: 'MAN-REG-03'
  }
];

export default function MaterialConsumptionPage() {
  const [list, setList] = useState<ConsumptionItem[]>(initialConsumptionList);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // POST Form State (/construction/consumption/create)
  const [project, setProject] = useState('Skyline City Tower Phase 1');
  const [item, setItem] = useState('Portland Cement Bags (50kg)');
  const [qty, setQty] = useState('');
  const [uom, setUom] = useState('Bags');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [refType, setRefType] = useState<ConsumptionItem['ref_type']>('daily_report');
  const [refNo, setRefNo] = useState('');
  const [photoFileName, setPhotoFileName] = useState('');

  // File Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFileName(e.target.files[0].name);
    }
  };

  // POST Handler (/construction/consumption/create)
  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = parseFloat(qty) || 0;

    if (qtyNum <= 0) {
      alert('qty must be greater than zero (>0)');
      return;
    }

    const newItem: ConsumptionItem = {
      id: `cons-${Date.now()}`,
      project,
      item,
      qty: qtyNum,
      uom,
      date,
      ref_type: refType,
      ref_no: refNo || 'REF-GENERAL-01',
      photo: photoFileName || undefined
    };

    setList([newItem, ...list]);
    setShowForm(false);

    // Reset Form
    setQty('');
    setRefNo('');
    setPhotoFileName('');
  };

  const filteredList = list.filter((elem) =>
    elem.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
    elem.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
    elem.ref_no.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-slate-800">
      
      {/* Header & Breadcrumbs */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <nav className="flex items-center text-xs text-slate-500 space-x-2 mb-1">
            <Link href="/construction" className="hover:text-blue-600">Construction</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">Material Consumption</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900">Material Consumption Tracking</h1>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel Form' : 'POST Consumption (/create)'}
        </button>
      </div>

      {/* POST Form (/construction/consumption/create) */}
      {showForm && (
        <form onSubmit={handlePost} className="mb-6 p-5 border border-blue-200 bg-blue-50/40 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-blue-100 pb-2">
            <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              POST /construction/consumption/create
            </h2>
            <span className="text-xs text-blue-600 font-mono font-medium">Feature 04.08</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Project S */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">project* S *</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              >
                <option value="Skyline City Tower Phase 1">Skyline City Tower Phase 1</option>
                <option value="Lakeside Commercial Park">Lakeside Commercial Park</option>
                <option value="Coastal Logistics Hub">Coastal Logistics Hub</option>
              </select>
            </div>

            {/* Item S */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">item* S *</label>
              <input
                type="text"
                required
                placeholder="Material Item Description"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Qty N(>0) */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">qty* N(0) *</label>
              <input
                type="number"
                step="any"
                min="0.01"
                required
                placeholder="150"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="bg-white border text-xs font-mono font-bold rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* UOM (auto) */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">uom (auto) *</label>
              <input
                type="text"
                required
                value={uom}
                onChange={(e) => setUom(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Date D */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">date* D *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Ref Type S */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">ref_type S *</label>
              <select
                value={refType}
                onChange={(e) => setRefType(e.target.value as any)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600 capitalize"
              >
                <option value="daily_report">Daily Report</option>
                <option value="work_package">Work Package</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ref UUID / No */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">ref_uuid / ref_no S *</label>
              <input
                type="text"
                required
                placeholder="e.g. DSR-SCT-01 or WP-STR-02"
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
                className="bg-white border text-xs font-mono rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Photo F */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">photo F (Challan / Receipt)</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  Browse File
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
          </div>

          <div className="flex justify-end pt-2 border-t border-blue-100">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              Save Consumption Record
            </button>
          </div>
        </form>
      )}

      {/* GET List Table (/construction/consumption) */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        
        {/* Search Header */}
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            GET /construction/consumption
          </span>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search project, item, ref no..."
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
                <th className="p-3.5">Project</th>
                <th className="p-3.5">Material Item</th>
                <th className="p-3.5">Quantity</th>
                <th className="p-3.5">UOM</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Reference Type & No</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredList.length > 0 ? (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{item.project}</td>
                    <td className="p-3.5 text-slate-700 font-medium">{item.item}</td>
                    <td className="p-3.5 font-mono font-bold text-blue-600">
                      {item.qty.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5 text-xs text-slate-600 font-semibold">{item.uom}</td>
                    <td className="p-3.5 font-mono text-xs text-slate-600 whitespace-nowrap">{item.date}</td>
                    <td className="p-3.5">
                      <div className="flex flex-col">
                        <span className="inline-flex items-center w-max px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 capitalize mb-0.5">
                          {item.ref_type.replace('_', ' ')}
                        </span>
                        <span className="font-mono text-xs text-slate-800 font-bold">{item.ref_no}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    No material consumption records found.
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