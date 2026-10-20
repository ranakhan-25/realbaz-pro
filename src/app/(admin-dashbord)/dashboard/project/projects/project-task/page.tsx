'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  List, 
  Kanban, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  User, 
  X, 
  Paperclip, 
  Bell, 
  Upload, 
  Flag, 
  Tag,
  ArrowUpRight
} from 'lucide-react';

// TypeScript Interface matching Feature 03.05: Tasks
interface ProjectTask {
  id: string;
  projectUuid: string;
  title: string;
  milestone?: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  due_at: string; // ISO DateTime
  status: 'todo' | 'in_progress' | 'under_review' | 'completed';
  description?: string;
  hasAttachment?: boolean;
  reminder_before?: number; // in minutes
}

// Initial Static Data
const initialTasks: ProjectTask[] = [
  {
    id: 'TSK-201',
    projectUuid: 'proj-skyline-001',
    title: 'Inspect Rebar Spacing on Floor 2',
    milestone: 'Basement Concrete Mat Foundation Cast',
    assignee: 'Shamim Khan',
    priority: 'high',
    due_at: '2026-10-22T14:00',
    status: 'in_progress',
    description: 'Verify steel rod spacing matches structural drawing specs v2.0 before concrete pouring.',
    hasAttachment: true,
    reminder_before: 60
  },
  {
    id: 'TSK-202',
    projectUuid: 'proj-skyline-001',
    title: 'Approve Concrete Cylinder Test Report',
    milestone: 'Site Excavation & Soil Piling Completed',
    assignee: 'Tanvir Ahmed',
    priority: 'critical',
    due_at: '2026-10-21T10:30',
    status: 'under_review',
    description: 'Review lab cylinder compression test results from third-party auditor.',
    hasAttachment: true,
    reminder_before: 30
  },
  {
    id: 'TSK-203',
    projectUuid: 'proj-skyline-001',
    title: 'Procure PVC Conduit Pipes Phase 1',
    milestone: 'Electrical Conduit & Pipe Laying Phase 1',
    assignee: 'Rahim Uddin',
    priority: 'medium',
    due_at: '2026-10-25T17:00',
    status: 'todo',
    description: 'Place purchase order with approved vendor for 2-inch PVC conduits.',
    hasAttachment: false,
    reminder_before: 120
  },
  {
    id: 'TSK-204',
    projectUuid: 'proj-skyline-001',
    title: 'Clear Soil Debris from North Gate',
    milestone: 'Site Excavation & Soil Piling Completed',
    assignee: 'Shamim Khan',
    priority: 'low',
    due_at: '2026-10-18T12:00',
    status: 'completed',
    description: 'Coordinate truck haulage to clear excavated soil near gate 2.',
    hasAttachment: false,
    reminder_before: 15
  }
];

export default function ProjectTasksPage() {
  // GET State
  const [tasks, setTasks] = useState<ProjectTask[]>(initialTasks);
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // POST State (Modal Form - /projects/:uuid/tasks/create)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    milestone: 'Ground Floor Column & Slab Casting',
    assignee: 'Shamim Khan',
    priority: 'medium' as ProjectTask['priority'],
    due_at: new Date().toISOString().slice(0, 16),
    description: '',
    reminder_before: '30',
    hasAttachment: false
  });

  // Unique Assignees List for Filter
  const assigneesList = useMemo(() => ['All', ...Array.from(new Set(tasks.map(t => t.assignee)))], [tasks]);

  // POST Handler (Create New Task)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: ProjectTask = {
      id: `TSK-${200 + tasks.length + 1}`,
      projectUuid: 'proj-skyline-001',
      title: formData.title || 'Untitled Task',
      milestone: formData.milestone || undefined,
      assignee: formData.assignee || 'Unassigned',
      priority: formData.priority,
      due_at: formData.due_at,
      status: 'todo',
      description: formData.description || 'No detailed instructions provided.',
      hasAttachment: formData.hasAttachment,
      reminder_before: parseInt(formData.reminder_before) || 30
    };

    setTasks([newTask, ...tasks]);
    setIsModalOpen(false);

    // Reset Form Data
    setFormData({
      title: '',
      milestone: 'Ground Floor Column & Slab Casting',
      assignee: 'Shamim Khan',
      priority: 'medium',
      due_at: new Date().toISOString().slice(0, 16),
      description: '',
      reminder_before: '30',
      hasAttachment: false
    });
  };

  // GET Filter Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = 
        task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesAssignee = selectedAssignee === 'All' || task.assignee === selectedAssignee;
      const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;
      const matchesStatus = selectedStatus === 'All' || task.status === selectedStatus;

      return matchesSearch && matchesAssignee && matchesPriority && matchesStatus;
    });
  }, [tasks, searchQuery, selectedAssignee, selectedPriority, selectedStatus]);

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
            <span className="font-semibold text-slate-900">Tasks</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Tasks Management</h1>
        </div>

        {/* Action Controls & View Toggle Bar */}
        <div className="flex items-center gap-3">
          {/* List / Kanban / Calendar Toggle Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Kanban
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" /> Calendar
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        
        {/* Filters Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            
            {/* Filter by Assignee */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Assignee:</label>
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer"
              >
                {assigneesList.map((a, i) => (
                  <option key={i} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Filter by Priority */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Priority:</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer capitalize"
              >
                <option value="All">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
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
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="under_review">Under Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search title, assignee, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-600 shadow-sm"
            />
          </div>
        </div>

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Task Title</th>
                  <th className="py-3.5 px-4">Assignee</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Attachment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">{task.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex flex-col">
                          <span>{task.title}</span>
                          {task.milestone && (
                            <span className="text-[11px] text-slate-500 font-normal mt-0.5">
                              Milestone: {task.milestone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">{task.assignee}</td>
                      <td className="py-3.5 px-4">
                        {task.priority === 'low' && (
                          <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-semibold">Low</span>
                        )}
                        {task.priority === 'medium' && (
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-semibold">Medium</span>
                        )}
                        {task.priority === 'high' && (
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">High</span>
                        )}
                        {task.priority === 'critical' && (
                          <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-semibold">Critical</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">
                        {task.due_at.replace('T', ' ')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-800">
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {task.hasAttachment ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-50 text-blue-600 rounded-lg">
                            <Paperclip className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No task entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* KANBAN VIEW */}
        {viewMode === 'kanban' && (
          <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50/50">
            {(['todo', 'in_progress', 'under_review', 'completed'] as const).map((statusCol) => (
              <div key={statusCol} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">{statusCol.replace('_', ' ')}</h3>
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {filteredTasks.filter(t => t.status === statusCol).length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {filteredTasks.filter(t => t.status === statusCol).map((task) => (
                    <div key={task.id} className="border border-slate-200 rounded-xl p-3 bg-white hover:border-blue-600 transition-all shadow-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-bold text-blue-600">{task.id}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-500">{task.priority}</span>
                      </div>
                      <p className="font-semibold text-slate-900 text-sm mb-2">{task.title}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <span>{task.assignee}</span>
                        <span>{task.due_at.split('T')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CALENDAR VIEW (Simple Timeline representation) */}
        {viewMode === 'calendar' && (
          <div className="p-8 text-center text-slate-500">
            <CalendarIcon className="w-10 h-10 text-blue-600 mx-auto mb-2" />
            <p className="font-bold text-slate-800">Calendar Timeline Mode Enabled</p>
            <p className="text-sm text-slate-500 mt-1">Showing upcoming task deadlines for October 2026.</p>
          </div>
        )}

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredTasks.length} of {tasks.length} task items</span>
          <span>Project Tasks Module v03.05</span>
        </div>

      </div>

      {/* POST Form Modal (/projects/:uuid/tasks/create) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Create Task (/projects/:uuid/tasks/create)</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* Task Title */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Title (title*) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inspect Rebar Spacing"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Milestone */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Milestone (milestone S)</label>
                <select
                  value={formData.milestone}
                  onChange={(e) => setFormData({ ...formData, milestone: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                >
                  <option value="Ground Floor Column & Slab Casting">Ground Floor Column & Slab Casting</option>
                  <option value="Basement Concrete Mat Foundation Cast">Basement Concrete Mat Foundation Cast</option>
                  <option value="Site Excavation & Soil Piling Completed">Site Excavation & Soil Piling Completed</option>
                  <option value="Electrical Conduit & Pipe Laying Phase 1">Electrical Conduit & Pipe Laying Phase 1</option>
                </select>
              </div>

              {/* Assignee & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Assignee (assignee*) *</label>
                  <input
                    type="text"
                    required
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Priority (priority*) *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm capitalize"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Due DateTime */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Due Date & Time (due_at*) *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.due_at}
                  onChange={(e) => setFormData({ ...formData, due_at: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Reminder Before N(minutes) */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Reminder Before (minutes)</label>
                <input
                  type="number"
                  placeholder="30"
                  value={formData.reminder_before}
                  onChange={(e) => setFormData({ ...formData, reminder_before: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Description TA(rich) */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Description (description TA)</label>
                <textarea
                  rows={3}
                  placeholder="Task instructions and requirements..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              {/* Attachments F */}
              <div className="flex items-center pt-2">
                <label className="relative flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasAttachment}
                    onChange={(e) => setFormData({ ...formData, hasAttachment: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-slate-400" /> Upload Supporting Attachment
                  </span>
                </label>
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
                  Save Task
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}