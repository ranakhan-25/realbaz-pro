'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  Calendar, 
  User, 
  Sun, 
  Cloud, 
  CloudRain, 
  AlertTriangle, 
  Users, 
  Image as ImageIcon,
  FileText,
  ArrowRight
} from 'lucide-react';

interface DailyReportItem {
  id: string;
  report_date: string; // D
  project: string; // S
  engineer: string;
  weather: 'sunny' | 'cloudy' | 'rainy' | 'extreme'; // S
  labour_count: number; // N
  photos_count: number; // photos#
  issues_count: number; // issues#
}

const initialReports: DailyReportItem[] = [
  {
    id: 'dsr-001',
    report_date: '2026-10-18',
    project: 'Skyline City Tower Phase 1',
    engineer: 'Engr. Shamim Khan',
    weather: 'sunny',
    labour_count: 45,
    photos_count: 6,
    issues_count: 1
  },
  {
    id: 'dsr-002',
    report_date: '2026-10-19',
    project: 'Lakeside Commercial Park',
    engineer: 'Engr. Tanvir Hossain',
    weather: 'rainy',
    labour_count: 18,
    photos_count: 3,
    issues_count: 2
  },
  {
    id: 'dsr-003',
    report_date: '2026-10-20',
    project: 'Coastal Logistics Hub',
    engineer: 'Engr. Arifur Rahman',
    weather: 'cloudy',
    labour_count: 32,
    photos_count: 4,
    issues_count: 0
  }
];

export default function DailySiteReportListPage() {
  const [reports, setReports] = useState<DailyReportItem[]>(initialReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeather, setSelectedWeather] = useState('All');

  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const matchesSearch = 
        item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.engineer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.report_date.includes(searchQuery);

      const matchesWeather = selectedWeather === 'All' || item.weather === selectedWeather;

      return matchesSearch && matchesWeather;
    });
  }, [reports, searchQuery, selectedWeather]);

  const stats = useMemo(() => {
    const total = reports.length;
    const totalLabour = reports.reduce((sum, r) => sum + r.labour_count, 0);
    const totalIssues = reports.reduce((sum, r) => sum + r.issues_count, 0);
    return { total, totalLabour, totalIssues };
  }, [reports]);

  const getWeatherIcon = (weather: DailyReportItem['weather']) => {
    switch (weather) {
      case 'sunny':
        return <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold"><Sun className="w-3.5 h-3.5 text-amber-500" /> Sunny</span>;
      case 'cloudy':
        return <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-semibold"><Cloud className="w-3.5 h-3.5 text-slate-500" /> Cloudy</span>;
      case 'rainy':
        return <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-semibold"><CloudRain className="w-3.5 h-3.5 text-blue-500" /> Rainy</span>;
      case 'extreme':
        return <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-semibold"><AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Extreme</span>;
    }
  };

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
            <span className="font-semibold text-slate-900">Daily Site Reports</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Daily Site Reports (DSR)</h1>
        </div>

        <Link
          href="/construction/daily/create"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Create Daily Report
        </Link>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reports</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Site Manpower</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalLabour} Workers</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Site Issues Flagged</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{stats.totalIssues}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        
        {/* Filters & Search */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-xs font-semibold text-slate-500 uppercase">Weather:</label>
            <select
              value={selectedWeather}
              onChange={(e) => setSelectedWeather(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm cursor-pointer capitalize"
            >
              <option value="All">All Weather</option>
              <option value="sunny">Sunny</option>
              <option value="cloudy">Cloudy</option>
              <option value="rainy">Rainy</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search project, engineer, date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-600 shadow-sm"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Report Date</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Site Engineer</th>
                <th className="py-3.5 px-4">Weather</th>
                <th className="py-3.5 px-4">Labour Count</th>
                <th className="py-3.5 px-4">Photos</th>
                <th className="py-3.5 px-4">Issues</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredReports.length > 0 ? (
                filteredReports.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {item.report_date}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.project}</td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {item.engineer}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getWeatherIcon(item.weather)}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {item.labour_count} Persons
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-500" /> {item.photos_count}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.issues_count > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-md">
                          <AlertTriangle className="w-3.5 h-3.5" /> {item.issues_count} Issue(s)
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 px-3 py-1.5 rounded-lg transition-all">
                        View <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No Daily Site Reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing {filteredReports.length} of {reports.length} report entries</span>
          <span>Feature 04.04 · Daily Site Reports</span>
        </div>

      </div>
    </div>
  );
}