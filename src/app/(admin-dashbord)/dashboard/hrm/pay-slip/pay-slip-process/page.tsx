/* eslint-disable prettier/prettier */
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const years = [
  "2021", "2022", "2023", "2024", "2025", "2026",
  "2027", "2028", "2029", "2030", "2031",
];

interface PayslipRow {
  id: number;
  employeeId: string;
  employeeName: string;
  month: string;
  grossSalary: string;
  absentAmount: string;
  deduction: string;
  netSalary: string;
  selected: boolean;
}

const ALL_ROWS: PayslipRow[] = [];

function SimpleSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select One Option",
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
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
          onClick={() => setOpen(!open)}
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
            <div className="max-h-52 overflow-y-auto py-1">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[13px] hover:bg-canvas ${
                    value === opt
                      ? "bg-ink-muted/20 text-ink font-medium"
                      : "text-ink-muted"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaySlipProcessPage() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [rows, setRows] = useState<PayslipRow[]>(ALL_ROWS);

  const toggleSelect = (id: number) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r))
    );
  };

  const toggleAll = (checked: boolean) => {
    setRows((prev) => prev.map((r) => ({ ...r, selected: checked })));
  };

  const allChecked = rows.length > 0 && rows.every((r) => r.selected);

  const handleGenerate = () => {
    // generate payslip logic
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border px-5 py-2.5">
        <div className="flex items-center gap-1 text-[13px]">
          <span className="text-ink-muted hover:text-ink cursor-pointer">Home</span>
          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink-muted">HRM</span>
          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink font-medium">PaySlip Process</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <SimpleSelect
            label="Month"
            value={month}
            onChange={setMonth}
            options={months}
            required
          />
          <SimpleSelect
            label="Year"
            value={year}
            onChange={setYear}
            options={years}
            required
          />
          <div>
            <label className="block text-[12px] text-ink-muted mb-1">
              Generate<span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleGenerate}
              className="px-4 py-2 rounded-md bg-black text-white text-[13px] font-medium hover:bg-slate-800 shadow-sm"
            >
              Generate Pay Slip
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface rounded-lg border border-border shadow-sm shadow-black/6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="bg-black text-white">
                  {[
                    "SL",
                    "EMPLOYEE ID",
                    "EMPLOYEE NAME",
                    "MONTH",
                    "GROSS SALARY",
                    "ABSENT AMOUNT",
                    "DEDUCTION",
                    "NET SALARY",
                  ].map((h) => (
                    <th key={h} className="px-3 py-2.5 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={(e) => toggleAll(e.target.checked)}
                        className="accent-white w-3.5 h-3.5"
                      />
                      SELECT
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-3 py-10 text-center text-ink-faint">
                      No data available. Select Month &amp; Year then Generate Pay Slip.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-canvas/70">
                      <td className="px-3 py-2.5 text-ink-muted">{row.id}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{row.employeeId}</td>
                      <td className="px-3 py-2.5 text-ink font-medium whitespace-nowrap">
                        {row.employeeName}
                      </td>
                      <td className="px-3 py-2.5 text-ink">{row.month}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{row.grossSalary}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{row.absentAmount}</td>
                      <td className="px-3 py-2.5 text-ink tabular-nums">{row.deduction}</td>
                      <td className="px-3 py-2.5 text-ink font-medium tabular-nums">
                        {row.netSalary}
                      </td>
                      <td className="px-3 py-2.5">
                        <input
                          type="checkbox"
                          checked={row.selected}
                          onChange={() => toggleSelect(row.id)}
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
      </div>
    </div>
  );
}