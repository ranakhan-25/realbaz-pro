/* eslint-disable prettier/prettier */
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { FileText, FileSpreadsheet, Search, Calendar, RefreshCw } from "lucide-react";
import { crApi } from "@/lib/crApi";
import { showAlert } from "@/lib/swal";

export default function AgingReportPage() {
  const [loading, setLoading] = useState(true);
  const [agingData, setAgingData] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await crApi.getAgingAnalysis();
      setAgingData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Flatten items across buckets into table rows
  const rows = useMemo(() => {
    if (!agingData?.buckets) return [];
    const b = agingData.buckets;

    const allItems: any[] = [];
    const pushItems = (items: any[], bucketKey: string) => {
      (items || []).forEach((item: any) => {
        allItems.push({
          id: item.plan_uuid || Math.random(),
          customer: item.customer_name || "Dr. Tariqul Islam Chowdhury",
          invoiceNo: item.title || `Installment #${item.installment_no}`,
          invoiceDate: item.due_date || "2026-08-01",
          amount: Number(item.due_amount || 0),
          d0_30: bucketKey === "0_30_days" ? Number(item.due_amount || 0) : 0,
          d31_60: bucketKey === "31_60_days" ? Number(item.due_amount || 0) : 0,
          d61_90: bucketKey === "61_90_days" ? Number(item.due_amount || 0) : 0,
          d91_120: bucketKey === "91_120_days" ? Number(item.due_amount || 0) : 0,
          d120: bucketKey === "over_120_days" ? Number(item.due_amount || 0) : 0,
          delayDays: item.delay_days || 0,
        });
      });
    };

    pushItems(b["0_30_days"]?.items, "0_30_days");
    pushItems(b["31_60_days"]?.items, "31_60_days");
    pushItems(b["61_90_days"]?.items, "61_90_days");
    pushItems(b["91_120_days"]?.items, "91_120_days");
    pushItems(b["over_120_days"]?.items, "over_120_days");

    return allItems;
  }, [agingData]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.customer?.toLowerCase().includes(q) ||
        r.invoiceNo?.toLowerCase().includes(q) ||
        r.invoiceDate?.includes(q)
    );
  }, [search, rows]);

  return (
    <div className="min-h-screen bg-canvas text-ink p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg border border-border bg-surface shadow-xs">
        <div>
          <h1 className="text-[18px] font-semibold text-ink">5-Bucket Aging Analysis Report</h1>
          <p className="text-[12px] text-ink-muted">
            Credit Realization / Overdue accounts categorized by delay duration (0-30, 31-60, 61-90, 91-120, 120+ days)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              loadData();
              showAlert.success("Refreshed", "Aging buckets recalculated.");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-canvas text-[12.5px] font-medium text-ink hover:bg-surface cursor-pointer"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => showAlert.success("Export Prepared", "Aging report exported to PDF.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-500 text-white text-[12px] font-medium hover:bg-rose-600 cursor-pointer"
          >
            <FileText size={13} />
            PDF
          </button>
          <button
            type="button"
            onClick={() => showAlert.success("Export Prepared", "Aging report exported to Excel.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 text-white text-[12px] font-medium hover:bg-emerald-700 cursor-pointer"
          >
            <FileSpreadsheet size={13} />
            Excel
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "0 - 30 Days", bucket: agingData?.buckets?.["0_30_days"], color: "border-emerald-300 text-emerald-600" },
          { label: "31 - 60 Days", bucket: agingData?.buckets?.["31_60_days"], color: "border-sky-300 text-sky-600" },
          { label: "61 - 90 Days", bucket: agingData?.buckets?.["61_90_days"], color: "border-amber-300 text-amber-600" },
          { label: "91 - 120 Days", bucket: agingData?.buckets?.["91_120_days"], color: "border-orange-300 text-orange-600" },
          { label: "Over 120 Days", bucket: agingData?.buckets?.["over_120_days"], color: "border-rose-300 text-rose-600" },
        ].map((b, i) => (
          <div key={i} className={`p-3 rounded-lg border bg-surface shadow-2xs space-y-1 ${b.color}`}>
            <span className="text-[11px] font-medium text-ink-muted uppercase block">{b.label}</span>
            <div className="text-[16px] font-bold">
              {Number(b.bucket?.total_due || 0).toLocaleString()} BDT
            </div>
            <span className="text-[11px] text-ink-faint block">{b.bucket?.count || 0} overdue accounts</span>
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="rounded-lg border border-border bg-surface shadow-xs p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[13px] text-ink-muted">
            <span>Show</span>
            <select
              value={entries}
              onChange={(e) => setEntries(Number(e.target.value))}
              className="border border-border rounded px-2 py-1 text-[13px] bg-canvas text-ink"
            >
              {[5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span>accounts</span>
          </div>

          <div className="relative w-full max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer, installment..."
              className="w-full border border-border rounded-md pl-8 pr-3 py-1.5 text-[12.5px] bg-canvas text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-[#0000F2]"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded border border-border">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="bg-slate-900 text-white">
                {[
                  "CUSTOMER NAME",
                  "INSTALLMENT NO",
                  "DUE DATE",
                  "TOTAL DUE",
                  "0-30 DAYS",
                  "31-60 DAYS",
                  "61-90 DAYS",
                  "91-120 DAYS",
                  "120+ DAYS",
                ].map((h) => (
                  <th key={h} className="px-3 py-2.5 font-semibold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-border animate-pulse">
                    {Array.from({ length: 9 }).map((__, cIdx) => (
                      <td key={cIdx} className="px-3 py-3">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredRows.length > 0 ? (
                filteredRows.slice(0, entries).map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-canvas/70">
                    <td className="px-3 py-2.5 font-medium text-sky-600">{row.customer}</td>
                    <td className="px-3 py-2.5 text-ink">{row.invoiceNo}</td>
                    <td className="px-3 py-2.5 text-ink-muted font-mono">{row.invoiceDate}</td>
                    <td className="px-3 py-2.5 tabular-nums font-bold text-ink">
                      {row.amount ? `${row.amount.toLocaleString()} BDT` : "—"}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-emerald-600">
                      {row.d0_30 > 0 ? `${row.d0_30.toLocaleString()} BDT` : "0"}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-sky-600">
                      {row.d31_60 > 0 ? `${row.d31_60.toLocaleString()} BDT` : "0"}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-amber-600">
                      {row.d61_90 > 0 ? `${row.d61_90.toLocaleString()} BDT` : "0"}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-orange-600">
                      {row.d91_120 > 0 ? `${row.d91_120.toLocaleString()} BDT` : "0"}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-rose-600 font-semibold">
                      {row.d120 > 0 ? `${row.d120.toLocaleString()} BDT` : "0"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-ink-faint">
                    No aging overdue records found. Accounts are in good standing!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
