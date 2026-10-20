/* eslint-disable prettier/prettier */
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Phone, ChevronDown, Search, ShieldAlert, ArrowLeft, Loader2, X } from "lucide-react";
import { crApi } from "@/lib/crApi";
import { showAlert } from "@/lib/swal";

export default function OverdueInstallmentListPage() {
  const [loading, setLoading] = useState(true);
  const [overdueList, setOverdueList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);

  // Waive Penalty Modal State
  const [waiveTarget, setWaiveTarget] = useState<any>(null);
  const [waiveAmount, setWaiveAmount] = useState("");
  const [waiveReason, setWaiveReason] = useState("");
  const [waiving, setWaiving] = useState(false);

  // Recovery Log Modal State
  const [recoveryTarget, setRecoveryTarget] = useState<any>(null);
  const [promisedDate, setPromisedDate] = useState("");
  const [officerNotes, setOfficerNotes] = useState("");
  const [loggingRecovery, setLoggingRecovery] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await crApi.getOverdueInstallments();
      setOverdueList(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return overdueList;
    const q = search.toLowerCase();
    return overdueList.filter(
      (p) =>
        p.sale_agreement?.customer_name?.toLowerCase().includes(q) ||
        p.sale_agreement?.unit_identifier?.toLowerCase().includes(q) ||
        p.title?.toLowerCase().includes(q) ||
        p.due_date?.includes(q)
    );
  }, [search, overdueList]);

  const handleWaiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waiveTarget) return;

    const num = Number(waiveAmount);
    if (!waiveAmount || isNaN(num) || num <= 0) {
      showAlert.warning("Invalid Amount", "Please enter a valid penalty waiver amount greater than 0.");
      return;
    }
    if (!waiveReason.trim()) {
      showAlert.warning("Reason Required", "Please provide a valid reason or authority reference for waiving late penalty.");
      return;
    }

    setWaiving(true);
    try {
      await crApi.waivePenalty(waiveTarget.uuid, {
        amount_to_waive: num,
        reason: waiveReason,
      });
      setWaiveTarget(null);
      setWaiveAmount("");
      setWaiveReason("");
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setWaiving(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryTarget) return;

    if (!promisedDate) {
      showAlert.warning("Promised Date Required", "Please select the date the customer promised to pay.");
      return;
    }

    setLoggingRecovery(true);
    try {
      await crApi.createRecoveryLog({
        sale_agreement_id: recoveryTarget.sale_agreement?.id || 1,
        customer_id: recoveryTarget.sale_agreement?.customer_id || "CUST-001",
        action_type: "phone_call",
        action_date: new Date().toISOString(),
        promised_payment_date: promisedDate,
        promised_amount: Number(recoveryTarget.due_amount) || 0,
        officer_name: "Recovery Department Officer",
        customer_response: officerNotes || "Customer agreed to pay overdue installment on promised date.",
        outcome: "promised",
      });
      setRecoveryTarget(null);
      setPromisedDate("");
      setOfficerNotes("");
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoggingRecovery(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink p-4 space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg border border-border bg-surface shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[18px] font-semibold text-ink">Overdue Installments Tracker</h1>
            <p className="text-[12px] text-ink-muted">
              Credit Realization / Live Delay Penalty & Recovery Action Monitor
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => loadData()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-canvas text-[12.5px] font-medium text-ink hover:bg-surface cursor-pointer"
        >
          Refresh Calculations
        </button>
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
              placeholder="Search by customer, unit, or date..."
              className="w-full border border-border rounded-md pl-8 pr-3 py-1.5 text-[12.5px] bg-canvas text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-[#0000F2]"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded border border-border">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="bg-slate-900 text-white">
                {[
                  "UNIT / PLOT",
                  "CUSTOMER NAME",
                  "PHONE",
                  "INSTALLMENT NO",
                  "DUE DATE",
                  "PRINCIPAL DUE",
                  "DELAY DAYS",
                  "PENALTY AMOUNT",
                  "PENALTY WAIVED",
                  "STATUS",
                  "ACTION",
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
                    {Array.from({ length: 11 }).map((__, cIdx) => (
                      <td key={cIdx} className="px-3 py-3">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredRows.length > 0 ? (
                filteredRows.slice(0, entries).map((plan, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-canvas/70">
                    <td className="px-3 py-2.5 font-medium text-ink">
                      {plan.sale_agreement?.unit_identifier || "Purbachal Plot"}
                    </td>
                    <td className="px-3 py-2.5 text-sky-600 font-medium">
                      {plan.sale_agreement?.customer_name || "Client"}
                    </td>
                    <td className="px-3 py-2.5 text-ink-muted">
                      {plan.sale_agreement?.customer_phone || "—"}
                    </td>
                    <td className="px-3 py-2.5 text-ink">
                      {plan.title || `Installment #${plan.installment_no}`}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-amber-600 font-mono">
                      {plan.due_date}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums font-semibold text-ink">
                      {Number(plan.due_amount || 0).toLocaleString()} BDT
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-rose-600 font-bold">
                      {plan.delay_days || 0} days
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-rose-600 font-semibold">
                      {Number(plan.penalty_amount || 0).toLocaleString()} BDT
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-emerald-600">
                      {Number(plan.penalty_waived || 0).toLocaleString()} BDT
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                        {plan.status || "Overdue"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setWaiveTarget(plan);
                            setWaiveAmount(String(plan.penalty_amount || ""));
                          }}
                          className="px-2.5 py-1 rounded bg-amber-500 text-white text-[11px] font-medium hover:bg-amber-600 cursor-pointer"
                        >
                          Waive Penalty
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRecoveryTarget(plan);
                            setPromisedDate(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
                          }}
                          className="px-2.5 py-1 rounded bg-[#0000F2] text-white text-[11px] font-medium hover:opacity-90 flex items-center gap-1 cursor-pointer"
                        >
                          <Phone size={11} />
                          Log Call
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-ink-faint">
                    No overdue accounts detected! All installment payments are up to date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Waive Penalty Modal */}
      {waiveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-semibold text-ink text-[15px]">Waive Delay Penalty</h3>
              <button onClick={() => setWaiveTarget(null)} className="text-ink-muted hover:text-ink cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleWaiveSubmit} className="space-y-3">
              <p className="text-[12px] text-ink-muted">
                Waiving penalty for <strong>{waiveTarget.sale_agreement?.customer_name}</strong> (Current Accrued Penalty:{" "}
                <span className="text-rose-600 font-semibold">{waiveTarget.penalty_amount} BDT</span>)
              </p>
              <div>
                <label className="block text-[12px] text-ink-muted mb-1">
                  Amount to Waive (BDT) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={waiveAmount}
                  onChange={(e) => setWaiveAmount(e.target.value)}
                  placeholder="Enter amount to waive"
                  className="w-full border border-border rounded-md px-3 py-1.5 text-[13px] bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-[#0000F2]"
                />
              </div>
              <div>
                <label className="block text-[12px] text-ink-muted mb-1">
                  Approval Reason / Authority Note <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={waiveReason}
                  onChange={(e) => setWaiveReason(e.target.value)}
                  rows={2}
                  placeholder="e.g. Festival consideration approved by Managing Director"
                  className="w-full border border-border rounded-md px-3 py-1.5 text-[13px] bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-[#0000F2]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setWaiveTarget(null)}
                  className="px-3 py-1.5 text-[12.5px] rounded border border-border text-ink-muted hover:bg-canvas cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={waiving}
                  className="px-4 py-1.5 text-[12.5px] rounded bg-amber-500 text-white font-medium hover:bg-amber-600 flex items-center gap-1.5 cursor-pointer"
                >
                  {waiving && <Loader2 size={13} className="animate-spin" />}
                  Confirm Waiver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recovery Action Modal */}
      {recoveryTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-semibold text-ink text-[15px]">Log Follow-Up Call Action</h3>
              <button onClick={() => setRecoveryTarget(null)} className="text-ink-muted hover:text-ink cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleRecoverySubmit} className="space-y-3">
              <p className="text-[12px] text-ink-muted">
                Customer: <strong>{recoveryTarget.sale_agreement?.customer_name}</strong> ({recoveryTarget.sale_agreement?.customer_phone})
              </p>
              <div>
                <label className="block text-[12px] text-ink-muted mb-1">
                  Promised Payment Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={promisedDate}
                  onChange={(e) => setPromisedDate(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-1.5 text-[13px] bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-[#0000F2]"
                />
              </div>
              <div>
                <label className="block text-[12px] text-ink-muted mb-1">Customer Feedback / Response</label>
                <textarea
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  rows={2}
                  placeholder="Notes from customer conversation..."
                  className="w-full border border-border rounded-md px-3 py-1.5 text-[13px] bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-[#0000F2]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setRecoveryTarget(null)}
                  className="px-3 py-1.5 text-[12.5px] rounded border border-border text-ink-muted hover:bg-canvas cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loggingRecovery}
                  className="px-4 py-1.5 text-[12.5px] rounded bg-[#0000F2] text-white font-medium hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                >
                  {loggingRecovery && <Loader2 size={13} className="animate-spin" />}
                  Save Recovery Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
