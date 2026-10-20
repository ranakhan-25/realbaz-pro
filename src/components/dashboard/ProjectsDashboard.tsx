'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  Home,
  ChevronRight,
  DollarSign,
  PieChart as PieIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Calendar,
  Layers,
  Users,
  Flag,
  AlertCircle,
  TrendingUp,
  FileText,
  Briefcase
} from 'lucide-react';

// --- Static Data for Widgets (Feature 03.01) ---

// Widget 1: Budget vs Actual (Bar Chart Data)
const budgetVsActualData = [
  { category: 'Land & Site Prep', budget: 3500000, actual: 3200000 },
  { category: 'Civil Foundation', budget: 5000000, actual: 4800000 },
  { category: 'Superstructure', budget: 7500000, actual: 6100000 },
  { category: 'MEP Services', budget: 2500000, actual: 1800000 },
  { category: 'Finishing Works', budget: 4000000, actual: 1200000 }
];

// Widget 2: Progress % Donut Chart Data
const progressDonutData = [
  { name: 'Completed', value: 72, color: '#2563eb' }, // blue-600
  { name: 'Remaining', value: 28, color: '#e2e8f0' }  // slate-200
];

// Widget 3: Upcoming Milestones List
const upcomingMilestones = [
  {
    id: 'MLS-003',
    name: 'Ground Floor Column & Slab Casting',
    planned_at: '2026-10-30',
    progress: 65,
    status: 'in_progress'
  },
  {
    id: 'MLS-004',
    name: '5th Floor Structural RCC Frame Setup',
    planned_at: '2026-11-20',
    progress: 0,
    status: 'planned'
  },
  {
    id: 'MLS-005',
    name: 'Electrical Conduit & Pipe Laying Phase 1',
    planned_at: '2026-12-05',
    progress: 25,
    status: 'delayed'
  }
];

// Widget 4: Open Issues List (with Badges)
const openIssues = [
  {
    id: 'ISS-101',
    title: 'Delay in Ready-Mix Concrete Delivery',
    severity: 'critical',
    assignedTo: 'Shamim Khan',
    date: '2026-10-18'
  },
  {
    id: 'ISS-102',
    title: 'Soil Moisture Test Anomaly on Sector B',
    severity: 'high',
    assignedTo: 'Tanvir Ahmed',
    date: '2026-10-19'
  },
  {
    id: 'ISS-103',
    title: 'Vendor Invoice Discrepancy (Steel Rebar)',
    severity: 'medium',
    assignedTo: 'Rahim Uddin',
    date: '2026-10-20'
  }
];

// Widget 5: Team Members (Avatars)
const teamMembers = [
  { id: 'usr-1', name: 'Shamim Khan', role: 'Project Director', avatar: 'SK', bg: 'bg-blue-600' },
  { id: 'usr-2', name: 'Tanvir Ahmed', role: 'Lead Civil Engineer', avatar: 'TA', bg: 'bg-emerald-600' },
  { id: 'usr-3', name: 'Rahim Uddin', role: 'Site Manager', avatar: 'RU', bg: 'bg-indigo-600' },
  { id: 'usr-4', name: 'Sufia Kamal', role: 'QS & Cost Estimator', avatar: 'SK', bg: 'bg-amber-600' },
  { id: 'usr-5', name: 'Arif Hasan', role: 'Safety Inspector', avatar: 'AH', bg: 'bg-rose-600' }
];

export default function ProjectDashboardPage() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8 font-sans text-slate-800">
      
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <nav className="flex items-center text-sm text-slate-500 space-x-2 mb-1">
            <Link href="/projects" className="flex items-center hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4 mr-1 text-slate-600" /> Projects
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-mono text-slate-600">PROJ-SKYLINE-001</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900">Dashboard</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Skyline City Tower Phase 1
          </h1>
        </div>
      </div>

      {/* PROJECT HEADER CARD (Code + Status + Progress Ring + Actions) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 w-full md:w-auto">
          {/* Progress Ring Simulation */}
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center bg-blue-50 rounded-full border-4 border-blue-600 shadow-inner">
            <span className="text-xl font-extrabold text-blue-600">72%</span>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                PROJ-SKYLINE-001
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold capitalize">
                Active
              </span>
              <span className="text-xs text-slate-500 font-medium">Type: Residential Commercial</span>
            </div>
            <p className="text-sm font-semibold text-slate-800">Site: Uttara Sector 11 Plot Ground</p>
            <p className="text-xs text-slate-500 mt-0.5">Manager: Shamim Khan | Timeline: Jan 2026 - Dec 2027</p>
          </div>
        </div>

        {/* Header KPI Snapshot */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end text-right">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Budget</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">$22,500,000</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actual Cost</p>
            <p className="text-xl font-bold text-blue-600 mt-0.5">$17,100,000</p>
          </div>
        </div>
      </div>

      {/* DETAIL TABS NAVIGATION */}
      <div className="flex items-center border-b border-slate-200 gap-2 overflow-x-auto text-xs font-semibold mb-6 bg-white p-2 rounded-xl border">
        {[
          'Dashboard',
          'Overview',
          'Sites',
          'Buildings',
          'Units',
          'Parties',
          'Agreements',
          'Milestones',
          'Tasks',
          'Budget',
          'Cost',
          'Progress',
          'Documents'
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* WIDGETS GRID SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* WIDGET 1: Budget vs Actual (Bar Chart) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Budget vs Actual Spend</h3>
              <p className="text-xs text-slate-500">Breakdown across main work packages</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-600 rounded-sm"></span> Budget</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded-sm"></span> Actual</span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetVsActualData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickFormatter={(v) => `$${v / 1000000}M`} />
                <Tooltip 
                  formatter={(val) => [`$${typeof val === 'number' ? val.toLocaleString() : val ?? ''}`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="budget" name="Budget" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="actual" name="Actual" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* WIDGET 2: Progress % (Donut Chart) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Overall Project Progress</h3>
            <p className="text-xs text-slate-500">Cumulative completion score</p>
          </div>

          <div className="h-52 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={progressDonutData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {progressDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val ?? ''}%`, 'Weight']} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Donut Label */}
            <div className="absolute text-center">
              <span className="text-3xl font-extrabold text-blue-600">72%</span>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Completed</p>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Target Deadline:</span>
            <span className="font-bold text-slate-900">Dec 31, 2027</span>
          </div>
        </div>

        {/* WIDGET 3: Upcoming Milestones (List) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">Upcoming Milestones</h3>
            </div>
            <Link href="/projects/milestones" className="text-xs font-bold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingMilestones.map((m) => (
              <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600">{m.id}</span>
                    <span className="font-semibold text-slate-900 text-sm">{m.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Due: {m.planned_at}
                  </p>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                    m.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    m.status === 'delayed' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {m.status.replace('_', ' ')}
                  </span>
                  <p className="text-xs font-mono font-bold text-slate-700 mt-1">{m.progress}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WIDGET 4: Open Issues (Badges) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <h3 className="font-bold text-slate-900 text-base">Open Issues</h3>
            </div>
            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
              3 Active
            </span>
          </div>

          <div className="space-y-3">
            {openIssues.map((issue) => (
              <div key={issue.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{issue.id}</span>
                    <span className="font-semibold text-slate-900 text-sm">{issue.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Assigned: <strong className="text-slate-700">{issue.assignedTo}</strong> | {issue.date}
                  </p>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                  issue.severity === 'critical' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  issue.severity === 'high' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {issue.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* WIDGET 5: Project Team Members (Avatars) */}
        <div className="lg:col-span-12 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">Project Team Members</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">{teamMembers.length} Assigned Members</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${member.bg} text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  {member.avatar}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-slate-900 text-xs truncate">{member.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer info */}
      <div className="mt-8 text-center text-xs text-slate-400">
        Feature 03.01 · Project Master Executive Dashboard v1.0
      </div>

    </div>
  );
}
