/* eslint-disable prettier/prettier */
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const monthOptions = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const yearOptions = [
  "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031"
];

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

interface AttendanceDetailsRow {
  sl: number;
  employeeId: string;
  name: string;
  designation: string;
  days: string[];
  workingDays: number;
  present: number;
  leave: number;
  absent: number;
  late: number;
  paidLeave: number;
  unpaidLeave: number;
}

const DETAILS_DATA: AttendanceDetailsRow[] = [
  {
    sl: 1,
    employeeId: "02",
    name: "Tazmul Reza",
    designation: "Executive",
    days: ["A", "A", "A", "W", "A", "A", "A", "LT", "LT", "UL", "H", "H", "H", "H", "A", "A", "H", "H", "H", "H", "A", "A", "A", "A", "W", "A", "A", "A", "A", "A"],
    workingDays: 30,
    present: 0,
    leave: 2,
    absent: 17,
    late: 0,
    paidLeave: 2,
    unpaidLeave: 1,
  },
  {
    sl: 2,
    employeeId: "03",
    name: "Rifat Hosain",
    designation: "Software Engineer",
    days: ["A", "A", "A", "W", "A", "A", "A", "A", "P", "A", "H", "H", "H", "H", "A", "A", "H", "H", "H", "H", "A", "A", "A", "A", "W", "A", "A", "A", "A", "A"],
    workingDays: 30,
    present: 1,
    leave: 0,
    absent: 19,
    late: 0,
    paidLeave: 0,
    unpaidLeave: 0,
  },
  {
    sl: 3,
    employeeId: "12",
    name: "Mohin Uddin",
    designation: "Tea Boy",
    days: ["A", "A", "A", "W", "A", "A", "A", "A", "P", "A", "H", "H", "H", "H", "A", "A", "H", "H", "H", "H", "A", "A", "A", "A", "W", "A", "A", "A", "A", "A"],
    workingDays: 30,
    present: 1,
    leave: 0,
    absent: 19,
    late: 0,
    paidLeave: 0,
    unpaidLeave: 0,
  },
];

const dayHeaders = [
  { day: "01", name: "TUE" }, { day: "02", name: "WED" }, { day: "03", name: "THU" }, { day: "04", name: "FRI" },
  { day: "05", name: "SAT" }, { day: "06", name: "SUN" }, { day: "07", name: "MON" }, { day: "08", name: "TUE" },
  { day: "09", name: "WED" }, { day: "10", name: "THU" }, { day: "11", name: "FRI" }, { day: "12", name: "SAT" },
  { day: "13", name: "SUN" }, { day: "14", name: "MON" }, { day: "15", name: "TUE" }, { day: "16", name: "WED" },
  { day: "17", name: "THU" }, { day: "18", name: "FRI" }, { day: "19", name: "SAT" }, { day: "20", name: "SUN" },
  { day: "21", name: "MON" }, { day: "22", name: "TUE" }, { day: "23", name: "WED" }, { day: "24", name: "THU" },
  { day: "25", name: "FRI" }, { day: "26", name: "SAT" }, { day: "27", name: "SUN" }, { day: "28", name: "MON" },
  { day: "29", name: "TUE" }, { day: "30", name: "WED" }
];

// Custom Dropdown Select Component (Scrollbar Hidden)
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
          className={`w-full flex items-center justify-between border rounded px-3 py-1.5 text-[13px] bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-neutral-700 focus:outline-none ${
            open ? "border-indigo-500 ring-1 ring-indigo-500" : ""
          }`}
        >
          <span className={value ? "text-gray-900 dark:text-white font-medium" : "text-gray-400 dark:text-gray-500"}>
            {value || placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded shadow-lg z-50 overflow-hidden">
            <div className="px-3 py-2 bg-neutral-600 text-white text-[12px] font-medium">
              {placeholder}
            </div>
            {/* Scrollbar Hidden Class Applied */}
            <div className="max-h-56 overflow-y-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

export default function AttendanceDetailsReportPage() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-800 dark:text-gray-200">
      {/* Breadcrumb Header */}
      <div className="px-5 py-3 text-[13px] text-gray-500 dark:text-gray-400 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
        <span className="hover:text-black dark:hover:text-white cursor-pointer">Home</span>
        <span className="mx-1">›</span>
        <span className="hover:text-black dark:hover:text-white cursor-pointer">HRM</span>
        <span className="mx-1">›</span>
        <span className="text-black dark:text-white font-medium">Attendance Details Report</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Top Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SimpleSelect
            label="Month"
            value={month}
            onChange={setMonth}
            options={monthOptions}
            placeholder="Select One Option"
          />

          <SimpleSelect
            label="Year"
            value={year}
            onChange={setYear}
            options={yearOptions}
            placeholder="Select One Option"
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
            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[12px] font-medium rounded shadow-sm"
          >
            Excel
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-[12px] font-medium rounded shadow-sm"
          >
            Pdf
          </button>
        </div>

        {/* Details Table - Scrollbar Hidden */}
        <div className="bg-white dark:bg-neutral-900 rounded border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-black dark:bg-neutral-800 text-white">
                  <th className="px-2 py-2 font-semibold text-center border-r border-neutral-700 whitespace-nowrap">SL</th>
                  <th className="px-2 py-2 font-semibold border-r border-neutral-700 whitespace-nowrap">EMPLOYEE ID</th>
                  <th className="px-3 py-2 font-semibold border-r border-neutral-700 whitespace-nowrap">NAME</th>
                  <th className="px-3 py-2 font-semibold border-r border-neutral-700 whitespace-nowrap">DESIGNATION</th>
                  
                  {/* 30-Day Headers */}
                  {dayHeaders.map((dh, idx) => (
                    <th key={idx} className="px-1.5 py-1 text-center border-r border-neutral-700 whitespace-nowrap font-normal leading-tight">
                      <div className="font-semibold">{dh.day}</div>
                      <div className="text-[9px] text-gray-300 uppercase">{dh.name}</div>
                    </th>
                  ))}

                  <th className="px-2 py-2 font-semibold text-center border-r border-neutral-700 whitespace-nowrap">WORKING DAYS</th>
                  <th className="px-2 py-2 font-semibold text-center border-r border-neutral-700 whitespace-nowrap">PRESENT</th>
                  <th className="px-2 py-2 font-semibold text-center border-r border-neutral-700 whitespace-nowrap">LEAVE</th>
                  <th className="px-2 py-2 font-semibold text-center border-r border-neutral-700 whitespace-nowrap">ABSENT</th>
                  <th className="px-2 py-2 font-semibold text-center border-r border-neutral-700 whitespace-nowrap">LATE</th>
                  <th className="px-2 py-2 font-semibold text-center border-r border-neutral-700 whitespace-nowrap">PAID LEAVE</th>
                  <th className="px-2 py-2 font-semibold text-center whitespace-nowrap">UNPAID LEAVE</th>
                </tr>
              </thead>
              <tbody>
                {DETAILS_DATA.map((row) => (
                  <tr
                    key={row.sl}
                    className="border-b border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                  >
                    <td className="px-2 py-2 text-center text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-neutral-800">{row.sl}</td>
                    <td className="px-2 py-2 text-center border-r border-gray-200 dark:border-neutral-800 font-medium">{row.employeeId}</td>
                    <td className="px-3 py-2 font-medium text-gray-800 dark:text-gray-200 border-r border-gray-200 dark:border-neutral-800 whitespace-nowrap">
                      {row.name}
                    </td>
                    <td className="px-3 py-2 border-r border-gray-200 dark:border-neutral-800 whitespace-nowrap">{row.designation}</td>
                    
                    {row.days.map((status, idx) => (
                      <td key={idx} className="px-1.5 py-2 text-center border-r border-gray-200 dark:border-neutral-800 font-semibold">
                        {status}
                      </td>
                    ))}

                    <td className="px-2 py-2 text-center border-r border-gray-200 dark:border-neutral-800">{row.workingDays}</td>
                    <td className="px-2 py-2 text-center border-r border-gray-200 dark:border-neutral-800">{row.present}</td>
                    <td className="px-2 py-2 text-center border-r border-gray-200 dark:border-neutral-800">{row.leave}</td>
                    <td className="px-2 py-2 text-center border-r border-gray-200 dark:border-neutral-800">{row.absent}</td>
                    <td className="px-2 py-2 text-center border-r border-gray-200 dark:border-neutral-800">{row.late}</td>
                    <td className="px-2 py-2 text-center border-r border-gray-200 dark:border-neutral-800">{row.paidLeave}</td>
                    <td className="px-2 py-2 text-center">{row.unpaidLeave}</td>
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