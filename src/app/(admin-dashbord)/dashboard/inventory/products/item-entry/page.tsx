"use client";

import ItemList from "@/components/inventory/ItemList";
import { RouteBreadcrumb } from "@/components/ui/RouteBreadcrumb";
import React, { useState, useEffect } from "react";
import { FiPlus, FiX, FiFileText, FiDownload, FiPrinter } from "react-icons/fi";
import { itemsApi, categoriesApi, unitsApi, brandsApi } from "@/lib/inventoryApi";

// Item type definition
export interface Item {
  id: string | number;
  code: string;
  name: string;
  category: string;
  category_id?: string;
  unit: string;
  unit_id?: string;
  brand: string;
  brand_id?: string;
  purchasePrice: number;
  salePrice: number;
}

const ItemAccounts = () => {
  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "update" | "view">("add");
  const [selectedItem, setSelectedItem] = useState<Partial<Item>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown options loaded from API
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [units, setUnits] = useState<Array<{ id: string; name: string }>>([]);
  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    async function loadDropdowns() {
      try {
        const [catsRes, unitsRes, brandsRes] = await Promise.all([
          categoriesApi.getAll().catch(() => []),
          unitsApi.getAll().catch(() => []),
          brandsApi.getAll().catch(() => []),
        ]);
        if (Array.isArray(catsRes)) setCategories(catsRes.map((c: any) => ({ id: c.id, name: c.name })));
        if (Array.isArray(unitsRes)) setUnits(unitsRes.map((u: any) => ({ id: u.id, name: u.name })));
        if (Array.isArray(brandsRes)) setBrands(brandsRes.map((b: any) => ({ id: b.id, name: b.name })));
      } catch (err) {
        console.warn("Failed to load item dropdown data:", err);
      }
    }
    loadDropdowns();
  }, []);

  // Open modal for adding a new item
  const handleAddClick = () => {
    setModalMode("add");
    setSelectedItem({
      code: `ITEM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "",
      category_id: categories[0]?.id || "",
      unit_id: units[0]?.id || "",
      brand_id: brands[0]?.id || undefined,
      purchasePrice: 0,
      salePrice: 0,
    });
    setIsModalOpen(true);
  };

  // Open modal for updating or viewing
  const handleOpenModal = (item: Item, mode: "update" | "view") => {
    setModalMode(mode);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Form submit handler for Add/Update
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem.name) return;

    const catId = selectedItem.category_id || categories[0]?.id;
    const unitId = selectedItem.unit_id || units[0]?.id;

    if (!catId || !unitId) {
      alert("Category and Unit are required. Please ensure at least one Category and Unit are created.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        item_code: selectedItem.code || `ITEM-${Date.now().toString().slice(-4)}`,
        name: selectedItem.name,
        type: "Material",
        purchase_price: Number(selectedItem.purchasePrice || 0),
        sale_price: Number(selectedItem.salePrice || 0),
        category_id: catId,
        unit_id: unitId,
        brand_id: selectedItem.brand_id || undefined,
      };

      if (modalMode === "add") {
        await itemsApi.create(payload);
      } else if (modalMode === "update" && selectedItem.id) {
        await itemsApi.update(selectedItem.id, payload);
      }

      setRefreshTrigger((prev) => prev + 1);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save item:", err);
      alert(err.message || "Failed to save item");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler
  const handleDelete = async (id: string | number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete item "${name}"?`)) return;
    try {
      await itemsApi.delete(id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      console.error("Failed to delete item:", err);
      alert(err.message || "Failed to delete item");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 font-sans">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <RouteBreadcrumb />
          <h1 className="text-xl font-bold mt-1">Item</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          {/* +Item Add Button */}
          <button
            onClick={handleAddClick}
            className="flex items-center gap-1.5 bg-[var(--lime)] hover:opacity-90 text-white px-3.5 py-2 rounded text-xs font-medium shadow-sm transition-all"
          >
            <FiPlus className="text-sm" /> +Item Add
          </button>

          {/* PDF Button */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-[#ef4444] hover:bg-[#dc2626] text-white px-3.5 py-2 rounded text-xs font-medium shadow-sm transition-all"
          >
            <FiFileText className="text-sm" /> PDF
          </button>

          {/* Excel Button */}
          <button
            onClick={() => alert("Exporting list...")}
            className="flex items-center gap-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3.5 py-2 rounded text-xs font-medium shadow-sm transition-all"
          >
            <FiDownload className="text-sm" /> Excel
          </button>

          {/* Extra Icon Button */}
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center bg-[#0d9488] hover:bg-[#0f766e] text-white p-2 rounded text-xs font-medium shadow-sm transition-all"
          >
            <FiPrinter className="text-sm" />
          </button>
        </div>
      </div>

      {/* Child Component for Listing & Filtering */}
      <ItemList
        refreshTrigger={refreshTrigger}
        onEdit={(item) => handleOpenModal(item, "update")}
        onView={(item) => handleOpenModal(item, "view")}
        onDelete={handleDelete}
      />

      {/* Shared Modal Form for Add / Update / View */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="font-bold text-lg capitalize text-foreground">
                {modalMode === "add" && "Add New Item"}
                {modalMode === "update" && "Update Item"}
                {modalMode === "view" && "Item Details"}
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
                    value={selectedItem.code || ""}
                    onChange={(e) => setSelectedItem({ ...selectedItem, code: e.target.value })}
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
                    value={selectedItem.name || ""}
                    onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                    placeholder="Enter item name"
                    className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    disabled={modalMode === "view"}
                    value={selectedItem.category_id || (categories[0]?.id || "")}
                    onChange={(e) => setSelectedItem({ ...selectedItem, category_id: e.target.value })}
                    className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground disabled:opacity-60"
                    required
                  >
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No categories available</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    disabled={modalMode === "view"}
                    value={selectedItem.unit_id || (units[0]?.id || "")}
                    onChange={(e) => setSelectedItem({ ...selectedItem, unit_id: e.target.value })}
                    className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground disabled:opacity-60"
                    required
                  >
                    {units.length > 0 ? (
                      units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No units available</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Brand
                  </label>
                  <select
                    disabled={modalMode === "view"}
                    value={selectedItem.brand_id || ""}
                    onChange={(e) => setSelectedItem({ ...selectedItem, brand_id: e.target.value || undefined })}
                    className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  >
                    <option value="">Select Brand (Optional)</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    disabled={modalMode === "view"}
                    value={selectedItem.purchasePrice ?? 0}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, purchasePrice: Number(e.target.value) })
                    }
                    className="w-full bg-background border border-input rounded px-3 py-2 text-sm text-foreground disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Sale Price
                  </label>
                  <input
                    type="number"
                    disabled={modalMode === "view"}
                    value={selectedItem.salePrice ?? 0}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, salePrice: Number(e.target.value) })
                    }
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
                      ? "Save Item"
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

export default ItemAccounts;
