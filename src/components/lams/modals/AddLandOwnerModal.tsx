"use client";

import React, { useState, useEffect } from "react";
import { X, UserPlus, CheckCircle2 } from "lucide-react";
import { LandOwner, AcquisitionLead } from "@/types/lams";

interface AddLandOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any;
    onAddOwner: (newOwner: LandOwner) => void;
  acquisitionLeads: AcquisitionLead[];
}

export function AddLandOwnerModal({
  isOpen,
  onClose,
  onAddOwner,
    editData,
  acquisitionLeads,
}: AddLandOwnerModalProps) {
  const [code, setCode] = useState(`LW-${Math.floor(1000000 + Math.random() * 9000000)}`);
  const [acquisitionLeadId, setAcquisitionLeadId] = useState(acquisitionLeads[0]?.uuid || "");
  const [ownerName, setOwnerName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [nidNumber, setNidNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [isPrimary, setIsPrimary] = useState(true);

  useEffect(() => {
    if (isOpen && editData) {
      setAcquisitionLeadId(editData.acquisitionLeadId || editData.lead_id || "");
      setOwnerName(editData.ownerName || editData.name || "");
      setFatherName(editData.fatherName || editData.father_name || "");
      setNidNumber(editData.nidNumber || editData.nid_number || "");
      setPhone(editData.phone || editData.contact_number || "");
      setAddress(editData.address || "");
      setRemarks(editData.remarks || "");
      setStatus(editData.status || "Active");
      setIsPrimary(editData.isPrimary ?? (editData.owner_type === "Owner"));
    } else if (isOpen && !editData) {
      const defaultId = acquisitionLeads[0]?.uuid || acquisitionLeads[0]?.id || "";
      if (!acquisitionLeadId || !acquisitionLeads.some((l) => (l.uuid || l.id) === acquisitionLeadId)) {
        setAcquisitionLeadId(defaultId);
      }
    }
  }, [isOpen, editData, acquisitionLeads]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !phone) return;

    const effectiveLeadId = acquisitionLeadId || acquisitionLeads[0]?.uuid || acquisitionLeads[0]?.id || "";
    const matchedLead = acquisitionLeads.find((l) => (l.uuid || l.id) === effectiveLeadId);

    const newRecord: LandOwner = {
      id: `LO-${Date.now()}`,
      uuid: `LO-${Date.now()}`,
      code: code || `LW-${Math.floor(1000000 + Math.random() * 9000000)}`,
      acquisitionLeadId: effectiveLeadId,
      landPlot: matchedLead ? `${matchedLead.dagNo} (${matchedLead.mouza})` : "General Parcel",
      ownerName,
      isPrimary,
      fatherName,
      nidNumber,
      phone,
      address,
      status,
      addedBy: "Sakib Al Hasan",
      remarks,
      ownershipSharePercentage: isPrimary ? 60 : 40,
    };

    onAddOwner(newRecord);
    onClose();
    // Reset
    setOwnerName("");
    setFatherName("");
    setNidNumber("");
    setPhone("");
    setAddress("");
    setRemarks("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Land Owner
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Register primary or co-owner for an acquisition plot
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            {/* Acquisition Lead */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Acquisition Lead <span className="text-rose-500">*</span>
              </label>
              <select
                value={acquisitionLeadId}
                onChange={(e) => setAcquisitionLeadId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30"
              >
                {acquisitionLeads.length > 0 ? (
                  acquisitionLeads.map((lead) => {
                    const lId = lead.uuid || lead.id;
                    return (
                      <option key={lId} value={lId}>
                        {lead.title} {lead.mouza ? `(${lead.mouza})` : ""}
                      </option>
                    );
                  })
                ) : (
                  <option value="">No acquisition leads available</option>
                )}
              </select>
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Owner Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Alhaj M. A. Latif"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            {/* Father Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Father Name
              </label>
              <input
                type="text"
                placeholder="e.g. Late Abdul Gafur Molla"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            {/* NID Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                NID Number
              </label>
              <input
                type="text"
                placeholder="10, 13 or 17 digit NID"
                value={nidNumber}
                onChange={(e) => setNidNumber(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="+880 1711-000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Address
            </label>
            <input
              type="text"
              placeholder="e.g. Village/Road, Thana, District"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>

          {/* Status & Is Primary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Is Primary Owner? <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-5 mt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200 font-medium">
                  <input
                    type="radio"
                    name="isPrimary"
                    checked={isPrimary}
                    onChange={() => setIsPrimary(true)}
                    className="text-cyan-600 focus:ring-cyan-500"
                  />
                  Yes (Primary Owner)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200 font-medium">
                  <input
                    type="radio"
                    name="isPrimary"
                    checked={!isPrimary}
                    onChange={() => setIsPrimary(false)}
                    className="text-cyan-600 focus:ring-cyan-500"
                  />
                  No (Co-Sharer)
                </label>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Remarks
            </label>
            <textarea
              rows={2}
              placeholder="Ownership deed details, succession notes, power of attorney..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-600/20 transition-all"
            >
              Submit Land Owner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
