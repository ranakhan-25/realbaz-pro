"use client";

import { Eye, Search, FileCheck2 } from "lucide-react";
import { pendingVouchers } from "@/data/procurement/procurement.mock";

export default function PendingVoucherList() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-cyan-100 p-2 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400">
            <FileCheck2 size={20} />
          </div>

          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">
              Pending Voucher/Invoice
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Awaiting approval
            </p>
          </div>
        </div>

        <button className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">
          View All
        </button>
      </div>

      <div className="relative mb-3">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />

        <input
          type="text"
          placeholder="Search with Project/Code/Reference..."
          className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
        />
      </div>

      {/* Voucher List */}
      <div className="max-h-[370px] space-y-2 overflow-y-auto pr-1">
        {pendingVouchers.map((voucher) => (
          <div
            key={voucher.id}
            className="rounded-xl border border-slate-200 p-3 transition hover:border-blue-200 hover:shadow-sm dark:border-slate-800/80 dark:bg-slate-900/50 dark:hover:border-blue-900/50 dark:hover:bg-slate-800/50"
          >
            {/* Reference + Type */}
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Reference
              </span>

              <span className="rounded-md bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
                Offer
              </span>
            </div>

            {/* Voucher Content */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-0.5 text-sm">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Project:{" "}
                  <span className="font-normal text-slate-700 dark:text-slate-300">
                    {voucher.project}
                  </span>
                </p>

                <p className="text-slate-600 dark:text-slate-400">
                  Contact: {voucher.contact}
                </p>

                <p className="text-slate-600 dark:text-slate-400">
                  Added By: {voucher.addedBy}
                </p>

                <p className="text-slate-500 dark:text-slate-400">
                  {voucher.date}
                </p>

                <p className="font-semibold text-blue-600 dark:text-blue-400">
                  {voucher.saleOffer}
                </p>
              </div>

              {/* View Button */}
              <button
                type="button"
                className="shrink-0 rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                <Eye size={17} />
              </button>
            </div>

            <p className="mt-3 text-xs font-semibold text-red-500 dark:text-red-400">
              {voucher.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}