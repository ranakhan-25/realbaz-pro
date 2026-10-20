'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Flag, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Layers
} from 'lucide-react';

// TypeScript Interface matching Feature 03.05: Milestones
interface ProjectMilestone {
  id: string;
  projectUuid: string;
  name: string;
  planned_at: string;
  actual_at?: string;
  progress: number; // 0 to 100
  status: 'planned' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  variance_days: number; // calculated as difference in days
}

// Initial Static Data
const initialMilestones: ProjectMilestone[] = [
  {
    id: 'MLS-001',
    projectUuid: 'proj-skyline-001',
    name: 'Site Excavation & Soil Piling Completed',
    planned_at: '2026-08-15',
    actual_at: '2026-08-18',
    progress: 100,
    status: 'completed',
    variance_days: 3
  },
  {
    id: 'MLS-002',
    projectUuid: 'proj-skyline-001',
    name: 'Basement Concrete Mat Foundation Cast',
    planned_at: '2026-09-10',
    actual_at: '2026-09-12',
    progress: 100,
    status: 'completed',
    variance_days: 2
  },
  {
    id: 'MLS-003',
    projectUuid: 'proj-skyline-001',
    name: 'Ground Floor Column & Slab Casting',
    planned_at: '2026-10-05',
    progress: 65,
    status: 'in_progress',
    variance_days: 0
  },
  {
    id: 'MLS-004',
    projectUuid: 'proj-skyline-001',
    name: '5th Floor Structural RCC Frame Setup',
    planned_at: '2026-11-20',
    progress: 0,
    status: 'planned',
    variance_days: 0
  },
  {
    id: 'MLS-005',
    projectUuid: 'proj-skyline-001',
    name: 'Electrical Conduit & Pipe Laying Phase 1',
    planned_at: '2026-09-30',
    progress: 25,
    status: 'delayed',
    variance_days: 12
  }
];

export default function ProjectMilestonesPage() {
  // GET State
  const [milestones, setMilestones] = useState<ProjectMilestone[]>(initialMilestones);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // POST State (Inline Modal Form)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    planned_at: new Date().toISOString().split('T')[0],
    actual_at: '',
    progress: '0',
    status: 'planned' as ProjectMilestone['status']
  });

  // Calculate Variance Days Function
  const calculateVarianceDays = (plannedStr: string, actualStr?: string) => {
    if (!actualStr) return 0;
    const plannedDate = new Date(plannedStr);
    const actualDate = new Date(actualStr);
    const diffTime = actualDate.getTime() - plannedDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // POST Handler (Create New Milestone)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const progressNum = Math.min(100, Math.max(0, parseInt(formData.progress) || 0));
    const varianceDays = calculateVarianceDays(formData.planned_at, formData.actual_at);

    const newMilestone: ProjectMilestone = {
      id: `MLS-${100 + milestones.length + 1}`,
      projectUuid: 'proj-skyline-001',
      name: formData.name || 'Untitled Milestone',
      planned_at: formData.planned_at,
      actual_at: formData.actual_at || undefined,
      progress: progressNum,
      status: formData.status,
      variance_days: varianceDays
    };

    setMilestones([newMilestone, ...milestones]);
    setIsModalOpen(false);

    // Reset Form Data
    setFormData({
      name: '',
      planned_at: new Date().toISOString().split('T')[0],
      actual_at: '',
      progress: '0',
      status: 'planned'
    });
  };

  // GET Filter Logic
  const filteredMilestones = useMemo(() => {
    return milestones.filter((item) => {
      const matchesSearch = 
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [milestones, searchQuery, selectedStatus]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = milestones.length;
    const completed = milestones.filter(m => m.status === 'completed').length;
    const inProgress = milestones.filter(m => m.status === 'in_progress').length;
    const delayed = milestones.filter(m => m.status === 'delayed').length;

    return { total, completed, inProgress, delayed };
  }, [milestones]);

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8 font-sans text-slate-800">
      
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <nav className="flex items-center text-sm text-slate-500 space-x-2 mb-1">
            <Link href="/projects" className="flex items-center hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4 mr-1 text-slate-600" /> Projects
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="hover:text-blue-600 cursor-pointer">proj-skyline-001</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900">Milestones</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Milestones Management</h1>
        </div>

        {/* Action Button (POST Trigger) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> New Milestone
          </button>
        </div>
      </div>

      {/* KPI Overview Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Milestones</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Flag className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.completed}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Delayed / Alert</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{stats.delayed}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        
        {/* Filters & Search Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            
            {/* Filter by Status */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer capitalize"
              >
                <option value="All">All Statuses</option>
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="delayed">Delayed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search milestone name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-600 shadow-sm"
            />
          </div>
        </div>

        {/* Milestones Table (GET List View matching exact columns) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Milestone Name</th>
                <th className="py-3.5 px-4">Planned Date</th>
                <th className="py-3.5 px-4">Actual Date</th>
                <th className="py-3.5 px-4">Progress (%)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Variance (Days)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredMilestones.length > 0 ? (
                filteredMilestones.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">{item.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{item.name}</td>
                    <td className="py-3.5 px-4 text-slate-700 text-xs whitespace-nowrap">{item.planned_at}</td>
                    <td className="py-3.5 px-4 text-slate-700 text-xs whitespace-nowrap">
                      {item.actual_at || <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
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
                      {item.status === 'planned' && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          Planned
                        </span>
                      )}
                      {item.status === 'delayed' && (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> Delayed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      <span className={item.variance_days > 0 ? 'text-rose-600' : 'text-slate-700'}>
                        {item.variance_days > 0 ? `+${item.variance_days} days` : `${item.variance_days} days`}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No milestone entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredMilestones.length} of {milestones.length} milestone entries</span>
          <span>Project Milestones Module v03.05</span>
        </div>

      </div>

      {/* POST Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Add Milestone (inline)</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Milestone Name (name*) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5th Floor Casting"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Planned Date */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Planned Date (planned_at*) *</label>
                <input
                  type="date"
                  required
                  value={formData.planned_at}
                  onChange={(e) => setFormData({ ...formData, planned_at: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Actual Date */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Actual Date (actual_at)</label>
                <input
                  type="date"
                  value={formData.actual_at}
                  onChange={(e) => setFormData({ ...formData, actual_at: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Progress N(0-100) */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Progress % (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Status (status)</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm capitalize"
                >
                  <option value="planned">Planned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
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
                  Save Milestone
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}