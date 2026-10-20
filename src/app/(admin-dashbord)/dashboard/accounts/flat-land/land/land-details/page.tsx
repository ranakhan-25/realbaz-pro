'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Search, 
  X, 
  Edit 
} from 'lucide-react';

interface LandItem {
  id: string;
  sl: number;
  project: string;
  blockName: string;
  roadNo: string;
  site: string;
  plotLocation?: string;
  plotNo: string;
  size: number;
  unit: string;
  price: number;
  subtotal: number;
  grandTotal: number;
  customer: string;
  status: 'Sold' | 'Unsold' | 'Active';
  facing?: string;
  amenities?: string;
}

export default function LandPage() {
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentLand, setCurrentLand] = useState<LandItem | null>(null);

  // Filter States
  const [projectFilter, setProjectFilter] = useState('');
  const [siteFilter, setSiteFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState('10');

  // Form Fields State matching the modal images
  const [formProject, setFormProject] = useState('');
  const [formBlockName, setFormBlockName] = useState('');
  const [formRoadNo, setFormRoadNo] = useState('');
  const [formRoadSize, setFormRoadSize] = useState('');
  const [formPlotLocation, setFormPlotLocation] = useState('');
  const [formSite, setFormSite] = useState('');
  const [formPlotNo, setFormPlotNo] = useState('');
  const [formSize, setFormSize] = useState<number>(0);
  const [formUnit, setFormUnit] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formFacing, setFormFacing] = useState('');
  const [formAmenities, setFormAmenities] = useState('');

  // Land Data State (Matching Image)
  const [lands, setLands] = useState<LandItem[]>([
    { id: '1', sl: 1, project: 'Estern 19', blockName: 'B', roadNo: '3/A', site: '', plotNo: '2', size: 8, unit: '1', price: 500000, subtotal: 4000000, grandTotal: 4000000, customer: 'Sagor kumar', status: 'Sold' },
    { id: '2', sl: 2, project: 'Estern 19', blockName: 'B', roadNo: '3/A', site: '', plotNo: '2', size: 8, unit: '1', price: 500000, subtotal: 4000000, grandTotal: 4000000, customer: '', status: 'Unsold' },
    { id: '3', sl: 3, project: 'Estern 19', blockName: 'A', roadNo: '2/A', site: '', plotNo: '56', size: 5, unit: '1', price: 500000, subtotal: 2500000, grandTotal: 2500000, customer: 'Sagor kumar', status: 'Sold' },
  ]);

  // Open Add Modal & Reset Form Fields
  const handleOpenAddModal = () => {
    setFormProject('Estern 19');
    setFormBlockName('');
    setFormRoadNo('');
    setFormRoadSize('');
    setFormPlotLocation('');
    setFormSite('');
    setFormPlotNo('');
    setFormSize(0);
    setFormUnit('1');
    setFormPrice(0);
    setFormFacing('');
    setFormAmenities('');
    setIsAddModalOpen(true);
  };

  // Handle Edit Click to populate modal data
  const handleEditClick = (land: LandItem) => {
    setCurrentLand(land);
    setFormProject(land.project);
    setFormBlockName(land.blockName);
    setFormRoadNo(land.roadNo);
    setFormRoadSize('');
    setFormPlotLocation(land.plotLocation || '');
    setFormSite(land.site || '');
    setFormPlotNo(land.plotNo);
    setFormSize(land.size);
    setFormUnit(land.unit);
    setFormPrice(land.price);
    setFormFacing(land.facing || '');
    setFormAmenities(land.amenities || '');
    setIsEditModalOpen(true);
  };

  // Filtered Lands
  const filteredLands = lands.filter(l => {
    const matchesProject = projectFilter ? l.project.toLowerCase().includes(projectFilter.toLowerCase()) : true;
    const matchesStatus = statusFilter ? l.status.toLowerCase() === statusFilter.toLowerCase() : true;
    const matchesSearch = searchQuery 
      ? l.plotNo.toLowerCase().includes(searchQuery.toLowerCase()) || l.project.toLowerCase().includes(searchQuery.toLowerCase()) || l.customer.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesProject && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800">
      
      {/* ================= BREADCRUMB HEADER ================= */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-slate-600 space-x-2">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="hover:text-blue-600 cursor-pointer">Land</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-800">Land</span>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-4 py-2 rounded flex items-center shadow transition"
        >
          +Land Add
        </button>
      </div>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="bg-white rounded-md shadow-sm border border-slate-200 p-5 space-y-4">
        
        {/* Top Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-slate-100 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Project</label>
            <select 
              value={projectFilter} 
              onChange={(e) => setProjectFilter(e.target.value)} 
              className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="">Select value</option>
              <option value="Estern 19">Estern 19</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Site</label>
            <input 
              type="text" 
              placeholder="Select Site"
              value={siteFilter} 
              onChange={(e) => setSiteFilter(e.target.value)} 
              className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-xs focus:outline-none focus:border-purple-500" 
            />
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Status</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="">Select Status</option>
              <option value="Sold">Sold</option>
              <option value="Unsold">Unsold</option>
            </select>
          </div>
        </div>

        {/* Action Controls & Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <div className="flex items-center space-x-2">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-medium transition shadow-sm">Excel</button>
            <button className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded text-xs font-medium transition shadow-sm">PDF</button>
            <div className="flex items-center text-xs text-slate-600 space-x-1 ml-2">
              <span>Show</span>
              <select 
                value={entries} 
                onChange={(e) => setEntries(e.target.value)}
                className="border border-slate-300 rounded px-2 py-1 bg-white text-xs"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-600">Search:</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-slate-300 rounded px-3 py-1 text-xs w-full sm:w-48 focus:outline-none focus:border-purple-500" 
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-purple-300 rounded">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#6b58e8] text-white text-[11px] font-semibold uppercase tracking-wider">
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">SL</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">PROJECT</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">BLOCK NAME</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">ROAD NO.</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">SITE</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">PLOT NO</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">SIZE</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">UNIT</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">PRICE</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">SUBTOTAL</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">GRAND TOTAL</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">CUSTOMER</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">STATUS</th>
                <th className="p-2.5 whitespace-nowrap text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-700">
              {filteredLands.length === 0 ? (
                <tr>
                  <td colSpan={14} className="text-center py-8 text-slate-400 italic bg-slate-50">
                    No data available in table
                  </td>
                </tr>
              ) : (
                filteredLands.map((land) => (
                  <tr key={land.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-2.5 border-r">{land.sl}</td>
                    <td className="p-2.5 border-r font-medium">{land.project}</td>
                    <td className="p-2.5 border-r">{land.blockName}</td>
                    <td className="p-2.5 border-r">{land.roadNo}</td>
                    <td className="p-2.5 border-r">{land.site}</td>
                    <td className="p-2.5 border-r text-blue-600 font-medium cursor-pointer hover:underline">{land.plotNo}</td>
                    <td className="p-2.5 border-r">{land.size}</td>
                    <td className="p-2.5 border-r">{land.unit}</td>
                    <td className="p-2.5 border-r">{land.price}</td>
                    <td className="p-2.5 border-r">{land.subtotal}</td>
                    <td className="p-2.5 border-r font-semibold">{land.grandTotal}</td>
                    <td className="p-2.5 border-r">{land.customer}</td>
                    <td className="p-2.5 border-r">
                      <span className={`px-2.5 py-1 rounded text-white text-[10px] font-semibold ${land.status === 'Sold' ? 'bg-blue-600' : 'bg-rose-500'}`}>
                        {land.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      <button 
                        onClick={() => handleEditClick(land)} 
                        className="bg-sky-400 hover:bg-sky-500 text-white p-1.5 rounded shadow-sm transition"
                        title="Edit Land"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>Showing 1 to {filteredLands.length} of {filteredLands.length} entries</span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-slate-100 rounded text-slate-400 cursor-not-allowed" disabled>Previous</button>
            <button className="px-3 py-1 bg-purple-600 text-white rounded font-medium">1</button>
            <button className="px-3 py-1 bg-slate-100 rounded text-slate-600 hover:bg-slate-200">Next</button>
          </div>
        </div>

      </div>

      {/* ================= MODAL: LAND ADD FORM ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl border border-slate-300 overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-white">
              <h3 className="font-bold text-sm text-slate-800">Land Add</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:bg-slate-100 p-1.5 rounded border border-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form Grid */}
            <div className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Project */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Project <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    value={formProject} 
                    onChange={(e) => setFormProject(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500" 
                  />
                </div>

                {/* Block Name */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Block Name <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="B"
                      value={formBlockName} 
                      onChange={(e) => setFormBlockName(e.target.value)} 
                      className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 pr-12" 
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-slate-400">
                      <X className="w-3.5 h-3.5 cursor-pointer hover:text-slate-600" onClick={() => setFormBlockName('')} />
                      <span>▼</span>
                    </div>
                  </div>
                </div>

                {/* Road No */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Road No. <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="3/A"
                      value={formRoadNo} 
                      onChange={(e) => setFormRoadNo(e.target.value)} 
                      className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 pr-12" 
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-slate-400">
                      <X className="w-3.5 h-3.5 cursor-pointer hover:text-slate-600" onClick={() => setFormRoadNo('')} />
                      <span>▼</span>
                    </div>
                  </div>
                </div>

                {/* Road Size */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Road Size</label>
                  <input 
                    type="text" 
                    placeholder="Road Size"
                    value={formRoadSize} 
                    onChange={(e) => setFormRoadSize(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400" 
                  />
                </div>

                {/* Plot Location */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Plot Location</label>
                  <input 
                    type="text" 
                    placeholder="Plot Location"
                    value={formPlotLocation} 
                    onChange={(e) => setFormPlotLocation(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400" 
                  />
                </div>

                {/* Site */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Site</label>
                  <input 
                    type="text" 
                    placeholder="Select Site"
                    value={formSite} 
                    onChange={(e) => setFormSite(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500" 
                  />
                </div>

                {/* Plot No */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Plot No</label>
                  <input 
                    type="text" 
                    placeholder="2"
                    value={formPlotNo} 
                    onChange={(e) => setFormPlotNo(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500" 
                  />
                </div>

                {/* Size */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Size</label>
                  <input 
                    type="number" 
                    placeholder="8"
                    value={formSize} 
                    onChange={(e) => setFormSize(Number(e.target.value))} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500" 
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Unit</label>
                  <input 
                    type="text" 
                    placeholder="1"
                    value={formUnit} 
                    onChange={(e) => setFormUnit(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500" 
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Price</label>
                  <input 
                    type="number" 
                    placeholder="500000"
                    value={formPrice} 
                    onChange={(e) => setFormPrice(Number(e.target.value))} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500" 
                  />
                </div>

                {/* Facing */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Facing</label>
                  <input 
                    type="text" 
                    placeholder="Facing"
                    value={formFacing} 
                    onChange={(e) => setFormFacing(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400" 
                  />
                </div>

                {/* Amenities */}
                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Amenities</label>
                  <textarea 
                    rows={3}
                    placeholder="Amenities"
                    value={formAmenities} 
                    onChange={(e) => setFormAmenities(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400"
                  ></textarea>
                </div>

              </div>
            </div>

            {/* Modal Footer Buttons */}
            <div className="bg-white px-6 py-3 border-t border-slate-200 flex justify-end space-x-2">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="bg-slate-500 hover:bg-slate-600 text-white font-medium px-4 py-2 rounded text-xs transition"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  if(!formPlotNo) { alert('Please enter plot number'); return; }
                  const newLand: LandItem = {
                    id: Date.now().toString(),
                    sl: lands.length + 1,
                    project: formProject || 'Estern 19',
                    blockName: formBlockName || 'N/A',
                    roadNo: formRoadNo || 'N/A',
                    site: formSite || '',
                    plotLocation: formPlotLocation,
                    plotNo: formPlotNo,
                    size: formSize || 0,
                    unit: formUnit || '1',
                    price: formPrice || 0,
                    subtotal: (formSize || 0) * (formPrice || 0),
                    grandTotal: (formSize || 0) * (formPrice || 0),
                    customer: '',
                    status: 'Unsold',
                    facing: formFacing,
                    amenities: formAmenities
                  };
                  setLands([...lands, newLand]);
                  setIsAddModalOpen(false);
                  alert('Land Added Successfully!');
                }} 
                className="bg-[#6b58e8] hover:bg-purple-700 text-white font-medium px-5 py-2 rounded text-xs shadow transition"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL: LAND EDIT FORM ================= */}
      {isEditModalOpen && currentLand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl border border-slate-300 overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-white">
              <h3 className="font-bold text-sm text-slate-800">Land Edit</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:bg-slate-100 p-1.5 rounded border border-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form Grid */}
            <div className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Project */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Project <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    value={formProject} 
                    onChange={(e) => setFormProject(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500" 
                  />
                </div>

                {/* Block Name */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Block Name <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formBlockName} 
                      onChange={(e) => setFormBlockName(e.target.value)} 
                      className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 pr-12" 
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-slate-400">
                      <X className="w-3.5 h-3.5 cursor-pointer hover:text-slate-600" onClick={() => setFormBlockName('')} />
                      <span>▼</span>
                    </div>
                  </div>
                </div>

                {/* Road No */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Road No. <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formRoadNo} 
                      onChange={(e) => setFormRoadNo(e.target.value)} 
                      className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 pr-12" 
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-slate-400">
                      <X className="w-3.5 h-3.5 cursor-pointer hover:text-slate-600" onClick={() => setFormRoadNo('')} />
                      <span>▼</span>
                    </div>
                  </div>
                </div>

                {/* Road Size */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Road Size</label>
                  <input 
                    type="text" 
                    placeholder="Road Size"
                    value={formRoadSize} 
                    onChange={(e) => setFormRoadSize(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400" 
                  />
                </div>

                {/* Plot Location */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Plot Location</label>
                  <input 
                    type="text" 
                    placeholder="Plot Location"
                    value={formPlotLocation} 
                    onChange={(e) => setFormPlotLocation(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400" 
                  />
                </div>

                {/* Site */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Site</label>
                  <input 
                    type="text" 
                    placeholder="Select Site"
                    value={formSite} 
                    onChange={(e) => setFormSite(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500" 
                  />
                </div>

                {/* Plot No */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Plot No</label>
                  <input 
                    type="text" 
                    value={formPlotNo} 
                    onChange={(e) => setFormPlotNo(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500" 
                  />
                </div>

                {/* Size */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Size</label>
                  <input 
                    type="number" 
                    value={formSize} 
                    onChange={(e) => setFormSize(Number(e.target.value))} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500" 
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Unit</label>
                  <input 
                    type="text" 
                    value={formUnit} 
                    onChange={(e) => setFormUnit(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500" 
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Price</label>
                  <input 
                    type="number" 
                    value={formPrice} 
                    onChange={(e) => setFormPrice(Number(e.target.value))} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500" 
                  />
                </div>

                {/* Facing */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Facing</label>
                  <input 
                    type="text" 
                    placeholder="Facing"
                    value={formFacing} 
                    onChange={(e) => setFormFacing(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400" 
                  />
                </div>

                {/* Amenities */}
                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Amenities</label>
                  <textarea 
                    rows={3}
                    placeholder="Amenities"
                    value={formAmenities} 
                    onChange={(e) => setFormAmenities(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400"
                  ></textarea>
                </div>

              </div>
            </div>

            {/* Modal Footer Buttons */}
            <div className="bg-white px-6 py-3 border-t border-slate-200 flex justify-end space-x-2">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="bg-slate-500 hover:bg-slate-600 text-white font-medium px-4 py-2 rounded text-xs transition"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setLands(lands.map(l => l.id === currentLand.id ? { 
                    ...l, 
                    project: formProject, 
                    blockName: formBlockName, 
                    roadNo: formRoadNo, 
                    site: formSite, 
                    plotLocation: formPlotLocation, 
                    plotNo: formPlotNo, 
                    size: formSize, 
                    unit: formUnit, 
                    price: formPrice, 
                    subtotal: formSize * formPrice,
                    grandTotal: formSize * formPrice,
                    facing: formFacing, 
                    amenities: formAmenities 
                  } : l));
                  alert('Land Updated Successfully!');
                  setIsEditModalOpen(false);
                }} 
                className="bg-[#6b58e8] hover:bg-purple-700 text-white font-medium px-5 py-2 rounded text-xs shadow transition"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}