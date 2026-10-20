"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, ArrowUpDown, X, Clock } from "lucide-react";

// API থেকে আসা Shift Data-র Interface
interface ShiftDaySchedule {
  day: string;
  enabled: boolean;
  fromTime: string;
  toTime: string;
}

interface Shift {
  id: number;
  sl: number;
  name: string;
  schedules?: ShiftDaySchedule[];
}

// ডিফল্ট সপ্তাহের দিনগুলো
const initialDays: ShiftDaySchedule[] = [
  { day: "Saturday", enabled: true, fromTime: "", toTime: "" },
  { day: "Sunday", enabled: true, fromTime: "", toTime: "" },
  { day: "Monday", enabled: true, fromTime: "", toTime: "" },
  { day: "Tuesday", enabled: true, fromTime: "", toTime: "" },
  { day: "Wednesday", enabled: true, fromTime: "", toTime: "" },
  { day: "Thursday", enabled: true, fromTime: "", toTime: "" },
  { day: "Friday", enabled: true, fromTime: "", toTime: "" },
];

// মক ডাটা (API যুক্ত করার পূর্ব পর্যন্ত)
const initialShiftData: Shift[] = [
  { id: 1, sl: 1, name: "General Shift" },
  { id: 2, sl: 2, name: "Morning Shift" },
  { id: 3, sl: 3, name: "Night Shift" },
  { id: 4, sl: 4, name: "Roster Shift" },
];

export default function ShiftListPage() {
  const [shifts, setShifts] = useState<Shift[]>(initialShiftData);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shiftName, setShiftName] = useState("");
  const [daysSchedule, setDaysSchedule] = useState<ShiftDaySchedule[]>(initialDays);

  // Checkbox Toggle Handler
  const handleDayToggle = (index: number) => {
    const updated = [...daysSchedule];
    updated[index].enabled = !updated[index].enabled;
    setDaysSchedule(updated);
  };

  // Time Change Handler
  const handleTimeChange = (index: number, field: "fromTime" | "toTime", value: string) => {
    const updated = [...daysSchedule];
    updated[index][field] = value;
    setDaysSchedule(updated);
  };

  // Submit Handler (API Ready)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftName.trim()) return;

    const newShift: Shift = {
      id: shifts.length + 1,
      sl: shifts.length + 1,
      name: shiftName.trim(),
      schedules: daysSchedule,
    };

    setShifts([...shifts, newShift]);
    
    // Reset State
    setShiftName("");
    setDaysSchedule(initialDays);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-100 p-4 md:p-6 transition-colors duration-200">
      {/* Top Header Section: Breadcrumb & Add Button */}
      <div className="flex items-center justify-between mb-4">
        <nav className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium">
          <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
            Home
          </span>
          <span>&gt;</span>
          <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
            Employee
          </span>
          <span>&gt;</span>
          <span className="text-slate-400 dark:text-slate-500">
            Shift List
          </span>
        </nav>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Shift Add
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-[#080d1a] rounded-xl shadow-lg border border-slate-200 dark:border-[#131c31] p-5 mb-6">
        {/* Filter & Search Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span>Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-3 py-1.5 text-xs bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-[#131c31] rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-indigo-600 dark:bg-[#030712] text-white dark:text-slate-300 font-semibold border-b border-indigo-700 dark:border-[#131c31] tracking-wider">
                <th className="p-3 w-16">
                  <div className="flex items-center gap-1">
                    SL
                    <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                  </div>
                </th>
                <th className="p-3">
                  <div className="flex items-center gap-1">
                    SHIFT NAME
                    <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                  </div>
                </th>
                <th className="p-3 text-center w-28">
                  <div className="flex items-center justify-center gap-1">
                    ACTION
                    <ArrowUpDown className="w-3 h-3 text-indigo-200 dark:text-slate-500" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#131c31]/80 bg-white dark:bg-[#080d1a]">
              {shifts.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 dark:hover:bg-[#0e1628] transition-colors"
                >
                  <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">
                    {item.sl}
                  </td>
                  <td className="p-3 text-slate-800 dark:text-slate-200 font-medium">
                    {item.name}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        className="p-1.5 rounded bg-cyan-500 hover:bg-cyan-600 text-white transition-colors shadow-sm"
                        title="Edit Shift"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="p-1.5 rounded bg-rose-500 hover:bg-rose-600 text-white transition-colors shadow-sm"
                        title="Delete Shift"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
          <div>Showing 1 to {shifts.length} of {shifts.length} entries</div>
          <div className="flex items-center gap-1">
            <button
              className="px-3 py-1.5 rounded border border-slate-200 dark:border-[#1e293b] text-slate-400 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-40"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1.5 rounded bg-indigo-600 text-white font-medium">
              1
            </button>
            <button className="px-3 py-1.5 rounded border border-slate-200 dark:border-[#1e293b] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Shift Add Modal (Follows Image 17.PNG Exactly) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#080d1a] border border-slate-200 dark:border-[#131c31] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#131c31]">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Shift
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Name<span className="text-rose-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter Name"
                  value={shiftName}
                  onChange={(e) => setShiftName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Day & Time Grid Table */}
              <div className="border border-slate-200 dark:border-[#131c31] rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-indigo-600 dark:bg-indigo-600/90 text-white font-semibold">
                      <th className="p-2.5 text-left w-1/3 border-r border-indigo-500/30">DAY</th>
                      <th className="p-2.5 text-left w-1/3 border-r border-indigo-500/30">FROM TIME</th>
                      <th className="p-2.5 text-left w-1/3">TO TIME</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#131c31]">
                    {daysSchedule.map((item, index) => (
                      <tr key={item.day} className="bg-white dark:bg-[#080d1a]">
                        {/* Day Pill Column */}
                        <td className="p-2 border-r border-slate-200 dark:border-[#131c31]">
                          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-200 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-300 font-medium text-xs w-full cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={item.enabled}
                              onChange={() => handleDayToggle(index)}
                              className="rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                            />
                            <span>{item.day}</span>
                          </label>
                        </td>

                        {/* From Time Input */}
                        <td className="p-2 border-r border-slate-200 dark:border-[#131c31]">
                          <div className="relative flex items-center">
                            <input
                              type="time"
                              value={item.fromTime}
                              onChange={(e) => handleTimeChange(index, "fromTime", e.target.value)}
                              disabled={!item.enabled}
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 disabled:opacity-40"
                            />
                          </div>
                        </td>

                        {/* To Time Input */}
                        <td className="p-2">
                          <div className="relative flex items-center">
                            <input
                              type="time"
                              value={item.toTime}
                              onChange={(e) => handleTimeChange(index, "toTime", e.target.value)}
                              disabled={!item.enabled}
                              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#030712] border border-slate-200 dark:border-[#1e293b] rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 disabled:opacity-40"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 text-xs font-medium rounded bg-slate-400 dark:bg-slate-600 hover:bg-slate-500 dark:hover:bg-slate-500 text-white transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-medium rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200/60 dark:border-[#131c31] pt-4">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>
    </div>
  );
}