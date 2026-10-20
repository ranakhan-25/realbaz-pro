/* eslint-disable prettier/prettier */
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

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

interface AttendanceRegisterRow {
  sl: number;
  code: string;
  name: string;
  joiningDate: string;
  section: string;
  designation: string;
  attendance: string;
  officeStart: string;
  inTime: string;
  outTime: string;
  workHour: string;
  late: string;
  earlyLeave: string;
  ot: string;
}

const ATTENDANCE_REGISTER_DATA: AttendanceRegisterRow[] = [
  {
    sl: 1,
    code: "02",
    name: "Tazmul Reza",
    joiningDate: "01-Jul-2024",
    section: "Software Support",
    designation: "Executive",
    attendance: "A",
    officeStart: "9:00 AM",
    inTime: "",
    outTime: "",
    workHour: "",
    late: "",
    earlyLeave: "",
    ot: "",
  },
  {
    sl: 2,
    code: "03",
    name: "Rifat Hosain",
    joiningDate: "01-Feb-2026",
    section: "Software Support",
    designation: "Software Engineer",
    attendance: "A",
    officeStart: "9:00 AM",
    inTime: "",
    outTime: "",
    workHour: "",
    late: "",
    earlyLeave: "",
    ot: "",
  },
  {
    sl: 3,
    code: "12",
    name: "Mohin Uddin",
    joiningDate: "30-Jul-2026",
    section: "Software Development",
    designation: "Tea Boy",
    attendance: "A",
    officeStart: "9:00 AM",
    inTime: "",
    outTime: "",
    workHour: "",
    late: "",
    earlyLeave: "",
    ot: "",
  },
];

// Custom Date Picker Dropdown
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
        <div className="absolute top-full left-0 mt-1 w-[260px] bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded shadow-xl z-50 p-2">
          <div className="flex items-center justify-between bg-neutral-200 dark:bg-neutral-800 p-1.5 rounded mb-2 border border-gray-300 dark:border-neutral-700">
            <button type="button" className="p-1 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded">
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
            <button type="button" className="p-1 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded">
              <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-200" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center font-semibold text-[11px] text-gray-700 dark:text-gray-300 mb-1">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((item, idx) => {
              const dayStr = item.num < 10 ? `0${item.num}` : `${item.num}`;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (item.isCurrent) {
                      onChange(`09/${dayStr}/${selectedYear}`);
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

// Custom Dropdown Select
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

export default function AttendanceRegisterReportPage() {
  const [selectedDate, setSelectedDate] = useState("09/13/2026");
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
        <span className="text-black dark:text-white font-medium">Attendance Register Report</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Top Select Filters Grid */}
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

        {/* Action Buttons & Column Settings */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-[12px] font-medium rounded shadow-sm"
            >
              PDF
            </button>
            <button
              type="button"
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[12px] font-medium rounded shadow-sm"
            >
              Excel
            </button>
          </div>

          <button
            type="button"
            className="p-1.5 border border-sky-400 text-sky-600 rounded hover:bg-sky-50 dark:hover:bg-neutral-800"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Attendance Register Table - Black Theme */}
        <div className="bg-white dark:bg-neutral-900 rounded border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left text-[12px] border-collapse">
              <thead>
                <tr className="bg-black dark:bg-neutral-800 text-white">
                  <th className="px-3 py-2.5 font-semibold text-center border-r border-neutral-700 whitespace-nowrap">SL.</th>
                  <th className="px-3 py-2.5 font-semibold border-r border-neutral-700 whitespace-nowrap">CODE</th>
                  <th className="px-3 py-2.5 font-semibold border-r border-neutral-700 whitespace-nowrap">NAME</th>
                  <th className="px-3 py-2.5 font-semibold border-r border-neutral-700 whitespace-nowrap">JOINING DATE</th>
                  <th className="px-3 py-2.5 font-semibold border-r border-neutral-700 whitespace-nowrap">SECTION</th>
                  <th className="px-3 py-2.5 font-semibold border-r border-neutral-700 whitespace-nowrap">DESIGNATION</th>
                  <th className="px-3 py-2.5 font-semibold text-center border-r border-neutral-700 whitespace-nowrap">ATTENDANCE</th>
                  <th className="px-3 py-2.5 font-semibold border-r border-neutral-700 whitespace-nowrap">OFFICE START</th>
                  <th className="px-3 py-2.5 font-semibold border-r border-neutral-700 whitespace-nowrap">IN TIME</th>
                  <th className="px-3 py-2.5 font-semibold border-r border-neutral-700 whitespace-nowrap">OUT TIME</th>
                  <th className="px-3 py-2.5 font-semibold border-r border-neutral-700 whitespace-nowrap">WORK HOUR</th>
                  <th className="px-3 py-2.5 font-semibold border-r border-neutral-700 whitespace-nowrap">LATE</th>
                  <th className="px-3 py-2.5 font-semibold border-r border-neutral-700 whitespace-nowrap">EARLY LEAVE</th>
                  <th className="px-3 py-2.5 font-semibold whitespace-nowrap">OT</th>
                </tr>
              </thead>
              <tbody>
                {ATTENDANCE_REGISTER_DATA.map((row) => (
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
                    <td className="px-3 py-2 text-center font-bold text-red-600 border-r border-gray-200 dark:border-neutral-800">
                      {row.attendance}
                    </td>
                    <td className="px-3 py-2 border-r border-gray-200 dark:border-neutral-800 whitespace-nowrap">{row.officeStart}</td>
                    <td className="px-3 py-2 border-r border-gray-200 dark:border-neutral-800">{row.inTime}</td>
                    <td className="px-3 py-2 border-r border-gray-200 dark:border-neutral-800">{row.outTime}</td>
                    <td className="px-3 py-2 border-r border-gray-200 dark:border-neutral-800">{row.workHour}</td>
                    <td className="px-3 py-2 border-r border-gray-200 dark:border-neutral-800">{row.late}</td>
                    <td className="px-3 py-2 border-r border-gray-200 dark:border-neutral-800">{row.earlyLeave}</td>
                    <td className="px-3 py-2">{row.ot}</td>
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