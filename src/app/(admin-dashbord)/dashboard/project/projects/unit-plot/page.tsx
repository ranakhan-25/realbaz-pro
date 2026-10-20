'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Search, 
  List, 
  Grid, 
  Upload, 
  Edit3, 
  CheckCircle2, 
  X, 
  DollarSign, 
  Home as UnitIcon 
} from 'lucide-react';

interface ProjectUnit {
  id: string;
  floorUuid: string;
  code: string; // T(uniq)
  type: '1BHK' | '2BHK' | '3BHK' | 'office' | 'shop' | 'plot';
  size_sqft: number; // N(>0)
  facing: 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';
  price: number; // MONEY(>=0)
  floor_rise: number; // MONEY
  premium: number; // MONEY
  amenities: string[]; // MS
  notes?: string; // TA
  images?: string[]; // F(multiple)
  status: 'available' | 'booked' | 'sold' | 'reserved' | 'blocked';
}

const initialUnits: ProjectUnit[] = [
  {
    id: 'UNT-001',
    floorUuid: 'FLR-003',
    code: 'A-301',
    type: '3BHK',
    size_sqft: 1850,
    facing: 'SE',
    price: 185000.00,
    floor_rise: 2500.00,
    premium: 5000.00,
    amenities: ['Corner View', 'Balcony', 'Parking'],
    notes: 'South-East facing luxury apartment with lake view.',
    status: 'available'
  },
  {
    id: 'UNT-002',
    floorUuid: 'FLR-003',
    code: 'A-302',
    type: '2BHK',
    size_sqft: 1250,
    facing: 'N',
    price: 125000.00,
    floor_rise: 2500.00,
    premium: 0,
    amenities: ['Balcony'],
    notes: 'Standard 2BHK layout.',
    status: 'booked'
  },
  {
    id: 'UNT-003',
    floorUuid: 'FLR-003',
    code: 'A-303',
    type: 'office',
    size_sqft: 2400,
    facing: 'E',
    price: 290000.00,
    floor_rise: 3000.00,
    premium: 8000.00,
    amenities: ['Central HVAC', 'Elevator Proximity'],
    notes: 'Commercial open office space.',
    status: 'sold'
  }
];

export default function UnitsListPage() {
  const [units, setUnits] = useState<ProjectUnit[]>(initialUnits);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [facingFilter, setFacingFilter] = useState('All');

  // POST Modal (/projects/floors/:uuid/units/create)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: '3BHK' as ProjectUnit['type'],
    size_sqft: '',
    facing: 'SE' as ProjectUnit['facing'],
    price: '',
    floor_rise: '0',
    premium: '0',
    amenities: '',
    notes: '',
    status: 'available' as ProjectUnit['status']
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUnit: ProjectUnit = {
      id: `UNT-00${units.length + 1}`,
      floorUuid: 'FLR-003',
      code: formData.code || `U-${Math.floor(100 + Math.random() * 900)}`,
      type: formData.type,
      size_sqft: parseFloat(formData.size_sqft) || 0,
      facing: formData.facing,
      price: parseFloat(formData.price) || 0,
      floor_rise: parseFloat(formData.floor_rise) || 0,
      premium: parseFloat(formData.premium) || 0,
      amenities: formData.amenities ? formData.amenities.split(',').map(s => s.trim()) : [],
      notes: formData.notes,
      status: formData.status
    };

    setUnits([newUnit, ...units]);
    setIsModalOpen(false);
    setFormData({
      code: '',
      type: '3BHK',
      size_sqft: '',
      facing: 'SE',
      price: '',
      floor_rise: '0',
      premium: '0',
      amenities: '',
      notes: '',
      status: 'available'
    });
  };

  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      const matchesSearch = 
        u.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'All' || u.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
      const matchesFacing = facingFilter === 'All' || u.facing === facingFilter;
      return matchesSearch && matchesType && matchesStatus && matchesFacing;
    });
  }, [units, searchQuery, typeFilter, statusFilter, facingFilter]);

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
            <span className="hover:text-blue-600 cursor-pointer">Floors</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900">Units</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Floor Units Directory & Inventory</h1>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> Grid
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Create Unit Form
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        {/* Filters Bar & Bulk Action Controls */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Filter Type */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Type:</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm capitalize"
              >
                <option value="All">All Types</option>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="office">Office</option>
                <option value="shop">Shop</option>
                <option value="plot">Plot</option>
              </select>
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm capitalize"
              >
                <option value="All">All Statuses</option>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="sold">Sold</option>
                <option value="reserved">Reserved</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            {/* Filter Facing */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Facing:</label>
              <select
                value={facingFilter}
                onChange={(e) => setFacingFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 shadow-sm uppercase"
              >
                <option value="All">All Facings</option>
                <option value="N">North (N)</option>
                <option value="S">South (S)</option>
                <option value="E">East (E)</option>
                <option value="W">West (W)</option>
                <option value="NE">NE</option>
                <option value="NW">NW</option>
                <option value="SE">SE</option>
                <option value="SW">SW</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions & Search */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-xl shadow-sm inline-flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-slate-500" /> Import CSV
            </button>
            <button className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-xl shadow-sm inline-flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Batch Edit
            </button>

            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search unit code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-600 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Size (sqft)</th>
                  <th className="py-3.5 px-4">Facing</th>
                  <th className="py-3.5 px-4">Base Price</th>
                  <th className="py-3.5 px-4">Floor Rise & Premium</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUnits.length > 0 ? (
                  filteredUnits.map((unit) => (
                    <tr key={unit.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{unit.code}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 uppercase">{unit.type}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{unit.size_sqft} sqft</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{unit.facing}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">${unit.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3.5 px-4 text-slate-600 text-xs font-mono">
                        Rise: +${unit.floor_rise} | Prem: +${unit.premium}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 border px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          unit.status === 'available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          unit.status === 'booked' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {unit.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No units found matching selection.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/50">
            {filteredUnits.map((unit) => (
              <div key={unit.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-blue-600 transition-all">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                  <span className="font-mono font-bold text-lg text-blue-600">{unit.code}</span>
                  <span className={`border px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                    unit.status === 'available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {unit.status}
                  </span>
                </div>
                
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Unit Type:</span>
                    <span className="font-bold text-slate-900 uppercase">{unit.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Footprint Size:</span>
                    <span className="font-bold text-slate-900">{unit.size_sqft} sqft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Orientation Facing:</span>
                    <span className="font-mono font-bold text-slate-800">{unit.facing}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-sm text-slate-900">
                    <span>Base Price:</span>
                    <span className="text-blue-600">${unit.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unit Form Modal (/projects/floors/:uuid/units/create) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Create Unit Form</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Unit Code [code* T(uniq)] *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A-301"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Type [type* S] *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm capitalize"
                  >
                    <option value="1BHK">1BHK</option>
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                    <option value="office">Office</option>
                    <option value="shop">Shop</option>
                    <option value="plot">Plot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Size Sqft [size_sqft* N(&gt;0)] *</label>
                  <input
                    type="number"
                    required
                    placeholder="1850"
                    value={formData.size_sqft}
                    onChange={(e) => setFormData({ ...formData, size_sqft: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Facing [facing S] *</label>
                  <select
                    value={formData.facing}
                    onChange={(e) => setFormData({ ...formData, facing: e.target.value as any })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm uppercase"
                  >
                    <option value="N">North (N)</option>
                    <option value="S">South (S)</option>
                    <option value="E">East (E)</option>
                    <option value="W">West (W)</option>
                    <option value="NE">NE</option>
                    <option value="NW">NW</option>
                    <option value="SE">SE</option>
                    <option value="SW">SW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Base Price [price* MONEY] *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="185000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Floor Rise (MONEY)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="2500"
                    value={formData.floor_rise}
                    onChange={(e) => setFormData({ ...formData, floor_rise: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Premium (MONEY)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="5000"
                    value={formData.premium}
                    onChange={(e) => setFormData({ ...formData, premium: e.target.value })}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Amenities (amenities MS - comma separated)</label>
                <input
                  type="text"
                  placeholder="Corner View, Balcony, Parking"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Unit Notes (notes TA)</label>
                <textarea
                  rows={2}
                  placeholder="Orientation and layout notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 w-full focus:outline-none focus:border-blue-600 shadow-sm"
                />
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
                  Save Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}