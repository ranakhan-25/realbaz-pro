/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Save, ChevronDown, Check } from "lucide-react";

// ---------- Types ----------
interface OptionItem {
  uuid: string;
  name: string;
  code?: string;
}

interface MonthYearItem {
  uuid: string;
  month: string;
  year: number;
}

interface ShiftItem {
  uuid: string;
  name: string;
  fromTime?: string;
  toTime?: string;
}

interface AttendanceRow {
  date: string; // YYYY-MM-DD
  day: string; // "Monday"
  shiftId: string;
  inTime: string; // "HH:mm"
  outTime: string; // "HH:mm"
  active: boolean;
  uuid?: string; // existing attendance uuid (for PATCH)
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const YEARS = Array.from({ length: 20 }, (_, i) => 2021 + i);

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ---------- Helpers ----------
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5002";

async function handleRes(res: Response, action: string) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      json?.message || json?.error || `Failed to ${action} (${res.status})`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return json;
}

// Convert "HH:mm:ss" → "HH:mm"
const toTimeInput = (t?: string) => {
  if (!t) return "";
  const parts = t.split(":");
  if (parts.length >= 2) return `${parts[0].padStart(2, "0")}:${parts[1]}`;
  return "";
};

// Get all days of a month as YYYY-MM-DD strings
const getMonthDays = (year: number, monthName: string): string[] => {
  const monthIdx = MONTHS.indexOf(monthName);
  if (monthIdx === -1) return [];
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const result: string[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(monthIdx + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    result.push(`${year}-${mm}-${dd}`);
  }
  return result;
};

const getDayName = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return DAY_NAMES[d.getDay()];
};

// ---------- API: Fetch helpers ----------
async function fetchEmployees(): Promise<OptionItem[]> {
  try {
    const url = `${API_BASE}/realbizpro/api/v1/employee-list?page=1&limit=100&status=active&sortBy=createdAt&sortOrder=DESC&withDeleted=false`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return [];
    const list = json?.data?.data || [];
    return list.map((e: any) => ({
      uuid: e.uuid,
      name: e.name || e.employeeCode || "Unnamed",
      code: e.employeeCode || e.code,
    }));
  } catch (err) {
    console.error("fetchEmployees error →", err);
    return [];
  }
}

async function fetchMonthYears(): Promise<MonthYearItem[]> {
  try {
    const url = `${API_BASE}/realbizpro/api/v1/month-year?page=1&limit=100&sortOrder=DESC&withDeleted=false`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return [];
    const list = json?.data?.data || [];
    return list.map((m: any) => ({
      uuid: m.uuid,
      month: m.month || "",
      year: Number(m.year) || new Date().getFullYear(),
    }));
  } catch (err) {
    console.error("fetchMonthYears error →", err);
    return [];
  }
}

async function fetchShifts(): Promise<ShiftItem[]> {
  try {
    const url = `${API_BASE}/realbizpro/api/v1/shift?page=1&limit=100&status=active&sortOrder=DESC&withDeleted=false`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return [];
    const list = json?.data?.data || [];
    return list.map((s: any) => {
      // Try to get first enabled schedule to auto-fill times
      const schedule = (s.schedules || []).find((sc: any) => sc.enabled);
      return {
        uuid: s.uuid,
        name: s.name || "Unnamed",
        fromTime: schedule?.fromTime,
        toTime: schedule?.toTime,
      };
    });
  } catch (err) {
    console.error("fetchShifts error →", err);
    return [];
  }
}

async function fetchAttendances(
  employeeId: string,
  monthYearId: string,
): Promise<any[]> {
  try {
    if (!employeeId || !monthYearId) return [];
    const url = `${API_BASE}/realbizpro/api/v1/attendance?employeeId=${employeeId}&monthYearId=${monthYearId}&page=1&limit=500&withDeleted=false`;
    console.log("GET attendances →", url);
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return [];
    return json?.data?.data || [];
  } catch (err) {
    console.error("fetchAttendances error →", err);
    return [];
  }
}

async function createAttendance(payload: Record<string, any>) {
  const res = await fetch(`${API_BASE}/realbizpro/api/v1/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleRes(res, "create attendance");
}

async function updateAttendance(uuid: string, payload: Record<string, any>) {
  const res = await fetch(
    `${API_BASE}/realbizpro/api/v1/attendance/${uuid}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  return handleRes(res, "update attendance");
}

// ---------- Searchable Select ----------
function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select value",
  allowAll = false,
  allLabel = "All Employees",
}: {
  options: OptionItem[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  allowAll?: boolean;
  allLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.uuid === value);
  const displayValue = selected
    ? selected.code
      ? `${selected.code} - ${selected.name}`
      : selected.name
    : allowAll && value === "ALL"
      ? allLabel
      : "";

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return options.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        (o.code || "").toLowerCase().includes(q),
    );
  }, [options, query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-left text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none flex items-center justify-between"
      >
        <span className={displayValue ? "text-slate-800" : "text-slate-400"}>
          {displayValue || placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {allowAll && (
              <button
                type="button"
                onClick={() => {
                  onChange("ALL");
                  setOpen(false);
                  setQuery("");
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  value === "ALL"
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {allLabel}
              </button>
            )}
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <button
                  key={opt.uuid}
                  type="button"
                  onClick={() => {
                    onChange(opt.uuid);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    value === opt.uuid
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt.code ? `${opt.code} - ${opt.name}` : opt.name}
                </button>
              ))
            ) : (
              <div className="px-3 py-3 text-xs text-slate-400 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Main Page ----------
export default function ShiftAllocationPage() {
  const [employees, setEmployees] = useState<OptionItem[]>([]);
  const [monthYears, setMonthYears] = useState<MonthYearItem[]>([]);
  const [shifts, setShifts] = useState<ShiftItem[]>([]);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("October");
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonthYearId, setSelectedMonthYearId] = useState("");

  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Load employees / month-years / shifts
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [empList, myList, shiftList] = await Promise.all([
          fetchEmployees(),
          fetchMonthYears(),
          fetchShifts(),
        ]);
        setEmployees(empList);
        setMonthYears(myList);
        setShifts(shiftList);

        // Default month/year from list if available
        if (myList.length > 0) {
          setSelectedMonth(myList[0].month);
          setSelectedYear(myList[0].year);
          setSelectedMonthYearId(myList[0].uuid);
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Find monthYearId when month/year changes
  useEffect(() => {
    const found = monthYears.find(
      (m) =>
        m.month.toLowerCase() === selectedMonth.toLowerCase() &&
        m.year === selectedYear,
    );
    setSelectedMonthYearId(found?.uuid || "");
  }, [selectedMonth, selectedYear, monthYears]);

  // Build rows whenever month/year/employee changes
  useEffect(() => {
    const dates = getMonthDays(selectedYear, selectedMonth);
    let cancelled = false;

    (async () => {
      let existing: any[] = [];
      if (selectedEmployee && selectedEmployee !== "ALL" && selectedMonthYearId) {
        existing = await fetchAttendances(
          selectedEmployee,
          selectedMonthYearId,
        );
      }
      if (cancelled) return;

      const built: AttendanceRow[] = dates.map((date) => {
        const day = getDayName(date);
        const found = existing.find((a) => (a.date || "").startsWith(date));
        return {
          date,
          day,
          shiftId: "",
          inTime: toTimeInput(found?.inTime),
          outTime: toTimeInput(found?.outTime),
          active: Boolean(found),
          uuid: found?.uuid,
        };
      });
      setRows(built);
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedMonth, selectedYear, selectedEmployee, selectedMonthYearId]);

  // Handle row changes
  const updateRow = (
    date: string,
    patch: Partial<AttendanceRow>,
  ) => {
    setRows((prev) =>
      prev.map((r) => (r.date === date ? { ...r, ...patch } : r)),
    );
  };

  // When shift changes, auto-fill inTime/outTime from shift defaults
  const handleShiftChange = (date: string, shiftId: string) => {
    const shift = shifts.find((s) => s.uuid === shiftId);
    updateRow(date, {
      shiftId,
      inTime: shift?.fromTime ? toTimeInput(shift.fromTime) : "",
      outTime: shift?.toTime ? toTimeInput(shift.toTime) : "",
    });
  };

  // Save handler
  const handleSave = async () => {
    if (!selectedEmployee || selectedEmployee === "ALL") {
      alert("Please select an Employee");
      return;
    }
    if (!selectedMonthYearId) {
      alert(
        `No Month-Year record found for ${selectedMonth} ${selectedYear}. Please create it first.`,
      );
      return;
    }

    const activeRows = rows.filter((r) => r.active);
    if (activeRows.length === 0) {
      alert("Please mark at least one day as Active");
      return;
    }

    try {
      setSaving(true);

      // Save each active row: POST if new, PATCH if exists
      for (const row of activeRows) {
        const payload = {
          employeeId: selectedEmployee,
          monthYearId: selectedMonthYearId,
          date: row.date,
          day: row.day,
          inTime: row.inTime ? `${row.inTime}:00` : "00:00:00",
          outTime: row.outTime ? `${row.outTime}:00` : "00:00:00",
          type: "workday",
        };
        if (row.uuid) {
          await updateAttendance(row.uuid, payload);
        } else {
          await createAttendance(payload);
        }
      }

      setToast(`Saved ${activeRows.length} attendance record(s)`);
      setTimeout(() => setToast(null), 2500);

      // Reload from server
      if (selectedEmployee && selectedMonthYearId) {
        const existing = await fetchAttendances(
          selectedEmployee,
          selectedMonthYearId,
        );
        setRows((prev) =>
          prev.map((r) => {
            const found = existing.find((a) =>
              (a.date || "").startsWith(r.date),
            );
            return {
              ...r,
              uuid: found?.uuid,
              inTime: found
                ? toTimeInput(found.inTime)
                : r.inTime,
              outTime: found
                ? toTimeInput(found.outTime)
                : r.outTime,
              active: Boolean(found) || r.active,
            };
          }),
        );
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="pb-3 border-b border-slate-200">
          <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
            <span>Home</span> / <span>Employee</span> /{" "}
            <span className="text-indigo-600 font-medium">
              Shift Allocation
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Shift Allocation
          </h1>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Employee
            </label>
            <SearchableSelect
              options={employees}
              value={selectedEmployee}
              onChange={setSelectedEmployee}
              placeholder="Select value"
              allowAll
              allLabel="All Employees"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="flex items-center justify-center py-16 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading...
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-indigo-500 text-white text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Day</th>
                    <th className="py-3 px-4 w-56">Shift</th>
                    <th className="py-3 px-4 w-40">From</th>
                    <th className="py-3 px-4 w-40">To</th>
                    <th className="py-3 px-4 w-24 text-center">Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.length > 0 ? (
                    rows.map((row) => (
                      <tr
                        key={row.date}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="py-2.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                          {row.date}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">
                          {row.day}
                        </td>
                        <td className="py-2.5 px-4">
                          <select
                            value={row.shiftId}
                            onChange={(e) =>
                              handleShiftChange(row.date, e.target.value)
                            }
                            className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          >
                            <option value="">Select</option>
                            {shifts.map((s) => (
                              <option key={s.uuid} value={s.uuid}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="time"
                            value={row.inTime}
                            onChange={(e) =>
                              updateRow(row.date, {
                                inTime: e.target.value,
                              })
                            }
                            className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="time"
                            value={row.outTime}
                            onChange={(e) =>
                              updateRow(row.date, {
                                outTime: e.target.value,
                              })
                            }
                            className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={row.active}
                            onChange={(e) =>
                              updateRow(row.date, {
                                active: e.target.checked,
                              })
                            }
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-10 text-slate-400 font-medium"
                      >
                        No dates available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Save Button */}
        {!loading && !error && rows.length > 0 && (
          <div className="flex justify-center pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-sm font-medium px-6 py-2 rounded-md shadow-sm transition-colors"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <Check className="w-4 h-4" />
          {toast}
        </div>
      )}
    </div>
  );
}