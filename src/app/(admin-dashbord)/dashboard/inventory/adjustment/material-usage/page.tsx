"use client";

import MaterialUsageTable from "@/components/inventory/MaterialUsageTable";
import { RouteBreadcrumb } from "@/components/ui/RouteBreadcrumb";
import React, { useState, useEffect } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { materialUsageApi, itemsApi } from "@/lib/inventoryApi";
import { toast } from "sonner";

export interface MaterialUsageItem {
  id: string | number;
  usage_no?: string;
  code?: string;
  date?: string;
  note?: string;
  company_id?: number;
  projectType?: string;
  project_type?: string;
  project?: string | any;
  projectName?: string;
  project_name?: string;
  projectId?: string;
  project_id?: number;
  site?: string | any;
  siteName?: string;
  site_name?: string;
  site_id?: number;
  titleOfWork?: string;
  title_of_work?: string;
  task?: string;
  task_id?: number;
  workerStaffName?: string;
  worker_staff_name?: string;
  worker_id?: number;
  category?: string;
  item_code?: string;
  item_name?: string;
  quantity?: number;
  unit?: string;
  purchaseGrn?: string;
  purchase_grn?: string;
  subTotal?: number;
  subtotal?: number;
  grandTotal?: number;
  grand_total?: number;
  addedBy?: string;
  added_by?: string;
  createdBy?: string;
  created_by?: string;
  attachment?: string;
  approvalStatus?: string;
  status?: string;
  approver?: string;
  items?: any[];
  items_count?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function MaterialUsageAccounts() {
  // Filter states
  const [dateRange, setDateRange] = useState("1 September, 2026 - 30 September, 2026");
  const [company, setCompany] = useState("Somikoron IT Ltd");
  const [supplier, setSupplier] = useState("");
  const [project, setProject] = useState("");
  const [site, setSite] = useState("");
  const [titleOfWork, setTitleOfWork] = useState("");
  const [task, setTask] = useState("");

  // Modal State for Create / Edit / View
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update" | "view">("create");
  const [selectedUsage, setSelectedUsage] = useState<Partial<MaterialUsageItem>>({});
  const [itemsList, setItemsList] = useState<any[]>([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [usageQty, setUsageQty] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadItems() {
      try {
        const itms = await itemsApi.getAll().catch(() => []);
        if (Array.isArray(itms)) {
          setItemsList(itms);
          if (itms.length > 0 && !selectedItemId) {
            setSelectedItemId(itms[0].id);
          }
        }
      } catch (err) {
        console.warn("Could not load items for material usage:", err);
      }
    }
    loadItems();
  }, []);

  // Handler to open Create Module
  const handleCreateNewUsage = () => {
    setModalMode("create");
    setSelectedUsage({
      code: `MU${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split("T")[0],
      projectType: "Office",
      project: "PRJ-1001 - Dhaka Commercial Center",
    });
    if (itemsList.length > 0) setSelectedItemId(itemsList[0].id);
    setUsageQty(1);
    setIsModalOpen(true);
  };

  // Handler to open Edit/View Module passed to child table
  const handleOpenModal = (item: MaterialUsageItem, mode: "update" | "view") => {
    setModalMode(mode);
    setSelectedUsage(item);
    setIsModalOpen(true);
  };

  // Save handler for Create/Update
  const handleSaveUsage = async () => {
    try {
      setIsSubmitting(true);
      const chosenItemId = selectedItemId || itemsList[0]?.id || "item-01";

      const payload: any = {
        date: selectedUsage.date && !isNaN(Date.parse(selectedUsage.date))
          ? new Date(selectedUsage.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        note: `Material usage for ${selectedUsage.project || "site"}`,
        items: [{ item_id: chosenItemId, quantity: Number(usageQty || 1) }],
        projectId: "PRJ-1001",
      };

      await materialUsageApi.create(payload);
      toast.success(
        `${modalMode === "create" ? "Material Usage Created" : "Material Usage Updated"} successfully!`,
      );

      setRefreshTrigger((prev) => prev + 1);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save material usage:", err);
      toast.error(err.message || "Failed to save material usage");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler
  const handleDelete = async (id: string | number, code: string) => {
    try {
      await materialUsageApi.delete(id);
      toast.success(`Material usage "${code}" deleted successfully`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      console.error("Failed to delete material usage:", err);
      toast.error(err.message || "Failed to delete material usage");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 font-sans">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <RouteBreadcrumb />
          <h1 className="text-xl font-bold mt-1">Material Usage</h1>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* +New Material Usage Button */}
          <button
            onClick={handleCreateNewUsage}
            className="flex items-center gap-1.5 bg-[var(--lime)] hover:opacity-95 text-white px-4 py-2 rounded text-xs font-medium shadow-sm transition-all"
          >
            <FiPlus className="text-base" /> +New Material Usage
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
              <option value="Rifat Eyecon City">Rifat Eyecon City</option>
              <option value="Estern 19">Estern 19</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Site</label>
            <select
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="w-full bg-background border border-input rounded px-3 py-1.5 text-xs text-foreground"
            >
              <option value="">Select Site</option>
              <option value="Site A">Site A</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Title/Name of Work
            </label>
            <select
              value={titleOfWork}
              onChange={(e) => setTitleOfWork(e.target.value)}
              className="w-full bg-background border border-input rounded px-3 py-1.5 text-xs text-foreground"
            >
              <option value="">Select Title/Name of Work</option>
              <option value="Work 1">Work 1</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Task</label>
            <select
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full bg-background border border-input rounded px-3 py-1.5 text-xs text-foreground"
            >
              <option value="">Select Task</option>
              <option value="Task 1">Task 1</option>
            </select>
          </div>
        </div>
      </div>

      {/* Child Component for Table */}
      <MaterialUsageTable
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
                {modalMode === "create" && "Create Material Usage Module"}
                {modalMode === "update" && "Update Material Usage Module"}
                {modalMode === "view" && "View Material Usage Details"}
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
                    Code
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === "view"}
                    value={selectedUsage.code || ""}
                    onChange={(e) => setSelectedUsage({ ...selectedUsage, code: e.target.value })}
                    className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Project
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === "view"}
                    value={selectedUsage.project || ""}
                    onChange={(e) =>
                      setSelectedUsage({ ...selectedUsage, project: e.target.value })
                    }
                    className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Worker/Staff Name
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === "view"}
                    value={selectedUsage.workerStaffName || ""}
                    onChange={(e) =>
                      setSelectedUsage({ ...selectedUsage, workerStaffName: e.target.value })
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
                    value={selectedUsage.grandTotal || 0}
                    onChange={(e) =>
                      setSelectedUsage({ ...selectedUsage, grandTotal: Number(e.target.value) })
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
                  onClick={handleSaveUsage}
                  className="px-4 py-2 rounded bg-[var(--lime)] text-white text-sm font-medium hover:opacity-90 shadow-sm disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Saving..."
                    : modalMode === "create"
                    ? "Save Usage"
                    : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
