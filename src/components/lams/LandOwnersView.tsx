"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  UserPlus,
  Plus,
  Minus,
  Trash2,
  Phone,
  MapPin,
  FileBadge,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";
import { LandOwner, AcquisitionLead } from "@/types/lams";
import { AddLandOwnerModal } from "./modals/AddLandOwnerModal";

interface LandOwnersViewProps {
  owners: LandOwner[];
  onEditOwner?: (uuid: string, data: any) => void;
  onAddOwner: (owner: LandOwner) => void;
  onDeleteOwner: (uuid: string) => void;
  acquisitionLeads: AcquisitionLead[];
}

export function LandOwnersView({
  owners,
  onAddOwner,
    onEditOwner,
  onDeleteOwner,
  acquisitionLeads,
}: LandOwnersViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<any>(null);

  // Filter owners
  const filteredOwners = useMemo(() => {
    const safeOwners = Array.isArray(owners) ? owners : [];
    const term = searchTerm.toLowerCase().trim();
    if (!term) return safeOwners;
    return safeOwners.filter(
      (o) =>
        (o.ownerName || "").toLowerCase().includes(term) ||
        (o.code || "").toLowerCase().includes(term) ||
        (o.landPlot || "").toLowerCase().includes(term) ||
        (o.phone || "").toLowerCase().includes(term) ||
        (o.nidNumber || "").toLowerCase().includes(term) ||
        (o.fatherName || "").toLowerCase().includes(term)
    );
  }, [owners, searchTerm]);

  const displayedOwners = filteredOwners.slice(0, entriesPerPage);

  const toggleExpand = (uuid: string) => {
    setExpandedId((prev) => (prev === uuid ? null : uuid));
  };

  return (
    <div className="space-y-4">
      {/* Action and Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Show Entries dropdown */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>Show</span>
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>

        {/* Right: Search + Add Button */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search owners, plots, code, NID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-600/20 whitespace-nowrap transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Land Owner Add</span>
          </button>
        </div>
      </div>

      {/* Modernized Data Table (Transformed from screenshot table) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 w-12 text-center">SL</th>
                <th className="py-3 px-3.5">Code</th>
                <th className="py-3 px-3.5">Land / Plot</th>
                <th className="py-3 px-3.5">Primary Owner</th>
                <th className="py-3 px-3.5">Father Name</th>
                <th className="py-3 px-3.5">NID</th>
                <th className="py-3 px-3.5">Phone</th>
                <th className="py-3 px-3.5">Address</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3.5">Added By</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedOwners.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No land owners found matching your search.
                  </td>
                </tr>
              ) : (
                displayedOwners.map((owner, idx) => {
                  const isExpanded = expandedId === owner.uuid;
                  return (
                    <React.Fragment key={owner.uuid}>
                      <tr
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                          isExpanded ? "bg-cyan-50/40 dark:bg-cyan-950/20" : ""
                        }`}
                      >
                        {/* SL + Expand trigger */}
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => toggleExpand(owner.uuid || owner.id)}
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition-all font-bold"
                            title={isExpanded ? "Collapse Details" : "Expand Details"}
                          >
                            {isExpanded ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          </button>
                        </td>

                        {/* Code */}
                        <td className="py-3 px-3.5 font-mono font-bold text-cyan-700 dark:text-cyan-400">
                          {owner.code}
                        </td>

                        {/* Land/Plot */}
                        <td className="py-3 px-3.5 font-semibold text-slate-800 dark:text-slate-200">
                          {owner.landPlot}
                        </td>

                        {/* Primary Owner */}
                        <td className="py-3 px-3.5 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-1.5">
                            <span>{owner.ownerName}</span>
                            {owner.isPrimary ? (
                              <span className="px-1.5 py-0.5 rounded-sm text-[10px] font-bold bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
                                Primary
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                Co-Sharer
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Father Name */}
                        <td className="py-3 px-3.5 text-slate-600 dark:text-slate-400">
                          {owner.fatherName || "—"}
                        </td>

                        {/* NID */}
                        <td className="py-3 px-3.5 font-mono text-slate-700 dark:text-slate-300">
                          {owner.nidNumber || "—"}
                        </td>

                        {/* Phone */}
                        <td className="py-3 px-3.5 text-slate-700 dark:text-slate-300">
                          <a
                            href={`tel:${owner.phone}`}
                            className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
                          >
                            <Phone className="w-3 h-3" />
                            {owner.phone}
                          </a>
                        </td>

                        {/* Address */}
                        <td className="py-3 px-3.5 text-slate-600 dark:text-slate-400 max-w-[180px] truncate" title={owner.address}>
                          {owner.address || "—"}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              owner.status === "Active"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {owner.status === "Active" ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {owner.status}
                          </span>
                        </td>

                        {/* Added By */}
                        <td className="py-3 px-3.5 text-slate-600 dark:text-slate-400 font-medium">
                          {owner.addedBy}
                        </td>

                        {/* Action */}
                        <td className="py-3 px-3 text-center">
                          <button
                              onClick={() => setEditingOwner(owner)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all"
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <button
                              onClick={() => onDeleteOwner(owner.uuid || owner.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                              title="Delete Owner"
                            >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>

                      {/* Expandable row card */}
                      {isExpanded && (
                        <tr className="bg-cyan-50/20 dark:bg-cyan-950/10">
                          <td colSpan={11} className="p-4 border-y border-cyan-100 dark:border-cyan-900/40">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-800/90 p-4 rounded-xl border border-cyan-200/60 dark:border-cyan-800/40 shadow-xs">
                              <div className="space-y-1">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                  Ownership Share & Succession
                                </p>
                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                                  Holding {owner.ownershipSharePercentage || 50}% of Plot Area
                                </p>
                                <p className="text-xs text-slate-500">
                                  {owner.isPrimary ? "Lead Signatory for Acquisition & Bainanama" : "Consent deed required for registration"}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                  Full Permanent Address
                                </p>
                                <p className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                                  {owner.address || "Address not provided on file"}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                  Legal Remarks & Notes
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                                  "{owner.remarks || "No additional caveats or remarks noted."}"
                                </p>
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

        {/* Table Footer / Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs text-slate-500">
          <div>
            Showing 1 to {Math.min(displayedOwners.length, filteredOwners.length)} of {filteredOwners.length} entries
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

      {/* Add Owner Modal */}
      <AddLandOwnerModal
        isOpen={isAddModalOpen || !!editingOwner}
        onClose={() => { setIsAddModalOpen(false); setEditingOwner(null); }}
        onAddOwner={(data) => {
          if (editingOwner && onEditOwner) {
            onEditOwner(editingOwner.uuid, data);
          } else {
            onAddOwner(data);
          }
          setIsAddModalOpen(false);
          setEditingOwner(null);
        }}
        editData={editingOwner}
        acquisitionLeads={acquisitionLeads}
      />
    </div>
  );
}
