"use client";

import type { MaterialUsageItem } from "@/components/inventory/MaterialUsageReportTable";
import MaterialUsageReportTable from "@/components/inventory/MaterialUsageReportTable";
import React, { useState, useEffect, useMemo } from "react";


import { materialUsageApi, fallbackMaterialUsage } from "@/lib/inventoryApi";

export default function MaterialUsageReportContainer() {
  const [data, setData] = useState<MaterialUsageItem[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        let raw = await materialUsageApi.getAll().catch(() => null);
        if (!Array.isArray(raw) || raw.length === 0) {
          raw = fallbackMaterialUsage;
        }
        const list = raw.map((u: any, idx: number) => ({
          id: u.id || idx + 1,
          invoiceNo: u.usage_no || u.code || `MU-2026-00${idx + 1}`,
          date: u.date ? new Date(u.date).toLocaleDateString() : "-",
          project: u.project?.name || u.project_name || "Hena Heights (PRJ-1001)",
          titleOfWork: u.title_of_work || "RCC Casting (Beam & Column)",
          task: u.task || "Beam Concreting Level-4",
          site: u.site?.name || u.site_name || "Tower 1 Foundation Site",
          workerName: u.worker_staff_name || "Rafiqul Islam (Site Engineer)",
          category: u.category || "General",
          itemCode: u.item_code || `ITM-50${idx + 1}`,
          itemName: u.item_name || "Material",
          quantity: Number(u.quantity || 0),
          unit: u.unit || "Pcs",
        }));
        setData(list);
      } catch (err) {
        console.warn("Error loading material usage report:", err);
        setData(
          fallbackMaterialUsage.map((u: any, idx: number) => ({
            id: u.id || idx + 1,
            invoiceNo: u.usage_no || `MU-2026-00${idx + 1}`,
            date: u.date ? new Date(u.date).toLocaleDateString() : "-",
            project: u.project_name,
            titleOfWork: u.title_of_work,
            task: u.task,
            site: u.site_name,
            workerName: u.worker_staff_name,
            category: u.category,
            itemCode: u.item_code,
            itemName: u.item_name,
            quantity: Number(u.quantity || 0),
            unit: u.unit,
          }))
        );
      }
    }
    loadData();
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter States
  const [selectedDateRange, setSelectedDateRange] = useState(
    "1 September, 2026 - 30 September, 2026",
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedTitleOfWork, setSelectedTitleOfWork] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");

  // Filtering Logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.invoiceNo.toLowerCase().includes(query) ||
        item.project.toLowerCase().includes(query) ||
        item.itemName.toLowerCase().includes(query) ||
        item.workerName.toLowerCase().includes(query);

      const matchesProject = selectedProject
        ? item.project === selectedProject
        : true;
      const matchesCategory = selectedCategory
        ? item.category === selectedCategory
        : true;
      const matchesItem = selectedItem ? item.itemName === selectedItem : true;

      return matchesSearch && matchesProject && matchesCategory && matchesItem;
    });
  }, [data, searchQuery, selectedProject, selectedCategory, selectedItem]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredData.slice(start, start + entriesPerPage);
  }, [filteredData, currentPage, entriesPerPage]);

  // Total Quantity Calculation
  const totalQuantity = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [filteredData]);

  return (
    <div className="w-full max-w-4xl 2xl:max-w-5xl mx-auto space-y-4 p-4 md:p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen transition-colors">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-1.5 text-xs text-indigo-500 dark:text-indigo-400 font-medium mb-1">
        <span className="hover:underline cursor-pointer">Home</span>
        <span className="text-gray-400 dark:text-gray-600">›</span>
        <div className="flex items-center gap-1 hover:underline cursor-pointer">
          <span>Inventory</span>
          <span className="text-[10px]">˅</span>
        </div>
        <span className="text-gray-400 dark:text-gray-600">›</span>
        <span className="text-gray-600 dark:text-gray-300 font-normal">
          Material Usage Report
        </span>
      </div>

      {/* Filter Card Container */}
      <div className="bg-[#f8f9fa] dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm space-y-3">
        {/* Row 1: Select Date, Category, Select Item, Project */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Select Date */}
          <div className="space-y-1">
            <label className="text-xs text-gray-600 dark:text-gray-300 block">
              Select Date
            </label>
            <input
              type="text"
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-gray-700 dark:text-gray-200 shadow-sm"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs text-gray-600 dark:text-gray-300 block">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-gray-600 dark:text-gray-300 shadow-sm"
            >
              <option value="">All Categories</option>
              <option value="Raw Construction Materials">Raw Construction Materials</option>
              <option value="Deformed Rebar & Steels">Deformed Rebar & Steels</option>
              <option value="Cement & Aggregates">Cement & Aggregates</option>
              <option value="Electrical & Conduits">Electrical & Conduits</option>
              <option value="Plumbing & Sanitary">Plumbing & Sanitary</option>
            </select>
          </div>

          {/* Select Item */}
          <div className="space-y-1">
            <label className="text-xs text-gray-600 dark:text-gray-300 block">
              Select Item
            </label>
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-gray-600 dark:text-gray-300 shadow-sm"
            >
              <option value="">All Items</option>
              <option value="BSRM 16mm TMT 500W High Strength Bar">BSRM 16mm TMT 500W High Strength Bar</option>
              <option value="Seven Rings Gold PCC 42.5N Cement">Seven Rings Gold PCC 42.5N Cement</option>
              <option value="Pakur Black Crushed Stone Chips (3/4)">Pakur Black Crushed Stone Chips (3/4)</option>
              <option value="Coarse River Sand (Sylhet FM 2.5)">Coarse River Sand (Sylhet FM 2.5)</option>
            </select>
          </div>

          {/* Project */}
          <div className="space-y-1">
            <label className="text-xs text-gray-600 dark:text-gray-300 block">
              Project
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-gray-600 dark:text-gray-300 shadow-sm"
            >
              <option value="">All Projects</option>
              <option value="Hena Heights (PRJ-1001)">Hena Heights (PRJ-1001)</option>
              <option value="Rifat Eyecon City (PRJ-1002)">Rifat Eyecon City (PRJ-1002)</option>
              <option value="Green Valley Residency (PRJ-1003)">Green Valley Residency (PRJ-1003)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Title/Name of Work, If Task, Site, Worker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Title/Name of Work */}
          <div className="space-y-1">
            <label className="text-xs text-gray-600 dark:text-gray-300 block">
              Title/Name of Work
            </label>
            <select
              value={selectedTitleOfWork}
              onChange={(e) => setSelectedTitleOfWork(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-gray-600 dark:text-gray-300 shadow-sm"
            >
              <option value="">All Works</option>
              <option value="Substructure & Foundation">Substructure & Foundation</option>
              <option value="RCC Casting (Beam & Column)">RCC Casting (Beam & Column)</option>
              <option value="Brickwork & Masonry">Brickwork & Masonry</option>
              <option value="Sanitary & Electrical Fitting">Sanitary & Electrical Fitting</option>
            </select>
          </div>

          {/* If Task */}
          <div className="space-y-1">
            <label className="text-xs text-gray-600 dark:text-gray-300 block">
              Task
            </label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-gray-600 dark:text-gray-300 shadow-sm"
            >
              <option value="">All Tasks</option>
              <option value="Beam Concreting Level-4">Beam Concreting Level-4</option>
              <option value="Slab Concreting Floor-3">Slab Concreting Floor-3</option>
              <option value="Piling & Mat Foundation">Piling & Mat Foundation</option>
              <option value="Column Casting Ground Floor">Column Casting Ground Floor</option>
            </select>
          </div>

          {/* Site */}
          <div className="space-y-1">
            <label className="text-xs text-gray-600 dark:text-gray-300 block">
              Site
            </label>
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-gray-600 dark:text-gray-300 shadow-sm"
            >
              <option value="">All Sites</option>
              <option value="Tower 1 Foundation Site">Tower 1 Foundation Site</option>
              <option value="Block-B Casting Yard">Block-B Casting Yard</option>
              <option value="Main Central Warehouse">Main Central Warehouse</option>
              <option value="Site Store - Level 2">Site Store - Level 2</option>
            </select>
          </div>

          {/* Worker */}
          <div className="space-y-1">
            <label className="text-xs text-gray-600 dark:text-gray-300 block">
              Worker
            </label>
            <select
              value={selectedWorker}
              onChange={(e) => setSelectedWorker(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-gray-600 dark:text-gray-300 shadow-sm"
            >
              <option value="">All Workers</option>
              <option value="Rafiqul Islam (Site Engineer)">Rafiqul Islam (Site Engineer)</option>
              <option value="Abdul Karim (Head Mason)">Abdul Karim (Head Mason)</option>
              <option value="Kabir Hossain (Foreman)">Kabir Hossain (Foreman)</option>
              <option value="Tareq Aziz (Supervisor)">Tareq Aziz (Supervisor)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Bar (Excel, PDF, Entries, Search) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <button className="bg-[#0f9f59] hover:bg-[#0b8247] text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors shadow-sm">
            Excel
          </button>
          <button className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors shadow-sm">
            PDF
          </button>
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 ml-2">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-gray-700 dark:text-gray-200 text-xs focus:outline-none shadow-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-300">
            Search:
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-3 py-1 text-xs focus:outline-none focus:border-indigo-500 w-full sm:w-48 text-gray-800 dark:text-gray-100 shadow-sm"
          />
        </div>
      </div>

      {/* Child Component (Table & Pagination) */}
      <MaterialUsageReportTable
        data={filteredData}
        paginatedData={paginatedData}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        totalQuantity={totalQuantity}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
