'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  AlertTriangle, 
  Calendar, 
  User, 
  Tag, 
  Upload, 
  X, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

interface IssueItem {
  id: string;
  title: string; // title* T
  project: string; // project* S
  description: string; // description* TA(rich)
  severity: 'low' | 'medium' | 'high' | 'critical'; // severity* S
  assignee: string; // assignee* S
  due_at: string; // due_at* DT
  tags: string[]; // tags MS
  photos?: string[]; // photos F
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
}

const initialIssues: IssueItem[] = [
  {
    id: 'iss-101',
    title: 'Reinforcement Steel Rebar Spacing Deviation at 8th Floor Shear Wall',
    project: 'Skyline City Tower Phase 1',
    description: 'During inspection, rebar spacing was found to be 200mm instead of the structural spec 150mm near core wall C2.',
    severity: 'critical',
    assignee: 'Engr. Shamim Khan',
    due_at: '2026-10-22T17:00',
    tags: ['Structural', 'Rebar', 'Quality'],
    status: 'open'
  },
  {
    id: 'iss-102',
    title: 'Water Seepage in Basement Level 2 Concrete Retaining Wall',
    project: 'Skyline City Tower Phase 1',
    description: 'Water dampness observed near construction joint J-04. Requires immediate polyurethane injection grouting.',
    severity: 'high',
    assignee: 'Engr. Tanvir Hossain',
    due_at: '2026-10-25T12:00',
    tags: ['Waterproofing', 'Basement'],
    status: 'in_progress'
  },
  {
    id: 'iss-103',
    title: 'Main Substation High Voltage Cable Conduit Blockage',
    project: 'Lakeside Commercial Park',
    description: 'PVC conduit line #3 is obstructed with dried concrete slurry during slab casting.',
    severity: 'medium',
    assignee: 'Engr. Arifur Rahman',
    due_at: '2026-10-28T16:00',
    tags: ['Electrical', 'MEP'],
    status: 'open'
  },
  {
    id: 'iss-104',
    title: 'PPE Non-compliance by Exterior Glazing Subcontractor',
    project: 'Lakeside Commercial Park',
    description: 'Two workers observed working on scaffolding without double-lanyard safety harnesses attached.',
    severity: 'high',
    assignee: 'Safety Officer Rahim',
    due_at: '2026-10-21T09:00',
    tags: ['Safety', 'PPE'],
    status: 'resolved'
  }
];

export default function IssuesPage() {
  const [list, setList] = useState<IssueItem[]>(initialIssues);
  const [showForm, setShowForm] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterAssignee, setFilterAssignee] = useState('All');

  // POST Form State (/construction/issues/create)
  const [project, setProject] = useState('Skyline City Tower Phase 1');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<IssueItem['severity']>('high');
  const [assignee, setAssignee] = useState('Engr. Shamim Khan');
  const [dueAt, setDueAt] = useState('2026-10-25T17:00');
  const [tagInput, setTagInput] = useState('Structural, Concrete');
  const [photoFileName, setPhotoFileName] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFileName(e.target.files[0].name);
    }
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert('Title and Description are required!');
      return;
    }

    const tagsArray = tagInput.split(',').map(t => t.trim()).filter(Boolean);

    const newItem: IssueItem = {
      id: `iss-${Date.now()}`,
      project,
      title,
      description,
      severity,
      assignee,
      due_at: dueAt,
      tags: tagsArray,
      photos: photoFileName ? [photoFileName] : undefined,
      status: 'open'
    };

    setList([newItem, ...list]);
    setShowForm(false);

    // Reset
    setTitle('');
    setDescription('');
    setPhotoFileName('');
  };

  // Filter Logic
  const filteredList = useMemo(() => {
    return list.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity = filterSeverity === 'All' || item.severity === filterSeverity;
      const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
      const matchesAssignee = filterAssignee === 'All' || item.assignee === filterAssignee;

      return matchesSearch && matchesSeverity && matchesStatus && matchesAssignee;
    });
  }, [list, searchQuery, filterSeverity, filterStatus, filterAssignee]);

  const getSeverityBadge = (sev: IssueItem['severity']) => {
    switch (sev) {
      case 'critical':
        return <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase"><AlertTriangle className="w-3 h-3 text-rose-600" /> Critical</span>;
      case 'high':
        return <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase"><AlertCircle className="w-3 h-3 text-amber-600" /> High</span>;
      case 'medium':
        return <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase">Medium</span>;
      case 'low':
        return <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase">Low</span>;
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <nav className="flex items-center text-xs text-slate-500 space-x-2 mb-1">
            <Link href="/construction" className="hover:text-blue-600">Construction</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">Issues Management</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900">Site Issues & Punch List</h1>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel Form' : 'POST Issue (/create)'}
        </button>
      </div>

      {/* POST Form (/construction/issues/create) */}
      {showForm && (
        <form onSubmit={handlePost} className="mb-6 p-5 border border-blue-200 bg-blue-50/40 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-blue-100 pb-2">
            <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              POST /construction/issues/create
            </h2>
            <span className="text-xs text-blue-600 font-mono font-medium">Feature 04.10</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">project* S *</label>
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

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1">title* T *</label>
              <input
                type="text"
                required
                placeholder="Issue Title / Header"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white border text-xs font-bold text-slate-900 rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">description* TA(rich) *</label>
            <textarea
              rows={3}
              required
              placeholder="Detailed technical description of non-conformance or defect..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">severity* S *</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="bg-white border text-xs font-bold rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600 capitalize"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">assignee* S *</label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              >
                <option value="Engr. Shamim Khan">Engr. Shamim Khan</option>
                <option value="Engr. Tanvir Hossain">Engr. Tanvir Hossain</option>
                <option value="Engr. Arifur Rahman">Engr. Arifur Rahman</option>
                <option value="Safety Officer Rahim">Safety Officer Rahim</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">due_at* DT *</label>
              <input
                type="datetime-local"
                required
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                className="bg-white border text-xs font-mono rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">tags MS (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Structural, Rebar, MEP"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="bg-white border text-xs rounded-xl p-2.5 w-full focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">photos F (Evidence)</label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 px-3.5 py-2 rounded-xl hover:bg-slate-50 shadow-sm">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                Upload Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              {photoFileName && (
                <span className="text-xs text-slate-600 font-mono inline-flex items-center gap-1">
                  {photoFileName}
                  <button type="button" onClick={() => setPhotoFileName('')}>
                    <X className="w-3.5 h-3.5 text-rose-500 hover:text-rose-700" />
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
              Save Issue Entry
            </button>
          </div>
        </form>
      )}

      {/* GET List Table (/construction/issues) */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        
        {/* Filters Header */}
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-4">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
            GET /construction/issues
          </span>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Filter Severity */}
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Severity:</label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-white border text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white border text-xs rounded-xl px-2.5 py-1.5 focus:outline-none capitalize"
              >
                <option value="All">All</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Filter Assignee */}
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Assignee:</label>
              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="bg-white border text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Assignees</option>
                <option value="Engr. Shamim Khan">Engr. Shamim Khan</option>
                <option value="Engr. Tanvir Hossain">Engr. Tanvir Hossain</option>
                <option value="Engr. Arifur Rahman">Engr. Arifur Rahman</option>
                <option value="Safety Officer Rahim">Safety Officer Rahim</option>
              </select>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-52">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search issue title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border text-xs rounded-xl pl-8 pr-3 py-1.5 w-full focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-xs font-bold uppercase text-slate-600 border-b border-slate-200">
                <th className="p-3.5">Issue Title & Project</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Assignee</th>
                <th className="p-3.5">Due Date & Time</th>
                <th className="p-3.5">Tags</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredList.length > 0 ? (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.project}</div>
                    </td>
                    <td className="p-3.5">{getSeverityBadge(item.severity)}</td>
                    <td className="p-3.5 text-xs text-slate-700 font-medium">
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {item.assignee}
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-xs text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.due_at.replace('T', ' ')}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((t, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        item.status === 'open' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        item.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    No matching issue records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}