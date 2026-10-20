"use client";

import { useState } from "react";
import { overflowMaterials } from "@/data/procurement/procurement.mock";

const statusClasses = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
  Issued: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",
  Completed: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400",
};

export default function OverflowMaterialTable() {
  const [showAll, setShowAll] = useState(false);

  const mobileMaterials = showAll
    ? overflowMaterials
    : overflowMaterials.slice(0, 6);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Overflow Material
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Material budget and issue overview
          </p>
        </div>
      </div>

      {/* =========================
          Mobile Table
      ========================== */}
      <div className="lg:hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th className="px-5 py-4">SL</th>
                <th className="px-5 py-4">Description</th>
                <th className="px-5 py-4">Budget Qty</th>
                <th className="px-5 py-4">Budget Amount</th>
                <th className="px-5 py-4">Issue Qty</th>
                <th className="px-5 py-4">Issue Amount</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mobileMaterials.map((item, index) => (
                <tr
                  key={item.id}
                  className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                    {index + 1}
                  </td>

                  <td className="max-w-[180px] px-5 py-4 font-semibold text-slate-700 dark:text-slate-200">
                    <span className="block truncate">{item.description}</span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-300">
                    {item.budgetQty.toLocaleString()}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-300">
                    ৳ {item.budgetAmount.toLocaleString()}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-300">
                    {item.issueQty.toLocaleString()}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-300">
                    ৳ {item.issueAmount.toLocaleString()}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile More */}
        {overflowMaterials.length > 6 && (
          <div className="border-t border-slate-100 px-4 py-3 text-center dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              {showAll ? "Show Less" : "More"}
            </button>
          </div>
        )}
      </div>

      {/* =========================
          Desktop Table
      ========================== */}
      <div className="hidden lg:block">
        <div className="max-h-[395px] overflow-y-auto overflow-x-hidden">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th className="px-3 py-4">SL</th>
                <th className="px-3 py-4">Description</th>
                <th className="px-3 py-4">Budget Qty</th>
                <th className="px-3 py-4">Budget Amount</th>
                <th className="px-3 py-4">Issue Qty</th>
                <th className="px-3 py-4">Issue Amount</th>
                <th className="px-3 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {overflowMaterials.map((item, index) => (
                <tr
                  key={item.id}
                  className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-3 py-4 text-slate-600 dark:text-slate-400">
                    {index + 1}
                  </td>

                  <td className="max-w-[150px] px-3 py-4 font-semibold text-slate-700 dark:text-slate-200">
                    <span className="block truncate">{item.description}</span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-4 text-slate-600 dark:text-slate-300">
                    {item.budgetQty.toLocaleString()}
                  </td>

                  <td className="whitespace-nowrap px-3 py-4 text-slate-600 dark:text-slate-300">
                    ৳ {item.budgetAmount.toLocaleString()}
                  </td>

                  <td className="whitespace-nowrap px-3 py-4 text-slate-600 dark:text-slate-300">
                    {item.issueQty.toLocaleString()}
                  </td>

                  <td className="whitespace-nowrap px-3 py-4 text-slate-600 dark:text-slate-300">
                    ৳ {item.issueAmount.toLocaleString()}
                  </td>

                  <td className="px-3 py-4">
                    <span
                      className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Desktop Footer */}
        <div className="border-t border-slate-100 px-4 py-2.5 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Showing {overflowMaterials.length} entries
        </div>
      </div>
    </div>
  );
}