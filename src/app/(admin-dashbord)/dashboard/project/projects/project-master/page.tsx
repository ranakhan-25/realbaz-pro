'use client';

import React, { useState, useMemo } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  Calendar,
  DollarSign,
  User,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  PauseCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  X,
  Upload,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Building,
  Layers,
  LayoutGrid,
  Users,
  FileCheck,
  Flag,
  ListTodo,
  PieChart,
  ShieldAlert,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

// Industry Standard Status & Types
type ProjectStatus = 'planning' | 'active' | 'onhold' | 'completed' | 'cancelled';
type ProjectType = 'Residential' | 'Commercial' | 'Infrastructure' | 'Industrial' | 'Mixed-Use';

// Project Master Interface matching exact ERP specification
interface ProjectMaster {
  uuid: string;
  code: string;
  name: string;
  type: ProjectType;
  site: string;
  manager: string;
  start_date: string;
  end_date: string;
  budget: number;
  actual_cost: number;
  progress: number;
  description: string;
  status: ProjectStatus;
  cover_image?: string;
  open_issues: number;
  team: string[];
}

// Initial Rich Mock Data
const initialProjects: ProjectMaster[] = [
  {
    uuid: 'p-101',
    code: 'PRJ-2026-001',
    name: 'Metro Commercial Heights',
    type: 'Commercial',
    site: 'Dhaka North Zone Site A',
    manager: 'Tanvir Ahmed',
    start_date: '2026-01-15',
    end_date: '2027-06-30',
    budget: 4500000.00,
    actual_cost: 1850000.00,
    progress: 42,
    description: 'A modern 22-storey commercial tower featuring Grade-A office spaces and green building compliance.',
    status: 'active',
    open_issues: 3,
    team: ['Tanvir A.', 'Shamim K.', 'Farhana R.', 'Abdur R.']
  },
  {
    uuid: 'p-102',
    code: 'PRJ-2026-002',
    name: 'Green Villa Residential Enclave',
    type: 'Residential',
    site: 'Chittagong Coastal Sector 4',
    manager: 'Shamim Khan',
    start_date: '2026-03-01',
    end_date: '2028-02-28',
    budget: 8200000.00,
    actual_cost: 7200000.00,
    progress: 88,
    description: 'Luxury gated community project consisting of 40 individual villas and shared recreational facilities.',
    status: 'active',
    open_issues: 1,
    team: ['Shamim K.', 'Zubair H.', 'Tanvir A.']
  },
  {
    uuid: 'p-103',
    code: 'PRJ-2026-003',
    name: 'East-West Expressway Interchange',
    type: 'Infrastructure',
    site: 'Gazipur Highway Extension',
    manager: 'Rahim Uddin',
    start_date: '2025-11-10',
    end_date: '2026-08-15',
    budget: 12500000.00,
    actual_cost: 12100000.00,
    progress: 95,
    description: 'High-density highway flyover connection with heavy reinforced concrete structures.',
    status: 'completed',
    open_issues: 0,
    team: ['Rahim U.', 'Nadia S.']
  },
  {
    uuid: 'p-104',
    code: 'PRJ-2026-004',
    name: 'Logistics Park & Storage Silos',
    type: 'Industrial',
    site: 'Narayanganj Riverfront Depot',
    manager: 'Farhana Rahman',
    start_date: '2026-05-01',
    end_date: '2027-11-30',
    budget: 3100000.00,
    actual_cost: 250000.00,
    progress: 15,
    description: 'Automated warehouse facility with climate-controlled cold storage zones.',
    status: 'planning',
    open_issues: 5,
    team: ['Farhana R.', 'Tanvir A.']
  },
  {
    uuid: 'p-105',
    code: 'PRJ-2026-005',
    name: 'Riverfront City Mixed Township',
    type: 'Mixed-Use',
    site: 'Sylhet Sadar Block B',
    manager: 'Zubair Hossain',
    start_date: '2026-02-01',
    end_date: '2029-01-01',
    budget: 18000000.00,
    actual_cost: 2100000.00,
    progress: 20,
    description: 'Integrated township featuring residential apartments, retail shopping plazas, and school zones.',
    status: 'onhold',
    open_issues: 8,
    team: ['Zubair H.', 'Shamim K.', 'Rahim U.']
  }
];

export default function ProjectMasterPage() {
  // State Management
  const [projects, setProjects] = useState<ProjectMaster[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterManager, setFilterManager] = useState<string>('All');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  // Pagination
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProjectDetail, setSelectedProjectDetail] = useState<ProjectMaster | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<string>('Overview');

  // New Project Form State
  const [formData, setFormData] = useState({
    code: `PRJ-2026-00${initialProjects.length + 1}`,
    name: '',
    type: 'Residential' as ProjectType,
    site: '',
    manager: 'Tanvir Ahmed',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    budget: '',
    description: '',
    status: 'planning' as ProjectStatus,
    cover_image: ''
  });

  // Dynamic Managers & Sites options for filters
  const managersList = useMemo(() => ['All', ...Array.from(new Set(projects.map(p => p.manager)))], [projects]);
  const typesList = useMemo(() => ['All', 'Residential', 'Commercial', 'Infrastructure', 'Industrial', 'Mixed-Use'], []);
  const statusesList = useMemo(() => ['All', 'planning', 'active', 'onhold', 'completed', 'cancelled'], []);

  // Filter Projects Real-Time (GET simulation)
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.site.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterType === 'All' || p.type === filterType;
      const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
      const matchesManager = filterManager === 'All' || p.manager === filterManager;

      const matchesFromDate = !fromDate || new Date(p.start_date) >= new Date(fromDate);
      const matchesToDate = !toDate || new Date(p.end_date) <= new Date(toDate);

      return matchesSearch && matchesType && matchesStatus && matchesManager && matchesFromDate && matchesToDate;
    });
  }, [projects, searchQuery, filterType, filterStatus, filterManager, fromDate, toDate]);

  // Real-Time Summary Statistics
  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'active').length;
    const planning = projects.filter(p => p.status === 'planning').length;
    const totalBudget = projects.reduce((acc, curr) => acc + curr.budget, 0);
    const avgProgress = Math.round(projects.reduce((acc, curr) => acc + curr.progress, 0) / (total || 1));
    return { total, active, planning, totalBudget, avgProgress };
  }, [projects]);

  // Form Field Change Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // POST Request Handler (Create New Project)
  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.start_date || !formData.budget) {
      alert('Please fill in all mandatory fields (*)');
      return;
    }

    const budgetNum = parseFloat(formData.budget) || 0;

    const newProject: ProjectMaster = {
      uuid: `p-${Date.now()}`,
      code: formData.code,
      name: formData.name,
      type: formData.type,
      site: formData.site || 'Main Site Base',
      manager: formData.manager,
      start_date: formData.start_date,
      end_date: formData.end_date || formData.start_date,
      budget: budgetNum,
      actual_cost: 0,
      progress: formData.status === 'active' ? 10 : 0,
      description: formData.description,
      status: formData.status,
      open_issues: 0,
      team: [formData.manager, 'Admin User']
    };

    setProjects([newProject, ...projects]);
    setIsCreateModalOpen(false);

    // Reset Form
    setFormData({
      code: `PRJ-2026-00${projects.length + 2}`,
      name: '',
      type: 'Residential',
      site: '',
      manager: 'Tanvir Ahmed',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      budget: '',
      description: '',
      status: 'planning',
      cover_image: ''
    });
  };

  // Status Badge Component helper
  const renderStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active
          </span>
        );
      case 'planning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5" /> Planning
          </span>
        );
      case 'onhold':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <PauseCircle className="w-3.5 h-3.5" /> On Hold
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 p-6 lg:p-8 font-sans">
      
      {/* Navigation Breadcrumbs & Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <nav className="flex items-center text-sm text-slate-500 space-x-2 mb-1">
            <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="hover:text-blue-600 cursor-pointer">Projects</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-800">Project Master</span>
          </nav>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
            <FolderKanban className="w-7 h-7 text-blue-600" /> Project Master Management
          </h1>
        </div>

        {/* Primary POST Trigger Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> + Create Project Master
          </button>
        </div>
      </div>

      {/* Dynamic KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Projects</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</h3>
            <p className="text-xs text-blue-600 mt-1 font-medium">{stats.active} Active in progress</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Portfolio Budget</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">${(stats.totalBudget / 1000000).toFixed(2)}M</h3>
            <p className="text-xs text-emerald-600 mt-1 font-medium">Allocated across {stats.total} projects</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Portfolio Progress</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.avgProgress}%</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Overall milestone execution</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Planning Stage</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.planning}</h3>
            <p className="text-xs text-amber-600 mt-1 font-medium">Pending site initiation</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Industry Standard Search & Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" /> Search & Filter Projects
          </span>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterType('All');
              setFilterStatus('All');
              setFilterManager('All');
              setFromDate('');
              setToDate('');
            }}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search Code, Name, Site..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-9 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="All">Type: All</option>
              {typesList.filter(t => t !== 'All').map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="All">Status: All</option>
              {statusesList.filter(s => s !== 'All').map((s, idx) => (
                <option key={idx} value={s}>{s.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Manager Filter */}
          <div>
            <select
              value={filterManager}
              onChange={(e) => setFilterManager(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="All">Manager: All</option>
              {managersList.filter(m => m !== 'All').map((m, idx) => (
                <option key={idx} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Date Range Inputs */}
          <div>
            <input
              type="date"
              title="Start Date From"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs rounded-xl px-2.5 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

        </div>
      </div>

      {/* Main Table Container Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Table Export Bar */}
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs">
              <FileSpreadsheet className="w-3.5 h-3.5" /> Excel Export
            </button>
            <button className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs">
              <FileText className="w-3.5 h-3.5" /> PDF Summary
            </button>
            <span className="text-xs text-slate-500 ml-2">Showing <strong className="text-slate-800">{filteredProjects.length}</strong> items</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>Per page:</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-600"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Specification Columns Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Project Name</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Site Location</th>
                <th className="py-3.5 px-4">Manager</th>
                <th className="py-3.5 px-4">Budget ($)</th>
                <th className="py-3.5 px-4">Start / End Date</th>
                <th className="py-3.5 px-4 w-36">Progress</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-800">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((proj) => (
                  <tr key={proj.uuid} className="hover:bg-blue-50/30 transition-colors group">
                    
                    {/* Code */}
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-blue-600 whitespace-nowrap">
                      {proj.code}
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {proj.name}
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {proj.type}
                      </span>
                    </td>

                    {/* Site */}
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[140px]" title={proj.site}>{proj.site}</span>
                      </div>
                    </td>

                    {/* Manager */}
                    <td className="py-3.5 px-4 text-slate-700 text-xs font-medium">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        {proj.manager}
                      </div>
                    </td>

                    {/* Budget */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                      ${proj.budget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Start/End Date */}
                    <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>S: {proj.start_date}</span>
                        <span className="text-slate-400">E: {proj.end_date}</span>
                      </div>
                    </td>

                    {/* Progress Bar */}
                    <td className="py-3.5 px-4">
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            proj.progress >= 80 ? 'bg-emerald-500' : proj.progress >= 40 ? 'bg-blue-600' : 'bg-amber-500'
                          }`}
                          style={{ width: `${proj.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-[11px] font-bold text-slate-600 mt-1 text-right">{proj.progress}%</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {renderStatusBadge(proj.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedProjectDetail(proj)}
                          className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          title="View Project Detail Drawer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                          title="Edit Project Master"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setProjects(projects.filter(p => p.uuid !== proj.uuid))}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No Project Master records found matching your active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-800">1</span> to <span className="font-semibold text-slate-800">{filteredProjects.length}</span> of <span className="font-semibold text-slate-800">{projects.length}</span> entries
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              className="px-3 py-1 border border-slate-200 bg-white text-slate-400 text-xs font-semibold rounded-lg cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button className="px-3 py-1 border border-blue-600 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-xs">
              1
            </button>
            <button
              disabled={true}
              className="px-3 py-1 border border-slate-200 bg-white text-slate-400 text-xs font-semibold rounded-lg cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

      </div>


      {/* ========================================================================= */}
      {/* POST FEATURE: MODAL FORM FOR PROJECT MASTER CREATION                      */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Create New Project Master</h2>
                  <p className="text-xs text-slate-500">Add an industry-standard ERP project entry</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleCreateProjectSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Code (Unique) */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Project Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    required
                    value={formData.code}
                    onChange={handleInputChange}
                    className="bg-slate-50 border border-slate-200 font-mono text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Project Name */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Project Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Skyline Tower Phase 1"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  />
                </div>

                {/* Project Type */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Project Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Mixed-Use">Mixed-Use</option>
                  </select>
                </div>

                {/* Site Location */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Site Location
                  </label>
                  <input
                    type="text"
                    name="site"
                    placeholder="e.g. Sector 7, Uttara, Dhaka"
                    value={formData.site}
                    onChange={handleInputChange}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  />
                </div>

                {/* Project Manager */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Project Manager <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="manager"
                    value={formData.manager}
                    onChange={handleInputChange}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  >
                    <option value="Tanvir Ahmed">Tanvir Ahmed</option>
                    <option value="Shamim Khan">Shamim Khan</option>
                    <option value="Rahim Uddin">Rahim Uddin</option>
                    <option value="Farhana Rahman">Farhana Rahman</option>
                    <option value="Zubair Hossain">Zubair Hossain</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="onhold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    required
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    End Date (≥ Start Date)
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  />
                </div>

                {/* Budget Money */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Allocated Budget (MONEY) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="number"
                      step="0.01"
                      name="budget"
                      required
                      placeholder="0.00"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-9 pr-3.5 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Project Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Enter project scope and technical notes..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  />
                </div>

                {/* Attachment / Cover Image */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Cover Image / Site Blueprint
                  </label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-600">Click or drag file to attach project cover image</p>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Save Project Master
                </button>
              </div>
            </form>

          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* PROJECT DETAIL DRAWER / VIEW MODAL (WITH SPECIFICATION TABS & WIDGETS)    */}
      {/* ========================================================================= */}
      {selectedProjectDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header: Code + Status Badge + Progress Ring + Actions */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                
                {/* Donut / Progress Ring */}
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="4" className="text-slate-700" fill="transparent" />
                    <circle
                      cx="24" cy="24" r="18"
                      stroke="currentColor" strokeWidth="4"
                      className="text-blue-500"
                      fill="transparent"
                      strokeDasharray={113}
                      strokeDashoffset={113 - (113 * selectedProjectDetail.progress) / 100}
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-white">{selectedProjectDetail.progress}%</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-600/30 border border-blue-500/30 text-blue-300 font-bold">
                      {selectedProjectDetail.code}
                    </span>
                    {renderStatusBadge(selectedProjectDetail.status)}
                  </div>
                  <h2 className="text-xl font-bold mt-1 text-white">{selectedProjectDetail.name}</h2>
                </div>

              </div>

              {/* Actions & Close */}
              <div className="flex items-center gap-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                  Edit Details
                </button>
                <button
                  onClick={() => setSelectedProjectDetail(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub Tabs Bar matching Specification (Sites, Buildings, Units, Parties, etc.) */}
            <div className="bg-slate-100 border-b border-slate-200 px-6 flex items-center gap-1 overflow-x-auto text-xs font-semibold text-slate-600">
              {[
                'Overview', 'Sites', 'Buildings', 'Units', 'Parties', 
                'Agreements', 'Milestones', 'Tasks', 'Budget', 'Cost', 
                'Progress', 'Documents', 'Controls'
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDetailTab(tab)}
                  className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                    activeDetailTab === tab
                      ? 'border-blue-600 text-blue-600 font-bold bg-white'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Modal Detail Content Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
              {activeDetailTab === 'Overview' ? (
                <>
                  {/* Overview KPIs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <p className="text-xs text-slate-500 font-semibold uppercase">Total Budget</p>
                      <h4 className="text-xl font-bold text-slate-900 mt-1">${selectedProjectDetail.budget.toLocaleString()}</h4>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <p className="text-xs text-slate-500 font-semibold uppercase">Actual Spend</p>
                      <h4 className="text-xl font-bold text-slate-900 mt-1">${selectedProjectDetail.actual_cost.toLocaleString()}</h4>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <p className="text-xs text-slate-500 font-semibold uppercase">Open Issues</p>
                      <h4 className="text-xl font-bold text-rose-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> {selectedProjectDetail.open_issues} Issues
                      </h4>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <p className="text-xs text-slate-500 font-semibold uppercase">Project Lead</p>
                      <h4 className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1">
                        <User className="w-4 h-4 text-blue-600" /> {selectedProjectDetail.manager}
                      </h4>
                    </div>
                  </div>

                  {/* Specification Dashboard Widgets */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Widget 1: Budget vs Actual (Bar) */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-blue-600" /> Budget vs Actual Spend
                        </h3>
                        <span className="text-xs text-slate-500">Financial Variance</span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                            <span>Allocated Budget</span>
                            <span>${selectedProjectDetail.budget.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full" style={{ width: '100%' }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                            <span>Actual Expenses Incurred</span>
                            <span>${selectedProjectDetail.actual_cost.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${Math.min(100, (selectedProjectDetail.actual_cost / selectedProjectDetail.budget) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Widget 2: Team Avatars & Issues Badge */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" /> Project Team Members
                        </h3>
                        <div className="space-y-2">
                          {selectedProjectDetail.team.map((member, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2 rounded-lg">
                              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                                {member.charAt(0)}
                              </div>
                              {member}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Open Risk Issues:</span>
                        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          <ShieldAlert className="w-3.5 h-3.5" /> {selectedProjectDetail.open_issues} Open
                        </span>
                      </div>
                    </div>

                    {/* Widget 3: Upcoming Milestones */}
                    <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                      <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <Flag className="w-4 h-4 text-blue-600" /> Upcoming Key Milestones
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-xs font-bold text-slate-800">1. Site Excavation & Piling</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Target: 2026-03-30</p>
                          <span className="inline-block text-[10px] text-emerald-600 font-semibold mt-2">Completed</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-xs font-bold text-slate-800">2. Foundation Structure Pouring</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Target: 2026-07-15</p>
                          <span className="inline-block text-[10px] text-blue-600 font-semibold mt-2">In Progress</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-xs font-bold text-slate-800">3. Main Structural Frame Completion</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Target: 2026-12-10</p>
                          <span className="inline-block text-[10px] text-slate-400 font-semibold mt-2">Pending</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </>
              ) : (
                <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
                  <p className="text-sm text-slate-500">
                    Tab <strong className="text-blue-600">{activeDetailTab}</strong> details for project <strong>{selectedProjectDetail.code}</strong> are active.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}