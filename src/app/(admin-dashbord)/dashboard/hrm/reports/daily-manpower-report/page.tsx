/* eslint-disable prettier/prettier */
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const shiftOptions = ["Masud Rana", "Rakib Hasan", "Masud Rana", "Friday OFF"];

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

interface ManpowerRow {
  sl: number;
  department: string;
  strength: number;
  present: number;
  absent: number;
  absentPercentage: string;
  absentEmployees?: string;
}

const MANPOWER_DATA: ManpowerRow[] = [
  { sl: 1, department: "Executive Management", strength: 0, present: 0, absent: 0, absentPercentage: "0%" },
  { sl: 2, department: "Engineering", strength: 2, present: 0, absent: 2, absentPercentage: "100%", absentEmployees: "Tazmul Reza, Rifat Hosain," },
  { sl: 3, department: "Purchase & Procurement", strength: 0, present: 0, absent: 0, absentPercentage: "0%" },
  { sl: 4, department: "Sales and Marketing", strength: 0, present: 0, absent: 0, absentPercentage: "0%" },
  { sl: 5, department: "Account & Finance", strength: 0, present: 0, absent: 0, absentPercentage: "0%" },
  { sl: 6, department: "Admin & HRM", strength: 0, present: 0, absent: 0, absentPercentage: "0%" },
  { sl: 7, department: "HR & Admin & Procurement", strength: 0, present: 0, absent: 0, absentPercentage: "0%" },
  { sl: 8, department: "Architecture", strength: 0, present: 0, absent: 0, absentPercentage: "0%" },
  { sl: 9, department: "IT", strength: 0, present: 0, absent: 0, absentPercentage: "0%" },
  { sl: 10, department: "Test", strength: 0, present: 0, absent: 0, absentPercentage: "0%" },
  { sl: 11, department: "Factory", strength: 0, present: 0, absent: 0, absentPercentage: "0%" },
  { sl: 12, department: "Electrical", strength: 0, present: 0, absent: 0, absentPercentage: "0%" },
  { sl: 13, department: "Mechanical", strength: 0, present: 0, absent: 0, absentPercentage: "0%" },
  { sl: 14, department: "Chemical", strength: 0, present: 0, absent: 0, absentPercentage: "0%" },
  { sl: 15, department: "Dop", strength: 0, present: 0, absent: 0, absentPercentage: "0%" },
  { sl: 16, department: "Accounts", strength: 0, present: 0, absent: 0, absentPercentage: "0%" },
  { sl: 17, department: "Customs", strength: 1, present: 0, absent: 1, absentPercentage: "100%", absentEmployees: "Mohin Uddin," },
  { sl: 18, department: "Store", strength: 0, present: 0, absent: 0, absentPercentage: "0%" },
  { sl: 19, department: "Sales & Marketing", strength: 0, present: 0, absent: 0, absentPercentage: "0%" },
  { sl: 20, department: "Business Development", strength: 0, present: 0, absent: 0, absentPercentage: "0%" },
];

// Custom Date Picker Component
function CustomDatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years = ["2024", "2025", "2026", "2027", "2028"];

  const [selectedMonth, setSelectedMonth] = useState("Sep");
  const [selectedYear, setSelectedYear] = useState("2026");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Calendar dates matrix based on image
  const days = [
    { num: 30, isCurrent: false }, { num: 31, isCurrent: false }, { num: 1, isCurrent: true }, { num: 2, isCurrent: true }, { num: 3, isCurrent: true }, { num: 4, isCurrent: true }, { num: 5, isCurrent: true },
    { num: 6, isCurrent: true }, { num: 7, isCurrent: true }, { num: 8, isCurrent: true }, { num: 9, isCurrent: true }, { num: 10, isCurrent: true }, { num: 11, isCurrent: true }, { num: 12, isCurrent: true },
    { num: 13, isCurrent: true, active: true }, { num: 14, isCurrent: true }, { num: 15, isCurrent: true }, { num: 16, isCurrent: true }, { num: 17, isCurrent: true }, { num: 18, isCurrent: true }, { num: 19, isCurrent: true },
    { num: 20, isCurrent: true }, { num: 21, isCurrent: true }, { num: 22, isCurrent: true }, { num: 23, isCurrent: true }, { num: 24, isCurrent: true }, { num: 25, isCurrent: true }, { num: 26, isCurrent: true },
    { num: 27, isCurrent: true }, { num: 28, isCurrent: true }, { num: 29, isCurrent: true }, { num: 30, isCurrent: true }, { num: 1, isCurrent: false }, { num: 2, isCurrent: false }, { num: 3, isCurrent: false },
  ];

  return (
    <div ref={ref} className="w-full relative">
      <label className="block text-[12px] text-gray-600 dark:text-gray-300 mb-1 font-medium">
        Date<span className="text-rose-500 ml-0.5">*</span>
      </label>
      <div className="relative">
        <input
          type="text"
          readOnly
          value={value}
          onClick={() => setOpen(!open)}
          className={`w-full border rounded px-3 py-1.5 text-[13px] bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 cursor-pointer border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white ${
            open ? "border-indigo-600 dark:border-indigo-500 ring-1 ring-indigo-600 dark:ring-indigo-500" : ""
          }`}
        />
        <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-[260px] bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded shadow-xl z-50 p-2">
          {/* Header Controls */}
          <div className="flex items-center justify-between bg-gray-200 dark:bg-neutral-800 p-1.5 rounded mb-2 border border-gray-300 dark:border-neutral-700">
            <button type="button" className="p-1 hover:bg-gray-300 dark:hover:bg-neutral-700 rounded">
              <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-200" />
            </button>
            <div className="flex items-center gap-1">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded px-1.5 py-0.5 text-[12px] text-gray-800 dark:text-gray-200 font-semibold focus:outline-none"
              >
                {months.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded px-1.5 py-0.5 text-[12px] text-gray-800 dark:text-gray-200 font-semibold focus:outline-none"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <button type="button" className="p-1 hover:bg-gray-300 dark:hover:bg-neutral-700 rounded">
              <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-200" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 text-center font-semibold text-[11px] text-gray-700 dark:text-gray-300 mb-1">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Date Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((item, idx) => {
              const dayStr = item.num < 10 ? `0${item.num}` : `${item.num}`;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (item.isCurrent) {
                      onChange(`${dayStr}/09/${selectedYear}`);
                      setOpen(false);
                    }
                  }}
                  className={`h-7 w-full flex items-center justify-center text-[12px] border rounded transition-colors ${
                    item.active
                      ? "bg-yellow-300 dark:bg-yellow-500 text-black font-bold border-yellow-400 dark:border-yellow-600"
                      : item.isCurrent
                      ? "bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800"
                      : "bg-gray-50 dark:bg-neutral-950/50 border-gray-200 dark:border-neutral-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {item.num}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SimpleSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select Option",
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
            <div className="max-h-52 overflow-y-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {options.map((opt, idx) => (
                <button
                  key={`${opt}-${idx}`}
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

export default function DailyManpowerReportPage() {
  const [selectedDate, setSelectedDate] = useState("13/09/2026");
  const [shift, setShift] = useState("");
  const [department, setDepartment] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-800 dark:text-gray-200">
      {/* Breadcrumb */}
      <div className="px-5 py-3 text-[13px] text-gray-500 dark:text-gray-400 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
        <span className="hover:text-black dark:hover:text-white cursor-pointer">Home</span>
        <span className="mx-1">›</span>
        <span className="hover:text-black dark:hover:text-white cursor-pointer">HRM</span>
        <span className="mx-1">›</span>
        <span className="text-black dark:text-white font-medium">Daily Manpower Report</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomDatePicker
            value={selectedDate}
            onChange={setSelectedDate}
          />

          <SimpleSelect
            label="Attendance"
            value={shift}
            onChange={setShift}
            options={shiftOptions}
            placeholder="Select Shift"
            required
          />

          <SimpleSelect
            label="Department"
            value={department}
            onChange={setDepartment}
            options={departmentOptions}
            placeholder="Select Department"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            className="px-3 py-1.5 rounded bg-rose-500 hover:bg-rose-600 text-white text-[12px] font-medium shadow-sm"
          >
            Pdf
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-[12px] font-medium shadow-sm"
          >
            Excel
          </button>
        </div>

        {/* Table Container - Scrollbar Hidden */}
        <div className="bg-white dark:bg-neutral-900 rounded border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="bg-black dark:bg-neutral-800 text-white">
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap text-center w-12 border-r border-neutral-700">SL.</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap border-r border-neutral-700">DEPARTMENT</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap text-center border-r border-neutral-700">STRENGTH</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap text-center border-r border-neutral-700">PRESENT</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap text-center border-r border-neutral-700">ABSENT</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap text-center border-r border-neutral-700">ABS.%</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">ABSENT EMPLOYEE NAME</th>
                </tr>
              </thead>
              <tbody>
                {MANPOWER_DATA.map((row) => (
                  <tr
                    key={row.sl}
                    className="border-b border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                  >
                    <td className="px-3 py-2 text-center text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-neutral-800">{row.sl}</td>
                    <td className="px-3 py-2 text-gray-800 dark:text-gray-200 font-medium whitespace-nowrap border-r border-gray-200 dark:border-neutral-800">
                      {row.department}
                    </td>
                    <td className="px-3 py-2 text-center text-gray-800 dark:text-gray-300 border-r border-gray-200 dark:border-neutral-800">{row.strength}</td>
                    <td className="px-3 py-2 text-center text-gray-800 dark:text-gray-300 border-r border-gray-200 dark:border-neutral-800">{row.present}</td>
                    <td className="px-3 py-2 text-center text-gray-800 dark:text-gray-300 border-r border-gray-200 dark:border-neutral-800">{row.absent}</td>
                    <td className="px-3 py-2 text-center text-gray-800 dark:text-gray-300 border-r border-gray-200 dark:border-neutral-800">{row.absentPercentage}</td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {row.absentEmployees || ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}