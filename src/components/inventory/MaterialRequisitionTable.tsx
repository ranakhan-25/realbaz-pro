"use client";

import type { MaterialRequisitionItem } from "@/app/(admin-dashbord)/dashboard/inventory/material-requisition/page";
import React, { useState, useEffect, useMemo } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiFileText,
  FiEdit,
  FiShoppingCart,
  FiRefreshCw,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "sonner";
import { materialRequisitionsApi, fallbackMaterialRequisitions } from "@/lib/inventoryApi";

interface MaterialRequisitionTableProps {
  refreshTrigger?: number;
  onEdit?: (item: MaterialRequisitionItem) => void;
  onView?: (item: MaterialRequisitionItem) => void;
}

export default function MaterialRequisitionTable({
  refreshTrigger,
  onEdit,
  onView,
}: MaterialRequisitionTableProps) {
  const [requisitions, setRequisitions] = useState<MaterialRequisitionItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | number | null>(null);

  // Fetching data from backend API
  useEffect(() => {
    const fetchRequisitions = async () => {
      try {
        setLoading(true);
        let raw = await materialRequisitionsApi.getAll().catch(() => null);
        if (!Array.isArray(raw) || raw.length === 0) {
          raw = fallbackMaterialRequisitions;
        }
        const list = raw.map((r: any, idx: number) => ({
          id: r.id || idx + 1,
          select: false,
          projectType: r.project_type || r.projectType || "Real Estate",
          project: r.project?.name || r.project_name || r.project || "Sheba Eyecon Tower",
          titleOfWork: r.title_of_work || r.titleOfWork || "Column Casting 5th Floor",
          code: r.req_no || r.code || `MR-2026-00${idx + 1}`,
          ref: r.ref || `REF-MR-10${idx + 1}`,
          date: r.date ? new Date(r.date).toLocaleDateString() : "-",
          demandDate: r.demand_date || r.demandDate ? new Date(r.demand_date || r.demandDate).toLocaleDateString() : "-",
          addedBy: r.added_by || r.addedBy || "Admin",
          approvalStatus: r.approvalStatus || "All Approvals Completed",
          approver: r.approver || "Project Manager",
          attachment: "-",
        }));
        setRequisitions(list);
      } catch (error) {
        console.error("Error fetching requisitions:", error);
        setRequisitions(
          fallbackMaterialRequisitions.map((r: any, idx: number) => ({
            id: r.id || idx + 1,
            select: false,
            projectType: r.projectType,
            project: r.project,
            titleOfWork: r.titleOfWork,
            code: r.code,
            ref: r.ref,
            date: r.date,
            demandDate: r.demandDate,
            addedBy: r.addedBy,
            approvalStatus: r.approvalStatus,
            approver: r.approver,
            attachment: "-",
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequisitions();
  }, [refreshTrigger]);

  // Select all checkbox handler
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setRequisitions(requisitions.map((item) => ({ ...item, select: checked })));
  };

  // Single select handler
  const handleSelectOne = (id: string | number, checked: boolean) => {
    setRequisitions(
      requisitions.map((item) =>
        item.id === id ? { ...item, select: checked } : item,
      ),
    );
  };

  // Delete handler
  const handleDelete = (id: string | number) => {
    if (confirm("Are you sure you want to delete this requisition?")) {
      setRequisitions(requisitions.filter((item) => item.id !== id));
    }
    setActiveDropdown(null);
  };

  // Search filter logic
  const filteredRequisitions = useMemo(() => {
    return requisitions.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        String(item.code || "").toLowerCase().includes(query) ||
        String(item.project || item.projectName || "").toLowerCase().includes(query) ||
        String(item.projectType || item.project_type || "").toLowerCase().includes(query) ||
        String(item.addedBy || item.added_by || "").toLowerCase().includes(query)
      );
    });
  }, [requisitions, searchQuery]);

  // Pagination logic
  const totalPages =
    Math.ceil(filteredRequisitions.length / entriesPerPage) || 1;
  const paginatedRequisitions = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredRequisitions.slice(start, start + entriesPerPage);
  }, [filteredRequisitions, currentPage, entriesPerPage]);

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
                placeholder="Search requisitions..."
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
                <th className="py-3 px-3 w-10">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      requisitions.length > 0 &&
                      requisitions.every((item) => item.select)
                    }
                    className="rounded border-input cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">PROJECT TYPE</th>
                <th className="py-3 px-3">PROJECT</th>
                <th className="py-3 px-3">TITLE/NAME OF WORK</th>
                <th className="py-3 px-3">CODE</th>
                <th className="py-3 px-3">REF</th>
                <th className="py-3 px-3">DATE</th>
                <th className="py-3 px-3">DEMAND DATE</th>
                <th className="py-3 px-3">ADDED BY</th>
                <th className="py-3 px-3">APPROVAL LAYER</th>
                <th className="py-3 px-3">ATTACHMENT</th>
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
              ) : paginatedRequisitions.length > 0 ? (
                paginatedRequisitions.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/50 transition-colors align-top whitespace-nowrap"
                  >
                    <td className="py-3 px-3 font-medium">{item.id}</td>
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={item.select}
                        onChange={(e) =>
                          handleSelectOne(item.id, e.target.checked)
                        }
                        className="rounded border-input cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {item.projectType}
                    </td>
                    <td className="py-3 px-3 font-medium">{item.project}</td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {item.titleOfWork}
                    </td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">
                      {item.code}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {item.ref}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {item.date}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {item.demandDate}
                    </td>
                    <td className="py-3 px-3">{item.addedBy}</td>
                    <td className="py-3 px-3 text-xs leading-relaxed text-emerald-600 font-medium">
                      <div>✓ All Approvals Completed</div>
                      {Boolean(item.approver && item.approver.includes("\n")) && (
                        <div className="text-muted-foreground">
                          ✓ {item.approver?.replace("\n", ", ")}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {item.attachment}
                    </td>
                    <td className="py-3 px-3 text-center relative">
                      {/* Action Dropdown Button */}
                      <div className="inline-block relative">
                        <button
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === item.id ? null : item.id,
                            )
                          }
                          className="flex items-center gap-1 bg-[#4f46e5] hover:bg-[#4338ca] text-white px-3 py-1.5 rounded text-xs font-medium shadow-sm transition-colors"
                        >
                          Action <FiChevronDown size={12} />
                        </button>

                        {/* Dropdown Menu (Styled exactly as requested) */}
                        {activeDropdown === item.id && (
                          <div className="absolute right-0 mt-1 w-52 bg-card border border-border rounded-lg shadow-xl z-20 p-2 space-y-1.5 text-left">
                            {/* View */}
                            <button
                              onClick={() => {
                                if (onView) onView(item);
                                setActiveDropdown(null);
                              }}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-[#8b5cf6] hover:bg-[#7c3aed] rounded-md transition-colors shadow-sm"
                            >
                              <FiFileText size={14} /> View
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => {
                                if (onEdit) onEdit(item);
                                setActiveDropdown(null);
                              }}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-[#06b6d4] hover:bg-[#0891b2] rounded-md transition-colors shadow-sm"
                            >
                              <FiEdit size={14} /> Edit
                            </button>

                            {/* Convert To Purchase */}
                            <button
                              onClick={() => {
                                toast.info(
                                  `Converting Requisition ${item.code} to Purchase...`,
                                );
                                setActiveDropdown(null);
                              }}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-[#06b6d4] hover:bg-[#0891b2] rounded-md transition-colors shadow-sm"
                            >
                              <FiShoppingCart size={14} /> Convert To Purchase
                            </button>

                            {/* Convert To Purchase Order */}
                            <button
                              onClick={() => {
                                toast.info(
                                  `Converting Requisition ${item.code} to Purchase Order...`,
                                );
                                setActiveDropdown(null);
                              }}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-[#06b6d4] hover:bg-[#0891b2] rounded-md transition-colors shadow-sm"
                            >
                              <FiRefreshCw size={14} /> Convert To Purchase
                              Order
                            </button>

                            {/* Convert To RFQ */}
                            <button
                              onClick={() => {
                                toast.info(
                                  `Converting Requisition ${item.code} to RFQ...`,
                                );
                                setActiveDropdown(null);
                              }}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-[#06b6d4] hover:bg-[#0891b2] rounded-md transition-colors shadow-sm"
                            >
                              <FiFileText size={14} /> Convert To RFQ
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-[#ef4444] hover:bg-[#dc2626] rounded-md transition-colors shadow-sm"
                            >
                              <FiTrash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
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
            {filteredRequisitions.length > 0
              ? (currentPage - 1) * entriesPerPage + 1
              : 0}{" "}
            to{" "}
            {Math.min(
              currentPage * entriesPerPage,
              filteredRequisitions.length,
            )}{" "}
            of {filteredRequisitions.length} entries
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
