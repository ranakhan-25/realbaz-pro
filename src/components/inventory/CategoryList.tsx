"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FiEdit, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { Category } from "@/app/(admin-dashbord)/dashboard/inventory/products/categories/page";
import { API_BASE, categoriesApi, fallbackCategories } from "@/lib/inventoryApi";

interface CategoryListProps {
  apiEndpoint?: string;
  refreshTrigger?: number;
  onEdit?: (category: Category) => void;
  onView?: (category: Category) => void;
  onDelete?: (id: string | number, name: string) => void;
}

export default function CategoryList({
  apiEndpoint = `${API_BASE}/inventory/categories`,
  refreshTrigger,
  onEdit,
  onView,
  onDelete,
}: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedType, setSelectedType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetching data from backend API
  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        let raw = await categoriesApi.getAll().catch(() => null);
        if (!Array.isArray(raw) || raw.length === 0) {
          raw = fallbackCategories;
        }
        const list = raw.map((c: any) => ({
          id: c.id,
          type: c.type || "Material",
          code: c.category_code || c.code || "",
          name: c.name || "",
          inventoryCoa: c.inventoryCoa || "Inventory Asset",
          consumptionCoa: c.consumptionCoa || "Site Consumption",
        }));
        setCategories(list);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories(
          fallbackCategories.map((c: any) => ({
            id: c.id,
            type: c.type || "Material",
            code: c.category_code || c.code || "",
            name: c.name || "",
            inventoryCoa: c.inventoryCoa || "Inventory Asset",
            consumptionCoa: c.consumptionCoa || "Site Consumption",
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [apiEndpoint, refreshTrigger]);

  // Filter categories based on Type dropdown and Search query
  const filteredCategories = useMemo(() => {
    return categories.filter((item) => {
      const matchesType = selectedType ? item.type === selectedType : true;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.inventoryCoa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.consumptionCoa.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [categories, selectedType, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCategories.length / entriesPerPage) || 1;
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredCategories.slice(start, start + entriesPerPage);
  }, [filteredCategories, currentPage, entriesPerPage]);

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar Section */}
      <div className="bg-card border border-border rounded p-4 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-medium text-red-500 mb-1">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-72 bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
          >
            <option value="">Select One Option</option>
            <option value="Material">Material</option>
            <option value="Service">Service</option>
          </select>
        </div>

        {/* Entries Control & Search Input */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-card border border-input rounded px-2 py-1 text-foreground text-xs focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Search:</span>
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <FiSearch size={14} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search categories..."
                className="w-full bg-background border border-input rounded-md pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[var(--sidebar-foreground)] text-white font-medium select-none">
                <th className="py-3 px-4 w-16">SL</th>
                <th className="py-3 px-4">TYPE</th>
                <th className="py-3 px-4">CODE</th>
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4">INVENTORY COA</th>
                <th className="py-3 px-4">CONSUMPTION COA</th>
                <th className="py-3 px-4 text-center w-24">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    Loading categories...
                  </td>
                </tr>
              ) : paginatedCategories.length > 0 ? (
                paginatedCategories.map((category, index) => {
                  const serialNumber = (currentPage - 1) * entriesPerPage + index + 1;
                  return (
                    <tr key={category.id || index} className="hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{serialNumber}</td>
                      <td className="py-3 px-4">{category.type}</td>
                      <td className="py-3 px-4 font-mono text-xs">{category.code || "-"}</td>
                      <td className="py-3 px-4 font-medium">{category.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{category.inventoryCoa}</td>
                      <td className="py-3 px-4 text-muted-foreground">{category.consumptionCoa}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit / Update Button (Opens Modal) */}
                          <button
                            onClick={() => onEdit && onEdit(category)}
                            title="Edit"
                            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white p-1.5 rounded transition-colors shadow-sm"
                          >
                            <FiEdit size={14} />
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => onDelete && onDelete(category.id, category.name)}
                            title="Delete"
                            className="bg-rose-500 hover:bg-rose-600 text-white p-1.5 rounded transition-colors shadow-sm"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    No matching categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border gap-4 text-xs text-muted-foreground">
          <div>
            Showing {filteredCategories.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * entriesPerPage, filteredCategories.length)} of{" "}
            {filteredCategories.length} entries
          </div>

          {/* Page Number Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center gap-1 mx-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        currentPage === page
                          ? "bg-[#6366f1] text-white"
                          : "border border-border bg-card hover:bg-muted text-foreground"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-1 text-muted-foreground">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
