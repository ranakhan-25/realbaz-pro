'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  ShieldAlert, 
  Upload, 
  X, 
  Trash2, 
  CheckCircle 
} from 'lucide-react';

interface SafetyCheckItem {
  id: string;
  item: string;
  result: 'pass' | 'fail' | 'na';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface SafetyInspection {
  id: string;
  project: string; // project* S
  inspected_at: string; // inspected_at* D
  inspector: string; // inspector* S
  score: number; // score N(0-100)
  findings_count: number; // findings#
}

const initialSafetyList: SafetyInspection[] = [
  {
    id: 'safe-1',
    project: 'Skyline City Tower Phase 1',
    inspected_at: '2026-10-18',
    inspector: 'Safety Officer Rahim',
    score: 88,
    findings_count: 1
  },
  {
    id: 'safe-2',
    project: 'Lakeside Commercial Park',
    inspected_at: '2026-10-19',
    inspector: 'Safety Officer Kamal',
    score: 95,
    findings_count: 0
  }
];

export default function SafetyPage() {
  const [list, setList] = useState<SafetyInspection[]>(initialSafetyList);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // POST Form State (/construction/safety/create)
  const [project, setProject] = useState('Skyline City Tower Phase 1');
  const [inspectedAt, setInspectedAt] = useState(new Date().toISOString().split('T')[0]);
  const [inspector, setInspector] = useState('Safety Officer Rahim');
  const [score, setScore] = useState<number>(90);
  
  // Checklist TBL State
  const [checklist, setChecklist] = useState<SafetyCheckItem[]>([
    { id: 'schk-1', item: 'PPE Compliance (Hard hats & Vests)', result: 'pass', severity: 'low' },
    { id: 'schk-2', item: 'Fall Protection on 10th Floor Edge', result: 'fail', severity: 'high' }
  ]);
  const [photoFileName, setPhotoFileName] = useState('');

  const addChecklistItem = () => {
    setChecklist([...checklist, { id: `schk-${Date.now()}`, item: '', result: 'pass', severity: 'medium' }]);
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

    if (score < 0 || score > 100) {
      alert('Score must be between 0 and 100[cite: 4]!');
      return;
    }

    const findingsCount = checklist.filter(c => c.result === 'fail').length;

    const newItem: SafetyInspection = {
      id: `safe-${Date.now()}`,
      project,
      inspected_at: inspectedAt,
      inspector,
      score,
      findings_count: findingsCount
    };

    setList([newItem, ...list]);
    setShowForm(false);
    setPhotoFileName('');
  };

  const filteredList = list.filter(item =>
    item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            <span className="font-semibold text-slate-900">Safety & Compliance</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900">Safety Inspection List & Form[cite: 4]</h1>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel Form' : 'POST Safety Form (/create)'}
        </button>
      </div>

      {/* POST Form (/construction/safety/create) */}
      {showForm && (
        <form onSubmit={handlePost} className="mb-6 p-5 border border-blue-200 bg-blue-50/40 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-blue-100 pb-2">
            <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              POST /construction/safety/create[cite: 4]
            </h2>
            <span className="text-xs text-blue-600 font-mono font-medium">Feature 04.09</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1">project* S *[cite: 4]</label>
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
              <label className="block text-xs font-semibold text-slate-500 mb-1">score* N(0-100) *[cite: 4]</label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                className="bg-white border text-xs font-mono font-bold rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">inspector* S *[cite: 4]</label>
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
                checklist_json* TBL (item, result, severity)[cite: 4]
              </label>
              <button
                type="button"
                onClick={addChecklistItem}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded-lg hover:bg-slate-50 shadow-sm"
              >
                + Add Safety Checklist Item
              </button>
            </div>

            <div className="space-y-2">
              {checklist.map((chk) => (
                <div key={chk.id} className="flex items-center gap-2 bg-white p-3 border border-slate-200 rounded-xl shadow-sm">
                  <input
                    type="text"
                    placeholder="Safety Item / Hazard check..."
                    value={chk.item}
                    onChange={(e) => {
                      const val = e.target.value;
                      setChecklist(checklist.map(x => x.id === chk.id ? { ...x, item: val } : x));
                    }}
                    className="border text-xs rounded-lg p-2 flex-1 focus:outline-none"
                  />
                  <select
                    value={chk.result}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setChecklist(checklist.map(x => x.id === chk.id ? { ...x, result: val } : x));
                    }}
                    className="border text-xs font-bold rounded-lg p-2 w-28 uppercase text-slate-700"
                  >
                    <option value="pass">Pass</option>
                    <option value="fail">Fail</option>
                    <option value="na">N/A</option>
                  </select>
                  <select
                    value={chk.severity}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setChecklist(checklist.map(x => x.id === chk.id ? { ...x, severity: val } : x));
                    }}
                    className="border text-xs font-bold rounded-lg p-2 w-32 uppercase text-rose-600 bg-rose-50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
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

          {/* Photos F */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">photos F[cite: 4]</label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 px-3.5 py-2 rounded-xl hover:bg-slate-50 shadow-sm">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                Upload Safety Evidence Photo
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

          <div className="flex justify-end pt-2 border-t border-blue-100">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              Save Safety Inspection
            </button>
          </div>
        </form>
      )}

      {/* GET List Table (/construction/safety) */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            GET /construction/safety[cite: 4]
          </span>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search project, inspector..."
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
                <th className="p-3.5">Project</th>
                <th className="p-3.5">Inspected At</th>
                <th className="p-3.5">Inspector</th>
                <th className="p-3.5">Score (0-100)</th>
                <th className="p-3.5">Findings #</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{item.project}</td>
                  <td className="p-3.5 text-xs font-mono text-slate-600">{item.inspected_at}</td>
                  <td className="p-3.5 text-slate-700 text-xs">{item.inspector}</td>
                  <td className="p-3.5 font-mono font-bold text-blue-600">
                    <span className={`px-2.5 py-1 rounded-lg text-xs ${
                      item.score >= 90 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.score} / 100
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-800">
                    {item.findings_count > 0 ? (
                      <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-xs">{item.findings_count} Hazard(s)</span>
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