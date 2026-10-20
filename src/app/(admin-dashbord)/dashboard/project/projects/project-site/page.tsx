'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  MapPin, 
  Building2, 
  Maximize2, 
  Globe, 
  X, 
  CheckCircle2, 
  Clock, 
  Layers 
} from 'lucide-react';

interface ProjectSite {
  id: string;
  name: string;
  address: string;
  geo_lat: number;
  geo_lng: number;
  area_sqft: number;
  buildings_count: number;
  status: 'active' | 'planning' | 'completed' | 'on_hold';
}

const initialSites: ProjectSite[] = [
  {
    id: 'SITE-001',
    name: 'Skyline City Phase 1 Ground',
    address: 'Plot 42, Sector 11, Uttara, Dhaka-1230',
    geo_lat: 23.8759,
    geo_lng: 90.3795,
    area_sqft: 85000,
    buildings_count: 3,
    status: 'active'
  },
  {
    id: 'SITE-002',
    name: 'Lakeside Commercial Park',
    address: 'Block C, Purbachal Expressway, Dhaka',
    geo_lat: 23.8103,
    geo_lng: 90.4125,
    area_sqft: 120000,
    buildings_count: 5,
    status: 'planning'
  },
  {
    id: 'SITE-003',
    name: 'Coastal Logistics Hub',
    address: 'Agrabad Commercial Area, Chittagong',
    geo_lat: 22.3244,
    geo_lng: 91.8130,
    area_sqft: 64000,
    buildings_count: 2,
    status: 'active'
  }
];

export default function SitesListPage() {
  const [sites, setSites] = useState<ProjectSite[]>(initialSites);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    geo_lat: '',
    geo_lng: '',
    area_sqft: '',
    status: 'active' as ProjectSite['status']
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSite: ProjectSite = {
      id: `SITE-00${sites.length + 1}`,
      name: formData.name || 'Untitled Site',
      address: formData.address || 'Address pending',
      geo_lat: parseFloat(formData.geo_lat) || 0,
      geo_lng: parseFloat(formData.geo_lng) || 0,
      area_sqft: parseFloat(formData.area_sqft) || 0,
      buildings_count: 0,
      status: formData.status
    };

    setSites([newSite, ...sites]);
    setIsModalOpen(false);
    setFormData({ name: '', address: '', geo_lat: '', geo_lng: '', area_sqft: '', status: 'active' });
  };

  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      const matchesSearch = 
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || site.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sites, searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8 font-sans text-slate-800">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <nav className="flex items-center text-sm text-slate-500 space-x-2 mb-1">
            <Link href="/projects" className="flex items-center hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4 mr-1 text-slate-600" /> Projects
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900">Sites</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Property Sites Directory</h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Site
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sites</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{sites.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Footprint Area</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {sites.reduce((acc, curr) => acc + curr.area_sqft, 0).toLocaleString()} sqft
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Maximize2 className="w-5 h-5" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Buildings Total</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {sites.reduce((acc, curr) => acc + curr.buildings_count, 0)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 uppercase">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm capitalize"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search site name, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-600 shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Site Code</th>
                <th className="py-3.5 px-4">Site Name</th>
                <th className="py-3.5 px-4">Address</th>
                <th className="py-3.5 px-4">Geo Location (Lat, Lng)</th>
                <th className="py-3.5 px-4">Area (sqft)</th>
                <th className="py-3.5 px-4">Buildings#</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredSites.length > 0 ? (
                filteredSites.map((site) => (
                  <tr key={site.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">{site.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{site.name}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">{site.address}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        {site.geo_lat}, {site.geo_lng}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{site.area_sqft.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{site.buildings_count}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 border px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        site.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        site.status === 'planning' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {site.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link
                        href={`/projects/sites/${site.id}/buildings`}
                        className="text-xs text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        View Buildings <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No sites found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Create New Site</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Site Name (name*) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Skyline City Phase 1 Ground"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Address (address* TA) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Complete postal address..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Latitude [-90..90]</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="23.8759"
                    value={formData.geo_lat}
                    onChange={(e) => setFormData({ ...formData, geo_lat: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Longitude [-180..180]</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="90.3795"
                    value={formData.geo_lng}
                    onChange={(e) => setFormData({ ...formData, geo_lng: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Area (sqft) *</label>
                  <input
                    type="number"
                    required
                    placeholder="85000"
                    value={formData.area_sqft}
                    onChange={(e) => setFormData({ ...formData, area_sqft: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Status (status S) *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm capitalize"
                  >
                    <option value="active">Active</option>
                    <option value="planning">Planning</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm"
                >
                  Save Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}