'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Search, 
  X, 
  Edit, 
  Trash2 
} from 'lucide-react';

interface RoadItem {
  id: string;
  sl: number;
  projectName: string;
  roadNo: string;
}

export default function PropertyRoadPage() {
  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRoad, setCurrentRoad] = useState<RoadItem | null>(null);

  // Form States
  const [formProjectName, setFormProjectName] = useState('');
  const [formRoadNo, setFormRoadNo] = useState('');

  // Search & Entries States
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState('10');

  // Road List Data State (Matching Image Data)
  const [roads, setRoads] = useState<RoadItem[]>([
    { id: '1', sl: 1, projectName: 'Estern 19', roadNo: '3/A' },
    { id: '2', sl: 2, projectName: 'Estern 19', roadNo: '2/A' },
    { id: '3', sl: 3, projectName: 'N/A', roadNo: '7' },
    { id: '4', sl: 4, projectName: 'N/A', roadNo: 'Road 10' },
    { id: '5', sl: 5, projectName: 'N/A', roadNo: '7' },
    { id: '6', sl: 6, projectName: 'N/A', roadNo: '2' },
    { id: '7', sl: 7, projectName: 'N/A', roadNo: '1' },
  ]);

  // Handle Edit Click
  const handleEditClick = (road: RoadItem) => {
    setCurrentRoad(road);
    setFormProjectName(road.projectName);
    setFormRoadNo(road.roadNo);
    setIsEditModalOpen(true);
  };

  // Filtered Data
  const filteredRoads = roads.filter(r => {
    return searchQuery 
      ? r.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || r.roadNo.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
  });

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800">
      
      {/* ================= BREADCRUMB HEADER ================= */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-slate-600 space-x-2">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="hover:text-blue-600 cursor-pointer">Flat/Land</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-800">Property Road List</span>
        </div>
        <button 
          onClick={() => {
            setCurrentRoad(null);
            setFormProjectName('');
            setFormRoadNo('');
            setIsEditModalOpen(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-4 py-2 rounded flex items-center shadow transition"
        >
          +Road Add
        </button>
      </div>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="bg-white rounded-md shadow-sm border border-slate-200 p-5 space-y-4">
        
        {/* Top Controls: Show entries & Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <div className="flex items-center text-xs text-slate-600 space-x-1">
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
                <th className="p-2.5 border-r border-purple-400 w-16">SL</th>
                <th className="p-2.5 border-r border-purple-400">PROJECT NAME</th>
                <th className="p-2.5 border-r border-purple-400">ROAD NO</th>
                <th className="p-2.5 text-center w-28">ACTION</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-700">
              {filteredRoads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400 italic bg-slate-50">
                    No data available in table
                  </td>
                </tr>
              ) : (
                filteredRoads.map((road) => (
                  <tr key={road.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-2.5 border-r">{road.sl}</td>
                    <td className="p-2.5 border-r">{road.projectName}</td>
                    <td className="p-2.5 border-r font-medium">{road.roadNo}</td>
                    <td className="p-2.5 text-center space-x-1.5 flex justify-center items-center">
                      <button 
                        onClick={() => handleEditClick(road)} 
                        className="bg-sky-400 hover:bg-sky-500 text-white p-1.5 rounded shadow-sm transition"
                        title="Edit Road"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => {
                          setRoads(roads.filter(r => r.id !== road.id));
                        }} 
                        className="bg-rose-500 hover:bg-rose-600 text-white p-1.5 rounded shadow-sm transition"
                        title="Delete Road"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
          <span>Showing 1 to {filteredRoads.length} of {filteredRoads.length} entries</span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-slate-100 rounded text-slate-400 cursor-not-allowed" disabled>Previous</button>
            <button className="px-3 py-1 bg-purple-600 text-white rounded font-medium">1</button>
            <button className="px-3 py-1 bg-slate-100 rounded text-slate-600 hover:bg-slate-200">Next</button>
          </div>
        </div>

      </div>

      {/* ================= MODAL: PROPERTY ROAD ADD / EDIT ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-lg rounded shadow-2xl border border-slate-300 overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 bg-white">
              <h3 className="font-bold text-sm text-slate-800">
                {currentRoad ? 'Property Road Edit' : 'Property Road Add'}
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="text-slate-500 hover:bg-slate-100 p-1 rounded border border-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Project Name <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formProjectName} 
                  onChange={(e) => setFormProjectName(e.target.value)} 
                  placeholder="Estern 19"
                  className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Road No <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formRoadNo} 
                  onChange={(e) => setFormRoadNo(e.target.value)} 
                  placeholder="3/A"
                  className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 focus:outline-none focus:border-purple-500" 
                />
              </div>
            </div>

            {/* Modal Footer Buttons */}
            <div className="bg-white px-5 py-3 border-t border-slate-200 flex justify-end space-x-2">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="bg-slate-500 hover:bg-slate-600 text-white font-medium px-4 py-2 rounded text-xs transition"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  if (currentRoad) {
                    // Update existing
                    setRoads(roads.map(r => r.id === currentRoad.id ? { 
                      ...r, 
                      projectName: formProjectName, 
                      roadNo: formRoadNo 
                    } : r));
                    alert('Property Road Updated Successfully!');
                  } else {
                    // Add new
                    const newRoad: RoadItem = {
                      id: String(Date.now()),
                      sl: roads.length + 1,
                      projectName: formProjectName || 'N/A',
                      roadNo: formRoadNo || 'N/A'
                    };
                    setRoads([...roads, newRoad]);
                    alert('Property Road Added Successfully!');
                  }
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