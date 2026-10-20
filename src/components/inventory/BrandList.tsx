"use client";

import type { Brand } from "@/app/(admin-dashbord)/dashboard/inventory/products/brands/page";
import React, { useState, useEffect, useMemo } from "react";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { API_BASE, brandsApi, fallbackBrands } from "@/lib/inventoryApi";

interface BrandListProps {
  apiEndpoint?: string;
  refreshTrigger?: number;
  onEdit?: (brand: Brand) => void;
  onView?: (brand: Brand) => void;
  onDelete?: (id: string | number, name: string) => void;
}

export default function BrandList({
  apiEndpoint = `${API_BASE}/inventory/brands`,
  refreshTrigger,
  onEdit,
  onView,
  onDelete,
}: BrandListProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetching data from backend API
  useEffect(() => {
    async function fetchBrands() {
      try {
        setLoading(true);
        let raw = await brandsApi.getAll().catch(() => null);
        if (!Array.isArray(raw) || raw.length === 0) {
          raw = fallbackBrands;
        }
        const list = raw.map((item: any) => ({
          id: item.id,
          code: item.code || "",
          name: item.name || "",
        }));
        setBrands(list);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrands(
          fallbackBrands.map((item: any) => ({
            id: item.id,
            code: item.code || "",
            name: item.name || "",
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBrands();
  }, [apiEndpoint, refreshTrigger]);

  // Fallback local delete handler
  const handleDelete = (id: number | string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      setBrands((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Filter brands based on Search query
  const filteredBrands = useMemo(() => {
    return brands.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [brands, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredBrands.length / entriesPerPage) || 1;
  const paginatedBrands = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredBrands.slice(start, start + entriesPerPage);
  }, [filteredBrands, currentPage, entriesPerPage]);

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar Section */}
      <div className="bg-card border border-border rounded p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

          <div className="w-full sm:w-auto">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search brands..."
                className="w-full sm:w-64 bg-background border border-input rounded pl-9 pr-3 py-1.5 text-xs text-foreground focus:outline-none"
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
                <th className="py-3 px-4">CODE</th>
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4 text-center w-28">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading brands...
                  </td>
                </tr>
              ) : paginatedBrands.length > 0 ? (
                paginatedBrands.map((brand, index) => {
                  const serialNumber =
                    (currentPage - 1) * entriesPerPage + index + 1;
                  return (
                    <tr
                      key={brand.id || index}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{serialNumber}</td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {brand.code}
                      </td>
                      <td className="py-3 px-4 font-medium">{brand.name}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Button */}
                          <button
                            onClick={() => onEdit && onEdit(brand)}
                            title="Edit"
                            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white p-1.5 rounded transition-colors shadow-sm"
                          >
                            <FiEdit size={14} />
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() =>
                              onDelete
                                ? onDelete(brand.id, brand.name)
                                : handleDelete(brand.id)
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
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No matching brands found.
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
            {filteredBrands.length > 0
              ? (currentPage - 1) * entriesPerPage + 1
              : 0}{" "}
            to {Math.min(currentPage * entriesPerPage, filteredBrands.length)}{" "}
            of {filteredBrands.length} entries
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded border text-xs font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[var(--lime)] text-white border-[var(--lime)]"
                    : "border-border bg-card hover:bg-muted text-foreground"
                }`}
              >
                {page}
              </button>
            ))}
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
