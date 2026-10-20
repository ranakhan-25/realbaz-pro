"use client";

import type { ItemHistory } from "@/components/inventory/ItemHistoryTable";
import ItemHistoryTable from "@/components/inventory/ItemHistoryTable";
import React, { useState, useEffect, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { reportsApi, fallbackItemHistory, fallbackCategories, fallbackItems } from "@/lib/inventoryApi";


export default function ItemHistoryContainer() {
  const [items, setItems] = useState<ItemHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [selectedDateRange, setSelectedDateRange] = useState("15 August, 2026 - 13 September, 2026");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedSite, setSelectedSite] = useState("");

  useEffect(() => {
    async function loadItemHistory() {
      try {
        let raw = await reportsApi.getItemHistory().catch(() => null);
        if (!Array.isArray(raw) || raw.length === 0) {
          raw = fallbackItemHistory;
        }
        setItems(raw);
      } catch (err) {
        setItems(fallbackItemHistory);
      }
    }
    loadItemHistory();
  }, []);

  const categories = useMemo(() => {
    const fromData = items.map((i) => i.category).filter(Boolean) as string[];
    const defaults = fallbackCategories.map((c) => c.name);
    return Array.from(new Set([...fromData, ...defaults]));
  }, [items]);

  const itemList = useMemo(() => {
    const fromData = items.map((i) => i.itemName).filter(Boolean) as string[];
    const defaults = fallbackItems.map((it) => it.name);
    return Array.from(new Set([...fromData, ...defaults]));
  }, [items]);

  const projects = useMemo(() => {
    const fromData = items.map((i) => i.project).filter(Boolean) as string[];
    const defaults = ["Sheba Eyecon Tower", "Lake Garden Commercial", "Hena Heights", "Rifat Eyecon City"];
    return Array.from(new Set([...fromData, ...defaults]));
  }, [items]);

  // Filtering Logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.invoiceNo.toLowerCase().includes(query) ||
        item.project.toLowerCase().includes(query) ||
        item.task.toLowerCase().includes(query);

      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      const matchesItem = selectedItem ? item.itemName === selectedItem : true;
      const matchesProject = selectedProject ? item.project === selectedProject : true;

      return matchesSearch && matchesCategory && matchesItem && matchesProject;
    });
  }, [items, searchQuery, selectedCategory, selectedItem, selectedProject]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredItems.length / entriesPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredItems.slice(start, start + entriesPerPage);
  }, [filteredItems, currentPage, entriesPerPage]);

  return (
    <div className="space-y-4 p-6 bg-background text-foreground min-h-screen">
      
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <span className="hover:underline cursor-pointer">Home</span>
        <span>›</span>
        <span className="hover:underline cursor-pointer">Inventory</span>
        <span>›</span>
        <span className="text-foreground font-medium">Item History Report</span>
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
            {itemList.map((it) => (
              <option key={it} value={it}>
                {it}
              </option>
            ))}
          </select>
        </div>

        {/* Project */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground block">Project</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full bg-background border border-input rounded px-3 py-1.5 text-xs focus:outline-none"
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* If Task */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground block">If Task</label>
          <input
            type="text"
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            placeholder="Select Task"
            className="w-full bg-background border border-input rounded px-3 py-1.5 text-xs focus:outline-none"
          />
        </div>

        {/* Site */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground block">Site</label>
          <input
            type="text"
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            placeholder="Select Site"
            className="w-full bg-background border border-input rounded px-3 py-1.5 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Action Controls & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <button className="bg-slate-700 hover:bg-slate-800 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors shadow-sm">
            Copy
          </button>
          <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors shadow-sm">
            CSV
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors shadow-sm">
            Excel
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors shadow-sm">
            PDF
          </button>
          <button className="bg-slate-500 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors shadow-sm">
            Print
          </button>
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
      <ItemHistoryTable
        items={filteredItems}
        paginatedItems={paginatedItems}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

    </div>
  );
}