"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Plus,
  ArrowLeft,
  X,
  Edit,
  Trash2,
  ArrowUpDown,
} from "lucide-react";

export interface BillItem {
  id: number;
  code: string;
  name: string;
  purchasePrice: number;
  salePrice: number;
  description: string;
  category: string;
  unit: string;
  brand: string;
}

function ItemListPage() {
  // Main Data State (API Ready)
  const [items, setItems] = useState<BillItem[]>([
    {
      id: 1,
      code: "P0006",
      name: "cbv",
      purchasePrice: 0,
      salePrice: 0,
      description: "",
      category: "Sand",
      unit: "Set",
      brand: "ABC",
    },
    {
      id: 2,
      code: "P0005",
      name: "hhh",
      purchasePrice: 0,
      salePrice: 0,
      description: "",
      category: "Cement",
      unit: "Rft",
      brand: "ABC",
    },
    {
      id: 3,
      code: "P0004",
      name: "purch",
      purchasePrice: 0,
      salePrice: 0,
      description: "",
      category: "Rod",
      unit: "Rft",
      brand: "BSRM",
    },
    {
      id: 4,
      code: "P0003",
      name: "purchase",
      purchasePrice: 0,
      salePrice: 0,
      description: "",
      category: "Rod",
      unit: "Sft",
      brand: "BSRM",
    },
    {
      id: 5,
      code: "P0002",
      name: "grfg",
      purchasePrice: 0,
      salePrice: 0,
      description: "",
      category: "Cement",
      unit: "Rft",
      brand: "BBH",
    },
    {
      id: 6,
      code: "P0001",
      name: "test",
      purchasePrice: 0,
      salePrice: 0,
      description: "",
      category: "Cement",
      unit: "Bag",
      brand: "Seven Rings",
    },
  ]);

  // Controls & Filter States
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Action Dropdown State
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BillItem | null>(null);

  // Form Field States
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [itemName, setItemName] = useState("");
  const [unit, setUnit] = useState("");
  const [purchasePrice, setPurchasePrice] = useState<string | number>("");
  const [salePrice, setSalePrice] = useState<string | number>("");
  const [description, setDescription] = useState("");

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setCategory("");
    setSubCategory("");
    setBrand("");
    setItemName("");
    setUnit("");
    setPurchasePrice("");
    setSalePrice("");
    setDescription("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: BillItem) => {
    setEditingItem(item);
    setCategory(item.category);
    setSubCategory("");
    setBrand(item.brand);
    setItemName(item.name);
    setUnit(item.unit);
    setPurchasePrice(item.purchasePrice);
    setSalePrice(item.salePrice);
    setDescription(item.description);
    setIsModalOpen(true);
    setActiveDropdownId(null);
  };

  // Handle Form Submit (Add or Edit API integration point)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      const updatedPayload = {
        name: itemName,
        category: category || "General",
        brand: brand || "Generic",
        unit: unit || "Pcs",
        purchasePrice: Number(purchasePrice) || 0,
        salePrice: Number(salePrice) || 0,
        description,
      };
      console.log("Edit Item API Payload:", editingItem.id, updatedPayload);

      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...updatedPayload } : item,
        ),
      );
    } else {
      const newPayload = {
        id: items.length + 1,
        code: `P000${items.length + 1}`,
        name: itemName,
        category: category || "General",
        brand: brand || "Generic",
        unit: unit || "Pcs",
        purchasePrice: Number(purchasePrice) || 0,
        salePrice: Number(salePrice) || 0,
        description,
      };
      console.log("Create Item API Payload:", newPayload);

      setItems((prev) => [newPayload, ...prev]);
    }

    setIsModalOpen(false);
  };

  // Handle Delete
  const handleDelete = (id: number) => {
    console.log("Delete Item API Request for ID:", id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    setActiveDropdownId(null);
  };

  // Filtered Items for Search
  const filteredItems = items.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 p-3 text-xs flex flex-col justify-between">
      <div>
        {/* Navigation & Header Buttons */}
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
              Item List
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#635BFF] hover:bg-indigo-700 text-white font-medium rounded transition-colors shadow-xs cursor-pointer text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Bill Item Add
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

        {/* Table Header Controls (Show Entries & Search) */}
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

        {/* Table View */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <table className="w-full table-fixed text-left border-collapse text-xs">
            <thead className="bg-[#635BFF] text-white font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="w-[5%] px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    ID <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[8%] px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    CODE <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[14%] px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    NAME <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[12%] px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    PURCHASE PRICE{" "}
                    <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[10%] px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    SALE PRICE{" "}
                    <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[15%] px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    DESCRIPTION{" "}
                    <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[12%] px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    CATEGORY <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[8%] px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    UNIT <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[10%] px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    BRAND <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[6%] px-2 py-2 text-center">
                  <div className="flex items-center justify-center">ACTION</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-2.5 py-2 text-slate-800 dark:text-slate-100">
                      {item.id}
                    </td>
                    <td className="px-2.5 py-2 text-slate-700 dark:text-slate-300 truncate">
                      {item.code}
                    </td>
                    <td className="px-2.5 py-2 text-slate-700 dark:text-slate-300 truncate font-medium">
                      {item.name}
                    </td>
                    <td className="px-2.5 py-2 text-slate-700 dark:text-slate-300">
                      {item.purchasePrice}
                    </td>
                    <td className="px-2.5 py-2 text-slate-700 dark:text-slate-300">
                      {item.salePrice}
                    </td>
                    <td className="px-2.5 py-2 text-slate-700 dark:text-slate-300 truncate">
                      {item.description || "-"}
                    </td>
                    <td className="px-2.5 py-2 text-slate-700 dark:text-slate-300 truncate">
                      {item.category}
                    </td>
                    <td className="px-2.5 py-2 text-slate-700 dark:text-slate-300 truncate">
                      {item.unit}
                    </td>
                    <td className="px-2.5 py-2 text-slate-700 dark:text-slate-300 truncate">
                      {item.brand}
                    </td>
                    <td className="px-2 py-2 text-center relative">
                      {/* Action Dropdown Trigger */}
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
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Action Dropdown Menu */}
                      {activeDropdownId === item.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdownId(null)}
                          />
                          <div className="absolute right-2 mt-1 w-28 bg-white dark:bg-slate-900 rounded-md shadow-lg border border-slate-200 dark:border-slate-800 z-20 py-1 text-left">
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
                    colSpan={10}
                    className="px-3 py-4 text-center text-slate-400 italic"
                  >
                    No matching items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-white dark:bg-slate-900 rounded-b border border-t-0 border-slate-200 dark:border-slate-800 p-2.5 flex items-center justify-between text-slate-500 dark:text-slate-400 mb-4">
          <div>
            Showing 1 to {filteredItems.length} of {filteredItems.length}{" "}
            entries
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

      {/* BILL ITEM ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3">
          <div className="bg-[#F3F2FF] dark:bg-slate-900 w-full max-w-4xl rounded-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                {editingItem ? "Edit Bill Item" : "Bill Item"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
              {/* Row 1: Category, Sub Category, Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Sand">Sand</option>
                    <option value="Cement">Cement</option>
                    <option value="Rod">Rod</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Sub Category
                  </label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="">Select Sub Category</option>
                    <option value="Global Link City">Global Link City</option>
                    <option value="Mega Project">Mega Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Brand
                  </label>
                  <div className="flex items-center gap-1">
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                    >
                      <option value="">Select Brand</option>
                      <option value="ABC">ABC</option>
                      <option value="BSRM">BSRM</option>
                      <option value="BBH">BBH</option>
                      <option value="Seven Rings">Seven Rings</option>
                    </select>
                    <button
                      type="button"
                      className="px-2 py-1.5 bg-[#635BFF] hover:bg-indigo-700 text-white rounded cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: Item Name, Unit, Purchase Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Item Name"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="">Select value</option>
                    <option value="Set">Set</option>
                    <option value="Rft">Rft</option>
                    <option value="Sft">Sft</option>
                    <option value="Bag">Bag</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Purchase Price"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Row 3: Sale Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Sale Price
                  </label>
                  <input
                    type="number"
                    placeholder="Sale Price"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Row 4: Description */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter any description here..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded p-2.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Footer Modal Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-800">
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

      {/* Footer Branding */}
      <footer className="flex items-center justify-between text-[9px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>
    </div>
  );
}

export default ItemListPage;
