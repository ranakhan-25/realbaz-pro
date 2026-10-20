"use client";

import type { OrderReceiveItem } from "@/components/inventory/PurchaseOrderReceiveTable";
import PurchaseOrderReceiveTable from "@/components/inventory/PurchaseOrderReceiveTable";
import React, { useState, useEffect, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { purchasesApi, fallbackPurchases, fallbackItems, fallbackSuppliers } from "@/lib/inventoryApi";


export default function PurchaseOrderReceiveContainer() {
  const [orders, setOrders] = useState<OrderReceiveItem[]>([]);

  useEffect(() => {
    async function loadOrders() {
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
          receive: Number(item.total_quantity || (item.items && item.items[0]?.quantity) || 10),
        }));
        setOrders(list);
      } catch (err) {
        setOrders(
          fallbackPurchases.map((item: any, idx: number) => ({
            id: item.id || idx + 1,
            date: item.date ? new Date(item.date).toLocaleDateString() : "-",
            invoiceNo: item.purchase_no || `PUR-2026-00${idx + 1}`,
            supplierName: item.supplier?.name || "Meghna Rebar & Building Supply",
            category: "Material",
            itemName: "Construction Materials",
            quantity: 10,
            receive: 10,
          }))
        );
      }
    }
    loadOrders();
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [selectedDateRange, setSelectedDateRange] = useState(
    "1 September, 2026 - 30 September, 2026",
  );
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");

  const items = useMemo(() => {
    const fromData = orders.map((o) => o.itemName).filter(Boolean);
    const defaults = fallbackItems.map((i) => i.name);
    return Array.from(new Set([...fromData, ...defaults]));
  }, [orders]);

  const suppliers = useMemo(() => {
    const fromData = orders.map((o) => o.supplierName).filter(Boolean);
    const defaults = fallbackSuppliers.map((s) => s.name);
    return Array.from(new Set([...fromData, ...defaults]));
  }, [orders]);

  // Filtering Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((item) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.invoiceNo.toLowerCase().includes(query) ||
        item.supplierName.toLowerCase().includes(query) ||
        item.itemName.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      const matchesItem = selectedItem ? item.itemName === selectedItem : true;
      const matchesSupplier = selectedSupplier ? item.supplierName === selectedSupplier : true;

      return matchesSearch && matchesItem && matchesSupplier;
    });
  }, [orders, searchQuery, selectedItem, selectedSupplier]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / entriesPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredOrders.slice(start, start + entriesPerPage);
  }, [filteredOrders, currentPage, entriesPerPage]);

  // Totals Calculation
  const totalQuantity = useMemo(() => {
    return filteredOrders.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [filteredOrders]);

  return (
    <div className="space-y-4 p-6 bg-background text-foreground min-h-screen">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <span className="hover:underline cursor-pointer">Home</span>
        <span>›</span>
        <span className="hover:underline cursor-pointer">Inventory</span>
        <span>›</span>
        <span className="text-foreground font-medium">Purchase Order Receive Details</span>
      </div>

      {/* Filter Section */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Select Item */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground block">Select Item</label>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="w-full bg-background border border-input rounded px-3 py-1.5 text-xs focus:outline-none"
          >
            <option value="">Select value</option>
            {items.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        {/* Select Supplier */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground block">Select Supplier</label>
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="w-full bg-background border border-input rounded px-3 py-1.5 text-xs focus:outline-none"
          >
            <option value="">Select value</option>
            {suppliers.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
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
      <PurchaseOrderReceiveTable
        orders={filteredOrders}
        paginatedOrders={paginatedOrders}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        totalQuantity={totalQuantity}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
