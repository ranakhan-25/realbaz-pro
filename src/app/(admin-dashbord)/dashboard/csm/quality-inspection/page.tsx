'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Upload, 
  X, 
  ShieldCheck, 
  Trash2 
} from 'lucide-react';

interface QualityCheckItem {
  id: string;
  item: string;
  standard: string;
  result: 'pass' | 'fail';
  note?: string;
}

interface QualityInspection {
  id: string;
  package: string; // package* S
  inspected_at: string; // inspected_at* D
  inspector: string; // inspector* S
  result: 'pass' | 'fail'; // result auto
  findings_count: number; // findings#
}

const initialQualityList: QualityInspection[] = [
  {
    id: 'qual-1',
    package: 'Foundation & Substructure RCC Work',
    inspected_at: '2026-10-15',
    inspector: 'Engr. Shamim Khan',
    result: 'pass',
    findings_count: 0
  },
  {
    id: 'qual-2',
    package: 'Superstructure Concrete Frame (Floors 1-15)',
    inspected_at: '2026-10-18',
    inspector: 'Engr. Tanvir Hossain',
    result: 'fail',
    findings_count: 2
  }
];

export default function QualityPage() {
  const [list, setList] = useState<QualityInspection[]>(initialQualityList);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // POST Form State (/construction/quality/create)
  const [packageSelected, setPackageSelected] = useState('Foundation & Substructure RCC Work');
  const [inspectedAt, setInspectedAt] = useState(new Date().toISOString().split('T')[0]);
  const [inspector, setInspector] = useState('Engr. Shamim Khan');
  
  // Checklist TBL State
  const [checklist, setChecklist] = useState<QualityCheckItem[]>([
    { id: 'chk-1', item: 'Concrete Slump Test', standard: '100mm - 150mm', result: 'pass', note: 'Within acceptable range' },
    { id: 'chk-2', item: 'Rebar Spacing & Cover', standard: '50mm clear cover', result: 'pass', note: 'Verified by consultant' }
  ]);
  const [photoFileName, setPhotoFileName] = useState('');

  const addChecklistItem = () => {
    setChecklist([...checklist, { id: `chk-${Date.now()}`, item: '', standard: '', result: 'pass' }]);
  };

  const removeChecklistItem = (id: string) => {
    setChecklist(checklist.filter(c => c.id !== id));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFileName(e.target.files[0].name);
    }
  };

  // POST Handler
  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Result auto calculated based on checklist (if any fail, overall result is fail)
    const hasFail = checklist.some(c => c.result === 'fail');
    const overallResult: 'pass' | 'fail' = hasFail ? 'fail' : 'pass';
    const findingsCount = checklist.filter(c => c.result === 'fail').length;

    const newItem: QualityInspection = {
      id: `qual-${Date.now()}`,
      package: packageSelected,
      inspected_at: inspectedAt,
      inspector,
      result: overallResult,
      findings_count: findingsCount
    };

    setList([newItem, ...list]);
    setShowForm(false);
    setPhotoFileName('');
  };

  const filteredList = list.filter(item =>
    item.package.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.inspector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-slate-800">
      
      {/* Header & Breadcrumbs */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <nav className="flex items-center text-xs text-slate-500 space-x-2 mb-1">
            <Link href="/construction" className="hover:text-blue-600">Construction</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">Quality Inspection</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900">Quality Control List & Form</h1>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel Form' : 'POST Quality Form (/create)'}
        </button>
      </div>

      {/* POST Form (/construction/quality/create) */}
      {showForm && (
        <form onSubmit={handlePost} className="mb-6 p-5 border border-blue-200 bg-blue-50/40 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-blue-100 pb-2">
            <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              POST /construction/quality/create[cite: 4]
            </h2>
            <span className="text-xs text-blue-600 font-mono font-medium">Feature 04.09</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">package* S *[cite: 4]</label>
              <select
                value={packageSelected}
                onChange={(e) => setPackageSelected(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              >
                <option value="Foundation & Substructure RCC Work">Foundation & Substructure RCC Work</option>
                <option value="Superstructure Concrete Frame (Floors 1-15)">Superstructure Concrete Frame (Floors 1-15)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">inspected_at* D *[cite: 4]</label>
              <input
                type="date"
                required
                value={inspectedAt}
                onChange={(e) => setInspectedAt(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">inspector* S(users) *[cite: 4]</label>
              <input
                type="text"
                required
                value={inspector}
                onChange={(e) => setInspector(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Checklist TBL */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase text-slate-700">
                checklist_json* TBL (item, standard, result, note)[cite: 4]
              </label>
              <button
                type="button"
                onClick={addChecklistItem}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded-lg hover:bg-slate-50 shadow-sm"
              >
                + Add Checklist Item
              </button>
            </div>

            <div className="space-y-2">
              {checklist.map((chk) => (
                <div key={chk.id} className="flex items-center gap-2 bg-white p-3 border border-slate-200 rounded-xl shadow-sm">
                  <input
                    type="text"
                    placeholder="Item (e.g. Slump Test)"
                    value={chk.item}
                    onChange={(e) => {
                      const val = e.target.value;
                      setChecklist(checklist.map(x => x.id === chk.id ? { ...x, item: val } : x));
                    }}
                    className="border text-xs rounded-lg p-2 flex-1 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Standard (e.g. 100-150mm)"
                    value={chk.standard}
                    onChange={(e) => {
                      const val = e.target.value;
                      setChecklist(checklist.map(x => x.id === chk.id ? { ...x, standard: val } : x));
                    }}
                    className="border text-xs rounded-lg p-2 w-40 focus:outline-none"
                  />
                  <select
                    value={chk.result}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setChecklist(checklist.map(x => x.id === chk.id ? { ...x, result: val } : x));
                    }}
                    className={`border text-xs font-bold rounded-lg p-2 w-28 uppercase ${
                      chk.result === 'pass' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                    }`}
                  >
                    <option value="pass">Pass</option>
                    <option value="fail">Fail</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Note..."
                    value={chk.note || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setChecklist(checklist.map(x => x.id === chk.id ? { ...x, note: val } : x));
                    }}
                    className="border text-xs rounded-lg p-2 flex-1 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(chk.id)}
                    className="text-rose-500 p-1.5 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Photos F */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">photos F[cite: 4]</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 px-3.5 py-2 rounded-xl hover:bg-slate-50 shadow-sm">
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  Upload Inspection Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                {photoFileName && (
                  <span className="text-xs text-slate-600 font-mono inline-flex items-center gap-1">
                    {photoFileName}
                    <button type="button" onClick={() => setPhotoFileName('')}>
                      <X className="w-3.5 h-3.5 text-rose-500" />
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Result Auto badge info */}
            <div className="flex items-center justify-end">
              <span className="text-xs text-slate-500 italic">
                * Overall result status (pass/fail) is <strong>auto-calculated</strong> from checklist items[cite: 4].
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-blue-100">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              Save Quality Inspection
            </button>
          </div>
        </form>
      )}

      {/* GET List Table (/construction/quality) */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            GET /construction/quality[cite: 4]
          </span>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search package, inspector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 text-xs rounded-xl pl-8 pr-3 py-1.5 w-full focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-xs font-bold uppercase text-slate-600 border-b border-slate-200">
                <th className="p-3.5">Package</th>
                <th className="p-3.5">Inspected At</th>
                <th className="p-3.5">Inspector</th>
                <th className="p-3.5">Result (Badge)</th>
                <th className="p-3.5">Findings #</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{item.package}</td>
                  <td className="p-3.5 text-xs font-mono text-slate-600">{item.inspected_at}</td>
                  <td className="p-3.5 text-slate-700 text-xs">{item.inspector}</td>
                  <td className="p-3.5">
                    {item.result === 'pass' ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        <XCircle className="w-3.5 h-3.5" /> Fail
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-800">
                    {item.findings_count > 0 ? (
                      <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-xs">{item.findings_count} Issue(s)</span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}