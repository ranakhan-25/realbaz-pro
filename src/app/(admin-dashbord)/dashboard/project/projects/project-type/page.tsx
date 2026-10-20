/* eslint-disable prettier/prettier */
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  Plus, 
  Search, 
  X, 
  Edit, 
  Trash2, 
  Check, 
  Columns, 
  Layers, 
  FolderKanban 
} from 'lucide-react';

// Interface for Project Type
interface ProjectTypeItem {
  id: number;
  code: string;
  name: string;
  description?: string;
  status: 'Active' | 'Inactive';
}

// Initial Static Data
const initialProjectTypes: ProjectTypeItem[] = [
  {
    id: 1,
    code: 'RES-DEV',
    name: 'Residential Development',
    description: 'High-rise residential towers, apartments, and gated housing societies.',
    status: 'Active'
  },
  {
    id: 2,
    code: 'COM-PLZ',
    name: 'Commercial Plaza',
    description: 'Shopping malls, retail complexes, and corporate office spaces.',
    status: 'Active'
  },
  {
    id: 3,
    code: 'INF-CIV',
    name: 'Civil Infrastructure',
    description: 'Roads, bridges, flyovers, and public utility projects.',
    status: 'Active'
  },
  {
    id: 4,
    code: 'IND-LGT',
    name: 'Industrial & Warehouse',
    description: 'Factories, logistics hubs, and manufacturing plants.',
    status: 'Active'
  },
  {
    id: 5,
    code: 'MIX-USE',
    name: 'Mixed-Use Development',
    description: 'Integrated residential, commercial, and retail property spaces.',
    status: 'Active'
  }
];

export default function ProjectTypePage() {
  // Static State
  const [projectTypes, setProjectTypes] = useState<ProjectTypeItem[]>(initialProjectTypes);
  const [searchQuery, setSearchQuery] = useState('');

  // Column Selection Dropdown State
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    code: true,
    name: true,
    action: true
  });

  // Modal State for "Create Project Type"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: ''
  });

  // Add New Project Type
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newItem: ProjectTypeItem = {
      id: projectTypes.length > 0 ? Math.max(...projectTypes.map(p => p.id)) + 1 : 1,
      code: formData.code.toUpperCase() || `TYPE-${projectTypes.length + 1}`,
      name: formData.name || 'New Project Type',
      description: formData.description || 'N/A',
      status: 'Active'
    };

    setProjectTypes([newItem, ...projectTypes]);
    setIsModalOpen(false);

    // Reset Form
    setFormData({
      code: '',
      name: '',
      description: ''
    });
  };

  // Delete Handler
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this project type?')) {
      setProjectTypes(projectTypes.filter(item => item.id !== id));
    }
  };

  // Filter Logic for Search
  const filteredTypes = useMemo(() => {
    return projectTypes.filter(item => {
      const query = searchQuery.toLowerCase();
      return (
        item.id.toString().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query)
      );
    });
  }, [projectTypes, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans p-6 lg:p-8">
      
      {/* Top Navigation / Breadcrumbs & Action Button Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Breadcrumb matching UI */}
        <nav className="flex items-center text-sm font-medium text-slate-500 space-x-2">
          <Link href="/home" className="text-indigo-600 hover:text-indigo-700 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="text-indigo-600 hover:text-indigo-700 cursor-pointer">
            Project
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="text-slate-900 font-semibold">
            Project Type
          </span>
        </nav>

        {/* Create Project Type Button matching purple color in screenshot */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#635BFF] hover:bg-[#5248FF] text-white text-sm font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Create Project Type
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Toolbar: Select Columns & Search Input */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Select Columns Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2 rounded-xl shadow-sm transition-colors"
            >
              <Columns className="w-4 h-4 text-slate-500" />
              Select Columns
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isColumnDropdownOpen ? 'rotate-90' : ''}`} />
            </button>

            {/* Column Options Menu */}
            {isColumnDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-20 space-y-1">
                {Object.keys(visibleColumns).map((col) => (
                  <label
                    key={col}
                    className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer uppercase"
                  >
                    <span>{col}</span>
                    <input
                      type="checkbox"
                      checked={visibleColumns[col as keyof typeof visibleColumns]}
                      onChange={(e) =>
                        setVisibleColumns({
                          ...visibleColumns,
                          [col]: e.target.checked
                        })
                      }
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Search Box matching UI */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm font-medium text-slate-600">Search:</span>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-3 pr-9 py-2 focus:outline-none focus:border-indigo-600 shadow-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* Header colored with purple background matching image */}
              <tr className="bg-[#635BFF] text-white text-xs uppercase tracking-wider font-bold">
                {visibleColumns.id && <th className="py-3.5 px-6">ID</th>}
                {visibleColumns.code && <th className="py-3.5 px-6">CODE</th>}
                {visibleColumns.name && <th className="py-3.5 px-6">NAME</th>}
                {visibleColumns.action && <th className="py-3.5 px-6 text-right">ACTION</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTypes.length > 0 ? (
                filteredTypes.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {visibleColumns.id && (
                      <td className="py-4 px-6 font-mono font-semibold text-slate-600">
                        {item.id}
                      </td>
                    )}
                    {visibleColumns.code && (
                      <td className="py-4 px-6 font-mono font-bold text-indigo-600">
                        {item.code}
                      </td>
                    )}
                    {visibleColumns.name && (
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        <div className="flex flex-col">
                          <span>{item.name}</span>
                          {item.description && (
                            <span className="text-xs text-slate-500 font-normal mt-0.5">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </td>
                    )}
                    {visibleColumns.action && (
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Record Count */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredTypes.length} of {projectTypes.length} entries</span>
          <span>Project Type Module</span>
        </div>

      </div>

      {/* Create Project Type Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Create Project Type</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Type Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RES-DEV"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-600 shadow-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Type Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Residential Development"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Details about this project type category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-600 shadow-sm"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#635BFF] hover:bg-[#5248FF] text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                >
                  Save Project Type
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
