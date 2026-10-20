"use client";

import CategoryList from "@/components/inventory/CategoryList";
import { RouteBreadcrumb } from "@/components/ui/RouteBreadcrumb";
import React, { useState } from "react";
import { FiPlus, FiX, FiArrowLeft } from "react-icons/fi";
import { categoriesApi } from "@/lib/inventoryApi";

// Category type definition
export interface Category {
  id: number;
  type: string;
  code: string;
  name: string;
  inventoryCoa: string;
  consumptionCoa: string;
}

const CategoryAccounts = () => {
  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "update" | "view">("add");
  const [selectedCategory, setSelectedCategory] = useState<Partial<Category>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open modal for adding a new category
  const handleAddClick = () => {
    setModalMode("add");
    setSelectedCategory({
      code: `C${Math.floor(1000000 + Math.random() * 9000000)}`,
      type: "Material",
      name: "",
    });
    setIsModalOpen(true);
  };

  // Open modal for updating or viewing
  const handleOpenModal = (category: Category, mode: "update" | "view") => {
    setModalMode(mode);
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  // Form submit handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory.name) return;

    try {
      setIsSubmitting(true);
      if (modalMode === "add") {
        await categoriesApi.create({
          category_code: selectedCategory.code || `C${Date.now().toString().slice(-6)}`,
          name: selectedCategory.name,
        });
      } else if (modalMode === "update" && selectedCategory.id) {
        await categoriesApi.update(selectedCategory.id, {
          category_code: selectedCategory.code || "",
          name: selectedCategory.name,
        });
      }
      setRefreshTrigger((prev) => prev + 1);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save category:", err);
      alert(err.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler
  const handleDelete = async (id: string | number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await categoriesApi.delete(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      console.error("Failed to delete category:", err);
      alert(err.message || "Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 font-sans">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <RouteBreadcrumb />
          <h1 className="text-xl font-bold mt-1">Category List</h1>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Add Category Button */}
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-[var(--lime)] text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-all hover:opacity-90"
          >
            <FiPlus className="text-base" /> +Add Category
          </button>

          {/* Back to Previous Button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-all"
          >
            <FiArrowLeft className="text-base" /> Back to Previous
          </button>
        </div>
      </div>

      {/* Child Component for Listing & Filtering */}
      <CategoryList
        refreshTrigger={refreshTrigger}
        onEdit={(category) => handleOpenModal(category, "update")}
        onView={(category) => handleOpenModal(category, "view")}
        onDelete={handleDelete}
      />

      {/* Shared Modal Form for Add / Update / View */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="font-bold text-lg capitalize text-foreground">
                {modalMode === "add" && "Add New Category"}
                {modalMode === "update" && "Update Category"}
                {modalMode === "view" && "Category Details"}
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
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  disabled={modalMode === "view"}
                  value={selectedCategory.type || "Material"}
                  onChange={(e) =>
                    setSelectedCategory({ ...selectedCategory, type: e.target.value })
                  }
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  required
                >
                  <option value="Material">Material</option>
                  <option value="Service">Service</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === "view"}
                    value={selectedCategory.code || ""}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, code: e.target.value })
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
                    value={selectedCategory.name || ""}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, name: e.target.value })
                    }
                    placeholder="Enter category name"
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Inventory COA
                </label>
                <input
                  type="text"
                  disabled={modalMode === "view"}
                  value={selectedCategory.inventoryCoa || ""}
                  onChange={(e) =>
                    setSelectedCategory({ ...selectedCategory, inventoryCoa: e.target.value })
                  }
                  placeholder="Inventory COA name"
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Consumption COA
                </label>
                <input
                  type="text"
                  disabled={modalMode === "view"}
                  value={selectedCategory.consumptionCoa || ""}
                  onChange={(e) =>
                    setSelectedCategory({ ...selectedCategory, consumptionCoa: e.target.value })
                  }
                  placeholder="Consumption COA name"
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-60"
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
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : modalMode === "add"
                      ? "Save Category"
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

export default CategoryAccounts;
