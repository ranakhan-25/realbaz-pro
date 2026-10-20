"use client";

import SaleListTable from "@/components/inventory/SaleListTable";
import { RouteBreadcrumb } from "@/components/ui/RouteBreadcrumb";
import React, { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { toast } from "sonner";

export interface SaleListItem {
  id: number;
  projectType: string;
  project: string;
  titleOfWork: string;
  customerName: string;
  code: string;
  ref: string;
  date: string;
  grandTotal: number;
  addedBy: string;
  attachment: string;
  approve: string;
}

const SaleListAccounts = () => {
  // Modal State for Create / Edit / View
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update" | "view">("create");
  const [selectedSale, setSelectedSale] = useState<Partial<SaleListItem>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler to open Create Module
  const handleCreateNewSale = () => {
    setModalMode("create");
    setSelectedSale({
      code: `SALE-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split("T")[0],
      projectType: "Real Estate",
      project: "Sheba Eyecon Tower",
      customerName: "",
      grandTotal: 0,
    });
    setIsModalOpen(true);
  };

  // Handler to open Edit/View Module passed to child
  const handleOpenModal = (item: SaleListItem, mode: "update" | "view") => {
    setModalMode(mode);
    setSelectedSale(item);
    setIsModalOpen(true);
  };

  const handleSaveSale = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedSale),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to save sale");
      }

      toast.success(
        `${modalMode === "create" ? "Sale Created" : "Sale Updated"} successfully!`,
      );
      setRefreshTrigger((prev) => prev + 1);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save sale:", err);
      toast.error(err.message || "Failed to save sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 font-sans">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <RouteBreadcrumb />
          <h1 className="text-xl font-bold mt-1">Sale List</h1>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* +New Sale Button */}
          <button
            onClick={handleCreateNewSale}
            className="flex items-center gap-1.5 bg-[var(--lime)] hover:opacity-95 text-white px-4 py-2 rounded text-xs font-medium shadow-sm transition-all"
          >
            <FiPlus className="text-base" /> +New Sale
          </button>
        </div>
      </div>

      {/* Child Component for Table, API fetching & Default Data fallback */}
      <SaleListTable
        refreshTrigger={refreshTrigger}
        onEdit={(item) => handleOpenModal(item, "update")}
        onView={(item) => handleOpenModal(item, "view")}
      />

      {/* Modal Module for Create / Update / View */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="font-bold text-lg capitalize text-foreground">
                {modalMode === "create" && "Create New Sale Module"}
                {modalMode === "update" && "Update Sale Module"}
                {modalMode === "view" && "View Sale Details"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Sale Code
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === "view"}
                    value={selectedSale.code || ""}
                    onChange={(e) => setSelectedSale({ ...selectedSale, code: e.target.value })}
                    className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === "view"}
                    value={selectedSale.customerName || ""}
                    onChange={(e) =>
                      setSelectedSale({ ...selectedSale, customerName: e.target.value })
                    }
                    className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === "view"}
                    value={selectedSale.project || ""}
                    onChange={(e) => setSelectedSale({ ...selectedSale, project: e.target.value })}
                    className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Grand Total
                  </label>
                  <input
                    type="number"
                    disabled={modalMode === "view"}
                    value={selectedSale.grandTotal || 0}
                    onChange={(e) =>
                      setSelectedSale({ ...selectedSale, grandTotal: Number(e.target.value) })
                    }
                    className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded border border-border text-sm font-medium hover:bg-muted text-foreground"
              >
                {modalMode === "view" ? "Close" : "Cancel"}
              </button>
              {modalMode !== "view" && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSaveSale}
                  className="px-4 py-2 rounded bg-[var(--lime)] text-white text-sm font-medium hover:opacity-90 shadow-sm disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Saving..."
                    : modalMode === "create"
                    ? "Save Sale"
                    : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleListAccounts;
