"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Plus,
  ArrowLeft,
  X,
  Edit,
  Trash2,
  ArrowUpDown,
  MoreVertical,
} from "lucide-react";

export interface CategoryItem {
  sl: number;
  type: string;
  code: string;
  name: string;
}

function CategoryListPage() {
  // Main Data State (API Ready)
  const [categories, setCategories] = useState<CategoryItem[]>([
    { sl: 1, type: "Service", code: "-", name: "Wiring" },
    { sl: 2, type: "Service", code: "-", name: "Tiles Work" },
    { sl: 3, type: "Service", code: "-", name: "Fiting" },
    { sl: 4, type: "Service", code: "-", name: "Roof" },
    { sl: 5, type: "Service", code: "-", name: "Earth Remove" },
    { sl: 6, type: "Service", code: "-", name: "Day labour" },
    { sl: 7, type: "Service", code: "-", name: "Rmc" },
    { sl: 8, type: "Service", code: "-", name: "Dia" },
    { sl: 9, type: "Service", code: "-", name: "Paint Work" },
  ]);

  // Filter & Search States
  const [typeFilter, setTypeFilter] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Action Dropdown State
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null);

  // Form Fields State
  const [modalType, setModalType] = useState("");
  const [modalCode, setModalCode] = useState("C3912399");
  const [modalName, setModalName] = useState("");

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setModalType("");
    setModalCode(`C${Math.floor(1000000 + Math.random() * 9000000)}`);
    setModalName("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: CategoryItem) => {
    setEditingItem(item);
    setModalType(item.type);
    setModalCode(
      item.code !== "-"
        ? item.code
        : `C${Math.floor(1000000 + Math.random() * 9000000)}`,
    );
    setModalName(item.name);
    setIsModalOpen(true);
    setActiveDropdownId(null);
  };

  // Handle Form Submit (Add or Edit)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      // Edit API Request Payload
      const updatedPayload = {
        type: modalType || "Service",
        code: modalCode,
        name: modalName,
      };
      console.log("Edit Category API Payload:", editingItem.sl, updatedPayload);

      setCategories((prev) =>
        prev.map((item) =>
          item.sl === editingItem.sl ? { ...item, ...updatedPayload } : item,
        ),
      );
    } else {
      // Create API Request Payload
      const newPayload = {
        sl: categories.length + 1,
        type: modalType || "Service",
        code: modalCode,
        name: modalName,
      };
      console.log("Create Category API Payload:", newPayload);

      setCategories((prev) => [...prev, newPayload]);
    }

    setIsModalOpen(false);
  };

  // Handle Delete
  const handleDelete = (sl: number) => {
    console.log("Delete Category API Request for SL:", sl);
    setCategories((prev) => prev.filter((item) => item.sl !== sl));
    setActiveDropdownId(null);
  };

  // Filtered Data
  const filteredCategories = categories.filter((item) => {
    const matchesType = typeFilter ? item.type === typeFilter : true;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 p-3 text-xs flex flex-col justify-between">
      <div>
        {/* Top Header & Breadcrumbs */}
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
              Billing <ChevronDown className="w-3 h-3" />
            </span>
            <span>&gt;</span>
            <span className="text-slate-400 font-normal truncate">
              Category List
            </span>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#635BFF] hover:bg-indigo-700 text-white font-medium rounded transition-colors shadow-xs cursor-pointer text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Category
            </button>
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 bg-[#2D4A43] hover:bg-[#233a34] text-white font-medium rounded transition-colors shadow-xs cursor-pointer text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Previous
            </button>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="mb-4 max-w-xs">
          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
          >
            <option value="">Select One Option</option>
            <option value="Service">Service</option>
            <option value="Product">Product</option>
          </select>
        </div>

        {/* Table Controls (Show Entries & Search) */}
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

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <table className="w-full table-fixed text-left border-collapse text-xs">
            <thead className="bg-[#635BFF] text-white font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="w-[8%] px-3 py-2">
                  <div className="flex items-center justify-between">
                    SL <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[22%] px-3 py-2">
                  <div className="flex items-center justify-between">
                    TYPE <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[22%] px-3 py-2">
                  <div className="flex items-center justify-between">
                    CODE <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[38%] px-3 py-2">
                  <div className="flex items-center justify-between">
                    NAME <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[10%] px-3 py-2 text-center">
                  <div className="flex items-center justify-center">ACTION</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((item) => (
                  <tr
                    key={item.sl}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-3 py-2 text-slate-800 dark:text-slate-100">
                      {item.sl}
                    </td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300 truncate">
                      {item.type}
                    </td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300 truncate">
                      {item.code}
                    </td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300 truncate font-medium">
                      {item.name}
                    </td>
                    <td className="px-3 py-2 text-center relative">
                      {/* Action Dropdown Trigger Button */}
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdownId(
                            activeDropdownId === item.sl ? null : item.sl,
                          )
                        }
                        className="p-1 rounded bg-[#00B5D8] hover:bg-cyan-600 text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                        title="Actions"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeDropdownId === item.sl && (
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
                              onClick={() => handleDelete(item.sl)}
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
                    colSpan={5}
                    className="px-3 py-4 text-center text-slate-400 italic"
                  >
                    No matching categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white dark:bg-slate-900 rounded-b border border-t-0 border-slate-200 dark:border-slate-800 p-2.5 flex items-center justify-between text-slate-500 dark:text-slate-400 mb-4">
          <div>
            Showing 1 to {filteredCategories.length} of{" "}
            {filteredCategories.length} entries
          </div>

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
              disabled
              className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORY ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-md shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                {editingItem ? "Edit Category" : "Category"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Type Input */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={modalType}
                    onChange={(e) => setModalType(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="">Select One Option</option>
                    <option value="Service">Service</option>
                    <option value="Product">Product</option>
                  </select>
                </div>

                {/* Category Code Input */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Category Code
                  </label>
                  <input
                    type="text"
                    value={modalCode}
                    onChange={(e) => setModalCode(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Category Name Input */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3">
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

      {/* Footer */}
      <footer className="flex items-center justify-between text-[9px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>
    </div>
  );
}

export default CategoryListPage;
