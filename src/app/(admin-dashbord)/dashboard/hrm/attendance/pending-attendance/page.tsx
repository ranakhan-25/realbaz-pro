/* eslint-disable prettier/prettier */
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

const shiftOptions = ["Masud Rana", "Rakib Hasan", "Friday OFF"];

const departmentOptions = [
  "Business Development",
  "Sales & Marketing",
  "Store",
  "Customs",
  "Accounts",
  "Dop",
  "Chemical",
  "Mechanical",
  "Electrical",
  "Factory",
  "Test",
  "IT",
  "Architecture",
  "HR & Admin & Procurement",
  "Admin & HRM",
  "Account & Finance",
  "Sales and Marketing",
  "Purchase & Procurement",
  "Engineering",
];

interface PendingRow {
  id: number;
  code: string;
  employeeName: string;
  fromTime: string;
  toTime: string;
  hours: string;
  inSelfie: string;
  outSelfie: string;
  inLocation: string;
  outLocation: string;
  attendance: boolean;
}

const ALL_ROWS: PendingRow[] = [];

function SearchableSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select value",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [query, options]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref}>
      <label className="block text-[12px] text-ink-muted mb-1">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setOpen(!open);
            setQuery("");
          }}
          className="w-full flex items-center justify-between border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
        >
          <span className={value ? "text-ink" : "text-ink-faint"}>
            {value || placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-ink-faint shrink-0" />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-md shadow-lg shadow-black/6 z-50 overflow-hidden">
            <div className="px-3 py-1.5 bg-ink-muted/15 border-b border-border text-[12px] font-medium text-ink-muted">
              {placeholder}
            </div>
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-faint" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  autoFocus
                  className="w-full pl-8 pr-2.5 py-1.5 border border-border rounded-md text-[13px] bg-canvas text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-2 text-[13px] text-ink-faint">No results</p>
              ) : (
                filtered.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`w-full text-left px-3 py-2 text-[13px] hover:bg-canvas ${
                      value === opt
                        ? "bg-ink-muted/20 text-ink font-medium"
                        : "text-ink-muted"
                    }`}
                  >
                    {opt}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PendingAttendancePage() {
  const [date, setDate] = useState("");
  const [shift, setShift] = useState("");
  const [department, setDepartment] = useState("");
  const [rows, setRows] = useState<PendingRow[]>(ALL_ROWS);

  const toggleAttendance = (id: number) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, attendance: !r.attendance } : r))
    );
  };

  const toggleAll = (checked: boolean) => {
    setRows((prev) => prev.map((r) => ({ ...r, attendance: checked })));
  };

  const allChecked = rows.length > 0 && rows.every((r) => r.attendance);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border px-5 py-2.5">
        <div className="flex items-center gap-1 text-[13px]">
          <span className="text-ink-muted hover:text-ink cursor-pointer">Home</span>
          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink-muted">HRM</span>
          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink font-medium">Pending Attendance</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[12px] text-ink-muted mb-1">
              Date<span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <SearchableSelect
            label="Shift"
            value={shift}
            onChange={setShift}
            options={shiftOptions}
            placeholder="Select Shift"
            required
          />

          <SearchableSelect
            label="Department"
            value={department}
            onChange={setDepartment}
            options={departmentOptions}
            placeholder="Select Department"
            required
          />
        </div>

        {/* Table */}
        <div className="bg-surface rounded-lg border border-border shadow-sm shadow-black/6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="bg-black text-white">
                  {[
                    "SL",
                    "CODE",
                    "EMPLOYEE NAME",
                    "FROM TIME",
                    "TO TIME",
                    "HOURS",
                    "IN SELFIE",
                    "OUT SELFIE",
                    "IN LOCATION",
                    "OUT LOCATION",
                  ].map((h) => (
                    <th key={h} className="px-2.5 py-2.5 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                  <th className="px-2.5 py-2.5 font-semibold whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={(e) => toggleAll(e.target.checked)}
                        className="accent-white w-3.5 h-3.5"
                      />
                      ATTENDENCE
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-2.5 py-10 text-center text-ink-faint">
                      No pending attendance found
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-canvas/70">
                      <td className="px-2.5 py-2 text-ink-muted">{row.id}</td>
                      <td className="px-2.5 py-2 text-ink tabular-nums">{row.code}</td>
                      <td className="px-2.5 py-2 text-ink font-medium whitespace-nowrap">
                        {row.employeeName}
                      </td>
                      <td className="px-2.5 py-2 text-ink">{row.fromTime}</td>
                      <td className="px-2.5 py-2 text-ink">{row.toTime}</td>
                      <td className="px-2.5 py-2 text-ink tabular-nums">{row.hours}</td>
                      <td className="px-2.5 py-2 text-ink-faint">{row.inSelfie}</td>
                      <td className="px-2.5 py-2 text-ink-faint">{row.outSelfie}</td>
                      <td className="px-2.5 py-2 text-ink-faint">{row.inLocation}</td>
                      <td className="px-2.5 py-2 text-ink-faint">{row.outLocation}</td>
                      <td className="px-2.5 py-2">
                        <input
                          type="checkbox"
                          checked={row.attendance}
                          onChange={() => toggleAttendance(row.id)}
                          className="w-4 h-4 accent-black"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          className="px-5 py-2 rounded-md bg-black text-white text-[13px] font-medium hover:bg-slate-800 shadow-sm"
        >
          Submit
        </button>
      </div>
    </div>
  );
}