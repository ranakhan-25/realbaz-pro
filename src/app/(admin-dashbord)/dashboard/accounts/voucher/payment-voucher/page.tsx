"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  X,
  ArrowLeft,
  FileText,
  FileSpreadsheet,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  Copy,
  Mail,
  Printer,
  CheckCircle2,
} from "lucide-react";

interface PaymentVoucherRow {
  id: number;
  sl: number;
  date: string;
  project: string;
  titleOfWork: string;
  code: string;
  debit: string;
  credit: string;
  total: number;
  comment: string;
  chequeReceipt: string;
  addedBy: string;
  editedBy: string;
  approval: string[];
  attachment: number;
  status: string;
}

const initialPaymentVouchers: PaymentVoucherRow[] = [
  {
    id: 1,
    sl: 1,
    date: "07 Sept 2026",
    project: "Rifat Eyecon",
    titleOfWork: "Material Purchase",
    code: "P00004",
    debit: "Riva Steel Mils",
    credit: "Cash",
    total: 8000.0,
    comment: "Steel rod payment",
    chequeReceipt: "—",
    addedBy: "Admin",
    editedBy: "—",
    approval: ["Approved", "Admin"],
    attachment: 0,
    status: "Approved",
  },
  {
    id: 2,
    sl: 2,
    date: "08 Sept 2026",
    project: "Rifat Eyecon",
    titleOfWork: "Labor Bill",
    code: "P00003",
    debit: "Riva Steel Mils",
    credit: "Cash",
    total: 10000.0,
    comment: "Weekly labor bill",
    chequeReceipt: "—",
    addedBy: "Admin",
    editedBy: "—",
    approval: ["Approved", "Admin"],
    attachment: 0,
    status: "Approved",
  },
];

type ActionKey = "view" | "print" | "mail" | "edit" | "delete" | "duplicate";

const actionMenuItems: { key: ActionKey; label: string; icon: React.ElementType; color: string }[] = [
  { key: "view", label: "View Voucher", icon: Eye, color: "bg-indigo-500 hover:bg-indigo-600" },
  { key: "print", label: "Print Voucher", icon: Printer, color: "bg-violet-500 hover:bg-violet-600" },
  { key: "mail", label: "Send Mail", icon: Mail, color: "bg-cyan-500 hover:bg-cyan-600" },
  { key: "edit", label: "Edit Voucher", icon: Pencil, color: "bg-amber-500 hover:bg-amber-600" },
  { key: "delete", label: "Delete", icon: Trash2, color: "bg-red-500 hover:bg-red-600" },
  { key: "duplicate", label: "Duplicate", icon: Copy, color: "bg-teal-500 hover:bg-teal-600" },
];

export default function PaymentVoucherPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form States
  const [projectType, setProjectType] = useState("");
  const [project, setProject] = useState("");
  const [titleOfWork, setTitleOfWork] = useState("");
  const [ifTask, setIfTask] = useState("");
  const [site, setSite] = useState("");
  const [date, setDate] = useState("13/09/2026");
  const [voucherNo, setVoucherNo] = useState("P00005");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isCheque, setIsCheque] = useState(false);
  const [chequeNo, setChequeNo] = useState("");
  const [comment, setComment] = useState("");
  const [amount, setAmount] = useState("");
  const [selectInvoice, setSelectInvoice] = useState("");
  const [selectItem, setSelectItem] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  // Modal Form States
  const [modalGroup, setModalGroup] = useState("");
  const [modalCode, setModalCode] = useState("");
  const [modalName, setModalName] = useState("");
  const [modalDefaultModule, setModalDefaultModule] = useState("");

  // Table Data & Filter States
  const [vouchers, setVouchers] = useState<PaymentVoucherRow[]>(initialPaymentVouchers);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    dateRange: "1 Sept, 2026 - 30 Sept, 2026",
    debitAccount: "",
    creditAccount: "",
    project: "",
    titleOfWork: "",
    site: "",
    task: "",
  });

  // Action Dropdown State
  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const handleClose = () => setOpenActionId(null);
    window.addEventListener("resize", handleClose);
    window.addEventListener("scroll", handleClose, true);
    return () => {
      window.removeEventListener("resize", handleClose);
      window.removeEventListener("scroll", handleClose, true);
    };
  }, []);

  const toggleActionMenu = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.stopPropagation();
    if (openActionId === id) {
      setOpenActionId(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const menuWidth = 130;
      setDropdownPos({
        top: rect.bottom + window.scrollY + 2,
        left: Math.max(10, rect.right - menuWidth),
      });
      setOpenActionId(id);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount || !paymentMethod || !amount) {
      alert("Please fill in required fields (*)");
      return;
    }

    const newVoucher: PaymentVoucherRow = {
      id: Date.now(),
      sl: vouchers.length + 1,
      date,
      project: project || "Default Project",
      titleOfWork: titleOfWork || "General Work",
      code: voucherNo,
      debit: selectedAccount,
      credit: paymentMethod,
      total: parseFloat(amount) || 0,
      comment: comment || "—",
      chequeReceipt: chequeNo || "—",
      addedBy: "Admin",
      editedBy: "—",
      approval: ["Approved"],
      attachment: attachment ? 1 : 0,
      status: "Approved",
    };

    setVouchers((prev) => [newVoucher, ...prev]);
    alert("Payment Voucher Submitted Successfully!");
    setAmount("");
    setComment("");
    setChequeNo("");
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Account "${modalName}" Added Successfully!`);
    setIsModalOpen(false);
    setModalGroup("");
    setModalCode("");
    setModalName("");
    setModalDefaultModule("");
  };

  const handleAction = (key: ActionKey, row: PaymentVoucherRow) => {
    setOpenActionId(null);
    if (key === "delete") {
      if (confirm(`Delete voucher ${row.code}?`)) {
        setVouchers((prev) => prev.filter((v) => v.id !== row.id));
      }
    } else {
      alert(`Action ${key.toUpperCase()} executed for voucher ${row.code}`);
    }
  };

  const filteredRows = vouchers.filter((r) =>
    search.trim()
      ? [r.project, r.code, r.debit, r.credit, r.comment, r.titleOfWork].some((field) =>
          field.toLowerCase().includes(search.trim().toLowerCase())
        )
      : true
  );

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / entriesPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * entriesPerPage;
  const visibleRows = filteredRows.slice(startIdx, startIdx + entriesPerPage);

  return (
    <div className="w-full max-w-full overflow-x-hidden flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 p-2 text-xs">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2 mb-2 w-full">
        <nav className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium truncate">
          <span className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">Home</span>
          <span>&gt;</span>
          <span className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-0.5">
            Accounts <ChevronDown className="w-3 h-3" />
          </span>
          <span>&gt;</span>
          <span className="text-slate-400 font-normal truncate">Payment Voucher</span>
        </nav>

        <button
          onClick={() => alert("Going back")}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded bg-[#E55353] hover:bg-rose-600 text-white transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          <ArrowLeft className="w-3 h-3" />
          Back
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full flex flex-col gap-2">
        {/* Payment Voucher Input Form */}
        <form
          onSubmit={handleFormSubmit}
          className="bg-white dark:bg-slate-900 rounded shadow-xs border border-slate-200 dark:border-slate-800 p-2.5 space-y-2 w-full"
        >
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full">
            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">Project Type</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Project Type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">Project</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Project</option>
                <option value="Rifat Eyecon City">Rifat Eyecon City</option>
                <option value="Sheba Eyecon Tower">Sheba Eyecon Tower</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">Title/Name of Work</label>
              <select
                value={titleOfWork}
                onChange={(e) => setTitleOfWork(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Title/Name of Work</option>
                <option value="Material Purchase">Material Purchase</option>
                <option value="Labor Bill">Labor Bill</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">If Task</label>
              <select
                value={ifTask}
                onChange={(e) => setIfTask(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Task</option>
                <option value="Foundation">Foundation</option>
                <option value="Casting">Casting</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full">
            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">Site</label>
              <select
                value={site}
                onChange={(e) => setSite(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Site</option>
                <option value="Site A">Site A</option>
                <option value="Site B">Site B</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">Voucher No</label>
              <input
                type="text"
                value={voucherNo}
                onChange={(e) => setVoucherNo(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                Select Accounts<span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1">
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-indigo-500 truncate"
                >
                  <option value="">Select Chart Of Account_id</option>
                  <option value="Riva Steel Mils">Riva Steel Mils</option>
                  <option value="Sagor Kumar">Sagor Kumar</option>
                </select>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="p-1 bg-[#10B981] hover:bg-emerald-600 text-white rounded transition-colors cursor-pointer shrink-0"
                  title="Add Chart of Account"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full">
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                  Payment Method<span className="text-red-500">*</span>
                </label>
                <label className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 cursor-pointer">
                  <span>if Cheque</span>
                  <input
                    type="checkbox"
                    checked={isCheque}
                    onChange={(e) => setIsCheque(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="Bank Check">Bank Check</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">Cheque/Receipt No</label>
              <select
                value={chequeNo}
                onChange={(e) => setChequeNo(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select / type cheque number</option>
                <option value="CHQ-88231">CHQ-88231</option>
                <option value="CHQ-99201">CHQ-99201</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">Comment/Narration</label>
              <input
                type="text"
                placeholder="Enter Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                Amount<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">Select Invoice</label>
              <select
                value={selectInvoice}
                onChange={(e) => setSelectInvoice(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Invoice</option>
                <option value="INV-001">INV-001</option>
                <option value="INV-002">INV-002</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">Select Item</label>
              <select
                value={selectItem}
                onChange={(e) => setSelectItem(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Item</option>
                <option value="Cement">Cement</option>
                <option value="Steel Rod">Steel Rod</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">Attachment</label>
              <div className="flex items-center border border-slate-300 dark:border-slate-800 rounded overflow-hidden bg-white dark:bg-slate-950">
                <label className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-[11px] cursor-pointer border-r border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0 text-slate-700 dark:text-slate-200">
                  Choose File
                  <input
                    type="file"
                    onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                <span className="px-2 text-[10px] text-slate-400 truncate">
                  {attachment ? attachment.name : "No file chosen"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-0.5 flex justify-center">
            <button
              type="submit"
              className="px-5 py-1 bg-[#635BFF] hover:bg-indigo-700 text-white font-semibold text-xs rounded transition-colors cursor-pointer shadow-xs"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Filters & Data Table Box */}
        <div className="bg-white dark:bg-slate-900 rounded shadow-xs border border-slate-200 dark:border-slate-800 p-2 flex flex-col w-full overflow-x-hidden">
          {/* Filter Rows */}
          <div className="space-y-1 mb-1.5 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 w-full">
              <div>
                <label className="block text-[9px] text-slate-500 dark:text-slate-400">Select Date</label>
                <input
                  type="text"
                  readOnly
                  value={filters.dateRange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-1.5 py-0.5 text-[10px] truncate"
                />
              </div>

              <div>
                <label className="block text-[9px] text-slate-500 dark:text-slate-400">Debit Accounts</label>
                <select
                  value={filters.debitAccount}
                  onChange={(e) => setFilters({ ...filters, debitAccount: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-1.5 py-0.5 text-[10px]"
                >
                  <option value="">Select Chart Of Account</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] text-slate-500 dark:text-slate-400">Credit Accounts</label>
                <select
                  value={filters.creditAccount}
                  onChange={(e) => setFilters({ ...filters, creditAccount: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-1.5 py-0.5 text-[10px]"
                >
                  <option value="">Select Chart Of Account</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] text-slate-500 dark:text-slate-400">Select Project</label>
                <select
                  value={filters.project}
                  onChange={(e) => setFilters({ ...filters, project: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-1.5 py-0.5 text-[10px]"
                >
                  <option value="">Select Project</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-1.5 w-full items-end">
              <div className="lg:col-span-4">
                <label className="block text-[9px] text-slate-500 dark:text-slate-400">Title/Name of Work</label>
                <select
                  value={filters.titleOfWork}
                  onChange={(e) => setFilters({ ...filters, titleOfWork: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-1.5 py-0.5 text-[10px]"
                >
                  <option value="">Select Title/Name of Work</option>
                </select>
              </div>

              <div className="lg:col-span-4">
                <label className="block text-[9px] text-slate-500 dark:text-slate-400">Site</label>
                <select
                  value={filters.site}
                  onChange={(e) => setFilters({ ...filters, site: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-1.5 py-0.5 text-[10px]"
                >
                  <option value="">Select Site</option>
                </select>
              </div>

              <div className="lg:col-span-4 flex items-end gap-1">
                <div className="flex-1">
                  <label className="block text-[9px] text-slate-500 dark:text-slate-400">Task</label>
                  <select
                    value={filters.task}
                    onChange={(e) => setFilters({ ...filters, task: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-1.5 py-0.5 text-[10px]"
                  >
                    <option value="">Select Task</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => alert("Export PDF")}
                  className="px-2 py-0.5 bg-[#E55353] hover:bg-rose-600 text-white rounded text-[10px] font-bold shrink-0 flex items-center gap-0.5 cursor-pointer"
                >
                  <FileText className="w-3 h-3" /> PDF
                </button>
                <button
                  type="button"
                  onClick={() => alert("Export Excel")}
                  className="px-2 py-0.5 bg-[#2EB85C] hover:bg-emerald-600 text-white rounded text-[10px] font-bold shrink-0 flex items-center gap-0.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3 h-3" /> Excel
                </button>
              </div>
            </div>
          </div>

          {/* Table Controls */}
          <div className="flex items-center justify-between gap-2 mb-1 text-[10px] w-full">
            <div className="flex items-center gap-1">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-1 py-0.5"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center gap-1">
              <span>Search:</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-1.5 py-0.5 text-[10px] focus:outline-none"
              />
            </div>
          </div>

          {/* Table Container - Auto fit on LG without horizontal scrollbar */}
          <div className="w-full overflow-x-auto lg:overflow-x-visible border border-slate-200 dark:border-slate-800 rounded">
            <table className="w-full table-fixed text-left border-collapse text-[9px] lg:text-[10px]">
              <thead className="bg-[#635BFF] text-white font-semibold uppercase tracking-wider text-[9px]">
                <tr>
                  <th className="w-[3%] px-1 py-1">SL</th>
                  <th className="w-[8%] px-1 py-1">DATE</th>
                  <th className="w-[9%] px-1 py-1">PROJECT</th>
                  <th className="w-[9%] px-1 py-1">TITLE</th>
                  <th className="w-[6%] px-1 py-1">CODE</th>
                  <th className="w-[9%] px-1 py-1">DEBIT</th>
                  <th className="w-[6%] px-1 py-1">CREDIT</th>
                  <th className="w-[6%] px-1 py-1">TOTAL</th>
                  <th className="w-[8%] px-1 py-1">COMMENT</th>
                  <th className="w-[5%] px-1 py-1">CHEQUE</th>
                  <th className="w-[6%] px-1 py-1">ADDED</th>
                  <th className="w-[5%] px-1 py-1">EDITED</th>
                  <th className="w-[7%] px-1 py-1">APPROVE</th>
                  <th className="w-[4%] px-1 py-1 text-center">ATT</th>
                  <th className="w-[5%] px-1 py-1">STATUS</th>
                  <th className="w-[5%] px-1 py-1 text-right pr-1">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {visibleRows.length > 0 ? (
                  visibleRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-1 py-1 truncate">{row.sl}</td>
                      <td className="px-1 py-1 truncate">{row.date}</td>
                      <td className="px-1 py-1 font-medium truncate">{row.project}</td>
                      <td className="px-1 py-1 truncate">{row.titleOfWork}</td>
                      <td className="px-1 py-1 font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {row.code}
                      </td>
                      <td className="px-1 py-1 text-indigo-600 dark:text-indigo-400 font-medium truncate">
                        {row.debit}
                      </td>
                      <td className="px-1 py-1 text-indigo-600 dark:text-indigo-400 font-medium truncate">
                        {row.credit}
                      </td>
                      <td className="px-1 py-1 font-semibold truncate">
                        {row.total.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                      </td>
                      <td className="px-1 py-1 text-slate-500 truncate">{row.comment}</td>
                      <td className="px-1 py-1 text-slate-500 truncate">{row.chequeReceipt}</td>
                      <td className="px-1 py-1 truncate">{row.addedBy}</td>
                      <td className="px-1 py-1 truncate">{row.editedBy}</td>
                      <td className="px-1 py-1 truncate">
                        <div className="space-y-0.5">
                          {row.approval.map((app) => (
                            <span key={app} className="text-emerald-600 dark:text-emerald-400 font-medium block text-[9px] truncate">
                              ✓ {app}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-1 py-1 text-center truncate">{row.attachment}</td>
                      <td className="px-1 py-1 truncate">
                        <span className="px-1 py-0.5 text-[9px] rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-1 py-1 text-right pr-1">
                        <button
                          type="button"
                          onClick={(e) => toggleActionMenu(e, row.id)}
                          className="px-1.5 py-0.5 rounded bg-[#635BFF] hover:bg-indigo-700 text-white font-medium text-[9px] inline-flex items-center gap-0.5 transition-colors cursor-pointer"
                        >
                          Action
                          <ChevronDown className="w-2.5 h-2.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={16} className="px-2 py-3 text-center text-slate-400">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-2 mt-1 pt-0.5 text-[10px] text-slate-500 dark:text-slate-400 w-full">
            <div>
              Showing {filteredRows.length === 0 ? 0 : startIdx + 1} to{" "}
              {startIdx + visibleRows.length} of {filteredRows.length} entries
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-800 disabled:opacity-40 cursor-pointer"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-1.5 py-0.5 rounded ${
                    p === safePage
                      ? "bg-[#635BFF] text-white"
                      : "border border-slate-300 dark:border-slate-800"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-800 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Dropdown Menu */}
      {openActionId !== null && dropdownPos && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpenActionId(null)} />
          <div
            style={{ top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px` }}
            className="fixed z-50 w-32 bg-white dark:bg-slate-800 rounded shadow-lg border border-slate-200 dark:border-slate-700 p-1 space-y-0.5"
          >
            {actionMenuItems.map(({ key, label, icon: Icon, color }) => {
              const targetRow = vouchers.find((r) => r.id === openActionId);
              return (
                <button
                  key={key}
                  onClick={() => targetRow && handleAction(key, targetRow)}
                  className={`w-full flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-medium text-white transition-colors cursor-pointer ${color}`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Modal: Chart Of Account Add */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                Chart Of Account Add
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-0.5 bg-[#E55353] hover:bg-rose-600 text-white rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-3 space-y-2.5">
              <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">Chart of Group</label>
                    <select
                      value={modalGroup}
                      onChange={(e) => setModalGroup(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px]"
                    >
                      <option value="">Select value</option>
                      <option value="Assets">Assets</option>
                      <option value="Expenses">Expenses</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">Chart of Accounts Code</label>
                    <input
                      type="text"
                      placeholder="Accounts Code"
                      value={modalCode}
                      onChange={(e) => setModalCode(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">Chart of Accounts Name</label>
                    <input
                      type="text"
                      placeholder="Accounts Name"
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-0.5">Default Module</label>
                    <select
                      value={modalDefaultModule}
                      onChange={(e) => setModalDefaultModule(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-[11px]"
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1 bg-slate-400 hover:bg-slate-500 text-white text-xs rounded cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-[#635BFF] hover:bg-indigo-700 text-white text-xs rounded cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="flex items-center justify-between text-[9px] text-slate-400 mt-2 pt-1 border-t border-slate-200 dark:border-slate-800">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>
    </div>
  );
}