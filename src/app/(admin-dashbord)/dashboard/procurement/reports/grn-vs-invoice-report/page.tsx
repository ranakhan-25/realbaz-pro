"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  FileText,
  ListFilter,
  Search,
  Calendar,
} from "lucide-react";

interface GrnItemRow {
  id: number;
  date: string;
  poNo: string;
  grnNo: string;
  billNo: string;
  supplierName: string;
  itemName: string;
  grnQty: number;
  alreadyBillQty: number;
  grnTotal: number;
  billTotal: number;
}

const initialRows: GrnItemRow[] = [
  {
    id: 1,
    date: "2026-09-07",
    poNo: "PUR1782229",
    grnNo: "GRN7501856",
    billNo: "",
    supplierName: "Mohin Business solution__",
    itemName: "Sand (FM 2.50)",
    grnQty: 5,
    alreadyBillQty: 0,
    grnTotal: 255,
    billTotal: 0,
  },
  {
    id: 2,
    date: "2026-09-08",
    poNo: "PUR4141481",
    grnNo: "PUR4141481",
    billNo: "",
    supplierName: "Safety First Suppliers__",
    itemName: "10mm Rod",
    grnQty: 100,
    alreadyBillQty: 0,
    grnTotal: 8200,
    billTotal: 0,
  },
  {
    id: 3,
    date: "2026-09-08",
    poNo: "PUR4141481",
    grnNo: "PUR4141481",
    billNo: "",
    supplierName: "Safety First Suppliers__",
    itemName: "16mm Rod",
    grnQty: 100,
    alreadyBillQty: 0,
    grnTotal: 8200,
    billTotal: 0,
  },
  {
    id: 4,
    date: "2026-09-08",
    poNo: "PUR4141481",
    grnNo: "PUR4141481",
    billNo: "",
    supplierName: "Safety First Suppliers__",
    itemName: "Cement (OPC/ CEM -I)",
    grnQty: 100,
    alreadyBillQty: 0,
    grnTotal: 48100,
    billTotal: 0,
  },
  {
    id: 5,
    date: "2026-09-08",
    poNo: "PUR4141481",
    grnNo: "PUR4141481",
    billNo: "",
    supplierName: "Safety First Suppliers__",
    itemName: "Sand (FM 2.50)",
    grnQty: 500,
    alreadyBillQty: 0,
    grnTotal: 46250,
    billTotal: 0,
  },
  {
    id: 6,
    date: "2026-09-07",
    poNo: "PUR8777873",
    grnNo: "PUR8777873",
    billNo: "",
    supplierName: "Mohin Business solution__",
    itemName: "10mm Rod",
    grnQty: 50,
    alreadyBillQty: 0,
    grnTotal: 4100,
    billTotal: 0,
  },
  {
    id: 7,
    date: "2026-09-07",
    poNo: "PUR8777873",
    grnNo: "PUR8777873",
    billNo: "",
    supplierName: "Mohin Business solution__",
    itemName: "Cement (OPC/ CEM -I)",
    grnQty: 50,
    alreadyBillQty: 0,
    grnTotal: 24050,
    billTotal: 0,
  },
  {
    id: 8,
    date: "2026-09-07",
    poNo: "PUR8777873",
    grnNo: "PUR8777873",
    billNo: "",
    supplierName: "Mohin Business solution__",
    itemName: "Main Door Frame",
    grnQty: 20,
    alreadyBillQty: 0,
    grnTotal: 70000,
    billTotal: 0,
  },
  {
    id: 9,
    date: "2026-09-08",
    poNo: "PUR8777874",
    grnNo: "PUR8777874",
    billNo: "",
    supplierName: "Mohin Business solution__",
    itemName: "Bamboo",
    grnQty: 1000,
    alreadyBillQty: 0,
    grnTotal: 450000,
    billTotal: 0,
  },
  {
    id: 10,
    date: "2026-09-07",
    poNo: "PUR7987200",
    grnNo: "PUR7987200",
    billNo: "",
    supplierName: "Delta Glass & Aluminium__",
    itemName: "Cement (PCC/ CEM -II)",
    grnQty: 500,
    alreadyBillQty: 0,
    grnTotal: 250000,
    billTotal: 0,
  },
  {
    id: 11,
    date: "2026-09-09",
    poNo: "PUR7987201",
    grnNo: "PUR7987201",
    billNo: "",
    supplierName: "Delta Glass & Aluminium__",
    itemName: "Aluminium Sheet",
    grnQty: 100,
    alreadyBillQty: 0,
    grnTotal: 50000,
    billTotal: 0,
  },
];

interface ColumnDef {
  key: keyof GrnItemRow;
  label: string;
  width: string;
  align?: "left" | "right" | "center";
}

const columns: ColumnDef[] = [
  { key: "id", label: "ID", width: "lg:w-[4%]", align: "center" },
  { key: "date", label: "DATE", width: "lg:w-[8%]", align: "left" },
  { key: "poNo", label: "PO NO", width: "lg:w-[10%]", align: "left" },
  { key: "grnNo", label: "GRN NO", width: "lg:w-[10%]", align: "left" },
  { key: "billNo", label: "BILL NO", width: "lg:w-[7%]", align: "left" },
  { key: "supplierName", label: "SUPPLIER NAME", width: "lg:w-[17%]", align: "left" },
  { key: "itemName", label: "ITEM NAME", width: "lg:w-[16%]", align: "left" },
  { key: "grnQty", label: "GRN QTY", width: "lg:w-[7%]", align: "right" },
  { key: "alreadyBillQty", label: "ALREADY BILL QTY", width: "lg:w-[8%]", align: "right" },
  { key: "grnTotal", label: "GRN TOTAL", width: "lg:w-[7.5%]", align: "right" },
  { key: "billTotal", label: "BILL TOTAL", width: "lg:w-[5.5%]", align: "right" },
];

const numberFormat = new Intl.NumberFormat("en-US");

const AssetPurchaseBillCreate = () => {
  const [rows] = useState<GrnItemRow[]>(initialRows);
  const [search, setSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(true);

  // Dynamic filter lists
  const suppliers = useMemo(() => Array.from(new Set(rows.map((r) => r.supplierName))), [rows]);
  const items = useMemo(() => Array.from(new Set(rows.map((r) => r.itemName))), [rows]);

  // Combined Filtering & Sorting
  const filteredRows = useMemo(() => {
    let result = [...rows];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((r) =>
        [r.poNo, r.grnNo, r.billNo, r.supplierName, r.itemName, r.id.toString()].some((field) =>
          field.toLowerCase().includes(q)
        )
      );
    }

    if (selectedSupplier) {
      result = result.filter((r) => r.supplierName === selectedSupplier);
    }

    if (selectedItem) {
      result = result.filter((r) => r.itemName === selectedItem);
    }

    result.sort((a, b) => (sortAsc ? a.id - b.id : b.id - a.id));

    return result;
  }, [search, selectedSupplier, selectedItem, sortAsc, rows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / entriesPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * entriesPerPage;
  const visibleRows = filteredRows.slice(startIdx, startIdx + entriesPerPage);

  const totals = useMemo(() => {
    return filteredRows.reduce(
      (acc, r) => ({
        grnQty: acc.grnQty + r.grnQty,
        alreadyBillQty: acc.alreadyBillQty + r.alreadyBillQty,
        grnTotal: acc.grnTotal + r.grnTotal,
        billTotal: acc.billTotal + r.billTotal,
      }),
      { grnQty: 0, alreadyBillQty: 0, grnTotal: 0, billTotal: 0 }
    );
  }, [filteredRows]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="flex-1 px-4 sm:px-6 py-6 space-y-5">
        
        {/* Filter Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Date Picker Input */}
            <div>
              <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Select Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value="1 Sep, 2026 - 30 Sep, 2026"
                  className="w-full pl-9 pr-3 py-2 text-[13px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* GRN Dropdown */}
            <div>
              <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                GRN(s)
              </label>
              <div className="relative">
                <select className="w-full appearance-none pl-3 pr-8 py-2 text-[13px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer">
                  <option value="">All Invoices / GRNs</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Category
              </label>
              <div className="relative">
                <select className="w-full appearance-none pl-3 pr-8 py-2 text-[13px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer">
                  <option value="">Select Category</option>
                  <option value="raw">Raw Materials</option>
                  <option value="hardware">Hardware & Fittings</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Item Dropdown */}
            <div>
              <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Select Item
              </label>
              <div className="relative">
                <select
                  value={selectedItem}
                  onChange={(e) => {
                    setSelectedItem(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none pl-3 pr-8 py-2 text-[13px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="">All Items</option>
                  {items.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Supplier Dropdown */}
            <div>
              <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Supplier
              </label>
              <div className="relative">
                <select
                  value={selectedSupplier}
                  onChange={(e) => {
                    setSelectedSupplier(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none pl-3 pr-8 py-2 text-[13px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="">All Suppliers</option>
                  {suppliers.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/__$/, "")}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Project Select */}
            <div>
              <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Select Project<span className="text-rose-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <select className="w-full appearance-none pl-3 pr-8 py-2 text-[13px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer">
                  <option value="">Select Project</option>
                  <option value="p1">Project Alpha</option>
                  <option value="p2">Project Commercial Tower</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 sm:col-span-2 lg:col-span-2 lg:justify-end">
              <button
                type="button"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm active:scale-[0.98] transition-all"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Excel
              </button>
              <button
                type="button"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 shadow-sm active:scale-[0.98] transition-all"
              >
                <FileText className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Main Table Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
          
          {/* Table Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-[13px] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
              <div className="relative w-full sm:w-60">
                <input
                  type="text"
                  placeholder="Search GRN, PO, Supplier..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-[13px] text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
              </div>
            </div>
          </div>

          {/* Responsive Table (Fit to screen on lg, scrollable on mobile) */}
          <div className="overflow-x-auto lg:overflow-x-visible">
            <table className="w-full text-left border-collapse min-w-[1050px] lg:min-w-full lg:table-fixed">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold tracking-wider">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-2.5 py-3 ${col.width} ${
                        col.align === "right"
                          ? "text-right"
                          : col.align === "center"
                          ? "text-center"
                          : "text-left"
                      }`}
                    >
                      {col.key === "id" ? (
                        <button
                          type="button"
                          onClick={() => setSortAsc(!sortAsc)}
                          className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          ID
                          {sortAsc ? (
                            <ChevronUp className="w-3 h-3 text-indigo-600 dark:hover:text-indigo-400" />
                          ) : (
                            <ChevronDown className="w-3 h-3 text-indigo-600 dark:hover:text-indigo-400" />
                          )}
                        </button>
                      ) : (
                        col.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-[12.5px]">
                {visibleRows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors"
                  >
                    <td className="px-2.5 py-2.5 text-center font-medium text-slate-400 dark:text-slate-500">
                      {row.id}
                    </td>
                    <td className="px-2.5 py-2.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="px-2.5 py-2.5 font-medium text-slate-700 dark:text-slate-200 truncate" title={row.poNo}>
                      {row.poNo}
                    </td>
                    <td className="px-2.5 py-2.5 font-medium text-slate-700 dark:text-slate-200 truncate" title={row.grnNo}>
                      {row.grnNo}
                    </td>
                    <td className="px-2.5 py-2.5 whitespace-nowrap">
                      {row.billNo ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium border border-emerald-200 dark:border-emerald-800">
                          {row.billNo}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-2.5 py-2.5 text-slate-700 dark:text-slate-300 truncate" title={row.supplierName}>
                      {row.supplierName.replace(/__$/, "")}
                    </td>
                    <td className="px-2.5 py-2.5 font-medium text-slate-800 dark:text-slate-100 truncate" title={row.itemName}>
                      {row.itemName}
                    </td>
                    <td className="px-2.5 py-2.5 text-right font-medium text-slate-700 dark:text-slate-300">
                      {numberFormat.format(row.grnQty)}
                    </td>
                    <td className="px-2.5 py-2.5 text-right text-slate-500 dark:text-slate-400">
                      {numberFormat.format(row.alreadyBillQty)}
                    </td>
                    <td className="px-2.5 py-2.5 text-right font-semibold text-slate-800 dark:text-slate-100">
                      {numberFormat.format(row.grnTotal)}
                    </td>
                    <td className="px-2.5 py-2.5 text-right text-slate-600 dark:text-slate-400">
                      {numberFormat.format(row.billTotal)}
                    </td>
                  </tr>
                ))}

                {visibleRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-3 py-14 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <ListFilter className="w-5 h-5 text-slate-400" />
                        </div>
                        <p className="text-[13px] font-medium text-slate-600 dark:text-slate-300">
                          No matching records found
                        </p>
                        <p className="text-[12px] text-slate-400 dark:text-slate-500">
                          Try adjusting your search query or filter options.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>

              {visibleRows.length > 0 && (
                <tfoot>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-100 text-[12.5px]">
                    <td className="px-2.5 py-3 text-right" colSpan={7}>
                      Summary Total:
                    </td>
                    <td className="px-2.5 py-3 text-right text-indigo-600 dark:text-indigo-400">
                      {numberFormat.format(totals.grnQty)}
                    </td>
                    <td className="px-2.5 py-3 text-right">
                      {numberFormat.format(totals.alreadyBillQty)}
                    </td>
                    <td className="px-2.5 py-3 text-right text-indigo-600 dark:text-indigo-400">
                      {numberFormat.format(totals.grnTotal)}
                    </td>
                    <td className="px-2.5 py-3 text-right">
                      {numberFormat.format(totals.billTotal)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-[12px] text-slate-500 dark:text-slate-400">
              Showing {filteredRows.length === 0 ? 0 : startIdx + 1} to{" "}
              {startIdx + visibleRows.length} of {filteredRows.length} entries
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg text-[12.5px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-[12.5px] font-medium transition-colors ${
                      page === safePage
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="px-3 py-1.5 rounded-lg text-[12.5px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="flex flex-wrap items-center justify-between gap-2 px-6 py-3.5 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 text-[12px] text-slate-500 dark:text-slate-400">
        <span>2026 © Somikoron IT LTD</span>
        <span>Design &amp; Developed by Somikoron IT LTD</span>
      </footer>
    </div>
  );
};

export default AssetPurchaseBillCreate;