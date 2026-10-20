/* eslint-disable prettier/prettier */
"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, FileText, Check } from "lucide-react";

interface LeaveApplicationRow {
  id: number;
  staff: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
  addBy: string;
  approvals: {
    completed: boolean;
    approvedBy: string[];
  };
}

const INITIAL_ROWS: LeaveApplicationRow[] = [
  {
    id: 1,
    staff: "Tazmul Reza",
    leaveType: "Casual",
    fromDate: "08 Sept 2026",
    toDate: "10 Sept 2026",
    reason: "Sick",
    status: "Approved",
    addBy: "Tazmul Reza",
    approvals: {
      completed: true,
      approvedBy: ["Rifat Hosain", "Admin"],
    },
  },
];

export default function LeaveApplicationListPage() {
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [rows] = useState<LeaveApplicationRow[]>(INITIAL_ROWS);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-800 dark:text-gray-200">
      {/* Breadcrumb & Top Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
        <div className="text-[13px] text-gray-500 dark:text-gray-400">
          <span className="hover:text-black dark:hover:text-white cursor-pointer">Home</span>
          <span className="mx-1">›</span>
          <span className="hover:text-black dark:hover:text-white cursor-pointer">HRM</span>
          <span className="mx-1">›</span>
          <span className="text-black dark:text-white font-medium">Leave Application List</span>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-black dark:bg-neutral-800 border dark:border-neutral-700 text-white text-[12.5px] font-medium hover:bg-neutral-800 dark:hover:bg-neutral-700 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          +Leave Application Add
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[13px]">
          <div className="flex items-center gap-1.5">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(e.target.value)}
              className="border border-gray-300 dark:border-neutral-700 rounded px-2 py-1 text-[12px] bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 focus:outline-none"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>entries</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Search:</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 dark:border-neutral-700 rounded px-2 py-1 text-[12px] bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-neutral-900 rounded border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="bg-black dark:bg-neutral-800 text-white">
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">SL</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">STAFF</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">LEAVE TYPE</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">FROM DATE</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">TO DATE</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">REASON</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">STATUS</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">ADD BY</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">APPROVE</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-3 py-8 text-center text-gray-400 dark:text-gray-500">
                      No matching records found
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="border-b border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                      <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">{row.id}</td>
                      <td className="px-3 py-2.5 text-gray-900 dark:text-white font-medium whitespace-nowrap">
                        {row.staff}
                      </td>
                      <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {row.leaveType}
                      </td>
                      <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {row.fromDate}
                      </td>
                      <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {row.toDate}
                      </td>
                      <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300">{row.reason}</td>
                      <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300">{row.status}</td>
                      <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {row.addBy}
                      </td>
                      <td className="px-3 py-2.5 text-[11.5px]">
                        {row.approvals.completed && (
                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium mb-0.5">
                            <Check className="w-3.5 h-3.5" />
                            <span>All Approvals Completed.</span>
                          </div>
                        )}
                        {row.approvals.approvedBy.map((person) => (
                          <div key={person} className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <Check className="w-3 h-3" />
                            <span>{person}</span>
                          </div>
                        ))}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            title="Edit"
                            className="p-1.5 rounded bg-cyan-500 hover:bg-cyan-600 text-white shadow-sm"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Delete"
                            className="p-1.5 rounded bg-rose-500 hover:bg-rose-600 text-white shadow-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Details"
                            className="p-1.5 rounded bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-gray-500 dark:text-gray-400 pb-6">
          <div>
            Showing 1 to {rows.length} of {rows.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled
              className="px-3 py-1 border border-gray-200 dark:border-neutral-800 rounded text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-neutral-900 cursor-not-allowed"
            >
              Previous
            </button>
            <button className="px-3 py-1 rounded bg-black dark:bg-neutral-700 text-white font-medium">
              1
            </button>
            <button
              disabled
              className="px-3 py-1 border border-gray-200 dark:border-neutral-800 rounded text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-neutral-900 cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}