"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  FileUp,
  FileText,
  FileCheck2,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  Minus,
} from "lucide-react";
import { LegalDocument, AcquisitionLead, VerificationStatus } from "@/types/lams";
import { AddLegalDocumentModal } from "./modals/AddLegalDocumentModal";

interface LegalDocumentsViewProps {
  documents: LegalDocument[];
  onEditDocument?: (uuid: string, data: any) => void;
  onAddDocument: (doc: LegalDocument) => void;
  onDeleteDocument: (uuid: string) => void;
  acquisitionLeads: AcquisitionLead[];
}

const STATUS_BADGES: Record<
  VerificationStatus,
  { bg: string; text: string; icon: React.ElementType }
> = {
  Verified: {
    bg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    text: "text-emerald-700",
    icon: CheckCircle2,
  },
  "Under Review": {
    bg: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    text: "text-blue-700",
    icon: Clock,
  },
  "Discrepancy Found": {
    bg: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
    text: "text-rose-700",
    icon: AlertCircle,
  },
  Pending: {
    bg: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    text: "text-amber-700",
    icon: Clock,
  },
};

export function LegalDocumentsView({
  documents,
  onAddDocument,
    onEditDocument,
  onDeleteDocument,
  acquisitionLeads,
}: LegalDocumentsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<any>(null);

  const filteredDocs = useMemo(() => {
    const safeDocs = Array.isArray(documents) ? documents : [];
    return safeDocs.filter((doc) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        (doc.leadTitle || "").toLowerCase().includes(term) ||
        (doc.documentType || "").toLowerCase().includes(term) ||
        (doc.documentFileName || "").toLowerCase().includes(term) ||
        (doc.verifiedBy || "").toLowerCase().includes(term);

      const matchesStatus = statusFilter === "ALL" || doc.verificationStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [documents, searchTerm, statusFilter]);

  const displayedDocs = filteredDocs.slice(0, entriesPerPage);

  const toggleExpand = (uuid: string) => {
    setExpandedId((prev) => (prev === uuid ? null : uuid));
  };

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-bold"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Verification:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-medium"
            >
              <option value="ALL">All Verification Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Under Review">Under Review</option>
              <option value="Discrepancy Found">Discrepancy Found</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search deeds, parcha, verified by..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-600/20 whitespace-nowrap transition-all"
          >
            <FileUp className="w-4 h-4" />
            <span>+ Legal Document Add</span>
          </button>
        </div>
      </div>

      {/* Modernized Table (Transformed from screenshot legal-documen.jpg) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 w-12 text-center">SL</th>
                <th className="py-3 px-3.5">Acquisition Lead</th>
                <th className="py-3 px-3.5">Document Type</th>
                <th className="py-3 px-3.5">Document File</th>
                <th className="py-3 px-3.5 text-center">Verification Status</th>
                <th className="py-3 px-3.5">Verified By</th>
                <th className="py-3 px-3.5">Date</th>
                <th className="py-3 px-3.5">Remarks</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedDocs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No legal documents found. Click "+ Legal Document Add" to upload one.
                  </td>
                </tr>
              ) : (
                displayedDocs.map((doc, idx) => {
                  const isExpanded = expandedId === doc.uuid;
                  const statusInfo = STATUS_BADGES[doc.verificationStatus as VerificationStatus] || { bg: "bg-slate-100 text-slate-800", text: "text-slate-700", icon: AlertCircle };
                  const StatusIcon = statusInfo.icon;

                  return (
                    <React.Fragment key={doc.uuid}>
                      <tr
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                          isExpanded ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => toggleExpand(doc.uuid || doc.id)}
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition-all font-bold"
                            title={isExpanded ? "Collapse" : "Expand"}
                          >
                            {isExpanded ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          </button>
                        </td>

                        <td className="py-3 px-3.5">
                          <p className="font-bold text-slate-900 dark:text-white">{doc.leadTitle}</p>
                          <p className="text-[10px] text-slate-400">ID: {doc.acquisitionLeadId}</p>
                        </td>

                        <td className="py-3 px-3.5 font-semibold text-slate-800 dark:text-slate-200">
                          {doc.documentType}
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono hover:bg-cyan-50 dark:hover:bg-slate-700 transition-all cursor-pointer">
                            <FileText className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                            <span className="truncate max-w-[130px]" title={doc.documentFileName}>
                              {doc.documentFileName}
                            </span>
                            <Download className="w-3 h-3 text-slate-400 hover:text-cyan-600" />
                          </div>
                        </td>

                        <td className="py-3 px-3.5 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusInfo.bg}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {doc.verificationStatus}
                          </span>
                        </td>

                        <td className="py-3 px-3.5 font-medium text-slate-700 dark:text-slate-300">
                          {doc.verifiedBy}
                        </td>

                        <td className="py-3 px-3.5 text-slate-500">
                          {doc.verificationDate || "—"}
                        </td>

                        <td className="py-3 px-3.5 text-slate-600 dark:text-slate-400 max-w-[200px] truncate" title={doc.remarks}>
                          {doc.remarks}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <button
                              onClick={() => setEditingDocument(doc)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all"
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <button
                              onClick={() => onDeleteDocument(doc.uuid || doc.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                              title="Delete Document"
                            >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>

                      {/* Expandable row */}
                      {isExpanded && (
                        <tr className="bg-indigo-50/20 dark:bg-indigo-950/10">
                          <td colSpan={9} className="p-4 border-y border-indigo-200/60 dark:border-indigo-900/40">
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-indigo-200/60 dark:border-indigo-800/40 shadow-xs space-y-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Complete Legal Vetting Report & Notes
                              </p>
                              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                                {doc.remarks}
                              </p>
                              <div className="flex items-center gap-4 pt-2 text-[11px] text-slate-500">
                                <span>File: <strong className="text-slate-700 dark:text-slate-300 font-mono">{doc.documentFileName}</strong> ({doc.fileSize})</span>
                                <span>Counsel: <strong className="text-slate-700 dark:text-slate-300">{doc.verifiedBy}</strong></span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs text-slate-500">
          <div>
            Showing 1 to {Math.min(displayedDocs.length, filteredDocs.length)} of {filteredDocs.length} entries
          </div>

          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <button
              disabled
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 opacity-50 cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold shadow-xs">
              1
            </span>
            <button
              disabled
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 opacity-50 cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <AddLegalDocumentModal
        isOpen={isAddModalOpen || !!editingDocument}
        onClose={() => { setIsAddModalOpen(false); setEditingDocument(null); }}
        onAddDocument={(data) => {
          if (editingDocument && onEditDocument) {
            onEditDocument(editingDocument.uuid, data);
          } else {
            onAddDocument(data);
          }
          setIsAddModalOpen(false);
          setEditingDocument(null);
        }}
        editData={editingDocument}
        acquisitionLeads={acquisitionLeads}
      />
    </div>
  );
}
