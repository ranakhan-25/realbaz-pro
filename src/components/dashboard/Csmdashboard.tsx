'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  Package, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  FileText, 
  CheckCircle2, 
  DollarSign, 
  ArrowUpRight, 
  Plus, 
  Layers,
  Wrench,
  Truck
} from 'lucide-react';

export default function ConstructionDashboard() {
  // Stat Summary Cards Data
  const stats = [
    { label: 'Active Work Packages', value: '12', change: '+2 this month', icon: Layers, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { label: 'Total Deployed Labour', value: '148', change: '9 active sites', icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { label: 'Material Consumption (MT)', value: '1,240', change: '+12% vs last week', icon: Truck, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { label: 'Safety & Quality Score', value: '94.5%', change: 'Zero critical incidents', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  ];

  // Quick Navigation Modules
  const modules = [
    { title: 'Work Packages', desc: 'Manage project phases & milestones', route: '/dashboard/csm/work-packages', icon: Layers, count: '12 Active' },
    { title: 'BOQ & Revisions', desc: 'Bill of quantities & sections editor', route: '/dashboard/csm/boq', icon: FileText, count: '48 Items' },
    { title: 'Daily Site Reports', desc: 'DSR logs, weather & site notes', route: '/dashboard/csm/daily-site-reports', icon: Clock, count: 'Today Logged' },
    { title: 'Progress Measurement', desc: 'Field measurements & certified qty', route: '/dashboard/csm/progress-measurement', icon: TrendingUp, count: '68% Avg' },
    { title: 'Contractors & Subs', desc: 'Subcontractor directory & ratings', route: '/dashboard/csm/contractor-management', icon: Building2, count: '8 Agencies' },
    { title: 'Labour Directory', desc: 'NID, trades & daily wage rates', route: '/dashboard/csm/labour-management', icon: Users, count: '148 Workers' },
    { title: 'Material Consumption', desc: 'Challans, cement & steel tracking', route: '/dashboard/csm/material-consumption', icon: Package, count: 'Tracked Daily' },
    { title: 'Quality & Safety', desc: 'Inspection checklists & hazards', route: '/dashboard/csm/quality-inspection', icon: ShieldCheck, count: '98% Pass' },
    { title: 'Issues & Punch List', desc: 'Non-conformance, tags & assignees', route: '/dashboard/csm/site-issues', icon: AlertTriangle, count: '3 Open' },
    { title: 'Schedule Delays', desc: 'Weather/material delay logs', route: '/dashboard/csm/delay-tracking', icon: Clock, count: '2 Logged' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans text-slate-800">
      
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Enterprise Construction Management System v2.4
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome back, Engr. Shamim Khan 👋</h1>
            <p className="text-slate-300 text-sm max-w-2xl">
              Here is your real-time site execution summary across Skyline City Tower Phase 1 and Lakeside Commercial Park. All modules are operating smoothly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard/csm/daily-site-reports" 
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New DSR Entry
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <div className={`p-2.5 rounded-xl border ${stat.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-mono mb-1">{stat.value}</div>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Modules Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">System Modules & Operations</h2>
          <span className="text-xs text-slate-500 font-medium">10 Core Modules Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <Link 
                key={idx} 
                href={mod.route}
                className="group bg-white border border-slate-200/80 hover:border-blue-500/50 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-slate-50 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-600 rounded-xl transition-colors border border-slate-100">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-800 px-2.5 py-1 rounded-full transition-colors">
                      {mod.count}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 text-sm mb-1 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {mod.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Access Module</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Quick Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Site Issues */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Critical Site Issues & Open Punch Items</h3>
            <Link href="/dashboard/csm/site-issues" className="text-xs font-semibold text-blue-600 hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Reinforcement Steel Rebar Spacing Deviation at 8th Floor</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Skyline City Tower Phase 1 • Assigned to Engr. Shamim Khan</p>
                </div>
              </div>
              <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                Critical
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-amber-50/50 border border-amber-100 rounded-xl">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Water Seepage in Basement Level 2 Concrete Retaining Wall</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Skyline City Tower Phase 1 • Assigned to Engr. Tanvir Hossain</p>
                </div>
              </div>
              <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                High
              </span>
            </div>
          </div>
        </div>

        {/* Quick System Info */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Project Health Status</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Foundation & Substructure</span>
                <span className="text-blue-600 font-mono">100%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-full rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Superstructure (Floors 1-15)</span>
                <span className="text-blue-600 font-mono">68%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[68%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">MEP & Plumbing Installations</span>
                <span className="text-blue-600 font-mono">42%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[42%] rounded-full"></div>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-emerald-800">
                  All safety audits passed for the currented billing cycles.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}