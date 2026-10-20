"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, ArrowUpDown, X } from "lucide-react";

// API থেকে আসা ডেটার TypeScript Interface
interface UnitItem {
  id: number;
  sl: number;
  name: string;
}

// API যুক্ত করার আগ পর্যন্ত মক ডাটা (Mock Data)
const initialUnitData: UnitItem[] = [
  { id: 1, sl: 1, name: "Software Development" },
  { id: 2, sl: 2, name: "Head Office" },
  { id: 3, sl: 3, name: "Site" },
  { id: 4, sl: 4, name: "Architecture" },
  { id: 5, sl: 5, name: "General" },
  { id: 6, sl: 6, name: "Marketing" },
  { id: 7, sl: 7, name: "Servicing" },
];

export default function UnitListPage() {
  // Main States
  const [units, setUnits] = useState<UnitItem[]>(initialUnitData);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitItem | null>(null);
  const [unitName, setUnitName] = useState("");

  /* 
    TODO: API Integration Example (Fetch Units)
    useEffect(() => {
      const fetchUnits = async () => {
        try {
          const res = await fetch('/api/units');
          const data = await res.json();
          setUnits(data);
        } catch (error) {
          console.error("Failed to fetch units", error);
        }
      };
      fetchUnits();
    }, []);
  */

  // Add Modal Open Handler
  const handleOpenAddModal = () => {
    setEditingUnit(null);
    setUnitName("");
    setIsModalOpen(true);
  };

  // Edit Modal Open Handler
  const handleOpenEditModal = (unit: UnitItem) => {
    setEditingUnit(unit);
    setUnitName(unit.name);
    setIsModalOpen(true);
  };

  // Delete Handler (API Ready)
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this unit?")) {
      /* TODO: API Delete Call Here
         await fetch(`/api/units/${id}`, { method: 'DELETE' });
      */

      setUnits((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Form Submit Handler (Add & Edit - API Ready)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitName.trim()) return;

    if (editingUnit) {
      /* TODO: API Edit/Update Call Here
         await fetch(`/api/units/${editingUnit.id}`, { 
           method: 'PUT', 
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ name: unitName }) 
         });
      */

      // Edit State Update
      setUnits((prev) =>
        prev.map((item) =>
          item.id === editingUnit.id ? { ...item, name: unitName.trim() } : item
        )
      );
    } else {
      /* TODO: API Add Call Here
         await fetch('/api/units', { 
           method: 'POST', 
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ name: unitName }) 
         });
      */

      // Add New State Update
      const newUnit: UnitItem = {
        id: Date.now(),
        sl: units.length + 1,
        name: unitName.trim(),
      };
      setUnits((prev) => [...prev, newUnit]);
    }

    // Reset Form & Close Modal
    setUnitName("");
    setEditingUnit(null);
    setIsModalOpen(false);
  };

  // Filter Units based on Search Input
  const filteredUnits = units.filter((unit) =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-100 p-4 md:p-6 transition-colors duration-200">
      {/* Top Header Section: Breadcrumb & Add Button */}
      <div className="flex items-center justify-between mb-4">
        <nav className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium">
          <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
            Home
          </span>
          <span>&gt;</span>
          <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
            Employee
          </span>
          <span>&gt;</span>
          <span className="text-slate-400 dark:text-slate-500">Unit List</span>
        </nav>

        {/* Unit Add Button */}
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Unit Add
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-[#080d1a] rounded-xl shadow-lg border border-slate-200 dark:border-[#131c31] p-5 mb-6">
        {/* Filter & Search Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span>Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full sm:w-64 px-3 py-1.5 text-xs bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-[#131c31] rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-indigo-600 dark:bg-[#030712] text-white dark:text-slate-300 font-semibold border-b border-indigo-700 dark:border-[#131c31] tracking-wider">
                <th className="p-3 w-16">
                  <div className="flex items-center gap-1">
                    SL
                    <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                  </div>
                </th>
                <th className="p-3">
                  <div className="flex items-center gap-1">
                    NAME
                    <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                  </div>
                </th>
                <th className="p-3 text-center w-28">
                  <div className="flex items-center justify-center gap-1">
                    ACTION
                    <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#131c31]/80 bg-white dark:bg-[#080d1a]">
              {filteredUnits.length > 0 ? (
                filteredUnits.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-[#0e1628] transition-colors"
                  >
                    <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="p-3 text-slate-800 dark:text-slate-200 font-medium">
                      {item.name}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* EDIT BUTTON */}
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded bg-cyan-500 hover:bg-cyan-600 text-white transition-colors shadow-sm cursor-pointer"
                          title="Edit Unit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded bg-rose-500 hover:bg-rose-600 text-white transition-colors shadow-sm cursor-pointer"
                          title="Delete Unit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="p-4 text-center text-slate-500 dark:text-slate-400"
                  >
                    No units found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing 1 to {filteredUnits.length} of {filteredUnits.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              className="px-3 py-1.5 rounded border border-slate-200 dark:border-[#1e293b] text-slate-400 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-40 cursor-not-allowed"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1.5 rounded bg-indigo-600 text-white font-medium">
              1
            </button>
            <button
              className="px-3 py-1.5 rounded border border-slate-200 dark:border-[#1e293b] text-slate-400 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-40 cursor-not-allowed"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* UNIT ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#080d1a] border border-slate-200 dark:border-[#131c31] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#131c31]">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {editingUnit ? "Unit Edit" : "Unit Add"}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingUnit(null);
                }}
                className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              {/* Input Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Unit Name<span className="text-rose-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter Name"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingUnit(null);
                  }}
                  className="px-6 py-2 text-xs font-medium rounded bg-slate-400 dark:bg-slate-600 hover:bg-slate-500 dark:hover:bg-slate-500 text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-medium rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm cursor-pointer"
                >
                  {editingUnit ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200/60 dark:border-[#131c31] pt-4">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>
    </div>
  );
}