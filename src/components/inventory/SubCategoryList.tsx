"use client";

import type { SubCategory } from "@/app/(admin-dashbord)/dashboard/inventory/products/sub-categories/page";
import React, { useState, useEffect, useMemo } from "react";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { API_BASE, categoriesApi, subCategoriesApi, fallbackSubCategories, fallbackCategories } from "@/lib/inventoryApi";

interface SubCategoryListProps {
  apiEndpoint?: string;
  refreshTrigger?: number;
  onEdit?: (subCategory: SubCategory) => void;
  onView?: (subCategory: SubCategory) => void;
  onDelete?: (id: string | number, name: string) => void;
}

export default function SubCategoryList({
  apiEndpoint = `${API_BASE}/inventory/sub-categories`,
  refreshTrigger,
  onEdit,
  onView,
  onDelete,
}: SubCategoryListProps) {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categoriesList, setCategoriesList] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Load parent categories for filter
  useEffect(() => {
    async function loadFilterCategories() {
      try {
        let raw = await categoriesApi.getAll().catch(() => null);
        if (!Array.isArray(raw) || raw.length === 0) {
          raw = fallbackCategories;
        }
        setCategoriesList(raw.map((c: any) => ({ id: c.id, name: c.name })));
      } catch (err) {
        setCategoriesList(fallbackCategories.map((c: any) => ({ id: c.id, name: c.name })));
      }
    }
    loadFilterCategories();
  }, []);

  // Fetching data from backend API
  useEffect(() => {
    async function fetchSubCategories() {
      try {
        setLoading(true);
        let raw = await subCategoriesApi.getAll().catch(() => null);
        if (!Array.isArray(raw) || raw.length === 0) {
          raw = fallbackSubCategories;
        }
        const list = raw.map((item: any) => ({
          id: item.id,
          category: item.category?.name || item.category_name || item.category || "Category",
          category_id: item.category_id,
          code: item.sub_category_code || item.code || "",
          name: item.name || "",
        }));
        setSubCategories(list);
      } catch (error) {
        console.error("Error fetching sub-categories:", error);
        setSubCategories(
          fallbackSubCategories.map((item: any) => ({
            id: item.id,
            category: item.category || "Category",
            category_id: item.category_id,
            code: item.code || "",
            name: item.name || "",
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSubCategories();
  }, [apiEndpoint, refreshTrigger]);

  // Delete handler
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this sub-category?")) {
      setSubCategories((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Filter sub-categories based on Category dropdown and Search query
  const filteredSubCategories = useMemo(() => {
    return subCategories.filter((item) => {
      const matchesCategory = selectedCategoryFilter
        ? item.category.toLowerCase() === selectedCategoryFilter.toLowerCase()
        : true;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [subCategories, selectedCategoryFilter, searchQuery]);

  // Pagination calculations
  const totalPages =
    Math.ceil(filteredSubCategories.length / entriesPerPage) || 1;
  const paginatedSubCategories = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredSubCategories.slice(start, start + entriesPerPage);
  }, [filteredSubCategories, currentPage, entriesPerPage]);

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar Section */}
      <div className="bg-card border border-border rounded p-4 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            Category
          </label>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => {
              setSelectedCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-80 bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
          >
            <option value="">All Categories</option>
            {categoriesList.length > 0 ? (
              categoriesList.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))
            ) : (
              Array.from(new Set(subCategories.map((s) => s.category))).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))
            )}
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
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Search:
            </span>
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
                placeholder="Search sub categories..."
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
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">CODE</th>
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4 text-center w-28">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading sub categories...
                  </td>
                </tr>
              ) : paginatedSubCategories.length > 0 ? (
                paginatedSubCategories.map((subCat, index) => {
                  const serialNumber =
                    (currentPage - 1) * entriesPerPage + index + 1;
                  return (
                    <tr
                      key={subCat.id || index}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{serialNumber}</td>
                      <td className="py-3 px-4">{subCat.category}</td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {subCat.code}
                      </td>
                      <td className="py-3 px-4 font-medium">{subCat.name}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Button */}
                          <button
                            onClick={() => onEdit && onEdit(subCat)}
                            title="Edit"
                            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white p-1.5 rounded transition-colors shadow-sm"
                          >
                            <FiEdit size={14} />
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() =>
                              onDelete
                                ? onDelete(subCat.id, subCat.name)
                                : handleDelete(subCat.id as any)
                            }
                            title="Delete"
                            className="bg-[#ef4444] hover:bg-[#dc2626] text-white p-1.5 rounded transition-colors shadow-sm"
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
                  <td
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No matching sub categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border gap-4 text-xs text-muted-foreground">
          <div>
            Showing{" "}
            {filteredSubCategories.length > 0
              ? (currentPage - 1) * entriesPerPage + 1
              : 0}{" "}
            to{" "}
            {Math.min(
              currentPage * entriesPerPage,
              filteredSubCategories.length,
            )}{" "}
            of {filteredSubCategories.length} entries
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
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
                            ? "bg-[var(--sidebar-foreground)] text-white"
                            : "border border-border bg-card hover:bg-muted text-foreground"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-1 text-muted-foreground">
                        ...
                      </span>
                    );
                  }
                  return null;
                },
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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
