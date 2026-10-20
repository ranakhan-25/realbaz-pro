/* eslint-disable prettier/prettier */
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar, ArrowLeft, ArrowRight } from "lucide-react";

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

interface AttendanceSummaryRow {
  sl: number;
  code: string;
  name: string;
  joiningDate: string;
  section: string;
  designation: string;
  present: number;
  absent: number;
  late: number;
  leave: number;
}

const SUMMARY_DATA: AttendanceSummaryRow[] = [
  {
    sl: 1,
    code: "02",
    name: "Tazmul Reza",
    joiningDate: "2024-07-01",
    section: "Software Support",
    designation: "Executive",
    present: 0,
    absent: 17,
    late: 0,
    leave: 2,
  },
  {
    sl: 2,
    code: "03",
    name: "Rifat Hosain",
    joiningDate: "2026-02-01",
    section: "Software Support",
    designation: "Software Engineer",
    present: 1,
    absent: 19,
    late: 0,
    leave: 0,
  },
  {
    sl: 3,
    code: "12",
    name: "Mohin Uddin",
    joiningDate: "2026-07-30",
    section: "Software Development",
    designation: "Tea Boy",
    present: 1,
    absent: 19,
    late: 0,
    leave: 0,
  },
];

// Advanced Date Range Picker Component
function CustomDateRangePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Custom Range");
  const [fromDate, setFromDate] = useState("01/09/2026");
  const [toDate, setToDate] = useState("30/09/2026");
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

  const sidebarOptions = [
    "Today",
    "Yesterday",
    "Last 7 Days",
    "Last 30 Days",
    "This Month",
    "Last Month",
    "Custom Range",
  ];

  const daysJan = [
    28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7
  ];

  const daysFeb = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 1, 2, 3, 4, 5, 6, 7
  ];

  const handleApply = () => {
    onChange(`${fromDate} - ${toDate}`);
    setOpen(false);
  };

  return (
    <div ref={ref} className="w-full relative">
      <label className="block text-[12px] text-gray-600 dark:text-gray-300 mb-1 font-medium">
        Select Date
      </label>
      <div className="relative">
        <input
          type="text"
          readOnly
          value={value}
          onClick={() => setOpen(!open)}
          className={`w-full border rounded px-3 py-1.5 text-[13px] bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 cursor-pointer border-gray-300 dark:border-neutral-700 focus:outline-none ${
            open ? "border-black dark:border-white ring-1 ring-black dark:ring-white" : ""
          }`}
        />
        <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg shadow-2xl z-50 p-3 flex flex-col gap-3 min-w-[620px]">
          <div className="flex gap-4">
            {/* Sidebar Buttons */}
            <div className="w-36 flex flex-col gap-1 shrink-0">
              {sidebarOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setActiveTab(opt)}
                  className={`text-left px-3 py-1.5 text-[12px] rounded transition-colors ${
                    activeTab === opt
                      ? "bg-indigo-600 text-white font-medium shadow-sm"
                      : "text-sky-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Calendar Views */}
            <div className="flex-1 flex gap-4">
              {/* Month 1 */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2 px-1">
                  <button type="button" className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                    <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                  <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">Jan 2026</span>
                  <button type="button" className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                    <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
                <div className="grid grid-cols-7 text-center font-medium text-[11px] text-gray-500 mb-1">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[12px]">
                  {daysJan.slice(0, 35).map((d, i) => (
                    <div
                      key={i}
                      className={`h-7 flex items-center justify-center rounded ${
                        d === 9
                          ? "bg-indigo-600 text-white font-bold"
                          : i < 4 || i > 31
                          ? "text-gray-300 dark:text-gray-700"
                          : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </div>

              {/* Month 2 */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 w-full text-center">Feb 2026</span>
                  <button type="button" className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                    <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
                <div className="grid grid-cols-7 text-center font-medium text-[11px] text-gray-500 mb-1">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[12px]">
                  {daysFeb.slice(0, 35).map((d, i) => (
                    <div
                      key={i}
                      className={`h-7 flex items-center justify-center rounded ${
                        i > 27
                          ? "text-gray-300 dark:text-gray-700"
                          : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Inputs & Action Buttons */}
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-neutral-800 pt-3 mt-1">
            <div className="flex items-center gap-2">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-0.5">From</span>
                <input
                  type="text"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-24 border border-gray-300 dark:border-neutral-700 rounded px-2 py-1 text-[12px] bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-0.5">To</span>
                <input
                  type="text"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-24 border border-gray-300 dark:border-neutral-700 rounded px-2 py-1 text-[12px] bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 self-end">
              <button
                type="button"
                onClick={handleApply}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[12px] font-medium rounded shadow-sm"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-1.5 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 text-[12px] font-medium rounded border border-gray-300 dark:border-neutral-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom Dropdown Select Component
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
          className={`w-full flex items-center justify-between border rounded px-3 py-1.5 text-[13px] bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-neutral-700 focus:outline-none ${
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

export default function AttendanceSummaryReportPage() {
  const [selectedDateRange, setSelectedDateRange] = useState("01-09-2026 - 30-09-2026");
  const [shift, setShift] = useState("");
  const [department, setDepartment] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-800 dark:text-gray-200">
      {/* Breadcrumb Header */}
      <div className="px-5 py-3 text-[13px] text-gray-500 dark:text-gray-400 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
        <span className="hover:text-black dark:hover:text-white cursor-pointer">Home</span>
        <span className="mx-1">›</span>
        <span className="hover:text-black dark:hover:text-white cursor-pointer">HRM</span>
        <span className="mx-1">›</span>
        <span className="text-black dark:text-white font-medium">Attendance Summary Report</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomDateRangePicker
            value={selectedDateRange}
            onChange={setSelectedDateRange}
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

        {/* Table Container - Black Header Theme & Scrollbar Hidden */}
        <div className="bg-white dark:bg-neutral-900 rounded border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left text-[12.5px] border-collapse">
              <thead>
                <tr className="bg-black dark:bg-neutral-800 text-white">
                  <th className="px-3 py-2.5 font-semibold text-center border-r border-neutral-700 whitespace-nowrap">SL.</th>
                  <th className="px-3 py-2.5 font-semibold border-r border-neutral-700 whitespace-nowrap">CODE</th>
                  <th className="px-3 py-2.5 font-semibold border-r border-neutral-700 whitespace-nowrap">NAME</th>
                  <th className="px-3 py-2.5 font-semibold border-r border-neutral-700 whitespace-nowrap">JOINING DATE</th>
                  <th className="px-3 py-2.5 font-semibold border-r border-neutral-700 whitespace-nowrap">SECTION</th>
                  <th className="px-3 py-2.5 font-semibold border-r border-neutral-700 whitespace-nowrap">DESIGNATION</th>
                  <th className="px-3 py-2.5 font-semibold text-center border-r border-neutral-700 whitespace-nowrap">PRESENT</th>
                  <th className="px-3 py-2.5 font-semibold text-center border-r border-neutral-700 whitespace-nowrap">ABSENT</th>
                  <th className="px-3 py-2.5 font-semibold text-center border-r border-neutral-700 whitespace-nowrap">LATE</th>
                  <th className="px-3 py-2.5 font-semibold text-center whitespace-nowrap">LEAVE</th>
                </tr>
              </thead>
              <tbody>
                {SUMMARY_DATA.map((row) => (
                  <tr
                    key={row.sl}
                    className="border-b border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                  >
                    <td className="px-3 py-2 text-center text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-neutral-800">{row.sl}</td>
                    <td className="px-3 py-2 border-r border-gray-200 dark:border-neutral-800">{row.code}</td>
                    <td className="px-3 py-2 font-medium text-gray-800 dark:text-gray-200 border-r border-gray-200 dark:border-neutral-800 whitespace-nowrap">
                      {row.name}
                    </td>
                    <td className="px-3 py-2 border-r border-gray-200 dark:border-neutral-800 whitespace-nowrap">{row.joiningDate}</td>
                    <td className="px-3 py-2 border-r border-gray-200 dark:border-neutral-800 whitespace-nowrap">{row.section}</td>
                    <td className="px-3 py-2 border-r border-gray-200 dark:border-neutral-800 whitespace-nowrap">{row.designation}</td>
                    <td className="px-3 py-2 text-center border-r border-gray-200 dark:border-neutral-800">{row.present}</td>
                    <td className="px-3 py-2 text-center border-r border-gray-200 dark:border-neutral-800">{row.absent}</td>
                    <td className="px-3 py-2 text-center border-r border-gray-200 dark:border-neutral-800">{row.late}</td>
                    <td className="px-3 py-2 text-center">{row.leave}</td>
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