"use client";

import type { SaleListItem } from "@/app/(admin-dashbord)/dashboard/inventory/sales/page";
import React, { useState, useEffect, useMemo } from "react";
import { FiEdit, FiTrash2, FiEye, FiSearch } from "react-icons/fi";

import { fallbackSales } from "@/lib/inventoryApi";

interface SaleListTableProps {
  refreshTrigger?: number;
  onEdit?: (item: SaleListItem) => void;
  onView?: (item: SaleListItem) => void;
}

export default function SaleListTable({ refreshTrigger, onEdit, onView }: SaleListTableProps) {
  const [sales, setSales] = useState<SaleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetching Data from backend / API route
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/sales?_t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch from API");
        }

        const json = await response.json();
        const raw = json.data !== undefined ? json.data : json;
        const list = Array.isArray(raw) && raw.length > 0 ? raw : fallbackSales;
        setSales(list);
      } catch (error) {
        setSales(fallbackSales);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [refreshTrigger]);

  // Delete handler
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this sale?")) {
      setSales(sales.filter((item) => item.id !== id));
    }
  };

  // Filter sales based on search query
  const filteredSales = useMemo(() => {
    return sales.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.code.toLowerCase().includes(query) ||
        item.customerName.toLowerCase().includes(query) ||
        item.project.toLowerCase().includes(query) ||
        item.projectType.toLowerCase().includes(query)
      );
    });
  }, [sales, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredSales.length / entriesPerPage) || 1;
  const paginatedSales = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredSales.slice(start, start + entriesPerPage);
  }, [filteredSales, currentPage, entriesPerPage]);

  return (
    <div className="space-y-4">
      {/* Control Bar (Entries & Search) */}
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
                placeholder="Search sale..."
                className="w-full bg-background border border-input rounded pl-9 pr-3 py-1.5 text-xs focus:outline-none text-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--sidebar-foreground)] text-white font-medium select-none whitespace-nowrap">
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">PROJECT TYPE</th>
                <th className="py-3 px-3">PROJECT</th>
                <th className="py-3 px-3">TITLE/NAME OF WORK</th>
                <th className="py-3 px-3">CUSTOMER NAME</th>
                <th className="py-3 px-3">CODE</th>
                <th className="py-3 px-3">REF</th>
                <th className="py-3 px-3">DATE</th>
                <th className="py-3 px-3">GRAND TOTAL</th>
                <th className="py-3 px-3">ADDED BY</th>
                <th className="py-3 px-3">ATTACHMENT</th>
                <th className="py-3 px-3">APPROVE</th>
                <th className="py-3 px-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td
                    colSpan={13}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading data...
                  </td>
                </tr>
              ) : paginatedSales.length > 0 ? (
                paginatedSales.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/50 transition-colors align-middle whitespace-nowrap"
                  >
                    <td className="py-3 px-3 font-medium">{item.id}</td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {item.projectType}
                    </td>
                    <td className="py-3 px-3 font-medium">{item.project}</td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {item.titleOfWork}
                    </td>
                    <td className="py-3 px-3 font-medium">
                      {item.customerName}
                    </td>
                    <td className="py-3 px-3 font-mono">{item.code}</td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {item.ref}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {item.date}
                    </td>
                    <td className="py-3 px-3 font-medium">{item.grandTotal}</td>
                    <td className="py-3 px-3">{item.addedBy}</td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {item.attachment}
                    </td>
                    <td className="py-3 px-3 text-emerald-600 font-medium">
                      ✓ {item.approve}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Edit Button */}
                        <button
                          onClick={() => onEdit && onEdit(item)}
                          title="Edit"
                          className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white p-1.5 rounded shadow-sm transition-colors"
                        >
                          <FiEdit size={12} />
                        </button>
                        {/* View Button */}
                        <button
                          onClick={() => onView && onView(item)}
                          title="View"
                          className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white p-1.5 rounded shadow-sm transition-colors"
                        >
                          <FiEye size={12} />
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                          className="bg-[#ef4444] hover:bg-[#dc2626] text-white p-1.5 rounded shadow-sm transition-colors"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={13}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No data available in table
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
            {filteredSales.length > 0
              ? (currentPage - 1) * entriesPerPage + 1
              : 0}{" "}
            to {Math.min(currentPage * entriesPerPage, filteredSales.length)} of{" "}
            {filteredSales.length} entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded border border-border bg-card hover:bg-muted disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 bg-[var(--sidebar-foreground)] text-white rounded font-medium">
              {currentPage}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 rounded border border-border bg-card hover:bg-muted disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
