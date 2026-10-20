"use client";

import type { Unit } from "@/app/(admin-dashbord)/dashboard/inventory/products/units/page";
import React, { useState, useEffect, useMemo } from "react";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { API_BASE, unitsApi, fallbackUnits } from "@/lib/inventoryApi";

interface UnitListProps {
  apiEndpoint?: string;
  refreshTrigger?: number;
  onEdit?: (unit: Unit) => void;
  onView?: (unit: Unit) => void;
  onDelete?: (id: string | number, name: string) => void;
}

export default function UnitList({
  apiEndpoint = `${API_BASE}/inventory/units`,
  refreshTrigger,
  onEdit,
  onView,
  onDelete,
}: UnitListProps) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetching data from backend API
  useEffect(() => {
    async function fetchUnits() {
      try {
        setLoading(true);
        let raw = await unitsApi.getAll().catch(() => null);
        if (!Array.isArray(raw) || raw.length === 0) {
          raw = fallbackUnits;
        }
        const list = raw.map((u: any) => ({
          id: u.id,
          code: u.code || "",
          name: u.name || "",
          conversionUnit: u.conversionUnit || "",
          rate: u.rate || "",
        }));
        setUnits(list);
      } catch (error) {
        console.error("Error fetching units:", error);
        setUnits(
          fallbackUnits.map((u: any) => ({
            id: u.id,
            code: u.code || "",
            name: u.name || "",
            conversionUnit: u.conversionUnit || "",
            rate: u.rate || "",
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUnits();
  }, [apiEndpoint, refreshTrigger]);

  // Fallback local delete handler
  const handleDelete = (id: number | string) => {
    if (confirm("Are you sure you want to delete this unit?")) {
      setUnits((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Filter units based on Search query
  const filteredUnits = useMemo(() => {
    return units.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Boolean(item.conversionUnit?.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });
  }, [units, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUnits.length / entriesPerPage) || 1;
  const paginatedUnits = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredUnits.slice(start, start + entriesPerPage);
  }, [filteredUnits, currentPage, entriesPerPage]);

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
                placeholder="Search units..."
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
                <th className="py-3 px-4">CONVERSION UNIT</th>
                <th className="py-3 px-4">RATE</th>
                <th className="py-3 px-4 text-center w-28">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading units...
                  </td>
                </tr>
              ) : paginatedUnits.length > 0 ? (
                paginatedUnits.map((unit, index) => {
                  const serialNumber =
                    (currentPage - 1) * entriesPerPage + index + 1;
                  return (
                    <tr
                      key={unit.id || index}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{serialNumber}</td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {unit.code || "-"}
                      </td>
                      <td className="py-3 px-4 font-medium">{unit.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {unit.conversionUnit || "-"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {unit.rate || "-"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Button */}
                          <button
                            onClick={() => onEdit && onEdit(unit)}
                            title="Edit"
                            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white p-1.5 rounded transition-colors shadow-sm"
                          >
                            <FiEdit size={14} />
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() =>
                              onDelete
                                ? onDelete(unit.id, unit.name)
                                : handleDelete(unit.id)
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
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No matching units found.
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
            {filteredUnits.length > 0
              ? (currentPage - 1) * entriesPerPage + 1
              : 0}{" "}
            to {Math.min(currentPage * entriesPerPage, filteredUnits.length)} of{" "}
            {filteredUnits.length} entries
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
