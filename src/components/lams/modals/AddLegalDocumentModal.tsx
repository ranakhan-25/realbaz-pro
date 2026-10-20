"use client";

import React, { useState, useEffect } from "react";
import { X, FileUp, UploadCloud, CheckCircle } from "lucide-react";
import { LegalDocument, AcquisitionLead, VerificationStatus } from "@/types/lams";

interface AddLegalDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any;
    onAddDocument: (doc: LegalDocument) => void;
  acquisitionLeads: AcquisitionLead[];
}

const DOC_TYPES = [
  "Baya Deed (মূল বায়না দলিল)",
  "CS Parcha & Map (সিএস পর্চা ও নকশা)",
  "SA Parcha (এসএ পর্চা)",
  "RS Parcha & Sheet (আরএস পর্চা)",
  "BS Khatian (বিএস খতিয়ান)",
  "Mutation & DCR (নামজারি ও ডিসিআর)",
  "Non-Encumbrance Certificate (NEC - নির্দায় সনদ)",
  "Power of Attorney (আমমোক্তারনামা)",
  "Succession Certificate (ওয়ারিশান সনদ)",
  "Land Tax Receipt (খাজনা দাখিলা)",
];

const STATUSES: VerificationStatus[] = [
  "Verified",
  "Under Review",
  "Discrepancy Found",
  "Pending",
];

export function AddLegalDocumentModal({
  isOpen,
  onClose,
  onAddDocument,
    editData,
  acquisitionLeads,
}: AddLegalDocumentModalProps) {
  const [acquisitionLeadId, setAcquisitionLeadId] = useState(acquisitionLeads[0]?.uuid || "");
  const [documentType, setDocumentType] = useState(DOC_TYPES[0]);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("Pending");
  const [documentFileName, setDocumentFileName] = useState("deed_scan_copy.pdf");
  const [verifiedBy, setVerifiedBy] = useState("Adv. K. M. Saifuddin");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (isOpen && editData) {
      setAcquisitionLeadId(editData.acquisitionLeadId || editData.lead_id || "");
      setDocumentType(editData.documentType || editData.document_type || "Deed");
      setDocumentFileName(editData.documentFileName || editData.document_number || "");
      setVerificationStatus(editData.verificationStatus || editData.verification_status || "Pending");
      setRemarks(editData.remarks || editData.vetting_remarks || "");
    } else if (isOpen && !editData) {
      const defaultId = acquisitionLeads[0]?.uuid || acquisitionLeads[0]?.id || "";
      if (!acquisitionLeadId || !acquisitionLeads.some((l) => (l.uuid || l.id) === acquisitionLeadId)) {
        setAcquisitionLeadId(defaultId);
      }
    }
  }, [isOpen, editData, acquisitionLeads]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveLeadId = acquisitionLeadId || acquisitionLeads[0]?.uuid || acquisitionLeads[0]?.id || "";
    const lead = acquisitionLeads.find((l) => (l.uuid || l.id) === effectiveLeadId) || acquisitionLeads[0];

    const newDoc: LegalDocument = {
      id: `DOC-${Date.now()}`,
      uuid: `DOC-${Date.now()}`,
      acquisitionLeadId: effectiveLeadId,
      leadTitle: lead ? lead.title : "Acquisition Parcel",
      documentType,
      verificationStatus,
      documentFileName: documentFileName || "legal_document.pdf",
      fileSize: "3.5 MB",
      verifiedBy,
      verificationDate: verificationStatus === "Verified" ? new Date().toISOString().split("T")[0] : undefined,
      remarks,
    };

    onAddDocument(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Upload & Register Legal Document
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Attach title deeds, parchas, or mutation papers for verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form (matches screenshot legal-documen1.jpg) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* Acquisition Lead */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Acquisition Lead <span className="text-rose-500">*</span>
            </label>
            <select
              value={acquisitionLeadId}
              onChange={(e) => setAcquisitionLeadId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {acquisitionLeads.length > 0 ? (
                acquisitionLeads.map((l) => {
                  const lId = l.uuid || l.id;
                  return (
                    <option key={lId} value={lId}>
                      {l.title} {l.mouza ? `(${l.mouza})` : ""}
                    </option>
                  );
                })
              ) : (
                <option value="">No acquisition leads available</option>
              )}
            </select>
          </div>

          {/* Document Type */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Document Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {DOC_TYPES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Verification Status & Verified By */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Verification Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value as VerificationStatus)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Verified By Legal Officer
              </label>
              <input
                type="text"
                value={verifiedBy}
                onChange={(e) => setVerifiedBy(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Document File upload box */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Document File <span className="text-rose-500">*</span>
            </label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <UploadCloud className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mx-auto mb-1.5" />
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {documentFileName ? documentFileName : "Click or drag PDF / image file here"}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Supported formats: PDF, JPG, PNG up to 25MB
              </p>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Verification Remarks / Chain of Title Notes
            </label>
            <textarea
              rows={2}
              placeholder="Record room volume #, book #, deed dating notes, portal verification..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-600/20"
            >
              Submit Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
