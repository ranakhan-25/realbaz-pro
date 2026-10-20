"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  PlusCircle,
  Eye,
  Trash2,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  RotateCcw,
} from "lucide-react";
import { AcquisitionLead, LeadStage } from "@/types/lams";
import { AddAcquisitionLeadModal } from "./modals/AddAcquisitionLeadModal";
import { AcquisitionLeadDetailModal } from "./modals/AcquisitionLeadDetailModal";

interface AcquisitionLeadsViewProps {
  leads: AcquisitionLead[];
  onEditLead?: (uuid: string, data: any) => void;
  onAddLead: (lead: AcquisitionLead) => void;
  onDeleteLead: (uuid: string) => void;
}

const DISTRICTS = ["Dhaka", "Narayanganj", "Gazipur", "Munshiganj", "Manikganj", "Narsingdi", "Tangail"];
const UPAZILAS = ["Rupganj", "Keraniganj", "Savar", "Gazipur Sadar", "Sonargaon", "Dhamrai", "Kaliakair"];
const SOURCES = ["Direct Owner", "Broker", "Referral", "Media / Ad", "Cold Contact", "Online Listing"];
const USERS = ["Sakib Al Hasan", "Rezaul Karim", "Tanvir Hossain", "Shamim Khan", "Farhana Ahmed"];

const STAGE_BADGES: Record<LeadStage, { bg: string; text: string; ring: string }> = {
  New: { bg: "bg-blue-50 dark:bg-blue-950/60", text: "text-blue-700 dark:text-blue-300", ring: "ring-blue-200 dark:ring-blue-800" },
  Contacted: { bg: "bg-purple-50 dark:bg-purple-950/60", text: "text-purple-700 dark:text-purple-300", ring: "ring-purple-200 dark:ring-purple-800" },
  "In Negotiation": { bg: "bg-amber-50 dark:bg-amber-950/60", text: "text-amber-700 dark:text-amber-300", ring: "ring-amber-200 dark:ring-amber-800" },
  "Legal Verification": { bg: "bg-indigo-50 dark:bg-indigo-950/60", text: "text-indigo-700 dark:text-indigo-300", ring: "ring-indigo-200 dark:ring-indigo-800" },
  "Agreement Ready": { bg: "bg-emerald-50 dark:bg-emerald-950/60", text: "text-emerald-700 dark:text-emerald-300", ring: "ring-emerald-200 dark:ring-emerald-800" },
  Acquired: { bg: "bg-teal-50 dark:bg-teal-950/60", text: "text-teal-700 dark:text-teal-300", ring: "ring-teal-200 dark:ring-teal-800" },
};

export function AcquisitionLeadsView({
  leads,
  onAddLead,
    onEditLead,
  onDeleteLead,
}: AcquisitionLeadsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [upazilaFilter, setUpazilaFilter] = useState("ALL");
  const [userFilter, setUserFilter] = useState("ALL");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<AcquisitionLead | null>(null);

  // Collect unique filter options from dataset merged with defaults
  const safeLeads = Array.isArray(leads) ? leads : [];
  const districts = useMemo(() => Array.from(new Set([...DISTRICTS, ...safeLeads.map((l) => l.district).filter(Boolean)])), [safeLeads]);
  const upazilas = useMemo(() => Array.from(new Set([...UPAZILAS, ...safeLeads.map((l) => l.upazila).filter(Boolean)])), [safeLeads]);
  const sources = useMemo(() => Array.from(new Set([...SOURCES, ...safeLeads.map((l) => l.leadSource).filter(Boolean)])), [safeLeads]);
  const users = useMemo(() => Array.from(new Set([...USERS, ...safeLeads.map((l) => l.assignedUser).filter(Boolean)])), [safeLeads]);

  const resetFilters = () => {
    setSearchTerm("");
    setStageFilter("ALL");
    setSourceFilter("ALL");
    setDistrictFilter("ALL");
    setUpazilaFilter("ALL");
    setUserFilter("ALL");
  };

  const filteredLeads = useMemo(() => {
    const safeLeads = Array.isArray(leads) ? leads : [];
    return safeLeads.filter((lead) => {
      const matchesSearch =
        !searchTerm ||
        (lead.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.leadCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.mouza || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.dagNo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.ownerName || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStage = stageFilter === "ALL" || lead.leadStage === stageFilter;
      const matchesSource = sourceFilter === "ALL" || lead.leadSource === sourceFilter;
      const matchesDistrict = districtFilter === "ALL" || lead.district === districtFilter;
      const matchesUpazila = upazilaFilter === "ALL" || lead.upazila === upazilaFilter;
      const matchesUser = userFilter === "ALL" || lead.assignedUser === userFilter;

      return (
        matchesSearch &&
        matchesStage &&
        matchesSource &&
        matchesDistrict &&
        matchesUpazila &&
        matchesUser
      );
    });
  }, [leads, searchTerm, stageFilter, sourceFilter, districtFilter, upazilaFilter, userFilter]);

  const displayedLeads = filteredLeads.slice(0, entriesPerPage);

  return (
    <div className="space-y-4">
      {/* 1. Multi-Dropdown Filter Bar (matching screenshot acquis1ition-l.jpg) */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Filter className="w-3.5 h-3.5 text-cyan-600" />
            <span>Filter Acquisition Pipeline</span>
          </div>
          {(stageFilter !== "ALL" || sourceFilter !== "ALL" || districtFilter !== "ALL" || upazilaFilter !== "ALL" || userFilter !== "ALL") && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {/* Lead Stage */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Lead Stage
            </label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            >
              <option value="ALL">All Stages</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="In Negotiation">In Negotiation</option>
              <option value="Legal Verification">Legal Verification</option>
              <option value="Agreement Ready">Agreement Ready</option>
              <option value="Acquired">Acquired</option>
            </select>
          </div>

          {/* Lead Source */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Lead Source
            </label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            >
              <option value="ALL">All Sources</option>
              {sources.map((src) => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              District
            </label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            >
              <option value="ALL">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Upazila */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Upazila
            </label>
            <select
              value={upazilaFilter}
              onChange={(e) => setUpazilaFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            >
              <option value="ALL">All Upazilas</option>
              {upazilas.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {/* Assign User */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Assign User
            </label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            >
              <option value="ALL">All Officers</option>
              {users.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Table Control Bar: Search + Show Entries + Add Lead Button */}
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
              placeholder="Search leads, mouza, dag, owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-600/20 whitespace-nowrap transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Acquisition Lead Add</span>
          </button>
        </div>
      </div>

      {/* 3. Modernized Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 w-12 text-center">SL</th>
                <th className="py-3 px-3.5">Lead Code</th>
                <th className="py-3 px-3.5">Parcel Title / Property</th>
                <th className="py-3 px-3.5">Mouza & Dag</th>
                <th className="py-3 px-3.5">Area (Dec)</th>
                <th className="py-3 px-3.5 text-center">Stage</th>
                <th className="py-3 px-3.5">Expected Price</th>
                <th className="py-3 px-3.5">Offered Price</th>
                <th className="py-3 px-3.5">Assigned Officer</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedLeads.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No acquisition leads found matching the selected filters.
                  </td>
                </tr>
              ) : (
                displayedLeads.map((lead, idx) => {
                  const stageStyle = STAGE_BADGES[lead.leadStage as LeadStage] || { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300", ring: "ring-slate-200 dark:ring-slate-700" };
                  return (
                    <tr
                      key={lead.uuid}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 px-3 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3.5 font-mono font-bold text-cyan-700 dark:text-cyan-400">
                        {lead.leadCode}
                      </td>
                      <td className="py-3 px-3.5">
                        <p className="font-bold text-slate-900 dark:text-white">{lead.title}</p>
                        <p className="text-[10px] text-slate-400">{lead.district}, {lead.upazila}</p>
                      </td>
                      <td className="py-3 px-3.5">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{lead.mouza}</p>
                        <p className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">Dag: {lead.dagNo}</p>
                      </td>
                      <td className="py-3 px-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                        {lead.landArea} {lead.landAreaUnit}s
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${stageStyle.bg} ${stageStyle.text} ring-1 ${stageStyle.ring}`}
                        >
                          {lead.leadStage}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 font-bold text-slate-800 dark:text-slate-200">
                        ৳{(lead.expectedPrice / 10000000).toFixed(2)} Cr
                      </td>
                      <td className="py-3 px-3.5 font-bold text-cyan-700 dark:text-cyan-400">
                        ৳{(lead.offeredPrice / 10000000).toFixed(2)} Cr
                      </td>
                      <td className="py-3 px-3.5 font-medium text-slate-700 dark:text-slate-300">
                        {lead.assignedUser}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedLeadForDetail(lead)}
                            className="p-1.5 rounded-lg text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 transition-all"
                            title="View Full Lead Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                              onClick={() => setEditingLead(lead)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all"
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                              <button
                                onClick={() => onDeleteLead(lead.uuid || lead.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                                title="Delete Lead"
                              >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs text-slate-500">
          <div>
            Showing 1 to {Math.min(displayedLeads.length, filteredLeads.length)} of {filteredLeads.length} entries
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

      {/* Modals */}
      <AddAcquisitionLeadModal
        isOpen={isAddModalOpen || !!editingLead}
        onClose={() => { setIsAddModalOpen(false); setEditingLead(null); }}
        onAddLead={(data) => {
          if (editingLead && onEditLead) {
            onEditLead(editingLead.uuid, data);
          } else {
            onAddLead(data);
          }
          setIsAddModalOpen(false);
          setEditingLead(null);
        }}
        editData={editingLead}
      />

      <AcquisitionLeadDetailModal
        lead={selectedLeadForDetail}
        isOpen={!!selectedLeadForDetail}
        onClose={() => setSelectedLeadForDetail(null)}
      />
    </div>
  );
}
