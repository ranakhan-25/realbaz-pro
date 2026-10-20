/* eslint-disable prettier/prettier */
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, Search, CheckCircle2 } from "lucide-react";

import { crApi } from "@/lib/crApi";

const flatLandMenu = ["Flat/Land", "Flat/Land Sale", "Flat/Land Sale Payment"];

const salesByOptions = ["Tazmul Reza", "Rifat Hosain", "Mohin Uddin"];

const teamOptions = ["Gladiators", "Team Warriors", "Go", "Diponkar Team"];

const projectOptions = [
  "Head Office",
  "Lake Garden",
  "Estern 19",
  "Sheba Eyecon Tower",
  "Hena Heights",
  "Rifat Eyecon City",
];

const datePresets = [
  "Today",
  "Yesterday",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Last Month",
  "Custom Range",
];

/* ── Reusable Searchable Select ── */
function SearchableSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select value",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [query, options]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref}>
      <label className="block text-[12px] text-ink-muted mb-1">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setOpen(!open);
            setQuery("");
          }}
          className="w-full flex items-center justify-between border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
        >
          <span className={value ? "text-ink" : "text-ink-faint"}>{value || placeholder}</span>
          <ChevronDown className="w-4 h-4 text-ink-faint shrink-0" />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-md shadow-lg shadow-black/6 z-50 overflow-hidden">
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-faint" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  autoFocus
                  className="w-full pl-8 pr-2.5 py-1.5 border border-border rounded-md text-[13px] bg-canvas text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-2 text-[13px] text-ink-faint">No results</p>
              ) : (
                filtered.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`w-full text-left px-3 py-2 text-[13px] hover:bg-canvas ${
                      value === opt ? "bg-canvas text-ink font-medium" : "text-ink-muted"
                    }`}
                  >
                    {opt}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Date Range Picker ── */
function DateRangePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [activePreset, setActivePreset] = useState("This Month");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
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

  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    if (preset === "Custom Range") return;

    const now = new Date();
    let from = new Date();
    let to = new Date();

    switch (preset) {
      case "Today":
        from = to = now;
        break;
      case "Yesterday":
        from = to = new Date(now.getTime() - 86400000);
        break;
      case "Last 7 Days":
        from = new Date(now.getTime() - 6 * 86400000);
        break;
      case "Last 30 Days":
        from = new Date(now.getTime() - 29 * 86400000);
        break;
      case "This Month":
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "Last Month":
        from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        to = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
    }

    const fmt = (d: Date) =>
      d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    onChange(`${fmt(from)} - ${fmt(to)}`);
    setOpen(false);
  };

  const applyCustom = () => {
    if (fromDate && toDate) {
      onChange(`${fromDate} - ${toDate}`);
      setActivePreset("Custom Range");
      setOpen(false);
    }
  };

  return (
    <div ref={ref}>
      <label className="block text-[12px] text-ink-muted mb-1">Select Date</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between border border-border rounded-md px-3 py-2 text-[13px] bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black text-left"
        >
          <span className={value ? "text-ink" : "text-ink-faint"}>
            {value || "Select date range"}
          </span>
          <ChevronDown className="w-4 h-4 text-ink-faint shrink-0" />
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-lg shadow-black/6 z-50 flex overflow-hidden min-w-[420px]">
            <div className="w-40 border-r border-border py-2 shrink-0">
              {datePresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`w-full text-left px-3 py-1.5 text-[13px] ${
                    activePreset === preset
                      ? "bg-black text-white font-medium"
                      : "text-sky-600 hover:bg-canvas"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <div className="flex-1 p-3 min-w-[240px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1">
                  <label className="block text-[11px] text-ink-muted mb-1">FROM</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setActivePreset("Custom Range");
                    }}
                    className="w-full border border-border rounded-md px-2 py-1.5 text-[13px] bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] text-ink-muted mb-1">TO</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setActivePreset("Custom Range");
                    }}
                    className="w-full border border-border rounded-md px-2 py-1.5 text-[13px] bg-canvas text-ink focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={applyCustom}
                  className="px-4 py-1.5 rounded-md bg-emerald-500 text-white text-[13px] font-medium hover:bg-emerald-600"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-1.5 rounded-md border border-border text-[13px] text-ink-muted hover:bg-canvas"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InstallmentReportPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [salesBy, setSalesBy] = useState("");
  const [team, setTeam] = useState("");
  const [project, setProject] = useState("");
  const [dateRange, setDateRange] = useState("1 September, 2026 - 30 September, 2026");

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const agreements = await crApi.getAgreements();
        if (!mounted) return;
        const transformed: any[] = [];
        agreements.forEach((ag: any, idx: number) => {
          if (Array.isArray(ag.schedule) && ag.schedule.length > 0) {
            ag.schedule.forEach((inst: any) => {
              transformed.push({
                id: `${ag.agreement_no || ag.id}-${inst.installment_no}`,
                project: ag.project_name || "Head Office",
                flatLand: ag.unit_no || "Unit",
                customer: ag.customer_name || "Customer",
                totalValue: Number(ag.agreed_price || 0).toLocaleString(),
                paid: Number(ag.total_paid || 0).toLocaleString(),
                due: Number(ag.outstanding_balance || 0).toLocaleString(),
                installmentDate: inst.due_date ? String(inst.due_date).slice(0, 10) : "N/A",
                installmentAmount: Number(inst.due_amount || 0).toLocaleString(),
                recovered: Number(inst.paid_amount || 0).toLocaleString(),
                installmentDue: (Number(inst.due_amount || 0) - Number(inst.paid_amount || 0)).toLocaleString(),
                salesBy: ag.sales_person_name || "Sales Rep",
              });
            });
          } else {
            transformed.push({
              id: ag.agreement_no || `#${ag.id || idx + 1}`,
              project: ag.project_name || "Head Office",
              flatLand: ag.unit_no || "Unit",
              customer: ag.customer_name || "Customer",
              totalValue: Number(ag.agreed_price || 0).toLocaleString(),
              paid: Number(ag.total_paid || 0).toLocaleString(),
              due: Number(ag.outstanding_balance || 0).toLocaleString(),
              installmentDate: ag.created_at ? String(ag.created_at).slice(0, 10) : "N/A",
              installmentAmount: Number(ag.agreed_price || 0).toLocaleString(),
              recovered: Number(ag.total_paid || 0).toLocaleString(),
              installmentDue: Number(ag.outstanding_balance || 0).toLocaleString(),
              salesBy: ag.sales_person_name || "Sales Rep",
            });
          }
        });
        setRows(transformed);
      } catch (err) {
        console.error("Failed to load installment report:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchSearch =
        !q ||
        r.customer.toLowerCase().includes(q) ||
        r.project.toLowerCase().includes(q) ||
        r.flatLand.toLowerCase().includes(q) ||
        String(r.id).includes(q);
      const matchProject = !project || r.project === project;
      return matchSearch && matchProject;
    });
  }, [rows, search, project]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / entries));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * entries;
  const pageRows = filtered.slice(start, start + entries);
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(start + entries, total);

  const goPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border px-5 py-2.5">
        <div className="flex items-center gap-1 text-[13px]">
          <span className="text-ink-muted hover:text-ink cursor-pointer">Home</span>
          <span className="text-ink-faint mx-1">›</span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-1 text-ink-muted font-medium hover:text-ink"
            >
              Flat/Land
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showMenu && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-surface border border-border rounded-md shadow-lg shadow-black/6 z-50 py-1">
                {flatLandMenu.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setShowMenu(false)}
                    className="w-full text-left px-4 py-2 text-[13px] text-ink-muted hover:bg-canvas hover:text-ink"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-ink-faint mx-1">›</span>
          <span className="text-ink font-medium">Installment Report</span>
        </div>
      </div>

      <div className="p-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <DateRangePicker value={dateRange} onChange={setDateRange} />

          <SearchableSelect
            label="Sales By"
            value={salesBy}
            onChange={(v) => {
              setSalesBy(v);
              setPage(1);
            }}
            options={salesByOptions}
          />

          <SearchableSelect
            label="Team"
            value={team}
            onChange={(v) => {
              setTeam(v);
              setPage(1);
            }}
            options={teamOptions}
          />

          <SearchableSelect
            label="Project"
            value={project}
            onChange={(v) => {
              setProject(v);
              setPage(1);
            }}
            options={projectOptions}
          />
        </div>

        {/* Show + Search */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-[13px] text-ink-muted">
            <span>Show</span>
            <select
              value={entries}
              onChange={(e) => {
                setEntries(Number(e.target.value));
                setPage(1);
              }}
              className="border border-border rounded px-2 py-1 text-[13px] bg-surface text-ink"
            >
              {[5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px]">
            <span className="text-ink-muted">Search:</span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-border rounded px-2 py-1 text-[13px] w-40 bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface rounded-lg border border-border shadow-sm shadow-black/6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="bg-black text-white">
                  {[
                    "ID",
                    "PROJECT",
                    "FLAT/LAND",
                    "CUSTOMER NAME",
                    "TOTAL VALUE",
                    "PAID",
                    "DUE",
                    "INSTALLMENT DATE",
                    "INSTALLMENT AMOUNT",
                    "RECOVERED",
                    "INSTALLMENT DUE",
                    "SALES BY",
                    "ACTION",
                  ].map((h) => (
                    <th key={h} className="px-2.5 py-2.5 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={13} className="px-2.5 py-10 text-center text-ink-muted">
                      <div className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        <span>Loading live installment report...</span>
                      </div>
                    </td>
                  </tr>
                ) : pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-2.5 py-10 text-center text-ink-faint">
                      No records found
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-canvas/70">
                      <td className="px-2.5 py-2.5 text-ink-muted">{row.id}</td>
                      <td className="px-2.5 py-2.5 text-ink whitespace-nowrap">{row.project}</td>
                      <td className="px-2.5 py-2.5 text-ink">{row.flatLand}</td>
                      <td className="px-2.5 py-2.5 text-ink">{row.customer}</td>
                      <td className="px-2.5 py-2.5 tabular-nums text-ink">{row.totalValue}</td>
                      <td className="px-2.5 py-2.5 tabular-nums text-ink">{row.paid}</td>
                      <td className="px-2.5 py-2.5 tabular-nums text-ink">{row.due}</td>
                      <td className="px-2.5 py-2.5 text-ink whitespace-nowrap">
                        {row.installmentDate}
                      </td>
                      <td className="px-2.5 py-2.5 tabular-nums text-ink">
                        {row.installmentAmount}
                      </td>
                      <td className="px-2.5 py-2.5 tabular-nums text-ink">{row.recovered}</td>
                      <td className="px-2.5 py-2.5 tabular-nums text-ink">{row.installmentDue}</td>
                      <td className="px-2.5 py-2.5 text-ink-faint">{row.salesBy}</td>
                      <td className="px-2.5 py-2.5">
                        <button
                          type="button"
                          className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center hover:bg-slate-800"
                          title="Approve"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 border-t border-border text-[13px] text-ink-muted">
            <span>
              Showing {from} to {to} of {total} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => goPage(currentPage - 1)}
                className="px-2.5 py-1 rounded border border-border hover:bg-canvas disabled:opacity-40 disabled:cursor-not-allowed text-ink"
              >
                Previous
              </button>
              <button
                type="button"
                className="min-w-[32px] px-2 py-1 rounded font-medium bg-black text-white"
              >
                {currentPage}
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => goPage(currentPage + 1)}
                className="px-2.5 py-1 rounded border border-border hover:bg-canvas disabled:opacity-40 disabled:cursor-not-allowed text-ink"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
