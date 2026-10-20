"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowLeftRight,
  Plus,
  ChevronUp,
  FileText,
  SquarePen,
  ShoppingCart,
  ClipboardList,
  RefreshCw,
  Trash2,
  Check,
  X,
  Search,
} from "lucide-react";

// ==========================================
// Types & Interfaces
// ==========================================
export interface ApprovalStep {
  label: string;
}

export interface RequisitionRow {
  id: number;
  projectType: string;
  project: string;
  titleOfWork: string;
  code: string;
  ref: string;
  date: string;
  demandDate: string;
  addedBy: string;
  approvalSteps: ApprovalStep[];
}

type RowActionKey =
  | "view"
  | "edit"
  | "convertToPurchase"
  | "convertToPurchaseOrder"
  | "convertToRfq"
  | "delete";

// ==========================================
// Mock Data & Configurations
// ==========================================
const initialRows: RequisitionRow[] = [
  {
    id: 1,
    projectType: "Real Estate",
    project: "Hena Heights",
    titleOfWork: "",
    code: "taz00017",
    ref: "",
    date: "08 Sept 2026",
    demandDate: "08 Sept 2026",
    addedBy: "Admin",
    approvalSteps: [{ label: "All Approvals Completed" }],
  },
  {
    id: 2,
    projectType: "Office",
    project: "Rifat Eyecon City",
    titleOfWork: "",
    code: "taz00016",
    ref: "",
    date: "08 Sept 2026",
    demandDate: "08 Sept 2026",
    addedBy: "Admin",
    approvalSteps: [{ label: "All Approvals Completed" }],
  },
  {
    id: 3,
    projectType: "Office",
    project: "Rifat Eyecon City",
    titleOfWork: "",
    code: "taz00015",
    ref: "",
    date: "08 Sept 2026",
    demandDate: "08 Sept 2026",
    addedBy: "Tazmul Reza",
    approvalSteps: [
      { label: "All Approvals Completed" },
      { label: "Rifat Hosain" },
      { label: "Admin" },
    ],
  },
  {
    id: 4,
    projectType: "Real Estate",
    project: "Lake Garden",
    titleOfWork: "",
    code: "taz00014",
    ref: "",
    date: "05 Sept 2026",
    demandDate: "06 Sept 2026",
    addedBy: "Admin",
    approvalSteps: [{ label: "All Approvals Completed" }],
  },
];

const actionButtons = [
  {
    label: "Multiple PO Convert",
    color:
      "bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-500",
  },
  {
    label: "Multiple RFQ Convert",
    color:
      "bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-500",
  },
  {
    label: "Multiple Purchase Convert",
    color:
      "bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-500",
  },
];

const tableHeaders = [
  "ID",
  "SELECT",
  "PROJECT TYPE",
  "PROJECT",
  "TITLE/NAME OF WORK",
  "CODE",
  "DATE",
  "DEMAND DATE",
  "ADDED BY",
  "APPROVAL LAYER",
  "ACTION",
];

const lgColumnWidths: Record<string, string> = {
  ID: "lg:w-[4%]",
  SELECT: "lg:w-[6%]",
  "PROJECT TYPE": "lg:w-[9%]",
  PROJECT: "lg:w-[11%]",
  "TITLE/NAME OF WORK": "lg:w-[11%]",
  CODE: "lg:w-[10%]",
  DATE: "lg:w-[8%]",
  "DEMAND DATE": "lg:w-[9%]",
  "ADDED BY": "lg:w-[9%]",
  "APPROVAL LAYER": "lg:w-[13%]",
  ACTION: "lg:w-[10%]",
};

const editableFields: { key: keyof RequisitionRow; placeholder?: string }[] = [
  { key: "projectType" },
  { key: "project" },
  { key: "titleOfWork", placeholder: "—" },
  { key: "code" },
  { key: "date" },
  { key: "demandDate" },
  { key: "addedBy" },
];

const rowActionMenu: {
  key: RowActionKey;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    key: "view",
    label: "View",
    icon: FileText,
    color:
      "bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500",
  },
  {
    key: "edit",
    label: "Edit",
    icon: SquarePen,
    color:
      "bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500",
  },
  {
    key: "convertToPurchase",
    label: "Convert To Purchase",
    icon: ShoppingCart,
    color:
      "bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500",
  },
  {
    key: "convertToPurchaseOrder",
    label: "Convert To Purchase Order",
    icon: ClipboardList,
    color:
      "bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500",
  },
  {
    key: "convertToRfq",
    label: "Convert To RFQ",
    icon: RefreshCw,
    color:
      "bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500",
  },
  {
    key: "delete",
    label: "Delete",
    icon: Trash2,
    color: "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500",
  },
];

// ==========================================
// Sub-components
// ==========================================

// 1. Page Header Component
const PageHeader = () => (
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-200 dark:shadow-indigo-950/50">
        <ClipboardList className="w-5 h-5 text-white" />
      </div>
      <div>
        <h1 className="text-[19px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          Material Requisition List
        </h1>
        <nav className="flex items-center gap-1.5 text-[12.5px] text-slate-400 dark:text-slate-500">
          <Link
            href="/"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <button className="flex items-center gap-0.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Requisition
            <ChevronDown className="w-3 h-3" />
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-500 dark:text-slate-400">List</span>
        </nav>
      </div>
    </div>

    <div className="flex flex-wrap gap-2">
      {actionButtons.map((btn) => (
        <button
          key={btn.label}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white shadow-sm transition-colors ${btn.color}`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          {btn.label}
        </button>
      ))}
      <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-sm shadow-indigo-200 dark:shadow-none transition-colors">
        <Plus className="w-3.5 h-3.5" />
        New Material Requisition
      </button>
    </div>
  </div>
);

// 2. Filter Panel Component
const FilterPanel = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 transition-colors duration-200">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-[13px] text-slate-500 dark:text-slate-400 mb-1.5">
          Select Date
        </label>
        <input
          type="text"
          readOnly
          value="1 September, 2026 - 30 September, 2026"
          className="w-full px-3.5 py-2.5 text-[13px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/40"
        />
      </div>

      <div>
        <label className="block text-[13px] text-slate-500 dark:text-slate-400 mb-1.5">
          Company
        </label>
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] text-slate-700 dark:text-slate-200">
          <span>Somikoron IT Ltd</span>
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <button
              aria-label="Clear company"
              className="hover:text-slate-600 dark:hover:text-slate-300"
            >
              ✕
            </button>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[13px] text-slate-500 dark:text-slate-400 mb-1.5">
          Supplier
        </label>
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] text-slate-400 dark:text-slate-500">
          <span>Select an option</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      <div>
        <label className="block text-[13px] text-slate-500 dark:text-slate-400 mb-1.5">
          Project
        </label>
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] text-slate-400 dark:text-slate-500">
          <span>Select value</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      <div>
        <label className="block text-[13px] text-slate-500 dark:text-slate-400 mb-1.5">
          Title/Name of Work
        </label>
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] text-slate-400 dark:text-slate-500">
          <span>Select Title/Name of Work</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  </div>
);

// 3. Table Controls Component
interface TableControlsProps {
  entriesPerPage: number;
  setEntriesPerPage: (val: number) => void;
  search: string;
  setSearch: (val: string) => void;
  selectedCount: number;
}

const TableControls = ({
  entriesPerPage,
  setEntriesPerPage,
  search,
  setSearch,
  selectedCount,
}: TableControlsProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
    <div className="flex items-center gap-3 text-[13px] text-slate-500 dark:text-slate-400">
      <div className="flex items-center gap-2">
        <span>Show</span>
        <select
          value={entriesPerPage}
          onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-[13px] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/40"
        >
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span>entries</span>
      </div>

      {selectedCount > 0 && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
          {selectedCount} selected
        </span>
      )}
    </div>

    <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
      <span>Search:</span>
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter records..."
          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-[13px] text-slate-700 dark:text-slate-200 w-48 sm:w-60 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/40"
        />
      </div>
    </div>
  </div>
);

// 4. Requisition Table Row Component (Handles Click Outside for Action Dropdown)
interface RequisitionTableRowProps {
  row: RequisitionRow;
  isEditing: boolean;
  isSelected: boolean;
  draftRow: RequisitionRow | null;
  openActionRow: number | null;
  setOpenActionRow: (id: number | null) => void;
  toggleSelectRow: (id: number) => void;
  updateDraftField: (key: keyof RequisitionRow, value: string) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  handleRowAction: (key: RowActionKey, row: RequisitionRow) => void;
  isLast: boolean;
}

const RequisitionTableRow = ({
  row,
  isEditing,
  isSelected,
  draftRow,
  openActionRow,
  setOpenActionRow,
  toggleSelectRow,
  updateDraftField,
  saveEdit,
  cancelEdit,
  handleRowAction,
  isLast,
}: RequisitionTableRowProps) => {
  const activeRow = isEditing && draftRow ? draftRow : row;
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Click Outside Handler for Action Menu Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        if (openActionRow === row.id) {
          setOpenActionRow(null);
        }
      }
    };

    if (openActionRow === row.id) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openActionRow, row.id, setOpenActionRow]);

  return (
    <tr
      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
        !isLast ? "border-b border-slate-100 dark:border-slate-800" : ""
      } ${isEditing ? "bg-indigo-50/40 dark:bg-indigo-950/30" : ""}`}
    >
      <td className="px-2.5 py-3 text-[13px] text-slate-600 dark:text-slate-400 align-top">
        {row.id}
      </td>
      <td className="px-2.5 py-3 align-top">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelectRow(row.id)}
          className="w-3.5 h-3.5 accent-indigo-600 dark:accent-indigo-500 rounded cursor-pointer"
        />
      </td>

      {editableFields.map(({ key, placeholder }) => (
        <td
          key={key}
          className="px-2.5 py-3 text-[13px] text-slate-700 dark:text-slate-300 align-top whitespace-nowrap lg:whitespace-normal lg:break-words"
        >
          {isEditing ? (
            <div className="space-y-1">
              <input
                type="text"
                value={activeRow[key] as string}
                onChange={(e) => updateDraftField(key, e.target.value)}
                className="w-full min-w-[100px] px-2 py-1 text-[13px] bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-md text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/40"
              />
              {key === "code" && (
                <input
                  type="text"
                  value={activeRow.ref}
                  onChange={(e) => updateDraftField("ref", e.target.value)}
                  placeholder="Ref"
                  className="w-full min-w-[100px] px-2 py-1 text-[12px] bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-md text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/40"
                />
              )}
            </div>
          ) : (
            <>
              {(row[key] as string) || placeholder || "—"}
              {key === "code" && row.ref && (
                <span className="block text-[11px] text-slate-400 dark:text-slate-500">
                  Ref: {row.ref}
                </span>
              )}
            </>
          )}
        </td>
      ))}

      <td className="px-2.5 py-3 text-[13px] align-top">
        <div className="flex flex-col gap-0.5">
          {row.approvalSteps.map((step) => (
            <span
              key={step.label}
              className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"
            >
              ✓ {step.label}
            </span>
          ))}
        </div>
      </td>

      <td className="px-2.5 py-3 align-top">
        {isEditing ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={saveEdit}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[12px] font-medium text-white bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[12px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          </div>
        ) : (
          <div className="relative" ref={actionMenuRef}>
            <button
              onClick={() =>
                setOpenActionRow(openActionRow === row.id ? null : row.id)
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-white bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
            >
              Action
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {openActionRow === row.id && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 p-1.5 space-y-1 z-20">
                {rowActionMenu.map(({ key, label, icon: Icon, color }) => (
                  <button
                    key={key}
                    onClick={() => handleRowAction(key, row)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12.5px] font-medium text-white transition-colors ${color}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};

// 5. Pagination Controls Component
interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalEntries: number;
  onPageChange: (page: number) => void;
}

const PaginationControls = ({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalEntries,
  onPageChange,
}: PaginationControlsProps) => {
  if (totalEntries === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-slate-100 dark:border-slate-800 text-[13px] text-slate-500 dark:text-slate-400">
      <div>
        Showing {startIndex + 1} to {endIndex} of {totalEntries} entries
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-lg text-[13px] font-medium transition-colors ${
              currentPage === page
                ? "bg-indigo-600 text-white dark:bg-indigo-600"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// 6. Footer Component
const PageFooter = () => (
  <footer className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-[12px] text-slate-500 dark:text-slate-400 transition-colors duration-200">
    <span>2026 © Somikoron IT LTD</span>
    <span>Design &amp; Developed by Somikoron IT LTD</span>
  </footer>
);

// ==========================================
// Main Component
// ==========================================
export default function MaterialRequisitionList() {
  const [rows, setRows] = useState<RequisitionRow[]>(initialRows);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [openActionRow, setOpenActionRow] = useState<number | null>(null);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [draftRow, setDraftRow] = useState<RequisitionRow | null>(null);

  // Search Filter logic
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.project, r.projectType, r.code, r.addedBy].some((field) =>
        field.toLowerCase().includes(q),
      ),
    );
  }, [search, rows]);

  // Reset page when search or entries per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, entriesPerPage]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredRows.length / entriesPerPage) || 1;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, filteredRows.length);
  const visibleRows = filteredRows.slice(startIndex, endIndex);

  const allVisibleSelected =
    visibleRows.length > 0 &&
    visibleRows.every((r) => selectedRows.includes(r.id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedRows((prev) =>
        prev.filter((id) => !visibleRows.some((r) => r.id === id)),
      );
    } else {
      setSelectedRows((prev) => [
        ...prev,
        ...visibleRows.map((r) => r.id).filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const toggleSelectRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const startEdit = (row: RequisitionRow) => {
    setDraftRow({ ...row });
    setEditingRowId(row.id);
    setOpenActionRow(null);
  };

  const cancelEdit = () => {
    setEditingRowId(null);
    setDraftRow(null);
  };

  const saveEdit = () => {
    if (!draftRow) return;
    setRows((prev) => prev.map((r) => (r.id === draftRow.id ? draftRow : r)));
    setEditingRowId(null);
    setDraftRow(null);
  };

  const updateDraftField = (key: keyof RequisitionRow, value: string) => {
    setDraftRow((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const deleteRow = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setSelectedRows((prev) => prev.filter((r) => r !== id));
    setOpenActionRow(null);
  };

  const handleRowAction = (key: RowActionKey, row: RequisitionRow) => {
    if (key === "edit") {
      startEdit(row);
      return;
    }
    if (key === "delete") {
      deleteRow(row.id);
      return;
    }
    setOpenActionRow(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 transition-colors duration-200">
      <div className="flex-1 px-4 sm:px-6 py-6 space-y-5">
        {/* Page Header */}
        <PageHeader />

        {/* Filter Section */}
        <FilterPanel />

        {/* Table Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
          {/* Table Controls */}
          <TableControls
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
            search={search}
            setSearch={setSearch}
            selectedCount={selectedRows.length}
          />

          {/* Table Body */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px] lg:min-w-0 lg:table-fixed">
              <thead>
                <tr className="bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                  {tableHeaders.map((header) => (
                    <th
                      key={header}
                      className={`px-2.5 py-3 text-[11px] font-semibold tracking-wide whitespace-nowrap lg:whitespace-normal ${lgColumnWidths[header]}`}
                    >
                      {header === "SELECT" ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={allVisibleSelected}
                            onChange={toggleSelectAll}
                            className="w-3.5 h-3.5 accent-indigo-600 dark:accent-indigo-500 rounded cursor-pointer"
                          />
                          {header}
                        </div>
                      ) : header === "ID" ? (
                        <div className="flex items-center gap-1">
                          {header}
                          <ChevronUp className="w-3 h-3" />
                        </div>
                      ) : (
                        header
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, idx) => (
                  <RequisitionTableRow
                    key={row.id}
                    row={row}
                    isEditing={editingRowId === row.id}
                    isSelected={selectedRows.includes(row.id)}
                    draftRow={draftRow}
                    openActionRow={openActionRow}
                    setOpenActionRow={setOpenActionRow}
                    toggleSelectRow={toggleSelectRow}
                    updateDraftField={updateDraftField}
                    saveEdit={saveEdit}
                    cancelEdit={cancelEdit}
                    handleRowAction={handleRowAction}
                    isLast={idx === visibleRows.length - 1}
                  />
                ))}

                {visibleRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={tableHeaders.length}
                      className="px-3 py-8 text-center text-[13px] text-slate-400 dark:text-slate-500"
                    >
                      No matching records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalEntries={filteredRows.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Footer */}
      <PageFooter />
    </div>
  );
}
