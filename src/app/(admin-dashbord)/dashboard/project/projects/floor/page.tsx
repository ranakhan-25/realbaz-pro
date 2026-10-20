'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  Layers, 
  Grid, 
  X 
} from 'lucide-react';

interface ProjectFloor {
  id: string;
  buildingUuid: string;
  name: string;
  number: number; // Unique in building
  units_count: number;
}

const initialFloors: ProjectFloor[] = [
  { id: 'FLR-001', buildingUuid: 'BLD-101', name: 'Ground Floor', number: 0, units_count: 4 },
  { id: 'FLR-002', buildingUuid: 'BLD-101', name: '1st Floor - Commercial', number: 1, units_count: 8 },
  { id: 'FLR-003', buildingUuid: 'BLD-101', name: '2nd Floor - Premium Suites', number: 2, units_count: 6 },
  { id: 'FLR-004', buildingUuid: 'BLD-101', name: '3rd Floor - Executive Penthouse', number: 3, units_count: 4 }
];

export default function FloorsListPage() {
  const [floors, setFloors] = useState<ProjectFloor[]>(initialFloors);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    number: ''
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const floorNum = parseInt(formData.number) || 0;

    const newFloor: ProjectFloor = {
      id: `FLR-00${floors.length + 1}`,
      buildingUuid: 'BLD-101',
      name: formData.name || `Floor ${floorNum}`,
      number: floorNum,
      units_count: 0
    };

    setFloors([...floors, newFloor]);
    setIsModalOpen(false);
    setFormData({ name: '', number: '' });
  };

  const filteredFloors = useMemo(() => {
    return floors.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.number.toString().includes(searchQuery)
    );
  }, [floors, searchQuery]);

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
            <Link href="/projects/sites" className="hover:text-blue-600 cursor-pointer">Buildings</Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900">Floors</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Building Floors Directory</h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Floor
        </button>
      </div>

      {/* Floors Table */}
      <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <p className="font-bold text-slate-900 text-sm">Building: Tower A - Residential West</p>
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search floor name, number..."
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
                <th className="py-3.5 px-4">Floor Code</th>
                <th className="py-3.5 px-4">Floor Name</th>
                <th className="py-3.5 px-4">Floor Number</th>
                <th className="py-3.5 px-4">Units#</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredFloors.map((floor) => (
                <tr key={floor.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">{floor.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{floor.name}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">#Level {floor.number}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{floor.units_count} Units</td>
                  <td className="py-3.5 px-4 text-center">
                    <Link
                      href={`/projects/floors/${floor.id}/units`}
                      className="text-xs text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      View Floor Units <ChevronRight className="w-3.5 h-3.5" />
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
              <h2 className="text-lg font-bold text-slate-900">Add Floor Form</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Floor Name (name*) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2nd Floor - Premium Suites"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Floor Number [number* N(uniq in building)] *</label>
                <input
                  type="number"
                  required
                  placeholder="2"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
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
                  Save Floor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}