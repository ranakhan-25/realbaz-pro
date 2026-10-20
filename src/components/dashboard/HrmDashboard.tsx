/* eslint-disable prettier/prettier */
"use client";

import { Users } from "lucide-react";

const statusCards = [
  { title: "Employee", value: "3", gradient: "from-amber-500 to-yellow-600" },
  { title: "Today Present", value: "0", gradient: "from-cyan-400 to-teal-600" },
  { title: "Today Absent", value: "3", gradient: "from-emerald-500 to-green-600" },
  { title: "On Leave Today", value: "0", gradient: "from-fuchsia-500 to-pink-600" },
  { title: "Due Salary", value: "0", gradient: "from-orange-400 to-rose-500" },
  { title: "Holiday", value: "8", gradient: "from-blue-500 to-indigo-700" },
];

const absentToday = [
  { id: 1, name: "Tazmul Reza", status: "Absent" },
  { id: 2, name: "Rifat Hosain", status: "Absent" },
  { id: 3, name: "Mohin Uddin", status: "Absent" },
];

export default function HRMDashboardPage() {
  // Donut chart: 3 absent out of 3 total = 100% red ring
  const total = 3;
  const absent = 3;
  const present = total - absent;
  const radius = 54;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;
  const absentPct = total > 0 ? absent / total : 0;
  const absentLen = circumference * absentPct;
  const presentLen = circumference - absentLen;

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Top bar */}
      <div className="bg-surface border-b border-border px-4 py-2 flex items-center gap-1.5">
        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-black text-white text-[13px] font-medium shadow-sm"
        >
          <Users className="w-3.5 h-3.5" />
          HRM
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Cards + Pending Leave */}
        <div className="flex gap-3">
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {statusCards.map((card) => (
              <div
                key={card.title}
                className={`rounded-lg bg-gradient-to-br ${card.gradient} px-4 py-3 text-white shadow-sm`}
              >
                <p className="text-[12px] font-medium opacity-90">{card.title}</p>
                <p className="text-[22px] font-bold tabular-nums mt-0.5">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Pending Leave Application */}
          <div className="w-[240px] shrink-0 hidden xl:block bg-surface rounded-lg border border-border p-3">
            <h3 className="text-[13px] font-semibold text-ink text-center mb-2">
              Pending Leave Application
            </h3>
            <p className="text-[12px] text-ink-faint text-center py-4">
              No notifications found.
            </p>
          </div>
        </div>

        {/* Today Late + Leave Today + Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Today Late */}
          <div className="bg-surface rounded-lg border border-border overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border">
              <h3 className="text-[13px] font-semibold text-amber-500 text-center">
                Today Late
              </h3>
            </div>
            <div className="p-3">
              <div className="rounded-md bg-sky-50 dark:bg-sky-500/10 px-4 py-3 text-center">
                <p className="text-[13px] text-sky-600 dark:text-sky-400">
                  No late attendances recorded.
                </p>
              </div>
            </div>
          </div>

          {/* Leave Today */}
          <div className="bg-surface rounded-lg border border-border overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border">
              <h3 className="text-[13px] font-semibold text-amber-500 text-center">
                Leave Today
              </h3>
            </div>
            <div className="p-3">
              <div className="rounded-md bg-sky-50 dark:bg-sky-500/10 px-4 py-3 text-center">
                <p className="text-[13px] text-sky-600 dark:text-sky-400">
                  No Leave Today
                </p>
              </div>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-surface rounded-lg border border-border p-4 flex flex-col items-center">
            <h3 className="text-[13px] font-semibold text-ink mb-1">
              Total VS Absent Employees
            </h3>
            <p className="text-[11px] text-ink-muted mb-2">Today</p>

            <div className="relative w-[140px] h-[140px]">
              <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                {/* Present (green) ring background */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth={stroke}
                  strokeDasharray={`${presentLen} ${circumference}`}
                  strokeDashoffset={0}
                />
                {/* Absent (red) ring */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth={stroke}
                  strokeDasharray={`${absentLen} ${circumference}`}
                  strokeDashoffset={-presentLen}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[18px] font-bold text-ink tabular-nums">
                  {absent} / {total}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3 text-[12px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-ink-muted">Total Employees</span>
                <span className="font-semibold text-ink ml-1">{total}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-ink-muted">Absent Employees</span>
                <span className="font-semibold text-ink ml-1">{absent}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Absent Today */}
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border">
            <h3 className="text-[13px] font-semibold text-ink">Absent Today</h3>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {absentToday.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center border border-border rounded-md overflow-hidden text-[12px]"
                >
                  <div className="w-10 shrink-0 px-2 py-2.5 text-center text-ink-muted border-r border-border bg-canvas/50">
                    {emp.id}
                  </div>
                  <div className="flex-1 px-3 py-2.5 text-ink font-medium">
                    {emp.name}
                  </div>
                  <div className="px-3 py-2.5 text-rose-500 font-medium border-l border-border">
                    {emp.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
