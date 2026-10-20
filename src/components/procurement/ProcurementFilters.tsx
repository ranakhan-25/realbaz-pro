"use client";

import { CalendarDays, Download } from "lucide-react";
import { ProcurementPeriod } from "@/types/procurement";

interface Props {
  period: ProcurementPeriod;
  setPeriod: (period: ProcurementPeriod) => void;
}

const periods: { label: string; value: ProcurementPeriod }[] = [
  { label: "Today", value: "today" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
  { label: "All", value: "all" },
];

export default function ProcurementFilters({ period, setPeriod }: Props) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {periods.map((item) => (
          <button
            key={item.value}
            onClick={() => setPeriod(item.value)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              period === item.value
                ? "bg-blue-600 text-white shadow dark:bg-blue-600"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
          <CalendarDays size={17} />
          03 Sep 2026 - 03 Oct 2026
        </button>

        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500">
          <Download size={17} />
          Export
        </button>
      </div>
    </div>
  );
}
