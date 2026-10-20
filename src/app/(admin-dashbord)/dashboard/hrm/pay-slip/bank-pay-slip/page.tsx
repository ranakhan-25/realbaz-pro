/* eslint-disable prettier/prettier */
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const years = [
  "2021", "2022", "2023", "2024", "2025", "2026",
  "2027", "2028", "2029", "2030", "2031",
];

interface BankPayslipRow {
  id: number;
  employeeId: string;
  name: string;
  month: string;
  generateDate: string;
  basicSalary: number;
  deduction: number;
  netSalary: number;
  bankPayableAmount: string;
  cashPayableAmount: number;
  selected: boolean;
}

const INITIAL_ROWS: BankPayslipRow[] = [
  {
    id: 1,
    employeeId: "12",
    name: "Mohin Uddin",
    month: "August-2026",
    generateDate: "12 Sept 2026",
    basicSalary: 0,
    deduction: 0,
    netSalary: 0,
    bankPayableAmount: "",
    cashPayableAmount: 0,
    selected: false,
  },
  {
    id: 2,
    employeeId: "03",
    name: "Rifat Hossain",
    month: "August-2026",
    generateDate: "12 Sept 2026",
    basicSalary: 22000,
    deduction: 23200,
    netSalary: -1200,
    bankPayableAmount: "",
    cashPayableAmount: -1200,
    selected: false,
  },
  {
    id: 3,
    employeeId: "02",
    name: "Tazmul Reza",
    month: "August-2026",
    generateDate: "12 Sept 2026",
    basicSalary: 11000,
    deduction: 22660,
    netSalary: -660,
    bankPayableAmount: "",
    cashPayableAmount: -660,
    selected: false,
  },
  {
    id: 4,
    employeeId: "02",
    name: "Tazmul Reza",
    month: "July-2026",
    generateDate: "24 Aug 2026",
    basicSalary: 11000,
    deduction: 660,
    netSalary: 21340,
    bankPayableAmount: "15000",
    cashPayableAmount: 6340,
    selected: false,
  },
];

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
    <div ref={ref} className="w-full">
      <label className="block text-[12px] text-gray-600 dark:text-gray-300 mb-1 font-medium">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between border rounded px-3 py-1.5 text-[13px] bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white ${
            open ? "border-black dark:border-white ring-1 ring-black dark:ring-white" : ""
          }`}
        >
          <span className={value ? "text-gray-900 dark:text-white font-medium" : "text-gray-400 dark:text-gray-500"}>
            {value || placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded shadow-lg z-50 overflow-hidden">
            <div className="px-3 py-2 bg-neutral-700 text-white text-[12px] font-medium">
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
                  className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                    value === opt ? "bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white font-semibold" : "text-gray-700 dark:text-gray-300"
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

export default function BankPaySlipListPage() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [rows, setRows] = useState<BankPayslipRow[]>(INITIAL_ROWS);

  const toggleSelect = (id: number) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r))
    );
  };

  const toggleAll = (checked: boolean) => {
    setRows((prev) => prev.map((r) => ({ ...r, selected: checked })));
  };

  const allChecked = rows.length > 0 && rows.every((r) => r.selected);

  const handleBankAmountChange = (id: number, val: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, bankPayableAmount: val } : r))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-800 dark:text-gray-200">
      {/* Breadcrumb */}
      <div className="px-5 py-3 text-[13px] text-gray-500 dark:text-gray-400 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
        <span className="hover:text-black dark:hover:text-white cursor-pointer">Home</span>
        <span className="mx-1">›</span>
        <span className="hover:text-black dark:hover:text-white cursor-pointer">HRM</span>
        <span className="mx-1">›</span>
        <span className="text-black dark:text-white font-medium">BankPaySlip List</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Top Filters & Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-end gap-3 w-full md:w-auto">
            <div className="w-full sm:w-64">
              <SimpleSelect
                label="Month"
                value={month}
                onChange={setMonth}
                options={months}
                required
              />
            </div>
            <div className="w-full sm:w-64">
              <SimpleSelect
                label="Year"
                value={year}
                onChange={setYear}
                options={years}
                required
              />
            </div>
            <button
              type="button"
              className="px-3 py-1.5 rounded bg-emerald-600 text-white text-[12px] font-medium hover:bg-emerald-700 shadow-sm h-[34px]"
            >
              PDF
            </button>
          </div>

          <div>
            <button
              type="button"
              className="px-4 py-2 rounded bg-black dark:bg-neutral-800 border dark:border-neutral-700 text-white text-[13px] font-medium hover:bg-neutral-800 dark:hover:bg-neutral-700 shadow-sm"
            >
              Ledger Entry(Accounts)
            </button>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[13px] pt-2">
          <div className="flex items-center gap-1.5">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(e.target.value)}
              className="border border-gray-300 dark:border-neutral-700 rounded px-2 py-1 text-[12px] bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 focus:outline-none"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>entries</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Search:</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 dark:border-neutral-700 rounded px-2 py-1 text-[12px] bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-neutral-900 rounded border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="bg-black dark:bg-neutral-800 text-white">
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">SL</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>SELECT</span>
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={(e) => toggleAll(e.target.checked)}
                        className="accent-white w-3.5 h-3.5 cursor-pointer"
                      />
                    </div>
                  </th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">EMPLOYEE ID</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">NAME</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">MONTH</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">GENERATE DATE</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">BASIC SALARY</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">DEDUCTION</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">NET SALARY</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">BANK PAYABLE AMOUNT</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">CASH PAYABLE AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-3 py-8 text-center text-gray-400 dark:text-gray-500">
                      No data available. Select Month &amp; Year then filter.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="border-b border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                      <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">{row.id}</td>
                      <td className="px-3 py-2.5">
                        <input
                          type="checkbox"
                          checked={row.selected}
                          onChange={() => toggleSelect(row.id)}
                          className="w-4 h-4 accent-black dark:accent-white cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-2.5 text-gray-800 dark:text-gray-300 tabular-nums">{row.employeeId}</td>
                      <td className="px-3 py-2.5 text-gray-900 dark:text-white font-medium whitespace-nowrap">
                        {row.name}
                      </td>
                      <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300 whitespace-nowrap">{row.month}</td>
                      <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300 whitespace-nowrap">{row.generateDate}</td>
                      <td className="px-3 py-2.5 text-gray-800 dark:text-gray-300 tabular-nums">{row.basicSalary}</td>
                      <td className="px-3 py-2.5 text-gray-800 dark:text-gray-300 tabular-nums">{row.deduction}</td>
                      <td className="px-3 py-2.5 text-gray-800 dark:text-gray-300 tabular-nums font-medium">{row.netSalary}</td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          placeholder="Amount"
                          value={row.bankPayableAmount}
                          onChange={(e) => handleBankAmountChange(row.id, e.target.value)}
                          className="w-full border border-gray-300 dark:border-neutral-700 rounded px-2.5 py-1 text-[12px] bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                        />
                      </td>
                      <td className="px-3 py-2.5 text-gray-800 dark:text-gray-300 tabular-nums font-medium">
                        {row.cashPayableAmount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-gray-500 dark:text-gray-400 pb-6">
          <div>
            Showing 1 to {rows.length} of {rows.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled
              className="px-3 py-1 border border-gray-200 dark:border-neutral-800 rounded text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-neutral-900 cursor-not-allowed"
            >
              Previous
            </button>
            <button className="px-3 py-1 rounded bg-black dark:bg-neutral-700 text-white font-medium">
              1
            </button>
            <button
              disabled
              className="px-3 py-1 border border-gray-200 dark:border-neutral-800 rounded text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-neutral-900 cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}