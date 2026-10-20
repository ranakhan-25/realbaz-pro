"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { ProjectType } from "@/types/project-type";

// Initial mock data extracted from your image
const initialData: ProjectType[] = [
  { id: 14, code: "P4773027", name: "Office" },
  { id: 15, code: "P7566761", name: "Real Estate" },
  { id: 16, code: "P9579440", name: "Construction" },
  { id: 17, code: "P2596945", name: "Design" },
  { id: 18, code: "P1554959", name: "Land Share" },
  { id: 19, code: "P7784999", name: "Share Project" },
  { id: 21, code: "P2777817", name: "Interior" },
];

export default function ProjectTypePage() {
  const [data, setData] = useState<ProjectType[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for creating a new item
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");

  // Filter data based on search input (Dynamic ready)
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle Add (Ready to hook up with Backend API via POST)
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    const newItem: ProjectType = {
      id: Date.now(), // Replace with ID generated from DB/API
      code: newCode,
      name: newName,
    };

    setData([newItem, ...data]);
    setNewCode("");
    setNewName("");
    setIsModalOpen(false);
  };

  // Handle Delete (Ready to hook up with Backend API via DELETE)
  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-white p-8 text-slate-800">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Breadcrumb & Header Action */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="text-sm text-slate-500">
              Home <span className="mx-1">/</span> Project{" "}
              <span className="mx-1">/</span>{" "}
              <span className="text-slate-800 font-medium">Project Type</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
              Project Types
            </h1>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Project Type
          </button>
        </div>

        {/* Toolbar: Select Columns & Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition">
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            Select Columns
          </button>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search code or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Modern Clean Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <th className="py-3.5 pl-6 pr-4">ID</th>
                  <th className="px-4 py-3.5">Code</th>
                  <th className="px-4 py-3.5">Name</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-4 pl-6 pr-4 font-medium text-slate-600">
                        {item.id}
                      </td>
                      <td className="px-4 py-4 font-mono text-slate-700">
                        {item.code}
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-900">
                        {item.name}
                      </td>
                      <td className="py-4 pl-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 transition"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 transition"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No project types found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
            <span className="text-sm text-slate-500">
              Showing <span className="font-medium">{filteredData.length}</span>{" "}
              results
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-400 cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <button className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm">
                1
              </button>
              <button
                disabled
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-400 cursor-not-allowed"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Add New Project Type
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. P998877"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Technology"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
                >
                  Save Project Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
