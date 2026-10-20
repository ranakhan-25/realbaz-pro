'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  Building2, 
  Layers, 
  Grid, 
  X, 
  CheckCircle2 
} from 'lucide-react';

interface ProjectBuilding {
  id: string;
  siteUuid: string;
  name: string;
  floors_count: number;
  units_count: number;
  status: 'under_construction' | 'completed' | 'planned';
}

const initialBuildings: ProjectBuilding[] = [
  {
    id: 'BLD-101',
    siteUuid: 'SITE-001',
    name: 'Tower A - Residential West',
    floors_count: 18,
    units_count: 72,
    status: 'under_construction'
  },
  {
    id: 'BLD-102',
    siteUuid: 'SITE-001',
    name: 'Tower B - Commercial Plaza',
    floors_count: 12,
    units_count: 48,
    status: 'planned'
  },
  {
    id: 'BLD-103',
    siteUuid: 'SITE-001',
    name: 'Tower C - Corporate Suites',
    floors_count: 24,
    units_count: 96,
    status: 'completed'
  }
];

export default function BuildingsListPage() {
  const [buildings, setBuildings] = useState<ProjectBuilding[]>(initialBuildings);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    floors_count: '',
    status: 'under_construction' as ProjectBuilding['status']
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const floors = parseInt(formData.floors_count) || 1;

    const newBuilding: ProjectBuilding = {
      id: `BLD-${100 + buildings.length + 1}`,
      siteUuid: 'SITE-001',
      name: formData.name || 'Untitled Building',
      floors_count: floors,
      units_count: 0,
      status: formData.status
    };

    setBuildings([newBuilding, ...buildings]);
    setIsModalOpen(false);
    setFormData({ name: '', floors_count: '', status: 'under_construction' });
  };

  const filteredBuildings = useMemo(() => {
    return buildings.filter(
      (b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [buildings, searchQuery]);

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8 font-sans text-slate-800">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <nav className="flex items-center text-sm text-slate-500 space-x-2 mb-1">
            <Link href="/projects" className="flex items-center hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4 mr-1 text-slate-600" /> Projects
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <Link href="/projects/sites" className="hover:text-blue-600 cursor-pointer">Sites</Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900">Buildings</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Site Buildings Management</h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Building
        </button>
      </div>

      {/* Buildings Table */}
      <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <p className="font-bold text-slate-900 text-sm">Site Code: SITE-001 Buildings</p>
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search building..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-600 shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Building Code</th>
                <th className="py-3.5 px-4">Building Name</th>
                <th className="py-3.5 px-4">Floors#</th>
                <th className="py-3.5 px-4">Units#</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredBuildings.map((bld) => (
                <tr key={bld.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">{bld.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{bld.name}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{bld.floors_count} Floors</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{bld.units_count} Units</td>
                  <td className="py-3.5 px-4 capitalize">
                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                      {bld.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Link
                      href={`/projects/buildings/${bld.id}/floors`}
                      className="text-xs text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      Explore Floors <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Add Building Form</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Building Name (name*) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tower A - Residential West"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Floors Count [floors_count* N(&gt;0)] *</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="18"
                  value={formData.floors_count}
                  onChange={(e) => setFormData({ ...formData, floors_count: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Status (status S) *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm capitalize"
                >
                  <option value="under_construction">Under Construction</option>
                  <option value="planned">Planned</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm"
                >
                  Save Building
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}