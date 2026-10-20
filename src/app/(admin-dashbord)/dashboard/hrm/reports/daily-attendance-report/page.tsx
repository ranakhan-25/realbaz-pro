/* eslint-disable prettier/prettier */
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar, SlidersHorizontal } from "lucide-react";

const shiftOptions = [
  "Masud Rana",
  "Rakib Hasan",
  "Masud Rana",
  "Friday OFF",
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

interface AttendanceEmployee {
  sl: number;
  code: string;
  name: string;
  designation: string;
  inTime: string | number;
  outTime: string | number;
  late: string | number;
  ot: string | number;
  status: string | number;
}

interface DepartmentGroup {
  department: string;
  total: number;
  present: number;
  absent: number;
  employees: AttendanceEmployee[];
}

const REPORT_DATA: DepartmentGroup[] = [
  {
    department: "Engineering",
    total: 2,
    present: 0,
    absent: 2,
    employees: [
      { sl: 1, code: "02", name: "Tazmul Reza", designation: "Executive", inTime: 0, outTime: 0, late: 0, ot: 0, status: 0 },
      { sl: 2, code: "03", name: "Rifat Hosain", designation: "Software Engineer", inTime: 0, outTime: 0, late: 0, ot: 0, status: 0 },
    ],
  },
  {
    department: "Customs",
    total: 1,
    present: 0,
    absent: 1,
    employees: [
      { sl: 1, code: "12", name: "Mohin Uddin", designation: "Tea Boy", inTime: 0, outTime: 0, late: 0, ot: 0, status: 0 },
    ],
  },
];

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
            <div className="max-h-52 overflow-y-auto py-1">
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

export default function DailyAttendanceReportPage() {
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
        <span className="text-black dark:text-white font-medium">Daily Attendance Report</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Picker Input */}
          <div>
            <label className="block text-[12px] text-gray-600 dark:text-gray-300 mb-1 font-medium">
              Date<span className="text-rose-500 ml-0.5">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 dark:border-neutral-700 rounded px-3 py-1.5 text-[13px] bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              />
              <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Attendance (Shift) Dropdown */}
          <SimpleSelect
            label="Attendance"
            value={shift}
            onChange={setShift}
            options={shiftOptions}
            placeholder="Select Shift"
            required
          />

          {/* Department Dropdown */}
          <SimpleSelect
            label="Department"
            value={department}
            onChange={setDepartment}
            options={departmentOptions}
            placeholder="Select Department"
            required
          />
        </div>

        {/* Export Buttons and Table Control Icon */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
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
          <button
            type="button"
            className="p-1.5 border border-gray-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-300"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Attendance Report Table */}
        <div className="bg-white dark:bg-neutral-900 rounded border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="bg-black dark:bg-neutral-800 text-white">
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap w-12 text-center">SL.</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">CODE</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">NAME</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">DESIGNATION</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap text-center">IN TIME</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap text-center">OUT TIME</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap text-center">LATE</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap text-center">OT</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap text-center">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {REPORT_DATA.map((group) => (
                  <tr key={group.department} className="contents">
                    {/* Department Header Row */}
                    <tr>
                      <td
                        colSpan={9}
                        className="py-2.5 text-center font-semibold text-gray-800 dark:text-gray-100 text-[14px] bg-gray-50/50 dark:bg-neutral-950/40 border-b border-gray-200 dark:border-neutral-800"
                      >
                        {group.department}
                      </td>
                    </tr>

                    {/* Employee Rows */}
                    {group.employees.map((emp) => (
                      <tr
                        key={`${group.department}-${emp.sl}`}
                        className="border-b border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                      >
                        <td className="px-3 py-2 text-center text-gray-600 dark:text-gray-400">{emp.sl}</td>
                        <td className="px-3 py-2 text-gray-800 dark:text-gray-300 tabular-nums">{emp.code}</td>
                        <td className="px-3 py-2 text-gray-900 dark:text-white font-medium whitespace-nowrap">
                          {emp.name}
                        </td>
                        <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{emp.designation}</td>
                        <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300">{emp.inTime}</td>
                        <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300">{emp.outTime}</td>
                        <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300">{emp.late}</td>
                        <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300">{emp.ot}</td>
                        <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300">{emp.status}</td>
                      </tr>
                    ))}

                    {/* Department Summary Footer Row */}
                    <tr>
                      <td
                        colSpan={9}
                        className="py-2 text-center text-[12px] font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800"
                      >
                        Total Employee: {group.total} Present: {group.present} Absent: {group.absent}
                      </td>
                    </tr>
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