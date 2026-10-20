"use client";

import type { ItemHistoryItem } from "@/components/inventory/ItemWiseSupplierLedgerTable";
import ItemHistoryReportTable from "@/components/inventory/ItemWiseSupplierLedgerTable";
import React, { useState, useEffect, useMemo } from "react";
import { reportsApi, fallbackItemHistory, fallbackCategories, fallbackItems } from "@/lib/inventoryApi";


export default function ItemHistoryReportContainer() {
  const [data, setData] = useState<ItemHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage] = useState(500);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter States
  const [selectedDateRange, setSelectedDateRange] = useState(
    "15 August, 2026 - 13 September, 2026",
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedSite, setSelectedSite] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        let raw = await reportsApi.getItemHistory().catch(() => null);
        if (!Array.isArray(raw) || raw.length === 0) {
          raw = fallbackItemHistory;
        }
        setData(raw);
      } catch (err) {
        setData(fallbackItemHistory);
      }
    }
    loadData();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(fallbackCategories.map((c) => c.name)));
  }, []);

  const items = useMemo(() => {
    return Array.from(new Set(fallbackItems.map((i) => i.name)));
  }, []);

  const projects = useMemo(() => {
    const fromData = data.map((d) => d.project).filter(Boolean);
    const defaults = ["Sheba Eyecon Tower", "Lake Garden Commercial", "Hena Heights", "Rifat Eyecon City"];
    return Array.from(new Set([...fromData, ...defaults]));
  }, [data]);

  // Filtering Logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.invoiceNo.toLowerCase().includes(query) ||
        item.project.toLowerCase().includes(query) ||
        item.task.toLowerCase().includes(query);

      const matchesProject = selectedProject
        ? item.project === selectedProject
        : true;
      const matchesTask = selectedTask ? item.task === selectedTask : true;

      return matchesSearch && matchesProject && matchesTask;
    });
  }, [data, searchQuery, selectedProject, selectedTask]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredData.slice(start, start + entriesPerPage);
  }, [filteredData, currentPage, entriesPerPage]);

  return (
    <div className="w-full max-w-4xl 2xl:max-w-6xl space-y-4 p-4 md:p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen transition-colors">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-1.5 text-xs text-indigo-500 dark:text-indigo-400 font-medium mb-1">
        <span className="hover:underline cursor-pointer">Home</span>
        <span className="text-gray-400 dark:text-gray-600">›</span>
        <div className="flex items-center gap-1 hover:underline cursor-pointer">
          <span>Inventory</span>
          <span className="text-[10px]">˅</span>
        </div>
        <span className="text-gray-400 dark:text-gray-600">›</span>
        <span className="text-gray-600 dark:text-gray-300 font-normal">Item History Report</span>
      </div>

      {/* Filter Card Container */}
      <div className="bg-[#f8f9fa] dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-lg p-4 shadow-sm space-y-3">
        {/* Row 1: Select Date, Category, Select Item, Project */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Select Date */}
          <div className="space-y-1">
            <label className="text-xs text-gray-600 dark:text-gray-300 block">Select Date</label>
            <input
              type="text"
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-gray-700 dark:text-gray-200 shadow-sm"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs text-gray-600 dark:text-gray-300 block">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-gray-600 dark:text-gray-300 shadow-sm"
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
            <label className="text-xs text-gray-600 dark:text-gray-300 block">Select Item</label>
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-gray-600 dark:text-gray-300 shadow-sm"
            >
              <option value="">Select Item</option>
              {items.map((it) => (
                <option key={it} value={it}>
                  {it}
                </option>
              ))}
            </select>
          </div>

          {/* Project */}
          <div className="space-y-1">
            <label className="text-xs text-gray-600 dark:text-gray-300 block">Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-gray-600 dark:text-gray-300 shadow-sm"
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: If Task, Site */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* If Task */}
          <div className="space-y-1">
            <label className="text-xs text-gray-600 dark:text-gray-300 block">If Task</label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-gray-600 dark:text-gray-300 shadow-sm"
            >
              <option value="">Select Task</option>
              <option value="Task 1">Task 1</option>
              <option value="Task 2">Task 2</option>
            </select>
          </div>

          {/* Site */}
          <div className="space-y-1">
            <label className="text-xs text-gray-600 dark:text-gray-300 block">Site</label>
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-gray-600 dark:text-gray-300 shadow-sm"
            >
              <option value="">Select Site</option>
              <option value="Site A">Site A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Bar (Copy, CSV, Excel, PDF, Print & Search) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button className="bg-[#00bcd4] hover:bg-[#00acc1] text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors shadow-sm">
            Copy
          </button>
          <button className="bg-[#ff9800] hover:bg-[#f57c00] text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors shadow-sm">
            CSV
          </button>
          <button className="bg-[#0f9f59] hover:bg-[#0b8247] text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors shadow-sm">
            Excel
          </button>
          <button className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors shadow-sm">
            PDF
          </button>
          <button className="bg-[#6b7280] hover:bg-[#4b5563] text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors shadow-sm">
            Print
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-300">Search:</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-3 py-1 text-xs focus:outline-none focus:border-indigo-500 text-gray-800 dark:text-gray-100 w-full sm:w-48 shadow-sm"
          />
        </div>
      </div>

      {/* Child Component (Table & Pagination) */}
      <ItemHistoryReportTable
        data={filteredData}
        paginatedData={paginatedData}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}