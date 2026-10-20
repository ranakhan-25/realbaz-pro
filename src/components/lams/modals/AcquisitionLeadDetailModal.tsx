"use client";

import React from "react";
import {
  X,
  Compass,
  MapPin,
  Building,
  User,
  Phone,
  FileText,
  BadgeCheck,
  Calendar,
  Layers,
  Banknote,
  Share2,
} from "lucide-react";
import { AcquisitionLead } from "@/types/lams";

interface AcquisitionLeadDetailModalProps {
  lead: AcquisitionLead | null;
  isOpen: boolean;
  onClose: () => void;
}

const STAGE_ORDER = [
  "New",
  "Contacted",
  "In Negotiation",
  "Legal Verification",
  "Agreement Ready",
  "Acquired",
];

export function AcquisitionLeadDetailModal({
  lead,
  isOpen,
  onClose,
}: AcquisitionLeadDetailModalProps) {
  if (!isOpen || !lead) return null;

  const currentStageIdx = STAGE_ORDER.indexOf(lead.leadStage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                  {lead.leadCode}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {lead.leadStatus}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {lead.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Status Tracker: Stage Progression Stepper */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Acquisition Pipeline Progression
              </span>
              <span className="font-bold text-cyan-700 dark:text-cyan-400">
                Current: {lead.leadStage}
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1 text-center text-[10px]">
              {STAGE_ORDER.map((stage, idx) => {
                const isPassed = idx <= currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                return (
                  <div key={stage} className="space-y-1">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isCurrent
                          ? "bg-cyan-500 shadow-sm shadow-cyan-500/50"
                          : isPassed
                          ? "bg-cyan-600/60"
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                    <span
                      className={`block truncate font-semibold ${
                        isCurrent
                          ? "text-cyan-600 dark:text-cyan-400 font-bold"
                          : isPassed
                          ? "text-slate-700 dark:text-slate-300"
                          : "text-slate-400"
                      }`}
                      title={stage}
                    >
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 1: Land Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              Land & Location Details
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-[10px] font-medium text-slate-400">Address / Location</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{lead.address}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400">District & Upazila</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{lead.district}, {lead.upazila}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400">Mouza & JL No.</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{lead.mouza} ({lead.jlNo || "JL-N/A"})</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400">Dag No. (Plot)</p>
                <p className="font-mono font-bold text-cyan-700 dark:text-cyan-400 mt-0.5">{lead.dagNo}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400">Total Land Area</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                  {lead.landArea} {lead.landAreaUnit}s
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400">Zoning / Land Type</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{lead.landType}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400">Lead Source</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{lead.leadSource}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400">Khatian Records</p>
                <p className="font-mono text-slate-700 dark:text-slate-300 mt-0.5">{lead.khatianNo}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Valuation & Financials */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Banknote className="w-3.5 h-3.5" />
              Valuation & Price Benchmark
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-[10px] font-medium text-slate-400">Owner Expected Price</p>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5 font-display">
                  ৳{(lead.expectedPrice / 10000000).toFixed(2)} Crore
                </p>
                <p className="text-[10px] text-slate-400">
                  ≈ ৳{Math.round(lead.expectedPrice / lead.landArea).toLocaleString()} / Decimal
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400">Company Offered Price</p>
                <p className="text-base font-bold text-cyan-600 dark:text-cyan-400 mt-0.5 font-display">
                  ৳{(lead.offeredPrice / 10000000).toFixed(2)} Crore
                </p>
                <p className="text-[10px] text-slate-400">
                  ≈ ৳{Math.round(lead.offeredPrice / lead.landArea).toLocaleString()} / Decimal
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400">Assigned Acquisition Officer</p>
                <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{lead.assignedUser}</p>
                <p className="text-[10px] text-slate-400">Created: {lead.createdAt}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Land Owner Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Land Owner Contact & Profile
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-[10px] font-medium text-slate-400">Primary Contact / Owner</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{lead.ownerName}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400">Contact Number</p>
                <a
                  href={`tel:${lead.ownerPhone}`}
                  className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-semibold hover:underline mt-0.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {lead.ownerPhone}
                </a>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400">Owner Present Address</p>
                <p className="text-slate-700 dark:text-slate-300 mt-0.5 truncate" title={lead.ownerAddress}>
                  {lead.ownerAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Remarks */}
          {lead.remarks && (
            <div className="bg-cyan-50/50 dark:bg-cyan-950/20 p-3.5 rounded-xl border border-cyan-200/50 dark:border-cyan-800/30">
              <p className="text-[10px] font-bold text-cyan-800 dark:text-cyan-300 uppercase tracking-wider mb-1">
                Strategic Acquisition Note
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300">{lead.remarks}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
