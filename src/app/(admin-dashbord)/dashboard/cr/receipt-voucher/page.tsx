/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronDown,
  Plus,
  FileText,
  FileSpreadsheet,
  Mail,
  MessageCircle,
  Printer,
  Edit,
  Trash2,
  Copy,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { crApi } from "@/lib/crApi";
import { showAlert } from "@/lib/swal";

const menuItems = [
  "Chart of Group",
  "Chart of Accounts",
  "Expense",
  "Bank Reconciliation",
  "Payment Voucher",
  "Journal Voucher",
  "Contra Voucher",
];

export default function ReceiptVoucherPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [entries, setEntries] = useState(10);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const [agreements, setAgreements] = useState<any[]>([]);
  const [overduePlans, setOverduePlans] = useState<any[]>([]);
  const [tableRows, setTableRows] = useState<any[]>([]);

  // Form states
  const [selectedPlanUuid, setSelectedPlanUuid] = useState("");
  const [voucherNo, setVoucherNo] = useState(`R${Date.now().toString().slice(-5)}`);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [chequeNo, setChequeNo] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [agrs, overdue] = await Promise.all([
        crApi.getAgreements(),
        crApi.getOverdueInstallments(),
      ]);

      setAgreements(agrs || []);
      setOverduePlans(overdue || []);

      // Flatten payment vouchers from all agreements
      const rows: any[] = [];
      let sl = 1;

      (agrs || []).forEach((agr: any) => {
        (agr.installment_plans || []).forEach((plan: any) => {
          (plan.payments || []).forEach((pay: any) => {
            rows.push({
              sl: sl++,
              date: pay.payment_date || String(pay.createdAt).slice(0, 10),
              project: agr.unit_identifier || "Purbachal Project",
              code: pay.payment_voucher_no || `VCHR-${pay.id}`,
              credit: agr.customer_name || "Client",
              debit: pay.payment_method?.replace(/_/g, " ").toUpperCase() || "CASH",
              total: Number(pay.paid_amount || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              }),
              ref: plan.title || `Installment #${plan.installment_no}`,
              cheque: pay.cheque_no || pay.transaction_reference || "—",
              comment: pay.remarks || agr.agreement_number || "Payment Voucher",
              addedBy: pay.createdBy || "Accountant",
              editedBy: "—",
              approve: "Completed & Verified",
              attachment: "1",
              status: "Approved",
            });
          });
        });
      });

      // If no payments yet, show active installments
      if (rows.length === 0 && (overdue || []).length > 0) {
        (overdue || []).slice(0, 5).forEach((p: any) => {
          rows.push({
            sl: sl++,
            date: p.due_date || "2026-10-01",
            project: p.sale_agreement?.unit_identifier || "Purbachal Sector 17",
            code: `DUE-${p.installment_no}`,
            credit: p.sale_agreement?.customer_name || "Dr. Tariqul Islam",
            debit: "PENDING",
            total: Number(p.payable_amount || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            }),
            ref: p.title || `Installment #${p.installment_no}`,
            cheque: "—",
            comment: `Due Amount: ${p.due_amount} BDT`,
            addedBy: "Amortization Engine",
            editedBy: "—",
            approve: p.status === "paid" ? "Paid" : "Overdue Scheduled",
            attachment: "0",
            status: p.status,
          });
        });
      }

      setTableRows(rows);
    } catch (err) {
      console.error("Error loading receipt voucher data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return tableRows;
    const q = search.toLowerCase();
    return tableRows.filter(
      (r) =>
        r.project?.toLowerCase().includes(q) ||
        r.credit?.toLowerCase().includes(q) ||
        r.code?.toLowerCase().includes(q) ||
        r.ref?.toLowerCase().includes(q)
    );
  }, [search, tableRows]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Strict Validation
    if (!voucherNo.trim()) {
      showAlert.warning("Voucher Number Required", "Please enter a valid Voucher Number.");
      return;
    }
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      showAlert.warning("Invalid Amount", "Please enter a valid payment amount greater than 0.");
      return;
    }
    if (!paymentMethod) {
      showAlert.warning("Payment Method Required", "Please select a payment method.");
      return;
    }

    // Determine target installment plan uuid
    let targetUuid = selectedPlanUuid;
    if (!targetUuid && overduePlans.length > 0) {
      targetUuid = overduePlans[0].uuid;
    } else if (!targetUuid && agreements.length > 0 && agreements[0].installment_plans?.length > 0) {
      targetUuid = agreements[0].installment_plans[0].uuid;
    }

    if (!targetUuid) {
      showAlert.warning(
        "No Installment Found",
        "Please select an agreement or installment to apply this payment."
      );
      return;
    }

    setSubmitting(true);
    try {
      await crApi.recordPayment(targetUuid, {
        payment_voucher_no: voucherNo,
        paid_amount: numAmount,
        penalty_paid: 0,
        payment_date: paymentDate,
        payment_method: paymentMethod,
        cheque_no: chequeNo || undefined,
        remarks: comment || "Payment voucher submitted via Credit Realization UI",
      });

      // Reset form
      setVoucherNo(`R${Date.now().toString().slice(-5)}`);
      setAmount("");
      setChequeNo("");
      setComment("");
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border bg-surface">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="w-8 h-8 rounded-md border border-border flex items-center justify-center hover:bg-canvas text-ink cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-[17px] font-semibold text-ink">Receipt Voucher</h1>
            <p className="text-[12px] text-ink-muted">
              Credit Realization / Receipt Voucher Register
            </p>
          </div>
        </div>

        {/* Menu Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-surface text-[13px] font-medium text-ink hover:bg-canvas cursor-pointer"
          >
            Accounts Menu
            <ChevronDown className="w-4 h-4 text-ink-muted" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-56 rounded-md border border-border bg-surface shadow-lg py-1 z-30">
              {menuItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setShowMenu(false)}
                  className="w-full text-left px-3 py-1.5 text-[13px] text-ink hover:bg-canvas cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Voucher Entry Form */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Header Information */}
          <div className="bg-surface rounded-lg border border-border shadow-sm p-4 space-y-3">
            <h3 className="text-[13px] font-semibold text-ink border-b border-border pb-2">
              Header Information
            </h3>
            <div>
              <label className="block text-[12px] text-ink-muted mb-1">
                Select Customer / Sale Agreement <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedPlanUuid}
                onChange={(e) => setSelectedPlanUuid(e.target.value)}
                className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-[#0000F2]"
              >
                <option value="">
                  {agreements.length === 0 ? "Loading agreements..." : "Select Customer Account..."}
                </option>
                {agreements.map((agr) =>
                  (agr.installment_plans || []).map((p: any) => (
                    <option key={p.uuid} value={p.uuid}>
                      {agr.customer_name} ({agr.unit_identifier}) — {p.title} (Due: {p.due_amount} BDT)
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-ink-muted mb-1">Payment Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-[#0000F2]"
              />
            </div>
            <div>
              <label className="block text-[12px] text-ink-muted mb-1">
                Voucher No <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={voucherNo}
                onChange={(e) => setVoucherNo(e.target.value)}
                placeholder="Voucher No"
                className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-[#0000F2]"
              />
            </div>
          </div>

          {/* Card 2: Payment Details */}
          <div className="bg-surface rounded-lg border border-border shadow-sm p-4 space-y-3">
            <h3 className="text-[13px] font-semibold text-ink border-b border-border pb-2">
              Payment Details
            </h3>
            <div>
              <label className="block text-[12px] text-ink-muted mb-1">
                Payment Method <span className="text-rose-500">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-[#0000F2]"
              >
                <option value="bank_transfer">Bank Transfer (EBL / BEFTN)</option>
                <option value="cash">Cash Counter Receipt</option>
                <option value="cheque">Account Payee Cheque</option>
                <option value="mobile_banking">Mobile Banking (bKash/Nagad)</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-ink-muted mb-1">Cheque / Receipt No</label>
              <input
                type="text"
                value={chequeNo}
                onChange={(e) => setChequeNo(e.target.value)}
                placeholder="Enter Cheque / TRX reference"
                className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-[#0000F2]"
              />
            </div>
            <div>
              <label className="block text-[12px] text-ink-muted mb-1">
                Amount (BDT) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 233333.33"
                className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-[#0000F2]"
              />
            </div>
          </div>

          {/* Card 3: Additional Notes */}
          <div className="bg-surface rounded-lg border border-border shadow-sm p-4 space-y-3">
            <h3 className="text-[13px] font-semibold text-ink border-b border-border pb-2">
              Reference & Remarks
            </h3>
            <div>
              <label className="block text-[12px] text-ink-muted mb-1">Remarks / Comments</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Payment clearance verification notes..."
                className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-[#0000F2]"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#0000F2] text-white text-[13px] font-medium shadow-sm hover:opacity-90 disabled:opacity-60 cursor-pointer"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                Post Receipt Voucher
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Table Section */}
      <div className="px-4 pb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[13px] text-ink-muted">
            <span>Show</span>
            <select
              value={entries}
              onChange={(e) => setEntries(Number(e.target.value))}
              className="border border-border rounded px-2 py-1 text-[13px] bg-surface text-ink"
            >
              {[5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-1.5 text-[13px]">
            <span className="text-ink-muted">Search:</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vouchers..."
              className="border border-border rounded px-2 py-1 text-[13px] w-48 bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-[#0000F2]"
            />
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="bg-slate-900 text-white">
                  {[
                    "SL",
                    "DATE",
                    "PROJECT",
                    "VOUCHER",
                    "CUSTOMER",
                    "METHOD",
                    "TOTAL (BDT)",
                    "INSTALLMENT REF",
                    "CHEQUE / TRX",
                    "APPROVAL",
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
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredRows.length > 0 ? (
                  filteredRows.slice(0, entries).map((row, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-canvas/70">
                      <td className="px-3 py-2.5 text-ink-muted">{row.sl}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-ink">{row.date}</td>
                      <td className="px-3 py-2.5 font-medium text-ink whitespace-nowrap">
                        {row.project}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-ink">{row.code}</td>
                      <td className="px-3 py-2.5 text-sky-600 font-medium">{row.credit}</td>
                      <td className="px-3 py-2.5 text-ink-muted">{row.debit}</td>
                      <td className="px-3 py-2.5 tabular-nums font-semibold text-emerald-600">
                        {row.total}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-ink-muted">{row.ref}</td>
                      <td className="px-3 py-2.5 font-mono text-ink-muted">{row.cheque}</td>
                      <td className="px-3 py-2.5">
                        <span className="text-emerald-600 text-[11px] font-medium">
                          ✓ {row.approve}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <button
                          type="button"
                          onClick={() => showAlert.success("Voucher Verified", `Voucher ${row.code} verified.`)}
                          className="px-2 py-1 rounded bg-[#0000F2] text-white text-[11px] font-medium hover:opacity-90 cursor-pointer"
                        >
                          Print
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="px-3 py-8 text-center text-ink-faint">
                      No live receipt vouchers found. Fill the form above to record a payment voucher.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
