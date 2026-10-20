'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  X, 
  DollarSign, 
  FileSpreadsheet, 
  FileText,
  Clock,
  ShieldAlert,
  Activity,
  Layers
} from 'lucide-react';

// Interface matching Feature 03.09: Controls
interface ProjectControl {
  id: string;
  projectUuid: string;
  control_type: 'cost' | 'schedule' | 'quality';
  threshold: number;
  actual: number;
  variance: number;
  status: 'ok' | 'warning' | 'breach';
  action: string;
  createdAt: string;
}

// Initial Static Data
const initialControls: ProjectControl[] = [
  {
    id: 'CTRL-001',
    projectUuid: 'proj-skyline-001',
    control_type: 'cost',
    threshold: 500000.00,
    actual: 485000.00,
    variance: -15000.00,
    status: 'ok',
    action: 'Cost is within budget limit. Continue monitoring monthly material expenses.',
    createdAt: '2026-09-01'
  },
  {
    id: 'CTRL-002',
    projectUuid: 'proj-skyline-001',
    control_type: 'cost',
    threshold: 250000.00,
    actual: 268000.00,
    variance: 18000.00,
    status: 'warning',
    action: 'Overbudget on electrical subcontracting. Request cost review meeting with supplier.',
    createdAt: '2026-09-05'
  },
  {
    id: 'CTRL-003',
    projectUuid: 'proj-skyline-001',
    control_type: 'schedule',
    threshold: 120.00, // days or milestones
    actual: 155.00,
    variance: 35.00,
    status: 'breach',
    action: 'Critical delay in foundation completion. Deploy additional labor shift immediately.',
    createdAt: '2026-09-10'
  },
  {
    id: 'CTRL-004',
    projectUuid: 'proj-skyline-001',
    control_type: 'quality',
    threshold: 95.00, // quality compliance score %
    actual: 91.00,
    variance: -4.00,
    status: 'warning',
    action: 'Concrete strength test showed minor variance. Issue quality audit request for Batch B.',
    createdAt: '2026-09-12'
  },
  {
    id: 'CTRL-005',
    projectUuid: 'proj-skyline-001',
    control_type: 'cost',
    threshold: 180000.00,
    actual: 220000.00,
    variance: 40000.00,
    status: 'breach',
    action: 'Excavation cost exceeded breach threshold. Audit equipment rental hours.',
    createdAt: '2026-09-15'
  }
];

export default function ProjectControlsPage() {
  // GET State
  const [controls, setControls] = useState<ProjectControl[]>(initialControls);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // POST State (Modal + Form)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    control_type: 'cost' as 'cost' | 'schedule' | 'quality',
    threshold: '',
    actual: '',
    action: ''
  });

  // Calculate Variance & Auto-determine Status based on Type & Values
  const calculateVarianceAndStatus = (
    type: 'cost' | 'schedule' | 'quality',
    thresholdVal: number,
    actualVal: number
  ) => {
    const variance = actualVal - thresholdVal;
    let status: 'ok' | 'warning' | 'breach' = 'ok';

    if (type === 'cost' || type === 'schedule') {
      // For Cost and Schedule, actual higher than threshold is bad
      if (actualVal > thresholdVal * 1.15) {
        status = 'breach';
      } else if (actualVal > thresholdVal) {
        status = 'warning';
      } else {
        status = 'ok';
      }
    } else if (type === 'quality') {
      // For Quality %, actual lower than threshold target is bad
      if (actualVal < thresholdVal * 0.90) {
        status = 'breach';
      } else if (actualVal < thresholdVal) {
        status = 'warning';
      } else {
        status = 'ok';
      }
    }

    return { variance, status };
  };

  // POST Handler (Create New Control)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const thresholdNum = parseFloat(formData.threshold) || 0;
    const actualNum = parseFloat(formData.actual) || 0;

    const { variance, status } = calculateVarianceAndStatus(
      formData.control_type,
      thresholdNum,
      actualNum
    );

    const newControl: ProjectControl = {
      id: `CTRL-00${controls.length + 1}`,
      projectUuid: 'proj-skyline-001',
      control_type: formData.control_type,
      threshold: thresholdNum,
      actual: actualNum,
      variance: variance,
      status: status,
      action: formData.action || 'No action specified.',
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Update List State (GET state updated locally)
    setControls([newControl, ...controls]);
    setIsModalOpen(false);

    // Reset Form Data
    setFormData({
      control_type: 'cost',
      threshold: '',
      actual: '',
      action: ''
    });
  };

  // GET Filter Logic
  const filteredControls = useMemo(() => {
    return controls.filter((item) => {
      const matchesSearch = 
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.control_type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'All' || item.control_type === selectedType;
      const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [controls, searchQuery, selectedType, selectedStatus]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = controls.length;
    const okCount = controls.filter(c => c.status === 'ok').length;
    const warningCount = controls.filter(c => c.status === 'warning').length;
    const breachCount = controls.filter(c => c.status === 'breach').length;

    return { total, okCount, warningCount, breachCount };
  }, [controls]);

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
            <span className="font-semibold text-slate-900">Controls</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Control Management</h1>
        </div>

        {/* Action Button (POST Trigger) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> New Control Metric
          </button>
        </div>
      </div>

      {/* KPI Overview Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Controls</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">OK (On Track)</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.okCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Warning Level</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.warningCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Critical Breaches</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{stats.breachCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        
        {/* Filters & Controls Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Filter by Type */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="cost">Cost</option>
                <option value="schedule">Schedule</option>
                <option value="quality">Quality</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="ok">OK</option>
                <option value="warning">Warning</option>
                <option value="breach">Breach</option>
              </select>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search controls or actions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-600 shadow-sm"
            />
          </div>
        </div>

        {/* Controls Table (GET List View) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Control ID</th>
                <th className="py-3.5 px-4">Control Type</th>
                <th className="py-3.5 px-4">Threshold Target</th>
                <th className="py-3.5 px-4">Actual Value</th>
                <th className="py-3.5 px-4">Variance</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Corrective Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredControls.length > 0 ? (
                filteredControls.map((ctrl) => (
                  <tr key={ctrl.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">{ctrl.id}</td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize font-medium text-slate-900 border border-slate-200 px-2.5 py-1 rounded-lg bg-slate-50 text-xs">
                        {ctrl.control_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {ctrl.control_type === 'cost' ? `$${ctrl.threshold.toLocaleString()}` : `${ctrl.threshold}`}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {ctrl.control_type === 'cost' ? `$${ctrl.actual.toLocaleString()}` : `${ctrl.actual}`}
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      <span className={ctrl.variance > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                        {ctrl.variance > 0 ? `+${ctrl.variance.toLocaleString()}` : ctrl.variance.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {ctrl.status === 'ok' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> OK
                        </span>
                      )}
                      {ctrl.status === 'warning' && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> Warning
                        </span>
                      )}
                      {ctrl.status === 'breach' && (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Breach
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-sm">
                      {ctrl.action}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No control records available matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredControls.length} of {controls.length} control entries</span>
          <span>Project Controls Engine v03.09</span>
        </div>

      </div>

      {/* POST Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Add Control Metric</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              
              {/* Control Type */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Control Type *</label>
                <select
                  name="control_type"
                  value={formData.control_type}
                  onChange={(e) => setFormData({ ...formData, control_type: e.target.value as any })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                >
                  <option value="cost">Cost</option>
                  <option value="schedule">Schedule</option>
                  <option value="quality">Quality</option>
                </select>
              </div>

              {/* Threshold Target */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Threshold Target *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 500000"
                  value={formData.threshold}
                  onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Actual Value */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Actual Value *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 520000"
                  value={formData.actual}
                  onChange={(e) => setFormData({ ...formData, actual: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Action Description */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Action Step / Note</label>
                <textarea
                  rows={3}
                  placeholder="Describe required action if variance occurs..."
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
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
                  Save Control
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}