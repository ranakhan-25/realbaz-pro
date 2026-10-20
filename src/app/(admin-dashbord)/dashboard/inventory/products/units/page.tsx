"use client";

import UnitList from "@/components/inventory/UnitList";
import { RouteBreadcrumb } from "@/components/ui/RouteBreadcrumb";
import React, { useState } from "react";
import { FiPlus, FiX, FiArrowLeft } from "react-icons/fi";
import { unitsApi } from "@/lib/inventoryApi";

// Unit type definition
export interface Unit {
  id: string | number;
  code: string;
  name: string;
  conversionUnit?: string;
  rate?: string;
}

const UnitAccounts = () => {
  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "update" | "view">("add");
  const [selectedUnit, setSelectedUnit] = useState<Partial<Unit>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open modal for adding a new unit
  const handleAddClick = () => {
    setModalMode("add");
    setSelectedUnit({
      code: `UN${Math.floor(1000 + Math.random() * 9000)}`,
      name: "",
      conversionUnit: "",
      rate: "",
    });
    setIsModalOpen(true);
  };

  // Open modal for updating or viewing
  const handleOpenModal = (unit: Unit, mode: "update" | "view") => {
    setModalMode(mode);
    setSelectedUnit(unit);
    setIsModalOpen(true);
  };

  // Form submit handler for Add/Update
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit.name) return;

    try {
      setIsSubmitting(true);
      if (modalMode === "add") {
        await unitsApi.create({
          code: selectedUnit.code || `UN${Date.now().toString().slice(-4)}`,
          name: selectedUnit.name,
        });
      } else if (modalMode === "update" && selectedUnit.id) {
        await unitsApi.update(selectedUnit.id, {
          code: selectedUnit.code || "",
          name: selectedUnit.name,
        });
      }

      setRefreshTrigger((prev) => prev + 1);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save unit:", err);
      alert(err.message || "Failed to save unit");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler
  const handleDelete = async (id: string | number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete unit "${name}"?`)) return;
    try {
      await unitsApi.delete(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      console.error("Failed to delete unit:", err);
      alert(err.message || "Failed to delete unit");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 font-sans">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <RouteBreadcrumb />
          <h1 className="text-xl font-bold mt-1">Unit List</h1>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Add Unit Button */}
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-[var(--lime)] hover:opacity-90 text-white px-4 py-2 rounded text-sm font-medium shadow-sm transition-all"
          >
            <FiPlus className="text-base" /> +Add Unit
          </button>

          {/* Back to Previous Button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-[#334155] hover:bg-[#1e293b] text-white px-4 py-2 rounded text-sm font-medium shadow-sm transition-all"
          >
            <FiArrowLeft className="text-base" /> Back to Previous
          </button>
        </div>
      </div>

      {/* Child Component for Listing & Filtering */}
      <UnitList
        refreshTrigger={refreshTrigger}
        onEdit={(unit) => handleOpenModal(unit, "update")}
        onView={(unit) => handleOpenModal(unit, "view")}
        onDelete={handleDelete}
      />

      {/* Shared Modal Form for Add / Update / View */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="font-bold text-lg capitalize text-foreground">
                {modalMode === "add" && "Add New Unit"}
                {modalMode === "update" && "Update Unit"}
                {modalMode === "view" && "Unit Details"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === "view"}
                    value={selectedUnit.code || ""}
                    onChange={(e) => setSelectedUnit({ ...selectedUnit, code: e.target.value })}
                    placeholder="Enter code"
                    className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === "view"}
                    value={selectedUnit.name || ""}
                    onChange={(e) => setSelectedUnit({ ...selectedUnit, name: e.target.value })}
                    placeholder="e.g. Kg, Pcs, Bag"
                    className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Conversion Unit
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === "view"}
                    value={selectedUnit.conversionUnit || ""}
                    onChange={(e) =>
                      setSelectedUnit({ ...selectedUnit, conversionUnit: e.target.value })
                    }
                    placeholder="Conversion unit"
                    className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Rate
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === "view"}
                    value={selectedUnit.rate || ""}
                    onChange={(e) => setSelectedUnit({ ...selectedUnit, rate: e.target.value })}
                    placeholder="Rate"
                    className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded border border-border text-sm font-medium hover:bg-muted transition-colors text-foreground"
                >
                  {modalMode === "view" ? "Close" : "Cancel"}
                </button>
                {modalMode !== "view" && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded bg-[var(--lime)] text-white text-sm font-medium hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : modalMode === "add"
                      ? "Save Unit"
                      : "Update Changes"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitAccounts;
