"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Plus,
  X,
  Edit,
  Trash2,
  ArrowUpDown,
  MoreVertical,
} from "lucide-react";

export interface BoqTitleItem {
  id: number;
  sl: number;
  projectType: string;
  title: string;
}

export default function BoqTitleListPage() {
  // Main Data State (API Ready)
  const [items, setItems] = useState<BoqTitleItem[]>([
    { id: 1, sl: 1, projectType: "General", title: "Design Cost" },
    { id: 2, sl: 2, projectType: "General", title: "Project Overhead" },
    { id: 3, sl: 3, projectType: "General", title: "Indirect Common Cost" },
    { id: 4, sl: 4, projectType: "General", title: "Direct Common Cost" },
    { id: 5, sl: 5, projectType: "Building", title: "Paints Works" },
    { id: 6, sl: 6, projectType: "Building", title: "Sanitary Works" },
    { id: 7, sl: 7, projectType: "Building", title: "Thai & Glass Works" },
    { id: 8, sl: 8, projectType: "Electrical", title: "Electric Works" },
    { id: 9, sl: 9, projectType: "Interior", title: "Tiles & Marble Works" },
    { id: 10, sl: 10, projectType: "Structural", title: "MS & SS Works" },
  ]);

  // Controls & Filter States
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Action Dropdown State
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BoqTitleItem | null>(null);

  // Modal Form Inputs
  const [projectType, setProjectType] = useState("");
  const [boqTitle, setBoqTitle] = useState("");

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setProjectType("");
    setBoqTitle("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: BoqTitleItem) => {
    setEditingItem(item);
    setProjectType(item.projectType);
    setBoqTitle(item.title);
    setIsModalOpen(true);
    setActiveDropdownId(null);
  };

  // Form Submit (API Add/Edit connection point)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      const updatedPayload = {
        projectType: projectType || "General",
        title: boqTitle,
      };
      console.log(
        "Edit Boq Title API Payload:",
        editingItem.id,
        updatedPayload,
      );

      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...updatedPayload } : item,
        ),
      );
    } else {
      const newPayload = {
        id: Date.now(),
        sl: items.length + 1,
        projectType: projectType || "General",
        title: boqTitle,
      };
      console.log("Create Boq Title API Payload:", newPayload);

      setItems((prev) => [...prev, newPayload]);
    }

    setIsModalOpen(false);
  };

  // Delete Action
  const handleDelete = (id: number) => {
    console.log("Delete Boq Title API Request for ID:", id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    setActiveDropdownId(null);
  };

  // Search Filtering
  const filteredItems = items.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 p-3 text-xs flex flex-col justify-between">
      <div>
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <nav className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <Link
              href="/"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Home
            </Link>
            <span>&gt;</span>
            <span className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer">
              Accounts <ChevronDown className="w-3 h-3" />
            </span>
            <span>&gt;</span>
            <span className="text-slate-400 font-normal truncate">
              Boq Title List
            </span>
          </nav>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#635BFF] hover:bg-indigo-700 text-white font-medium rounded transition-colors shadow-xs cursor-pointer text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Title Add
          </button>
        </div>

        {/* Entries Selector & Search Input */}
        <div className="bg-white dark:bg-slate-900 rounded-t border border-b-0 border-slate-200 dark:border-slate-800 p-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-0.5 outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 dark:text-slate-400">Search:</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-0.5 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <table className="w-full table-fixed text-left border-collapse text-xs">
            <thead className="bg-[#635BFF] text-white font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="w-[8%] px-3 py-2">
                  <div className="flex items-center justify-between">
                    SL <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[27%] px-3 py-2">
                  <div className="flex items-center justify-between">
                    PROJECT TYPE{" "}
                    <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[53%] px-3 py-2">
                  <div className="flex items-center justify-between">
                    TITLE <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[12%] px-3 py-2 text-center">
                  <div className="flex items-center justify-center">ACTION</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-3 py-2.5 text-slate-800 dark:text-slate-100">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300 truncate">
                      {item.projectType || "-"}
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300 font-medium truncate">
                      {item.title}
                    </td>
                    <td className="px-3 py-2.5 text-center relative">
                      {/* Action Dropdown Trigger Button */}
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdownId(
                            activeDropdownId === item.id ? null : item.id,
                          )
                        }
                        className="p-1 rounded bg-[#00B5D8] hover:bg-cyan-600 text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                        title="Actions"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {/* Dropdown Menu (Edit & Delete inside) */}
                      {activeDropdownId === item.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdownId(null)}
                          />
                          <div className="absolute right-3 mt-1 w-28 bg-white dark:bg-slate-900 rounded-md shadow-lg border border-slate-200 dark:border-slate-800 z-20 py-1 text-left">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(item)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5 text-indigo-500" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-4 text-center text-slate-400 italic"
                  >
                    No matching titles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-white dark:bg-slate-900 rounded-b border border-t-0 border-slate-200 dark:border-slate-800 p-2.5 flex items-center justify-between text-slate-500 dark:text-slate-400 mb-4">
          <div>Showing 1 to {filteredItems.length} of 16 entries</div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-[#635BFF] text-white font-medium"
            >
              1
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              2
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* DEPARTMENT / TITLE ADD OR EDIT MODAL (Image 10_2.PNG) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                Department
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-0.5 rounded border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-4 space-y-3.5">
              {/* Field 1: Project Type */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Project Type
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="">Select value</option>
                  <option value="General">General</option>
                  <option value="Building">Building</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Interior">Interior</option>
                  <option value="Structural">Structural</option>
                </select>
              </div>

              {/* Field 2: Department / Boq Title */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Department<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Boq Title"
                  required
                  value={boqTitle}
                  onChange={(e) => setBoqTitle(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-1.5 rounded bg-slate-400 hover:bg-slate-500 text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-[#635BFF] hover:bg-indigo-700 text-white font-medium text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Footer */}
      <footer className="flex items-center justify-between text-[9px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>
    </div>
  );
}
