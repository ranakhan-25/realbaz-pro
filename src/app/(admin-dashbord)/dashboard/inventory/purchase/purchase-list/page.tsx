"use client";

import PurchaseListTable from "@/components/inventory/PurchaseListTable";
import { RouteBreadcrumb } from "@/components/ui/RouteBreadcrumb";
import React, { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { purchasesApi } from "@/lib/inventoryApi";

export interface PurchaseListItem {
  id: string | number;
  projectType: string;
  project: string;
  titleOfWork: string;
  supplierName: string;
  code: string;
  reference: string;
  creditLedger: string;
  date: string;
  subTotal: number;
  discount: number;
  deliveryCharge: number;
  grandTotal: number;
  paid: number;
  due: number;
  attachment: string;
  note: string;
  addedBy: string;
  approvalStatus: string;
  approver: string;
}

const PurchaseListAccounts = () => {
  const router = useRouter();
  // Filter states
  const [dateRange, setDateRange] = useState("1 September, 2026 - 30 September, 2026");
  const [company, setCompany] = useState("Somikoron IT Ltd");
  const [supplier, setSupplier] = useState("");
  const [project, setProject] = useState("");
  const [titleOfWork, setTitleOfWork] = useState("");

  // Modal State for Create / Edit / View
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update" | "view">("create");
  const [selectedPurchase, setSelectedPurchase] = useState<Partial<PurchaseListItem>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Handler to open Create Module or go to add-purchase page
  const handleCreateNewPurchase = () => {
    router.push("/dashboard/inventory/purchase/add-purchase");
  };

  // Handler to open Edit/View Module passed to child
  const handleOpenModal = (item: PurchaseListItem, mode: "update" | "view") => {
    setModalMode(mode);
    setSelectedPurchase(item);
    setIsModalOpen(true);
  };

  // Delete handler
  const handleDelete = async (id: string | number, code: string) => {
    if (!window.confirm(`Are you sure you want to delete purchase "${code}"?`)) return;
    try {
      await purchasesApi.delete(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      console.error("Failed to delete purchase:", err);
      alert(err.message || "Failed to delete purchase");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 font-sans">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <RouteBreadcrumb />
          <h1 className="text-xl font-bold mt-1">Purchase List</h1>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* +Create New Purchase Button */}
          <button
            onClick={handleCreateNewPurchase}
            className="flex items-center gap-1.5 bg-[var(--lime)] hover:opacity-90 text-white px-4 py-2 rounded text-xs font-medium shadow-sm transition-all"
          >
            <FiPlus className="text-base" /> +Create New Purchase
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-card border border-border rounded p-4 shadow-sm mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Select Date
            </label>
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-background border border-input rounded px-3 py-1.5 text-xs text-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-background border border-input rounded px-3 py-1.5 text-xs text-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Supplier</label>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full bg-background border border-input rounded px-3 py-1.5 text-xs text-foreground"
            >
              <option value="">Select an option</option>
              <option value="Safety First Suppliers">Safety First Suppliers</option>
              <option value="Mohin Business solution">Mohin Business solution</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Project</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full bg-background border border-input rounded px-3 py-1.5 text-xs text-foreground"
            >
              <option value="">Select Project</option>
              <option value="Sheba Eyecon Tower">Sheba Eyecon Tower</option>
              <option value="Rifat Eyecon City">Rifat Eyecon City</option>
            </select>
          </div>
        </div>
      </div>

      {/* Child Component for Table */}
      <PurchaseListTable
        refreshTrigger={refreshTrigger}
        onEdit={(item) => handleOpenModal(item, "update")}
        onView={(item) => handleOpenModal(item, "view")}
        onDelete={handleDelete}
      />

      {/* Modal Module for Create / Update / View */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="font-bold text-lg capitalize text-foreground">
                {modalMode === "create" && "Create New Purchase Module"}
                {modalMode === "update" && "Update Purchase Module"}
                {modalMode === "view" && "View Purchase Details"}
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
                    Purchase Code
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === "view"}
                    value={selectedPurchase.code || ""}
                    onChange={(e) =>
                      setSelectedPurchase({ ...selectedPurchase, code: e.target.value })
                    }
                    className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === "view"}
                    value={selectedPurchase.project || ""}
                    onChange={(e) =>
                      setSelectedPurchase({ ...selectedPurchase, project: e.target.value })
                    }
                    className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === "view"}
                    value={selectedPurchase.supplierName || ""}
                    onChange={(e) =>
                      setSelectedPurchase({ ...selectedPurchase, supplierName: e.target.value })
                    }
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
                    value={selectedPurchase.grandTotal || 0}
                    onChange={(e) =>
                      setSelectedPurchase({
                        ...selectedPurchase,
                        grandTotal: Number(e.target.value),
                      })
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
                  onClick={() => {
                    alert(`${modalMode === "create" ? "Created" : "Updated"} successfully!`);
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 rounded bg-[var(--lime)] text-white text-sm font-medium hover:opacity-90 shadow-sm"
                >
                  {modalMode === "create" ? "Save Purchase" : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseListAccounts;
