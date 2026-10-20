/* eslint-disable prettier/prettier */
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

const monthOptions = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const yearOptions = [
  "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031"
];

const employeeOptions = [
  { id: "ST7208257", name: "Tazmul Reza" },
  { id: "ST0923878", name: "Rifat Hosain" },
  { id: "ST1121188", name: "Mohin Uddin" },
];

type Staff = (typeof employeeOptions)[number];

type SimpleSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
};

type StaffSelectProps = {
  label: string;
  selectedStaff: Staff | null;
  onSelect: (staff: Staff | null) => void;
};

const generateJobCardData = () => {
  const days = [];
  const totalDays = 29;
  
  for (let i = 1; i <= totalDays; i++) {
    const dayStr = i < 10 ? `0${i}` : `${i}`;
    let status = "Absent";
    if (i === 2 || i === 9 || i === 16 || i === 23) {
      status = "Weekend";
    }
    
    days.push({
      sl: i,
      date: `${dayStr}-Feb-2024`,
      inTime: "-",
      outTime: "-",
      late: "0.00",
      status: status,
      ot: "0.00",
      sl_val: "0.00",
      tw: "0.00",
    });
  }
  return days;
};

const JOB_CARD_DATA = generateJobCardData();

function SimpleSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select One Option",
}: SimpleSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !(e.target instanceof Node && ref.current.contains(e.target))) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="w-full">
      <label className="block text-[12px] text-gray-700 dark:text-gray-300 mb-1 font-medium">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between border rounded px-3 py-1.5 text-[13px] bg-white dark:bg-black text-gray-900 dark:text-gray-100 border-gray-300 dark:border-neutral-800 focus:outline-none ${
            open ? "border-black dark:border-neutral-600 ring-1 ring-black dark:ring-neutral-600" : ""
          }`}
        >
          <span className={value ? "text-gray-900 dark:text-white font-medium" : "text-gray-400 dark:text-gray-500"}>
            {value || placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-black border border-gray-300 dark:border-neutral-800 rounded shadow-lg dark:shadow-2xl z-50 overflow-hidden">
            <div className="px-3 py-2 bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 text-[12px] font-medium border-b border-gray-200 dark:border-neutral-800">
              {placeholder}
            </div>
            <div className="max-h-56 overflow-y-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {options.map((opt, idx) => (
                <button
                  key={`${opt}-${idx}`}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-100 dark:hover:bg-neutral-900 ${
                    value === opt ? "bg-black text-white dark:bg-neutral-800 font-semibold" : "text-gray-800 dark:text-gray-300"
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

function StaffSelect({
  label,
  selectedStaff,
  onSelect,
}: StaffSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !(e.target instanceof Node && ref.current.contains(e.target))) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="w-full">
      <label className="block text-[12px] text-gray-700 dark:text-gray-300 mb-1 font-medium">
        {label}
      </label>
      <div className="relative">
        <div
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between border rounded px-3 py-1.5 text-[13px] bg-white dark:bg-black text-gray-900 dark:text-gray-100 border-gray-300 dark:border-neutral-800 cursor-pointer ${
            open ? "ring-1 ring-black dark:ring-neutral-700" : ""
          }`}
        >
          <span className="font-medium text-gray-900 dark:text-gray-200">
            {selectedStaff ? `${selectedStaff.name} [${selectedStaff.id}]` : "Select Staff/Employee"}
          </span>
          <div className="flex items-center gap-1 text-gray-400">
            {selectedStaff && (
              <X
                className="w-3.5 h-3.5 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(null);
                }}
              />
            )}
            <ChevronDown className="w-4 h-4 shrink-0" />
          </div>
        </div>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-black border border-gray-300 dark:border-neutral-800 rounded shadow-lg dark:shadow-2xl z-50 p-2 space-y-2">
            <input
              type="text"
              className="w-full border border-gray-300 dark:border-neutral-800 bg-white dark:bg-black text-gray-900 dark:text-gray-200 rounded px-3 py-1 text-[13px] focus:outline-none"
              placeholder=""
              onClick={(e) => e.stopPropagation()}
            />
            <div className="max-h-48 overflow-y-auto space-y-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {employeeOptions.map((emp) => {
                const isSelected = selectedStaff?.id === emp.id;
                return (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => {
                      onSelect(emp);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-[13px] rounded ${
                      isSelected
                        ? "bg-black text-white dark:bg-neutral-800 font-medium"
                        : "hover:bg-gray-100 dark:hover:bg-neutral-900 text-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {emp.name} [{emp.id}]
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function JobCardPage() {
  const [month, setMonth] = useState("February");
  const [year, setYear] = useState("2024");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>({
    id: "ST0923878",
    name: "Rifat Hosain",
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-200 font-sans">
      {/* Breadcrumb Header */}
      <div className="px-5 py-2.5 text-[12px] text-gray-600 dark:text-gray-400 bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-900">
        <span className="hover:text-black dark:hover:text-white cursor-pointer">Home</span>
        <span className="mx-1">›</span>
        <span className="hover:text-black dark:hover:text-white cursor-pointer">HRM</span>
        <span className="mx-1">›</span>
        <span className="text-black dark:text-white font-medium">Job Card</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SimpleSelect
            label="Month"
            value={month}
            onChange={setMonth}
            options={monthOptions}
          />
          <SimpleSelect
            label="Year"
            value={year}
            onChange={setYear}
            options={yearOptions}
          />
          <StaffSelect
            label="Select Staff/Employee"
            selectedStaff={selectedStaff}
            onSelect={setSelectedStaff}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[12px] font-medium rounded shadow-sm"
          >
            PDF
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-medium rounded shadow-sm"
          >
            Excel
          </button>
        </div>

        {/* Staff Profile Summary Header */}
        <div className="flex justify-between items-start text-[12px] text-gray-900 dark:text-gray-300 pt-2">
          <div className="space-y-1">
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Code No :</span> 03</p>
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Card No :</span> {selectedStaff?.id || "N/A"}</p>
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Department :</span> Engineering</p>
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Shift :</span> Friday OFF</p>
          </div>
          <div className="space-y-1 text-right">
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Name :</span> {selectedStaff?.name || "N/A"}</p>
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Designation :</span> Software Engineer</p>
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Join Date :</span> 01-Feb-26</p>
          </div>
        </div>

        {/* Main Job Card Table (Scrollbar Hidden) */}
        <div className="bg-white dark:bg-black rounded border border-gray-300 dark:border-neutral-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-black text-white dark:bg-neutral-900 font-medium uppercase text-[10px] tracking-wider border-b border-gray-300 dark:border-neutral-800">
                  <th className="px-3 py-2 text-center border-r border-gray-800 dark:border-neutral-800 w-12">SL.</th>
                  <th className="px-4 py-2 border-r border-gray-800 dark:border-neutral-800">DATE</th>
                  <th className="px-4 py-2 text-center border-r border-gray-800 dark:border-neutral-800">IN TIME</th>
                  <th className="px-4 py-2 text-center border-r border-gray-800 dark:border-neutral-800">OUT TIME</th>
                  <th className="px-4 py-2 text-center border-r border-gray-800 dark:border-neutral-800">LATE</th>
                  <th className="px-4 py-2 text-center border-r border-gray-800 dark:border-neutral-800">STATUS</th>
                  <th className="px-4 py-2 text-center border-r border-gray-800 dark:border-neutral-800">OT</th>
                  <th className="px-4 py-2 text-center border-r border-gray-800 dark:border-neutral-800">SL</th>
                  <th className="px-4 py-2 text-center">TW</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-900">
                {JOB_CARD_DATA.map((row) => (
                  <tr
                    key={row.sl}
                    className="hover:bg-gray-50 dark:hover:bg-neutral-900/60 text-gray-900 dark:text-gray-300"
                  >
                    <td className="px-3 py-1.5 text-center text-gray-600 dark:text-gray-500 border-r border-gray-200 dark:border-neutral-900">{row.sl}</td>
                    <td className="px-4 py-1.5 border-r border-gray-200 dark:border-neutral-900 whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-1.5 text-center border-r border-gray-200 dark:border-neutral-900">{row.inTime}</td>
                    <td className="px-4 py-1.5 text-center border-r border-gray-200 dark:border-neutral-900">{row.outTime}</td>
                    <td className="px-4 py-1.5 text-center border-r border-gray-200 dark:border-neutral-900">{row.late}</td>
                    <td className="px-4 py-1.5 text-center border-r border-gray-200 dark:border-neutral-900">{row.status}</td>
                    <td className="px-4 py-1.5 text-center border-r border-gray-200 dark:border-neutral-900">{row.ot}</td>
                    <td className="px-4 py-1.5 text-center border-r border-gray-200 dark:border-neutral-900">{row.sl_val}</td>
                    <td className="px-4 py-1.5 text-center">{row.tw}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-gray-900 dark:text-gray-300 pt-1">
          <div className="space-y-1">
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Present :</span> 0</p>
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Leave Day :</span> 0</p>
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Total Holiday :</span> 0</p>
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Total Early Leave :</span> 0.00</p>
          </div>

          <div className="space-y-1">
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Absent :</span> 25</p>
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Late Day :</span> 0</p>
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Late time :</span> 0.00</p>
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Paid Leave :</span> 0</p>
          </div>

          <div className="space-y-1 text-right">
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Weekend Day :</span> 4</p>
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Total OT HR :</span> 0.00</p>
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Total Work HR :</span> 0.00</p>
            <p><span className="font-semibold text-gray-700 dark:text-gray-400">Leave Without Pay (LWP) :</span> 0</p>
          </div>
        </div>
      </div>
    </div>
  );
}