"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Plus,
  ArrowLeft,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  FileSpreadsheet,
  FileText,
  Paperclip,
  CheckCircle,
  XCircle,
  ArrowUpDown,
} from "lucide-react";

export interface InvoiceItem {
  id: number;
  projectType: string;
  project: string;
  customerName: string;
  code: string;
  ref: string;
  date: string;
  grandTotal: number;
  addedBy: string;
  approve: "Approved" | "Pending" | "Rejected";
  attachment: string | null;
}

export default function InvoiceBillListPage() {
  // Main Mock Data State (API Ready)
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    {
      id: 1,
      projectType: "Building Construction",
      project: "Global Link City",
      customerName: "Rahim Chowdhury",
      code: "INV-2026-001",
      ref: "REF-9921",
      date: "05 Sep, 2026",
      grandTotal: 150000,
      addedBy: "Admin",
      approve: "Approved",
      attachment: "bill_doc.pdf",
    },
    {
      id: 2,
      projectType: "Interior Design",
      project: "Mega Project Phase-2",
      customerName: "Karim Uddin",
      code: "INV-2026-002",
      ref: "REF-9922",
      date: "10 Sep, 2026",
      grandTotal: 85000,
      addedBy: "Manager",
      approve: "Pending",
      attachment: null,
    },
    {
      id: 3,
      projectType: "Electrical Wiring",
      project: "Green Tower",
      customerName: "Apex Real Estate",
      code: "INV-2026-003",
      ref: "REF-9925",
      date: "12 Sep, 2026",
      grandTotal: 420000,
      addedBy: "Admin",
      approve: "Approved",
      attachment: "specs.pdf",
    },
  ]);

  // Controls & Filter States
  const [selectedDateRange, setSelectedDateRange] = useState(
    "1 September, 2026 - 30 September, 2026",
  );
  const [selectedProject, setSelectedProject] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Action Dropdown Control State
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

  // Filter Logic
  const filteredInvoices = invoices.filter((item) => {
    const matchesSearch =
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.addedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProject =
      selectedProject === "" || item.project === selectedProject;

    return matchesSearch && matchesProject;
  });

  // Pagination Logic
  const totalEntries = filteredInvoices.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage) || 1;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedInvoices = filteredInvoices.slice(
    startIndex,
    startIndex + entriesPerPage,
  );

  // Handlers for Actions (API Ready)
  const handleDeleteInvoice = (id: number) => {
    if (confirm("Are you sure you want to delete this bill/invoice?")) {
      console.log("API Delete Request for Invoice ID:", id);
      setInvoices((prev) => prev.filter((item) => item.id !== id));
      setActiveDropdownId(null);
    }
  };

  const handleToggleApproveStatus = (id: number) => {
    setInvoices((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus =
            item.approve === "Approved" ? "Pending" : "Approved";
          console.log(
            "API Status Update for Invoice ID:",
            id,
            "New Status:",
            nextStatus,
          );
          return { ...item, approve: nextStatus };
        }
        return item;
      }),
    );
    setActiveDropdownId(null);
  };

  const handleExportExcel = () => {
    console.log("Exporting to Excel...", filteredInvoices);
    alert("Excel Export triggered!");
  };

  const handleExportPDF = () => {
    console.log("Exporting to PDF...", filteredInvoices);
    alert("PDF Export triggered!");
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 p-3 text-xs flex flex-col justify-between">
      <div>
        {/* Top Header & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <nav className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <Link
              href="/"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Home
            </Link>
            <span>&gt;</span>
            <span className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer">
              Billing <ChevronDown className="w-3 h-3" />
            </span>
            <span>&gt;</span>
            <span className="text-slate-400 font-normal truncate">
              Invoice/Bill List
            </span>
          </nav>

          <div className="flex items-center gap-2">
            {/* Link button for Add Invoice Route */}
            <Link
              href="/dashboard/accounts/billing/bill-invoice/new-bill-invoice"
              className="flex items-center gap-1 px-3 py-1.5 bg-[#635BFF] hover:bg-indigo-700 text-white font-medium rounded transition-colors shadow-xs cursor-pointer text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              New Bill/Invoice
            </Link>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#2D4A43] hover:bg-[#233a34] text-white font-medium rounded transition-colors shadow-xs cursor-pointer text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Previous
            </button>
          </div>
        </div>

        {/* Top Filter Controls (Select Date & Project) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Select Date
            </label>
            <input
              type="text"
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Project
            </label>
            <div className="relative">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 appearance-none shadow-xs"
              >
                <option value="">Select value</option>
                <option value="Global Link City">Global Link City</option>
                <option value="Mega Project Phase-2">
                  Mega Project Phase-2
                </option>
                <option value="Green Tower">Green Tower</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table Export, Entries & Search Controls */}
        <div className="bg-white dark:bg-slate-900 rounded-t border border-b-0 border-slate-200 dark:border-slate-800 p-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleExportExcel}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#107C41] hover:bg-emerald-800 text-white rounded font-medium text-xs transition-colors cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Excel
              </button>
              <button
                type="button"
                onClick={handleExportPDF}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#E84A5F] hover:bg-red-600 text-white rounded font-medium text-xs transition-colors cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                PDF
              </button>
            </div>

            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2 py-0.5 outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 dark:text-slate-400">Search:</span>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder=""
                className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-2.5 py-0.5 outline-none focus:border-indigo-500 w-48"
              />
            </div>
          </div>
        </div>

        {/* Table View (12 Columns with Zero Horizontal Scroll) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <table className="w-full table-fixed text-left border-collapse text-xs">
            <thead className="bg-[#635BFF] text-white font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="w-[4%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    ID <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[10%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    PROJECT TYPE{" "}
                    <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[11%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    PROJECT <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[12%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    CUSTOMER NAME{" "}
                    <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[9%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    CODE <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[8%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    REF <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[9%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    DATE <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[9%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    GRAND TOTAL{" "}
                    <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[8%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    ADDED BY <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[8%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    APPROVE <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[7%] px-2 py-2">
                  <div className="flex items-center justify-between">
                    ATTACHMENT{" "}
                    <ArrowUpDown className="w-2.5 h-2.5 opacity-70" />
                  </div>
                </th>
                <th className="w-[5%] px-1 py-2 text-center">
                  <div className="flex items-center justify-center">ACTION</div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {paginatedInvoices.length > 0 ? (
                paginatedInvoices.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-2 py-2 text-slate-800 dark:text-slate-100">
                      {item.id}
                    </td>
                    <td className="px-2 py-2 text-slate-700 dark:text-slate-300 truncate">
                      {item.projectType}
                    </td>
                    <td className="px-2 py-2 text-slate-700 dark:text-slate-300 truncate">
                      {item.project}
                    </td>
                    <td className="px-2 py-2 text-slate-700 dark:text-slate-300 font-medium truncate">
                      {item.customerName}
                    </td>
                    <td className="px-2 py-2 text-slate-700 dark:text-slate-300 truncate">
                      {item.code}
                    </td>
                    <td className="px-2 py-2 text-slate-700 dark:text-slate-300 truncate">
                      {item.ref}
                    </td>
                    <td className="px-2 py-2 text-slate-700 dark:text-slate-300 truncate">
                      {item.date}
                    </td>
                    <td className="px-2 py-2 text-slate-700 dark:text-slate-300 font-semibold">
                      ৳{item.grandTotal.toLocaleString()}
                    </td>
                    <td className="px-2 py-2 text-slate-700 dark:text-slate-300 truncate">
                      {item.addedBy}
                    </td>
                    <td className="px-2 py-2">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] rounded-full font-medium ${
                          item.approve === "Approved"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                        }`}
                      >
                        {item.approve}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      {item.attachment ? (
                        <a
                          href={`#${item.attachment}`}
                          className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                          title={item.attachment}
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[40px]">View</span>
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Action Dropdown Menu */}
                    <td className="px-1 py-2 text-center relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdownId(
                            activeDropdownId === item.id ? null : item.id,
                          )
                        }
                        className="p-1 rounded bg-[#00B5D8] hover:bg-cyan-600 text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                        title="Action Options"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {activeDropdownId === item.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdownId(null)}
                          />
                          <div className="absolute right-2 mt-1 w-36 bg-white dark:bg-slate-900 rounded-md shadow-lg border border-slate-200 dark:border-slate-800 z-20 py-1 text-left animate-in fade-in zoom-in-95 duration-100">
                            <Link
                              href={`/dashboard/accounts/billing/invoice/view/${item.id}`}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-500" />
                              View Details
                            </Link>

                            <Link
                              href={`/dashboard/accounts/billing/invoice/edit/${item.id}`}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5 text-indigo-500" />
                              Edit Bill
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleToggleApproveStatus(item.id)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs cursor-pointer"
                            >
                              {item.approve === "Approved" ? (
                                <>
                                  <XCircle className="w-3.5 h-3.5 text-amber-500" />
                                  Make Pending
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                  Approve
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteInvoice(item.id)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs cursor-pointer border-t border-slate-100 dark:border-slate-800"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty State Output (Matching Image 11_2.PNG) */
                <tr>
                  <td
                    colSpan={12}
                    className="px-3 py-4 text-center text-slate-500 dark:text-slate-400 font-medium"
                  >
                    No data available in table
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-white dark:bg-slate-900 rounded-b border border-t-0 border-slate-200 dark:border-slate-800 p-2.5 flex items-center justify-between text-slate-500 dark:text-slate-400 mb-4">
          <div>
            Showing {totalEntries > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(startIndex + entriesPerPage, totalEntries)} of{" "}
            {totalEntries} entries
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-xs ${
                currentPage === 1
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  currentPage === page
                    ? "bg-[#635BFF] text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalEntries === 0}
              className={`px-3 py-1 rounded text-xs ${
                currentPage === totalPages || totalEntries === 0
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Page Footer Branding */}
      <footer className="flex items-center justify-between text-[9px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div>2026 © Somikoron IT LTD</div>
        <div>Design &amp; Developed by Somikoron IT LTD</div>
      </footer>
    </div>
  );
}
