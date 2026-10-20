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
  MoreVertical,
} from "lucide-react";

export interface ServiceItem {
  id: number;
  productType: string;
  code: string;
  name: string;
  purchasePrice: number;
  salePrice: number;
  category: string;
  unit: string;
  brand: string;
}

export default function ServiceWorkNamePage() {
  // Main Data State (API Ready)
  const [services, setServices] = useState<ServiceItem[]>([
    {
      id: 1,
      productType: "Service",
      code: "S0045",
      name: "gddc",
      purchasePrice: 0,
      salePrice: 0,
      category: "Day labour",
      unit: "Sft",
      brand: "BBH",
    },
    {
      id: 2,
      productType: "Service",
      code: "S0044",
      name: "test",
      purchasePrice: 0,
      salePrice: 0,
      category: "Paint Work",
      unit: "Set",
      brand: "BSRM",
    },
    {
      id: 3,
      productType: "Service",
      code: "S0043",
      name: "cdxc",
      purchasePrice: 0,
      salePrice: 0,
      category: "Paint Work",
      unit: "Cft",
      brand: "BBH",
    },
    {
      id: 4,
      productType: "Service",
      code: "S0042",
      name: "tefg",
      purchasePrice: 0,
      salePrice: 0,
      category: "Day labour",
      unit: "Sft",
      brand: "ABC",
    },
    {
      id: 5,
      productType: "Service",
      code: "S057",
      name: "Water Repellent(service)",
      purchasePrice: 10,
      salePrice: 0,
      category: "Paint Work",
      unit: "Sft",
      brand: "",
    },
    {
      id: 6,
      productType: "Service",
      code: "S056",
      name: "Weather Coat (Outside)(service)",
      purchasePrice: 7,
      salePrice: 0,
      category: "Paint Work",
      unit: "Job",
      brand: "",
    },
    {
      id: 7,
      productType: "Service",
      code: "S055",
      name: "Enamail Paint(service)",
      purchasePrice: 5,
      salePrice: 0,
      category: "Paint Work",
      unit: "Job",
      brand: "",
    },
    {
      id: 8,
      productType: "Service",
      code: "S054",
      name: "Plastic Paint (Inside Floor)(service)",
      purchasePrice: 5,
      salePrice: 0,
      category: "Paint Work",
      unit: "Job",
      brand: "",
    },
    {
      id: 9,
      productType: "Service",
      code: "S052",
      name: "Gas Pipe Wiring (All Floor)",
      purchasePrice: 0,
      salePrice: 0,
      category: "Wiring",
      unit: "",
      brand: "",
    },
    {
      id: 10,
      productType: "Service",
      code: "S051",
      name: "Internal Pipe Wiring",
      purchasePrice: 0,
      salePrice: 0,
      category: "Wiring",
      unit: "",
      brand: "",
    },
    {
      id: 11,
      productType: "Service",
      code: "S051",
      name: "Internal Pipe Wiring",
      purchasePrice: 0,
      salePrice: 0,
      category: "Wiring",
      unit: "",
      brand: "",
    },
  ]);

  // Table & Search Controls
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Action Dropdown Control
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

  // Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);

  // Modal Form States
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [unit, setUnit] = useState("");
  const [cost, setCost] = useState<string | number>("");
  const [salePrice, setSalePrice] = useState<string | number>("");

  // Open Modal for Create
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setCategory("");
    setSubCategory("");
    setServiceName("");
    setUnit("");
    setCost("");
    setSalePrice("");
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (item: ServiceItem) => {
    setEditingItem(item);
    setCategory(item.category);
    setSubCategory("");
    setServiceName(item.name);
    setUnit(item.unit);
    setCost(item.purchasePrice);
    setSalePrice(item.salePrice);
    setIsModalOpen(true);
    setActiveDropdownId(null);
  };

  // Form Submit (API Connection Point)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      const updatedPayload = {
        name: serviceName,
        category: category || "General",
        unit: unit || "Pcs",
        purchasePrice: Number(cost) || 0,
        salePrice: Number(salePrice) || 0,
      };
      console.log("Edit Service API Payload:", editingItem.id, updatedPayload);

      setServices((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...updatedPayload } : item,
        ),
      );
    } else {
      const newPayload = {
        id: services.length + 1,
        productType: "Service",
        code: `S00${services.length + 40}`,
        name: serviceName,
        category: category || "General",
        unit: unit || "Job",
        brand: "",
        purchasePrice: Number(cost) || 0,
        salePrice: Number(salePrice) || 0,
      };
      console.log("Create Service API Payload:", newPayload);

      setServices((prev) => [newPayload, ...prev]);
    }

    setIsModalOpen(false);
  };

  // Delete Item
  const handleDelete = (id: number) => {
    console.log("Delete Service API Request for ID:", id);
    setServices((prev) => prev.filter((item) => item.id !== id));
    setActiveDropdownId(null);
  };

  // Search Filter
  const filteredServices = services.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
              Labour/Worker <ChevronDown className="w-3 h-3" />
            </span>
            <span>&gt;</span>
            <span className="text-slate-400 font-normal truncate">
              Service/Work Name
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#635BFF] hover:bg-indigo-700 text-white font-medium rounded transition-colors shadow-xs cursor-pointer text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Service/Work Name Add
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

        {/* Entries & Search controls */}
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
                <th className="w-[4%] px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    ID <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[11%] px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    PRODUCT TYPE{" "}
                    <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[8%] px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    CODE <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[22%] px-2.5 py-2">
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
                <th className="w-[13%] px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    CATEGORY <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[7%] px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    UNIT <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[7%] px-2.5 py-2">
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
              {filteredServices.length > 0 ? (
                filteredServices.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-2.5 py-2 text-slate-800 dark:text-slate-100">
                      {item.id}
                    </td>
                    <td className="px-2.5 py-2 text-slate-700 dark:text-slate-300 truncate">
                      {item.productType}
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
                      {item.category}
                    </td>
                    <td className="px-2.5 py-2 text-slate-700 dark:text-slate-300 truncate">
                      {item.unit || "-"}
                    </td>
                    <td className="px-2.5 py-2 text-slate-700 dark:text-slate-300 truncate">
                      {item.brand || "-"}
                    </td>
                    <td className="px-2 py-2 text-center relative">
                      {/* Dropdown Action Trigger Button */}
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdownId(
                            activeDropdownId === item.id ? null : item.id,
                          )
                        }
                        className="p-1 rounded bg-[#00B5D8] hover:bg-cyan-600 text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                        title="Action Menu"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {/* Dropdown Menu (Edit & Delete) */}
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
                    No matching services found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-white dark:bg-slate-900 rounded-b border border-t-0 border-slate-200 dark:border-slate-800 p-2.5 flex items-center justify-between text-slate-500 dark:text-slate-400 mb-4">
          <div>Showing 1 to {filteredServices.length} of 45 entries</div>

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
              className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              3
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              4
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              5
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

      {/* SERVICE / WORK NAME ADD OR EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3">
          <div className="bg-[#F3F2FF] dark:bg-slate-900 w-full max-w-3xl rounded-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                {editingItem
                  ? "Edit Service/Work Name"
                  : "Service/Work Name Add"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form Inputs */}
            <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
              {/* Row 1: Category, Sub Category, Service Name */}
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
                    <option value="Day labour">Day labour</option>
                    <option value="Paint Work">Paint Work</option>
                    <option value="Wiring">Wiring</option>
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
                    <option value="Interior">Interior</option>
                    <option value="Exterior">Exterior</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    placeholder="Service Name"
                    required
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Row 2: Unit, Cost, Sale Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="">Select Unit</option>
                    <option value="Sft">Sft</option>
                    <option value="Set">Set</option>
                    <option value="Cft">Cft</option>
                    <option value="Job">Job</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Cost
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Cost"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>

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

              {/* Modal Buttons */}
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

      {/* Page Footer Branding */}
      <footer className="flex items-center justify-between text-[9px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>
    </div>
  );
}
