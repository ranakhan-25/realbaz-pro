"use client";

import type { MaterialUsageItem } from "@/app/(admin-dashbord)/dashboard/inventory/adjustment/material-usage/page";
import React, { useState, useEffect, useMemo } from "react";
import { FiEdit, FiTrash2, FiEye, FiSearch } from "react-icons/fi";


import { materialUsageApi, fallbackMaterialUsage } from "@/lib/inventoryApi";

interface MaterialUsageTableProps {
  apiEndpoint?: string;
  refreshTrigger?: number;
  onEdit?: (item: MaterialUsageItem) => void;
  onView?: (item: MaterialUsageItem) => void;
  onDelete?: (id: string | number, code: string) => void;
}

export default function MaterialUsageTable({
  apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5002/realbizpro/api/v1"}/inventory/material-usage`,
  refreshTrigger,
  onEdit,
  onView,
  onDelete,
}: MaterialUsageTableProps) {
  const [usages, setUsages] = useState<MaterialUsageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetching data from API with default fallback
  useEffect(() => {
    const fetchMaterialUsages = async () => {
      try {
        setLoading(true);
        let raw = await materialUsageApi.getAll().catch(() => null);
        if (!Array.isArray(raw) || raw.length === 0) {
          raw = fallbackMaterialUsage;
        }
        const list = raw.map((u: any, idx: number) => ({
          id: u.id,
          projectType: u.project_type || u.projectType || "Commercial",
          project: u.project?.name || u.project_name || (typeof u.project === "string" ? u.project : "Hena Heights (PRJ-1001)"),
          titleOfWork: u.title_of_work || u.titleOfWork || "RCC Casting (Beam & Column)",
          task: u.task || "Beam Concreting Level-4",
          workerStaffName: u.worker_staff_name || u.workerStaffName || "Rafiqul Islam (Site Engineer)",
          code: u.usage_no || u.code || `MU-2026-00${idx + 1}`,
          purchaseGrn: u.purchase_grn || "-",
          date: u.date ? new Date(u.date).toLocaleDateString() : "-",
          subTotal: Number(u.subtotal || u.subTotal || 0),
          grandTotal: Number(u.grand_total || u.grandTotal || 0),
          addedBy: u.added_by || u.addedBy || "Admin",
          attachment: "-",
          approvalStatus: "All Approvals Completed",
          approver: "Admin",
        }));
        setUsages(list);
      } catch (error) {
        console.error("Error fetching material usages:", error);
        setUsages(
          fallbackMaterialUsage.map((u: any, idx: number) => ({
            id: u.id,
            projectType: "Commercial",
            project: u.project_name,
            titleOfWork: u.title_of_work,
            task: u.task,
            workerStaffName: u.worker_staff_name,
            code: u.usage_no || `MU-2026-00${idx + 1}`,
            purchaseGrn: "-",
            date: u.date ? new Date(u.date).toLocaleDateString() : "-",
            subTotal: 0,
            grandTotal: 0,
            addedBy: "Admin",
            attachment: "-",
            approvalStatus: "All Approvals Completed",
            approver: "Admin",
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMaterialUsages();
  }, [apiEndpoint, refreshTrigger]);

  // Delete handler
  const handleDelete = (id: number | string) => {
    if (confirm("Are you sure you want to delete this material usage?")) {
      setUsages(usages.filter((item) => item.id !== id));
    }
  };

  // Filter logic
  const filteredUsages = useMemo(() => {
    return usages.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        String(item.code || item.usage_no || "").toLowerCase().includes(query) ||
        String(typeof item.project === "object" ? item.project?.name : (item.project || item.project_name || "")).toLowerCase().includes(query) ||
        String(item.purchaseGrn || item.purchase_grn || "").toLowerCase().includes(query) ||
        String(item.workerStaffName || item.worker_staff_name || "").toLowerCase().includes(query)
      );
    });
  }, [usages, searchQuery]);

  // Totals calculation
  const totalSubTotal = filteredUsages.reduce(
    (acc, curr) => acc + (curr.subTotal ?? curr.subtotal ?? 0),
    0,
  );
  const totalGrandTotal = filteredUsages.reduce(
    (acc, curr) => acc + (curr.grandTotal ?? curr.grand_total ?? 0),
    0,
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsages.length / entriesPerPage) || 1;
  const paginatedUsages = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredUsages.slice(start, start + entriesPerPage);
  }, [filteredUsages, currentPage, entriesPerPage]);

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
                placeholder="Search material usage..."
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
                <th className="py-3 px-3">TASK</th>
                <th className="py-3 px-3">WORKER/STAFF NAME</th>
                <th className="py-3 px-3">CODE</th>
                <th className="py-3 px-3">PURCHASE/GRN</th>
                <th className="py-3 px-3">DATE</th>
                <th className="py-3 px-3">SUB TOTAL</th>
                <th className="py-3 px-3">GRAND TOTAL</th>
                <th className="py-3 px-3">ADDED BY</th>
                <th className="py-3 px-3">ATTACHMENT</th>
                <th className="py-3 px-3">APPROVAL</th>
                <th className="py-3 px-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td
                    colSpan={15}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading data...
                  </td>
                </tr>
              ) : paginatedUsages.length > 0 ? (
                paginatedUsages.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/50 transition-colors align-top whitespace-nowrap"
                  >
                    <td className="py-3 px-3 font-medium">{item.id}</td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {item.projectType}
                    </td>
                    <td className="py-3 px-3 font-medium">{item.project}</td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {item.titleOfWork}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {item.task}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {item.workerStaffName}
                    </td>
                    <td className="py-3 px-3 font-mono">{item.code}</td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">
                      {item.purchaseGrn}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {item.date}
                    </td>
                    <td className="py-3 px-3">{(item.subTotal ?? item.subtotal ?? 0).toFixed(2)}</td>
                    <td className="py-3 px-3 font-medium">
                      {(item.grandTotal ?? item.grand_total ?? 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-3">{item.addedBy}</td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {item.attachment}
                    </td>
                    <td className="py-3 px-3 text-xs leading-relaxed text-emerald-600 font-medium">
                      <div>✓ All Approvals Completed</div>
                      {Boolean(item.approver) && (
                        <div className="text-muted-foreground">
                          ✓ {item.approver?.replace("\n", ", ")}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* View Button */}
                        <button
                          onClick={() => onView && onView(item)}
                          title="View"
                          className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white p-1.5 rounded shadow-sm transition-colors"
                        >
                          <FiEye size={12} />
                        </button>
                        {/* Edit Button */}
                        <button
                          onClick={() => onEdit && onEdit(item)}
                          title="Edit"
                          className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white p-1.5 rounded shadow-sm transition-colors"
                        >
                          <FiEdit size={12} />
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() =>
                            onDelete
                              ? onDelete(item.id, item.code || "")
                              : handleDelete(item.id)
                          }
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
                    colSpan={15}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No data available in table
                  </td>
                </tr>
              )}
            </tbody>

            {/* Total Footer Row */}
            <tfoot>
              <tr className="bg-muted/50 font-bold border-t-2 border-border text-foreground">
                <td colSpan={9} className="py-3 px-3 uppercase">
                  Total
                </td>
                <td className="py-3 px-3">{totalSubTotal.toFixed(2)}</td>
                <td className="py-3 px-3">{totalGrandTotal.toFixed(2)}</td>
                <td colSpan={4}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border gap-4 text-xs text-muted-foreground">
          <div>
            Showing{" "}
            {filteredUsages.length > 0
              ? (currentPage - 1) * entriesPerPage + 1
              : 0}{" "}
            to {Math.min(currentPage * entriesPerPage, filteredUsages.length)}{" "}
            of {filteredUsages.length} entries
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
