"use client";

import React from "react";
import {
  Compass,
  MapPin,
  Handshake,
  FileCheck,
  TrendingUp,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type {
  AcquisitionLead,
  LandOwner,
  NegotiationRecord,
  LegalDocument,
  FollowUpItem,
  LamsKpiMetric,
  PipelineStageStat,
  MouzaDistributionStat,
  LeadStage,
} from "@/types/lams";

interface LamsMetricsProps {
  showInsights: boolean;
  leads?: AcquisitionLead[];
  owners?: LandOwner[];
  negotiations?: NegotiationRecord[];
  documents?: LegalDocument[];
  followUps?: FollowUpItem[];
}

const COLOR_MAP = {
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-200/70 dark:border-cyan-800/40",
    badge: "bg-cyan-50 text-cyan-700 border border-cyan-200/80 dark:bg-cyan-900/60 dark:text-cyan-300 dark:border-cyan-700/60",
    icon: Compass,
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200/70 dark:border-emerald-800/40",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-900/60 dark:text-emerald-300 dark:border-emerald-700/60",
    icon: MapPin,
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200/70 dark:border-amber-800/40",
    badge: "bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-900/60 dark:text-amber-300 dark:border-amber-700/60",
    icon: Handshake,
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200/70 dark:border-indigo-800/40",
    badge: "bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-900/60 dark:text-indigo-300 dark:border-indigo-700/60",
    icon: FileCheck,
  },
};

export function LamsMetrics({ showInsights, leads = [], owners = [], negotiations = [], documents = [], followUps = [] }: LamsMetricsProps) {
  // --- DYNAMIC CALCULATIONS ---
  const totalLeads = leads.length;
  const totalArea = leads.reduce((sum: number, l: AcquisitionLead) => sum + (parseFloat(l.landArea as any) || 0), 0);
  const activeNegotiations = negotiations.filter((n: NegotiationRecord) => n.negotiationStatus === "In Progress" || n.negotiationStatus === "Agreed").length;
  const verifiedDocs = documents.filter((d: LegalDocument) => d.verificationStatus === "Verified").length;

  const kpiMetrics: (LamsKpiMetric & { uuid?: string })[] = [
    {
      id: "total-leads",
      uuid: "total-leads",
      title: "Total Acquisition Leads",
      value: `${totalLeads} Parcels`,
      numericValue: totalLeads,
      change: "Active Pipeline",
      isPositive: true,
      description: "Total prospective parcels tracked",
      color: "cyan",
    },
    {
      id: "total-land",
      uuid: "total-land",
      title: "Target Land Area",
      value: `${Number(totalArea || 0).toFixed(1)} Decimals`,
      numericValue: totalArea,
      change: "In Progress",
      isPositive: true,
      description: "Total area in acquisition pipeline",
      color: "emerald",
    },
    {
      id: "active-negotiations",
      uuid: "active-negotiations",
      title: "Active Negotiations",
      value: `${activeNegotiations} Deals`,
      numericValue: activeNegotiations,
      change: "Awaiting Action",
      isPositive: true,
      description: "Parcels currently under negotiation",
      color: "amber",
    },
    {
      id: "verified-docs",
      uuid: "verified-docs",
      title: "Verified Documents",
      value: `${verifiedDocs} Clean`,
      numericValue: verifiedDocs,
      change: "Legal Clear",
      isPositive: true,
      description: "Documents vetted by legal team",
      color: "indigo",
    },
  ];

  // Pipeline Stages Chart Data
  const stages: LeadStage[] = ["New", "Contacted", "In Negotiation", "Legal Verification", "Agreement Ready", "Acquired"];
  const pipelineStages: PipelineStageStat[] = stages.map(stage => {
    const stageLeads = leads.filter(l => l.leadStage === stage);
    const area = stageLeads.reduce((sum: number, l: AcquisitionLead) => sum + (parseFloat(l.landArea as any) || 0), 0);
    return {
      stage,
      count: stageLeads.length,
      areaDecimals: area,
      percentage: totalArea ? Math.round((area / totalArea) * 100) : 0,
    };
  }).filter(s => s.count > 0 || s.stage === "New"); // Keep at least one to show chart

  // Mouza Distribution Pie Chart
  const mouzaMap: Record<string, { area: number; count: number }> = {};
  leads.forEach((l: AcquisitionLead) => {
    const m = l.mouza || "Unknown";
    if (!mouzaMap[m]) mouzaMap[m] = { area: 0, count: 0 };
    mouzaMap[m].area += (parseFloat(l.landArea as any) || 0);
    mouzaMap[m].count += 1;
  });
  
  const colors = ["#06b6d4", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444"];
  const mouzaDistribution: MouzaDistributionStat[] = Object.keys(mouzaMap).map((mouza, idx) => ({
    mouza,
    district: "",
    areaDecimals: mouzaMap[mouza].area,
    leadsCount: mouzaMap[mouza].count,
    color: colors[idx % colors.length]
  }));
  if (mouzaDistribution.length === 0) {
    mouzaDistribution.push({ mouza: "No Data", district: "", areaDecimals: 1, leadsCount: 0, color: "#cbd5e1" });
  }
  // -----------------------------

  return (
    <div className="space-y-4">
      {/* 4-Card KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map((kpi) => {
          const config = COLOR_MAP[kpi.color as keyof typeof COLOR_MAP] || COLOR_MAP.cyan;
          const Icon = config.icon;

          return (
            <div
              key={kpi.uuid}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border ${config.border} shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between`}
            >
              {/* Background ambient glow */}
              <div
                className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-15 blur-2xl ${config.bg}`}
              />

              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {kpi.title}
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-display">
                    {kpi.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-2xl ${config.bg} ${config.text} border ${config.border} shrink-0 shadow-xs`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Spaced footer with concise badge and clear subtitle */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center gap-1.5 font-bold ${config.badge} px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap shadow-2xs`}>
                    <TrendingUp className="w-3 h-3 shrink-0" />
                    {kpi.change}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
                    Active Status
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  {kpi.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collapsible Executive Insights Chart Strip */}
      {showInsights && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Chart 1: Acquisition Pipeline by Stage */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  Acquisition Pipeline by Stage
                </h4>
                <p className="text-xs text-slate-500">
                  Land area (in Decimals) progressing from initial lead to acquired deed.
                </p>
              </div>
              <span className="text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 px-2.5 py-1 rounded-lg">
                412.8 Dec Total
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineStages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} opacity={0.6} />
                  <XAxis
                    dataKey="stage"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-lg space-y-1">
                          <p className="font-bold text-cyan-300">{label}</p>
                          <p>Area: <span className="font-semibold">{data.areaDecimals} Decimals</span></p>
                          <p>Leads: <span className="font-semibold">{data.count} Parcels</span></p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="areaDecimals" fill="#0891b2" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Land Secured by Prime Mouza */}
          <div className="lg:col-span-5 space-y-3 lg:border-l lg:border-slate-200/80 lg:dark:border-slate-800 lg:pl-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Land Area by Mouza
                </h4>
                <p className="text-xs text-slate-500">Geographic footprint across project belts.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-48 w-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mouzaDistribution}
                      dataKey="areaDecimals"
                      nameKey="mouza"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                    >
                      {mouzaDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-lg">
                            <p className="font-bold">{data.mouza}</p>
                            <p className="text-cyan-300">{data.areaDecimals} Decimals ({data.leadsCount} leads)</p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend List */}
              <div className="space-y-1.5 flex-1 min-w-0 text-xs">
                {mouzaDistribution.map((item) => (
                  <div key={item.mouza} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-700 dark:text-slate-300 truncate font-medium">{item.mouza}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 shrink-0">
                      {item.areaDecimals}d
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
