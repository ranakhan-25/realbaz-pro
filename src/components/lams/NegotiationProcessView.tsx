"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Handshake,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  Plus,
  Minus,
} from "lucide-react";
import { NegotiationRecord, AcquisitionLead, NegotiationStatus } from "@/types/lams";
import { AddNegotiationModal } from "./modals/AddNegotiationModal";

interface NegotiationProcessViewProps {
  negotiations: NegotiationRecord[];
  onEditNegotiation?: (uuid: string, data: any) => void;
  onAddNegotiation: (record: NegotiationRecord) => void;
  onDeleteNegotiation: (uuid: string) => void;
  acquisitionLeads: AcquisitionLead[];
}

const STATUS_CONFIG: Record<
  NegotiationStatus,
  { bg: string; text: string; icon: React.ElementType }
> = {
  "In Progress": {
    bg: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    text: "text-blue-700",
    icon: Clock,
  },
  Agreed: {
    bg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    text: "text-emerald-700",
    icon: CheckCircle2,
  },
  "Revision Needed": {
    bg: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    text: "text-amber-700",
    icon: AlertTriangle,
  },
  Declined: {
    bg: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
    text: "text-rose-700",
    icon: XCircle,
  },
};

export function NegotiationProcessView({
  negotiations,
  onAddNegotiation,
    onEditNegotiation,
  onDeleteNegotiation,
  acquisitionLeads,
}: NegotiationProcessViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNegotiation, setEditingNegotiation] = useState<any>(null);

  const filteredNegotiations = useMemo(() => {
    const safeNegotiations = Array.isArray(negotiations) ? negotiations : [];
    return safeNegotiations.filter((item) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        (item.leadTitle || "").toLowerCase().includes(term) ||
        (item.mouza || "").toLowerCase().includes(term) ||
        (item.dagNo || "").toLowerCase().includes(term) ||
        (item.attendedBy || "").toLowerCase().includes(term);

      const matchesStatus = statusFilter === "ALL" || item.negotiationStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [negotiations, searchTerm, statusFilter]);

  const displayedNegotiations = filteredNegotiations.slice(0, entriesPerPage);

  const toggleExpand = (uuid: string) => {
    setExpandedId((prev) => (prev === uuid ? null : uuid));
  };

  return (
    <div className="space-y-4">
      {/* Top Action & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
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

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Agreed">Agreed</option>
              <option value="Revision Needed">Revision Needed</option>
              <option value="Declined">Declined</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search negotiations, plots, officers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-md shadow-amber-600/20 whitespace-nowrap transition-all"
          >
            <Handshake className="w-4 h-4" />
            <span>+ Negotiation Process Add</span>
          </button>
        </div>
      </div>

      {/* Modernized Table (Transformed from screenshot negotiation-p.jpg) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 w-12 text-center">SL</th>
                <th className="py-3 px-3.5">Acquisition Lead / Parcel</th>
                <th className="py-3 px-3.5">Mouza & Dag</th>
                <th className="py-3 px-3.5">Offered Total (৳)</th>
                <th className="py-3 px-3.5">Offered / Dec</th>
                <th className="py-3 px-3.5">Counter Offer (৳)</th>
                <th className="py-3 px-3.5">Counter / Dec</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3.5">Meeting Schedule</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedNegotiations.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No negotiation records found. Click "+ Negotiation Process Add" to create one.
                  </td>
                </tr>
              ) : (
                displayedNegotiations.map((item, idx) => {
                  const isExpanded = expandedId === item.uuid;
                  const statusInfo = STATUS_CONFIG[item.negotiationStatus as NegotiationStatus] || { bg: "bg-slate-100 text-slate-800", text: "text-slate-700", icon: AlertTriangle };
                  const StatusIcon = statusInfo.icon;
                  const priceGap = item.counterOfferByOwner - item.offeredTotalPrice;

                  return (
                    <React.Fragment key={item.uuid}>
                      <tr
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                          isExpanded ? "bg-amber-50/40 dark:bg-amber-950/20" : ""
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

                        <td className="py-3 px-3.5">
                          <p className="font-bold text-slate-900 dark:text-white">{item.leadTitle}</p>
                          <p className="text-[10px] text-slate-400">ID: {item.acquisitionLeadId}</p>
                        </td>

                        <td className="py-3 px-3.5 font-medium text-slate-700 dark:text-slate-300">
                          {item.mouza} (Dag {item.dagNo})
                        </td>

                        <td className="py-3 px-3.5 font-bold text-slate-900 dark:text-white">
                          ৳{(item.offeredTotalPrice / 10000000).toFixed(2)} Cr
                        </td>

                        <td className="py-3 px-3.5 text-cyan-600 dark:text-cyan-400 font-semibold font-mono">
                          ৳{(item.offeredPricePerDecimal).toLocaleString()}
                        </td>

                        <td className="py-3 px-3.5 font-bold text-amber-600 dark:text-amber-400">
                          ৳{(item.counterOfferByOwner / 10000000).toFixed(2)} Cr
                        </td>

                        <td className="py-3 px-3.5 text-amber-600 dark:text-amber-400 font-semibold font-mono">
                          ৳{(item.counterPricePerDecimal).toLocaleString()}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusInfo.bg}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {item.negotiationStatus}
                          </span>
                        </td>

                        <td className="py-3 px-3.5 text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{item.meetingDate}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => onDeleteNegotiation(item.uuid || item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                              title="Delete Negotiation"
                            >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>

                      {/* Expandable row: Remarks and Gap Analysis */}
                      {isExpanded && (
                        <tr className="bg-amber-50/20 dark:bg-amber-950/10">
                          <td colSpan={10} className="p-4 border-y border-amber-200/60 dark:border-amber-900/40">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-amber-200/60 dark:border-amber-800/40 shadow-xs">
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Price Variance & Gap
                                </p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                                  {priceGap > 0 ? `+৳${(priceGap / 100000).toFixed(1)} Lakh Counter Gap` : "Agreed at Offered Price"}
                                </p>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  Owner asking {(((item.counterOfferByOwner - item.offeredTotalPrice) / item.offeredTotalPrice) * 100).toFixed(1)}% above initial valuation
                                </p>
                              </div>

                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Attendees & Negotiation Officers
                                </p>
                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                                  {item.attendedBy}
                                </p>
                              </div>

                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Meeting Minutes & Remarks
                                </p>
                                <p className="text-xs text-slate-700 dark:text-slate-300 italic mt-0.5">
                                  "{item.remarks || "No additional caveats or remarks noted."}"
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

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs text-slate-500">
          <div>
            Showing 1 to {Math.min(displayedNegotiations.length, filteredNegotiations.length)} of {filteredNegotiations.length} entries
          </div>

          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <button
              disabled
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 opacity-50 cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 rounded-lg bg-amber-600 text-white font-bold shadow-xs">
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
      <AddNegotiationModal
        isOpen={isAddModalOpen || !!editingNegotiation}
        onClose={() => { setIsAddModalOpen(false); setEditingNegotiation(null); }}
        onAddNegotiation={(data) => {
          if (editingNegotiation && onEditNegotiation) {
            onEditNegotiation(editingNegotiation.uuid, data);
          } else {
            onAddNegotiation(data);
          }
          setIsAddModalOpen(false);
          setEditingNegotiation(null);
        }}
        editData={editingNegotiation}
        acquisitionLeads={acquisitionLeads}
      />
    </div>
  );
}
