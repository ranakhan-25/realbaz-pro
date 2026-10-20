"use client";

import SupplierList from "@/components/inventory/SupplierList";
import { RouteBreadcrumb } from "@/components/ui/RouteBreadcrumb";
import React, { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import type { Supplier } from "@/types/invetory";
import { suppliersApi } from "@/lib/inventoryApi";
import { toast } from "sonner";

const SupplierAccounts = () => {
  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "update" | "view">("add");
  const [selectedSupplier, setSelectedSupplier] = useState<Partial<Supplier>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open modal for adding a new supplier from Parent button
  const handleAddClick = () => {
    setModalMode("add");
    setSelectedSupplier({
      code: `SUP${Math.floor(1000000 + Math.random() * 9000000)}`,
      under: "Sundry Creditors",
      name: "",
      phone: "",
      company: "",
      email: "",
      address: "",
    });
    setIsModalOpen(true);
  };

  // Open modal for updating or viewing from Child component actions
  const handleOpenModal = (supplier: Supplier, mode: "update" | "view") => {
    setModalMode(mode);
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  // Form submit handler for Add/Update
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier.name) return;

    try {
      setIsSubmitting(true);
      const payload = {
        code: selectedSupplier.code || `SUP${Date.now().toString().slice(-6)}`,
        name: selectedSupplier.name,
        company: selectedSupplier.company || undefined,
        mobile: selectedSupplier.phone || (selectedSupplier as any).mobile || "01700000000",
        email: selectedSupplier.email || undefined,
        address: selectedSupplier.address || undefined,
        credit_limit: Number((selectedSupplier as any).credit_limit || 0),
        opening_balance: Number((selectedSupplier as any).opening_balance || 0),
      };

      if (modalMode === "add") {
        await suppliersApi.create(payload);
        toast.success("Supplier created successfully");
      } else if (modalMode === "update" && selectedSupplier.id) {
        await suppliersApi.update(selectedSupplier.id, payload);
        toast.success("Supplier updated successfully");
      }

      setRefreshTrigger((prev) => prev + 1);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save supplier:", err);
      toast.error(err.message || "Failed to save supplier");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler
  const handleDelete = async (id: string | number, name: string) => {
    try {
      await suppliersApi.delete(id);
      toast.success(`Supplier "${name}" deleted successfully`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      console.error("Failed to delete supplier:", err);
      toast.error(err.message || "Failed to delete supplier");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4 sm:p-6">
        <div>
          <RouteBreadcrumb />
          <p className="text-xl font-medium">Supplier Accounts</p>
        </div>
        {/* Parent Supplier Add Button */}
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 bg-[var(--lime)] hover:opacity-90 text-[var(--ink)] px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-all self-start md:self-auto"
        >
          <FiPlus className="text-base" /> Supplier Add
        </button>
      </div>

      {/* Pass action handlers to Child component */}
      <SupplierList
        refreshTrigger={refreshTrigger}
        onEdit={(supplier) => handleOpenModal(supplier, "update")}
        onView={(supplier) => handleOpenModal(supplier, "view")}
        onDelete={handleDelete}
      />

      {/* Shared Modal Form for Add / Update / View */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="font-display font-bold text-lg capitalize text-foreground">
                {modalMode === "add" && "Add New Supplier"}
                {modalMode === "update" && "Update Supplier"}
                {modalMode === "view" && "Supplier Details"}
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
                    value={selectedSupplier.code || ""}
                    onChange={(e) =>
                      setSelectedSupplier({ ...selectedSupplier, code: e.target.value })
                    }
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-60"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === "view"}
                    value={selectedSupplier.name || ""}
                    onChange={(e) =>
                      setSelectedSupplier({ ...selectedSupplier, name: e.target.value })
                    }
                    placeholder="Enter supplier name"
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === "view"}
                    value={selectedSupplier.company || ""}
                    onChange={(e) =>
                      setSelectedSupplier({ ...selectedSupplier, company: e.target.value })
                    }
                    placeholder="Company name"
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === "view"}
                    value={selectedSupplier.phone || ""}
                    onChange={(e) =>
                      setSelectedSupplier({ ...selectedSupplier, phone: e.target.value })
                    }
                    placeholder="Phone number"
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    disabled={modalMode === "view"}
                    value={selectedSupplier.email || ""}
                    onChange={(e) =>
                      setSelectedSupplier({ ...selectedSupplier, email: e.target.value })
                    }
                    placeholder="Email address"
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Under Group
                  </label>
                  <select
                    disabled={modalMode === "view"}
                    value={selectedSupplier.under || "Sundry Creditors"}
                    onChange={(e) =>
                      setSelectedSupplier({ ...selectedSupplier, under: e.target.value })
                    }
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  >
                    <option value="Sundry Creditors">Sundry Creditors</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Address
                </label>
                <textarea
                  disabled={modalMode === "view"}
                  rows={2}
                  value={selectedSupplier.address || ""}
                  onChange={(e) =>
                    setSelectedSupplier({ ...selectedSupplier, address: e.target.value })
                  }
                  placeholder="Address details"
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-60 resize-none"
                />
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-border text-sm font-medium hover:bg-muted transition-colors text-foreground"
                >
                  {modalMode === "view" ? "Close" : "Cancel"}
                </button>
                {modalMode !== "view" && (
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-[var(--lime)] text-[var(--ink)] text-sm font-medium hover:opacity-90 transition-all shadow-sm"
                  >
                    {modalMode === "add" ? "Save Supplier" : "Update Changes"}
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

export default SupplierAccounts;
