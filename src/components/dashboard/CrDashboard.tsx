/* eslint-disable prettier/prettier */
"use client";

import { useState, useMemo } from "react";
import { Search, CheckCircle2, Phone, Eye } from "lucide-react";

const summaryCards = [
  {
    title: "This Month Due for Recovery",
    value: "10,950,280.00",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    title: "This Month Due for Recovery Invoice",
    value: "3.00",
    gradient: "from-orange-400 to-rose-500",
  },
  {
    title: "This Month Recovered",
    value: "0.00",
    gradient: "from-blue-500 to-indigo-700",
  },
  {
    title: "This Month Recovered %",
    value: "0.00%",
    gradient: "from-amber-400 to-yellow-600",
  },
  {
    title: "Outstanding Debts",
    value: "102,799,225",
    gradient: "from-cyan-500 to-teal-600",
  },
  {
    title: "Outstanding Overdue",
    value: "10,950,280",
    gradient: "from-fuchsia-500 to-pink-600",
  },
  {
    title: "Overdue debt %",
    value: "0.00%",
    gradient: "from-violet-500 to-purple-700",
  },
  {
    title: "Overdue debt > 30D %",
    value: "0.00%",
    gradient: "from-teal-500 to-emerald-600",
  },
];

const ALL_ROWS = [
  {
    id: 1,
    project: "Sheba Eyecon Tower",
    flatLand: "F 3",
    customer: "Sagor kumar",
    totalValue: "10925000",
    paid: "122320",
    due: "10802680",
    installmentDate: "2026-09-03",
    installmentAmount: "10802680",
    installmentDue: "10802680",
    salesBy: "",
    daysOverdue: "6",
    delayAmount: "0",
    nextDueDate: "",
  },
  {
    id: 2,
    project: "Lake Garden",
    flatLand: "A 12",
    customer: "Raju Ahmed",
    totalValue: "8500000",
    paid: "500000",
    due: "8000000",
    installmentDate: "2026-08-15",
    installmentAmount: "800000",
    installmentDue: "800000",
    salesBy: "Karim",
    daysOverdue: "12",
    delayAmount: "25000",
    nextDueDate: "2026-09-15",
  },
  {
    id: 3,
    project: "Green Valley",
    flatLand: "B 7",
    customer: "Fatima Begum",
    totalValue: "6200000",
    paid: "1200000",
    due: "5000000",
    installmentDate: "2026-09-01",
    installmentAmount: "500000",
    installmentDue: "500000",
    salesBy: "Rahim",
    daysOverdue: "3",
    delayAmount: "0",
    nextDueDate: "2026-10-01",
  },
  {
    id: 4,
    project: "Sheba Eyecon Tower",
    flatLand: "F 8",
    customer: "Imran Hossain",
    totalValue: "12500000",
    paid: "2500000",
    due: "10000000",
    installmentDate: "2026-07-20",
    installmentAmount: "1000000",
    installmentDue: "1000000",
    salesBy: "Karim",
    daysOverdue: "28",
    delayAmount: "75000",
    nextDueDate: "2026-09-20",
  },
  {
    id: 5,
    project: "Lake Garden",
    flatLand: "C 3",
    customer: "Nusrat Jahan",
    totalValue: "9800000",
    paid: "980000",
    due: "8820000",
    installmentDate: "2026-09-05",
    installmentAmount: "882000",
    installmentDue: "882000",
    salesBy: "",
    daysOverdue: "1",
    delayAmount: "0",
    nextDueDate: "",
  },
  {
    id: 6,
    project: "Green Valley",
    flatLand: "D 1",
    customer: "Kamal Uddin",
    totalValue: "4500000",
    paid: "450000",
    due: "4050000",
    installmentDate: "2026-08-28",
    installmentAmount: "405000",
    installmentDue: "405000",
    salesBy: "Rahim",
    daysOverdue: "8",
    delayAmount: "12000",
    nextDueDate: "2026-09-28",
  },
  {
    id: 7,
    project: "Sheba Eyecon Tower",
    flatLand: "G 2",
    customer: "Shakib Al",
    totalValue: "15000000",
    paid: "3000000",
    due: "12000000",
    installmentDate: "2026-09-02",
    installmentAmount: "1200000",
    installmentDue: "1200000",
    salesBy: "Karim",
    daysOverdue: "4",
    delayAmount: "0",
    nextDueDate: "2026-10-02",
  },
  {
    id: 8,
    project: "Lake Garden",
    flatLand: "E 5",
    customer: "Mitu Akter",
    totalValue: "7200000",
    paid: "720000",
    due: "6480000",
    installmentDate: "2026-08-10",
    installmentAmount: "648000",
    installmentDue: "648000",
    salesBy: "",
    daysOverdue: "18",
    delayAmount: "45000",
    nextDueDate: "2026-09-10",
  },
  {
    id: 9,
    project: "Green Valley",
    flatLand: "A 9",
    customer: "Jamal Khan",
    totalValue: "5500000",
    paid: "1100000",
    due: "4400000",
    installmentDate: "2026-09-04",
    installmentAmount: "440000",
    installmentDue: "440000",
    salesBy: "Rahim",
    daysOverdue: "2",
    delayAmount: "0",
    nextDueDate: "",
  },
  {
    id: 10,
    project: "Sheba Eyecon Tower",
    flatLand: "H 1",
    customer: "Rina Sultana",
    totalValue: "11200000",
    paid: "2240000",
    due: "8960000",
    installmentDate: "2026-07-15",
    installmentAmount: "896000",
    installmentDue: "896000",
    salesBy: "Karim",
    daysOverdue: "35",
    delayAmount: "120000",
    nextDueDate: "2026-09-15",
  },
  {
    id: 11,
    project: "Lake Garden",
    flatLand: "B 4",
    customer: "Tanvir Islam",
    totalValue: "8900000",
    paid: "890000",
    due: "8010000",
    installmentDate: "2026-09-06",
    installmentAmount: "801000",
    installmentDue: "801000",
    salesBy: "",
    daysOverdue: "0",
    delayAmount: "0",
    nextDueDate: "2026-10-06",
  },
  {
    id: 12,
    project: "Green Valley",
    flatLand: "C 8",
    customer: "Sabina Yasmin",
    totalValue: "6800000",
    paid: "1360000",
    due: "5440000",
    installmentDate: "2026-08-22",
    installmentAmount: "544000",
    installmentDue: "544000",
    salesBy: "Rahim",
    daysOverdue: "14",
    delayAmount: "30000",
    nextDueDate: "2026-09-22",
  },
];

const pendingVouchers = [
  {
    reference: "SaleOffer-5154844",
    project: "Sheba Eyecon Tower",
    contact: "Mr. Raju raz",
    addedBy: "Admin",
    date: "03-Sept-2026",
    note: "Approval Layer has not been set yet.",
  },
  {
    reference: "SaleOffer-4181717",
    project: "Lake Garden",
    contact: "Mr. Raju raz",
    addedBy: "Admin",
    date: "03-Sept-2026",
    note: "Approval Layer has not been set yet.",
  },
  {
    reference: "SaleOffer-566922",
    project: "Sheba Eyecon Tower",
    contact: "Mr. Raju raz",
    addedBy: "Admin",
    date: "03-Sept-2026",
    note: "Approval Layer has not been set yet.",
  },
  {
    reference: "SaleOffer-8597937",
    project: "Sheba Eyecon Tower",
    contact: "Mr. Raju raz",
    addedBy: "Admin",
    date: "03-Sept-2026",
    note: "Approval Layer has not been set yet.",
  },
];

const tabs = ["Today", "Weekly", "Monthly", "Yearly", "All"] as const;

const hideScroll =
  "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

export default function CreditRealizationPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All");
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_ROWS;
    return ALL_ROWS.filter(
      (r) =>
        r.project.toLowerCase().includes(q) ||
        r.customer.toLowerCase().includes(q) ||
        r.flatLand.toLowerCase().includes(q) ||
        String(r.id).includes(q),
    );
  }, [search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / entries));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * entries;
  const pageRows = filtered.slice(start, start + entries);
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(start + entries, total);

  const goPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  const pageNumbers = useMemo(() => {
    const pages: (number | "…")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("…");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex flex-col bg-canvas text-ink min-h-screen md:h-screen md:overflow-hidden">
      {/* Top bar */}
      <div className="shrink-0 bg-surface border-b border-border px-3 sm:px-5 py-2.5 flex items-center">
        <button
          type="button"
          className="px-3 py-1.5 rounded-md bg-black text-white text-[13px] font-medium shadow-sm flex items-center gap-1.5"
        >
          <span>$</span> Credit Realization (CR)
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 p-3 sm:p-4 flex flex-col lg:flex-row gap-4 overflow-y-auto md:overflow-hidden">
        {/* LEFT CONTENT */}
        <div className="flex-1 min-w-0 flex flex-col gap-3 md:min-h-0">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3">
            {summaryCards.map((card) => (
              <div
                key={card.title}
                className={`rounded-xl bg-gradient-to-br ${card.gradient} px-3.5 py-3 text-white shadow-sm`}
              >
                <p className="text-[10px] sm:text-[11px] font-medium opacity-90 leading-snug line-clamp-2">
                  {card.title}
                </p>
                <p className="mt-1 text-[16px] sm:text-[18px] font-bold tracking-tight tabular-nums">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <div className="flex items-center gap-2 text-[13px] text-ink-muted">
              <span>Show</span>
              <select
                value={entries}
                onChange={(e) => {
                  setEntries(Number(e.target.value));
                  setPage(1);
                }}
                className="border border-border rounded-md px-2.5 py-1.5 text-[13px] bg-surface text-ink"
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-ink-muted whitespace-nowrap">Search:</span>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Project, Customer..."
                className="border border-border rounded-md px-3 py-1.5 text-[13px] w-full sm:w-44 bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-surface rounded-xl border border-border shadow-sm flex flex-col overflow-hidden md:flex-1 md:min-h-0">
            <div className={`overflow-x-auto ${hideScroll}`}>
              <table className="w-full text-left text-[12px] sm:text-[12.5px] min-w-[1050px]">
                <thead>
                  <tr className="bg-black text-white">
                    {[
                      "ID",
                      "PROJECT",
                      "FLAT/LAND",
                      "CUSTOMER NAME",
                      "TOTAL VALUE",
                      "PAID",
                      "DUE",
                      "INSTALLMENT DATE",
                      "INSTALLMENT AMOUNT",
                      "INSTALLMENT DUE",
                      "SALES BY",
                      "DAYS OVERDUE",
                      "DELAY AMOUNT",
                      "NEXT DUE DATE",
                      "ACTION",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-2.5 py-2.5 font-semibold whitespace-nowrap text-[11px] sm:text-[12px]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={15}
                        className="px-4 py-12 text-center text-ink-faint"
                      >
                        No records found
                      </td>
                    </tr>
                  ) : (
                    pageRows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-border hover:bg-canvas/60 transition-colors"
                      >
                        <td className="px-2.5 py-2.5 text-ink-muted">
                          {row.id}
                        </td>
                        <td className="px-2.5 py-2.5 font-medium text-ink">
                          {row.project}
                        </td>
                        <td className="px-2.5 py-2.5 text-ink">
                          {row.flatLand}
                        </td>
                        <td className="px-2.5 py-2.5 text-ink">
                          {row.customer}
                        </td>
                        <td className="px-2.5 py-2.5 tabular-nums text-ink">
                          {row.totalValue}
                        </td>
                        <td className="px-2.5 py-2.5 tabular-nums text-ink">
                          {row.paid}
                        </td>
                        <td className="px-2.5 py-2.5 tabular-nums font-semibold text-rose-500">
                          {row.due}
                        </td>
                        <td className="px-2.5 py-2.5 text-ink">
                          {row.installmentDate}
                        </td>
                        <td className="px-2.5 py-2.5 tabular-nums text-ink">
                          {row.installmentAmount}
                        </td>
                        <td className="px-2.5 py-2.5 tabular-nums text-ink">
                          {row.installmentDue}
                        </td>
                        <td className="px-2.5 py-2.5 text-ink-faint">
                          {row.salesBy || "—"}
                        </td>
                        <td className="px-2.5 py-2.5 text-center">
                          <span className="inline-flex items-center justify-center min-w-[26px] h-5 px-1.5 rounded-full bg-rose-500/15 text-rose-500 text-[11px] font-semibold">
                            {row.daysOverdue}
                          </span>
                        </td>
                        <td className="px-2.5 py-2.5 tabular-nums text-ink">
                          {row.delayAmount}
                        </td>
                        <td className="px-2.5 py-2.5 text-ink-faint">
                          {row.nextDueDate || "—"}
                        </td>
                        <td className="px-2.5 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center hover:bg-slate-800 active:scale-95 transition"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 active:scale-95 transition"
                            >
                              <Phone className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-3 py-3 border-t border-border text-[13px] text-ink-muted">
              <span>
                Showing {from} to {to} of {total} entries
              </span>

              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => goPage(currentPage - 1)}
                  className="px-3 py-1.5 rounded-md border border-border hover:bg-canvas disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {pageNumbers.map((p, i) =>
                  p === "…" ? (
                    <span key={`e-${i}`} className="px-1.5 text-ink-faint">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      onClick={() => goPage(p as number)}
                      className={`min-w-[34px] h-8 rounded-md font-medium ${
                        currentPage === p
                          ? "bg-black text-white"
                          : "border border-border hover:bg-canvas"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => goPage(currentPage + 1)}
                  className="px-3 py-1.5 rounded-md border border-border hover:bg-canvas disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Pending Vouchers */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col">
          <div className="bg-surface rounded-xl border border-border shadow-sm flex flex-col overflow-hidden lg:h-full">
            {/* Tabs */}
            <div className="flex border-b border-border overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-[64px] py-2.5 text-[11px] font-semibold whitespace-nowrap transition ${
                    activeTab === tab
                      ? "bg-black text-white"
                      : "text-ink-muted hover:bg-canvas"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-3.5 flex flex-col gap-3 flex-1 min-h-0">
              <h3 className="text-[13px] font-semibold text-ink text-center">
                Pending Voucher / Invoice
              </h3>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                <input
                  type="text"
                  placeholder="Search Project / Reference..."
                  className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-[12px] bg-surface text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div
                className={`flex-1 space-y-3 overflow-y-auto ${hideScroll} max-h-[420px] lg:max-h-none`}
              >
                {pendingVouchers.map((item) => (
                  <div
                    key={item.reference}
                    className="border border-border rounded-xl p-3.5 bg-canvas/40 hover:bg-canvas/70 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 text-[12px] leading-relaxed space-y-0.5">
                        <p className="text-ink-muted">
                          Reference:{" "}
                          <span className="font-semibold text-ink">
                            {item.reference}
                          </span>
                        </p>
                        <p className="font-medium text-ink">
                          Project: {item.project}
                        </p>
                        <p className="text-ink-muted">
                          Contact: {item.contact}
                        </p>
                        <p className="text-ink-muted">
                          Added By: {item.addedBy}
                        </p>
                        <p className="text-ink-faint text-[11px]">
                          {item.date}
                        </p>
                      </div>
                      <span className="shrink-0 px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-600 text-[10px] font-semibold">
                        Offer
                      </span>
                    </div>

                    <p className="text-[12px] text-rose-500 font-medium mt-2">
                      {item.note}
                    </p>

                    <div className="flex justify-end mt-3">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-slate-800 active:scale-95 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
