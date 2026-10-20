'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Search, 
  X, 
  Edit, 
  Trash2 
} from 'lucide-react';

interface FlatItem {
  id: string;
  sl: number;
  project: string;
  site: string;
  flatLandNo: string;
  unit: string;
  bedroom: string;
  bathroom: string;
  size: number;
  price: number;
  subtotal: number;
  parkingCost: number;
  utilityCharge: number;
  grandTotal: number;
  customer: string;
  status: 'Sold' | 'Unsold' | 'Active';
  drawing?: string;
  dining?: string;
  kitchen?: string;
  balcony?: string;
  parking?: string;
  basement?: string;
  facing?: string;
  amenities?: string;
}

export default function FlatPage() {
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentFlat, setCurrentFlat] = useState<FlatItem | null>(null);

  // Filter States
  const [projectFilter, setProjectFilter] = useState('');
  const [siteFilter, setSiteFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState('10');

  // Form Fields State matching the exact image modal
  const [formProject, setFormProject] = useState('');
  const [formSite, setFormSite] = useState('');
  const [formFlatNo, setFormFlatNo] = useState('');
  const [formSize, setFormSize] = useState<number>(0);
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formBedroom, setFormBedroom] = useState('');
  const [formBathroom, setFormBathroom] = useState('');
  const [formUnit, setFormUnit] = useState('');
  const [formDrawing, setFormDrawing] = useState('');
  const [formDining, setFormDining] = useState('');
  const [formKitchen, setFormKitchen] = useState('');
  const [formBalcony, setFormBalcony] = useState('');
  const [formParking, setFormParking] = useState('');
  const [formParkingCost, setFormParkingCost] = useState<number>(0);
  const [formUtilityCharge, setFormUtilityCharge] = useState<number>(0);
  const [formBasement, setFormBasement] = useState('');
  const [formFacing, setFormFacing] = useState('');
  const [formAmenities, setFormAmenities] = useState('');
  const [formStatus, setFormStatus] = useState('Active');

  // Flat Data State
  const [flats, setFlats] = useState<FlatItem[]>([
    { id: '1', sl: 1, project: 'Sheba Eyecon Tower', site: '', flatLandNo: 'F 4', unit: '', bedroom: '', bathroom: '', size: 1230, price: 60, subtotal: 73800, parkingCost: 0, utilityCharge: 0, grandTotal: 73800, customer: 'Sagor kumar', status: 'Sold' },
    { id: '2', sl: 2, project: 'Sheba Eyecon Tower', site: '', flatLandNo: 'F 4', unit: '', bedroom: '', bathroom: '', size: 1230, price: 60, subtotal: 73800, parkingCost: 0, utilityCharge: 0, grandTotal: 73800, customer: '', status: 'Unsold' },
    { id: '3', sl: 3, project: 'Sheba Eyecon Tower', site: '', flatLandNo: 'F 3', unit: '', bedroom: '', bathroom: '', size: 1150, price: 9500, subtotal: 10925000, parkingCost: 0, utilityCharge: 0, grandTotal: 10925000, customer: 'Sagor kumar', status: 'Sold' },
    { id: '4', sl: 4, project: 'Sheba Eyecon Tower', site: '', flatLandNo: 'F2', unit: '', bedroom: '', bathroom: '', size: 1230, price: 9000, subtotal: 11070000, parkingCost: 300000, utilityCharge: 200000, grandTotal: 11570000, customer: 'Sagor kumar', status: 'Sold' },
    { id: '5', sl: 5, project: 'Sheba Eyecon Tower', site: '', flatLandNo: 'F2', unit: '', bedroom: '', bathroom: '', size: 1230, price: 9000, subtotal: 11070000, parkingCost: 300000, utilityCharge: 200000, grandTotal: 11570000, customer: '', status: 'Unsold' },
    { id: '6', sl: 6, project: 'Lake Garden', site: '', flatLandNo: 'E5', unit: 'E', bedroom: '3', bathroom: '3', size: 1480, price: 6000, subtotal: 8880000, parkingCost: 500000, utilityCharge: 300000, grandTotal: 9680000, customer: 'Abul', status: 'Sold' },
    { id: '7', sl: 7, project: 'Lake Garden', site: '', flatLandNo: 'C-9', unit: 'C', bedroom: '', bathroom: '3', size: 1230, price: 6000, subtotal: 7380000, parkingCost: 800000, utilityCharge: 500000, grandTotal: 8680000, customer: 'Sagor kumar', status: 'Sold' },
    { id: '8', sl: 8, project: 'Lake Garden', site: '', flatLandNo: 'C-9', unit: 'C', bedroom: '', bathroom: '3', size: 1230, price: 6000, subtotal: 7380000, parkingCost: 800000, utilityCharge: 500000, grandTotal: 8680000, customer: '', status: 'Unsold' },
    { id: '9', sl: 9, project: 'Lake Garden', site: '', flatLandNo: 'C-10', unit: 'C', bedroom: '3', bathroom: '3', size: 1560, price: 9000, subtotal: 14040000, parkingCost: 800000, utilityCharge: 500000, grandTotal: 15340000, customer: 'Abc', status: 'Sold' },
    { id: '10', sl: 10, project: 'Lake Garden', site: '', flatLandNo: 'A!', unit: '1', bedroom: '4', bathroom: '3', size: 1200, price: 70000, subtotal: 84000000, parkingCost: 200000, utilityCharge: 0, grandTotal: 84200000, customer: 'Mr. Raju raz', status: 'Sold' },
  ]);

  // Handle Edit Click to populate modal data
  const handleEditClick = (flat: FlatItem) => {
    setCurrentFlat(flat);
    setFormProject(flat.project);
    setFormSite(flat.site || '');
    setFormFlatNo(flat.flatLandNo);
    setFormSize(flat.size);
    setFormPrice(flat.price);
    setFormBedroom(flat.bedroom || '');
    setFormBathroom(flat.bathroom || '');
    setFormUnit(flat.unit || '');
    setFormDrawing(flat.drawing || '');
    setFormDining(flat.dining || '');
    setFormKitchen(flat.kitchen || '');
    setFormBalcony(flat.balcony || '');
    setFormParking(flat.parking || '');
    setFormParkingCost(flat.parkingCost || 0);
    setFormUtilityCharge(flat.utilityCharge || 0);
    setFormBasement(flat.basement || '');
    setFormFacing(flat.facing || '');
    setFormAmenities(flat.amenities || '');
    setFormStatus(flat.status || 'Active');
    setIsEditModalOpen(true);
  };

  // Filtered flats logic
  const filteredFlats = flats.filter(f => {
    const matchesProject = projectFilter ? f.project.toLowerCase().includes(projectFilter.toLowerCase()) : true;
    const matchesStatus = statusFilter ? f.status.toLowerCase() === statusFilter.toLowerCase() : true;
    const matchesSearch = searchQuery 
      ? f.flatLandNo.toLowerCase().includes(searchQuery.toLowerCase()) || f.project.toLowerCase().includes(searchQuery.toLowerCase()) || f.customer.toLowerCase().includes(searchQuery.toLowerCase())
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
          <span className="hover:text-blue-600 cursor-pointer">Flat</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-800">Flat</span>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-4 py-2 rounded flex items-center shadow transition"
        >
          +Flat Add
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
              <option value="Sheba Eyecon Tower">Sheba Eyecon Tower</option>
              <option value="Lake Garden">Lake Garden</option>
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
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">SITE</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">FLAT/LAND NO</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">UNIT</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">BEDROOM</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">BATHROOM</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">SIZE</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">PRICE</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">SUBTOTAL</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">PARKING COST</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">UTILITY CHARGE</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">GRAND TOTAL</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">CUSTOMER</th>
                <th className="p-2.5 border-r border-purple-400 whitespace-nowrap">STATUS</th>
                <th className="p-2.5 whitespace-nowrap text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-700">
              {filteredFlats.length === 0 ? (
                <tr>
                  <td colSpan={16} className="text-center py-8 text-slate-400 italic bg-slate-50">
                    No data available in table
                  </td>
                </tr>
              ) : (
                filteredFlats.map((flat) => (
                  <tr key={flat.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-2.5 border-r">{flat.sl}</td>
                    <td className="p-2.5 border-r font-medium">{flat.project}</td>
                    <td className="p-2.5 border-r">{flat.site}</td>
                    <td className="p-2.5 border-r text-blue-600 font-medium cursor-pointer hover:underline">{flat.flatLandNo}</td>
                    <td className="p-2.5 border-r">{flat.unit}</td>
                    <td className="p-2.5 border-r">{flat.bedroom}</td>
                    <td className="p-2.5 border-r">{flat.bathroom}</td>
                    <td className="p-2.5 border-r">{flat.size}</td>
                    <td className="p-2.5 border-r">{flat.price}</td>
                    <td className="p-2.5 border-r">{flat.subtotal}</td>
                    <td className="p-2.5 border-r">{flat.parkingCost || ''}</td>
                    <td className="p-2.5 border-r">{flat.utilityCharge || ''}</td>
                    <td className="p-2.5 border-r font-semibold">{flat.grandTotal}</td>
                    <td className="p-2.5 border-r">{flat.customer}</td>
                    <td className="p-2.5 border-r">
                      <span className={`px-2.5 py-1 rounded text-white text-[10px] font-semibold ${flat.status === 'Sold' ? 'bg-blue-600' : 'bg-rose-500'}`}>
                        {flat.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      <button 
                        onClick={() => handleEditClick(flat)} 
                        className="bg-sky-400 hover:bg-sky-500 text-white p-1.5 rounded shadow-sm transition"
                        title="Edit Flat"
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
          <span>Showing 1 to {filteredFlats.length} of {filteredFlats.length} entries</span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-slate-100 rounded text-slate-400 cursor-not-allowed" disabled>Previous</button>
            <button className="px-3 py-1 bg-purple-600 text-white rounded font-medium">1</button>
            <button className="px-3 py-1 bg-slate-100 rounded text-slate-600 hover:bg-slate-200">Next</button>
          </div>
        </div>

      </div>

      {/* ================= MODAL: FLAT EDIT FORM (MATCHING EXACT IMAGE) ================= */}
      {isEditModalOpen && currentFlat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl border border-slate-300 overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-white">
              <h3 className="font-bold text-sm text-slate-800">Flat</h3>
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

                {/* Flat No */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Flat No <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    value={formFlatNo} 
                    onChange={(e) => setFormFlatNo(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500" 
                  />
                </div>

                {/* Size */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Size <span className="text-rose-500">*</span></label>
                  <input 
                    type="number" 
                    value={formSize} 
                    onChange={(e) => setFormSize(Number(e.target.value))} 
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

                {/* Bedroom */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Bedroom</label>
                  <input 
                    type="text" 
                    placeholder="Bedroom"
                    value={formBedroom} 
                    onChange={(e) => setFormBedroom(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400" 
                  />
                </div>

                {/* Bathroom */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Bathroom</label>
                  <input 
                    type="text" 
                    placeholder="Bathroom"
                    value={formBathroom} 
                    onChange={(e) => setFormBathroom(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400" 
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Unit</label>
                  <input 
                    type="text" 
                    placeholder="Unit"
                    value={formUnit} 
                    onChange={(e) => setFormUnit(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400" 
                  />
                </div>

                {/* Drawing */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Drawing</label>
                  <input 
                    type="text" 
                    placeholder="Drawing"
                    value={formDrawing} 
                    onChange={(e) => setFormDrawing(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400" 
                  />
                </div>

                {/* Dining */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Dining</label>
                  <input 
                    type="text" 
                    placeholder="Dining"
                    value={formDining} 
                    onChange={(e) => setFormDining(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400" 
                  />
                </div>

                {/* Kitchen */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Kitchen</label>
                  <input 
                    type="text" 
                    placeholder="Kitchen"
                    value={formKitchen} 
                    onChange={(e) => setFormKitchen(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400" 
                  />
                </div>

                {/* Balcony */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Balcony</label>
                  <input 
                    type="text" 
                    placeholder="Balcony"
                    value={formBalcony} 
                    onChange={(e) => setFormBalcony(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400" 
                  />
                </div>

                {/* Parking */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Parking</label>
                  <input 
                    type="text" 
                    placeholder="Parking"
                    value={formParking} 
                    onChange={(e) => setFormParking(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400" 
                  />
                </div>

                {/* Parking Cost */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Parking Cost</label>
                  <input 
                    type="number" 
                    placeholder="Parking Cost"
                    value={formParkingCost} 
                    onChange={(e) => setFormParkingCost(Number(e.target.value))} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400" 
                  />
                </div>

                {/* Utility Charge */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Utility Charge</label>
                  <input 
                    type="number" 
                    placeholder="Utility Charge"
                    value={formUtilityCharge} 
                    onChange={(e) => setFormUtilityCharge(Number(e.target.value))} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400" 
                  />
                </div>

                {/* Basement */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Basement</label>
                  <input 
                    type="text" 
                    placeholder="Basement"
                    value={formBasement} 
                    onChange={(e) => setFormBasement(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500 placeholder:text-slate-400" 
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

                {/* Status */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Status <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    value={formStatus} 
                    onChange={(e) => setFormStatus(e.target.value)} 
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500" 
                  />
                </div>

                {/* Amenities (Full Width) */}
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
                  setFlats(flats.map(f => f.id === currentFlat.id ? { 
                    ...f, 
                    project: formProject, 
                    site: formSite, 
                    flatLandNo: formFlatNo, 
                    size: formSize, 
                    price: formPrice, 
                    subtotal: formSize * formPrice,
                    grandTotal: (formSize * formPrice) + formParkingCost + formUtilityCharge,
                    bedroom: formBedroom, 
                    bathroom: formBathroom, 
                    unit: formUnit, 
                    drawing: formDrawing, 
                    dining: formDining, 
                    kitchen: formKitchen, 
                    balcony: formBalcony, 
                    parking: formParking, 
                    parkingCost: formParkingCost, 
                    utilityCharge: formUtilityCharge, 
                    basement: formBasement, 
                    facing: formFacing, 
                    amenities: formAmenities, 
                    status: formStatus as any 
                  } : f));
                  alert('Flat Updated Successfully!');
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