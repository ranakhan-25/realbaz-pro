/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Loader2,
  Download,
  ChevronDown,
  User,
  IdCard,
} from "lucide-react";

// ---------- Types ----------
export interface EmployeeCard {
  uuid: string;
  name: string;
  designationName: string;
  employeeCode: string;
  nid: string;
  email: string;
  phone: string;
  image: string;
  departmentId: string;
  designationId: string;
  status: string;
}

interface OptionItem {
  uuid: string;
  name: string;
  code?: string;
}

// ---------- API helpers ----------
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

// ---------- Department dropdown ----------
async function fetchDepartments(): Promise<OptionItem[]> {
  try {
    const url = `${API_BASE}/realbizpro/api/v1/department?page=1&limit=100&status=active&sortOrder=DESC&withDeleted=false`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return [];
    const list = json?.data?.data || [];
    return list.map((d: any) => ({
      uuid: d.uuid,
      name: d.name || "Unnamed",
    }));
  } catch (err) {
    console.error("fetchDepartments error →", err);
    return [];
  }
}

// ---------- Designation dropdown ----------
async function fetchDesignations(): Promise<OptionItem[]> {
  try {
    const url = `${API_BASE}/realbizpro/api/v1/designation?page=1&limit=100&status=active&sortOrder=DESC&withDeleted=false`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return [];
    const list = json?.data?.data || [];
    return list.map((d: any) => ({
      uuid: d.uuid,
      name: d.name || "Unnamed",
    }));
  } catch (err) {
    console.error("fetchDesignations error →", err);
    return [];
  }
}

// ---------- Employee cards (filtered) ----------
// ⚠️ /employee-card endpoint ONLY accepts departmentId + designationId
//    Do NOT send: status, withDeleted, page, limit
async function fetchEmployeeCards(
  departmentId: string,
  designationId: string,
): Promise<EmployeeCard[]> {
  const params = new URLSearchParams();
  if (departmentId) params.set("departmentId", departmentId);
  if (designationId) params.set("designationId", designationId);

  const url = `${API_BASE}/realbizpro/api/v1/employee-card?${params.toString()}`;
  console.log("GET employee-card →", url);
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const json = await handleRes(res, "fetch employee cards");
  console.log("GET employee-card response →", json);

  const list = json?.data?.data || [];
  return list.map((item: any) => ({
    uuid: item.uuid,
    name: item.name || "",
    designationName:
      typeof item.designation === "string"
        ? item.designation
        : item.designation?.name || "",
    employeeCode: item.employeeCode || "",
    nid: item.nid || "",
    email: item.email || "",
    phone: item.phone || "",
    image: item.image || "",
    departmentId: item.departmentId || "",
    designationId: item.designationId || "",
    status: item.status || "active",
  }));
}

// ---------- Searchable Select ----------
function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select value",
}: {
  options: OptionItem[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.uuid === value);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return options.filter((o) => o.name.toLowerCase().includes(q));
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
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-left text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none flex items-center justify-between"
      >
        <span className={selected ? "text-slate-800" : "text-slate-400"}>
          {selected ? selected.name : placeholder}
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
                  {opt.name}
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
export default function EmployeeCardGeneratePage() {
  const [departments, setDepartments] = useState<OptionItem[]>([]);
  const [designations, setDesignations] = useState<OptionItem[]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [designationId, setDesignationId] = useState("");

  const [cards, setCards] = useState<EmployeeCard[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Load filters on mount
  useEffect(() => {
    (async () => {
      try {
        setLoadingFilters(true);
        const [deps, desigs] = await Promise.all([
          fetchDepartments(),
          fetchDesignations(),
        ]);
        setDepartments(deps);
        setDesignations(desigs);
      } catch (err: any) {
        setError(err?.message || "Failed to load filters");
      } finally {
        setLoadingFilters(false);
      }
    })();
  }, []);

  // Auto-fetch cards when any filter changes
  useEffect(() => {
    if (!departmentId && !designationId) {
      setCards([]);
      setHasSearched(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setLoadingCards(true);
        setError(null);
        const list = await fetchEmployeeCards(departmentId, designationId);
        if (cancelled) return;
        setCards(list);
        setHasSearched(true);
      } catch (err: any) {
        if (cancelled) return;
        console.error(err);
        setError(err?.message || "Failed to load employee cards");
        setCards([]);
      } finally {
        if (!cancelled) setLoadingCards(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [departmentId, designationId]);

  const readyToDownload =
    cards.length > 0 && !loadingCards && !loadingFilters;

  // ---------- PDF download (via print window) ----------
  const handleDownloadPdf = () => {
    if (cards.length === 0) {
      alert("No employee cards to download. Please select filters first.");
      return;
    }

    const deptName =
      departments.find((d) => d.uuid === departmentId)?.name || "";
    const desigName =
      designations.find((d) => d.uuid === designationId)?.name || "";

    const cardsHtml = cards
      .map(
        (c) => `
      <div class="card">
        <div class="card-header">
          <div class="company">Company Name</div>
          <div class="code">${c.employeeCode || ""}</div>
        </div>
        <div class="card-body">
          <div class="photo">
            ${
              c.image
                ? `<img src="${API_BASE}${c.image}" alt="${c.name}" onerror="this.style.display='none'"/>`
                : `<div class="photo-placeholder">${(
                    c.name || "?"
                  ).charAt(0)}</div>`
            }
          </div>
          <div class="info">
            <div class="name">${c.name || ""}</div>
            <div class="desig">${c.designationName || ""}</div>
            <div class="row"><span class="label">ID:</span> ${c.employeeCode || ""}</div>
            <div class="row"><span class="label">NID:</span> ${c.nid || ""}</div>
            <div class="row"><span class="label">Phone:</span> ${c.phone || ""}</div>
            <div class="row"><span class="label">Email:</span> ${c.email || ""}</div>
          </div>
        </div>
        <div class="card-footer">
          ${deptName ? `<span>${deptName}</span>` : ""}
          ${desigName ? `<span>${desigName}</span>` : ""}
        </div>
      </div>
    `,
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Employee ID Cards</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; background: #fff; padding: 12px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
            .card { border: 1px solid #333; border-radius: 8px; overflow: hidden; background: #fff; page-break-inside: avoid; }
            .card-header { background: #4f46e5; color: #fff; padding: 6px 10px; display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; }
            .card-body { display: flex; gap: 10px; padding: 10px; }
            .photo { width: 80px; height: 100px; flex-shrink: 0; border: 1px solid #ccc; border-radius: 4px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #f1f5f9; }
            .photo img { width: 100%; height: 100%; object-fit: cover; }
            .photo-placeholder { font-size: 32px; font-weight: bold; color: #94a3b8; }
            .info { flex: 1; min-width: 0; }
            .name { font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 2px; }
            .desig { font-size: 11px; color: #4f46e5; margin-bottom: 6px; }
            .row { font-size: 10px; color: #334155; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .label { color: #64748b; font-weight: bold; }
            .card-footer { background: #f1f5f9; padding: 4px 10px; font-size: 9px; color: #475569; display: flex; justify-content: space-between; }
            @media print { body { padding: 0; } .grid { gap: 8px; } }
          </style>
        </head>
        <body>
          <div class="grid">${cardsHtml}</div>
          <script>
            window.onload = () => {
              setTimeout(() => { window.print(); }, 300);
            };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
    } else {
      alert("Please allow pop-ups to download the PDF.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 p-4 sm:p-6">
      <div className="space-y-5">
        {/* Breadcrumb */}
        <div className="pb-3 border-b border-slate-100">
          <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
            <span>Home</span> / <span>Employee</span> /{" "}
            <span className="text-indigo-600 font-medium">Card Generate</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Employee Card Generate
          </h1>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Department <span className="text-rose-500">*</span>
            </label>
            <SearchableSelect
              options={departments}
              value={departmentId}
              onChange={setDepartmentId}
              placeholder="Select Department"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Designation <span className="text-rose-500">*</span>
            </label>
            <SearchableSelect
              options={designations}
              value={designationId}
              onChange={setDesignationId}
              placeholder="Select Designation"
            />
          </div>
        </div>

        {/* Download PDF Button */}
        <div className="flex justify-end">
          <button
            onClick={handleDownloadPdf}
            disabled={!readyToDownload}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-md shadow-sm transition-colors"
          >
            {loadingCards ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download PDF
          </button>
        </div>

        {/* Loading / Error */}
        {loadingFilters && (
          <div className="flex items-center justify-center py-16 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading filters...
          </div>
        )}

        {loadingCards && (
          <div className="flex items-center justify-center py-16 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading employee cards...
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Card Preview Grid */}
        {!loadingFilters && !loadingCards && cards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {cards.map((c) => (
              <div
                key={c.uuid}
                className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm"
              >
                <div className="bg-indigo-600 text-white px-3 py-1.5 flex items-center justify-between text-xs font-bold">
                  <span>Company Name</span>
                  <span>{c.employeeCode}</span>
                </div>

                <div className="flex gap-3 p-3">
                  <div className="w-20 h-24 flex-shrink-0 border border-slate-200 rounded bg-slate-50 flex items-center justify-center overflow-hidden">
                    {c.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`${API_BASE}${c.image}`}
                        alt={c.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <span className="text-3xl font-bold text-slate-300">
                        {(c.name || "?").charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {c.name || "—"}
                    </div>
                    <div className="text-xs text-indigo-600 font-medium mb-2 truncate">
                      {c.designationName || "—"}
                    </div>
                    <div className="text-[11px] text-slate-700 space-y-0.5">
                      <div className="truncate">
                        <span className="text-slate-400 font-semibold">
                          ID:
                        </span>{" "}
                        {c.employeeCode || "—"}
                      </div>
                      <div className="truncate">
                        <span className="text-slate-400 font-semibold">
                          NID:
                        </span>{" "}
                        {c.nid || "—"}
                      </div>
                      <div className="truncate">
                        <span className="text-slate-400 font-semibold">
                          Phone:
                        </span>{" "}
                        {c.phone || "—"}
                      </div>
                      <div className="truncate">
                        <span className="text-slate-400 font-semibold">
                          Email:
                        </span>{" "}
                        {c.email || "—"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100 px-3 py-1 flex items-center justify-between text-[10px] text-slate-600">
                  <span>
                    {departments.find((d) => d.uuid === c.departmentId)
                      ?.name || ""}
                  </span>
                  <span>
                    {designations.find((d) => d.uuid === c.designationId)
                      ?.name || ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state after search */}
        {!loadingFilters &&
          !loadingCards &&
          hasSearched &&
          cards.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <IdCard className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm font-medium">No employee cards found</p>
              <p className="text-xs mt-1">
                Try a different Department or Designation
              </p>
            </div>
          )}

        {/* Initial empty state */}
        {!loadingFilters &&
          !loadingCards &&
          !hasSearched &&
          cards.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <User className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm font-medium">
                Select a Department or Designation to load cards
              </p>
            </div>
          )}
      </div>
    </div>
  );
}