"use client";

// Path: app/flat-land/plot-distribution-report/page.tsx
// Dependencies: next, react, tailwindcss, lucide-react

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  CalendarDays,
  FileSpreadsheet,
  FileText,
  X,
} from "lucide-react";

/* ----------------------------- Types & data ----------------------------- */

interface PlotRow {
  id: number;
  customerCode: string;
  customerName: string;
  bookingDate: string; // ISO: YYYY-MM-DD
  referenceName: string;
  blockName: string;
  roadNo: string;
  roadSize: string;
  plotNo: string;
  plotLocation: string;
  landArea: number;
  landValue: number;
  bookingMoney: number;
  downPayment: number | null;
  modeOfPayment: string;
  installments: string;
  // filter-only fields
  salesBy: string;
  project: string;
  type: string;
}

type ColumnKey = Exclude<keyof PlotRow, "salesBy" | "project" | "type">;

interface Column {
  key: ColumnKey;
  label: string;
  width?: string;
}

const COLUMNS: Column[] = [
  { key: "id", label: "ID", width: "w-12" },
  { key: "customerCode", label: "Customer Code" },
  { key: "customerName", label: "Customer Name" },
  { key: "bookingDate", label: "Booking Date" },
  { key: "referenceName", label: "Reference Name" },
  { key: "blockName", label: "Block Name" },
  { key: "roadNo", label: "Road No" },
  { key: "roadSize", label: "Road Size" },
  { key: "plotNo", label: "Plot No" },
  { key: "plotLocation", label: "Plot Location" },
  { key: "landArea", label: "Land Area" },
  { key: "landValue", label: "Land Value" },
  { key: "bookingMoney", label: "Booking Money" },
  { key: "downPayment", label: "Down Payment" },
  { key: "modeOfPayment", label: "Mode of Payment" },
  { key: "installments", label: "No. of Installment" },
];

// TODO: replace with your API / server action
const DATA: PlotRow[] = [
  {
    id: 1,
    customerCode: "CUS7515110",
    customerName: "Sagor kumar",
    bookingDate: "2026-09-03",
    referenceName: "",
    blockName: "B",
    roadNo: "3/A",
    roadSize: "",
    plotNo: "2",
    plotLocation: "",
    landArea: 8,
    landValue: 0,
    bookingMoney: 500000,
    downPayment: null,
    modeOfPayment: "At a time",
    installments: "At a time",
    salesBy: "",
    project: "Riverview",
    type: "Booking",
  },
  {
    id: 2,
    customerCode: "CUS7515110",
    customerName: "Sagor kumar",
    bookingDate: "2026-09-02",
    referenceName: "",
    blockName: "A",
    roadNo: "2/A",
    roadSize: "",
    plotNo: "56",
    plotLocation: "Hasnabad, Riverview",
    landArea: 5,
    landValue: 0,
    bookingMoney: 500000,
    downPayment: null,
    modeOfPayment: "At a time",
    installments: "At a time",
    salesBy: "",
    project: "Riverview",
    type: "Booking",
  },
];

const PAGE_SIZES = [10, 25, 50, 100];
const TYPE_OPTIONS = ["Booking", "Sold", "Cancelled"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

/* -------------------------------- Helpers ------------------------------- */

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d} ${MONTHS[Number(m) - 1]} ${y}`;
}

function cellText(row: PlotRow, key: ColumnKey): string {
  const v = row[key];
  if (v === null || v === undefined) return "";
  if (key === "bookingDate") return formatDate(String(v));
  return String(v);
}

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

/* ------------------------------ Small parts ----------------------------- */

const inputBase =
  "h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#7367f0] focus:ring-2 focus:ring-[#7367f0]/20";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <label className="text-[11px] font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
  placeholder = "Select value",
  clearable = false,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  clearable?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} appearance-none pr-14 ${value ? "" : "text-slate-500"}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-2 text-slate-500">
        <ChevronDown size={14} />
      </div>
      {clearable && value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear"
          className="absolute inset-y-0 right-8 flex items-center text-slate-400 hover:text-slate-700"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}

/* --------------------------------- Page --------------------------------- */

export default function PlotDistributionReportPage() {
  const [dateFrom, setDateFrom] = useState("2026-09-01");
  const [dateTo, setDateTo] = useState("2026-09-30");
  const [salesBy, setSalesBy] = useState("");
  const [project, setProject] = useState("");
  const [type, setType] = useState("Booking");

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ key: ColumnKey; dir: "asc" | "desc" } | null>({ key: "id", dir: "asc" });

  const salesByOptions = useMemo(() => Array.from(new Set(DATA.map((r) => r.salesBy).filter(Boolean))), []);
  const projectOptions = useMemo(() => Array.from(new Set(DATA.map((r) => r.project).filter(Boolean))), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = DATA.filter((r) => {
      if (dateFrom && r.bookingDate < dateFrom) return false;
      if (dateTo && r.bookingDate > dateTo) return false;
      if (salesBy && r.salesBy !== salesBy) return false;
      if (project && r.project !== project) return false;
      if (type && r.type !== type) return false;
      if (q && !COLUMNS.some((c) => cellText(r, c.key).toLowerCase().includes(q))) return false;
      return true;
    });

    if (sort) {
      const { key, dir } = sort;
      rows.sort((a, b) => {
        const av = a[key] ?? "";
        const bv = b[key] ?? "";
        const res =
          typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av).localeCompare(String(bv), undefined, { numeric: true });
        return dir === "asc" ? res : -res;
      });
    }
    return rows;
  }, [dateFrom, dateTo, salesBy, project, type, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  const withReset = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  const toggleSort = (key: ColumnKey) =>
    setSort((s) => (s?.key === key ? (s.dir === "asc" ? { key, dir: "desc" } : null) : { key, dir: "asc" }));

  // Excel: CSV download (swap with a real .xlsx export, e.g. SheetJS, if needed)
  const exportExcel = () => {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const header = COLUMNS.map((c) => esc(c.label)).join(",");
    const body = filtered.map((r) => COLUMNS.map((c) => esc(cellText(r, c.key))).join(",")).join("\n");
    const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plot-distribution-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => window.print();

  return (
    <main className="min-h-screen bg-[#f7f7f9]">
      <section className="bg-white px-4 pb-6 pt-4 shadow-sm">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-[13px]">
          <Link href="/" className="text-[#7367f0] hover:underline">
            Home
          </Link>
          <ChevronRight size={14} className="text-slate-500" />
          <button type="button" className="flex items-center gap-1 text-[#7367f0] hover:underline">
            Flat/Land <ChevronDown size={13} />
          </button>
          <ChevronRight size={14} className="text-slate-500" />
          <span className="text-slate-700">Plot Distribution Report</span>
        </nav>

        {/* Filters */}
        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
          <Field label="Select Date">
            <div className="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-700 focus-within:border-[#7367f0] focus-within:ring-2 focus-within:ring-[#7367f0]/20">
              <CalendarDays size={14} className="shrink-0 text-slate-400" />
              <input
                type="date"
                value={dateFrom}
                max={dateTo || undefined}
                onChange={(e) => withReset(setDateFrom)(e.target.value)}
                className="w-full min-w-0 bg-transparent outline-none"
                aria-label="From date"
              />
              <span className="text-slate-400">–</span>
              <input
                type="date"
                value={dateTo}
                min={dateFrom || undefined}
                onChange={(e) => withReset(setDateTo)(e.target.value)}
                className="w-full min-w-0 bg-transparent outline-none"
                aria-label="To date"
              />
            </div>
          </Field>

          <Field label="Sales By">
            <SelectField value={salesBy} onChange={withReset(setSalesBy)} options={salesByOptions} />
          </Field>

          <Field label="Project">
            <SelectField value={project} onChange={withReset(setProject)} options={projectOptions} />
          </Field>

          <Field label="Type">
            <SelectField value={type} onChange={withReset(setType)} options={TYPE_OPTIONS} clearable />
          </Field>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={exportExcel}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-emerald-500 px-3.5 text-xs font-semibold text-white transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
            >
              <FileSpreadsheet size={14} /> Excel
            </button>
            <button
              type="button"
              onClick={exportPdf}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-red-500 px-3.5 text-xs font-semibold text-white transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
            >
              <FileText size={14} /> PDF
            </button>
          </div>
        </div>

        {/* Table controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[13px] text-slate-700">
          <label className="flex items-center gap-2">
            Show
            <span className="relative">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="h-8 appearance-none rounded-md border border-slate-200 bg-white pl-2.5 pr-7 text-[13px] outline-none focus:border-[#7367f0]"
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500" />
            </span>
            entries
          </label>

          <label className="flex items-center gap-2">
            Search:
            <input
              type="search"
              value={search}
              onChange={(e) => withReset(setSearch)(e.target.value)}
              className="h-8 w-44 rounded-md border border-slate-200 bg-white px-2.5 text-[13px] outline-none focus:border-[#7367f0] focus:ring-2 focus:ring-[#7367f0]/20 sm:w-56"
            />
          </label>
        </div>

        {/* Table */}
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[1500px] border-collapse text-left text-[13px] text-slate-700">
            <thead>
              <tr className="bg-[#7367f0] text-white">
                {COLUMNS.map((c) => {
                  const active = sort?.key === c.key;
                  return (
                    <th
                      key={c.key}
                      scope="col"
                      aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : "none"}
                      className={`whitespace-nowrap px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide ${c.width ?? ""}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(c.key)}
                        className="flex w-full items-center justify-between gap-2 uppercase"
                      >
                        {c.label}
                        {active ? (
                          sort!.dir === "asc" ? (
                            <ChevronUp size={12} />
                          ) : (
                            <ChevronDown size={12} />
                          )
                        ) : (
                          <ChevronsUpDown size={12} className="opacity-50" />
                        )}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="border-b border-slate-200 px-2.5 py-8 text-center text-slate-500">
                    No matching records found
                  </td>
                </tr>
              ) : (
                pageRows.map((r) => (
                  <tr key={r.id} className="border-b border-slate-200 transition hover:bg-slate-50">
                    {COLUMNS.map((c) => (
                      <td key={c.key} className="whitespace-nowrap px-2.5 py-1.5">
                        {c.key === "plotNo" ? (
                          <Link href={`/flat-land/plots/${r.plotNo}`} className="text-[#7367f0] hover:underline">
                            {r.plotNo}
                          </Link>
                        ) : (
                          cellText(r, c.key)
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">
            {filtered.length === 0
              ? "Showing 0 to 0 of 0 entries"
              : `Showing ${start + 1} to ${start + pageRows.length} of ${filtered.length} entries`}
          </p>

          <div className="flex items-center gap-1.5 text-[13px]">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              className="h-8 rounded-md bg-slate-100 px-3 text-slate-500 transition enabled:hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Previous
            </button>
            {getPageNumbers(currentPage, totalPages).map((p, i) =>
              p === "…" ? (
                <span key={`gap-${i}`} className="px-1 text-slate-400">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  aria-current={p === currentPage ? "page" : undefined}
                  className={`h-8 min-w-8 rounded-md px-2.5 font-medium transition ${
                    p === currentPage ? "bg-[#7367f0] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
              className="h-8 rounded-md bg-slate-100 px-3 text-slate-500 transition enabled:hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}