'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  X, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  FolderKanban,
  BarChart3,
  Layers
} from 'lucide-react';

// Interface matching Feature 03.06: Budget Management
interface ProjectBudget {
  id: string;
  projectUuid: string;
  category: 'material' | 'labour' | 'equipment' | 'overhead' | 'land' | 'permits' | 'subcontractor';
  planned_amount: number;
  revised_amount: number;
  variance: number;
  variance_pct: number;
  status: 'on_track' | 'warning' | 'exceeded';
  createdAt: string;
}

// Initial Static Data
const initialBudgets: ProjectBudget[] = [
  {
    id: 'BGT-001',
    projectUuid: 'proj-skyline-001',
    category: 'material',
    planned_amount: 1200000.00,
    revised_amount: 1250000.00,
    variance: 50000.00,
    variance_pct: 4.17,
    status: 'warning',
    createdAt: '2026-09-01'
  },
  {
    id: 'BGT-002',
    projectUuid: 'proj-skyline-001',
    category: 'labour',
    planned_amount: 850000.00,
    revised_amount: 840000.00,
    variance: -10000.00,
    variance_pct: -1.18,
    status: 'on_track',
    createdAt: '2026-09-03'
  },
  {
    id: 'BGT-003',
    projectUuid: 'proj-skyline-001',
    category: 'equipment',
    planned_amount: 400000.00,
    revised_amount: 480000.00,
    variance: 80000.00,
    variance_pct: 20.00,
    status: 'exceeded',
    createdAt: '2026-09-05'
  },
  {
    id: 'BGT-004',
    projectUuid: 'proj-skyline-001',
    category: 'overhead',
    planned_amount: 150000.00,
    revised_amount: 145000.00,
    variance: -5000.00,
    variance_pct: -3.33,
    status: 'on_track',
    createdAt: '2026-09-08'
  },
  {
    id: 'BGT-005',
    projectUuid: 'proj-skyline-001',
    category: 'subcontractor',
    planned_amount: 650000.00,
    revised_amount: 680000.00,
    variance: 30000.00,
    variance_pct: 4.62,
    status: 'warning',
    createdAt: '2026-09-12'
  }
];

export default function ProjectBudgetPage() {
  // GET State
  const [budgets, setBudgets] = useState<ProjectBudget[]>(initialBudgets);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // POST State (Modal + Form)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: 'material' as ProjectBudget['category'],
    planned_amount: '',
    revised_amount: ''
  });

  // Calculate Variance, Variance% and Status
  const calculateBudgetMetrics = (planned: number, revised: number) => {
    const variance = revised - planned;
    const variance_pct = planned > 0 ? (variance / planned) * 100 : 0;
    
    let status: 'on_track' | 'warning' | 'exceeded' = 'on_track';
    if (variance_pct > 10) {
      status = 'exceeded';
    } else if (variance_pct > 0) {
      status = 'warning';
    } else {
      status = 'on_track';
    }

    return { variance, variance_pct, status };
  };

  // POST Handler (Create New Budget Category Entry)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const plannedNum = parseFloat(formData.planned_amount) || 0;
    const revisedNum = parseFloat(formData.revised_amount) || plannedNum;

    const { variance, variance_pct, status } = calculateBudgetMetrics(plannedNum, revisedNum);

    const newBudget: ProjectBudget = {
      id: `BGT-00${budgets.length + 1}`,
      projectUuid: 'proj-skyline-001',
      category: formData.category,
      planned_amount: plannedNum,
      revised_amount: revisedNum,
      variance: variance,
      variance_pct: parseFloat(variance_pct.toFixed(2)),
      status: status,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBudgets([newBudget, ...budgets]);
    setIsModalOpen(false);

    // Reset Form
    setFormData({
      category: 'material',
      planned_amount: '',
      revised_amount: ''
    });
  };

  // GET Filter Logic
  const filteredBudgets = useMemo(() => {
    return budgets.filter((bgt) => {
      const matchesSearch = 
        bgt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bgt.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || bgt.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || bgt.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [budgets, searchQuery, selectedCategory, selectedStatus]);

  // Overall Totals Calculation
  const totals = useMemo(() => {
    return filteredBudgets.reduce(
      (acc, curr) => {
        acc.planned += curr.planned_amount;
        acc.revised += curr.revised_amount;
        acc.variance += curr.variance;
        return acc;
      },
      { planned: 0, revised: 0, variance: 0 }
    );
  }, [filteredBudgets]);

  const totalVariancePct = totals.planned > 0 ? (totals.variance / totals.planned) * 100 : 0;

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
            <span className="font-semibold text-slate-900">Budget</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Budget Management</h1>
        </div>

        {/* Action Button (POST Trigger) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> New Budget Category
          </button>
        </div>
      </div>

      {/* KPI Overview Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Planned Total Budget</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">${totals.planned.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Revised Total Budget</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">${totals.revised.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Variance ($)</p>
            <p className={`text-2xl font-bold mt-1 ${totals.variance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {totals.variance > 0 ? `+$${totals.variance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : `$${totals.variance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            </p>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${totals.variance > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {totals.variance > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Variance (%)</p>
            <p className={`text-2xl font-bold mt-1 ${totalVariancePct > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {totalVariancePct > 0 ? `+${totalVariancePct.toFixed(2)}%` : `${totalVariancePct.toFixed(2)}%`}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <PieChart className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        
        {/* Filters & Controls Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Filter by Category */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer capitalize"
              >
                <option value="All">All Categories</option>
                <option value="material">Material</option>
                <option value="labour">Labour</option>
                <option value="equipment">Equipment</option>
                <option value="overhead">Overhead</option>
                <option value="land">Land</option>
                <option value="permits">Permits</option>
                <option value="subcontractor">Subcontractor</option>
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
                <option value="on_track">On Track</option>
                <option value="warning">Warning</option>
                <option value="exceeded">Exceeded</option>
              </select>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search category or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-600 shadow-sm"
            />
          </div>
        </div>

        {/* Budget Table (GET List View) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Planned Amount</th>
                <th className="py-3.5 px-4">Revised Amount</th>
                <th className="py-3.5 px-4">Variance ($)</th>
                <th className="py-3.5 px-4">Variance (%)</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredBudgets.length > 0 ? (
                filteredBudgets.map((bgt) => (
                  <tr key={bgt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">{bgt.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 capitalize">{bgt.category}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">${bgt.planned_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">${bgt.revised_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3.5 px-4 font-semibold">
                      <span className={bgt.variance > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                        {bgt.variance > 0 ? `+$${bgt.variance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : `$${bgt.variance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      <span className={bgt.variance_pct > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                        {bgt.variance_pct > 0 ? `+${bgt.variance_pct.toFixed(2)}%` : `${bgt.variance_pct.toFixed(2)}%`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {bgt.status === 'on_track' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> On Track
                        </span>
                      )}
                      {bgt.status === 'warning' && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> Warning
                        </span>
                      )}
                      {bgt.status === 'exceeded' && (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> Exceeded
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No budget entries found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
            {/* Table Footer Totals */}
            <tfoot>
              <tr className="bg-slate-100 border-t border-slate-200 font-bold text-slate-900 text-sm">
                <td colSpan={2} className="py-3.5 px-4 uppercase text-xs text-slate-600 text-right">TOTAL:</td>
                <td className="py-3.5 px-4">${totals.planned.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td className="py-3.5 px-4">${totals.revised.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td className={`py-3.5 px-4 ${totals.variance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {totals.variance > 0 ? `+$${totals.variance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : `$${totals.variance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                </td>
                <td className={`py-3.5 px-4 ${totalVariancePct > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {totalVariancePct > 0 ? `+${totalVariancePct.toFixed(2)}%` : `${totalVariancePct.toFixed(2)}%`}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredBudgets.length} of {budgets.length} budget entries</span>
          <span>Project Budget Module v03.06</span>
        </div>

      </div>

      {/* POST Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Create Budget Category Entry</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm capitalize"
                >
                  <option value="material">Material</option>
                  <option value="labour">Labour</option>
                  <option value="equipment">Equipment</option>
                  <option value="overhead">Overhead</option>
                  <option value="land">Land</option>
                  <option value="permits">Permits</option>
                  <option value="subcontractor">Subcontractor</option>
                </select>
              </div>

              {/* Planned Amount */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Planned Amount ($) *</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formData.planned_amount}
                    onChange={(e) => setFormData({ ...formData, planned_amount: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-9 pr-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  />
                </div>
              </div>

              {/* Revised Amount */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Revised Amount ($)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Defaults to planned amount if empty"
                    value={formData.revised_amount}
                    onChange={(e) => setFormData({ ...formData, revised_amount: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-9 pr-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  />
                </div>
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
                  Save Budget
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}