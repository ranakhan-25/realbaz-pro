"use client";

import type { Item } from "@/app/(admin-dashbord)/dashboard/inventory/products/item-entry/page";
import React, { useState, useEffect, useMemo } from "react";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { API_BASE, itemsApi, fallbackItems } from "@/lib/inventoryApi";

interface ItemListProps {
  apiEndpoint?: string;
  refreshTrigger?: number;
  onEdit?: (item: Item) => void;
  onView?: (item: Item) => void;
  onDelete?: (id: string | number, name: string) => void;
}

export default function ItemList({
  apiEndpoint = `${API_BASE}/inventory/items`,
  refreshTrigger,
  onEdit,
  onView,
  onDelete,
}: ItemListProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetching data from backend API
  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true);
        let raw = await itemsApi.getAll().catch(() => null);
        if (!Array.isArray(raw) || raw.length === 0) {
          raw = fallbackItems;
        }
        const list = raw.map((it: any) => ({
          id: it.id,
          code: it.item_code || it.code || "",
          name: it.name || "",
          category: it.category?.name || it.category_id || (typeof it.category === "string" ? it.category : "General"),
          category_id: it.category_id,
          unit: it.unit?.name || it.unit_id || (typeof it.unit === "string" ? it.unit : "Pcs"),
          unit_id: it.unit_id,
          brand: it.brand?.name || it.brand_id || (typeof it.brand === "string" ? it.brand : ""),
          brand_id: it.brand_id,
          purchasePrice: Number(it.purchase_price ?? it.purchasePrice ?? 0),
          salePrice: Number(it.sale_price ?? it.salePrice ?? 0),
        }));
        setItems(list);
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems(
          fallbackItems.map((it: any) => ({
            id: it.id,
            code: it.code || "",
            name: it.name || "",
            category: it.category?.name || "General",
            category_id: it.category_id,
            unit: it.unit?.name || "Pcs",
            unit_id: it.unit_id,
            brand: it.brand?.name || "",
            brand_id: it.brand_id,
            purchasePrice: Number(it.purchase_price ?? 0),
            salePrice: Number(it.sale_price ?? 0),
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [apiEndpoint, refreshTrigger]);

  // Fallback local delete handler
  const handleDelete = (id: number | string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Filter items based on Search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.unit && item.unit.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });
  }, [items, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / entriesPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredItems.slice(start, start + entriesPerPage);
  }, [filteredItems, currentPage, entriesPerPage]);

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
                placeholder="Search items..."
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
                <th className="py-3 px-4 w-14">SL</th>
                <th className="py-3 px-4">CODE</th>
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">UNIT</th>
                <th className="py-3 px-4">BRAND</th>
                <th className="py-3 px-4">PURCHASE PRICE</th>
                <th className="py-3 px-4">SALE PRICE</th>
                <th className="py-3 px-4 text-center w-28">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading items...
                  </td>
                </tr>
              ) : paginatedItems.length > 0 ? (
                paginatedItems.map((item, index) => {
                  const serialNumber = (currentPage - 1) * entriesPerPage + index + 1;
                  return (
                    <tr
                      key={item.id || index}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{serialNumber}</td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {item.code}
                      </td>
                      <td className="py-3 px-4 font-medium">{item.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {item.unit}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {item.brand || "-"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {item.purchasePrice}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {item.salePrice}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Button */}
                          <button
                            onClick={() => onEdit && onEdit(item)}
                            title="Edit"
                            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white p-1.5 rounded transition-colors shadow-sm"
                          >
                            <FiEdit size={14} />
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() =>
                              onDelete
                                ? onDelete(item.id, item.name)
                                : handleDelete(item.id)
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
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No matching items found.
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
            {filteredItems.length > 0
              ? (currentPage - 1) * entriesPerPage + 1
              : 0}{" "}
            to {Math.min(currentPage * entriesPerPage, filteredItems.length)}{" "}
            of {filteredItems.length} entries
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
