"use client";

import React from "react";
import {
  Users,
  Compass,
  Handshake,
  FileCheck2,
  CalendarCheck2,
  BarChart3,
  ChevronRight,
  Home,
  Layers,
} from "lucide-react";

export type LamsTab =
  | "owners"
  | "leads"
  | "negotiation"
  | "documents"
  | "followup";

interface LamsHeaderNavProps {
  activeTab: LamsTab;
  onTabChange: (tab: LamsTab) => void;
  showInsights: boolean;
  onToggleInsights: () => void;
  counts: {
    owners: number;
    leads: number;
    negotiation: number;
    documents: number;
    followup: number;
  };
}

const TABS: { id: LamsTab; label: string; icon: React.ElementType }[] = [
  { id: "owners", label: "Land Owners", icon: Users },
  { id: "leads", label: "Acquisition Leads", icon: Compass },
  { id: "negotiation", label: "Negotiation Process", icon: Handshake },
  { id: "documents", label: "Legal Documents", icon: FileCheck2 },
  { id: "followup", label: "Follow Up", icon: CalendarCheck2 },
];

const TAB_TITLES: Record<LamsTab, string> = {
  owners: "Land Owners Directory",
  leads: "Land Acquisition Leads",
  negotiation: "Negotiation & Price Offer Process",
  documents: "Legal Title Deeds & Vetting Documents",
  followup: "Follow-Up & Meeting Schedule",
};

export function LamsHeaderNav({
  activeTab,
  onTabChange,
  showInsights,
  onToggleInsights,
  counts,
}: LamsHeaderNavProps) {
  return (
    <div className="space-y-4">
      {/* Top Banner: Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <Home className="w-3.5 h-3.5" />
              Home
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              LAMS
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              {TAB_TITLES[activeTab]}
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Land Acquisition & Management System
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            End-to-end lifecycle: Landowners, Acquisition Leads, Price Negotiations, Legal Vetting & Follow-ups.
          </p>
        </div>

        {/* Action button: Toggle Executive Analytics */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleInsights}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border shadow-sm ${
              showInsights
                ? "bg-cyan-50 border-cyan-300 text-cyan-700 dark:bg-cyan-950/50 dark:border-cyan-700 dark:text-cyan-300 ring-1 ring-cyan-400/30"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>{showInsights ? "Hide Analytics Strip" : "Executive Insights"}</span>
          </button>
        </div>
      </div>

      {/* Module Tabs Navigation Bar (Modernized from screenshot tabs) */}
      <div className="bg-slate-100/80 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto shadow-inner scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = counts[tab.id];

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 shadow-sm ring-1 ring-slate-200/80 dark:ring-slate-700 font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/50"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400"
                }`}
              />
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  isActive
                    ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/60 dark:text-cyan-300"
                    : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
