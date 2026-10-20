"use client";

import type { PurchaseItem } from "@/components/inventory/PurchaseDetailsTable";
import PurchaseDetailsTable from "@/components/inventory/PurchaseDetailsTable";
import React, { useState, useEffect, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { purchasesApi, fallbackPurchases, fallbackCategories, fallbackItems, fallbackSuppliers } from "@/lib/inventoryApi";


export default function PurchaseDetailsContainer() {
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);

  useEffect(() => {
    async function loadPurchases() {
      try {
        let raw = await purchasesApi.getAll().catch(() => null);
        if (!Array.isArray(raw) || raw.length === 0) {
          raw = fallbackPurchases;
        }
        const list = raw.map((item: any, idx: number) => ({
          id: item.id || idx + 1,
          date: item.date ? new Date(item.date).toLocaleDateString() : "-",
          invoiceNo: item.purchase_no || item.code || `PUR-2026-00${idx + 1}`,
          supplierName: item.supplier?.name || item.supplier_name || item.supplier || "Meghna Rebar & Building Supply",
          category: item.category || "Deformed Rebar & Steels",
          itemName: item.item_name || (item.items && item.items[0]?.name) || "BSRM 16mm TMT 500W High Strength Bar",
          quantity: Number(item.total_quantity || (item.items && item.items[0]?.quantity) || 10),
          price: Number(item.rate || (item.items && item.items[0]?.rate) || 94500),
          subTotal: Number(item.subtotal || item.grand_total || 945000),
          project: item.project?.name || item.project_name || item.project || "Dhaka Commercial Center",
        }));
        setPurchases(list);
      } catch (err) {
        setPurchases(
          fallbackPurchases.map((item: any, idx: number) => ({
            id: item.id || idx + 1,
            date: item.date ? new Date(item.date).toLocaleDateString() : "-",
            invoiceNo: item.purchase_no || `PUR-2026-00${idx + 1}`,
            supplierName: item.supplier?.name || "Supplier",
            category: "Material",
            itemName: "Construction Materials",
            quantity: 10,
            price: 94500,
            subTotal: item.subtotal || item.grand_total || 945000,
            project: item.project || "Head Office",
          }))
        );
      }
    }
    loadPurchases();
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [selectedDateRange, setSelectedDateRange] = useState(
    "1 September, 2026 - 30 September, 2026",
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const categories = useMemo(() => {
    const fromData = purchases.map((p) => p.category).filter(Boolean);
    const defaults = fallbackCategories.map((c) => c.name);
    return Array.from(new Set([...fromData, ...defaults]));
  }, [purchases]);

  const items = useMemo(() => {
    const fromData = purchases.map((p) => p.itemName).filter(Boolean);
    const defaults = fallbackItems.map((i) => i.name);
    return Array.from(new Set([...fromData, ...defaults]));
  }, [purchases]);

  const suppliers = useMemo(() => {
    const fromData = purchases.map((p) => p.supplierName).filter(Boolean);
    const defaults = fallbackSuppliers.map((s) => s.name);
    return Array.from(new Set([...fromData, ...defaults]));
  }, [purchases]);

  // Filtering Logic
  const filteredPurchases = useMemo(() => {
    return purchases.filter((item) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.invoiceNo.toLowerCase().includes(query) ||
        item.supplierName.toLowerCase().includes(query) ||
        item.itemName.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      const matchesItem = selectedItem ? item.itemName === selectedItem : true;
      const matchesSupplier = selectedSupplier ? item.supplierName === selectedSupplier : true;
      const matchesProject = selectedProject ? item.project === selectedProject : true;

      return matchesSearch && matchesCategory && matchesItem && matchesSupplier && matchesProject;
    });
  }, [purchases, searchQuery, selectedCategory, selectedItem, selectedSupplier, selectedProject]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredPurchases.length / entriesPerPage) || 1;
  const paginatedPurchases = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredPurchases.slice(start, start + entriesPerPage);
  }, [filteredPurchases, currentPage, entriesPerPage]);

  // Totals Calculation
  const totalQuantity = useMemo(() => {
    return filteredPurchases.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [filteredPurchases]);

  const totalSubTotal = useMemo(() => {
    return filteredPurchases.reduce((acc, curr) => acc + curr.subTotal, 0);
  }, [filteredPurchases]);

  return (
    <div className="space-y-4 p-6 bg-background text-foreground min-h-screen">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <span className="hover:underline cursor-pointer">Home</span>
        <span>›</span>
        <span className="hover:underline cursor-pointer">Inventory</span>
        <span>›</span>
        <span className="text-foreground font-medium">Purchase Details</span>
      </div>

      {/* Filter Section */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Select Date */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground block">Select Date</label>
          <input
            type="text"
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="w-full bg-background border border-input rounded px-3 py-1.5 text-xs focus:outline-none"
          />
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground block">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-background border border-input rounded px-3 py-1.5 text-xs focus:outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Select Item */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground block">Select Item</label>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="w-full bg-background border border-input rounded px-3 py-1.5 text-xs focus:outline-none"
          >
            <option value="">Select Item</option>
            {items.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        {/* Supplier */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground block">Supplier</label>
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="w-full bg-background border border-input rounded px-3 py-1.5 text-xs focus:outline-none"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Select Project */}
        <div className="space-y-1 lg:col-span-4">
          <label className="text-xs text-muted-foreground block">
            Select Project <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full bg-background border border-input rounded px-3 py-1.5 text-xs focus:outline-none"
          >
            <option value="">Select Project</option>
            <option value="Hena Heights">Hena Heights</option>
            <option value="Rifat Eyecon City">Rifat Eyecon City</option>
            <option value="Sheba Eyecon Tower">Sheba Eyecon Tower</option>
            <option value="Estern 19">Estern 19</option>
          </select>
        </div>
      </div>

      {/* Action Controls & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors shadow-sm">
            Excel
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors shadow-sm">
            PDF
          </button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground ml-2">
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
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Search:</span>
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
              placeholder=""
              className="w-full bg-background border border-input rounded pl-9 pr-3 py-1.5 text-xs focus:outline-none text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Child Component Rendering */}
      <PurchaseDetailsTable
        purchases={filteredPurchases}
        paginatedPurchases={paginatedPurchases}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        totalQuantity={totalQuantity}
        totalSubTotal={totalSubTotal}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
