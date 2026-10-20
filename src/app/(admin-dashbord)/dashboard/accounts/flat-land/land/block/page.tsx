'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Search, 
  X, 
  Edit, 
  Trash2, 
  Plus 
} from 'lucide-react';

interface BlockItem {
  id: string;
  sl: number;
  projectName: string;
  blockName: string;
}

export default function PropertyBlockListPage() {
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<BlockItem | null>(null);

  // Form Fields State
  const [formProjectName, setFormProjectName] = useState('');
  const [formBlockName, setFormBlockName] = useState('');

  // Search & Entry States
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState('10');

  // Block Data State (Matching Image)
  const [blocks, setBlocks] = useState<BlockItem[]>([
    { id: '1', sl: 1, projectName: 'Estern 19', blockName: 'B' },
    { id: '2', sl: 2, projectName: 'Estern 19', blockName: 'A' },
    { id: '3', sl: 3, projectName: 'N/A', blockName: 'B' },
    { id: '4', sl: 4, projectName: 'N/A', blockName: 'D' },
    { id: '5', sl: 5, projectName: 'N/A', blockName: 'B' },
    { id: '6', sl: 6, projectName: 'N/A', blockName: 'Block-B' },
    { id: '7', sl: 7, projectName: 'N/A', blockName: '5' },
    { id: '8', sl: 8, projectName: 'N/A', blockName: '4' },
    { id: '9', sl: 9, projectName: 'N/A', blockName: '2' },
  ]);

  // Handle Edit Click
  const handleEditClick = (block: BlockItem) => {
    setCurrentBlock(block);
    setFormProjectName(block.projectName);
    setFormBlockName(block.blockName);
    setIsEditModalOpen(true);
  };

  // Handle Delete Click
  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to delete this block?')) {
      setBlocks(blocks.filter(b => b.id !== id).map((b, idx) => ({ ...b, sl: idx + 1 })));
    }
  };

  // Filtered Blocks
  const filteredBlocks = blocks.filter(b => {
    return searchQuery 
      ? b.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || b.blockName.toLowerCase().includes(searchQuery.toLowerCase())
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
          <span className="font-semibold text-slate-800">Property Block List</span>
        </div>
        <button 
          onClick={() => {
            setFormProjectName('');
            setFormBlockName('');
            setIsAddModalOpen(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-4 py-2 rounded flex items-center shadow transition"
        >
          +Block Add
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
                <th className="p-3 border-r border-purple-400 w-16">SL</th>
                <th className="p-3 border-r border-purple-400">PROJECT NAME</th>
                <th className="p-3 border-r border-purple-400">BLOCK NAME</th>
                <th className="p-3 text-center w-28">ACTION</th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-700">
              {filteredBlocks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400 italic bg-slate-50">
                    No data available in table
                  </td>
                </tr>
              ) : (
                filteredBlocks.map((block) => (
                  <tr key={block.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-3 border-r">{block.sl}</td>
                    <td className="p-3 border-r font-medium">{block.projectName}</td>
                    <td className="p-3 border-r">{block.blockName}</td>
                    <td className="p-3 text-center space-x-1">
                      <button 
                        onClick={() => handleEditClick(block)} 
                        className="bg-sky-400 hover:bg-sky-500 text-white p-1.5 rounded shadow-sm transition"
                        title="Edit Block"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(block.id)} 
                        className="bg-rose-500 hover:bg-rose-600 text-white p-1.5 rounded shadow-sm transition"
                        title="Delete Block"
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
          <span>Showing 1 to {filteredBlocks.length} of {filteredBlocks.length} entries</span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-slate-100 rounded text-slate-400 cursor-not-allowed" disabled>Previous</button>
            <button className="px-3 py-1 bg-purple-600 text-white rounded font-medium">1</button>
            <button className="px-3 py-1 bg-slate-100 rounded text-slate-600 hover:bg-slate-200">Next</button>
          </div>
        </div>

      </div>

      {/* ================= MODAL: ADD BLOCK ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl border border-purple-300 overflow-hidden">
            <div className="bg-[#6b58e8] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Add Property Block</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Project Name*</label>
                <input 
                  type="text" 
                  placeholder="Enter Project Name"
                  value={formProjectName} 
                  onChange={(e) => setFormProjectName(e.target.value)} 
                  className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-purple-500" 
                />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Block Name*</label>
                <input 
                  type="text" 
                  placeholder="Enter Block Name"
                  value={formBlockName} 
                  onChange={(e) => setFormBlockName(e.target.value)} 
                  className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-purple-500" 
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-1.5 border rounded bg-slate-100 text-slate-600">Cancel</button>
                <button 
                  onClick={() => {
                    if(!formBlockName) { alert('Please enter block name'); return; }
                    const newBlock: BlockItem = {
                      id: Date.now().toString(),
                      sl: blocks.length + 1,
                      projectName: formProjectName || 'N/A',
                      blockName: formBlockName
                    };
                    setBlocks([...blocks, newBlock]);
                    setIsAddModalOpen(false);
                    alert('Block Added Successfully!');
                  }} 
                  className="px-4 py-1.5 bg-purple-600 text-white rounded font-medium hover:bg-purple-700"
                >
                  Save Block
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT BLOCK ================= */}
      {isEditModalOpen && currentBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl border border-sky-300 overflow-hidden">
            <div className="bg-sky-500 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Edit Property Block</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Project Name*</label>
                <input 
                  type="text" 
                  value={formProjectName} 
                  onChange={(e) => setFormProjectName(e.target.value)} 
                  className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-sky-500" 
                />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Block Name*</label>
                <input 
                  type="text" 
                  value={formBlockName} 
                  onChange={(e) => setFormBlockName(e.target.value)} 
                  className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:border-sky-500" 
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-1.5 border rounded bg-slate-100 text-slate-600">Cancel</button>
                <button 
                  onClick={() => {
                    setBlocks(blocks.map(b => b.id === currentBlock.id ? { 
                      ...b, 
                      projectName: formProjectName, 
                      blockName: formBlockName 
                    } : b));
                    setIsEditModalOpen(false);
                    alert('Block Updated Successfully!');
                  }} 
                  className="px-4 py-1.5 bg-sky-500 text-white rounded font-medium hover:bg-sky-600"
                >
                  Update Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}