"use client";

import type { Supplier } from "@/types/invetory";
import React, { useState, useEffect, useMemo } from "react";
import {
  FiEdit,
  FiUser,
  FiTrash2,
  FiFileText,
  FiCheck,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
} from "react-icons/fi";

import { suppliersApi, fallbackSuppliers } from "@/lib/inventoryApi";

interface SupplierListProps {
  apiEndpoint?: string;
  refreshTrigger?: number;
  onEdit?: (supplier: Supplier) => void;
  onView?: (supplier: Supplier) => void;
  onDelete?: (id: string | number, name: string) => void;
}

export default function SupplierList({
  apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5002/realbizpro/api/v1"}/inventory/suppliers`,
  refreshTrigger,
  onEdit,
  onView,
  onDelete,
}: SupplierListProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetching data from backend API
  useEffect(() => {
    async function fetchSuppliers() {
      try {
        setLoading(true);
        let raw = await suppliersApi.getAll().catch(() => null);
        if (!Array.isArray(raw) || raw.length === 0) {
          raw = fallbackSuppliers;
        }
        const list = raw.map((s: any) => ({
          id: s.id,
          code: s.code || "",
          name: s.name || "",
          company: s.company || "",
          phone: s.mobile || s.phone || "",
          email: s.email || "",
          address: s.address || "",
          under: s.under || "Sundry Creditors",
          credit_limit: s.credit_limit || 0,
          opening_balance: s.opening_balance || 0,
        }));
        setSuppliers(list);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        setSuppliers(
          fallbackSuppliers.map((s: any) => ({
            id: s.id,
            code: s.code || "",
            name: s.name || "",
            company: s.company || "",
            phone: s.mobile || s.phone || "",
            email: s.email || "",
            address: s.address || "",
            under: "Sundry Creditors",
            credit_limit: s.credit_limit || 0,
            opening_balance: s.opening_balance || 0,
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSuppliers();
  }, [apiEndpoint, refreshTrigger]);

  // Filtering suppliers based on search query and selected group
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.phone && item.phone.includes(searchQuery)) ||
        (item.address && item.address.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGroup = selectedGroup ? item.under === selectedGroup : true;

      return matchesSearch && matchesGroup;
    });
  }, [suppliers, searchQuery, selectedGroup]);

  // Pagination calculation logic
  const totalPages = Math.ceil(filteredSuppliers.length / entriesPerPage) || 1;
  const paginatedSuppliers = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredSuppliers.slice(start, start + entriesPerPage);
  }, [filteredSuppliers, currentPage, entriesPerPage]);

  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 font-sans transition-colors duration-200">
      {/* Filter and Action Bar (Excel, PDF, Search) */}
      <div className="bg-card border border-border rounded p-4 shadow-sm mb-6 space-y-4">
        {/* Chart Of Group Dropdown */}
        <div className="max-w-xs">
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Chart Of Group(Under)
          </label>
          <select
            value={selectedGroup}
            onChange={(e) => {
              setSelectedGroup(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
          >
            <option value="">Select value</option>
            <option value="Sundry Creditors">Sundry Creditors</option>
          </select>
        </div>

        {/* Export Buttons and Search Input */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded text-xs font-medium shadow-sm transition-colors">
              <FiCheck className="text-sm" /> Excel
            </button>
            <button className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded text-xs font-medium shadow-sm transition-colors">
              <FiFileText className="text-sm" /> PDF
            </button>
          </div>

          {/* Search Box */}
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
                placeholder="Search suppliers..."
                className="w-full bg-background border border-input rounded-md pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Entries Per Page Selector */}
      <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
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
      </div>

      {/* Table Section (Responsive & Readable) */}
      <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[var(--sidebar-foreground)] text-white font-medium select-none">
                <th className="py-3 px-4 w-16">ID</th>
                <th className="py-3 px-4">CODE</th>
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4 hidden md:table-cell">COMPANY</th>
                <th className="py-3 px-4 hidden sm:table-cell">PHONE</th>
                <th className="py-3 px-4 hidden lg:table-cell">EMAIL</th>
                <th className="py-3 px-4 hidden md:table-cell">ADDRESS</th>
                <th className="py-3 px-4">UNDER</th>
                <th className="py-3 px-4 text-center w-28">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-muted-foreground">
                    Loading suppliers...
                  </td>
                </tr>
              ) : paginatedSuppliers.length > 0 ? (
                paginatedSuppliers.map((supplier, index) => {
                  const serialNumber = (currentPage - 1) * entriesPerPage + index + 1;
                  return (
                    <tr key={supplier.id || index} className="hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{serialNumber}</td>
                      <td className="py-3 px-4 font-mono text-xs">{supplier.code}</td>
                      <td className="py-3 px-4 font-medium">{supplier.name}</td>
                      <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">
                        {supplier.company || "-"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">
                        {supplier.phone || "-"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">
                        {supplier.email || "-"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">
                        {supplier.address || "-"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{supplier.under}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Button */}
                          <button
                            onClick={() => onEdit && onEdit(supplier)}
                            title="Edit"
                            className=" p-1.5 rounded transition-colors"
                          >
                            <FiEdit size={13} />
                          </button>
                          {/* View Profile Button */}
                          <button
                            onClick={() => onView && onView(supplier)}
                            title="View"
                            className=" p-1.5 rounded transition-colors"
                          >
                            <FiEye size={13} />
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => onDelete && onDelete(supplier.id, supplier.name)}
                            title="Delete"
                            className="p-1.5 rounded transition-colors text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-muted-foreground">
                    No matching suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border gap-4 text-xs text-muted-foreground">
          <div>
            Showing {filteredSuppliers.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * entriesPerPage, filteredSuppliers.length)} of{" "}
            {filteredSuppliers.length} entries
          </div>

          {/* Pagination Page Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft size={14} /> Previous
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
                          ? "bg-[var(--signal)] text-white"
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
              Next <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
