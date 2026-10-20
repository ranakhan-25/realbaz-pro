'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Plus,
  Search,
  Filter,
  Calendar,
  Percent,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  X,
  Upload,
  Image as ImageIcon,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  BarChart3,
  Paperclip,
  Trash2,
  Eye,
  Info
} from 'lucide-react';

// Progress Record Specification Interface
interface ProgressRecord {
  uuid: string;
  as_of: string;
  physical_pct: number;
  financial_pct: number;
  variance: number; // physical_pct - financial_pct
  remarks: string;
  photos: string[];
  created_at: string;
  created_by: string;
}

// Mock Initial Progress Log Entries for a Project
const initialProgressLogs: ProgressRecord[] = [
  {
    uuid: 'prog-001',
    as_of: '2026-10-15',
    physical_pct: 42.5,
    financial_pct: 40.0,
    variance: 2.5,
    remarks: 'Foundation concrete pouring phase completed. Site inspection approved by structural team.',
    photos: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80'
    ],
    created_at: '2026-10-15 14:30',
    created_by: 'Tanvir Ahmed'
  },
  {
    uuid: 'prog-002',
    as_of: '2026-09-30',
    physical_pct: 35.0,
    financial_pct: 38.0,
    variance: -3.0,
    remarks: 'Minor material delivery delay caused physical progress lag. Financial disbursement slightly ahead.',
    photos: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80'
    ],
    created_at: '2026-09-30 11:15',
    created_by: 'Shamim Khan'
  },
  {
    uuid: 'prog-003',
    as_of: '2026-08-31',
    physical_pct: 25.0,
    financial_pct: 25.0,
    variance: 0.0,
    remarks: 'Excavation and site piling fully wrapped on schedule.',
    photos: [],
    created_at: '2026-08-31 16:45',
    created_by: 'Tanvir Ahmed'
  }
];

export default function ProjectProgressPage() {
  // State Management
  const [progressLogs, setProgressLogs] = useState<ProgressRecord[]>(initialProgressLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPhotosModal, setSelectedPhotosModal] = useState<string[] | null>(null);

  // Today's Date String Helper YYYY-MM-DD
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // POST Form State
  const [formData, setFormData] = useState({
    as_of: getTodayDate(),
    physical_pct: '',
    financial_pct: '',
    remarks: '',
    photos: [] as string[]
  });

  // Filtered List View
  const filteredLogs = useMemo(() => {
    return progressLogs.filter((item) => {
      const matchesSearch = item.remarks.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.created_by.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFromDate = !fromDate || new Date(item.as_of) >= new Date(fromDate);
      const matchesToDate = !toDate || new Date(item.as_of) <= new Date(toDate);
      return matchesSearch && matchesFromDate && matchesToDate;
    });
  }, [progressLogs, searchQuery, fromDate, toDate]);

  // Dynamic KPI Stats
  const latestRecord = progressLogs[0] || null;
  const currentPhysical = latestRecord ? latestRecord.physical_pct : 0;
  const currentFinancial = latestRecord ? latestRecord.financial_pct : 0;
  const currentVariance = latestRecord ? latestRecord.variance : 0;

  // Input Handler for POST Form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload Simulation Handler
  const handleSimulatedFileUpload = () => {
    // Adding dummy photo URLs to simulate attachment uploads
    const dummyImages = [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=400&q=80'
    ];
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, dummyImages[prev.photos.length % dummyImages.length]]
    }));
  };

  // POST Request Handler (Create New Progress Record)
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const physNum = parseFloat(formData.physical_pct);
    const finNum = parseFloat(formData.financial_pct);

    if (isNaN(physNum) || physNum < 0 || physNum > 100) {
      alert('Physical Progress % must be between 0 and 100');
      return;
    }

    if (isNaN(finNum) || finNum < 0 || finNum > 100) {
      alert('Financial Progress % must be between 0 and 100');
      return;
    }

    const varianceVal = parseFloat((physNum - finNum).toFixed(2));

    const newEntry: ProgressRecord = {
      uuid: `prog-${Date.now()}`,
      as_of: formData.as_of || getTodayDate(),
      physical_pct: physNum,
      financial_pct: finNum,
      variance: varianceVal,
      remarks: formData.remarks,
      photos: formData.photos,
      created_at: `${getTodayDate()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      created_by: 'Tanvir Ahmed'
    };

    // Prepend to show most recent log on top
    setProgressLogs([newEntry, ...progressLogs]);
    setIsCreateModalOpen(false);

    // Reset Form
    setFormData({
      as_of: getTodayDate(),
      physical_pct: '',
      financial_pct: '',
      remarks: '',
      photos: []
    });
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 p-6 lg:p-8 font-sans">
      
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <nav className="flex items-center text-sm text-slate-500 space-x-2 mb-1">
            <span className="hover:text-blue-600 cursor-pointer">Projects</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="hover:text-blue-600 cursor-pointer">PRJ-2026-001</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-800">Progress</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
              <TrendingUp className="w-7 h-7 text-blue-600" /> Feature 03.07 · Progress Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200">
              /projects/:uuid/progress
            </span>
          </div>
        </div>

        {/* Primary POST Action Trigger Button */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> + Log Progress Update
        </button>
      </div>

      {/* KPI Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Physical Progress */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Latest Physical %</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{currentPhysical}%</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Site work execution</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        {/* Financial Progress */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Latest Financial %</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{currentFinancial}%</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Billed & disbursed cost</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        {/* Schedule Variance */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress Variance</p>
            <h3 className={`text-2xl font-bold mt-1 ${currentVariance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {currentVariance > 0 ? `+${currentVariance}%` : `${currentVariance}%`}
            </h3>
            <p className="text-xs mt-1 font-medium flex items-center gap-1">
              {currentVariance >= 0 ? (
                <span className="text-emerald-600 flex items-center gap-0.5"><ArrowUpRight className="w-3.5 h-3.5" /> Ahead of schedule</span>
              ) : (
                <span className="text-rose-600 flex items-center gap-0.5"><ArrowDownRight className="w-3.5 h-3.5" /> Behind financial burn</span>
              )}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentVariance >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {currentVariance >= 0 ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
        </div>

        {/* Total Updates Count */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Audit Logs</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{progressLogs.length}</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Reported status milestones</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" /> Filter Progress Entries
          </span>
          <button
            onClick={() => {
              setSearchQuery('');
              setFromDate('');
              setToDate('');
            }}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search in remarks or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-9 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* From Date */}
          <div>
            <input
              type="date"
              title="From As Of Date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* To Date */}
          <div>
            <input
              type="date"
              title="To As Of Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

        </div>
      </div>

      {/* Specification Table View */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Export and Info Bar */}
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs">
              <FileSpreadsheet className="w-3.5 h-3.5" /> Excel Export
            </button>
            <button className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs">
              <FileText className="w-3.5 h-3.5" /> PDF Log Summary
            </button>
            <span className="text-xs text-slate-500 ml-2">Total <strong className="text-slate-800">{filteredLogs.length}</strong> updates found</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>Variance Formula: <code>physical_pct - financial_pct</code></span>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">As Of Date</th>
                <th className="py-3.5 px-4">Physical %</th>
                <th className="py-3.5 px-4">Financial %</th>
                <th className="py-3.5 px-4">Variance</th>
                <th className="py-3.5 px-4 w-1/3">Remarks</th>
                <th className="py-3.5 px-4 text-center">Photos</th>
                <th className="py-3.5 px-4 text-right">Logged By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-800">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.uuid} className="hover:bg-blue-50/30 transition-colors group">
                    
                    {/* As Of Date */}
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        {log.as_of}
                      </div>
                    </td>

                    {/* Physical % */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-mono">{log.physical_pct}%</span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${log.physical_pct}%` }}></div>
                        </div>
                      </div>
                    </td>

                    {/* Financial % */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-mono">{log.financial_pct}%</span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${log.financial_pct}%` }}></div>
                        </div>
                      </div>
                    </td>

                    {/* Variance */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs font-bold">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                        log.variance > 0
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : log.variance < 0
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {log.variance > 0 ? `+${log.variance}%` : `${log.variance}%`}
                      </span>
                    </td>

                    {/* Remarks */}
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <p className="line-clamp-2" title={log.remarks}>{log.remarks}</p>
                    </td>

                    {/* Photos Preview */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {log.photos.length > 0 ? (
                        <button
                          onClick={() => setSelectedPhotosModal(log.photos)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                          <span>{log.photos.length} Photo{log.photos.length > 1 ? 's' : ''}</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs italic">None</span>
                      )}
                    </td>

                    {/* Logged By */}
                    <td className="py-3.5 px-4 text-right text-xs text-slate-500 whitespace-nowrap">
                      <div>
                        <span className="font-medium text-slate-800">{log.created_by}</span>
                        <p className="text-[10px] text-slate-400">{log.created_at}</p>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No progress updates found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500">
          <span>Showing <strong>{filteredLogs.length}</strong> progress records</span>
          <span>Route endpoint: <code>/projects/:uuid/progress</code></span>
        </div>

      </div>


      {/* ========================================================================= */}
      {/* POST FEATURE: MODAL FORM FOR NEW PROGRESS ENTRY (Route: /projects/:uuid/progress/create) */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Log Progress Update</h2>
                  <p className="text-xs font-mono text-slate-500">/projects/:uuid/progress/create</p>
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
            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              
              {/* as_of Date Input */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  As Of Date (as_of) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="as_of"
                  required
                  value={formData.as_of}
                  onChange={handleInputChange}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                />
                <p className="text-[11px] text-slate-400 mt-1">Defaults to today's date if unmodified</p>
              </div>

              {/* Physical % & Financial % side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Physical Pct */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Physical Progress % (physical_pct) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      name="physical_pct"
                      required
                      placeholder="e.g. 45.0"
                      value={formData.physical_pct}
                      onChange={handleInputChange}
                      className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-3.5 pr-8 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">%</span>
                  </div>
                </div>

                {/* Financial Pct */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Financial Progress % (financial_pct) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      name="financial_pct"
                      required
                      placeholder="e.g. 42.0"
                      value={formData.financial_pct}
                      onChange={handleInputChange}
                      className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-3.5 pr-8 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">%</span>
                  </div>
                </div>

              </div>

              {/* Dynamic Live Variance Display */}
              {formData.physical_pct !== '' && formData.financial_pct !== '' && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Computed Variance:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {(parseFloat(formData.physical_pct || '0') - parseFloat(formData.financial_pct || '0')).toFixed(2)}%
                  </span>
                </div>
              )}

              {/* Remarks Textarea */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Remarks / Status Notes (remarks)
                </label>
                <textarea
                  name="remarks"
                  rows={3}
                  placeholder="Enter detailed site inspection notes, completed milestones, or issues..."
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                />
              </div>

              {/* Photos Attachment Simulation */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Site Photos Attachments (photos)
                </label>
                <div
                  onClick={handleSimulatedFileUpload}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-600 font-medium">Click to attach site images (Multiple)</p>
                  <p className="text-[10px] text-slate-400">PNG, JPG up to 10MB</p>
                </div>

                {formData.photos.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {formData.photos.map((url, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                        <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, photos: p.photos.filter((_, i) => i !== idx) }))}
                          className="absolute top-1 right-1 bg-slate-900/70 text-white rounded-full p-0.5 hover:bg-rose-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                  Save Progress Update
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Photo Gallery Preview Modal */}
      {selectedPhotosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden p-6 relative">
            <button
              onClick={() => setSelectedPhotosModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-600" /> Attached Site Inspection Photos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              {selectedPhotosModal.map((imgUrl, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={imgUrl} alt={`Site inspection ${i}`} className="w-full h-48 object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}