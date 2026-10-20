"use client";

import type { PurchaseListItem } from "@/app/(admin-dashbord)/dashboard/inventory/purchase/purchase-list/page";
import React, { useState, useMemo } from "react";
import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiFileText,
  FiDownload,
  FiSearch,
  FiLayers,
} from "react-icons/fi";

import { toast } from "sonner";
import { purchasesApi, fallbackPurchases } from "@/lib/inventoryApi";

interface PurchaseListTableProps {
  apiEndpoint?: string;
  refreshTrigger?: number;
  onEdit?: (item: PurchaseListItem) => void;
  onView?: (item: PurchaseListItem) => void;
  onDelete?: (id: string | number, code: string) => void;
}

export default function PurchaseListTable({
  apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5002/realbizpro/api/v1"}/inventory/purchases`,
  refreshTrigger,
  onEdit,
  onView,
  onDelete,
}: PurchaseListTableProps) {
  const [purchases, setPurchases] = useState<PurchaseListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    async function fetchPurchases() {
      try {
        setLoading(true);
        let raw = await purchasesApi.getAll().catch(() => null);
        if (!Array.isArray(raw) || raw.length === 0) {
          raw = fallbackPurchases;
        }
        const list = raw.map((p: any, idx: number) => ({
          id: p.id,
          projectType: p.project_type || p.projectType || "Commercial",
          project: p.project?.name || p.project_name || p.project || "Dhaka Commercial Center",
          titleOfWork: p.title_of_work || p.titleOfWork || "RCC Works",
          supplierName: p.supplier?.name || p.supplier_name || p.supplierName || (typeof p.supplier === "string" ? p.supplier : "Meghna Rebar & Building Supply"),
          code: p.purchase_no || p.invoice_no || p.code || `PUR-2026-00${idx + 1}`,
          reference: p.reference || `REF-PUR-${idx + 1}`,
          creditLedger: "Sundry Creditors",
          date: p.date ? new Date(p.date).toLocaleDateString() : "-",
          subTotal: Number(p.subtotal || p.subTotal || 0),
          discount: Number(p.discount || 0),
          deliveryCharge: Number(p.delivery_charge || p.deliveryCharge || 0),
          grandTotal: Number(p.grand_total || p.grandTotal || 0),
          paid: Number(p.paid_amount || p.paid || 0),
          due: Number(p.due_amount || p.due || 0),
          attachment: "-",
          note: p.note || "-",
          addedBy: p.added_by || p.addedBy || "Admin",
          approvalStatus: "All Approvals Completed",
          approver: "Admin",
        }));
        setPurchases(list);
      } catch (err) {
        console.error("Could not fetch purchases:", err);
        setPurchases(
          fallbackPurchases.map((p: any, idx: number) => ({
            id: p.id,
            projectType: p.project_type || "Commercial",
            project: p.project || "Dhaka Commercial Center",
            titleOfWork: "RCC Works",
            supplierName: p.supplier?.name || "Supplier",
            code: p.purchase_no || `PUR-2026-00${idx + 1}`,
            reference: `REF-PUR-${idx + 1}`,
            creditLedger: "Sundry Creditors",
            date: p.date ? new Date(p.date).toLocaleDateString() : "-",
            subTotal: Number(p.subtotal || 0),
            discount: Number(p.discount || 0),
            deliveryCharge: Number(p.delivery_charge || 0),
            grandTotal: Number(p.grand_total || 0),
            paid: Number(p.paid_amount || 0),
            due: Number(p.due_amount || 0),
            attachment: "-",
            note: "-",
            addedBy: "Admin",
            approvalStatus: "All Approvals Completed",
            approver: "Admin",
          }))
        );
      } finally {
        setLoading(false);
      }
    }
    fetchPurchases();
  }, [apiEndpoint, refreshTrigger]);

  const handleDelete = (id: number | string) => {
    if (confirm("Are you sure you want to delete this purchase?")) {
      setPurchases(purchases.filter((item) => item.id !== id));
    }
  };

  const filteredPurchases = useMemo(() => {
    return purchases.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.code.toLowerCase().includes(query) ||
        item.supplierName.toLowerCase().includes(query) ||
        item.project.toLowerCase().includes(query)
      );
    });
  }, [purchases, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="bg-card border border-border rounded p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.info("Exporting to Excel...")}
              className="flex items-center gap-1.5 bg-[#10b981] text-white px-3.5 py-1.5 rounded text-xs font-medium"
            >
              <FiDownload className="text-sm" /> Excel
            </button>
            <button
              onClick={() => toast.info("Exporting to PDF...")}
              className="flex items-center gap-1.5 bg-[#ef4444] text-white px-3.5 py-1.5 rounded text-xs font-medium"
            >
              <FiFileText className="text-sm" /> PDF
            </button>
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
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search purchase..."
                className="w-full bg-background border border-input rounded pl-9 pr-3 py-1.5 text-xs text-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--sidebar-foreground)] text-white font-medium select-none whitespace-nowrap">
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">PROJECT TYPE</th>
                <th className="py-3 px-3">PROJECT</th>
                <th className="py-3 px-3">SUPPLIER NAME</th>
                <th className="py-3 px-3">CODE</th>
                <th className="py-3 px-3">GRAND TOTAL</th>
                <th className="py-3 px-3">PAID</th>
                <th className="py-3 px-3">DUE</th>
                <th className="py-3 px-3">APPROVAL LAYER</th>
                <th className="py-3 px-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-6 text-center text-xs text-muted-foreground">
                    Loading purchases...
                  </td>
                </tr>
              ) : filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-6 text-center text-xs text-muted-foreground">
                    No data available in table
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-muted/50 transition-colors align-top whitespace-nowrap"
                >
                  <td className="py-3 px-3 font-medium">{item.id}</td>
                  <td className="py-3 px-3 text-muted-foreground">
                    {item.projectType}
                  </td>
                  <td className="py-3 px-3 font-medium">{item.project}</td>
                  <td className="py-3 px-3 font-medium">{item.supplierName}</td>
                  <td className="py-3 px-3 font-mono">{item.code}</td>
                  <td className="py-3 px-3 font-medium">{item.grandTotal}</td>
                  <td className="py-3 px-3">{item.paid}</td>
                  <td className="py-3 px-3">{item.due}</td>
                  <td className="py-3 px-3 text-xs text-emerald-600 font-medium">
                    <div>✓ All Approvals Completed</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() =>
                          toast.info(`Material Usages for ${item.code}`)
                        }
                        className="flex items-center gap-1 bg-[#00bcd4] text-white px-2 py-1 rounded text-[10px] font-medium w-full justify-center"
                      >
                        <FiLayers size={10} /> Material Usages
                      </button>
                      <div className="flex items-center gap-1 w-full justify-center">
                        {/* Edit Button */}
                        <button
                          onClick={() => onEdit && onEdit(item)}
                          title="Edit"
                          className="bg-[#0ea5e9] text-white p-1 rounded shadow-sm hover:opacity-90"
                        >
                          <FiEdit size={12} />
                        </button>
                        {/* View Button */}
                        <button
                          onClick={() => onView && onView(item)}
                          title="View"
                          className="bg-[#8b5cf6] text-white p-1 rounded shadow-sm hover:opacity-90"
                        >
                          <FiEye size={12} />
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => (onDelete ? onDelete(item.id, item.code) : handleDelete(item.id))}
                          title="Delete"
                          className="bg-[#ef4444] text-white p-1 rounded shadow-sm hover:opacity-90"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
