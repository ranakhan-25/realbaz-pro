"use client";

import type { MaterialItem } from "@/components/inventory/MaterialComparisonTable";
import MaterialComparisonTable from "@/components/inventory/MaterialComparisonTable";
import React, { useState, useEffect, useMemo } from "react";
import { reportsApi, fallbackMaterialComparison } from "@/lib/inventoryApi";


export default function MaterialComparisonContainer() {
  const [data, setData] = useState<MaterialItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter States
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedTask, setSelectedTask] = useState("");

  useEffect(() => {
    async function loadComparison() {
      try {
        const res = await reportsApi.getMaterialComparison(1).catch(() => null);
        const apiRaw = res?.data || res;
        const raw = (Array.isArray(apiRaw) && apiRaw.length > 0) ? apiRaw : fallbackMaterialComparison;
        const list = raw.map((r: any, idx: number) => ({
          id: idx + 1,
          description: r.item_name || "Material",
          budgetQty: Number(r.budget_qty || 0),
          budgetAmount: Number((r.budget_qty || 0) * 100),
          purchaseQty: Number(r.purchase_qty || 0),
          purchaseAmount: Number((r.purchase_qty || 0) * 100),
          issueQty: Number(r.issue_qty || 0),
          issueAmount: Number((r.issue_qty || 0) * 100),
          stockQty: Number((r.purchase_qty || 0) - (r.issue_qty || 0)),
          stockAmount: Number(((r.purchase_qty || 0) - (r.issue_qty || 0)) * 100),
          availableQty: Number(r.available_qty || 0),
          availableAmount: Number((r.available_qty || 0) * 100),
          status: "Normal",
        }));
        setData(list);
      } catch (err) {
        console.warn("Could not load material comparison report, using default:", err);
        setData(
          fallbackMaterialComparison.map((r: any, idx: number) => ({
            id: idx + 1,
            description: r.item_name || "Material",
            budgetQty: Number(r.budget_qty || 0),
            budgetAmount: Number((r.budget_qty || 0) * 100),
            purchaseQty: Number(r.purchase_qty || 0),
            purchaseAmount: Number((r.purchase_qty || 0) * 100),
            issueQty: Number(r.issue_qty || 0),
            issueAmount: Number((r.issue_qty || 0) * 100),
            stockQty: Number((r.purchase_qty || 0) - (r.issue_qty || 0)),
            stockAmount: Number(((r.purchase_qty || 0) - (r.issue_qty || 0)) * 100),
            availableQty: Number(r.available_qty || 0),
            availableAmount: Number((r.available_qty || 0) * 100),
            status: "Normal",
          }))
        );
      }
    }
    loadComparison();
  }, [selectedProject]);

  // Filtering Logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = item.description.toLowerCase().includes(query);

      const matchesProject = selectedProject ? true : true; // Project filter logic placeholder
      const matchesTask = selectedTask ? true : true; // Task filter logic placeholder

      return matchesSearch && matchesProject && matchesTask;
    });
  }, [data, searchQuery, selectedProject, selectedTask]);

  // Totals Calculation
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => {
        acc.budgetQty += item.budgetQty;
        acc.budgetAmount += item.budgetAmount;
        acc.purchaseQty += item.purchaseQty;
        acc.purchaseAmount += item.purchaseAmount;
        acc.issueQty += item.issueQty;
        acc.issueAmount += item.issueAmount;
        acc.stockQty += item.stockQty;
        acc.stockAmount += item.stockAmount;
        acc.availableQty += item.availableQty;
        acc.availableAmount += item.availableAmount;
        return acc;
      },
      {
        budgetQty: 0,
        budgetAmount: 0,
        purchaseQty: 0,
        purchaseAmount: 0,
        issueQty: 0,
        issueAmount: 0,
        stockQty: 0,
        stockAmount: 0,
        availableQty: 0,
        availableAmount: 0,
      },
    );
  }, [filteredData]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredData.slice(start, start + entriesPerPage);
  }, [filteredData, currentPage, entriesPerPage]);

  return (
    <div className="w-full max-w-4xl 2xl:max-w-6xl mx-auto space-y-4 p-4 md:p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen transition-colors">
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
          Material Comparison Report
        </span>
      </div>

      {/* Filter Card Container */}
      <div className="bg-[#f8f9fa] dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg p-3.5 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <option value="PRJ-1001">Hena Heights (PRJ-1001)</option>
              <option value="PRJ-1002">Rifat Eyecon City (PRJ-1002)</option>
              <option value="PRJ-1003">Green Valley Residency (PRJ-1003)</option>
              <option value="PRJ-1004">Metro Sky Tower (PRJ-1004)</option>
            </select>
          </div>

          {/* Task */}
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
              <option value="Substructure & Foundation">Substructure & Foundation</option>
              <option value="RCC Casting (Beam & Column)">RCC Casting (Beam & Column)</option>
              <option value="Brickwork & Masonry">Brickwork & Masonry</option>
              <option value="Finishing & Fitting">Finishing & Fitting</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Bar (Excel, PDF, Entries & Search) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <button className="bg-[#0f9f59] hover:bg-[#0b8247] text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors shadow-sm">
            Excel
          </button>
          <button className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors shadow-sm">
            PDF
          </button>

          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 ml-0 sm:ml-2">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
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

      {/* Child Component (Table, Totals & Pagination) */}
      <MaterialComparisonTable
        data={filteredData}
        paginatedData={paginatedData}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        totals={totals}
      />
    </div>
  );
}
