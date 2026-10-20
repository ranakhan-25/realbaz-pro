"use client";

import SubCategoryList from "@/components/inventory/SubCategoryList";
import { RouteBreadcrumb } from "@/components/ui/RouteBreadcrumb";
import React, { useState, useEffect } from "react";
import { FiPlus, FiX, FiArrowLeft } from "react-icons/fi";
import { subCategoriesApi, categoriesApi } from "@/lib/inventoryApi";

// SubCategory type definition
export interface SubCategory {
  id: string | number;
  category: string;
  category_id?: string;
  code: string;
  name: string;
}

const SubCategoryAccounts = () => {
  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "update" | "view">("add");
  const [selectedSubCategory, setSelectedSubCategory] = useState<Partial<SubCategory>>({});
  const [categoriesList, setCategoriesList] = useState<Array<{ id: string; name: string }>>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load categories for dropdown
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await categoriesApi.getAll();
        if (Array.isArray(res)) {
          setCategoriesList(res.map((c: any) => ({ id: c.id, name: c.name })));
        }
      } catch (err) {
        console.warn("Could not load categories for dropdown:", err);
      }
    }
    loadCategories();
  }, []);

  // Open modal for adding a new sub category
  const handleAddClick = () => {
    setModalMode("add");
    setSelectedSubCategory({
      code: `SC${Math.floor(1000000 + Math.random() * 9000000)}`,
      category_id: categoriesList[0]?.id || "",
      name: "",
    });
    setIsModalOpen(true);
  };

  // Open modal for updating or viewing
  const handleOpenModal = (subCategory: SubCategory, mode: "update" | "view") => {
    setModalMode(mode);
    setSelectedSubCategory(subCategory);
    setIsModalOpen(true);
  };

  // Form submit handler for Add/Update
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubCategory.name) return;

    try {
      setIsSubmitting(true);
      const categoryId = selectedSubCategory.category_id || categoriesList[0]?.id;
      if (!categoryId) {
        alert("Please select a parent category.");
        return;
      }

      if (modalMode === "add") {
        await subCategoriesApi.create({
          category_id: categoryId,
          sub_category_code: selectedSubCategory.code || `SC${Date.now().toString().slice(-6)}`,
          name: selectedSubCategory.name,
        });
      } else if (modalMode === "update" && selectedSubCategory.id) {
        await subCategoriesApi.update(selectedSubCategory.id, {
          category_id: categoryId,
          sub_category_code: selectedSubCategory.code || "",
          name: selectedSubCategory.name,
        });
      }

      setRefreshTrigger((prev) => prev + 1);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save sub-category:", err);
      alert(err.message || "Failed to save sub-category");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler
  const handleDelete = async (id: string | number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete sub-category "${name}"?`)) return;
    try {
      await subCategoriesApi.delete(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      console.error("Failed to delete sub-category:", err);
      alert(err.message || "Failed to delete sub-category");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 font-sans">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <RouteBreadcrumb />
          <h1 className="text-xl font-bold mt-1">Sub Category List</h1>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Add Sub Category Button */}
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-[var(--lime)] hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-all"
          >
            <FiPlus className="text-base" /> +Add Sub Category
          </button>

          {/* Back to Previous Button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-[#334155] hover:bg-[#1e293b] text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-all"
          >
            <FiArrowLeft className="text-base" /> Back to Previous
          </button>
        </div>
      </div>

      {/* Child Component for Listing & Filtering */}
      <SubCategoryList
        refreshTrigger={refreshTrigger}
        onEdit={(subCategory) => handleOpenModal(subCategory, "update")}
        onView={(subCategory) => handleOpenModal(subCategory, "view")}
        onDelete={handleDelete}
      />

      {/* Shared Modal Form for Add / Update / View */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="font-bold text-lg capitalize text-foreground">
                {modalMode === "add" && "Add New Sub Category"}
                {modalMode === "update" && "Update Sub Category"}
                {modalMode === "view" && "Sub Category Details"}
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
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  disabled={modalMode === "view"}
                  value={selectedSubCategory.category_id || (categoriesList[0]?.id || "")}
                  onChange={(e) =>
                    setSelectedSubCategory({ ...selectedSubCategory, category_id: e.target.value })
                  }
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  required
                >
                  {categoriesList.length > 0 ? (
                    categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No categories available (create one first)</option>
                  )}
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
                    value={selectedSubCategory.code || ""}
                    onChange={(e) =>
                      setSelectedSubCategory({ ...selectedSubCategory, code: e.target.value })
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
                    value={selectedSubCategory.name || ""}
                    onChange={(e) =>
                      setSelectedSubCategory({ ...selectedSubCategory, name: e.target.value })
                    }
                    placeholder="Enter sub category name"
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground disabled:opacity-60"
                    required
                  />
                </div>
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
                    className="px-4 py-2 rounded-md bg-[var(--lime)] text-white text-sm font-medium hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : modalMode === "add"
                      ? "Save Sub Category"
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

export default SubCategoryAccounts;
