"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  CalendarCheck2,
  FileSpreadsheet,
  FileText,
  Calendar,
  Phone,
  Trash2,
  CheckCircle2,
  Clock,
  RotateCcw,
  Plus,
  Minus,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { FollowUpItem, AcquisitionLead, FollowUpStatus } from "@/types/lams";
import { AddFollowUpModal } from "./modals/AddFollowUpModal";

interface FollowUpViewProps {
  followUps: FollowUpItem[];
  onEditFollowUp?: (uuid: string, data: any) => void;
  onAddFollowUp: (item: FollowUpItem) => void;
  onDeleteFollowUp: (uuid: string) => void;
  onToggleComplete: (uuid: string) => void;
  acquisitionLeads: AcquisitionLead[];
}

const STATUS_BADGES: Record<
  FollowUpStatus,
  { bg: string; text: string; icon: React.ElementType }
> = {
  Pending: {
    bg: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    text: "text-amber-700",
    icon: Clock,
  },
  Completed: {
    bg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    text: "text-emerald-700",
    icon: CheckCircle2,
  },
  Rescheduled: {
    bg: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    text: "text-blue-700",
    icon: RotateCcw,
  },
  Cancelled: {
    bg: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
    text: "text-rose-700",
    icon: XCircle,
  },
};

export function FollowUpView({
  followUps,
  onAddFollowUp,
    onEditFollowUp,
  onDeleteFollowUp,
  onToggleComplete,
  acquisitionLeads,
}: FollowUpViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateRangeFilter, setDateRangeFilter] = useState("1 September, 2026 - 30 September, 2026");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<any>(null);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const filteredFollowUps = useMemo(() => {
    const safeFollowUps = Array.isArray(followUps) ? followUps : [];
    return safeFollowUps.filter((item) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        (item.landDetails || "").toLowerCase().includes(term) ||
        (item.ownerDetails || "").toLowerCase().includes(term) ||
        (item.contact || "").toLowerCase().includes(term) ||
        (item.note || "").toLowerCase().includes(term) ||
        (item.assignedTo || "").toLowerCase().includes(term);

      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [followUps, searchTerm, statusFilter]);

  const displayedFollowUps = filteredFollowUps.slice(0, entriesPerPage);

  const toggleExpand = (uuid: string) => {
    setExpandedId((prev) => (prev === uuid ? null : uuid));
  };

  const handleExport = (type: "Excel" | "PDF") => {
    setExportFeedback(`Exporting ${filteredFollowUps.length} follow-up records to ${type}...`);
    setTimeout(() => {
      setExportFeedback(null);
    }, 2800);
  };

  return (
    <div className="space-y-4">
      {/* 1. Date & Status Filter Bar (matches screenshot follow-up.png) */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Select Date input */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Date Range
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Follow Up Status Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Follow Up Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white"
            >
              <option value="ALL">All Follow Ups</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Export Buttons */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Export Schedule
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExport("Excel")}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel</span>
              </button>
              <button
                onClick={() => handleExport("PDF")}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {exportFeedback && (
          <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-xs text-cyan-700 dark:text-cyan-300 font-semibold animate-in fade-in">
            {exportFeedback}
          </div>
        )}
      </div>

      {/* 2. Search & Entries Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>Show</span>
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-bold"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search follow ups, notes, contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-600/20 whitespace-nowrap transition-all"
          >
            <CalendarCheck2 className="w-4 h-4" />
            <span>+ Add Follow Up</span>
          </button>
        </div>
      </div>

      {/* 3. Modernized Data Table (Transformed from screenshot follow-up.png) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 w-12 text-center">SL</th>
                <th className="py-3 px-3.5">Date</th>
                <th className="py-3 px-3.5">Land Details</th>
                <th className="py-3 px-3.5">Owner Details</th>
                <th className="py-3 px-3.5">Contact</th>
                <th className="py-3 px-3.5">Task Type</th>
                <th className="py-3 px-3.5 text-center">Status</th>
                <th className="py-3 px-3.5">Note</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedFollowUps.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No follow up tasks found. Click "+ Add Follow Up" to create one.
                  </td>
                </tr>
              ) : (
                displayedFollowUps.map((item, idx) => {
                  const isExpanded = expandedId === item.uuid;
                  const statusInfo = STATUS_BADGES[item.status as FollowUpStatus] || { bg: "bg-slate-100 text-slate-800", text: "text-slate-700", icon: Clock };
                  const StatusIcon = statusInfo.icon;

                  return (
                    <React.Fragment key={item.uuid}>
                      <tr
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                          isExpanded ? "bg-cyan-50/40 dark:bg-cyan-950/20" : ""
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => toggleExpand(item.uuid || item.id)}
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition-all font-bold"
                            title={isExpanded ? "Collapse" : "Expand"}
                          >
                            {isExpanded ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          </button>
                        </td>

                        <td className="py-3 px-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {item.date}
                        </td>

                        <td className="py-3 px-3.5 font-semibold text-slate-800 dark:text-slate-200">
                          {item.landDetails}
                        </td>

                        <td className="py-3 px-3.5 text-slate-800 dark:text-slate-200 font-medium">
                          {item.ownerDetails}
                        </td>

                        <td className="py-3 px-3.5">
                          <a
                            href={`tel:${item.contact}`}
                            className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                          >
                            <Phone className="w-3 h-3" />
                            {item.contact}
                          </a>
                        </td>

                        <td className="py-3 px-3.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {item.followUpType}
                          </span>
                        </td>

                        <td className="py-3 px-3.5 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusInfo.bg}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {item.status}
                          </span>
                        </td>

                        <td className="py-3 px-3.5 text-slate-600 dark:text-slate-400 max-w-[220px] truncate" title={item.note}>
                          {item.note}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => onToggleComplete(item.uuid || item.id)}
                              className={`p-1.5 rounded-lg transition-all ${
                                item.status === "Completed"
                                  ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
                                  : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                              }`}
                              title={item.status === "Completed" ? "Mark Pending" : "Mark Completed"}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingFollowUp(item)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all"
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <button
                              onClick={() => onDeleteFollowUp(item.uuid || item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable row */}
                      {isExpanded && (
                        <tr className="bg-cyan-50/20 dark:bg-cyan-950/10">
                          <td colSpan={9} className="p-4 border-y border-cyan-100 dark:border-cyan-900/40">
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-cyan-200/60 dark:border-cyan-800/40 shadow-xs space-y-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Detailed Follow-Up Memo & Objective
                              </p>
                              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                                "{item.note}"
                              </p>
                              <div className="flex items-center gap-4 pt-2 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-700/50">
                                <span>Assigned Officer: <strong className="text-slate-800 dark:text-slate-200">{item.assignedTo}</strong></span>
                                <span>Activity: <strong className="text-slate-800 dark:text-slate-200">{item.followUpType}</strong></span>
                                <span>Scheduled Date: <strong className="text-slate-800 dark:text-slate-200">{item.date}</strong></span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs text-slate-500">
          <div>
            Showing 1 to {Math.min(displayedFollowUps.length, filteredFollowUps.length)} of {filteredFollowUps.length} entries
          </div>

          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <button
              disabled
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 opacity-50 cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 rounded-lg bg-cyan-600 text-white font-bold shadow-xs">
              1
            </span>
            <button
              disabled
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 opacity-50 cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <AddFollowUpModal
        isOpen={isAddModalOpen || !!editingFollowUp}
        onClose={() => { setIsAddModalOpen(false); setEditingFollowUp(null); }}
        onAddFollowUp={(data) => {
          if (editingFollowUp && onEditFollowUp) {
            onEditFollowUp(editingFollowUp.uuid, data);
          } else {
            onAddFollowUp(data);
          }
          setIsAddModalOpen(false);
          setEditingFollowUp(null);
        }}
        editData={editingFollowUp}
        acquisitionLeads={acquisitionLeads}
      />
    </div>
  );
}
