'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Save, 
  Layers, 
  DollarSign, 
  History
} from 'lucide-react';

interface BOQItemRow {
  id: string;
  item_code: string;
  description: string;
  unit: string;
  qty: number;
  rate: number;
}

interface BOQSection {
  id: string;
  name: string;
  order: number;
  items: BOQItemRow[];
}

export default function BOQDetailPage() {
  const [sections, setSections] = useState<BOQSection[]>([
    {
      id: 'sec-01',
      name: 'Earthwork & Foundation Excavation',
      order: 1,
      items: [
        { id: 'item-1', item_code: 'EW-01', description: 'Site clearance and topsoil removal', unit: 'sqm', qty: 1200, rate: 15.50 },
        { id: 'item-2', item_code: 'EW-02', description: 'Deep excavation for foundation piles', unit: 'cum', qty: 450, rate: 85.00 }
      ]
    },
    {
      id: 'sec-02',
      name: 'Reinforced Concrete (RCC) Works',
      order: 2,
      items: [
        { id: 'item-3', item_code: 'RCC-01', description: 'Cast in-place concrete grade M30 for footings', unit: 'cum', qty: 320, rate: 210.00 }
      ]
    }
  ]);

  const handleAddItem = (sectionId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        const newItem: BOQItemRow = {
          id: `item-${Date.now()}`,
          item_code: `ITM-0${sec.items.length + 1}`,
          description: 'New BOQ item description',
          unit: 'pcs',
          qty: 1,
          rate: 100.00
        };
        return { ...sec, items: [...sec.items, newItem] };
      }
      return sec;
    }));
  };

  const handleDeleteItem = (sectionId: string, itemId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, items: sec.items.filter(i => i.id !== itemId) };
      }
      return sec;
    }));
  };

  const handleUpdateItem = (sectionId: string, itemId: string, field: keyof BOQItemRow, value: any) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          items: sec.items.map(item => item.id === itemId ? { ...item, [field]: value } : item)
        };
      }
      return sec;
    }));
  };

  const calculateSectionTotal = (items: BOQItemRow[]) => {
    return items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  };

  const grandTotal = sections.reduce((sum, sec) => sum + calculateSectionTotal(sec.items), 0);

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8 font-sans text-slate-800">
      
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <nav className="flex items-center text-sm text-slate-500 space-x-2 mb-1">
            <Link href="/construction/boq" className="hover:text-blue-600">BOQ List</Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900">BOQ Editor Detail</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">BOQ-SCT-01: Structural Sections & Items</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/construction/boq/boq-uuid-001/revisions"
            className="inline-flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
          >
            <History className="w-4 h-4" /> Revisions History
          </Link>
          <button
            onClick={() => alert('BOQ Changes Saved Successfully!')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      {/* Sections Accordion & Items Grid */}
      <div className="space-y-6 mb-8">
        {sections.map((section, sIndex) => {
          const sectionTotal = calculateSectionTotal(section.items);
          return (
            <div key={section.id} className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
              
              {/* Section Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    {sIndex + 1}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">{section.name}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-slate-500">
                    Subtotal: <strong className="text-slate-900">${sectionTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
                  </span>
                  <button
                    onClick={() => handleAddItem(section.id)}
                    className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Item
                  </button>
                </div>
              </div>

              {/* Items Grid Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/60 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
                      <th className="py-2.5 px-4">Item Code</th>
                      <th className="py-2.5 px-4">Description</th>
                      <th className="py-2.5 px-4 w-24">Unit</th>
                      <th className="py-2.5 px-4 w-28">Quantity</th>
                      <th className="py-2.5 px-4 w-32">Rate ($)</th>
                      <th className="py-2.5 px-4 w-36">Amount ($)</th>
                      <th className="py-2.5 px-4 w-16 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {section.items.map((item) => {
                      const amount = item.qty * item.rate;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-4">
                            <input
                              type="text"
                              value={item.item_code}
                              onChange={(e) => handleUpdateItem(section.id, item.id, 'item_code', e.target.value)}
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold w-full focus:outline-none focus:border-blue-600"
                            />
                          </td>
                          <td className="py-2.5 px-4">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleUpdateItem(section.id, item.id, 'description', e.target.value)}
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs w-full focus:outline-none focus:border-blue-600"
                            />
                          </td>
                          <td className="py-2.5 px-4">
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) => handleUpdateItem(section.id, item.id, 'unit', e.target.value)}
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs w-full focus:outline-none focus:border-blue-600"
                            />
                          </td>
                          <td className="py-2.5 px-4">
                            <input
                              type="number"
                              value={item.qty}
                              onChange={(e) => handleUpdateItem(section.id, item.id, 'qty', parseFloat(e.target.value) || 0)}
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono w-full focus:outline-none focus:border-blue-600"
                            />
                          </td>
                          <td className="py-2.5 px-4">
                            <input
                              type="number"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) => handleUpdateItem(section.id, item.id, 'rate', parseFloat(e.target.value) || 0)}
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono w-full focus:outline-none focus:border-blue-600"
                            />
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                            ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <button
                              onClick={() => handleDeleteItem(section.id, item.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          );
        })}
      </div>

      {/* Totals Footer Card */}
      <div className="border border-slate-200 rounded-2xl p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Grand Total BOQ Value</p>
          <p className="text-3xl font-bold font-mono mt-1 text-emerald-400">
            ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => alert('New section added!')}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Section
          </button>
        </div>
      </div>

    </div>
  );
}