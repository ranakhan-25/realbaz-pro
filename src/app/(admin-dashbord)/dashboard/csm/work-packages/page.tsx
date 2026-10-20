'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  X, 
  Building2, 
  Users, 
  Layers, 
  BarChart3 
} from 'lucide-react';

// TypeScript Interface matching Feature 04.01: Work Packages
interface WorkPackage {
  id: string;
  code: string; // T(uniq)
  name: string; // T
  project: string; // S
  contractor: string; // S
  value: number; // MONEY
  start_at: string; // D
  end_at: string; // D
  progress: number; // 0 to 100%
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'delayed';
  description?: string; // TA
}

// Initial Mock Data
const initialPackages: WorkPackage[] = [
  {
    id: 'PKG-001',
    code: 'WP-CIV-01',
    name: 'Foundation & Substructure RCC Work',
    project: 'Skyline City Tower Phase 1',
    contractor: 'National Builders & Civil Infra',
    value: 4500000.00,
    start_at: '2026-01-15',
    end_at: '2026-06-30',
    progress: 100,
    status: 'completed',
    description: 'Complete soil excavation, piling, and basement concrete mat foundation casting.'
  },
  {
    id: 'PKG-002',
    code: 'WP-STR-02',
    name: 'Superstructure Concrete Frame (Floors 1-15)',
    project: 'Skyline City Tower Phase 1',
    contractor: 'National Builders & Civil Infra',
    value: 8500000.00,
    start_at: '2026-07-01',
    end_at: '2027-03-31',
    progress: 65,
    status: 'in_progress',
    description: 'Columns, shear walls, beams, and slab concrete casting up to 15th floor level.'
  },
  {
    id: 'PKG-003',
    code: 'WP-MEP-01',
    name: 'Plumbing & Drainage Piping System',
    project: 'Skyline City Tower Phase 1',
    contractor: 'Apex MEP Engineering Ltd.',
    value: 1200000.00,
    start_at: '2026-09-15',
    end_at: '2027-05-30',
    progress: 30,
    status: 'in_progress',
    description: 'Internal water supply lines, vertical drainage stacks, and pump room setup.'
  },
  {
    id: 'PKG-004',
    code: 'WP-ELE-01',
    name: 'High Voltage Electrical Substation & Wiring',
    project: 'Lakeside Commercial Park',
    contractor: 'PowerGrid Solutions Bangladesh',
    value: 2800000.00,
    start_at: '2026-11-01',
    end_at: '2027-08-15',
    progress: 0,
    status: 'planning',
    description: 'Transformer installation, main distribution board setup, and conduit laying.'
  },
  {
    id: 'PKG-005',
    code: 'WP-FIN-01',
    name: 'Exterior Glass Curtain Wall Façade',
    project: 'Lakeside Commercial Park',
    contractor: 'Modern Glazing & Aluminum Co.',
    value: 3200000.00,
    start_at: '2026-08-10',
    end_at: '2027-01-20',
    progress: 20,
    status: 'delayed',
    description: 'Supply and fixing of double-glazed tempered glass panels on exterior building frame.'
  }
];

export default function WorkPackagesPage() {
  // GET State
  const [packages, setPackages] = useState<WorkPackage[]>(initialPackages);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [selectedProject, setSelectedProject] = useState<string>('All');
  const [selectedContractor, setSelectedContractor] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // POST State (Modal Form - /construction/packages/create)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    project: 'Skyline City Tower Phase 1',
    contractor: 'National Builders & Civil Infra',
    value: '',
    start_at: new Date().toISOString().split('T')[0],
    end_at: '',
    description: ''
  });

  // Unique Projects and Contractors for Dropdown Filters
  const projectsList = useMemo(() => ['All', ...Array.from(new Set(packages.map(p => p.project)))], [packages]);
  const contractorsList = useMemo(() => ['All', ...Array.from(new Set(packages.map(p => p.contractor)))], [packages]);

  // POST Handler (Create Work Package)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const valNum = parseFloat(formData.value) || 0;

    const newPkg: WorkPackage = {
      id: `PKG-${100 + packages.length + 1}`,
      code: formData.code.toUpperCase() || `WP-NEW-${packages.length + 1}`,
      name: formData.name || 'Untitled Work Package',
      project: formData.project,
      contractor: formData.contractor,
      value: valNum,
      start_at: formData.start_at,
      end_at: formData.end_at || formData.start_at,
      progress: 0,
      status: 'planning',
      description: formData.description || undefined
    };

    setPackages([newPkg, ...packages]);
    setIsModalOpen(false);

    // Reset Form Data
    setFormData({
      code: '',
      name: '',
      project: 'Skyline City Tower Phase 1',
      contractor: 'National Builders & Civil Infra',
      value: '',
      start_at: new Date().toISOString().split('T')[0],
      end_at: '',
      description: ''
    });
  };

  // GET Filter Logic
  const filteredPackages = useMemo(() => {
    return packages.filter((item) => {
      const matchesSearch = 
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.contractor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProject = selectedProject === 'All' || item.project === selectedProject;
      const matchesContractor = selectedContractor === 'All' || item.contractor === selectedContractor;
      const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;

      return matchesSearch && matchesProject && matchesContractor && matchesStatus;
    });
  }, [packages, searchQuery, selectedProject, selectedContractor, selectedStatus]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = packages.length;
    const totalValue = packages.reduce((sum, p) => sum + p.value, 0);
    const inProgress = packages.filter(p => p.status === 'in_progress').length;
    const completed = packages.filter(p => p.status === 'completed').length;

    return { total, totalValue, inProgress, completed };
  }, [packages]);

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8 font-sans text-slate-800">
      
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <nav className="flex items-center text-sm text-slate-500 space-x-2 mb-1">
            <Link href="/construction" className="flex items-center hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4 mr-1 text-slate-600" /> Construction
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900">Work Packages</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Construction Work Packages</h1>
        </div>

        {/* Action Button (POST Trigger - /construction/packages/create) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Create Work Package
          </button>
        </div>
      </div>

      {/* KPI Overview Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Packages</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Packages Value</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              ${(stats.totalValue / 1000000).toFixed(2)}M
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Packages</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.completed}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        
        {/* Filters & Search Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            
            {/* Filter by Project */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Project:</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer"
              >
                {projectsList.map((p, i) => (
                  <option key={i} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Filter by Contractor */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Contractor:</label>
              <select
                value={selectedContractor}
                onChange={(e) => setSelectedContractor(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer"
              >
                {contractorsList.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer capitalize"
              >
                <option value="All">All Statuses</option>
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>

          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search code, package, contractor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-600 shadow-sm"
            />
          </div>
        </div>

        {/* Work Packages Table (GET List View matching exact columns) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Package Code</th>
                <th className="py-3.5 px-4">Package Name</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Contractor</th>
                <th className="py-3.5 px-4">Package Value ($)</th>
                <th className="py-3.5 px-4">Start Date</th>
                <th className="py-3.5 px-4">End Date</th>
                <th className="py-3.5 px-4">Progress (%)</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPackages.length > 0 ? (
                filteredPackages.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{item.code}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        {item.description && (
                          <span className="text-[11px] text-slate-500 font-normal mt-0.5 line-clamp-1">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{item.project}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-semibold">{item.contractor}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">{item.start_at}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">{item.end_at}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div 
                            className={`h-2 rounded-full ${item.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-700">{item.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      )}
                      {item.status === 'in_progress' && (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5" /> In Progress
                        </span>
                      )}
                      {item.status === 'planning' && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          Planning
                        </span>
                      )}
                      {item.status === 'delayed' && (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> Delayed
                        </span>
                      )}
                      {item.status === 'on_hold' && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          On Hold
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No work package entries found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredPackages.length} of {packages.length} package entries</span>
          <span>Feature 04.01 · Construction Work Packages</span>
        </div>

      </div>

      {/* POST Form Modal (/construction/packages/create) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Create Work Package</h2>
                <p className="text-xs text-slate-500">Route: /construction/packages/create</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* Package Code T(uniq) */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Package Code [code* T(uniq)] *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WP-CIV-03"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm font-mono"
                />
              </div>

              {/* Package Name T */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Package Name (name*) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Foundation & Substructure Work"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Project S & Contractor S */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Project (project*) *</label>
                  <select
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  >
                    <option value="Skyline City Tower Phase 1">Skyline City Tower Phase 1</option>
                    <option value="Lakeside Commercial Park">Lakeside Commercial Park</option>
                    <option value="Coastal Logistics Hub">Coastal Logistics Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Contractor (contractor*) *</label>
                  <select
                    value={formData.contractor}
                    onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  >
                    <option value="National Builders & Civil Infra">National Builders & Civil Infra</option>
                    <option value="Apex MEP Engineering Ltd.">Apex MEP Engineering Ltd.</option>
                    <option value="PowerGrid Solutions Bangladesh">PowerGrid Solutions Bangladesh</option>
                    <option value="Modern Glazing & Aluminum Co.">Modern Glazing & Aluminum Co.</option>
                  </select>
                </div>
              </div>

              {/* Value MONEY */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Package Value ($) [value* MONEY] *</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="4500000.00"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-9 pr-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm font-mono"
                  />
                </div>
              </div>

              {/* Start Date & End Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Start Date (start_at*) *</label>
                  <input
                    type="date"
                    required
                    value={formData.start_at}
                    onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">End Date (end_at*) *</label>
                  <input
                    type="date"
                    required
                    value={formData.end_at}
                    onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  />
                </div>
              </div>

              {/* Description TA */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Description (description TA)</label>
                <textarea
                  rows={3}
                  placeholder="Detailed work package scope, technical specifications, and key deliverables..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Modal Buttons */}
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
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                >
                  Save Work Package
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}